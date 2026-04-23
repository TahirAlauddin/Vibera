from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import Follow
from .services import sync_follow_pair_counts


@receiver(post_save, sender=Follow)
def follow_created_sync_counts(sender, instance, created, **kwargs):
    if created:
        sync_follow_pair_counts(instance.follower, instance.following)


@receiver(post_delete, sender=Follow)
def follow_deleted_sync_counts(sender, instance, **kwargs):
    sync_follow_pair_counts(instance.follower, instance.following)
