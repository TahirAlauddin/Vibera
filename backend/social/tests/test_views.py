"""
Tests for Social app API views.

Covers follow/unfollow, get followers, get following:
- Success paths (201, 200)
- Authentication (401)
- Validation (400: self-follow, duplicate follow)
- Not found (404: user missing, follow relationship missing)
- Response shape (count, results, message)
"""

import pytest
from rest_framework import status

from social.models import Follow


BASE = "/api/social"


# =============================================================================
# Follow (POST follow/<user_id>/)
# =============================================================================


@pytest.mark.django_db
class TestFollowUserView:
    """POST /api/social/follow/<user_id>/"""

    def test_follow_success(self, authenticated_client, user, other_user):
        """Authenticated user can follow another user; returns 201 and follow data."""
        response = authenticated_client.post(f"{BASE}/follow/{other_user.pk}/")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["follower"]["id"] == user.id
        assert response.data["following"]["id"] == other_user.pk
        assert Follow.objects.filter(follower=user, following=other_user).exists()

    def test_follow_unauthenticated(self, api_client, other_user):
        """Unauthenticated request returns 401."""
        response = api_client.post(f"{BASE}/follow/{other_user.pk}/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_follow_self_returns_400(self, authenticated_client, user):
        """Following yourself returns 400."""
        response = authenticated_client.post(f"{BASE}/follow/{user.pk}/")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert not Follow.objects.filter(follower=user, following=user).exists()

    def test_follow_duplicate_returns_400(self, authenticated_client, user, other_user):
        """Following the same user twice returns 400."""
        Follow.objects.create(follower=user, following=other_user)
        response = authenticated_client.post(f"{BASE}/follow/{other_user.pk}/")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert Follow.objects.filter(follower=user, following=other_user).count() == 1

    def test_follow_nonexistent_user_returns_404(self, authenticated_client):
        """Following non-existent user returns 404."""
        response = authenticated_client.post(f"{BASE}/follow/99999/")
        assert response.status_code == status.HTTP_404_NOT_FOUND


# =============================================================================
# Unfollow (DELETE unfollow/<user_id>/)
# =============================================================================


@pytest.mark.django_db
class TestUnfollowUserView:
    """DELETE /api/social/unfollow/<user_id>/"""

    def test_unfollow_success(self, authenticated_client, user, other_user):
        """Unfollow removes the relationship and returns 200 with message."""
        Follow.objects.create(follower=user, following=other_user)

        response = authenticated_client.delete(f"{BASE}/unfollow/{other_user.pk}/")

        assert response.status_code == status.HTTP_200_OK
        assert "message" in response.data
        assert "unfollowed" in response.data["message"].lower()
        assert not Follow.objects.filter(follower=user, following=other_user).exists()

    def test_unfollow_unauthenticated(self, api_client, other_user):
        """Unauthenticated request returns 401."""
        response = api_client.delete(f"{BASE}/unfollow/{other_user.pk}/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_unfollow_when_not_following_returns_404(
        self, authenticated_client, user, other_user
    ):
        """Unfollowing when no follow relationship exists returns 404."""
        response = authenticated_client.delete(f"{BASE}/unfollow/{other_user.pk}/")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_unfollow_nonexistent_user_returns_404(self, authenticated_client):
        """Unfollowing non-existent user returns 404."""
        response = authenticated_client.delete(f"{BASE}/unfollow/99999/")
        assert response.status_code == status.HTTP_404_NOT_FOUND


# =============================================================================
# Get followers (GET followers/ and GET followers/<user_id>/)
# =============================================================================


@pytest.mark.django_db
class TestGetFollowersView:
    """GET /api/social/followers/ and GET /api/social/followers/<user_id>/"""

    def test_my_followers_empty(self, authenticated_client):
        """GET followers/ returns 200 with count 0 and empty results."""
        response = authenticated_client.get(f"{BASE}/followers/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 0
        assert response.data["results"] == []

    def test_my_followers_with_data(self, authenticated_client, user, other_user):
        """GET followers/ returns followers of authenticated user."""
        Follow.objects.create(follower=other_user, following=user)

        response = authenticated_client.get(f"{BASE}/followers/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["follower"]["id"] == other_user.id

    def test_user_followers_empty(self, authenticated_client, other_user):
        """GET followers/<user_id>/ returns 200 with empty list when user has no followers."""
        response = authenticated_client.get(f"{BASE}/followers/{other_user.pk}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 0
        assert response.data["results"] == []

    def test_user_followers_with_data(
        self, authenticated_client, user, other_user
    ):
        """GET followers/<user_id>/ returns that user's followers."""
        Follow.objects.create(follower=user, following=other_user)

        response = authenticated_client.get(f"{BASE}/followers/{other_user.pk}/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["results"][0]["follower"]["id"] == user.id

    def test_followers_unauthenticated(self, api_client, user):
        """GET followers/ and followers/<id>/ without auth return 401."""
        r1 = api_client.get(f"{BASE}/followers/")
        r2 = api_client.get(f"{BASE}/followers/{user.pk}/")
        assert r1.status_code == status.HTTP_401_UNAUTHORIZED
        assert r2.status_code == status.HTTP_401_UNAUTHORIZED

    def test_followers_nonexistent_user_returns_404(self, authenticated_client):
        """GET followers/<user_id>/ for non-existent user returns 404."""
        response = authenticated_client.get(f"{BASE}/followers/99999/")
        assert response.status_code == status.HTTP_404_NOT_FOUND


# =============================================================================
# Get following (GET following/ and GET following/<user_id>/)
# =============================================================================


@pytest.mark.django_db
class TestGetFollowingView:
    """GET /api/social/following/ and GET /api/social/following/<user_id>/"""

    def test_my_following_empty(self, authenticated_client):
        """GET following/ returns 200 with count 0 and empty results."""
        response = authenticated_client.get(f"{BASE}/following/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 0
        assert response.data["results"] == []

    def test_my_following_with_data(self, authenticated_client, user, other_user):
        """GET following/ returns users that authenticated user follows."""
        Follow.objects.create(follower=user, following=other_user)

        response = authenticated_client.get(f"{BASE}/following/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["following"]["id"] == other_user.id

    def test_user_following_empty(self, authenticated_client, other_user):
        """GET following/<user_id>/ returns 200 with empty list when user follows no one."""
        response = authenticated_client.get(f"{BASE}/following/{other_user.pk}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 0
        assert response.data["results"] == []

    def test_user_following_with_data(
        self, authenticated_client, user, other_user
    ):
        """GET following/<user_id>/ returns that user's following list."""
        Follow.objects.create(follower=other_user, following=user)

        response = authenticated_client.get(f"{BASE}/following/{other_user.pk}/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["results"][0]["following"]["id"] == user.id

    def test_following_unauthenticated(self, api_client, user):
        """GET following/ and following/<id>/ without auth return 401."""
        r1 = api_client.get(f"{BASE}/following/")
        r2 = api_client.get(f"{BASE}/following/{user.pk}/")
        assert r1.status_code == status.HTTP_401_UNAUTHORIZED
        assert r2.status_code == status.HTTP_401_UNAUTHORIZED

    def test_following_nonexistent_user_returns_404(self, authenticated_client):
        """GET following/<user_id>/ for non-existent user returns 404."""
        response = authenticated_client.get(f"{BASE}/following/99999/")
        assert response.status_code == status.HTTP_404_NOT_FOUND
