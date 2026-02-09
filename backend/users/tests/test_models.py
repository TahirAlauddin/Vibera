"""
Tests for Users app models.

Tests cover:
- User model (custom user with email, username, 2FA)
- EmailOTP model (OTP generation, verification, expiration)
- UserProfile model (extended user profile)
"""

import pytest
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from users.models import EmailOTP, UserProfile

User = get_user_model()


# =============================================================================
# User Model Tests
# =============================================================================


@pytest.mark.django_db
class TestUserModel:
    """Tests for the custom User model."""

    def test_create_user(self):
        """Test creating a regular user."""
        user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

        assert user.pk is not None
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.is_active is True
        assert user.is_staff is False
        assert user.is_superuser is False

    def test_create_user_with_names(self):
        """Test creating a user with first and last name."""
        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            first_name="John",
            last_name="Doe",
        )

        assert user.first_name == "John"
        assert user.last_name == "Doe"

    def test_create_superuser(self):
        """Test creating a superuser."""
        admin = User.objects.create_superuser(
            username="admin", email="admin@example.com", password="adminpass123"
        )

        assert admin.is_staff is True
        assert admin.is_superuser is True

    def test_user_str_representation(self):
        """Test __str__ returns email."""
        user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

        assert str(user) == "test@example.com"

    def test_user_email_unique(self):
        """Test that email must be unique."""
        User.objects.create_user(
            username="user1", email="same@example.com", password="pass123"
        )

        with pytest.raises(Exception):  # IntegrityError
            User.objects.create_user(
                username="user2", email="same@example.com", password="pass123"
            )

    def test_user_username_unique(self):
        """Test that username must be unique."""
        User.objects.create_user(
            username="sameuser", email="user1@example.com", password="pass123"
        )

        with pytest.raises(Exception):  # IntegrityError
            User.objects.create_user(
                username="sameuser", email="user2@example.com", password="pass123"
            )

    def test_user_2fa_enabled_by_default(self):
        """Test that 2FA is enabled by default."""
        user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

        assert user.is_2fa_enabled is True

    def test_user_can_disable_2fa(self):
        """Test that 2FA can be disabled."""
        user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        user.is_2fa_enabled = False
        user.save()

        user.refresh_from_db()
        assert user.is_2fa_enabled is False

    def test_user_date_joined_auto_set(self):
        """Test that date_joined is automatically set."""
        user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

        assert user.date_joined is not None

    def test_user_ordering(self):
        """Test that users are ordered by date_joined descending."""
        user1 = User.objects.create_user(
            username="user1", email="user1@example.com", password="pass"
        )
        user2 = User.objects.create_user(
            username="user2", email="user2@example.com", password="pass"
        )
        user3 = User.objects.create_user(
            username="user3", email="user3@example.com", password="pass"
        )

        users = list(User.objects.all())
        # Most recent first
        assert users[0] == user3
        assert users[1] == user2
        assert users[2] == user1

    def test_user_password_hashed(self):
        """Test that password is hashed, not stored in plain text."""
        user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

        assert user.password != "testpass123"
        assert user.check_password("testpass123")

    def test_user_authentication(self):
        """Test that user can authenticate with correct credentials."""
        from django.contrib.auth import authenticate

        User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

        authenticated_user = authenticate(username="testuser", password="testpass123")
        assert authenticated_user is not None
        assert authenticated_user.username == "testuser"

    def test_user_authentication_wrong_password(self):
        """Test that authentication fails with wrong password."""
        from django.contrib.auth import authenticate

        User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

        authenticated_user = authenticate(username="testuser", password="wrongpass")
        assert authenticated_user is None


# =============================================================================
# EmailOTP Model Tests
# =============================================================================


