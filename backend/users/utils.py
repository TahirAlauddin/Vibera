from django.conf import settings
from django.core.mail import send_mail
from .models import EmailOTP


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

    
def send_otp_email(user, otp_code: str) -> bool:
    """
    Send OTP code to user's email.
    Returns True if sent successfully, False otherwise.
    """
    subject = f"Your Vibera verification code: {otp_code}"
    message = (
        f"Hi {user.first_name or user.username},\n\n"
        f"Your verification code is:\n\n"
        f"    {otp_code}\n\n"
        f"This code expires in {getattr(settings, 'OTP_EXPIRY_MINUTES', 10)} minutes.\n\n"
        f"If you didn't request this code, please ignore this email.\n\n"
        f"— Vibera Team"
    )

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return True
    except Exception:
        return False


def create_and_send_otp(user) -> tuple:
    """
    Create OTP and send to user's email.
    Returns (otp_instance, success_bool).
    """
    ttl_minutes = getattr(settings, "OTP_EXPIRY_MINUTES", 10)
    otp, raw_code = EmailOTP.create_otp(user=user, ttl_minutes=ttl_minutes)
    success = send_otp_email(user=user, otp_code=raw_code)
    return otp, success


def verify_user_otp(user, otp_code: str) -> tuple:
    """
    Verify user's OTP code.
    Returns (success_bool, error_message or None).
    """
    max_attempts = getattr(settings, "OTP_MAX_ATTEMPTS", 3)

    # Get the latest unused OTP for this user
    otp = (
        EmailOTP.objects.filter(user=user, is_used=False)
        .order_by("-created_at")
        .first()
    )

    if not otp:
        return False, "No active OTP found. Please request a new code."

    if otp.is_expired():
        return False, "OTP has expired. Please request a new code."

    if otp.attempts >= max_attempts:
        return False, "Maximum attempts exceeded. Please request a new code."

    if otp.verify(otp_code, max_attempts=max_attempts):
        return True, None
    else:
        remaining = max_attempts - otp.attempts
        if remaining > 0:
            return False, f"Invalid OTP. {remaining} attempt(s) remaining."
        else:
            return False, "Maximum attempts exceeded. Please request a new code."
