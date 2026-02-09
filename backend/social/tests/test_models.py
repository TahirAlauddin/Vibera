"""
Tests for Social app models.

Tests cover:
- Follow model creation and validation
- Self-follow prevention (clean + DB constraint)
- Unique follower/following pair
- is_mutual() behavior
- Ordering and str representation
"""

import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from social.models import Follow


# =============================================================================
# Follow Model Tests
# =============================================================================


@pytest.mark.django_db
class TestFollowModel:
    """Tests for the Follow model."""

    def test_follow_can_be_created(self, user, other_user):
        """A follow relationship can be created with follower and following."""
        follow = Follow.objects.create(follower=user, following=other_user)

        assert follow.pk is not None
        assert follow.follower == user
        assert follow.following == other_user

    def test_follow_requires_follower(self, other_user):
        """Follow cannot be saved without a follower."""
        follow = Follow(following=other_user)

        with pytest.raises(IntegrityError):
            follow.save()

    def test_follow_requires_following(self, user):
        """Follow cannot be saved without a following user."""
        follow = Follow(follower=user)

        with pytest.raises(IntegrityError):
            follow.save()

    def test_clean_prevents_self_follow(self, user):
        """clean() raises ValidationError when follower and following are the same."""
        follow = Follow(follower=user, following=user)

        with pytest.raises(ValidationError) as exc_info:
            follow.clean()

        assert "cannot follow yourself" in str(exc_info.value).lower()

    def test_database_constraint_prevents_self_follow(self, user):
        """Database CheckConstraint prevents self-follow even when clean() is bypassed."""
        with pytest.raises(IntegrityError):
            Follow.objects.create(follower=user, following=user)

    def test_duplicate_follow_not_allowed(self, user, other_user):
        """Same (follower, following) pair cannot be created twice."""
        Follow.objects.create(follower=user, following=other_user)

        with pytest.raises(IntegrityError):
            Follow.objects.create(follower=user, following=other_user)

    def test_is_mutual_returns_false_when_not_mutual(self, user, other_user):
        """is_mutual() is False when the other user does not follow back."""
        follow = Follow.objects.create(follower=user, following=other_user)

        assert follow.is_mutual() is False

    def test_is_mutual_returns_true_when_mutual(self, user, other_user):
        """is_mutual() is True when both users follow each other."""
        Follow.objects.create(follower=user, following=other_user)
        reverse = Follow.objects.create(follower=other_user, following=user)

        assert reverse.is_mutual() is True
        # First follow is also mutual now
        follow = Follow.objects.get(follower=user, following=other_user)
        assert follow.is_mutual() is True

    def test_created_at_is_auto_set(self, user, other_user):
        """created_at is set automatically on create."""
        follow = Follow.objects.create(follower=user, following=other_user)

        assert follow.created_at is not None

    def test_follows_are_ordered_by_created_at_desc(self, user, other_user):
        """Follows are ordered by created_at descending (newest first)."""
        follow1 = Follow.objects.create(follower=user, following=other_user)
        follow2 = Follow.objects.create(follower=other_user, following=user)

        follows = list(Follow.objects.all())
        assert follows[0] == follow2
        assert follows[1] == follow1

    def test_follow_str_representation(self, user, other_user):
        """__str__ returns 'follower follows following'."""
        follow = Follow.objects.create(follower=user, following=other_user)

        s = str(follow)
        assert user.username in s
        assert other_user.username in s
        assert "follows" in s

    def test_cascade_delete_when_follower_deleted(self, user, other_user):
        """When follower user is deleted, Follow is deleted (CASCADE)."""
        Follow.objects.create(follower=user, following=other_user)
        follow_id = Follow.objects.get(follower=user, following=other_user).pk

        user.delete()

        assert not Follow.objects.filter(pk=follow_id).exists()

    def test_cascade_delete_when_following_deleted(self, user, other_user):
        """When following user is deleted, Follow is deleted (CASCADE)."""
        Follow.objects.create(follower=user, following=other_user)
        follow_id = Follow.objects.get(follower=user, following=other_user).pk

        other_user.delete()

        assert not Follow.objects.filter(pk=follow_id).exists()

    def test_reverse_relations_following_and_followers(self, user, other_user):
        """User.following and User.followers (related_name) return correct Follows."""
        Follow.objects.create(follower=user, following=other_user)
        Follow.objects.create(follower=other_user, following=user)

        assert user.following.count() == 1
        assert user.following.filter(following=other_user).exists()
        assert user.followers.count() == 1
        assert user.followers.filter(follower=other_user).exists()
