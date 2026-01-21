from django.urls import path
from . import views

urlpatterns = [
    # List all notifications
    # GET /api/notifications/
    # Query params: ?is_read=true/false, ?type=welcome/new_follower/followed_back/daily_mood
    path("", views.NotificationListView.as_view(), name="notification-list"),
    # Get unread count
    # GET /api/notifications/unread-count/
    path(
        "unread-count/",
        views.UnreadCountView.as_view(),
        name="notification-unread-count",
    ),
    # Mark all as read
    # POST /api/notifications/mark-all-read/
    path(
        "mark-all-read/",
        views.MarkAllAsReadView.as_view(),
        name="notification-mark-all-read",
    ),
    # Get, update (mark as read), or delete a single notification
    # GET/PATCH/DELETE /api/notifications/<id>/
    path(
        "<int:notification_id>/",
        views.NotificationDetailView.as_view(),
        name="notification-detail",
    ),
]
