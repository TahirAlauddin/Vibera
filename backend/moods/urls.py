from django.urls import path
from . import views

urlpatterns = [
    # Mood endpoints
    path("", views.MoodLogView.as_view(), name="mood-log"),
    path("<int:pk>/", views.MoodLogDetailView.as_view(), name="mood-log-detail"),
    # Tag endpoints
    path("tags/", views.MoodTagListView.as_view(), name="mood-tag-list"),
    # Comment endpoints
    path(
        "<int:mood_id>/comments/",
        views.MoodCommentListView.as_view(),
        name="mood-comments-list",
    ),
    path(
        "comments/<int:comment_id>/",
        views.MoodCommentDetailView.as_view(),
        name="mood-comment-detail",
    ),
    path(
        "comments/<int:comment_id>/replies/",
        views.MoodCommentReplyView.as_view(),
        name="mood-comment-replies",
    ),
]
