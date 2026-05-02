"""
Tests for users.utils — email masking and OTP verification helpers.
"""

from datetime import timedelta
from unittest.mock import patch

import pytest
from django.utils import timezone

from users.models import EmailOTP
from users.utils import mask_email, verify_user_otp


class TestMaskEmail:
    """Tests for mask_email()."""

    def test_masks_standard_email(self):
        assert mask_email("john.doe@example.com") == "joh***@example.com"

    def test_masks_short_local_part(self):
        assert mask_email("ab@example.com") == "a***@example.com"

    def test_masks_two_char_local_part(self):
        assert mask_email("jo@example.com") == "j***@example.com"

    def test_invalid_email_returns_placeholder(self):
        assert mask_email("") == "***"
        assert mask_email("not-an-email") == "***"
        assert mask_email(None) == "***"


@pytest.mark.django_db
class TestVerifyUserOtp:
    """Tests for verify_user_otp()."""

    def test_verify_success(self, user):
        _, raw_code = EmailOTP.create_otp(user)

        success, error = verify_user_otp(user, raw_code)

        assert success is True
        assert error is None

    def test_verify_no_active_otp(self, user):
        success, error = verify_user_otp(user, "123456")

        assert success is False
        assert error == "No active OTP found. Please request a new code."

    def test_verify_wrong_code_reports_remaining_attempts(self, user):
        EmailOTP.create_otp(user)

        success, error = verify_user_otp(user, "000000")

        assert success is False
        assert "Invalid OTP" in error
        assert "remaining" in error

    def test_verify_expired_otp(self, user):
        otp, raw_code = EmailOTP.create_otp(user)
        otp.expires_at = timezone.now() - timedelta(minutes=1)
        otp.save()

        success, error = verify_user_otp(user, raw_code)

        assert success is False
        assert error == "OTP has expired. Please request a new code."

    def test_verify_max_attempts_exceeded(self, user):
        otp, raw_code = EmailOTP.create_otp(user)
        otp.attempts = 3
        otp.save()

        success, error = verify_user_otp(user, raw_code)

        assert success is False
        assert error == "Maximum attempts exceeded. Please request a new code."
