from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

# Create your views here.


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
