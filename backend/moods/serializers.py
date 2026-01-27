from rest_framework import serializers
from .models import Mood, MoodComment

class MoodCommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")
    # Using 'replies' as a nested field rather than a MethodField for better structure
    replies = serializers.SerializerMethodField()
    reply_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = MoodComment
        fields = [
            "id", "user", "content", "parent", 
            "replies", "reply_count", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def get_replies(self, obj):
        """
        Only nest replies for top-level comments to avoid infinite recursion.
        Prefetched replies are used to avoid N+1 queries.
        """
        if obj.parent is None:
            # Use prefetched replies if available, otherwise fall back to queryset
            replies = getattr(obj, '_prefetched_objects_cache', {}).get('replies', None)
            if replies is None:
                replies = obj.replies.all()
            # Use a separate serializer for replies to exclude parent field
            return MoodCommentReplySerializer(replies, many=True, context=self.context).data
        return None

    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError("Comment content cannot be empty.")
        if len(value.strip()) > 5000:  # Reasonable limit
            raise serializers.ValidationError("Comment content cannot exceed 5000 characters.")
        return value.strip()


class MoodCommentReplySerializer(serializers.ModelSerializer):
    """Serializer for replies that excludes parent field to avoid redundancy."""
    user = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = MoodComment
        fields = [
            "id", "user", "content", 
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]


class MoodLogSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")
    # Using an IntegerField so we can populate this via annotation in the view
    comment_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Mood
        fields = [
            "id", "user", "emoji", "reason", 
            "comment_count", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]