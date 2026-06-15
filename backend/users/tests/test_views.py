"""
Tests for Users app API views.

Tests cover:
- OtpRequestView (2FA login)
- OtpVerifyView (OTP verification)
- OtpResendView (OTP resend)
- UserProfileViewSet (profile CRUD)
"""

import pytest
from unittest.mock import patch, Mock
from rest_framework import status
from django.contrib.auth import get_user_model
from users.models import UserProfile, EmailOTP

User = get_user_model()


# =============================================================================
# OtpRequestView Tests (2FA Login)
# =============================================================================


@pytest.mark.django_db
class TestOtpRequestView:
    """Tests for POST /api/users/auth/2fa/login/"""

    url = "/api/users/auth/2fa/login/"

    def test_login_missing_credentials(self, api_client):
        """Login without credentials returns 400."""
        response = api_client.post(self.url, {})

        assert response.status_code == 400
        assert response.data["success"] is False
        assert "Username and password are required" in response.data["error"]

    def test_login_missing_username(self, api_client):
        """Login without username returns 400."""
        response = api_client.post(self.url, {"password": "test123"})

        assert response.status_code == 400

    def test_login_missing_password(self, api_client):
        """Login without password returns 400."""
        response = api_client.post(self.url, {"username": "testuser"})

        assert response.status_code == 400

    def test_login_invalid_credentials(self, api_client, user):
        """Login with wrong password returns 401."""
        response = api_client.post(
            self.url, {"username": user.username, "password": "wrongpassword"}
        )

        assert response.status_code == 401
        assert response.data["success"] is False
        assert "Invalid credentials" in response.data["error"]

    def test_login_nonexistent_user(self, api_client):
        """Login with non-existent user returns 401."""
        response = api_client.post(
            self.url, {"username": "nonexistent", "password": "password123"}
        )

        assert response.status_code == 401

    def test_login_2fa_disabled_returns_tokens(self, api_client, user):
        """User with 2FA disabled gets JWT tokens directly."""
        user.is_2fa_enabled = False
        user.save()

        response = api_client.post(
            self.url, {"username": user.username, "password": "password123"}
        )

        assert response.status_code == 200
        assert response.data["success"] is True
        assert response.data["requires_2fa"] is False
        assert "access" in response.data
        assert "refresh" in response.data

    @patch("users.views.create_and_send_otp")
    def test_login_2fa_enabled_sends_otp(self, mock_send_otp, api_client, user):
        """User with 2FA enabled gets OTP sent."""
        mock_send_otp.return_value = (Mock(), True)  # (otp, email_sent)

        response = api_client.post(
            self.url, {"username": user.username, "password": "password123"}
        )

        assert response.status_code == 200
        assert response.data["success"] is True
        assert response.data["requires_2fa"] is True
        assert "email_hint" in response.data
        mock_send_otp.assert_called_once()

    @patch("users.views.create_and_send_otp")
    def test_login_otp_email_failed(self, mock_send_otp, api_client, user):
        """Login fails when OTP email fails to send."""
        mock_send_otp.return_value = (Mock(), False)  # Email failed

        response = api_client.post(
            self.url, {"username": user.username, "password": "password123"}
        )

        assert response.status_code == 500
        assert response.data["success"] is False
        assert "Failed to send OTP" in response.data["error"]


# =============================================================================
# OtpVerifyView Tests
# =============================================================================


@pytest.mark.django_db
class TestOtpVerifyView:
    """Tests for POST /api/users/auth/2fa/verify/"""

    url = "/api/users/auth/2fa/verify/"

    def test_verify_missing_token(self, api_client):
        """Verify without token returns 400."""
        response = api_client.post(self.url, {})

        assert response.status_code == 400
        assert "OTP token is required" in response.data["error"]

    def test_verify_no_pending_session(self, api_client):
        """Verify without pending session returns 408."""
        response = api_client.post(self.url, {"token": "123456"})

        assert response.status_code == 408
        assert "Session expired" in response.data["error"]

    @patch("users.views.verify_user_otp")
    def test_verify_success(self, mock_verify, api_client, user):
        """Successful OTP verification returns JWT tokens."""
        mock_verify.return_value = (True, None)

        # Set up session
        session = api_client.session
        session["pending_2fa_user"] = user.id
        session.save()

        response = api_client.post(self.url, {"token": "123456"})

        assert response.status_code == 200
        assert response.data["success"] is True
        assert "access" in response.data
        assert "refresh" in response.data

    @patch("users.views.verify_user_otp")
    def test_verify_invalid_otp(self, mock_verify, api_client, user):
        """Invalid OTP returns 400."""
        mock_verify.return_value = (False, "Invalid OTP code")

        session = api_client.session
        session["pending_2fa_user"] = user.id
        session.save()

        response = api_client.post(self.url, {"token": "000000"})

        assert response.status_code == 400
        assert response.data["success"] is False

    def test_verify_user_not_found(self, api_client):
        """Verify with invalid user ID returns 400."""
        session = api_client.session
        session["pending_2fa_user"] = 99999  # Non-existent user
        session.save()

        response = api_client.post(self.url, {"token": "123456"})

        assert response.status_code == 400
        assert "User not found" in response.data["error"]


# =============================================================================
# OtpResendView Tests
# =============================================================================


