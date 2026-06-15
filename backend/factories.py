"""
Factory Boy factories for generating test data.

Factory Boy provides a clean, professional approach to test data generation.

Benefits:
- Declarative syntax
- Automatic fake data with Faker
- Traits for common variations
- Lazy attributes for computed values
- SubFactories for relationships
- Sequences for unique values

Usage:
    from factories import UserFactory, MoodFactory

    # Create single instance
    user = UserFactory()

    # Create with custom attributes
    user = UserFactory(username="custom_user")

    # Create multiple instances
    users = UserFactory.create_batch(5)

    # Build without saving (for unit tests)
    user = UserFactory.build()
"""

import factory
from factory.django import DjangoModelFactory
from faker import Faker
from django.contrib.auth import get_user_model

from moods.models import Mood, MoodComment, EmojiJournalEntry
from users.models import UserProfile, EmailOTP

User = get_user_model()
fake = Faker()


# =============================================================================
# User Factory
# =============================================================================


class UserFactory(DjangoModelFactory):
    """Factory for creating User instances.

    Usage:
        user = UserFactory()  # Random user
        user = UserFactory(username="specific_user")
        user = UserFactory(is_staff=True)  # Staff user
        admin = UserFactory.create(is_superuser=True, is_staff=True)
    """

    class Meta:
        model = User
        skip_postgeneration_save = True

    # Use sequence for unique usernames
    username = factory.Sequence(lambda n: f"user_{n}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@example.com")

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        """Set password after user creation."""
        password = extracted or "password123"
        self.set_password(password)
        if create:
            self.save()

    # Profile fields (if your User model has them)
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")

    # Flags
    is_active = True
    is_staff = False
    is_superuser = False

    class Params:
        """Traits for common user variations."""

        # Usage: UserFactory(admin=True)
        admin = factory.Trait(
            is_staff=True,
            is_superuser=True,
            username=factory.Sequence(lambda n: f"admin_{n}"),
        )

        # Usage: UserFactory(staff=True)
        staff = factory.Trait(
            is_staff=True, username=factory.Sequence(lambda n: f"staff_{n}")
        )

        # Usage: UserFactory(inactive=True)
        inactive = factory.Trait(is_active=False)


# =============================================================================
# UserProfile Factory
# =============================================================================


class UserProfileFactory(DjangoModelFactory):
    """Factory for creating UserProfile instances.

    Usage:
        profile = UserProfileFactory()  # Creates user automatically
        profile = UserProfileFactory(user=existing_user)
    """

    class Meta:
        model = UserProfile

    user = factory.SubFactory(UserFactory)
    followers_count = factory.Faker("random_int", min=0, max=1000)
    following_count = factory.Faker("random_int", min=0, max=500)

    class Params:
        """Traits for profile variations."""

        # Usage: UserProfileFactory(popular=True)
        popular = factory.Trait(
            followers_count=factory.Faker("random_int", min=10000, max=100000)
        )

        # Usage: UserProfileFactory(new=True)
        new = factory.Trait(followers_count=0, following_count=0)


# =============================================================================
# EmailOTP Factory
# =============================================================================


class EmailOTPFactory(DjangoModelFactory):
    """Factory for creating EmailOTP instances.

    Usage:
        otp = EmailOTPFactory(user=user)
    """

    class Meta:
        model = EmailOTP

    user = factory.SubFactory(UserFactory)

    @factory.lazy_attribute
    def expires_at(self):
        from django.utils import timezone
        from datetime import timedelta

        return timezone.now() + timedelta(minutes=10)

    @factory.lazy_attribute
    def hashed_code(self):
        from django.contrib.auth.hashers import make_password

        return make_password("123456")

    is_used = False
    attempts = 0

    class Params:
        """Traits for OTP variations."""

        # Usage: EmailOTPFactory(expired=True)
        expired = factory.Trait(
            expires_at=factory.LazyFunction(
                lambda: __import__("django.utils", fromlist=["timezone"]).timezone.now()
                - __import__("datetime", fromlist=["timedelta"]).timedelta(minutes=1)
            )
        )

        # Usage: EmailOTPFactory(used=True)
        used = factory.Trait(is_used=True)


# =============================================================================
# Mood Factory
# =============================================================================


class MoodFactory(DjangoModelFactory):
    """Factory for creating Mood instances.

    Usage:
        mood = MoodFactory()  # Random mood with new user
        mood = MoodFactory(user=existing_user)  # With specific user
        mood = MoodFactory(emoji="😊")  # With specific emoji
        mood = MoodFactory(happy=True)  # Using trait
        moods = MoodFactory.create_batch(5, user=user)  # Multiple moods
    """

    class Meta:
        model = Mood

    user = factory.SubFactory(UserFactory)
    emoji = factory.Faker(
        "random_element", elements=["😊", "😔", "😡", "😰", "😴", "😌"]
    )
    reason = factory.Faker("sentence", nb_words=6)

    class Params:
        """Traits for common mood types."""

        # Usage: MoodFactory(happy=True)
        happy = factory.Trait(emoji="😊", reason="Feeling great today!")

        # Usage: MoodFactory(sad=True)
        sad = factory.Trait(emoji="😔", reason="Having a tough day.")

        # Usage: MoodFactory(angry=True)
        angry = factory.Trait(emoji="😡", reason="Something frustrating happened.")

        # Usage: MoodFactory(anxious=True)
        anxious = factory.Trait(emoji="😰", reason="Feeling worried about things.")

        # Usage: MoodFactory(tired=True)
        tired = factory.Trait(emoji="😴", reason="Need more sleep.")

        # Usage: MoodFactory(calm=True)
        calm = factory.Trait(emoji="😌", reason="Peaceful and relaxed.")

        # Usage: MoodFactory(no_reason=True)
        no_reason = factory.Trait(reason=None)


