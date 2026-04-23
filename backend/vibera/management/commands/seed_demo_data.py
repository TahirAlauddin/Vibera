"""
Seed demo users, mood journal entries, follows, and comments for local development.

Usage:
    python manage.py seed_demo_data
    python manage.py seed_demo_data --reset
    python manage.py seed_demo_data --connect your_username
"""

from datetime import timedelta
import random

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from moods.models import EmojiJournalEntry, Mood, MoodComment
from social.models import Follow
from users.models import UserProfile

User = get_user_model()

DEMO_PASSWORD = "demo123456"

DEMO_USERS = [
    {
        "username": "seraphina",
        "email": "seraphina@vibera.demo",
        "first_name": "Seraphina",
        "last_name": "Larkspur",
    },
    {
        "username": "arjunp",
        "email": "arjun@vibera.demo",
        "first_name": "Arjun",
        "last_name": "Patel",
    },
    {
        "username": "mayal",
        "email": "maya@vibera.demo",
        "first_name": "Maya",
        "last_name": "Lin",
    },
    {
        "username": "elenar",
        "email": "elena@vibera.demo",
        "first_name": "Elena",
        "last_name": "Rossi",
    },
    {
        "username": "jamesc",
        "email": "james@vibera.demo",
        "first_name": "James",
        "last_name": "Carter",
    },
    {
        "username": "sofiam",
        "email": "sofia@vibera.demo",
        "first_name": "Sofia",
        "last_name": "Martinez",
    },
    {
        "username": "omarh",
        "email": "omar@vibera.demo",
        "first_name": "Omar",
        "last_name": "Hassan",
    },
    {
        "username": "lilyw",
        "email": "lily@vibera.demo",
        "first_name": "Lily",
        "last_name": "Wong",
    },
]

JOURNAL_SNIPPETS = [
    (
        "😊",
        8,
        "Started the day with a peaceful morning routine. Grateful for small wins and good coffee.",
    ),
    (
        "😌",
        6,
        "Took a long walk after lunch and felt my shoulders finally drop. Breathing feels easier tonight.",
    ),
    (
        "😰",
        7,
        "Big presentation tomorrow and my mind keeps racing. Trying to focus on what I can control.",
    ),
    (
        "😔",
        5,
        "Missed a friend today and felt lonely for a bit. Journaling helped me name the feeling.",
    ),
    (
        "😡",
        6,
        "Frustrated by a delayed project, but I stepped away before reacting. Proud of that pause.",
    ),
    (
        "😴",
        4,
        "Running on low sleep this week. Going to prioritize rest tonight instead of scrolling.",
    ),
    (
        "😊",
        9,
        "Received kind feedback at work and it genuinely lifted my mood for the whole afternoon.",
    ),
    (
        "😌",
        7,
        "Spent an hour reading with no distractions. My nervous system feels noticeably calmer.",
    ),
]

COMMENT_SNIPPETS = [
    "Sending you good vibes!",
    "Thanks for sharing this — you're not alone.",
    "Proud of you for checking in today.",
    "This resonates with me more than you know.",
    "Hope tomorrow feels lighter.",
    "Love seeing you prioritize rest.",
]


def build_reason(intensity: int, journal: str) -> str:
    return f"Intensity: {intensity}/10\n\n{journal}"