@pytest.mark.django_db
class TestEmailOTPModel:
    """Tests for the EmailOTP model."""

    def test_create_otp(self, user):
        """Test creating an OTP."""
        otp, raw_code = EmailOTP.create_otp(user)

        assert otp.pk is not None
        assert otp.user == user
        assert len(raw_code) == 6
        assert raw_code.isdigit()
        assert otp.is_used is False
        assert otp.attempts == 0

    def test_otp_code_hashed(self, user):
        """Test that OTP code is hashed, not stored in plain text."""
        otp, raw_code = EmailOTP.create_otp(user)

        assert otp.hashed_code != raw_code
        assert otp.check_code(raw_code)

    def test_otp_verify_success(self, user):
        """Test successful OTP verification."""
        otp, raw_code = EmailOTP.create_otp(user)

        result = otp.verify(raw_code)

        assert result is True
        otp.refresh_from_db()
        assert otp.is_used is True

    def test_otp_verify_wrong_code(self, user):
        """Test OTP verification with wrong code."""
        otp, raw_code = EmailOTP.create_otp(user)

        result = otp.verify("000000")

        assert result is False
        otp.refresh_from_db()
        assert otp.attempts == 1
        assert otp.is_used is False

    def test_otp_verify_already_used(self, user):
        """Test that used OTP cannot be verified again."""
        otp, raw_code = EmailOTP.create_otp(user)
        otp.verify(raw_code)  # First verification

        result = otp.verify(raw_code)  # Second attempt

        assert result is False

    def test_otp_verify_expired(self, user):
        """Test that expired OTP cannot be verified."""
        otp, raw_code = EmailOTP.create_otp(user, ttl_minutes=1)

        # Manually expire the OTP
        otp.expires_at = timezone.now() - timedelta(minutes=1)
        otp.save()

        result = otp.verify(raw_code)

        assert result is False

    def test_otp_max_attempts_exceeded(self, user):
        """Test that OTP fails after max attempts."""
        otp, raw_code = EmailOTP.create_otp(user)

        # Make 3 wrong attempts
        otp.verify("000001")
        otp.verify("000002")
        otp.verify("000003")

        # Now even correct code should fail
        result = otp.verify(raw_code)

        assert result is False
        otp.refresh_from_db()
        assert otp.attempts >= 3

    def test_otp_is_expired_method(self, user):
        """Test is_expired() method."""
        otp, raw_code = EmailOTP.create_otp(user, ttl_minutes=10)

        assert otp.is_expired() is False

        # Manually expire
        otp.expires_at = timezone.now() - timedelta(minutes=1)
        otp.save()

        assert otp.is_expired() is True

    def test_create_otp_invalidates_previous(self, user):
        """Test that creating new OTP invalidates previous ones."""
        otp1, code1 = EmailOTP.create_otp(user)
        otp2, code2 = EmailOTP.create_otp(user)

        otp1.refresh_from_db()
        assert otp1.is_used is True  # Previous OTP invalidated
        assert otp2.is_used is False  # New OTP is active

    def test_otp_ordering(self, user):
        """Test that OTPs are ordered by created_at descending."""
        otp1, _ = EmailOTP.create_otp(user)
        otp1.is_used = False  # Reset for test
        otp1.save()

        otp2, _ = EmailOTP.create_otp(user)
        otp2.is_used = False
        otp2.save()

        otps = list(EmailOTP.objects.filter(user=user))
        # Most recent first
        assert otps[0].pk == otp2.pk


# =============================================================================
# UserProfile Model Tests
# =============================================================================


@pytest.mark.django_db
class TestUserProfileModel:
    """Tests for the UserProfile model.

    Note: UserProfile is auto-created via signal when User is created.
    """

    def test_profile_auto_created_with_user(self, user):
        """Test that profile is auto-created when user is created."""
        # Profile is created via signal in users/signals.py
        assert hasattr(user, "profile")
        assert user.profile is not None
        assert user.profile.user == user

    def test_profile_str_representation(self, user):
        """Test __str__ returns username's Profile."""
        profile = user.profile  # Auto-created via signal

        assert str(profile) == f"{user.username}'s Profile"

    def test_profile_one_to_one_relationship(self, user):
        """Test that profile is one-to-one with user."""
        profile = user.profile

        # Access via reverse relationship
        assert user.profile == profile
        assert profile.user == user

    def test_profile_cascade_delete(self, user):
        """Test that profile is deleted when user is deleted."""
        profile_pk = user.profile.pk

        user.delete()

        assert not UserProfile.objects.filter(pk=profile_pk).exists()

    def test_profile_avatar_optional(self, user):
        """Test that avatar is optional."""
        profile = user.profile

        # Avatar can be empty string or None when not set
        assert profile.avatar.name is None or profile.avatar.name == ""

    def test_profile_created_at_auto_set(self, user):
        """Test that created_at is automatically set."""
        profile = user.profile

        assert profile.created_at is not None

    def test_profile_followers_count_default(self, user):
        """Test default followers count is 0."""
        profile = user.profile

        assert profile.followers_count == 0

    def test_profile_following_count_default(self, user):
        """Test default following count is 0."""
        profile = user.profile

        assert profile.following_count == 0

    def test_profile_can_update_counts(self, user):
        """Test that follower/following counts can be updated."""
        profile = user.profile

        profile.followers_count = 10
        profile.following_count = 5
        profile.save()

        profile.refresh_from_db()
        assert profile.followers_count == 10
        assert profile.following_count == 5

    def test_signal_uses_get_or_create(self, db):
        """Test that signal uses get_or_create to avoid duplicates."""
        # Create user (signal creates profile)
        user = User.objects.create_user(
            username="signaltest", email="signal@example.com", password="pass123"
        )

        # Should have exactly one profile
        assert UserProfile.objects.filter(user=user).count() == 1
