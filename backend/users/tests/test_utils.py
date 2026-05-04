"""
Tests for users.utils — email masking and OTP verification helpers.
"""

from datetime import timedelta
from unittest.mock import patch

import pytest
from django.utils import timezone

from users.models import EmailOTP
from users.utils import create_and_send_otp, mask_email, send_otp_email, verify_user_otp


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


@pytest.mark.django_db
class TestOtpEmailHelpers:
    """Tests for send_otp_email() and create_and_send_otp()."""

    @patch("users.utils.send_mail")
    def test_send_otp_email_success(self, mock_send_mail, user, settings):
        settings.DEFAULT_FROM_EMAIL = "no-reply@vibera.local"
        settings.OTP_EXPIRY_MINUTES = 12

        success = send_otp_email(user=user, otp_code="123456")

        assert success is True
        mock_send_mail.assert_called_once()
        kwargs = mock_send_mail.call_args.kwargs
        assert kwargs["subject"] == "Your Vibera verification code: 123456"
        assert "123456" in kwargs["message"]
        assert "12 minutes" in kwargs["message"]
        assert kwargs["from_email"] == "no-reply@vibera.local"
        assert kwargs["recipient_list"] == [user.email]
        assert kwargs["fail_silently"] is False

    @patch("users.utils.send_mail", side_effect=Exception("smtp down"))
    def test_send_otp_email_failure_returns_false(self, _mock_send_mail, user):
        success = send_otp_email(user=user, otp_code="123456")
        assert success is False

    @patch("users.utils.send_otp_email", return_value=True)
    @patch("users.utils.EmailOTP.create_otp")
    def test_create_and_send_otp_uses_settings_ttl(
        self, mock_create_otp, mock_send_otp_email, user, settings
    ):
        settings.OTP_EXPIRY_MINUTES = 7
        fake_otp = object()
        mock_create_otp.return_value = (fake_otp, "654321")

        otp, success = create_and_send_otp(user)

        assert otp is fake_otp
        assert success is True
        mock_create_otp.assert_called_once_with(user=user, ttl_minutes=7)
        mock_send_otp_email.assert_called_once_with(user=user, otp_code="654321")
