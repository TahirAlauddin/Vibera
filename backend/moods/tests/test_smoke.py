"""Smoke tests for public health-check API endpoints."""

import pytest


@pytest.mark.django_db
class TestSmokeEndpoints:
    """Basic availability checks for DRF smoke endpoints."""

    def test_root_test_api_requires_authentication(self, api_client):
        response = api_client.get("/api/test/")
        assert response.status_code == 401

    def test_root_test_api_returns_success_when_authenticated(self, authenticated_client):
        response = authenticated_client.get("/api/test/")

        assert response.status_code == 200
        assert response.data["status"] == "success"
        assert "timestamp" in response.data

    def test_moods_test_api_returns_success_when_authenticated(self, authenticated_client):
        response = authenticated_client.get("/api/moods/test/")

        assert response.status_code == 200
        assert response.data["framework"] == "Django REST Framework"
