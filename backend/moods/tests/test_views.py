"""
Tests for Moods API Views using DRF's APIClient.

Tests cover:
- Authentication requirements (401 Unauthorized)
- CRUD operations (200, 201, 204)
- Permission checks (403 Forbidden)
- Validation errors (400 Bad Request)
- Not found errors (404 Not Found)

Using fixtures from conftest.py to avoid repetition.
"""

import pytest
from django.urls import reverse
from rest_framework import status
from moods.models import Mood, MoodComment


# =============================================================================
# MoodLogView Tests (List & Create)
# =============================================================================


@pytest.mark.django_db
class TestMoodLogView:
    """Tests for GET /api/moods/ and POST /api/moods/"""

    url = "/api/moods/"

    # -------------------------------------------------------------------------
    # Authentication Tests
    # -------------------------------------------------------------------------

    def test_list_moods_unauthenticated(self, api_client):
        """Unauthenticated users should get 401."""
        response = api_client.get(self.url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_mood_unauthenticated(self, api_client):
        """Unauthenticated users cannot create moods."""
        response = api_client.post(self.url, {"emoji": "😊"})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    # -------------------------------------------------------------------------
    # GET - List Moods
    # -------------------------------------------------------------------------

    def test_list_moods_empty(self, authenticated_client):
        """Authenticated user with no moods gets empty list."""
        response = authenticated_client.get(self.url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == []

    def test_list_moods_with_data(self, authenticated_client, user, mood_factory):
        """Authenticated user sees their own moods."""
        mood_factory(user=user, emoji="😊")
        mood_factory(user=user, emoji="😔")

        response = authenticated_client.get(self.url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_list_moods_only_own(
        self, authenticated_client, user, other_user, mood_factory
    ):
        """Users only see their own moods, not others'."""
        mood_factory(user=user, emoji="😊")
        mood_factory(user=other_user, emoji="😔")  # Other user's mood

        response = authenticated_client.get(self.url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1  # Only own mood

    # -------------------------------------------------------------------------
    # POST - Create Mood
    # -------------------------------------------------------------------------

    def test_create_mood_success(self, authenticated_client, user):
        """Create mood with valid data."""
        data = {"emoji": "😊", "reason": "Had a great day!"}

        response = authenticated_client.post(self.url, data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["emoji"] == "😊"
        assert Mood.objects.filter(user=user).count() == 1

    def test_create_mood_minimal(self, authenticated_client, user):
        """Create mood with only required field."""
        data = {"emoji": "😊"}

        response = authenticated_client.post(self.url, data)

        assert response.status_code == status.HTTP_201_CREATED
        assert Mood.objects.filter(user=user, emoji="😊").exists()

    def test_create_mood_invalid_emoji(self, authenticated_client):
        """Create mood with invalid emoji fails."""
        data = {"emoji": "invalid"}

        response = authenticated_client.post(self.url, data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_mood_missing_emoji(self, authenticated_client):
        """Create mood without emoji fails."""
        data = {"reason": "No emoji provided"}

        response = authenticated_client.post(self.url, data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST


# =============================================================================
# MoodLogDetailView Tests (Retrieve, Update, Delete)
# =============================================================================


@pytest.mark.django_db
class TestMoodLogDetailView:
    """Tests for /api/moods/<pk>/"""

    def get_url(self, pk):
        return f"/api/moods/{pk}/"

    # -------------------------------------------------------------------------
    # Authentication Tests
    # -------------------------------------------------------------------------

    def test_get_mood_unauthenticated(self, api_client, mood):
        """Unauthenticated users cannot access mood details."""
        response = api_client.get(self.get_url(mood.pk))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    # -------------------------------------------------------------------------
    # GET - Retrieve Mood
    # -------------------------------------------------------------------------

    def test_get_mood_success(self, authenticated_client, mood):
        """Get own mood details."""
        response = authenticated_client.get(self.get_url(mood.pk))

        assert response.status_code == status.HTTP_200_OK
        assert response.data["emoji"] == mood.emoji

    def test_get_mood_not_found(self, authenticated_client):
        """Get non-existent mood returns 404."""
        response = authenticated_client.get(self.get_url(99999))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_other_user_mood(self, authenticated_client, other_user, mood_factory):
        """Cannot access another user's mood."""
        other_mood = mood_factory(user=other_user, emoji="😔")

        response = authenticated_client.get(self.get_url(other_mood.pk))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    # -------------------------------------------------------------------------
    # PUT - Full Update
    # -------------------------------------------------------------------------

    def test_put_mood_success(self, authenticated_client, mood):
        """Full update of own mood."""
        data = {"emoji": "😔", "reason": "Changed my mind"}

        response = authenticated_client.put(self.get_url(mood.pk), data)

        assert response.status_code == status.HTTP_200_OK
        mood.refresh_from_db()
        assert mood.emoji == "😔"
        assert mood.reason == "Changed my mind"

    def test_put_mood_not_found(self, authenticated_client):
        """Update non-existent mood returns 404."""
        data = {"emoji": "😔"}

        response = authenticated_client.put(self.get_url(99999), data)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    # -------------------------------------------------------------------------
    # PATCH - Partial Update
    # -------------------------------------------------------------------------

    def test_patch_mood_success(self, authenticated_client, mood):
        """Partial update of own mood."""
        original_emoji = mood.emoji
        data = {"reason": "Updated reason only"}

        response = authenticated_client.patch(self.get_url(mood.pk), data)

        assert response.status_code == status.HTTP_200_OK
        mood.refresh_from_db()
        assert mood.emoji == original_emoji  # Unchanged
        assert mood.reason == "Updated reason only"

    # -------------------------------------------------------------------------
    # DELETE
    # -------------------------------------------------------------------------

    def test_delete_mood_success(self, authenticated_client, mood):
        """Delete own mood."""
        mood_pk = mood.pk

        response = authenticated_client.delete(self.get_url(mood_pk))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Mood.objects.filter(pk=mood_pk).exists()

    def test_delete_mood_not_found(self, authenticated_client):
        """Delete non-existent mood returns 404."""
        response = authenticated_client.delete(self.get_url(99999))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_other_user_mood(
        self, authenticated_client, other_user, mood_factory
    ):
        """Cannot delete another user's mood."""
        other_mood = mood_factory(user=other_user, emoji="😔")

        response = authenticated_client.delete(self.get_url(other_mood.pk))

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert Mood.objects.filter(pk=other_mood.pk).exists()  # Still exists


# =============================================================================
# MoodCommentListView Tests
# =============================================================================


@pytest.mark.django_db
class TestMoodCommentListView:
    """Tests for /api/moods/<mood_id>/comments/"""

    def get_url(self, mood_id):
        return f"/api/moods/{mood_id}/comments/"

    # -------------------------------------------------------------------------
    # GET - List Comments
    # -------------------------------------------------------------------------

    def test_list_comments_success(self, authenticated_client, mood_with_comment):
        """List comments on a mood."""
        mood, comment = mood_with_comment

        response = authenticated_client.get(self.get_url(mood.pk))

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1

    def test_list_comments_empty(self, authenticated_client, mood):
        """Mood with no comments returns empty list."""
        response = authenticated_client.get(self.get_url(mood.pk))

        assert response.status_code == status.HTTP_200_OK
        assert response.data == []

    def test_list_comments_mood_not_found(self, authenticated_client):
        """List comments on non-existent mood returns 404."""
        response = authenticated_client.get(self.get_url(99999))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    # -------------------------------------------------------------------------
    # POST - Create Comment
    # -------------------------------------------------------------------------

    def test_create_comment_success(self, authenticated_client, mood):
        """Create a comment on a mood."""
        data = {"content": "Great mood!"}

        response = authenticated_client.post(self.get_url(mood.pk), data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["content"] == "Great mood!"
        assert mood.comments.count() == 1

    def test_create_comment_empty_content(self, authenticated_client, mood):
        """Cannot create comment without content."""
        data = {"content": ""}

        response = authenticated_client.post(self.get_url(mood.pk), data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_comment_unauthenticated(self, api_client, mood):
        """Unauthenticated users cannot comment."""
        data = {"content": "Test comment"}

        response = api_client.post(self.get_url(mood.pk), data)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# =============================================================================
# MoodCommentDetailView Tests
# =============================================================================


@pytest.mark.django_db
class TestMoodCommentDetailView:
    """Tests for /api/moods/comments/<comment_id>/"""

    def get_url(self, comment_id):
        return f"/api/moods/comments/{comment_id}/"

    # -------------------------------------------------------------------------
    # PUT - Update Comment
    # -------------------------------------------------------------------------

    def test_update_own_comment_success(self, authenticated_client, user, mood):
        """Update own comment."""
        comment = MoodComment.objects.create(mood=mood, user=user, content="Original")
        data = {"content": "Updated content"}

        response = authenticated_client.put(self.get_url(comment.pk), data)

        assert response.status_code == status.HTTP_200_OK
        comment.refresh_from_db()
        assert comment.content == "Updated content"

    def test_update_other_user_comment_forbidden(
        self, authenticated_client, other_user, mood
    ):
        """Cannot update another user's comment."""
        comment = MoodComment.objects.create(
            mood=mood, user=other_user, content="Not yours"
        )
        data = {"content": "Trying to update"}

        response = authenticated_client.put(self.get_url(comment.pk), data)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    # -------------------------------------------------------------------------
    # DELETE - Delete Comment
    # -------------------------------------------------------------------------

    def test_delete_own_comment_success(self, authenticated_client, user, mood):
        """Delete own comment."""
        comment = MoodComment.objects.create(mood=mood, user=user, content="To delete")
        comment_pk = comment.pk

        response = authenticated_client.delete(self.get_url(comment_pk))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not MoodComment.objects.filter(pk=comment_pk).exists()

    def test_delete_other_user_comment_forbidden(
        self, authenticated_client, other_user, mood
    ):
        """Cannot delete another user's comment."""
        comment = MoodComment.objects.create(
            mood=mood, user=other_user, content="Not yours"
        )

        response = authenticated_client.delete(self.get_url(comment.pk))

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert MoodComment.objects.filter(pk=comment.pk).exists()


# =============================================================================
# MoodCommentReplyView Tests
# =============================================================================


@pytest.mark.django_db
class TestMoodCommentReplyView:
    """Tests for /api/moods/comments/<comment_id>/replies/"""

    def get_url(self, comment_id):
        return f"/api/moods/comments/{comment_id}/replies/"

    def test_create_reply_success(self, authenticated_client, mood_with_comment):
        """Create a reply to an existing comment."""
        mood, parent_comment = mood_with_comment
        data = {"content": "This is a reply"}

        response = authenticated_client.post(self.get_url(parent_comment.pk), data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["content"] == "This is a reply"

        # Verify reply is linked to parent
        reply = MoodComment.objects.get(content="This is a reply")
        assert reply.parent == parent_comment
        assert reply.mood == mood

    def test_create_reply_to_nonexistent_comment(self, authenticated_client):
        """Reply to non-existent comment returns 404."""
        data = {"content": "Reply to nothing"}

        response = authenticated_client.post(self.get_url(99999), data)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_create_reply_unauthenticated(self, api_client, mood_with_comment):
        """Unauthenticated users cannot reply."""
        mood, comment = mood_with_comment
        data = {"content": "Anonymous reply"}

        response = api_client.post(self.get_url(comment.pk), data)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# =============================================================================
# Integration Tests
# =============================================================================


@pytest.mark.django_db
class TestMoodAPIIntegration:
    """Integration tests for complete workflows."""

    def test_full_mood_lifecycle(self, authenticated_client, user):
        """Test create -> read -> update -> delete workflow."""
        # CREATE
        create_response = authenticated_client.post(
            "/api/moods/", {"emoji": "😊", "reason": "Initial mood"}
        )
        assert create_response.status_code == status.HTTP_201_CREATED
        mood_id = create_response.data["id"]

        # READ
        read_response = authenticated_client.get(f"/api/moods/{mood_id}/")
        assert read_response.status_code == status.HTTP_200_OK
        assert read_response.data["emoji"] == "😊"

        # UPDATE
        update_response = authenticated_client.patch(
            f"/api/moods/{mood_id}/", {"reason": "Updated mood"}
        )
        assert update_response.status_code == status.HTTP_200_OK

        # DELETE
        delete_response = authenticated_client.delete(f"/api/moods/{mood_id}/")
        assert delete_response.status_code == status.HTTP_204_NO_CONTENT

        # VERIFY DELETED
        verify_response = authenticated_client.get(f"/api/moods/{mood_id}/")
        assert verify_response.status_code == status.HTTP_404_NOT_FOUND

    def test_mood_with_comments_workflow(
        self, authenticated_client, user, other_user, mood_factory, api_client
    ):
        """Test mood creation with comments and replies."""
        # User creates mood
        mood = mood_factory(user=user, emoji="😊")

        # Authenticate as other_user
        api_client.force_authenticate(user=other_user)

        # Other user comments
        comment_response = api_client.post(
            f"/api/moods/{mood.pk}/comments/", {"content": "Nice mood!"}
        )
        assert comment_response.status_code == status.HTTP_201_CREATED

        # Original user can see the comment
        list_response = authenticated_client.get(f"/api/moods/{mood.pk}/comments/")
        assert list_response.status_code == status.HTTP_200_OK
        assert len(list_response.data) == 1
