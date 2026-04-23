from django.urls import path, include
from rest_framework.routers import SimpleRouter
from . import views

router = SimpleRouter()
router.register(r"", views.MoodLogViewSet, basename="mood")

urlpatterns = [
    # Static paths must come before the router — otherwise "feed", "test", etc.
    # are captured as mood primary keys by the viewset detail route.
    path("feed/", views.PersonalizedMoodFeedView.as_view(), name="mood-feed"),
    path("test/", views.test_api, name="api-test"),
    path(
        "comments/<int:comment_id>/",
        views.MoodCommentViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="mood-comment-detail",
    ),
    path(
        "comments/<int:comment_id>/replies/",
        views.MoodCommentViewSet.as_view({"post": "create"}),
        name="mood-comment-replies",
    ),
    path(
        "<int:mood_id>/comments/",
        views.MoodCommentViewSet.as_view({"get": "list", "post": "create"}),
        name="mood-comments-list",
    ),
    path("", include(router.urls)),
]
