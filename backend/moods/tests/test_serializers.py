"""
Tests for DRF Serializers.

Serializer tests cover:
1. Serialization - Model instance → JSON (output)
2. Deserialization - JSON → Model instance (input)
3. Validation - Valid and invalid data
4. Custom fields - Computed/method fields
5. Context handling - request.user for create operations
"""

import pytest
from unittest.mock import Mock
from rest_framework.test import APIRequestFactory
from moods.serializers import MoodLogSerializer, MoodCommentSerializer
from moods.models import Mood, MoodComment


# =============================================================================
# MoodLogSerializer Tests
# =============================================================================


@pytest.mark.django_db
class TestMoodLogSerializer:
    """Tests for MoodLogSerializer."""

    # -------------------------------------------------------------------------
    # Serialization (Model → JSON)
    # -------------------------------------------------------------------------

    def test_serialization_contains_expected_fields(self, mood):
        """Serialized mood contains all expected fields."""
        serializer = MoodLogSerializer(mood)
        data = serializer.data

        expected_fields = {
            "id",
            "user",
            "emoji",
            "reason",
            "comment_count",
            "created_at",
            "updated_at",
        }
        assert set(data.keys()) == expected_fields

    def test_serialization_user_is_username(self, mood):
        """User field is serialized as username string, not ID."""
        serializer = MoodLogSerializer(mood)
        data = serializer.data

        assert data["user"] == mood.user.username
        assert isinstance(data["user"], str)

    def test_serialization_emoji_value(self, mood):
        """Emoji field is correctly serialized."""
        serializer = MoodLogSerializer(mood)
        data = serializer.data

        assert data["emoji"] == mood.emoji

    def test_serialization_reason_value(self, mood):
        """Reason field is correctly serialized."""
        serializer = MoodLogSerializer(mood)
        data = serializer.data

        assert data["reason"] == mood.reason

    def test_serialization_comment_count_zero(self, mood):
        """Comment count is 0 for mood without comments."""
        serializer = MoodLogSerializer(mood)
        data = serializer.data

        assert data["comment_count"] == 0

    def test_serialization_comment_count_with_comments(self, mood, other_user):
        """Comment count reflects actual top-level comments."""
        # Create top-level comments
        MoodComment.objects.create(mood=mood, user=other_user, content="Comment 1")
        MoodComment.objects.create(mood=mood, user=other_user, content="Comment 2")

        serializer = MoodLogSerializer(mood)
        data = serializer.data
        assert data["comment_count"] == 2

    def test_serialization_many_moods(self, user, mood_factory):
        """Serializer handles many=True for lists."""
        mood1 = mood_factory(user=user, emoji="😊")
        mood2 = mood_factory(user=user, emoji="😔")

        serializer = MoodLogSerializer([mood1, mood2], many=True)
        data = serializer.data

        assert len(data) == 2
        assert data[0]["emoji"] == "😊"
        assert data[1]["emoji"] == "😔"

    # -------------------------------------------------------------------------
    # Deserialization & Validation (JSON → Model)
    # -------------------------------------------------------------------------

    def test_deserialization_valid_data(self, user):
        """Valid data passes validation."""
        data = {"emoji": "😊", "reason": "Feeling good"}

        # Create mock request with user
        request = Mock()
        request.user = user

        serializer = MoodLogSerializer(data=data, context={"request": request})

        assert serializer.is_valid(), serializer.errors
        assert serializer.validated_data["emoji"] == "😊"
        assert serializer.validated_data["reason"] == "Feeling good"

    def test_deserialization_minimal_data(self, user):
        """Only required fields are needed."""
        data = {"emoji": "😊"}  # reason is optional

        request = Mock()
        request.user = user

        serializer = MoodLogSerializer(data=data, context={"request": request})

        assert serializer.is_valid(), serializer.errors

    def test_deserialization_invalid_emoji(self, user):
        """Invalid emoji fails validation."""
        data = {"emoji": "invalid"}

        request = Mock()
        request.user = user

        serializer = MoodLogSerializer(data=data, context={"request": request})

        assert not serializer.is_valid()
        assert "emoji" in serializer.errors

    def test_deserialization_missing_emoji(self, user):
        """Missing required emoji fails validation."""
        data = {"reason": "No emoji provided"}

        request = Mock()
        request.user = user

        serializer = MoodLogSerializer(data=data, context={"request": request})

        assert not serializer.is_valid()
        assert "emoji" in serializer.errors

    def test_deserialization_ignores_readonly_fields(self, user):
        """Read-only fields are ignored in input."""
        data = {
            "emoji": "😊",
            "user": "hacker",  # Should be ignored
            "id": 99999,  # Should be ignored
        }

        request = Mock()
        request.user = user

        serializer = MoodLogSerializer(data=data, context={"request": request})

        assert serializer.is_valid()
        # user and id should not be in validated_data
        assert "user" not in serializer.validated_data
        assert "id" not in serializer.validated_data

    # -------------------------------------------------------------------------
    # Update Operation
    # -------------------------------------------------------------------------

    def test_update_mood(self, mood, user):
        """Serializer can update existing mood."""
        data = {"emoji": "😔", "reason": "Changed mood"}

        request = Mock()
        request.user = user

        serializer = MoodLogSerializer(mood, data=data, context={"request": request})
        assert serializer.is_valid()

        updated_mood = serializer.save()

        assert updated_mood.pk == mood.pk
        assert updated_mood.emoji == "😔"
        assert updated_mood.reason == "Changed mood"

    def test_partial_update_mood(self, mood, user):
        """Serializer can partially update mood."""
        original_emoji = mood.emoji
        data = {"reason": "Only update reason"}

        request = Mock()
        request.user = user

        serializer = MoodLogSerializer(
            mood, data=data, partial=True, context={"request": request}
        )
        assert serializer.is_valid()

        updated_mood = serializer.save()

        assert updated_mood.emoji == original_emoji  # Unchanged
        assert updated_mood.reason == "Only update reason"


