from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from vibera.logging_config import get_logger

from .models import Mood, MoodTag
from .serializers import MoodLogSerializer, MoodTagSerializer

# Logger for moods domain - creates 'moods.views' logger
# This automatically inherits from the 'moods' logger configuration in settings.py
logger = get_logger(__name__)


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

        logger.warning(
            "Mood log creation failed - validation errors",
            extra={
                "type": "mood_log_create_validation_error",
                "user_id": request.user.id,
                "errors": serializer.errors,
            },
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
            logger.warning(
                "Mood log retrieval failed - not found",
                extra={
                    "type": "mood_log_not_found",
                    "user_id": request.user.id,
                    "mood_id": pk,
                },
            )
            return Response(
                {"error": "Mood log not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = MoodLogSerializer(mood)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """Update a mood log (full update)"""
        mood = self.get_object(pk, request.user)

        if mood is None:
            logger.warning(
                "Mood log update failed - not found",
                extra={
                    "type": "mood_log_update_not_found",
                    "user_id": request.user.id,
                    "mood_id": pk,
                },
            )
            return Response(
                {"error": "Mood log not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = MoodLogSerializer(
            mood, data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            logger.info(
                "Mood log updated successfully",
                extra={
                    "type": "mood_log_update_success",
                    "user_id": request.user.id,
                    "mood_id": pk,
                },
            )
            return Response(
                {"message": "Mood log updated successfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

        logger.warning(
            "Mood log update failed - validation errors",
            extra={
                "type": "mood_log_update_validation_error",
                "user_id": request.user.id,
                "mood_id": pk,
                "errors": serializer.errors,
            },
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """Partially update a mood log"""
        mood = self.get_object(pk, request.user)

        if mood is None:
            logger.warning(
                "Mood log partial update failed - not found",
                extra={
                    "type": "mood_log_patch_not_found",
                    "user_id": request.user.id,
                    "mood_id": pk,
                },
            )
            return Response(
                {"error": "Mood log not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = MoodLogSerializer(
            mood, data=request.data, partial=True, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            logger.info(
                "Mood log partially updated successfully",
                extra={
                    "type": "mood_log_patch_success",
                    "user_id": request.user.id,
                    "mood_id": pk,
                },
            )
            return Response(
                {"message": "Mood log updated successfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

        logger.warning(
            "Mood log partial update failed - validation errors",
            extra={
                "type": "mood_log_patch_validation_error",
                "user_id": request.user.id,
                "mood_id": pk,
                "errors": serializer.errors,
            },
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete a mood log"""
        mood = self.get_object(pk, request.user)

        if mood is None:
            logger.warning(
                "Mood log deletion failed - not found",
                extra={
                    "type": "mood_log_delete_not_found",
                    "user_id": request.user.id,
                    "mood_id": pk,
                },
            )
            return Response(
                {"error": "Mood log not found"}, status=status.HTTP_404_NOT_FOUND
            )

        mood_id = mood.id
        mood.delete()

        logger.info(
            "Mood log deleted successfully",
            extra={
                "type": "mood_log_delete_success",
                "user_id": request.user.id,
                "mood_id": mood_id,
            },
        )
        return Response(
            {"message": "Mood log deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


class MoodTagListView(APIView):
    """View for listing available mood tags"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve all available tags"""
        tags = MoodTag.objects.all()
        serializer = MoodTagSerializer(tags, many=True)
        return Response(
            {"count": tags.count(), "data": serializer.data}, status=status.HTTP_200_OK
        )
