"""
Pytest fixtures for the Vibera backend test suite.

Fixtures avoid repetition by providing reusable test data and setup.

Usage in tests:
    def test_something(user, api_client):
        # user and api_client are automatically injected
        pass

Fixture Scopes:
    - function (default): New instance for each test
    - class: Shared across all tests in a class
    - module: Shared across all tests in a module
    - session: Shared across all tests in the session
"""

import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


# =============================================================================
# API Client Fixtures
# =============================================================================


@pytest.fixture
def api_client():
    """Returns an unauthenticated DRF APIClient.

    Usage:
        def test_public_endpoint(api_client):
            response = api_client.get('/api/public/')
            assert response.status_code == 200
    """
    return APIClient()


@pytest.fixture
def authenticated_client(api_client, user):
    """Returns an authenticated DRF APIClient.

    Usage:
        def test_protected_endpoint(authenticated_client):
            response = authenticated_client.get('/api/protected/')
            assert response.status_code == 200
    """
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    """Returns an APIClient authenticated as admin."""
    api_client.force_authenticate(user=admin_user)
    return api_client


# =============================================================================
# User Fixtures
# =============================================================================


@pytest.fixture
def user(db):
    """Creates and returns a standard test user.

    The `db` fixture enables database access for this fixture.
    Any test using this fixture will automatically have DB access.
    """
    return User.objects.create_user(
        username="testuser", email="test@example.com", password="password123"
    )


@pytest.fixture
def other_user(db):
    """Creates a second user for testing user-to-user interactions."""
    return User.objects.create_user(
        username="otheruser", email="other@example.com", password="password123"
    )


@pytest.fixture
def admin_user(db):
    """Creates and returns a superuser for admin testing."""
    return User.objects.create_superuser(
        username="admin", email="admin@example.com", password="adminpass123"
    )


@pytest.fixture
def user_factory(db):
    """Factory fixture to create multiple users with custom attributes.

    Usage:
        def test_multiple_users(user_factory):
            user1 = user_factory(username="alice")
            user2 = user_factory(username="bob")
            assert user1.pk != user2.pk
    """
    created_users = []

    def _create_user(username="testuser", email=None, password="password123", **kwargs):
        if email is None:
            email = f"{username}@example.com"
        user = User.objects.create_user(
            username=username, email=email, password=password, **kwargs
        )
        created_users.append(user)
        return user

    yield _create_user

    # Cleanup (optional - transaction rollback handles this)
    for u in created_users:
        u.delete()


# =============================================================================
# Mood Fixtures
# =============================================================================


@pytest.fixture
def mood(db, user):
    """Creates a basic mood entry.

    Usage:
        def test_mood_display(mood):
            assert mood.emoji == "😊"
    """
    from moods.models import Mood

    return Mood.objects.create(user=user, emoji="😊", reason="Feeling great!")


@pytest.fixture
def mood_factory(db):
    """Factory fixture to create moods with custom attributes.

    Usage:
        def test_mood_history(user, mood_factory):
            mood1 = mood_factory(user=user, emoji="😊")
            mood2 = mood_factory(user=user, emoji="😔")
            assert user.moods.count() == 2
    """
    from moods.models import Mood

    def _create_mood(user, emoji="😊", reason=None):
        return Mood.objects.create(user=user, emoji=emoji, reason=reason)

    return _create_mood


@pytest.fixture
def mood_with_comment(db, user, other_user):
    """Creates a mood with a comment from another user.

    Returns tuple: (mood, comment)
    """
    from moods.models import Mood, MoodComment

    mood = Mood.objects.create(user=user, emoji="😊")
    comment = MoodComment.objects.create(
        mood=mood, user=other_user, content="Hope you're doing well!"
    )
    return mood, comment


@pytest.fixture
def journal_entry(db, user, mood):
    """Creates a journal entry linked to a mood."""
    from moods.models import EmojiJournalEntry

    return EmojiJournalEntry.objects.create(
        mood=mood, user=user, note="Today was a good day because..."
    )


# =============================================================================
# Sample Data Fixtures (for integration tests)
# =============================================================================


@pytest.fixture
def sample_moods(db, user, mood_factory):
    """Creates a set of sample moods for testing lists/feeds.

    Returns list of 5 moods with different emojis.
    """
    emojis = ["😊", "😔", "😡", "😰", "😌"]
    return [
        mood_factory(user=user, emoji=emoji, reason=f"Reason for {emoji}")
        for emoji in emojis
    ]


# =============================================================================
# Authentication Fixtures
# =============================================================================


@pytest.fixture
def user_with_token(db, user):
    """Creates a user and returns (user, token) tuple.

    Useful for testing JWT authentication.
    """
    from rest_framework_simplejwt.tokens import RefreshToken

    refresh = RefreshToken.for_user(user)
    return user, str(refresh.access_token)


@pytest.fixture
def auth_headers(user_with_token):
    """Returns authorization headers for API requests.

    Usage:
        def test_with_jwt(api_client, auth_headers):
            response = api_client.get('/api/me/', **auth_headers)
    """
    user, token = user_with_token
    return {"HTTP_AUTHORIZATION": f"Bearer {token}"}
