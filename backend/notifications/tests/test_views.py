"""
Tests for Notifications app API views.

Covers list (with filters), detail (get, patch mark read, delete),
unread-count, mark-all-read. Success paths, 401, 404 for other user's notification.
"""

import pytest
from rest_framework import status

from notifications.models import Notification


BASE = "/api/notifications"


@pytest.mark.django_db
class TestNotificationListView:
    """GET /api/notifications/"""

    def test_list_empty(self, authenticated_client):
        """Authenticated user with no notifications gets empty results."""
        response = authenticated_client.get(BASE + "/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 0
        assert response.data["results"] == []

    def test_list_with_data(self, authenticated_client, user):
        """List returns user's notifications."""
        Notification.create_welcome_notification(user)
        response = authenticated_client.get(BASE + "/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["notification_type"] == "welcome"

    def test_list_filter_is_read(self, authenticated_client, user):
        """Filter by is_read returns only matching notifications."""
        n1 = Notification.create_welcome_notification(user)
        n2 = Notification.create_welcome_notification(user)
        n1.mark_as_read()

        response = authenticated_client.get(BASE + "/?is_read=false")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1

        response = authenticated_client.get(BASE + "/?is_read=true")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1

    def test_list_filter_type(self, authenticated_client, user, other_user):
        """Filter by type returns only matching notification type."""
        Notification.create_welcome_notification(user)
        Notification.create_follow_notification(other_user, user, is_follow_back=False)

        response = authenticated_client.get(BASE + "/?type=welcome")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["results"][0]["notification_type"] == "welcome"

    def test_list_unauthenticated(self, api_client):
        """Unauthenticated request returns 401."""
        response = api_client.get(BASE + "/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestNotificationDetailView:
    """GET/PATCH/DELETE /api/notifications/<id>/"""

    def test_get_own_notification(self, authenticated_client, user):
        """GET own notification returns 200 and data."""
        n = Notification.create_welcome_notification(user)
        response = authenticated_client.get(f"{BASE}/{n.pk}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == n.pk
        assert response.data["notification_type"] == "welcome"

    def test_get_other_user_notification_returns_404(
        self, authenticated_client, user, other_user
    ):
        """GET another user's notification returns 404."""
        n = Notification.create_welcome_notification(other_user)
        response = authenticated_client.get(f"{BASE}/{n.pk}/")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_patch_marks_as_read(self, authenticated_client, user):
        """PATCH marks notification as read and returns updated data."""
        n = Notification.create_welcome_notification(user)
        assert n.is_read is False
        response = authenticated_client.patch(f"{BASE}/{n.pk}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["is_read"] is True
        n.refresh_from_db()
        assert n.is_read is True

    def test_delete_own_notification(self, authenticated_client, user):
        """DELETE removes notification and returns 200 with message."""
        n = Notification.create_welcome_notification(user)
        response = authenticated_client.delete(f"{BASE}/{n.pk}/")
        assert response.status_code == status.HTTP_200_OK
        assert "message" in response.data
        assert not Notification.objects.filter(pk=n.pk).exists()

    def test_get_nonexistent_returns_404(self, authenticated_client):
        """GET non-existent notification returns 404."""
        response = authenticated_client.get(f"{BASE}/99999/")
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestUnreadCountView:
    """GET /api/notifications/unread-count/"""

    def test_unread_count_zero(self, authenticated_client):
        """Unread count is 0 when no notifications."""
        response = authenticated_client.get(BASE + "/unread-count/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["unread_count"] == 0

    def test_unread_count_with_data(self, authenticated_client, user):
        """Unread count reflects unread notifications."""
        Notification.create_welcome_notification(user)
        Notification.create_welcome_notification(user)
        response = authenticated_client.get(BASE + "/unread-count/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["unread_count"] == 2

    def test_unread_count_unauthenticated(self, api_client):
        """Unauthenticated request returns 401."""
        response = api_client.get(BASE + "/unread-count/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestMarkAllAsReadView:
    """POST /api/notifications/mark-all-read/"""

    def test_mark_all_as_read(self, authenticated_client, user):
        """POST marks all as read and returns updated_count."""
        Notification.create_welcome_notification(user)
        Notification.create_welcome_notification(user)
        response = authenticated_client.post(BASE + "/mark-all-read/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["message"]
        assert response.data["updated_count"] == 2
        assert Notification.get_unread_count(user) == 0

    def test_mark_all_as_read_empty(self, authenticated_client):
        """POST when no unread returns updated_count 0."""
        response = authenticated_client.post(BASE + "/mark-all-read/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["updated_count"] == 0

    def test_mark_all_as_read_unauthenticated(self, api_client):
        """Unauthenticated request returns 401."""
        response = api_client.post(BASE + "/mark-all-read/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
