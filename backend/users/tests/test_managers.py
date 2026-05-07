"""Tests for the custom UserManager."""

import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestUserManager:
    """Validation and creation behavior for User.objects."""

    def test_create_user_requires_email(self):
        with pytest.raises(ValueError, match="Email is required"):
            User.objects.create_user(email="", username="alice", password="pass12345")

    def test_create_user_requires_username(self):
        with pytest.raises(ValueError, match="Username is required"):
            User.objects.create_user(email="alice@example.com", username="", password="pass12345")

    def test_create_user_normalizes_email_domain(self):
        user = User.objects.create_user(
            email="Alice@Example.com",
            username="alice",
            password="pass12345",
        )

        assert user.email == "Alice@example.com"

    def test_create_superuser_sets_staff_and_superuser_flags(self):
        admin = User.objects.create_superuser(
            email="admin@example.com",
            username="admin",
            password="adminpass123",
        )

        assert admin.is_staff is True
        assert admin.is_superuser is True
        assert admin.is_active is True
