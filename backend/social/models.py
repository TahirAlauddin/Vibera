from django.db import models
from django.core.exceptions import ValidationError
from users.models import User


class Follow(models.Model):
    follower = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="following"
    )
    following = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followers"
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = "Follow"
        verbose_name_plural = "Follows"
        unique_together = ["follower", "following"]
        ordering = ["-created_at"]
        indexes = [
            # 1. Composite - handles relationship checks + "who I follow" queries
            models.Index(fields=["follower", "following"], name="follow_pair_idx"),
            # 2. Following - handles "who follows me" queries
            models.Index(fields=["following"], name="follow_following_idx"),
            # 3. Created_at - handles sorting by recency
            models.Index(fields=["created_at"], name="follow_created_idx"),
        ]
        # Add database-level constraint for self-follow prevention
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(follower=models.F("following")),
                name="prevent_self_follow",
            )
        ]

    def is_mutual(self):
        """Check if the follow relationship is mutual"""
        return Follow.objects.filter(
            follower=self.following, following=self.follower
        ).exists()

    def clean(self):
        """Validate before saving"""
        if self.follower == self.following:
            raise ValidationError("You cannot follow yourself.")

    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"
