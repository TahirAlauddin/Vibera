from django.urls import path, include
from rest_framework.routers import SimpleRouter
from . import views

# Create a router for the top-level Mood entries
router = SimpleRouter()
router.register(r'', views.MoodLogViewSet, basename='mood')

urlpatterns = [
    # 1. Main Mood Endpoints (List, Create, Retrieve, Update, Delete)
    # This covers: /api/moods/ and /api/moods/<pk>/
    path('', include(router.urls)),

    # 2. Mood-specific Comments (List/Create comments for a specific mood)
    path(
        "<int:mood_id>/comments/",
        views.MoodCommentViewSet.as_view({'get': 'list', 'post': 'create'}),
        name="mood-comments-list",
    ),

    # 3. Individual Comment Actions (Update, Partial Update, Delete)
    path(
        "comments/<int:comment_id>/",
        views.MoodCommentViewSet.as_view({
            'get': 'retrieve',
            'put': 'update',
            'patch': 'partial_update',
            'delete': 'destroy'
        }),
        name="mood-comment-detail",
    ),

    # 4. Reply Logic
    # We map 'post' to 'create' because perform_create now handles the parent_id logic
    path(
        "comments/<int:comment_id>/replies/",
        views.MoodCommentViewSet.as_view({'post': 'create'}),
        name="mood-comment-replies",
    ),
    
    # 5. Test Endpoint
    path("test/", views.test_api, name="api-test"),
]