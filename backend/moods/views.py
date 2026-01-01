from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .models import Mood
from .serializers import MoodLogSerializer


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
