from django.db import models
from django.conf import settings


class Mood(models.Model):
    """
    Represents a user's mood at a specific point in time, allowing them to track
    emotional states along with an optional reason for that mood.
    """

    MOOD_CHOICES = [
        ("😊", "Happy"),
        ("😔", "Sad"),
        ("😡", "Angry"),
        ("😰", "Anxious"),
        ("😴", "Tired"),
        ("😌", "Calm"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="moods"
    )
    emoji = models.CharField(max_length=2, choices=MOOD_CHOICES)
    reason = models.TextField(blank=True, null=True, help_text="What caused this mood?")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Mood"
        verbose_name_plural = "Moods"

    def __str__(self):
        return f"{self.user.username} - {self.emoji} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"


class EmojiJournalEntry(models.Model):
    """
    Stores a journal entry connected to a specific mood selection.
    This allows a user to log their emotional state with context and reflection.
    """

    mood = models.ForeignKey(
        Mood, on_delete=models.CASCADE, related_name="journal_entries"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="mood_entries"
    )
    note = models.TextField(
        blank=True, null=True, help_text="Write what happened or why you felt this way."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Journal Entry"
        verbose_name_plural = "Journal Entries"

    def __str__(self):
        return f"Entry: {self.mood.emoji} by {self.user.username} at {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class MoodComment(models.Model):
    """
    Represents a comment on a mood post. Supports nested replies through
    the parent field. Comments are public and can be made by any authenticated user.
    """

    mood = models.ForeignKey(
        Mood, on_delete=models.CASCADE, related_name="comments"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="mood_comments",
    )
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="replies",
        help_text="Parent comment for nested replies. Null for top-level comments.",
    )
    content = models.TextField(help_text="Comment text content")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Mood Comment"
        verbose_name_plural = "Mood Comments"
        indexes = [
            models.Index(fields=["mood"], name="mood_comment_mood_idx"),
            models.Index(fields=["parent"], name="mood_comment_parent_idx"),
        ]

    def __str__(self):
        preview = self.content[:50] + "..." if len(self.content) > 50 else self.content
        return f"Comment by {self.user.username} on mood {self.mood.id}: {preview}"