# =============================================================================
# MoodCommentSerializer Tests
# =============================================================================


@pytest.mark.django_db
class TestMoodCommentSerializer:
    """Tests for MoodCommentSerializer."""

    # -------------------------------------------------------------------------
    # Serialization (Model → JSON)
    # -------------------------------------------------------------------------

    def test_serialization_contains_expected_fields(self, user, mood):
        """Serialized comment contains all expected fields."""
        comment = MoodComment.objects.create(
            mood=mood, user=user, content="Test comment"
        )

        serializer = MoodCommentSerializer(comment)
        data = serializer.data

        expected_fields = {
            "id",
            "user",
            "content",
            "parent",
            "replies",
            "reply_count",
            "created_at",
            "updated_at",
        }
        assert set(data.keys()) == expected_fields

    def test_serialization_user_is_username(self, user, mood):
        """User field is serialized as username."""
        comment = MoodComment.objects.create(mood=mood, user=user, content="Test")

        serializer = MoodCommentSerializer(comment)
        data = serializer.data

        assert data["user"] == user.username

    def test_serialization_replies_empty(self, user, mood):
        """Replies field is empty list when no replies."""
        comment = MoodComment.objects.create(mood=mood, user=user, content="No replies")

        serializer = MoodCommentSerializer(comment)
        data = serializer.data

        assert data["replies"] == []
        assert data["reply_count"] == 0

    def test_serialization_replies_with_data(self, user, other_user, mood):
        """Replies field contains nested reply data."""
        parent = MoodComment.objects.create(mood=mood, user=user, content="Parent")
        reply1 = MoodComment.objects.create(
            mood=mood, user=other_user, content="Reply 1", parent=parent
        )
        reply2 = MoodComment.objects.create(
            mood=mood, user=user, content="Reply 2", parent=parent
        )

        serializer = MoodCommentSerializer(parent)
        data = serializer.data

        assert data["reply_count"] == 2
        assert len(data["replies"]) == 2

        # Replies should be serialized with same structure
        reply_contents = [r["content"] for r in data["replies"]]
        assert "Reply 1" in reply_contents
        assert "Reply 2" in reply_contents

    # -------------------------------------------------------------------------
    # Validation
    # -------------------------------------------------------------------------

    def test_validation_valid_content(self, user):
        """Valid content passes validation."""
        data = {"content": "This is a valid comment"}

        request = Mock()
        request.user = user

        serializer = MoodCommentSerializer(data=data, context={"request": request})

        assert serializer.is_valid(), serializer.errors

    def test_validation_empty_content_fails(self, user):
        """Empty content fails validation."""
        data = {"content": ""}

        request = Mock()
        request.user = user

        serializer = MoodCommentSerializer(data=data, context={"request": request})

        assert not serializer.is_valid()
        assert "content" in serializer.errors

    def test_validation_whitespace_content_fails(self, user):
        """Whitespace-only content fails validation."""
        data = {"content": "   "}

        request = Mock()
        request.user = user

        serializer = MoodCommentSerializer(data=data, context={"request": request})

        assert not serializer.is_valid()
        assert "content" in serializer.errors

    def test_validation_content_is_stripped(self, user):
        """Content is stripped of leading/trailing whitespace."""
        data = {"content": "  Trimmed content  "}

        request = Mock()
        request.user = user

        serializer = MoodCommentSerializer(data=data, context={"request": request})

        assert serializer.is_valid()
        assert serializer.validated_data["content"] == "Trimmed content"

    def test_validation_missing_content_fails(self, user):
        """Missing content field fails validation."""
        data = {}

        request = Mock()
        request.user = user

        serializer = MoodCommentSerializer(data=data, context={"request": request})

        assert not serializer.is_valid()
        assert "content" in serializer.errors

    # -------------------------------------------------------------------------
    # Create Operation
    # -------------------------------------------------------------------------

    def test_create_with_parent(self, user, mood, other_user):
        """Create reply with parent reference."""
        parent = MoodComment.objects.create(
            mood=mood, user=other_user, content="Parent"
        )

        data = {"content": "Reply to parent"}
        serializer = MoodCommentSerializer(data=data)
        assert serializer.is_valid()

        reply = serializer.save(user=user, mood=mood, parent=parent)

        assert reply.parent == parent
        assert reply.mood == mood

    # -------------------------------------------------------------------------
    # Update Operation
    # -------------------------------------------------------------------------

    def test_update_comment_content(self, user, mood):
        """Can update comment content."""
        comment = MoodComment.objects.create(mood=mood, user=user, content="Original")

        data = {"content": "Updated content"}

        request = Mock()
        request.user = user

        serializer = MoodCommentSerializer(
            comment, data=data, context={"request": request}
        )
        assert serializer.is_valid()

        updated = serializer.save()

        assert updated.content == "Updated content"
        assert updated.pk == comment.pk


# =============================================================================
# Serializer Edge Cases
# =============================================================================


@pytest.mark.django_db
class TestSerializerEdgeCases:
    """Edge cases and special scenarios for serializers."""

    def test_mood_serializer_with_null_reason(self, user):
        """Mood with null reason serializes correctly."""
        mood = Mood.objects.create(user=user, emoji="😊", reason=None)

        serializer = MoodLogSerializer(mood)
        data = serializer.data

        assert data["reason"] is None

    def test_many_serialization_preserves_order(self, user, mood_factory):
        """Many=True preserves order of input list."""
        moods = [
            mood_factory(user=user, emoji="😊"),
            mood_factory(user=user, emoji="😔"),
            mood_factory(user=user, emoji="😡"),
        ]

        serializer = MoodLogSerializer(moods, many=True)
        data = serializer.data

        # Order should match input
        assert data[0]["emoji"] == "😊"
        assert data[1]["emoji"] == "😔"
        assert data[2]["emoji"] == "😡"
