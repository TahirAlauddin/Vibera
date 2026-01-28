from rest_framework import viewsets, permissions, serializers as drf_serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Count

from .models import Mood, MoodComment
from .serializers import MoodLogSerializer, MoodCommentSerializer

# --- Custom Permissions ---

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission: 
    - SAFE_METHODS (GET, HEAD, OPTIONS) allowed for any authenticated user.
    - Write methods (PUT, PATCH, DELETE) allowed only for the creator.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user

# --- ViewSets ---

class MoodLogViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing mood logs.
    - Authenticated users can see all logs.
    - Only the creator can update or delete their log.
    """
    serializer_class = MoodLogSerializer
    # Apply the custom permission here
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Mood.objects.all().annotate(
            comment_count=Count('comments')  # DRF will map this to serializer field
        ).select_related("user").order_by("-created_at")


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MoodCommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing mood comments.
    - Authenticated users can see comments.
    - Only the creator can update or delete their comment.
    """
    serializer_class = MoodCommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    lookup_url_kwarg = "comment_id"

    def get_queryset(self):
        """
        Base queryset for comments:
        - If a mood_id is present in the URL, limit to top-level comments for that mood.
        - Otherwise, return all comments (used for detail routes).
        """
        mood_id = self.kwargs.get("mood_id")
        queryset = MoodComment.objects.select_related("user", "mood").prefetch_related(
            "replies__user", "replies__mood"
        ).annotate(
            reply_count=Count("replies")
        )

        if mood_id:
            # Top-level comments for a specific mood
            return queryset.filter(mood_id=mood_id, parent__isnull=True).order_by(
                "-created_at"
            )

        # Return all comments if no mood_id (for the detail view /comments/<id>/)
        return queryset

    def perform_create(self, serializer):
        mood_id = self.kwargs.get("mood_id")
        parent_id = self.kwargs.get("comment_id")
        
        # If creating a reply, get mood from parent comment
        if parent_id:
            parent = get_object_or_404(MoodComment, id=parent_id)
            # Prevent nested replies beyond one level
            if parent.parent is not None:
                raise drf_serializers.ValidationError(
                    {
                        "parent": [
                            "Cannot reply to a reply. Only top-level comments can have replies."
                        ]
                    }
                )
            mood = parent.mood
        else:
            # Creating a top-level comment, mood_id is required
            if not mood_id:
                raise drf_serializers.ValidationError(
                    {"mood": "mood_id is required for top-level comments."}
                )
            mood = get_object_or_404(Mood, id=mood_id)
            parent = None
        
        serializer.save(user=self.request.user, mood=mood, parent=parent)


@api_view(['GET'])
def test_api(request):
    """Test endpoint to verify API is working."""
    return Response({"message": "Mood API is working!", "status": "ok"})