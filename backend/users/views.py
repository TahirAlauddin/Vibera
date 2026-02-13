import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status, viewsets
from rest_framework.decorators import action
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .utils import create_and_send_otp, verify_user_otp, mask_email
from .models import UserProfile
from .serializers import UserProfileSerializer

User = get_user_model()


class OtpRequestView(APIView):
    """
    Step 1: Username + Password → Send OTP
    POST /api/users/auth/2fa/login/

    Request body:
        {
            "username": "string",
            "password": "string"
        }

    Response:
        {
            "success": true,
            "message": "OTP sent to your email",
            "email_hint": "joh***@example.com"
        }
    """

    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"success": False, "error": "Username and password are required"},
                status=400,
            )

        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response(
                {"success": False, "error": "Invalid credentials"}, status=401
            )

        if not user.is_2fa_enabled:
            # 2FA not enabled, return JWT tokens directly
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "success": True,
                    "requires_2fa": False,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }
            )

        # 2FA enabled, send OTP
        otp, email_sent = create_and_send_otp(user=user)

        if not email_sent:
            return Response(
                {
                    "success": False,
                    "error": "Failed to send OTP email. Please try again.",
                },
                status=500,
            )

        request.session["pending_2fa_user"] = user.id

        return Response(
            {
                "success": True,
                "requires_2fa": True,
                "message": "OTP sent to your email",
                "email_hint": mask_email(user.email),
            }
        )


class OtpVerifyView(APIView):
    """
    Step 2: Verify OTP → Return JWT tokens
    POST /api/users/auth/2fa/verify/

    Request body:
        {
            "token": "123456"
        }

    Response (success):
        {
            "success": true,
            "access": "jwt_access_token",
            "refresh": "jwt_refresh_token"
        }
    """

    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")

        if not token:
            return Response(
                {"success": False, "error": "OTP token is required"}, status=400
            )

        pending_user_id = request.session.get("pending_2fa_user")
        if not pending_user_id:
            return Response(
                {"success": False, "error": "Session expired. Please login again."},
                status=408,
            )

        try:
            user = User.objects.get(id=pending_user_id)
        except User.DoesNotExist:
            return Response({"success": False, "error": "User not found"}, status=400)

        # Verify OTP
        success, error_message = verify_user_otp(user=user, otp_code=token)

        if success:
            # OTP valid, clear session and return JWT tokens
            del request.session["pending_2fa_user"]
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "success": True,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }
            )
        else:
            return Response({"success": False, "error": error_message}, status=400)


class OtpResendView(APIView):
    """
    Resend OTP to user's email
    POST /api/users/auth/2fa/resend/

    Response:
        {
            "success": true,
            "message": "OTP sent to your email"
        }
    """

    permission_classes = [AllowAny]

    def post(self, request):
        pending_user_id = request.session.get("pending_2fa_user")
        if not pending_user_id:
            return Response(
                {"success": False, "error": "Session expired. Please login again."},
                status=400,
            )

        try:
            user = User.objects.get(id=pending_user_id)
        except User.DoesNotExist:
            return Response({"success": False, "error": "User not found"}, status=400)

        # Resend OTP
        otp, email_sent = create_and_send_otp(user=user)

        if not email_sent:
            return Response(
                {
                    "success": False,
                    "error": "Failed to send OTP email. Please try again.",
                },
                status=500,
            )

        return Response(
            {
                "success": True,
                "message": "OTP sent to your email",
                "email_hint": mask_email(user.email),
            }
        )


class GoogleSocialAuthView(APIView):
    """
    Exchange Google ID token for JWT (get or create user).
    POST /api/auth/social/google/

    Request body:
        {
            "id_token": "google_id_token_string"
        }

    Response (success):
        {
            "access": "jwt_access_token",
            "refresh": "jwt_refresh_token"
        }
    """

    permission_classes = [AllowAny]

    def post(self, request):
        id_token_str = request.data.get("id_token")
        if not id_token_str:
            return Response(
                {"error": "id_token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client_id = getattr(
            settings, "GOOGLE_OAUTH2_CLIENT_ID", os.getenv("GOOGLE_OAUTH2_CLIENT_ID")
        )
        if not client_id:
            return Response(
                {"error": "Google OAuth2 client ID not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            idinfo = id_token.verify_oauth2_token(
                id_token_str, google_requests.Request(), client_id
            )
        except ValueError as e:
            return Response(
                {"error": "Invalid or expired Google token"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        email = idinfo.get("email")
        if not email:
            return Response(
                {"error": "Email not provided by Google"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = User.objects.normalize_email(email)
        name = idinfo.get("name") or ""
        first_name = (name.split() or [""])[0] if name else ""

        user = User.objects.filter(email=email).first()
        if user is None:
            base_username = email.split("@")[0].lower()[:50]
            base_username = "".join(c for c in base_username if c.isalnum() or c == "_")
            base_username = base_username or "user"
            username = base_username
            counter = 0
            while User.objects.filter(username=username).exists():
                counter += 1
                username = f"{base_username}{counter}"[:50]
            user = User.objects.create_user(
                email=email,
                username=username,
                first_name=first_name or None,
                password=os.urandom(24).hex(),
            )
            user.set_unusable_password()
            user.save(update_fields=["password"])

        if not user.is_active:
            return Response(
                {"error": "User account is disabled"},
                status=status.HTTP_403_FORBIDDEN,
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user profiles.

    list:      GET /api/users/profiles/
    retrieve:  GET /api/users/profiles/<user_id>/
    me:        GET /api/users/profiles/me/
    me:        PUT /api/users/profiles/me/
    me:        PATCH /api/users/profiles/me/
    """

    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "user_id"

    def get_queryset(self):
        return UserProfile.objects.select_related("user")

    @action(detail=False, methods=["get", "put", "patch"])
    def me(self, request):
        """Get or update the authenticated user's profile"""
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "Profile does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        if request.method in ("PUT", "PATCH"):
            partial = request.method == "PATCH"
            serializer = self.get_serializer(
                profile, data=request.data, partial=partial
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # GET
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
