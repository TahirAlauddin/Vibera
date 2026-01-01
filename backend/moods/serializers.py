from rest_framework import serializers
from .models import Mood


class MoodLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Mood
        fields = ["id", "user", "emoji", "reason", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def create(self, validated_data):
        request = self.context["request"]
        return Mood.objects.create(user=request.user, **validated_data)
