"""
Tests for Notifications app API permissions.

Covers: unauthenticated 401 on all endpoints; user cannot access other user's notifications (404).
"""

import pytest
from rest_framework import status

from notifications.models import Notification


BASE = "/api/notifications"


@pytest.mark.django_db
class TestNotificationPermissions:
    """Authentication and ownership for notification endpoints."""

    def test_list_unauthenticated_returns_401(self, api_client):
        """GET /api/notifications/ without auth returns 401."""
        response = api_client.get(BASE + "/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_detail_unauthenticated_returns_401(self, api_client, user):
        """GET /api/notifications/<id>/ without auth returns 401."""
        n = Notification.create_welcome_notification(user)
        response = api_client.get(f"{BASE}/{n.pk}/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_unread_count_unauthenticated_returns_401(self, api_client):
        """GET /api/notifications/unread-count/ without auth returns 401."""
        response = api_client.get(BASE + "/unread-count/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_mark_all_read_unauthenticated_returns_401(self, api_client):
        """POST /api/notifications/mark-all-read/ without auth returns 401."""
        response = api_client.post(BASE + "/mark-all-read/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_user_cannot_get_other_user_notification(
        self, authenticated_client, user, other_user
    ):
        """Authenticated user cannot GET another user's notification (404)."""
        n = Notification.create_welcome_notification(other_user)
        response = authenticated_client.get(f"{BASE}/{n.pk}/")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_user_cannot_patch_other_user_notification(
        self, authenticated_client, user, other_user
    ):
        """Authenticated user cannot PATCH another user's notification (404)."""
        n = Notification.create_welcome_notification(other_user)
        response = authenticated_client.patch(f"{BASE}/{n.pk}/")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_user_cannot_delete_other_user_notification(
        self, authenticated_client, user, other_user
    ):
        """Authenticated user cannot DELETE another user's notification (404)."""
        n = Notification.create_welcome_notification(other_user)
        response = authenticated_client.delete(f"{BASE}/{n.pk}/")
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert Notification.objects.filter(pk=n.pk).exists()
