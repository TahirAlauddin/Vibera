"""Tests for Google social auth token exchange endpoint."""

from unittest.mock import patch

import pytest
from django.test import override_settings


@pytest.mark.django_db
class TestGoogleSocialAuthView:
    """POST /api/auth/social/google/"""

    url = "/api/auth/social/google/"

    def test_missing_id_token_returns_400(self, api_client):
        response = api_client.post(self.url, {})

        assert response.status_code == 400
        assert response.data["error"] == "id_token is required"

    @override_settings(GOOGLE_OAUTH2_CLIENT_ID="")
    def test_missing_client_id_returns_500(self, api_client):
        response = api_client.post(self.url, {"id_token": "token"})

        assert response.status_code == 500
        assert response.data["error"] == "Google OAuth2 client ID not configured"

    @override_settings(GOOGLE_OAUTH2_CLIENT_ID="test-client-id")
    @patch("users.views.id_token.verify_oauth2_token", side_effect=ValueError("bad token"))
    def test_invalid_token_returns_401(self, _mock_verify, api_client):
        response = api_client.post(self.url, {"id_token": "invalid"})

        assert response.status_code == 401
        assert response.data["error"] == "Invalid or expired Google token"
