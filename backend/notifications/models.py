from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone

User = get_user_model()


class Notification(models.Model):
    """
    Universal notification model for handling all notification types
    in the Instagram-style application.
    """

    # Notification types
    WELCOME = "welcome"
    NEW_FOLLOWER = "new_follower"
    FOLLOWED_BACK = "followed_back"
    DAILY_MOOD = "daily_mood"

    NOTIFICATION_TYPES = [
        (WELCOME, "Welcome"),
        (NEW_FOLLOWER, "New Follower"),
        (FOLLOWED_BACK, "Followed Back"),
        (DAILY_MOOD, "Daily Mood Check"),
    ]

    # Core fields (required for all notification types)
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications",
        help_text="User who receives this notification",
    )

    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES,
        db_index=True,
        help_text="Type of notification",
    )

    is_read = models.BooleanField(
        default=False, db_index=True, help_text="Whether the notification has been read"
    )

    created_at = models.DateTimeField(
        auto_now_add=True, db_index=True, help_text="When the notification was created"
    )

    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_notifications",
        null=True,
        blank=True,
        help_text="User who triggered this notification (null for system notifications)",
    )

    content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE, null=True, blank=True
    )
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey("content_type", "object_id")

    # For notifications that expire (like daily mood)
    expires_at = models.DateTimeField(
        null=True, blank=True, help_text="When this notification expires (optional)"
    )

    # For notifications requiring user action
    requires_action = models.BooleanField(
        default=False, help_text="Whether this notification requires user interaction"
    )

    # Optional message override
    custom_message = models.TextField(
        null=True, blank=True, help_text="Optional custom message for this notification"
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["recipient", "-created_at"]),
            models.Index(fields=["recipient", "is_read"]),
            models.Index(fields=["notification_type", "-created_at"]),
        ]
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        return f"{self.get_notification_type_display()} for {self.recipient.username}"

    def mark_as_read(self):
        """Mark this notification as read"""
        if not self.is_read:
            self.is_read = True
            self.save(update_fields=["is_read"])

    def is_expired(self):
        """Check if notification has expired"""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False

    def get_message(self):
        """
        Generate notification message based on type.
        Returns custom message if set, otherwise generates default message.
        """
        if self.custom_message:
            return self.custom_message

        if self.notification_type == self.WELCOME:
            return "Welcome to Vibera! Start sharing your moods and connect with others."
        if self.notification_type == self.NEW_FOLLOWER and self.sender:
            return f"{self.sender.username} started following you."
        if self.notification_type == self.FOLLOWED_BACK and self.sender:
            return f"{self.sender.username} followed you back!"
        if self.notification_type == self.DAILY_MOOD:
            return "How are you feeling today? Share your mood with your friends!"

        return "You have a new notification"

    @classmethod
    def create_welcome_notification(cls, user):
        """Helper method to create welcome notification"""
        return cls.objects.create(
            recipient=user,
            notification_type=cls.WELCOME,
            sender=None,  # System notification
        )

    @classmethod
    def create_follow_notification(cls, follower, following, is_follow_back=False):
        """Helper method to create follow notification"""
        notification_type = cls.FOLLOWED_BACK if is_follow_back else cls.NEW_FOLLOWER

        return cls.objects.create(
            recipient=following,
            sender=follower,
            notification_type=notification_type,
        )

    @classmethod
    def create_daily_mood_notification(cls, user):
        """Helper method to create daily mood notification"""
        # Set expiration to 24 hours from now
        expires_at = timezone.now() + timezone.timedelta(hours=24)

        return cls.objects.create(
            recipient=user,
            notification_type=cls.DAILY_MOOD,
            sender=None,  # System notification
            requires_action=True,
            expires_at=expires_at,
        )

    @classmethod
    def get_unread_count(cls, user):
        """Get count of unread notifications for a user"""
        return cls.objects.filter(recipient=user, is_read=False).count()

    @classmethod
    def mark_all_as_read(cls, user):
        """Mark all notifications as read for a user"""
        return cls.objects.filter(recipient=user, is_read=False).update(is_read=True)

    @classmethod
    def delete_expired_notifications(cls):
        """Delete all expired notifications"""
        expired = cls.objects.filter(
            expires_at__isnull=False, expires_at__lt=timezone.now()
        )
        count = expired.count()
        expired.delete()
        return count
