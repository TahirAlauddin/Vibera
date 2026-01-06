import secrets
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from .models import EmailOTP


def generate_otp(length: int = 6) -> str:
    """
    Generate a cryptographically secure numeric OTP.
    """
    return "".join(secrets.choice("0123456789") for _ in range(length))


def create_and_send_otp(*, user, purpose: str) -> EmailOTP:
    """
    Generate OTP, save to database, and send via email.
    Returns the created EmailOTP instance.
    """
    raw_code = generate_otp()
    ttl_minutes = getattr(settings, "OTP_EXPIRY_MINUTES", 10)

    # Create OTP record (invalidates previous OTPs for same user+purpose)
    otp = EmailOTP.create_otp(
        user=user,
        raw_code=raw_code,
        purpose=purpose,
        ttl_minutes=ttl_minutes,
    )

    # Send email
    send_otp_email(user=user, otp_code=raw_code, purpose=purpose)

    return otp


def send_otp_email(*, user, otp_code: str, purpose: str) -> None:
    """
    Send OTP code to user's email.
    """
    purpose_labels = {
        EmailOTP.Purpose.LOGIN: "login verification",
        EmailOTP.Purpose.ENABLE_2FA: "enable two-factor authentication",
        EmailOTP.Purpose.DISABLE_2FA: "disable two-factor authentication",
    }
    purpose_label = purpose_labels.get(purpose, "verification")
    expiry_minutes = getattr(settings, "OTP_EXPIRY_MINUTES", 10)

    subject = f"Your Vibera verification code: {otp_code}"
    message = (
        f"Hi {user.first_name or user.username},\n\n"
        f"Your verification code for {purpose_label} is:\n\n"
        f"    {otp_code}\n\n"
        f"This code expires in {expiry_minutes} minutes.\n\n"
        f"If you didn't request this code, please ignore this email.\n\n"
        f"— Vibera Team"
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


class OTPVerificationError(Exception):
    """Base exception for OTP verification failures."""

    pass


class OTPExpiredError(OTPVerificationError):
    """Raised when OTP has expired."""

    pass


class OTPInvalidError(OTPVerificationError):
    """Raised when OTP code is incorrect."""

    pass


class OTPMaxAttemptsError(OTPVerificationError):
    """Raised when max verification attempts exceeded."""

    pass


class OTPNotFoundError(OTPVerificationError):
    """Raised when no valid OTP exists for user+purpose."""

    pass


def verify_otp(*, user, purpose: str, otp_code: str) -> EmailOTP:
    """
    Verify an OTP code for a user and purpose.

    Returns the OTP instance if valid.
    Raises appropriate OTPVerificationError subclass on failure.
    """
    max_attempts = getattr(settings, "OTP_MAX_ATTEMPTS", 3)

    # Find the latest unused OTP for this user and purpose
    otp = (
        EmailOTP.objects.filter(
            user=user,
            purpose=purpose,
            is_used=False,
        )
        .order_by("-created_at")
        .first()
    )

    if not otp:
        raise OTPNotFoundError("No active OTP found. Please request a new code.")

    # Check if max attempts exceeded
    if otp.attempts >= max_attempts:
        raise OTPMaxAttemptsError(
            "Maximum verification attempts exceeded. Please request a new code."
        )

    # Check expiration
    if otp.is_expired():
        raise OTPExpiredError("OTP has expired. Please request a new code.")

    # Verify the code
    if not otp.check_code(otp_code):
        # Increment attempt counter
        otp.attempts += 1
        otp.save(update_fields=["attempts"])

        remaining = max_attempts - otp.attempts
        if remaining > 0:
            raise OTPInvalidError(f"Invalid OTP. {remaining} attempt(s) remaining.")
        else:
            raise OTPMaxAttemptsError(
                "Maximum verification attempts exceeded. Please request a new code."
            )

    # Mark OTP as used
    otp.is_used = True
    otp.save(update_fields=["is_used"])

    # Update user's last OTP verification timestamp
    user.last_otp_verified_at = timezone.now()
    user.save(update_fields=["last_otp_verified_at"])

    return otp


def invalidate_user_otps(*, user, purpose: str = None) -> int:
    """
    Invalidate all unused OTPs for a user.
    filter by purpose.
    Returns count of invalidated OTPs.
    """
    queryset = EmailOTP.objects.filter(user=user, is_used=False)
    if purpose:
        queryset = queryset.filter(purpose=purpose)
    return queryset.update(is_used=True)
