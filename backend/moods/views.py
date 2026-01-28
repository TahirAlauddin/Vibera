from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Mood, MoodComment
from .serializers import MoodLogSerializer, MoodCommentSerializer


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


class MoodLogView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve all mood logs for the authenticated user"""
        moods = Mood.objects.filter(user=request.user)
        serializer = MoodLogSerializer(moods, many=True)

        return Response(
            {"count": moods.count(), "data": serializer.data}, status=status.HTTP_200_OK
        )

    def post(self, request):
        """Create a new mood log for the authenticated user"""
        serializer = MoodLogSerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            mood = serializer.save()
            return Response(
                {"message": "Mood logged successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MoodLogDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        """Helper method to get a mood object and verify ownership"""
        try:
            mood = Mood.objects.get(pk=pk, user=user)
            return mood
        except Mood.DoesNotExist:
            return None

    def get(self, request, pk):
        """Retrieve a specific mood log by ID"""
        mood = self.get_object(pk, request.user)

        if mood is None:
            return Response(
                {"error": "Mood log not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = MoodLogSerializer(mood)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """Update a mood log (full update)"""
        mood = self.get_object(pk, request.user)

        if mood is None:
            return Response(
                {"error": "Mood log not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = MoodLogSerializer(
            mood, data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Mood log updated successfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """Partially update a mood log"""
        mood = self.get_object(pk, request.user)

        if mood is None:
            return Response(
                {"error": "Mood log not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = MoodLogSerializer(
            mood, data=request.data, partial=True, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Mood log updated successfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete a mood log"""
        mood = self.get_object(pk, request.user)

        if mood is None:
            return Response(
                {"error": "Mood log not found"}, status=status.HTTP_404_NOT_FOUND
            )

        mood.delete()
        return Response(
            {"message": "Mood log deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


class MoodCommentListView(APIView):
    """List and create comments for a specific mood"""

    permission_classes = [IsAuthenticated]

    def get(self, request, mood_id):
        """Retrieve all top-level comments for a mood (with nested replies)"""
        mood = get_object_or_404(Mood, id=mood_id)
        comments = mood.comments.filter(parent__isnull=True).order_by("-created_at")
        serializer = MoodCommentSerializer(comments, many=True)
        return Response(
            {"count": comments.count(), "data": serializer.data},
            status=status.HTTP_200_OK,
        )

    def post(self, request, mood_id):
        """Create a new top-level comment on a mood"""
        mood = get_object_or_404(Mood, id=mood_id)
        serializer = MoodCommentSerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            comment = serializer.save(mood=mood)
            return Response(
                {"message": "Comment created successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MoodCommentDetailView(APIView):
    """Update and delete a specific comment"""

    permission_classes = [IsAuthenticated]

    def put(self, request, comment_id):
        """Update a comment (full update)"""
        comment = get_object_or_404(MoodComment, id=comment_id)

        # Check if user owns the comment
        if comment.user != request.user:
            return Response(
                {"error": "You do not have permission to update this comment."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = MoodCommentSerializer(
            comment, data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Comment updated successfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, comment_id):
        """Partially update a comment"""
        comment = get_object_or_404(MoodComment, id=comment_id)

        # Check if user owns the comment
        if comment.user != request.user:
            return Response(
                {"error": "You do not have permission to update this comment."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = MoodCommentSerializer(
            comment, data=request.data, partial=True, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Comment updated successfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, comment_id):
        """Delete a comment"""
        comment = get_object_or_404(MoodComment, id=comment_id)

        # Check if user owns the comment
        if comment.user != request.user:
            return Response(
                {"error": "You do not have permission to delete this comment."},
                status=status.HTTP_403_FORBIDDEN,
            )

        comment.delete()
        return Response(
            {"message": "Comment deleted successfully"}, status=status.HTTP_200_OK
        )


class MoodCommentReplyView(APIView):
    """Create a reply to an existing comment"""

    permission_classes = [IsAuthenticated]

    def post(self, request, comment_id):
        """Create a reply to an existing comment"""
        parent_comment = get_object_or_404(MoodComment, id=comment_id)

        serializer = MoodCommentSerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            # Create reply with parent and same mood as parent
            reply = serializer.save(mood=parent_comment.mood, parent=parent_comment)
            return Response(
                {"message": "Reply created successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      