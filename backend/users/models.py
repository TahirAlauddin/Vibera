from datetime import timedelta
from django.db import models, transaction
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True)
    username = models.CharField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_2fa_enabled = models.BooleanField(default=False)
    last_otp_verified_at = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    objects = UserManager()

    def __str__(self):
        return self.email

    class Meta:
        ordering = ["-date_joined"]
        verbose_name = "User"
        verbose_name_plural = "Users"


class EmailOTP(models.Model):
    class Purpose(models.TextChoices):
        LOGIN = "LOGIN", "Login"
        ENABLE_2FA = "ENABLE_2FA", "Enable 2FA"
        DISABLE_2FA = "DISABLE_2FA", "Disable 2FA"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="email_otps",
    )
    hashed_code = models.CharField(max_length=128)
    purpose = models.CharField(
        max_length=20,
        choices=Purpose.choices,
    )
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    attempts = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "purpose", "is_used"]),
            models.Index(fields=["expires_at"]),
        ]
        ordering = ["-created_at"]

    def set_code(self, raw_code: str) -> None:
        """
        Hash and store the OTP code.
        """
        self.hashed_code = make_password(raw_code)

    def check_code(self, raw_code: str) -> bool:
        """
        Verify a raw OTP against the stored hash.
        """
        return check_password(raw_code, self.hashed_code)

    def is_expired(self) -> bool:
        """
        Check whether the OTP has expired.
        """
        return timezone.now() >= self.expires_at

    @classmethod
    def create_otp(cls, *, user, raw_code: str, purpose: str, ttl_minutes: int):
        """
        Atomically invalidate previous OTPs for the same user + purpose
        and create a new OTP.
        """
        expires_at = timezone.now() + timedelta(minutes=ttl_minutes)

        # Atomically invalidate any previous unused OTPs for the user and purpose
        with transaction.atomic():
            cls.objects.filter(
                user=user,
                purpose=purpose,
                is_used=False,
            ).update(is_used=True)

            # Create new OTP instance with provided details
            otp = cls(
                user=user,
                purpose=purpose,
                expires_at=expires_at,
            )
            # Hash and set the OTP code
            otp.set_code(raw_code)
            otp.save()

        # Return the newly created OTP object
        return otp
