from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from users.models import User
from .models import Follow
from .serializers import (
    FollowSerializer,
    FollowerListSerializer,
    FollowingListSerializer,
)


class FollowUserView(APIView):
    """POST - Follow a user"""

    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        # Get the user to follow
        following_user = get_object_or_404(User, id=user_id)

        # Create serializer with context
        serializer = FollowSerializer(
            data={}, context={"request": request, "following_user": following_user}
        )

        if serializer.is_valid():
            follow = serializer.save()
            return Response(
                FollowSerializer(follow).data, status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UnfollowUserView(APIView):
    """DELETE - Unfollow a user"""

    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        # Get the user to unfollow
        following_user = get_object_or_404(User, id=user_id)
        # Get the follow relationship
        follow = get_object_or_404(
            Follow, follower=request.user, following=following_user
        )
        # Delete the follow relationship
        follow.delete()
        return Response(
            {"message": f"Successfully unfollowed {following_user.username}"},
            status=status.HTTP_200_OK,
        )


class GetFollowersView(APIView):
    """GET - Get followers of a user"""

    permission_classes = [IsAuthenticated]

    def get(self, request, user_id=None):
        # Get followers of specified user or authenticated user
        if user_id:
            user = get_object_or_404(User, id=user_id)
        else:
            user = request.user

        followers = Follow.objects.filter(following=user)
        serializer = FollowerListSerializer(followers, many=True)
        return Response(
            {"count": followers.count(), "results": serializer.data},
            status=status.HTTP_200_OK,
        )


class GetFollowingView(APIView):
    """GET - Get following of a user"""

    permission_classes = [IsAuthenticated]

    def get(self, request, user_id=None):
        # Get following of specified user or authenticated user
        if user_id:
            user = get_object_or_404(User, id=user_id)
        else:
            user = request.user

        following = Follow.objects.filter(follower=user)
        serializer = FollowingListSerializer(following, many=True)
        return Response(
            {"count": following.count(), "results": serializer.data},
            status=status.HTTP_200_OK,
        )
