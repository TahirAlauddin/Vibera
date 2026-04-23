from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from social.models import Follow
from social.services import sync_user_follow_counts

User = get_user_model()


class Command(BaseCommand):
    help = "Recalculate followers_count and following_count on all user profiles"

    def handle(self, *args, **options):
        updated = 0
        for user in User.objects.all():
            sync_user_follow_counts(user)
            updated += 1

        total_follows = Follow.objects.count()
        self.stdout.write(
            self.style.SUCCESS(
                f"Synced follow counts for {updated} users ({total_follows} follow relationships)"
            )
        )
