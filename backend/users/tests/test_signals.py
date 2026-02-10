"""
Tests for Users app signals.

Covers the post_save signal that creates a UserProfile when a User is created.
"""

import pytest
from django.contrib.auth import get_user_model

from users.models import UserProfile

User = get_user_model()


@pytest.mark.django_db
class TestCreateUserProfileSignal:
    """post_save(User): create UserProfile when User is created."""

    def test_profile_created_when_user_created(self):
        """Creating a new User creates exactly one UserProfile and user.profile works."""
        user = User.objects.create_user(
            username="signaluser",
            email="signal@example.com",
            password="pass123",
        )

        assert UserProfile.objects.filter(user=user).count() == 1
        profile = UserProfile.objects.get(user=user)
        assert profile.user == user
        assert user.profile == profile

    def test_profile_created_when_superuser_created(self):
        """Creating a superuser also creates a UserProfile."""
        admin = User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="adminpass",
        )

        assert UserProfile.objects.filter(user=admin).count() == 1
        assert admin.profile is not None

    def test_profile_not_created_on_user_update(self):
        """Updating an existing User does not create a second profile."""
        user = User.objects.create_user(
            username="updateuser",
            email="update@example.com",
            password="pass123",
        )
        initial_profile_count = UserProfile.objects.filter(user=user).count()
        assert initial_profile_count == 1

        user.email = "updated@example.com"
        user.save()

        assert UserProfile.objects.filter(user=user).count() == 1
