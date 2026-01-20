from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import Follow
from users.models import User


class UserMinimalSerializer(serializers.ModelSerializer):
    """Minimal user info for follower/following lists"""

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name"]
        read_only_fields = fields


class FollowSerializer(serializers.ModelSerializer):
    """Serializer for creating follow relationships"""

    follower = UserMinimalSerializer(read_only=True)
    following = UserMinimalSerializer(read_only=True)

    class Meta:
        model = Follow
        fields = ["id", "follower", "following", "created_at"]
        read_only_fields = ["id", "follower", "created_at"]

    def validate(self, attrs):
        request = self.context.get("request")
        following_user = self.context.get("following_user")

        # Prevent self-follow
        if request.user == following_user:
            raise serializers.ValidationError("You cannot follow yourself.")

        # Prevent duplicate follow
        if Follow.objects.filter(
            follower=request.user, following=following_user
        ).exists():
            raise serializers.ValidationError("You are already following this user.")

        return attrs

    def create(self, validated_data):
        request = self.context.get("request")
        following_user = self.context.get("following_user")

        return Follow.objects.create(follower=request.user, following=following_user)


class FollowerListSerializer(serializers.ModelSerializer):
    """Serializer for listing followers (people who follow a user)"""

    follower = UserMinimalSerializer(read_only=True)

    class Meta:
        model = Follow
        fields = ["id", "follower", "created_at"]
        read_only_fields = fields


class FollowingListSerializer(serializers.ModelSerializer):
    """Serializer for listing following (people a user follows)"""

    following = UserMinimalSerializer(read_only=True)

    class Meta:
        model = Follow
        fields = ["id", "following", "created_at"]
        read_only_fields = fields
