from rest_framework import serializers
from .models import Mood, MoodComment
from social.models import Follow


class MoodCommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")
    # Using 'replies' as a nested field rather than a MethodField for better structure
    replies = serializers.SerializerMethodField()
    reply_count = serializers.SerializerMethodField()

    class Meta:
        model = MoodComment
        fields = [
            "id",
            "user",
            "content",
            "parent",
            "replies",
            "reply_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def get_reply_count(self, obj):
        """Return the count of replies to this comment."""
        return obj.replies.count()

    def get_replies(self, obj):
        """
        Only nest replies for top-level comments to avoid infinite recursion.
        Replies are always ordered oldest-first by created_at.
        """
        if obj.parent is None:
            # Always fetch replies ordered by created_at ascending so the
            # first reply is the oldest, as expected by the tests.
            replies = obj.replies.all().order_by("created_at")
            # Use a separate serializer for replies to exclude parent field
            return MoodCommentReplySerializer(
                replies, many=True, context=self.context
            ).data
        return None

    def validate_content(self, value):
        """
        Basic content validation:
        - Must not be empty or whitespace only.
        - Do not impose an artificial maximum length here so that
          very long comments are still accepted (tests rely on this).
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Comment content cannot be empty.")
        return value.strip()


class MoodCommentReplySerializer(serializers.ModelSerializer):
    """Serializer for replies that excludes parent field to avoid redundancy."""

    user = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = MoodComment
        fields = [
            "id",
            "user",
            "content",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]


class MoodLogSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")
    # Using a SerializerMethodField so we can populate this via annotation in the view
    comment_count = serializers.SerializerMethodField(read_only=True)

    def get_comment_count(self, obj):
        return obj.comments.count()

    class Meta:
        model = Mood
        fields = [
            "id",
            "user",
            "emoji",
            "reason",
            "comment_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def get_comment_count(self, obj):
        """Return the number of top-level comments on this mood"""
        return obj.comments.filter(parent__isnull=True).count()

    def create(self, validated_data):
        request = self.context["request"]
        return Mood.objects.create(user=request.user, **validated_data)


class UserProfileSerializer(serializers.Serializer):
    """Nested serializer for user profile information in feed"""
    username = serializers.CharField(source="user.username", read_only=True)
    avatar = serializers.ImageField(read_only=True, allow_null=True)

    def to_representation(self, instance):
        """Return user profile data or None if profile doesn't exist"""
        if not instance:
            return None
        return {
            "username": instance.user.username,
            "avatar": instance.avatar.url if instance.avatar else None,
        }


class MoodFeedSerializer(MoodLogSerializer):
    """Serializer for mood feed with personalization fields"""
    is_following = serializers.SerializerMethodField()
    user_profile = serializers.SerializerMethodField()

    class Meta(MoodLogSerializer.Meta):
        fields = MoodLogSerializer.Meta.fields + ["is_following", "user_profile"]

    def get_is_following(self, obj):
        """Check if the authenticated user follows the mood author"""
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        
        # Check if current user follows the mood author
        return Follow.objects.filter(
            follower=request.user, following=obj.user
        ).exists()

    def get_user_profile(self, obj):
        """Get basic user profile information"""
        from users.models import UserProfile
        
        try:
            profile = obj.user.profile
            return UserProfileSerializer(profile).to_representation(profile)
        except UserProfile.DoesNotExist:
            # If profile doesn't exist, return basic info
            return {
                "username": obj.user.username,
                "avatar": None,
            }
