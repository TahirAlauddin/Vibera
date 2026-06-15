from rest_framework import serializers
from .models import Notification


class SenderSerializer(serializers.Serializer):
    """Minimal serializer for notification sender info"""

    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""

    sender = SenderSerializer(read_only=True)
    message = serializers.SerializerMethodField()
    notification_type_display = serializers.CharField(
        source="get_notification_type_display", read_only=True
    )
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
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
        ]
        read_only_fields = [
            "id",
            "recipient",
            "sender",
            "notification_type",
            "created_at",
            "expires_at",
        ]

    def get_message(self, obj):
        """Get the notification message"""
        return obj.get_message()

    def get_is_expired(self, obj):
        """Check if notification is expired"""
        return obj.is_expired()


class NotificationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing notifications"""

    sender = SenderSerializer(read_only=True)
    message = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            "id",
            "sender",
            "notification_type",
            "message",
            "is_read",
            "requires_action",
            "created_at",
        ]

    def get_message(self, obj):
        return obj.get_message()


class UnreadCountSerializer(serializers.Serializer):
    """Serializer for unread notification count"""

    unread_count = serializers.IntegerField(read_only=True)