class Command(BaseCommand):
    help = "Seed demo users, journal entries, follows, and comments for the mood feed"

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing demo users (by username) before seeding",
        )
        parser.add_argument(
            "--connect",
            type=str,
            default="",
            help="Username of your account — demo users will follow you and some will be mutual",
        )
        parser.add_argument(
            "--password",
            type=str,
            default=DEMO_PASSWORD,
            help=f"Password for demo users (default: {DEMO_PASSWORD})",
        )
        parser.add_argument(
            "--entries-per-user",
            type=int,
            default=4,
            help="Number of journal/mood entries per demo user (default: 4)",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        reset = options["reset"]
        connect_username = (options["connect"] or "").strip()
        password = options["password"]
        entries_per_user = max(1, options["entries_per_user"])

        demo_usernames = [u["username"] for u in DEMO_USERS]

        if reset:
            deleted, _ = User.objects.filter(username__in=demo_usernames).delete()
            self.stdout.write(self.style.WARNING(f"Removed {deleted} related demo records"))

        users = []
        for data in DEMO_USERS:
            user, created = User.objects.get_or_create(
                username=data["username"],
                defaults={
                    "email": data["email"],
                    "first_name": data["first_name"],
                    "last_name": data["last_name"],
                    "is_active": True,
                    "is_2fa_enabled": False,
                },
            )
            if created or reset:
                user.set_password(password)
                user.first_name = data["first_name"]
                user.last_name = data["last_name"]
                user.email = data["email"]
                user.is_2fa_enabled = False
                user.save()

            UserProfile.objects.get_or_create(user=user)
            users.append(user)
            action = "Created" if created else "Updated"
            self.stdout.write(f"  {action} user @{user.username} ({user.email})")

        moods_created = 0
        journals_created = 0
        now = timezone.now()

        for index, user in enumerate(users):
            existing_count = Mood.objects.filter(user=user).count()
            if existing_count >= entries_per_user and not reset:
                self.stdout.write(
                    f"  Skipping moods for @{user.username} ({existing_count} already exist)"
                )
                continue

            if reset:
                Mood.objects.filter(user=user).delete()

            snippets = random.sample(
                JOURNAL_SNIPPETS,
                k=min(entries_per_user, len(JOURNAL_SNIPPETS)),
            )

            for entry_index, (emoji, intensity, journal) in enumerate(snippets):
                days_ago = entry_index + (index % 3)
                hours_ago = random.randint(1, 20)
                created_at = now - timedelta(days=days_ago, hours=hours_ago)

                mood = Mood.objects.create(
                    user=user,
                    emoji=emoji,
                    reason=build_reason(intensity, journal),
                )
                Mood.objects.filter(pk=mood.pk).update(
                    created_at=created_at,
                    updated_at=created_at,
                )
                moods_created += 1

                EmojiJournalEntry.objects.create(
                    mood=mood,
                    user=user,
                    note=journal,
                )
                journals_created += 1

        follows_created = self._seed_follows(users, connect_username)
        comments_created = self._seed_comments(users)

        self.stdout.write(self.style.SUCCESS("\nDemo data seeded successfully"))
        self.stdout.write(f"  Users: {len(users)}")
        self.stdout.write(f"  Mood/journal entries: {moods_created}")
        self.stdout.write(f"  Journal records: {journals_created}")
        self.stdout.write(f"  Follow relationships: {follows_created}")
        self.stdout.write(f"  Comments: {comments_created}")
        self.stdout.write(f"\n  Demo password for all seeded users: {password}")

        if connect_username:
            self.stdout.write(
                f"\n  Log in as '{connect_username}' and open /dashboard/feed to see demo posts."
            )
        else:
            self.stdout.write(
                "\n  Tip: re-run with --connect YOUR_USERNAME to link demo users to your account."
            )

    def _seed_follows(self, users, connect_username: str) -> int:
        created = 0

        # Ring + cross follows between demo users
        for i, user in enumerate(users):
            for offset in (1, 2, 3):
                target = users[(i + offset) % len(users)]
                if target == user:
                    continue
                _, was_created = Follow.objects.get_or_create(
                    follower=user,
                    following=target,
                )
                if was_created:
                    created += 1

        # Mutual friendships
        pairs = [(0, 1), (2, 3), (4, 5), (6, 7), (0, 3), (1, 4)]
        for a, b in pairs:
            if a < len(users) and b < len(users):
                for follower, following in ((users[a], users[b]), (users[b], users[a])):
                    _, was_created = Follow.objects.get_or_create(
                        follower=follower,
                        following=following,
                    )
                    if was_created:
                        created += 1

        if connect_username:
            try:
                main_user = User.objects.get(username=connect_username)
            except User.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(
                        f"  User '{connect_username}' not found — skipping --connect"
                    )
                )
                return created

            UserProfile.objects.get_or_create(user=main_user)

            # Every demo user follows the main account
            for demo_user in users:
                if demo_user == main_user:
                    continue
                _, was_created = Follow.objects.get_or_create(
                    follower=demo_user,
                    following=main_user,
                )
                if was_created:
                    created += 1

            # Main account follows half the demo users back (mutual friends)
            for demo_user in users[: len(users) // 2]:
                if demo_user == main_user:
                    continue
                _, was_created = Follow.objects.get_or_create(
                    follower=main_user,
                    following=demo_user,
                )
                if was_created:
                    created += 1

            self.stdout.write(
                self.style.SUCCESS(f"  Connected demo network to @{main_user.username}")
            )

        return created

    def _seed_comments(self, users) -> int:
        created = 0
        moods = list(Mood.objects.filter(user__in=users).order_by("-created_at")[:20])

        for mood in moods:
            commenters = random.sample(
                [u for u in users if u != mood.user],
                k=min(2, max(1, len(users) - 1)),
            )
            for commenter in commenters:
                if MoodComment.objects.filter(mood=mood, user=commenter).exists():
                    continue
                MoodComment.objects.create(
                    mood=mood,
                    user=commenter,
                    content=random.choice(COMMENT_SNIPPETS),
                )
                created += 1

        return created
