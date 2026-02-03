"""
Tests for Notifications app models.

Covers Notification: creation, types, mark_as_read, is_expired, get_message,
helper methods (create_welcome, create_follow, create_daily_mood, get_unread_count,
mark_all_as_read, delete_expired), ordering.
"""

import pytest
from django.utils import timezone

from notifications.models import Notification
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestNotificationModel:
    """Tests for the Notification model."""

    def test_notification_creation(self, user):
        """Notification can be created with required fields."""
        n = Notification.objects.create(
            recipient=user,
            notification_type=Notification.WELCOME,
            sender=None,
        )
        assert n.pk is not None
        assert n.recipient == user
        assert n.notification_type == Notification.WELCOME
        assert n.sender is None
        assert n.is_read is False
        assert n.created_at is not None

    def test_mark_as_read(self, user):
        """mark_as_read sets is_read to True."""
        n = Notification.create_welcome_notification(user)
        assert n.is_read is False
        n.mark_as_read()
        n.refresh_from_db()
        assert n.is_read is True

    def test_mark_as_read_idempotent(self, user):
        """Calling mark_as_read when already read does not error."""
        n = Notification.create_welcome_notification(user)
        n.mark_as_read()
        n.mark_as_read()
        n.refresh_from_db()
        assert n.is_read is True

    def test_is_expired_false_when_no_expiry(self, user):
        """is_expired() is False when expires_at is None."""
        n = Notification.create_welcome_notification(user)
        assert n.is_expired() is False

    def test_is_expired_false_when_future(self, user):
        """is_expired() is False when expires_at is in the future."""
        n = Notification.create_daily_mood_notification(user)
        assert n.is_expired() is False

    def test_is_expired_true_when_past(self, user):
        """is_expired() is True when expires_at is in the past."""
        n = Notification.objects.create(
            recipient=user,
            notification_type=Notification.DAILY_MOOD,
            sender=None,
            expires_at=timezone.now() - timezone.timedelta(hours=1),
        )
        assert n.is_expired() is True

    def test_get_message_welcome(self, user):
        """get_message returns default for WELCOME type."""
        n = Notification.create_welcome_notification(user)
        msg = n.get_message()
        assert "Welcome" in msg or "Vibera" in msg

    def test_get_message_custom_override(self, user):
        """get_message returns custom_message when set."""
        n = Notification.objects.create(
            recipient=user,
            notification_type=Notification.WELCOME,
            sender=None,
            custom_message="Custom text",
        )
        assert n.get_message() == "Custom text"

    def test_get_message_new_follower(self, user, other_user):
        """get_message for NEW_FOLLOWER includes sender username."""
        n = Notification.create_follow_notification(other_user, user, is_follow_back=False)
        msg = n.get_message()
        assert other_user.username in msg

    def test_create_welcome_notification(self, user):
        """create_welcome_notification creates system notification."""
        n = Notification.create_welcome_notification(user)
        assert n.recipient == user
        assert n.notification_type == Notification.WELCOME
        assert n.sender is None

    def test_create_follow_notification(self, user, other_user):
        """create_follow_notification creates new_follower notification."""
        n = Notification.create_follow_notification(other_user, user, is_follow_back=False)
        assert n.recipient == user
        assert n.sender == other_user
        assert n.notification_type == Notification.NEW_FOLLOWER

    def test_create_follow_notification_follow_back(self, user, other_user):
        """create_follow_notification with is_follow_back=True creates followed_back."""
        n = Notification.create_follow_notification(other_user, user, is_follow_back=True)
        assert n.notification_type == Notification.FOLLOWED_BACK

    def test_create_daily_mood_notification(self, user):
        """create_daily_mood_notification sets expires_at and requires_action."""
        n = Notification.create_daily_mood_notification(user)
        assert n.recipient == user
        assert n.notification_type == Notification.DAILY_MOOD
        assert n.expires_at is not None
        assert n.requires_action is True
        assert n.sender is None

    def test_get_unread_count(self, user):
        """get_unread_count returns count of unread for user."""
        Notification.create_welcome_notification(user)
        Notification.create_welcome_notification(user)
        assert Notification.get_unread_count(user) == 2

    def test_get_unread_count_excludes_read(self, user):
        """get_unread_count excludes read notifications."""
        n1 = Notification.create_welcome_notification(user)
        Notification.create_welcome_notification(user)
        n1.mark_as_read()
        assert Notification.get_unread_count(user) == 1

    def test_mark_all_as_read(self, user):
        """mark_all_as_read marks all user notifications as read."""
        Notification.create_welcome_notification(user)
        Notification.create_welcome_notification(user)
        updated = Notification.mark_all_as_read(user)
        assert updated == 2
        assert Notification.get_unread_count(user) == 0

    def test_delete_expired_notifications(self, user):
        """delete_expired_notifications removes only expired and returns count."""
        Notification.objects.create(
            recipient=user,
            notification_type=Notification.DAILY_MOOD,
            sender=None,
            expires_at=timezone.now() - timezone.timedelta(hours=1),
        )
        Notification.create_daily_mood_notification(user)  # not expired
        count = Notification.delete_expired_notifications()
        assert count == 1
        assert Notification.objects.filter(recipient=user).count() == 1

    def test_ordering_by_created_at_desc(self, user):
        """Notifications are ordered by created_at descending."""
        n1 = Notification.create_welcome_notification(user)
        n2 = Notification.create_welcome_notification(user)
        qs = list(Notification.objects.filter(recipient=user))
        assert qs[0] == n2
        assert qs[1] == n1

    def test_str_representation(self, user):
        """__str__ includes type and recipient."""
        n = Notification.create_welcome_notification(user)
        s = str(n)
        assert user.username in s
        assert "Welcome" in s or "welcome" in s.lower()
