from django.urls import path
from . import views

urlpatterns = [
    path("", views.MoodLogView.as_view(), name="mood-log"),
    path("<int:pk>/", views.MoodLogDetailView.as_view(), name="mood-log-detail"),
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
