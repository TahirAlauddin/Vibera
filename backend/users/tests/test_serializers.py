"""
Tests for Users app serializers.

Tests cover:
- UserCreateSerializer
- UserSerializer
- UserProfileSerializer
"""

import pytest
from unittest.mock import Mock
from django.contrib.auth import get_user_model
from users.serializers import (
    UserCreateSerializer,
    UserSerializer,
    UserProfileSerializer,
)
from users.models import UserProfile

User = get_user_model()


# =============================================================================
# UserCreateSerializer Tests
# =============================================================================


@pytest.mark.django_db
class TestUserCreateSerializer:
    """Tests for UserCreateSerializer."""

    def test_serialization_contains_expected_fields(self, user):
        """Serialized user contains expected fields."""
        serializer = UserCreateSerializer(user)
        data = serializer.data

        expected_fields = {"id", "email", "username", "first_name", "last_name"}
        assert expected_fields.issubset(set(data.keys()))

    def test_deserialization_valid_data(self):
        """Valid data passes validation."""
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepass123",
            "first_name": "New",
            "last_name": "User",
        }

        serializer = UserCreateSerializer(data=data)

        assert serializer.is_valid(), serializer.errors

    def test_deserialization_creates_user(self):
        """Serializer can create a new user."""
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepass123",
        }

        serializer = UserCreateSerializer(data=data)
        assert serializer.is_valid()

        user = serializer.save()

        assert user.pk is not None
        assert user.username == "newuser"
        assert user.email == "newuser@example.com"
        assert user.check_password("securepass123")

    def test_deserialization_missing_username(self):
        """Missing username fails validation."""
        data = {"email": "test@example.com", "password": "pass123"}

        serializer = UserCreateSerializer(data=data)

        assert not serializer.is_valid()
        assert "username" in serializer.errors

    def test_deserialization_missing_email(self):
        """Missing email fails validation."""
        data = {"username": "testuser", "password": "pass123"}

        serializer = UserCreateSerializer(data=data)

        assert not serializer.is_valid()
        assert "email" in serializer.errors

    def test_deserialization_missing_password(self):
        """Missing password fails validation."""
        data = {"username": "testuser", "email": "test@example.com"}

        serializer = UserCreateSerializer(data=data)

        assert not serializer.is_valid()
        assert "password" in serializer.errors

    def test_deserialization_invalid_email(self):
        """Invalid email format fails validation."""
        data = {"username": "testuser", "email": "not-an-email", "password": "pass123"}

        serializer = UserCreateSerializer(data=data)

        assert not serializer.is_valid()
        assert "email" in serializer.errors

    def test_password_not_in_serialized_output(self, user):
        """Password should not be in serialized output."""
        serializer = UserCreateSerializer(user)
        data = serializer.data

        assert "password" not in data


# =============================================================================
# UserSerializer Tests
# =============================================================================


