"""
Tests for Mood app models.

Tests cover:
- Mood model creation and validation
- EmojiJournalEntry model
- MoodComment model (including nested replies)
- Model relationships and cascading deletes
"""

import pytest
from django.contrib.auth import get_user_model
from moods.models import Mood, EmojiJournalEntry, MoodComment

User = get_user_model()


# =============================================================================
# Mood Model Tests
# =============================================================================


@pytest.mark.django_db
class TestMoodModel:
    """Tests for the Mood model."""

    def test_mood_creation(self, user):
        """Test basic mood creation."""
        mood = Mood.objects.create(user=user, emoji="😊")

        assert mood.pk is not None
        assert mood.emoji == "😊"
        assert mood.user == user
        assert mood.reason is None  # Optional field

    def test_mood_creation_with_reason(self, user):
        """Test mood creation with optional reason."""
        mood = Mood.objects.create(
            user=user, emoji="😔", reason="Had a tough day at work"
        )

        assert mood.emoji == "😔"
        assert mood.reason == "Had a tough day at work"

    def test_mood_str_representation(self, user):
        """Test the __str__ method of Mood."""
        mood = Mood.objects.create(user=user, emoji="😌")

        str_repr = str(mood)
        assert user.username in str_repr
        assert "😌" in str_repr

    def test_mood_ordering(self, user):
        """Test that moods are ordered by created_at descending."""
        mood1 = Mood.objects.create(user=user, emoji="😊")
        mood2 = Mood.objects.create(user=user, emoji="😔")
        mood3 = Mood.objects.create(user=user, emoji="😌")

        moods = list(Mood.objects.all())
        # Most recent first
        assert moods[0] == mood3
        assert moods[1] == mood2
        assert moods[2] == mood1

    def test_mood_user_relationship(self, user):
        """Test the reverse relationship from user to moods."""
        Mood.objects.create(user=user, emoji="😊")
        Mood.objects.create(user=user, emoji="😔")

        assert user.moods.count() == 2

    def test_mood_cascade_delete(self, user):
        """Test that moods are deleted when user is deleted."""
        Mood.objects.create(user=user, emoji="😊")
        Mood.objects.create(user=user, emoji="😔")

        assert Mood.objects.count() == 2

        user.delete()

        assert Mood.objects.count() == 0

    @pytest.mark.parametrize(
        "emoji,expected",
        [
            ("😊", "😊"),
            ("😔", "😔"),
            ("😡", "😡"),
            ("😰", "😰"),
            ("😴", "😴"),
            ("😌", "😌"),
        ],
    )
    def test_mood_choices(self, user, emoji, expected):
        """Test all valid mood emoji choices."""
        mood = Mood.objects.create(user=user, emoji=emoji)
        assert mood.emoji == expected


# =============================================================================
# EmojiJournalEntry Model Tests
# =============================================================================


@pytest.mark.django_db
class TestEmojiJournalEntryModel:
    """Tests for the EmojiJournalEntry model."""

    def test_journal_entry_creation(self, user):
        """Test basic journal entry creation."""
        mood = Mood.objects.create(user=user, emoji="😊")
        entry = EmojiJournalEntry.objects.create(
            mood=mood, user=user, note="Feeling great today!"
        )

        assert entry.pk is not None
        assert entry.mood == mood
        assert entry.user == user
        assert entry.note == "Feeling great today!"

    def test_journal_entry_without_note(self, user):
        """Test journal entry with optional note field."""
        mood = Mood.objects.create(user=user, emoji="😊")
        entry = EmojiJournalEntry.objects.create(mood=mood, user=user)

        assert entry.note is None

    def test_journal_entry_str_representation(self, user):
        """Test the __str__ method of EmojiJournalEntry."""
        mood = Mood.objects.create(user=user, emoji="😊")
        entry = EmojiJournalEntry.objects.create(mood=mood, user=user)

        str_repr = str(entry)
        assert "😊" in str_repr
        assert user.username in str_repr

    def test_mood_journal_entries_relationship(self, user):
        """Test reverse relationship from mood to journal entries."""
        mood = Mood.objects.create(user=user, emoji="😊")
        EmojiJournalEntry.objects.create(mood=mood, user=user, note="Entry 1")
        EmojiJournalEntry.objects.create(mood=mood, user=user, note="Entry 2")

        assert mood.journal_entries.count() == 2


# =============================================================================
# MoodComment Model Tests
# =============================================================================


@pytest.mark.django_db
class TestMoodCommentModel:
    """Tests for the MoodComment model."""

    def test_comment_creation(self, user):
        """Test basic comment creation."""
        mood = Mood.objects.create(user=user, emoji="😊")
        comment = MoodComment.objects.create(
            mood=mood, user=user, content="Great mood!"
        )

        assert comment.pk is not None
        assert comment.mood == mood
        assert comment.user == user
        assert comment.content == "Great mood!"
        assert comment.parent is None  # Top-level comment

    def test_nested_reply_creation(self, user_factory):
        """Test creating nested comment replies."""
        user1 = user_factory(username="user1")
        user2 = user_factory(username="user2")

        mood = Mood.objects.create(user=user1, emoji="😊")

        # Top-level comment
        parent_comment = MoodComment.objects.create(
            mood=mood, user=user1, content="Original comment"
        )

        # Reply to the comment
        reply = MoodComment.objects.create(
            mood=mood, user=user2, content="This is a reply", parent=parent_comment
        )

        assert reply.parent == parent_comment
        assert parent_comment.replies.count() == 1
        assert parent_comment.replies.first() == reply

    def test_comment_str_representation(self, user):
        """Test the __str__ method of MoodComment."""
        mood = Mood.objects.create(user=user, emoji="😊")
        comment = MoodComment.objects.create(
            mood=mood, user=user, content="This is a test comment"
        )

        str_repr = str(comment)
        assert user.username in str_repr
        assert "This is a test comment" in str_repr

    def test_comment_str_truncation(self, user):
        """Test that long comments are truncated in __str__."""
        mood = Mood.objects.create(user=user, emoji="😊")
        long_content = "A" * 100  # 100 character comment
        comment = MoodComment.objects.create(mood=mood, user=user, content=long_content)

        str_repr = str(comment)
        assert "..." in str_repr  # Should be truncated

    def test_mood_comments_relationship(self, user):
        """Test reverse relationship from mood to comments."""
        mood = Mood.objects.create(user=user, emoji="😊")
        MoodComment.objects.create(mood=mood, user=user, content="Comment 1")
        MoodComment.objects.create(mood=mood, user=user, content="Comment 2")

        assert mood.comments.count() == 2

    def test_comment_cascade_delete_with_mood(self, user):
        """Test that comments are deleted when mood is deleted."""
        mood = Mood.objects.create(user=user, emoji="😊")
        MoodComment.objects.create(mood=mood, user=user, content="Comment")

        assert MoodComment.objects.count() == 1

        mood.delete()

        assert MoodComment.objects.count() == 0

    def test_nested_reply_cascade_delete(self, user):
        """Test that nested replies are deleted when parent is deleted."""
        mood = Mood.objects.create(user=user, emoji="😊")

        parent = MoodComment.objects.create(
            mood=mood, user=user, content="Parent comment"
        )
        MoodComment.objects.create(
            mood=mood, user=user, content="Reply 1", parent=parent
        )
        MoodComment.objects.create(
            mood=mood, user=user, content="Reply 2", parent=parent
        )

        assert MoodComment.objects.count() == 3

        parent.delete()

        # Parent and all replies should be deleted
        assert MoodComment.objects.count() == 0
