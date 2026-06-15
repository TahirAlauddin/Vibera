from rest_framework import viewsets, permissions, serializers as drf_serializers, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models import Count

from .models import Mood, MoodComment
from .serializers import MoodLogSerializer, MoodCommentSerializer, MoodFeedSerializer

# --- Custom Permissions ---


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission:
    - SAFE_METHODS (GET, HEAD, OPTIONS) allowed for any authenticated user.
    - Write methods (POST, PATCH, DELETE) allowed only for the creator.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


class IsOwner(permissions.BasePermission):
    """
    Object-level permission:
    - Write methods (POST, PATCH, DELETE) allowed only for the creator.
    """

    def has_object_permission(self, request, view, obj):

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
    permission_classes = [permissions.IsAuthenticated & IsOwner]

    def get_queryset(self):
        return (
            Mood.objects.filter(user=self.request.user)
            .annotate(
                comment_count=Count("comments")  # DRF will map this to serializer field
            )
            .select_related("user")
            .order_by("-created_at")
        )

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
        if mood_id is not None:
            get_object_or_404(Mood, pk=mood_id)

        queryset = (
            MoodComment.objects.select_related("user", "mood")
            .prefetch_related("replies__user", "replies__mood")
            .annotate(reply_count=Count("replies"))
        )

        if mood_id is not None:
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


@api_view(["GET"])
def test_api(request):
    """
    Test API endpoint to verify DRF installation.
    Returns JSON with status, message, and timestamp.
    """
    data = {
        "status": "success",
        "message": "Django REST Framework is configured correctly!",
        "timestamp": datetime.now().isoformat(),
        "framework": "Django REST Framework",
    }
    return Response(data, status=status.HTTP_200_OK)


class PersonalizedMoodFeedView(APIView, PageNumberPagination):
    """
    Personalized mood feed that displays all public moods from all users,
    prioritized by user's preferred mood types.
    """
    permission_classes = [IsAuthenticated]
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get(self, request):
        """
        Retrieve personalized mood feed with pagination.
        Personalization: Prioritizes moods matching user's preferred mood types.
        """
        # Get user's preferred moods from profile
        try:
            user_profile = request.user.profile
            preferred_moods = user_profile.get_preferred_moods()
        except Exception:
            # If profile doesn't exist, treat as no preferences (show all moods)
            preferred_moods = None

        # Fetch all public moods (all moods are public by default)
        # Use select_related and prefetch_related for optimization
        all_moods = Mood.objects.all().select_related('user').prefetch_related('comments')

        # Apply personalization logic
        if preferred_moods and len(preferred_moods) > 0:
            # Split moods into preferred and non-preferred groups using querysets
            preferred_moods_qs = all_moods.filter(emoji__in=preferred_moods).order_by('-created_at')
            non_preferred_moods_qs = all_moods.exclude(emoji__in=preferred_moods).order_by('-created_at')

            # Convert to lists to combine (preferred first, then non-preferred)
            # This is necessary because we need to interleave the results
            preferred_moods_list = list(preferred_moods_qs)
            non_preferred_moods_list = list(non_preferred_moods_qs)

            # Combine: preferred moods first, then non-preferred moods
            personalized_moods = preferred_moods_list + non_preferred_moods_list
        else:
            # No preferences: show all moods in chronological order (newest first)
            personalized_moods = list(all_moods.order_by('-created_at'))

        # Paginate the results
        paginated_moods = self.paginate_queryset(personalized_moods, request, view=self)
        
        # Serialize the paginated results
        serializer = MoodFeedSerializer(
            paginated_moods, 
            many=True, 
            context={"request": request}
        )

        # Return paginated response
        return self.get_paginated_response(serializer.data)