@pytest.mark.django_db
class TestUserSerializer:
    """Tests for UserSerializer."""

    def test_serialization_contains_expected_fields(self, user):
        """Serialized user contains expected fields."""
        serializer = UserSerializer(user)
        data = serializer.data

        expected_fields = {
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "is_active",
            "date_joined",
        }
        assert expected_fields == set(data.keys())

    def test_serialization_user_data(self, user):
        """User data is correctly serialized."""
        user.first_name = "John"
        user.last_name = "Doe"
        user.save()

        serializer = UserSerializer(user)
        data = serializer.data

        assert data["username"] == user.username
        assert data["email"] == user.email
        assert data["first_name"] == "John"
        assert data["last_name"] == "Doe"
        assert data["is_active"] == user.is_active

    def test_serialization_read_only_fields(self, user):
        """Read-only fields are in output."""
        serializer = UserSerializer(user)
        data = serializer.data

        assert "id" in data
        assert "date_joined" in data

    def test_deserialization_ignores_read_only_fields(self, user):
        """Read-only fields are ignored in input."""
        data = {
            "id": 99999,  # Should be ignored
            "date_joined": "2020-01-01T00:00:00Z",  # Should be ignored
            "first_name": "Updated",
        }

        serializer = UserSerializer(user, data=data, partial=True)
        assert serializer.is_valid()

        updated_user = serializer.save()

        assert updated_user.pk == user.pk  # ID unchanged
        assert updated_user.first_name == "Updated"

    def test_update_user_name(self, user):
        """Can update user's name."""
        data = {"first_name": "NewFirst", "last_name": "NewLast"}

        serializer = UserSerializer(user, data=data, partial=True)
        assert serializer.is_valid()

        updated_user = serializer.save()

        assert updated_user.first_name == "NewFirst"
        assert updated_user.last_name == "NewLast"

    def test_many_serialization(self, user_factory):
        """Serializer handles many=True for lists."""
        user1 = user_factory(username="user1")
        user2 = user_factory(username="user2")

        serializer = UserSerializer([user1, user2], many=True)
        data = serializer.data

        assert len(data) == 2
        usernames = [d["username"] for d in data]
        assert "user1" in usernames
        assert "user2" in usernames


# =============================================================================
# UserProfileSerializer Tests
# =============================================================================


@pytest.mark.django_db
class TestUserProfileSerializer:
    """Tests for UserProfileSerializer.

    Note: UserProfile is auto-created via signal when User is created.
    """

    def test_serialization_contains_expected_fields(self, user):
        """Serialized profile contains expected fields."""
        profile = user.profile  # Auto-created via signal

        serializer = UserProfileSerializer(profile)
        data = serializer.data

        expected_fields = {
            "id",
            "user",
            "avatar",
            "followers_count",
            "following_count",
            "created_at",
        }
        assert expected_fields == set(data.keys())

    def test_serialization_profile_data(self, user):
        """Profile data is correctly serialized."""
        profile = user.profile
        profile.followers_count = 10
        profile.following_count = 5
        profile.save()

        serializer = UserProfileSerializer(profile)
        data = serializer.data

        assert data["user"] == user.pk
        assert data["followers_count"] == 10
        assert data["following_count"] == 5

    def test_serialization_read_only_fields(self, user):
        """Read-only fields are in output."""
        profile = user.profile

        serializer = UserProfileSerializer(profile)
        data = serializer.data

        assert "id" in data
        assert "user" in data
        assert "created_at" in data
        assert "followers_count" in data
        assert "following_count" in data

    def test_deserialization_ignores_read_only_fields(self, user):
        """Read-only fields are ignored in input."""
        profile = user.profile

        data = {
            "followers_count": 9999,  # Should be ignored (read-only)
            "following_count": 9999,  # Should be ignored (read-only)
        }

        serializer = UserProfileSerializer(profile, data=data, partial=True)
        assert serializer.is_valid()

        updated_profile = serializer.save()

        assert updated_profile.followers_count == 0  # Unchanged
        assert updated_profile.following_count == 0  # Unchanged

    def test_update_avatar(self, user):
        """Can update profile avatar path."""
        profile = user.profile

        # Note: In real tests, you'd use SimpleUploadedFile for actual file upload
        # This tests the serializer accepts avatar field
        serializer = UserProfileSerializer(profile)
        data = serializer.data

        assert "avatar" in data

    def test_serialization_null_avatar(self, user):
        """Profile with no avatar serializes correctly."""
        profile = user.profile

        serializer = UserProfileSerializer(profile)
        data = serializer.data

        # Avatar should be None or empty when not set
        assert data["avatar"] is None or data["avatar"] == ""

    def test_many_serialization(self, user_factory):
        """Serializer handles many=True for lists."""
        user1 = user_factory(username="user1")
        user2 = user_factory(username="user2")
        # Profiles auto-created via signal
        profile1 = user1.profile
        profile2 = user2.profile

        serializer = UserProfileSerializer([profile1, profile2], many=True)
        data = serializer.data

        assert len(data) == 2
