"""
Tests for API Permissions.

Permission Types Tested:
1. IsAuthenticated - Requires valid authentication
2. AllowAny - Public endpoints
3. Object-level permissions - Users can only modify their own resources

HTTP Status Codes:
- 401 Unauthorized: No authentication provided
- 403 Forbidden: Authenticated but not allowed
- 200/201/204: Allowed
"""

import pytest
from rest_framework import status
from moods.models import Mood, MoodComment


# =============================================================================
# IsAuthenticated Permission Tests
# =============================================================================


@pytest.mark.django_db
class TestIsAuthenticatedPermission:
    """
    Tests for endpoints requiring IsAuthenticated permission.

    Unauthenticated requests should return 401.
    Authenticated requests should be allowed.
    """

    # -------------------------------------------------------------------------
    # Moods Endpoints
    # -------------------------------------------------------------------------

    def test_list_moods_unauthenticated_returns_401(self, api_client):
        """GET /api/moods/ without auth returns 401."""
        response = api_client.get("/api/moods/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_moods_authenticated_returns_200(self, authenticated_client):
        """GET /api/moods/ with auth returns 200."""
        response = authenticated_client.get("/api/moods/")
        assert response.status_code == status.HTTP_200_OK

    def test_create_mood_unauthenticated_returns_401(self, api_client):
        """POST /api/moods/ without auth returns 401."""
        response = api_client.post("/api/moods/", {"emoji": "😊"})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_mood_authenticated_returns_201(self, authenticated_client):
        """POST /api/moods/ with auth returns 201."""
        response = authenticated_client.post("/api/moods/", {"emoji": "😊"})
        assert response.status_code == status.HTTP_201_CREATED

    def test_get_mood_detail_unauthenticated_returns_401(self, api_client, mood):
        """GET /api/moods/<pk>/ without auth returns 401."""
        response = api_client.get(f"/api/moods/{mood.pk}/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_mood_unauthenticated_returns_401(self, api_client, mood):
        """PUT /api/moods/<pk>/ without auth returns 401."""
        response = api_client.put(f"/api/moods/{mood.pk}/", {"emoji": "😔"})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_delete_mood_unauthenticated_returns_401(self, api_client, mood):
        """DELETE /api/moods/<pk>/ without auth returns 401."""
        response = api_client.delete(f"/api/moods/{mood.pk}/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    # -------------------------------------------------------------------------
    # Comments Endpoints
    # -------------------------------------------------------------------------

    def test_list_comments_unauthenticated_returns_401(self, api_client, mood):
        """GET /api/moods/<id>/comments/ without auth returns 401."""
        response = api_client.get(f"/api/moods/{mood.pk}/comments/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_comment_unauthenticated_returns_401(self, api_client, mood):
        """POST /api/moods/<id>/comments/ without auth returns 401."""
        response = api_client.post(
            f"/api/moods/{mood.pk}/comments/", {"content": "Test comment"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# =============================================================================
# Object-Level Permission Tests (Ownership)
# =============================================================================


@pytest.mark.django_db
class TestObjectLevelPermissions:
    """
    Tests for object-level permissions.

    Users should only be able to modify their OWN resources.
    Attempting to modify another user's resource should return 403 or 404.
    """

    # -------------------------------------------------------------------------
    # Mood Ownership
    # -------------------------------------------------------------------------

    def test_user_can_view_own_mood(self, authenticated_client, mood):
        """User can view their own mood."""
        response = authenticated_client.get(f"/api/moods/{mood.pk}/")
        assert response.status_code == status.HTTP_200_OK

    def test_user_cannot_view_other_users_mood(
        self, authenticated_client, other_user, mood_factory
    ):
        """User cannot view another user's mood (returns 404 for security)."""
        other_mood = mood_factory(user=other_user, emoji="😔")

        response = authenticated_client.get(f"/api/moods/{other_mood.pk}/")

        # Returns 404 instead of 403 to not reveal existence
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_user_can_update_own_mood(self, authenticated_client, mood):
        """User can update their own mood."""
        response = authenticated_client.patch(
            f"/api/moods/{mood.pk}/", {"reason": "Updated"}
        )
        assert response.status_code == status.HTTP_200_OK

    def test_user_cannot_update_other_users_mood(
        self, authenticated_client, other_user, mood_factory
    ):
        """User cannot update another user's mood."""
        other_mood = mood_factory(user=other_user, emoji="😔")

        response = authenticated_client.patch(
            f"/api/moods/{other_mood.pk}/", {"reason": "Hacked!"}
        )

        assert response.status_code == status.HTTP_404_NOT_FOUND
        other_mood.refresh_from_db()
        assert other_mood.reason != "Hacked!"  # Not modified

    def test_user_can_delete_own_mood(self, authenticated_client, user, mood_factory):
        """User can delete their own mood."""
        mood = mood_factory(user=user, emoji="😊")

        response = authenticated_client.delete(f"/api/moods/{mood.pk}/")

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Mood.objects.filter(pk=mood.pk).exists()

    def test_user_cannot_delete_other_users_mood(
        self, authenticated_client, other_user, mood_factory
    ):
        """User cannot delete another user's mood."""
        other_mood = mood_factory(user=other_user, emoji="😔")

        response = authenticated_client.delete(f"/api/moods/{other_mood.pk}/")

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert Mood.objects.filter(pk=other_mood.pk).exists()  # Still exists

    # -------------------------------------------------------------------------
    # Comment Ownership
    # -------------------------------------------------------------------------

    def test_user_can_update_own_comment(self, authenticated_client, user, mood):
        """User can update their own comment."""
        comment = MoodComment.objects.create(mood=mood, user=user, content="My comment")

        response = authenticated_client.put(
            f"/api/moods/comments/{comment.pk}/", {"content": "Updated comment"}
        )

        assert response.status_code == status.HTTP_200_OK
        comment.refresh_from_db()
        assert comment.content == "Updated comment"

    def test_user_cannot_update_other_users_comment(
        self, authenticated_client, other_user, mood
    ):
        """User cannot update another user's comment - returns 403."""
        comment = MoodComment.objects.create(
            mood=mood, user=other_user, content="Not my comment"
        )

        response = authenticated_client.put(
            f"/api/moods/comments/{comment.pk}/", {"content": "Trying to hack"}
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN
        comment.refresh_from_db()
        assert comment.content == "Not my comment"  # Unchanged

    def test_user_can_delete_own_comment(self, authenticated_client, user, mood):
        """User can delete their own comment."""
        comment = MoodComment.objects.create(mood=mood, user=user, content="To delete")

        response = authenticated_client.delete(f"/api/moods/comments/{comment.pk}/")

        assert response.status_code == status.HTTP_200_OK
        assert not MoodComment.objects.filter(pk=comment.pk).exists()

    def test_user_cannot_delete_other_users_comment(
        self, authenticated_client, other_user, mood
    ):
        """User cannot delete another user's comment - returns 403."""
        comment = MoodComment.objects.create(
            mood=mood, user=other_user, content="Not mine"
        )

        response = authenticated_client.delete(f"/api/moods/comments/{comment.pk}/")

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert MoodComment.objects.filter(pk=comment.pk).exists()


# =============================================================================
# Cross-User Interaction Tests
# =============================================================================


@pytest.mark.django_db
class TestCrossUserPermissions:
    """
    Tests for allowed cross-user interactions.

    Some actions ARE allowed across users (e.g., commenting on others' moods).
    """

    def test_user_can_comment_on_other_users_mood(
        self, authenticated_client, other_user, mood_factory
    ):
        """User CAN comment on another user's mood (this is allowed)."""
        other_mood = mood_factory(user=other_user, emoji="😊")

        response = authenticated_client.post(
            f"/api/moods/{other_mood.pk}/comments/", {"content": "Nice mood!"}
        )

        assert response.status_code == status.HTTP_201_CREATED
        assert other_mood.comments.count() == 1

    def test_user_can_reply_to_other_users_comment(
        self, authenticated_client, other_user, mood, user
    ):
        """User CAN reply to another user's comment (this is allowed)."""
        # Other user's comment
        parent_comment = MoodComment.objects.create(
            mood=mood, user=other_user, content="Original comment"
        )

        # Current user replies
        response = authenticated_client.post(
            f"/api/moods/comments/{parent_comment.pk}/replies/", {"content": "My reply"}
        )

        assert response.status_code == status.HTTP_201_CREATED

        # Verify reply is created by current user
        reply = MoodComment.objects.get(content="My reply")
        assert reply.user == user
        assert reply.parent == parent_comment

    def test_user_can_view_other_users_comments(
        self, authenticated_client, other_user, mood
    ):
        """User CAN view comments on any mood (read is public)."""
        # Other user's comment on the mood
        MoodComment.objects.create(mood=mood, user=other_user, content="Public comment")

        response = authenticated_client.get(f"/api/moods/{mood.pk}/comments/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1


# =============================================================================
# Admin Permission Tests
# =============================================================================


@pytest.mark.django_db
class TestAdminPermissions:
    """Tests for admin-specific permissions."""

    def test_admin_user_is_superuser(self, admin_user):
        """Verify admin_user fixture creates a superuser."""
        assert admin_user.is_superuser is True
        assert admin_user.is_staff is True

    def test_regular_user_is_not_superuser(self, user):
        """Verify regular user is not a superuser."""
        assert user.is_superuser is False
        assert user.is_staff is False

    def test_admin_client_is_authenticated(self, admin_client, admin_user):
        """Admin client is authenticated as admin."""
        # Make a request that requires auth
        response = admin_client.get("/api/moods/")
        assert response.status_code == status.HTTP_200_OK


# =============================================================================
# Token/JWT Permission Tests
# =============================================================================


@pytest.mark.django_db
class TestJWTPermissions:
    """Tests for JWT token-based authentication."""

    def test_valid_jwt_token_allows_access(self, api_client, user_with_token):
        """Valid JWT token allows access to protected endpoints."""
        user, token = user_with_token

        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = api_client.get("/api/moods/")

        assert response.status_code == status.HTTP_200_OK

    def test_invalid_jwt_token_denies_access(self, api_client):
        """Invalid JWT token is rejected."""
        api_client.credentials(HTTP_AUTHORIZATION="Bearer invalid_token_here")
        response = api_client.get("/api/moods/")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_expired_format_token_denies_access(self, api_client):
        """Malformed token is rejected."""
        api_client.credentials(HTTP_AUTHORIZATION="Bearer ")
        response = api_client.get("/api/moods/")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_missing_bearer_prefix_denies_access(self, api_client, user_with_token):
        """Token without 'Bearer' prefix is rejected."""
        user, token = user_with_token

        # Missing "Bearer " prefix
        api_client.credentials(HTTP_AUTHORIZATION=token)
        response = api_client.get("/api/moods/")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_auth_headers_fixture(self, api_client, auth_headers):
        """Test using auth_headers fixture."""
        response = api_client.get("/api/moods/", **auth_headers)

        assert response.status_code == status.HTTP_200_OK


# =============================================================================
# Edge Cases
# =============================================================================


@pytest.mark.django_db
class TestPermissionEdgeCases:
    """Edge cases for permission handling."""

    def test_accessing_nonexistent_resource_returns_404(self, authenticated_client):
        """Accessing non-existent resource returns 404, not 403."""
        response = authenticated_client.get("/api/moods/99999/")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_modifying_nonexistent_resource_returns_404(self, authenticated_client):
        """Modifying non-existent resource returns 404."""
        response = authenticated_client.delete("/api/moods/99999/")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_user_isolation_in_list(
        self, authenticated_client, user, other_user, mood_factory
    ):
        """Users only see their own moods in list, not others'."""
        # Create moods for both users
        my_mood = mood_factory(user=user, emoji="😊")
        other_mood = mood_factory(user=other_user, emoji="😔")

        response = authenticated_client.get("/api/moods/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1

        # Verify only own mood is returned
        mood_ids = [m["id"] for m in response.data["data"]]
        assert my_mood.pk in mood_ids
        assert other_mood.pk not in mood_ids
