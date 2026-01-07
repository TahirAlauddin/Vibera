from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django_otp.plugins.otp_email.models import EmailDevice


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
    POST /api/users/auth/2fa/step1/

    Request body:
        {
            "username": "string",
            "password": "string"
        }

    Response:
        {
            "success": true,
            "message": "OTP sent to your email",
            "email_hint": "***@example.com"
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

        # Get user's 2FA device
        device = EmailDevice.objects.filter(user=user, confirmed=True).first()

        if not device:
            return Response(
                {
                    "success": False,
                    "error": "2FA device not configured. Please contact support.",
                },
                status=400,
            )

        # Send OTP email
        device.generate_challenge()
        request.session["pending_2fa_user"] = user.id

        return Response(
            {
                "success": True,
                "message": "OTP sent to your email",
                "email_hint": mask_email(user.email),
            }
        )


class LoginStep2View(APIView):
    """
    Step 2: Verify OTP → Return JWT tokens
    POST /api/users/auth/2fa/step2/

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
                status=400,
            )

        try:
            user = User.objects.get(id=pending_user_id)
        except User.DoesNotExist:
            return Response({"success": False, "error": "User not found"}, status=400)

        device = EmailDevice.objects.filter(user=user, confirmed=True).first()

        if not device:
            return Response(
                {"success": False, "error": "2FA device not found"}, status=400
            )

        if device.verify_token(token):
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
            return Response(
                {"success": False, "error": "Invalid or expired OTP"}, status=400
            )


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

        device = EmailDevice.objects.filter(user=user, confirmed=True).first()

        if not device:
            return Response(
                {"success": False, "error": "2FA device not found"}, status=400
            )

        # Resend OTP
        device.generate_challenge()

        return Response(
            {
                "success": True,
                "message": "OTP sent to your email",
                "email_hint": mask_email(user.email),
            }
        )
