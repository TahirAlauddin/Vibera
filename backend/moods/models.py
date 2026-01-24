from django.db import models
from django.conf import settings


class MoodTag(models.Model):
    """
    Predefined tags that can be associated with mood entries.
    Tags help categorize moods (e.g., 'work', 'family', 'health').
    """

    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(
        max_length=7,
        default="#6366f1",
        help_text="Hex color code for the tag (e.g., #6366f1)",
    )

    class Meta:
        ordering = ["name"]
        verbose_name = "Mood Tag"
        verbose_name_plural = "Mood Tags"

    def __str__(self):
        return self.name


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
    tags = models.ManyToManyField(
        MoodTag, blank=True, related_name="moods", help_text="Tags associated with this mood"
    )
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
