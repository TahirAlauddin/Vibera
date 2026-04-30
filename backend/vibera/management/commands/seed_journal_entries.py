"""
Seed mood journal entries for a specific user across past days.

Usage:
    python manage.py seed_journal_entries --username your_username
    python manage.py seed_journal_entries --username your_username --days 30
    python manage.py seed_journal_entries --username your_username --reset
"""

import random
from datetime import datetime, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from moods.models import EmojiJournalEntry, Mood
from users.models import UserProfile

from .seed_demo_data import JOURNAL_SNIPPETS, build_reason

User = get_user_model()


class Command(BaseCommand):
    help = "Seed mood journal entries for a user (useful for local dev / fresh databases)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--username",
            type=str,
            required=True,
            help="Username of the account to seed entries for",
        )
        parser.add_argument(
            "--days",
            type=int,
            default=30,
            help="Number of past days to create one entry per day (default: 30)",
        )
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing mood/journal entries for this user before seeding",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        username = options["username"].strip()
        days = max(1, options["days"])
        reset = options["reset"]

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist as exc:
            raise CommandError(f"User '{username}' not found") from exc

        UserProfile.objects.get_or_create(user=user)

        if reset:
            deleted, _ = Mood.objects.filter(user=user).delete()
            self.stdout.write(self.style.WARNING(f"Removed {deleted} existing mood records"))

        existing_days = {
            mood.created_at.date()
            for mood in Mood.objects.filter(user=user).only("created_at")
        }

        now = timezone.now()
        created = 0
        skipped = 0

        for day_offset in range(days):
            entry_date = (now - timedelta(days=day_offset)).date()
            if entry_date in existing_days:
                skipped += 1
                continue

            emoji, intensity, journal = JOURNAL_SNIPPETS[day_offset % len(JOURNAL_SNIPPETS)]
            hour = random.randint(8, 21)
            minute = random.randint(0, 59)
            created_at = timezone.make_aware(
                datetime.combine(entry_date, datetime.min.time())
            ).replace(hour=hour, minute=minute)

            mood = Mood.objects.create(
                user=user,
                emoji=emoji,
                reason=build_reason(intensity, journal),
            )
            Mood.objects.filter(pk=mood.pk).update(
                created_at=created_at,
                updated_at=created_at,
            )

            journal_entry = EmojiJournalEntry.objects.create(
                mood=mood,
                user=user,
                note=journal,
            )
            EmojiJournalEntry.objects.filter(pk=journal_entry.pk).update(
                created_at=created_at,
                updated_at=created_at,
            )
            created += 1

        self.stdout.write(self.style.SUCCESS(f"\nSeeded journal entries for @{user.username}"))
        self.stdout.write(f"  Created: {created}")
        if skipped:
            self.stdout.write(f"  Skipped (already had entry): {skipped}")
        self.stdout.write(f"\n  Log in as '{username}' and open /dashboard to see your data.")
