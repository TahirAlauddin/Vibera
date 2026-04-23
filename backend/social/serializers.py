from rest_framework import serializers
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

        if request.user == following_user:
            raise serializers.ValidationError("You cannot follow yourself.")

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
    """People who follow the target user."""

    follower = UserMinimalSerializer(read_only=True)
    is_following = serializers.SerializerMethodField()
    is_follower = serializers.SerializerMethodField()
    is_mutual = serializers.SerializerMethodField()

    class Meta:
        model = Follow
        fields = [
            "id",
            "follower",
            "created_at",
            "is_following",
            "is_follower",
            "is_mutual",
        ]
        read_only_fields = fields

    def get_is_following(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        if obj.follower_id == request.user.id:
            return False
        return Follow.objects.filter(
            follower=request.user, following_id=obj.follower_id
        ).exists()

    def get_is_follower(self, obj):
        return True

    def get_is_mutual(self, obj):
        return self.get_is_following(obj)


class FollowingListSerializer(serializers.ModelSerializer):
    """People the target user follows."""

    following = UserMinimalSerializer(read_only=True)
    is_following = serializers.SerializerMethodField()
    is_follower = serializers.SerializerMethodField()
    is_mutual = serializers.SerializerMethodField()

    class Meta:
        model = Follow
        fields = [
            "id",
            "following",
            "created_at",
            "is_following",
            "is_follower",
            "is_mutual",
        ]
        read_only_fields = fields

    def get_is_following(self, obj):
        return True

    def get_is_follower(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        if obj.following_id == request.user.id:
            return False
        return Follow.objects.filter(
            follower_id=obj.following_id, following=request.user
        ).exists()

    def get_is_mutual(self, obj):
        return self.get_is_follower(obj)


class SocialUserSuggestionSerializer(serializers.ModelSerializer):
    """User card for discovery / suggestions."""

    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "is_following"]
        read_only_fields = fields

    def get_is_following(self, user):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return Follow.objects.filter(follower=request.user, following=user).exists()