@pytest.mark.django_db
class TestOtpResendView:
    """Tests for POST /api/users/auth/2fa/resend/"""

    url = "/api/users/auth/2fa/resend/"

    def test_resend_no_pending_session(self, api_client):
        """Resend without pending session returns 400."""
        response = api_client.post(self.url)

        assert response.status_code == 400
        assert "Session expired" in response.data["error"]

    @patch("users.views.create_and_send_otp")
    def test_resend_success(self, mock_send_otp, api_client, user):
        """Successful OTP resend."""
        mock_send_otp.return_value = (Mock(), True)

        session = api_client.session
        session["pending_2fa_user"] = user.id
        session.save()

        response = api_client.post(self.url)

        assert response.status_code == 200
        assert response.data["success"] is True
        assert "email_hint" in response.data
        mock_send_otp.assert_called_once()

    @patch("users.views.create_and_send_otp")
    def test_resend_email_failed(self, mock_send_otp, api_client, user):
        """Resend fails when email fails to send."""
        mock_send_otp.return_value = (Mock(), False)

        session = api_client.session
        session["pending_2fa_user"] = user.id
        session.save()

        response = api_client.post(self.url)

        assert response.status_code == 500
        assert "Failed to send OTP" in response.data["error"]

    def test_resend_user_not_found(self, api_client):
        """Resend with invalid user ID returns 400."""
        session = api_client.session
        session["pending_2fa_user"] = 99999
        session.save()

        response = api_client.post(self.url)

        assert response.status_code == 400
        assert "User not found" in response.data["error"]


# =============================================================================
# UserProfileViewSet Tests
# =============================================================================


@pytest.mark.django_db
class TestUserProfileViewSet:
    """Tests for /api/users/profiles/ endpoints."""

    # -------------------------------------------------------------------------
    # Authentication Tests
    # -------------------------------------------------------------------------

    def test_list_profiles_unauthenticated(self, api_client):
        """List profiles without auth returns 401."""
        response = api_client.get("/api/users/profiles/")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_my_profile_unauthenticated(self, api_client):
        """Get own profile without auth returns 401."""
        response = api_client.get("/api/users/profiles/me/")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    # -------------------------------------------------------------------------
    # GET /api/users/profiles/me/
    # -------------------------------------------------------------------------

    def test_get_my_profile_success(self, authenticated_client, user):
        """Get own profile returns profile data."""
        # Profile auto-created via signal
        response = authenticated_client.get("/api/users/profiles/me/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["user"] == user.pk

    # -------------------------------------------------------------------------
    # PUT/PATCH /api/users/profiles/me/
    # -------------------------------------------------------------------------

    def test_update_my_profile_put(self, authenticated_client, user):
        """Update own profile with PUT."""
        # Profile auto-created via signal
        response = authenticated_client.put(
            "/api/users/profiles/me/",
            {},  # Empty update (all fields read-only except avatar)
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK

    def test_update_my_profile_patch(self, authenticated_client, user):
        """Update own profile with PATCH."""
        # Profile auto-created via signal
        response = authenticated_client.patch(
            "/api/users/profiles/me/", {}, format="json"
        )

        assert response.status_code == status.HTTP_200_OK

    # -------------------------------------------------------------------------
    # GET /api/users/profiles/
    # -------------------------------------------------------------------------

    def test_list_profiles(self, authenticated_client, user, other_user):
        """List all profiles."""
        # Profiles auto-created via signal
        response = authenticated_client.get("/api/users/profiles/")

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 2

    # -------------------------------------------------------------------------
    # GET /api/users/profiles/<user_id>/
    # -------------------------------------------------------------------------

    def test_get_profile_by_user_id(self, authenticated_client, user, other_user):
        """Get another user's profile by user_id."""
        # Profile auto-created via signal
        response = authenticated_client.get(f"/api/users/profiles/{other_user.pk}/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["user"] == other_user.pk

    def test_get_profile_not_found(self, authenticated_client):
        """Get non-existent profile returns 404."""
        response = authenticated_client.get("/api/users/profiles/99999/")

        assert response.status_code == status.HTTP_404_NOT_FOUND


# =============================================================================
# Integration Tests
# =============================================================================


@pytest.mark.django_db
class TestUserAuthIntegration:
    """Integration tests for user authentication flow."""

    def test_login_without_2fa_full_flow(self, api_client, user):
        """Complete login flow without 2FA."""
        user.is_2fa_enabled = False
        user.save()

        # Login
        response = api_client.post(
            "/api/users/auth/2fa/login/",
            {"username": user.username, "password": "password123"},
        )

        assert response.status_code == 200
        assert "access" in response.data

        # Use token to access protected endpoint
        access_token = response.data["access"]
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        # Profile auto-created via signal, access it
        profile_response = api_client.get("/api/users/profiles/me/")

        assert profile_response.status_code == 200

    @patch("users.views.create_and_send_otp")
    @patch("users.views.verify_user_otp")
    def test_login_with_2fa_full_flow(
        self, mock_verify, mock_send_otp, api_client, user
    ):
        """Complete login flow with 2FA."""
        mock_send_otp.return_value = (Mock(), True)
        mock_verify.return_value = (True, None)

        # Step 1: Login (triggers OTP)
        login_response = api_client.post(
            "/api/users/auth/2fa/login/",
            {"username": user.username, "password": "password123"},
        )

        assert login_response.status_code == 200
        assert login_response.data["requires_2fa"] is True

        # Step 2: Verify OTP
        verify_response = api_client.post(
            "/api/users/auth/2fa/verify/", {"token": "123456"}
        )

        assert verify_response.status_code == 200
        assert "access" in verify_response.data
