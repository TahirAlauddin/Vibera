from rest_framework import serializers
from .models import Mood, MoodTag


class MoodTagSerializer(serializers.ModelSerializer):
    """Serializer for MoodTag model"""

    class Meta:
        model = MoodTag
        fields = ["id", "name", "color"]


class MoodLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    tags = MoodTagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=MoodTag.objects.all(),
        many=True,
        write_only=True,
        required=False,
        source="tags",
    )
from .models import Mood, MoodComment


class MoodCommentSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)
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

    def get_replies(self, obj):
        """Return nested replies ordered by creation date"""
        replies = obj.replies.all().order_by("created_at")
        return MoodCommentSerializer(replies, many=True, read_only=True).data

    def get_reply_count(self, obj):
        """Return the number of direct replies"""
        return obj.replies.count()

    def validate_content(self, value):
        """Ensure content is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Comment content cannot be empty.")
        return value.strip()

    def create(self, validated_data):
        request = self.context["request"]
        return MoodComment.objects.create(user=request.user, **validated_data)


class MoodLogSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Mood
        fields = [
            "id",
            "user",
            "emoji",
            "reason",
            "tags",
            "tag_ids",
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
        tags = validated_data.pop("tags", [])
        mood = Mood.objects.create(user=request.user, **validated_data)
        if tags:
            mood.tags.set(tags)
        return mood

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if tags is not None:
            instance.tags.set(tags)

        return instance