# =============================================================================
# MoodComment Factory
# =============================================================================


class MoodCommentFactory(DjangoModelFactory):
    """Factory for creating MoodComment instances.

    Usage:
        comment = MoodCommentFactory()  # Comment with new mood and user
        comment = MoodCommentFactory(mood=existing_mood)
        comment = MoodCommentFactory(user=commenter, mood=mood)

        # Create a reply
        reply = MoodCommentFactory(parent=parent_comment, mood=parent_comment.mood)
    """

    class Meta:
        model = MoodComment

    mood = factory.SubFactory(MoodFactory)
    user = factory.SubFactory(UserFactory)
    content = factory.Faker("paragraph", nb_sentences=2)
    parent = None  # Top-level comment by default

    class Params:
        """Traits for comment variations."""

        # Usage: MoodCommentFactory(short=True)
        short = factory.Trait(content=factory.Faker("sentence", nb_words=5))

        # Usage: MoodCommentFactory(long=True)
        long = factory.Trait(content=factory.Faker("paragraph", nb_sentences=5))

    @classmethod
    def create_reply(cls, parent_comment, user=None, **kwargs):
        """Helper to create a reply to an existing comment.

        Usage:
            reply = MoodCommentFactory.create_reply(parent_comment)
            reply = MoodCommentFactory.create_reply(parent_comment, user=user)
        """
        return cls.create(
            mood=parent_comment.mood,
            parent=parent_comment,
            user=user or UserFactory(),
            **kwargs,
        )


# =============================================================================
# EmojiJournalEntry Factory
# =============================================================================


class EmojiJournalEntryFactory(DjangoModelFactory):
    """Factory for creating EmojiJournalEntry instances.

    Usage:
        entry = EmojiJournalEntryFactory()
        entry = EmojiJournalEntryFactory(mood=mood, user=user)
        entry = EmojiJournalEntryFactory(detailed=True)  # Long note
    """

    class Meta:
        model = EmojiJournalEntry

    mood = factory.SubFactory(MoodFactory)
    user = factory.LazyAttribute(lambda obj: obj.mood.user)  # Same user as mood
    note = factory.Faker("paragraph", nb_sentences=3)

    class Params:
        """Traits for journal entry variations."""

        # Usage: EmojiJournalEntryFactory(detailed=True)
        detailed = factory.Trait(note=factory.Faker("text", max_nb_chars=500))

        # Usage: EmojiJournalEntryFactory(empty=True)
        empty = factory.Trait(note=None)


# =============================================================================
# Composite Factories (for complex scenarios)
# =============================================================================


class MoodWithCommentsFactory(MoodFactory):
    """Factory that creates a mood with comments.

    Usage:
        mood = MoodWithCommentsFactory()  # Mood with 3 default comments
        mood = MoodWithCommentsFactory(comments__count=5)  # With 5 comments
    """

    class Meta:
        model = Mood
        skip_postgeneration_save = True

    @factory.post_generation
    def comments(self, create, extracted, **kwargs):
        if not create:
            return

        # Default to 3 comments if not specified
        count = kwargs.get("count", 3)

        if extracted:
            # If comments were passed in, use them
            for comment in extracted:
                comment.mood = self
                comment.save()
        else:
            # Create random comments from different users
            for _ in range(count):
                MoodCommentFactory(mood=self)


class MoodWithJournalFactory(MoodFactory):
    """Factory that creates a mood with a journal entry.

    Usage:
        mood = MoodWithJournalFactory()
    """

    class Meta:
        model = Mood
        skip_postgeneration_save = True

    @factory.post_generation
    def journal_entry(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            extracted.mood = self
            extracted.save()
        else:
            EmojiJournalEntryFactory(mood=self, user=self.user)


# =============================================================================
# Batch Creation Helpers
# =============================================================================


def create_user_with_moods(mood_count=5, **user_kwargs):
    """Create a user with multiple moods.

    Usage:
        user = create_user_with_moods(mood_count=10)
        user = create_user_with_moods(mood_count=3, username="test_user")
    """
    user = UserFactory(**user_kwargs)
    MoodFactory.create_batch(mood_count, user=user)
    return user


def create_mood_with_thread(comment_count=3, reply_count=2):
    """Create a mood with comments and nested replies.

    Usage:
        mood = create_mood_with_thread(comment_count=5, reply_count=3)
    """
    mood = MoodFactory()

    for _ in range(comment_count):
        parent = MoodCommentFactory(mood=mood)
        for _ in range(reply_count):
            MoodCommentFactory.create_reply(parent)

    return mood
