from datetime import timedelta
from django.db import models
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
    is_2fa_enabled = models.BooleanField(default=True)  # 2FA enabled by default
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
    """
    Model to store email-based OTP codes for 2FA authentication.
    No external libraries required.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="email_otps",
    )
    hashed_code = models.CharField(max_length=128)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    attempts = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "is_used"]),
            models.Index(fields=["expires_at"]),
        ]
        ordering = ["-created_at"]
        verbose_name = "Email OTP"
        verbose_name_plural = "Email OTPs"

    def set_code(self, raw_code: str) -> None:
        """Hash and store the OTP code."""
        self.hashed_code = make_password(raw_code)

    def check_code(self, raw_code: str) -> bool:
        """Verify a raw OTP against the stored hash."""
        return check_password(raw_code, self.hashed_code)

    def is_expired(self) -> bool:
        """Check whether the OTP has expired."""
        return timezone.now() >= self.expires_at

    @classmethod
    def create_otp(cls, user, ttl_minutes: int = 10):
        """
        Create a new OTP for the user.
        Invalidates any previous unused OTPs.
        Returns (otp_instance, raw_code).
        """
        import secrets

        # Invalidate previous unused OTPs
        cls.objects.filter(user=user, is_used=False).update(is_used=True)

        # Generate 6-digit OTP
        raw_code = "".join(secrets.choice("0123456789") for _ in range(6))

        # Create new OTP
        expires_at = timezone.now() + timedelta(minutes=ttl_minutes)
        otp = cls(user=user, expires_at=expires_at)
        otp.set_code(raw_code)
        otp.save()

        return otp, raw_code

    def verify(self, raw_code: str, max_attempts: int = 3) -> bool:
        """
        Verify the OTP code.
        Returns True if valid, False otherwise.
        Handles expiration and attempt limits.
        """
        if self.is_used:
            return False

        if self.is_expired():
            return False

        if self.attempts >= max_attempts:
            return False

        if self.check_code(raw_code):
            self.is_used = True
            self.save(update_fields=["is_used"])
            return True
        else:
            self.attempts += 1
            self.save(update_fields=["attempts"])
            return False


class UserProfile(models.Model):
    """
    Extended user profile information separate from authentication data.
    Stores additional user details like avatar and bio.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    followers_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)
    preferred_moods = models.JSONField(
        default=None,
        blank=True,
        null=True,
        help_text="Array of preferred mood emojis. If empty or null, all moods are preferred.",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username}'s Profile"

    def get_preferred_moods(self):
        """
        Get the user's preferred moods, or return all available moods if not set.
        Returns a list of emoji strings.
        """
        if self.preferred_moods and len(self.preferred_moods) > 0:
            return self.preferred_moods
        # Return all available mood emojis as default
        # Import here to avoid circular imports
        from moods.models import Mood
        return [emoji for emoji, _ in Mood.MOOD_CHOICES]
