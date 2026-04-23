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
    SocialUserSuggestionSerializer,
)
from .services import sync_user_follow_counts


class FollowUserView(APIView):
    """POST - Follow a user"""

    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        following_user = get_object_or_404(User, id=user_id)

        serializer = FollowSerializer(
            data={},
            context={"request": request, "following_user": following_user},
        )

        if serializer.is_valid():
            follow = serializer.save()
            return Response(
                FollowSerializer(follow, context={"request": request}).data,
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UnfollowUserView(APIView):
    """DELETE - Unfollow a user"""

    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        following_user = get_object_or_404(User, id=user_id)
        follow = get_object_or_404(
            Follow, follower=request.user, following=following_user
        )
        follow.delete()
        return Response(
            {
                "message": f"Successfully unfollowed {following_user.username}",
                "user_id": following_user.id,
                "is_following": False,
            },
            status=status.HTTP_200_OK,
        )


class GetFollowersView(APIView):
    """GET - Followers of a user (default: authenticated user)"""

    permission_classes = [IsAuthenticated]

    def get(self, request, user_id=None):
        user = get_object_or_404(User, id=user_id) if user_id else request.user

        followers = (
            Follow.objects.filter(following=user)
            .select_related("follower")
            .order_by("-created_at")
        )
        serializer = FollowerListSerializer(
            followers, many=True, context={"request": request}
        )
        return Response(
            {"count": followers.count(), "results": serializer.data},
            status=status.HTTP_200_OK,
        )


class GetFollowingView(APIView):
    """GET - Users followed by a user (default: authenticated user)"""

    permission_classes = [IsAuthenticated]

    def get(self, request, user_id=None):
        user = get_object_or_404(User, id=user_id) if user_id else request.user

        following = (
            Follow.objects.filter(follower=user)
            .select_related("following")
            .order_by("-created_at")
        )
        serializer = FollowingListSerializer(
            following, many=True, context={"request": request}
        )
        return Response(
            {"count": following.count(), "results": serializer.data},
            status=status.HTTP_200_OK,
        )


class SocialStatsView(APIView):
    """GET - Live follower/following counts for the authenticated user"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        followers_count = Follow.objects.filter(following=user).count()
        following_count = Follow.objects.filter(follower=user).count()

        following_ids = Follow.objects.filter(follower=user).values_list(
            "following_id", flat=True
        )
        friends_count = Follow.objects.filter(
            follower_id__in=following_ids, following=user
        ).count()

        sync_user_follow_counts(user)

        return Response(
            {
                "followers_count": followers_count,
                "following_count": following_count,
                "friends_count": friends_count,
            }
        )


class FollowSuggestionsView(APIView):
    """GET - Users you are not following yet (for discovery)"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        following_ids = Follow.objects.filter(follower=request.user).values_list(
            "following_id", flat=True
        )
        suggestions = (
            User.objects.filter(is_active=True)
            .exclude(id=request.user.id)
            .exclude(id__in=following_ids)
            .order_by("username")[:20]
        )
        serializer = SocialUserSuggestionSerializer(
            suggestions, many=True, context={"request": request}
        )
        return Response({"count": len(serializer.data), "results": serializer.data})


class FollowStatusView(APIView):
    """GET - Follow relationship status between you and another user"""

    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        target = get_object_or_404(User, id=user_id)
        if target.id == request.user.id:
            return Response(
                {
                    "user_id": target.id,
                    "is_self": True,
                    "is_following": False,
                    "is_follower": False,
                    "is_mutual": False,
                }
            )

        is_following = Follow.objects.filter(
            follower=request.user, following=target
        ).exists()
        is_follower = Follow.objects.filter(
            follower=target, following=request.user
        ).exists()

        return Response(
            {
                "user_id": target.id,
                "is_self": False,
                "is_following": is_following,
                "is_follower": is_follower,
                "is_mutual": is_following and is_follower,
            }
        )
