"""
Tests for Notifications app serializers.

Covers NotificationSerializer, NotificationListSerializer, UnreadCountSerializer.
"""

import pytest
from notifications.models import Notification
from notifications.serializers import (
    NotificationSerializer,
    NotificationListSerializer,
    UnreadCountSerializer,
)


@pytest.mark.django_db
class TestNotificationSerializer:
    """NotificationSerializer output shape and message."""

    def test_detail_contains_expected_fields(self, user):
        """NotificationSerializer returns id, recipient, sender, message, is_read, etc."""
        n = Notification.create_welcome_notification(user)
        serializer = NotificationSerializer(n)
        data = serializer.data

        expected = {
            "id",
            "recipient",
            "sender",
            "notification_type",
            "notification_type_display",
            "message",
            "is_read",
            "is_expired",
            "requires_action",
            "created_at",
            "expires_at",
        }
        assert set(data.keys()) == expected
        assert "message" in data
        assert data["is_read"] is False
        assert "notification_type_display" in data

    def test_message_from_model(self, user):
        """message field uses get_message()."""
        n = Notification.create_welcome_notification(user)
        serializer = NotificationSerializer(n)
        assert "Vibera" in serializer.data["message"] or "Welcome" in serializer.data["message"]

    def test_sender_null_for_system_notification(self, user):
        """sender is null for system notifications."""
        n = Notification.create_welcome_notification(user)
        serializer = NotificationSerializer(n)
        assert serializer.data["sender"] is None


@pytest.mark.django_db
class TestNotificationListSerializer:
    """NotificationListSerializer for list view."""

    def test_list_contains_expected_fields(self, user):
        """NotificationListSerializer returns id, sender, notification_type, message, is_read, etc."""
        n = Notification.create_welcome_notification(user)
        serializer = NotificationListSerializer(n)
        data = serializer.data

        assert set(data.keys()) == {
            "id",
            "sender",
            "notification_type",
            "message",
            "is_read",
            "requires_action",
            "created_at",
        }
        assert "message" in data


@pytest.mark.django_db
class TestUnreadCountSerializer:
    """UnreadCountSerializer for unread count response."""

    def test_unread_count_output(self):
        """UnreadCountSerializer outputs unread_count."""
        serializer = UnreadCountSerializer({"unread_count": 5})
        assert serializer.data["unread_count"] == 5
