from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .utils import create_and_send_otp, verify_user_otp


User = get_user_model()


def mask_email(email: str) -> str:
    """
    Mask email for display: john.doe@example.com → joh***@example.com
    """
    if not email or "@" not in email:
        return "***"

    local, domain = email.split("@", 1)
    if len(local) <= 2:
        masked_local = local[0] + "***"
    else:
        masked_local = local[:3] + "***"

    return f"{masked_local}@{domain}"


class LoginStep1View(APIView):
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


class LoginStep2View(APIView):
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


class ResendOTPView(APIView):
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
