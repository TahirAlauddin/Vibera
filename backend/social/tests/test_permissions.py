"""
Tests for Social app API permissions.

Permission tests cover:
- Unauthenticated users cannot follow, unfollow, or list followers/following
- Authenticated users cannot follow themselves or the same user twice
- Authenticated users cannot unfollow when they are not a follower
- Authenticated users can view other users' followers and following lists
"""

import pytest
from rest_framework import status

from social.models import Follow


BASE_URL = "/api/social"


# =============================================================================
# Unauthenticated Permission Tests
# =============================================================================


@pytest.mark.django_db
class TestUnauthenticatedSocialPermissions:
    """Unauthenticated requests to social endpoints should return 401."""

    def test_unauthenticated_user_cannot_follow_user(self, api_client, other_user):
        """POST follow/<user_id>/ without auth returns 401."""
        response = api_client.post(f"{BASE_URL}/follow/{other_user.pk}/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_unauthenticated_user_cannot_unfollow_user(self, api_client, other_user):
        """DELETE unfollow/<user_id>/ without auth returns 401."""
        response = api_client.delete(f"{BASE_URL}/unfollow/{other_user.pk}/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_unauthenticated_user_cannot_get_followers(self, api_client, user):
        """GET followers/ or followers/<user_id>/ without auth returns 401."""
        response = api_client.get(f"{BASE_URL}/followers/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

        response = api_client.get(f"{BASE_URL}/followers/{user.pk}/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_unauthenticated_user_cannot_get_following(self, api_client, user):
        """GET following/ or following/<user_id>/ without auth returns 401."""
        response = api_client.get(f"{BASE_URL}/following/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

        response = api_client.get(f"{BASE_URL}/following/{user.pk}/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# =============================================================================
# Authenticated Permission / Validation Tests
# =============================================================================


@pytest.mark.django_db
class TestAuthenticatedSocialPermissions:
    """Authenticated users: follow/unfollow rules and viewing others' lists."""

    def test_user_cannot_unfollow_if_not_follower(
        self, authenticated_client, user, other_user
    ):
        """User cannot unfollow when they do not follow that user (404)."""
        # user has never followed other_user
        response = authenticated_client.delete(
            f"{BASE_URL}/unfollow/{other_user.pk}/"
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_user_cannot_follow_themselves(self, authenticated_client, user):
        """User cannot follow themselves (400)."""
        response = authenticated_client.post(f"{BASE_URL}/follow/{user.pk}/")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_user_cannot_follow_same_user_twice(
        self, authenticated_client, user, other_user
    ):
        """User cannot follow the same user twice (400)."""
        Follow.objects.create(follower=user, following=other_user)

        response = authenticated_client.post(f"{BASE_URL}/follow/{other_user.pk}/")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_authenticated_user_can_view_other_users_followers(
        self, authenticated_client, user, other_user
    ):
        """Authenticated user can GET another user's followers list (200)."""
        response = authenticated_client.get(f"{BASE_URL}/followers/{other_user.pk}/")
        assert response.status_code == status.HTTP_200_OK
        assert "results" in response.data
        assert "count" in response.data

    def test_authenticated_user_can_view_other_users_following(
        self, authenticated_client, user, other_user
    ):
        """Authenticated user can GET another user's following list (200)."""
        response = authenticated_client.get(f"{BASE_URL}/following/{other_user.pk}/")
        assert response.status_code == status.HTTP_200_OK
        assert "results" in response.data
        assert "count" in response.data
