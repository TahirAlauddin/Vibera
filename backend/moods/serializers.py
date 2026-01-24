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

    class Meta:
        model = Mood
        fields = [
            "id",
            "user",
            "emoji",
            "reason",
            "tags",
            "tag_ids",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

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
