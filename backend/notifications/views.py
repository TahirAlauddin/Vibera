from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Notification
from .serializers import (
    NotificationSerializer,
    NotificationListSerializer,
    UnreadCountSerializer,
)


class NotificationListView(APIView):
    """
    GET - List all notifications for the authenticated user
    Supports filtering by:
        - is_read: true/false
        - type: notification_type (welcome, new_follower, followed_back, daily_mood)
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user)

        # Filter by read status
        is_read = request.query_params.get("is_read")
        if is_read is not None:
            is_read_bool = is_read.lower() == "true"
            notifications = notifications.filter(is_read=is_read_bool)

        # Filter by notification type
        notification_type = request.query_params.get("type")
        if notification_type:
            notifications = notifications.filter(notification_type=notification_type)

        # Optimize query by selecting related sender
        notifications = notifications.select_related("sender")

        serializer = NotificationListSerializer(notifications, many=True)
        return Response(
            {
                "count": notifications.count(),
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class NotificationDetailView(APIView):
    """
    GET - Get a single notification
    PATCH - Mark notification as read
    DELETE - Delete a notification
    """

    permission_classes = [IsAuthenticated]

    def get_object(self, request, notification_id):
        return get_object_or_404(
            Notification, id=notification_id, recipient=request.user
        )

    def get(self, request, notification_id):
        notification = self.get_object(request, notification_id)
        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, notification_id):
        """Mark notification as read"""
        notification = self.get_object(request, notification_id)
        notification.mark_as_read()
        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, notification_id):
        """Delete a notification"""
        notification = self.get_object(request, notification_id)
        notification.delete()
        return Response(
            {"message": "Notification deleted successfully"},
            status=status.HTTP_200_OK,
        )


class UnreadCountView(APIView):
    """GET - Get count of unread notifications"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        unread_count = Notification.get_unread_count(request.user)
        serializer = UnreadCountSerializer({"unread_count": unread_count})
        return Response(serializer.data, status=status.HTTP_200_OK)


class MarkAllAsReadView(APIView):
    """POST - Mark all notifications as read for the authenticated user"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        updated_count = Notification.mark_all_as_read(request.user)
        return Response(
            {
                "message": "All notifications marked as read",
                "updated_count": updated_count,
            },
            status=status.HTTP_200_OK,
        )
