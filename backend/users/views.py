from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .utils import create_and_send_otp, verify_user_otp, mask_email
from .models import UserProfile
from .serializers import UserProfileSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

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


class UserProfileView(APIView):
    """
    Get or update the authenticated user's profile
    GET /api/users/profile/
    PUT /api/users/profile/
    PATCH /api/users/profile/
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve the authenticated user's profile"""
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "Profile does not exist"}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def _update_profile(self, request, partial=False):
        """Helper method to handle profile updates"""
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "Profile does not exist"}, status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = UserProfileSerializer(profile, data=request.data, partial=partial)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """Update the authenticated user's profile (full update)"""
        return self._update_profile(request, partial=False)

    def patch(self, request):
        """Partially update the authenticated user's profile"""
        return self._update_profile(request, partial=True)


class UserProfileDetailView(APIView):
    """
    Get a user's profile by user ID
    GET /api/users/profile/<user_id>/
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        """Retrieve a user's profile by user ID"""
        try:
            profile = UserProfile.objects.select_related("user").get(user_id=user_id)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "Profile does not exist"}, status=status.HTTP_404_NOT_FOUND
            )
