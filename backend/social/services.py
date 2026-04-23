from users.models import UserProfile
from .models import Follow


def sync_user_follow_counts(user) -> None:
    """Keep UserProfile follower/following counts in sync with Follow rows."""
    profile, _ = UserProfile.objects.get_or_create(user=user)
    profile.followers_count = Follow.objects.filter(following=user).count()
    profile.following_count = Follow.objects.filter(follower=user).count()
    profile.save(update_fields=["followers_count", "following_count"])


def sync_follow_pair_counts(follower, following) -> None:
    sync_user_follow_counts(follower)
    sync_user_follow_counts(following)
