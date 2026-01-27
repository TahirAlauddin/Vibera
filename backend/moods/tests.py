"""
Comprehensive test suite for Mood Comments feature.

This test suite covers:
- Authentication and authorization
- CRUD operations (Create, Read, Update, Delete)
- Nested replies functionality
- Validation and error handling
- Edge cases and boundary conditions
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Mood, MoodComment

User = get_user_model()


class MoodCommentTestCase(TestCase):
    """Base test case with common setup for mood comment tests"""

    def setUp(self):
        """Set up test data"""
        # Create test users
        self.user1 = User.objects.create_user(
            email="user1@test.com",
            username="user1",
            password="testpass123",
        )
        self.user2 = User.objects.create_user(
            email="user2@test.com",
            username="user2",
            password="testpass123",
        )

        # Create API clients
        self.client = APIClient()
        self.client_user1 = APIClient()
        self.client_user2 = APIClient()

        # Authenticate clients
        self.client_user1.force_authenticate(user=self.user1)
        self.client_user2.force_authenticate(user=self.user2)

        # Create test moods
        self.mood1 = Mood.objects.create(
            user=self.user1, emoji="😊", reason="Feeling great!"
        )
        self.mood2 = Mood.objects.create(
            user=self.user2, emoji="😔", reason="Not so good"
        )

    def get_auth_token(self, user):
        """Helper method to get JWT token for a user"""
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)


class MoodCommentListCreateTests(MoodCommentTestCase):
    """Tests for listing and creating top-level comments"""

    def test_list_comments_unauthenticated(self):
        """Test that unauthenticated users cannot list comments"""
        response = self.client.get(f"/api/moods/{self.mood1.id}/comments/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_comments_authenticated(self):
        """Test that authenticated users can list comments"""
        # Create some comments
        MoodComment.objects.create(
            mood=self.mood1, user=self.user1, content="First comment"
        )
        MoodComment.objects.create(
            mood=self.mood1, user=self.user2, content="Second comment"
        )

        response = self.client_user1.get(f"/api/moods/{self.mood1.id}/comments/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)
        self.assertEqual(len(response.data["data"]), 2)

    def test_list_comments_empty(self):
        """Test listing comments when no comments exist"""
        response = self.client_user1.get(f"/api/moods/{self.mood1.id}/comments/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)
        self.assertEqual(len(response.data["data"]), 0)

    def test_list_comments_only_top_level(self):
        """Test that only top-level comments are returned (not replies)"""
        # Create a top-level comment
        top_comment = MoodComment.objects.create(
            mood=self.mood1, user=self.user1, content="Top level comment"
        )
        # Create a reply
        MoodComment.objects.create(
            mood=self.mood1,
            user=self.user2,
            content="This is a reply",
            parent=top_comment,
        )

        response = self.client_user1.get(f"/api/moods/{self.mood1.id}/comments/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        # Check that the reply is nested in the top-level comment
        self.assertEqual(len(response.data["data"][0]["replies"]), 1)

    def test_create_comment_unauthenticated(self):
        """Test that unauthenticated users cannot create comments"""
        response = self.client.post(
            f"/api/moods/{self.mood1.id}/comments/",
            {"content": "Test comment"},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_comment_authenticated(self):
        """Test that authenticated users can create comments"""
        response = self.client_user1.post(
            f"/api/moods/{self.mood1.id}/comments/",
            {"content": "This is a test comment"},
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Comment created successfully")
        self.assertIn("data", response.data)
        self.assertEqual(response.data["data"]["content"], "This is a test comment")
        self.assertEqual(response.data["data"]["user"], "user1")

        # Verify comment was created in database
        comment = MoodComment.objects.get(id=response.data["data"]["id"])
        self.assertEqual(comment.mood, self.mood1)
        self.assertEqual(comment.user, self.user1)
        self.assertEqual(comment.parent, None)

    def test_create_comment_empty_content(self):
        """Test that comments with empty content are rejected"""
        response = self.client_user1.post(
            f"/api/moods/{self.mood1.id}/comments/",
            {"content": ""},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("content", response.data)

    def test_create_comment_whitespace_only(self):
        """Test that comments with only whitespace are rejected"""
        response = self.client_user1.post(
            f"/api/moods/{self.mood1.id}/comments/",
            {"content": "   "},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_comment_missing_content(self):
        """Test that comments without content field are rejected"""
        response = self.client_user1.post(
            f"/api/moods/{self.mood1.id}/comments/",
            {},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_comment_nonexistent_mood(self):
        """Test creating comment on non-existent mood"""
        response = self.client_user1.post(
            "/api/moods/99999/comments/",
            {"content": "Test comment"},
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_comment_long_content(self):
        """Test creating comment with very long content"""
        long_content = "A" * 10000
        response = self.client_user1.post(
            f"/api/moods/{self.mood1.id}/comments/",
            {"content": long_content},
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data["data"]["content"]), 10000)

    def test_create_comment_special_characters(self):
        """Test creating comment with special characters and emojis"""
        special_content = "Test comment with emojis 😊😔😡 and symbols !@#$%^&*()"
        response = self.client_user1.post(
            f"/api/moods/{self.mood1.id}/comments/",
            {"content": special_content},
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["data"]["content"], special_content)

    def test_create_comment_multiple_users(self):
        """Test multiple users can comment on the same mood"""
        # User1 creates a comment
        response1 = self.client_user1.post(
            f"/api/moods/{self.mood1.id}/comments/",
            {"content": "Comment from user1"},
        )
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)

        # User2 creates a comment on the same mood
        response2 = self.client_user2.post(
            f"/api/moods/{self.mood1.id}/comments/",
            {"content": "Comment from user2"},
        )
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)

        # Verify both comments exist
        comments = MoodComment.objects.filter(mood=self.mood1, parent__isnull=True)
        self.assertEqual(comments.count(), 2)


class MoodCommentDetailTests(MoodCommentTestCase):
    """Tests for updating and deleting comments"""

    def setUp(self):
        super().setUp()
        # Create test comments
        self.comment1 = MoodComment.objects.create(
            mood=self.mood1, user=self.user1, content="Original comment"
        )
        self.comment2 = MoodComment.objects.create(
            mood=self.mood1, user=self.user2, content="Another user's comment"
        )

    def test_update_comment_unauthenticated(self):
        """Test that unauthenticated users cannot update comments"""
        response = self.client.put(
            f"/api/moods/comments/{self.comment1.id}/",
            {"content": "Updated content"},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_own_comment_put(self):
        """Test that users can update their own comments using PUT"""
        response = self.client_user1.put(
            f"/api/moods/comments/{self.comment1.id}/",
            {"content": "Updated comment content"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Comment updated successfully")
        self.assertEqual(response.data["data"]["content"], "Updated comment content")

        # Verify in database
        self.comment1.refresh_from_db()
        self.assertEqual(self.comment1.content, "Updated comment content")

    def test_update_own_comment_patch(self):
        """Test that users can partially update their own comments using PATCH"""
        response = self.client_user1.patch(
            f"/api/moods/comments/{self.comment1.id}/",
            {"content": "Partially updated"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["content"], "Partially updated")

    def test_update_other_user_comment(self):
        """Test that users cannot update other users' comments"""
        response = self.client_user1.put(
            f"/api/moods/comments/{self.comment2.id}/",
            {"content": "Trying to update someone else's comment"},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("permission", response.data["error"].lower())

        # Verify comment was not changed
        self.comment2.refresh_from_db()
        self.assertEqual(self.comment2.content, "Another user's comment")

    def test_update_comment_empty_content(self):
        """Test that updating comment with empty content is rejected"""
        response = self.client_user1.put(
            f"/api/moods/comments/{self.comment1.id}/",
            {"content": ""},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_nonexistent_comment(self):
        """Test updating a non-existent comment"""
        response = self.client_user1.put(
            "/api/moods/comments/99999/",
            {"content": "Updated content"},
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_comment_unauthenticated(self):
        """Test that unauthenticated users cannot delete comments"""
        response = self.client.delete(f"/api/moods/comments/{self.comment1.id}/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_own_comment(self):
        """Test that users can delete their own comments"""
        comment_id = self.comment1.id
        response = self.client_user1.delete(f"/api/moods/comments/{comment_id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Comment deleted successfully")

        # Verify comment was deleted
        self.assertFalse(MoodComment.objects.filter(id=comment_id).exists())

    def test_delete_other_user_comment(self):
        """Test that users cannot delete other users' comments"""
        response = self.client_user1.delete(f"/api/moods/comments/{self.comment2.id}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("permission", response.data["error"].lower())

        # Verify comment still exists
        self.assertTrue(MoodComment.objects.filter(id=self.comment2.id).exists())

    def test_delete_nonexistent_comment(self):
        """Test deleting a non-existent comment"""
        response = self.client_user1.delete("/api/moods/comments/99999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_comment_preserves_timestamps(self):
        """Test that updating a comment updates updated_at but preserves created_at"""
        original_created_at = self.comment1.created_at
        original_updated_at = self.comment1.updated_at

        # Wait a moment to ensure timestamp difference
        import time
        time.sleep(0.1)

        response = self.client_user1.patch(
            f"/api/moods/comments/{self.comment1.id}/",
            {"content": "Updated"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.comment1.refresh_from_db()
        self.assertEqual(self.comment1.created_at, original_created_at)
        self.assertGreater(self.comment1.updated_at, original_updated_at)


class MoodCommentReplyTests(MoodCommentTestCase):
    """Tests for creating nested replies to comments"""

    def setUp(self):
        super().setUp()
        # Create a top-level comment
        self.top_comment = MoodComment.objects.create(
            mood=self.mood1, user=self.user1, content="Top level comment"
        )

    def test_create_reply_unauthenticated(self):
        """Test that unauthenticated users cannot create replies"""
        response = self.client.post(
            f"/api/moods/comments/{self.top_comment.id}/replies/",
            {"content": "Reply comment"},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_reply_authenticated(self):
        """Test that authenticated users can create replies"""
        response = self.client_user2.post(
            f"/api/moods/comments/{self.top_comment.id}/replies/",
            {"content": "This is a reply"},
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Reply created successfully")
        self.assertEqual(response.data["data"]["content"], "This is a reply")
        self.assertEqual(response.data["data"]["parent"], self.top_comment.id)

        # Verify reply was created correctly
        reply = MoodComment.objects.get(id=response.data["data"]["id"])
        self.assertEqual(reply.parent, self.top_comment)
        self.assertEqual(reply.mood, self.top_comment.mood)
        self.assertEqual(reply.user, self.user2)

    def test_create_reply_to_reply(self):
        """Test creating a reply to another reply (nested replies)"""
        # Create first reply
        first_reply = MoodComment.objects.create(
            mood=self.mood1,
            user=self.user2,
            content="First reply",
            parent=self.top_comment,
        )

        # Create reply to the first reply
        response = self.client_user1.post(
            f"/api/moods/comments/{first_reply.id}/replies/",
            {"content": "Reply to reply"},
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["data"]["parent"], first_reply.id)

    def test_create_reply_empty_content(self):
        """Test that replies with empty content are rejected"""
        response = self.client_user2.post(
            f"/api/moods/comments/{self.top_comment.id}/replies/",
            {"content": ""},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_reply_nonexistent_comment(self):
        """Test creating reply to non-existent comment"""
        response = self.client_user2.post(
            "/api/moods/comments/99999/replies/",
            {"content": "Reply"},
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_reply_inherits_mood(self):
        """Test that reply inherits the mood from parent comment"""
        response = self.client_user2.post(
            f"/api/moods/comments/{self.top_comment.id}/replies/",
            {"content": "Reply"},
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        reply = MoodComment.objects.get(id=response.data["data"]["id"])
        self.assertEqual(reply.mood, self.top_comment.mood)

    def test_multiple_replies_to_same_comment(self):
        """Test that multiple users can reply to the same comment"""
        # User2 replies
        response1 = self.client_user2.post(
            f"/api/moods/comments/{self.top_comment.id}/replies/",
            {"content": "Reply from user2"},
        )
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)

        # User1 replies to their own comment
        response2 = self.client_user1.post(
            f"/api/moods/comments/{self.top_comment.id}/replies/",
            {"content": "Reply from user1"},
        )
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)

        # Verify both replies exist
        replies = self.top_comment.replies.all()
        self.assertEqual(replies.count(), 2)


class MoodCommentNestedStructureTests(MoodCommentTestCase):
    """Tests for nested comment structure and serialization"""

    def setUp(self):
        super().setUp()
        # Create a complex nested structure
        self.top_comment = MoodComment.objects.create(
            mood=self.mood1, user=self.user1, content="Top comment"
        )
        self.reply1 = MoodComment.objects.create(
            mood=self.mood1,
            user=self.user2,
            content="First reply",
            parent=self.top_comment,
        )
        self.reply2 = MoodComment.objects.create(
            mood=self.mood1,
            user=self.user1,
            content="Second reply",
            parent=self.top_comment,
        )
        self.nested_reply = MoodComment.objects.create(
            mood=self.mood1,
            user=self.user2,
            content="Nested reply",
            parent=self.reply1,
        )

    def test_nested_replies_serialization(self):
        """Test that nested replies are properly serialized"""
        response = self.client_user1.get(f"/api/moods/{self.mood1.id}/comments/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

        top_comment_data = response.data["data"][0]
        self.assertEqual(top_comment_data["id"], self.top_comment.id)
        self.assertEqual(top_comment_data["reply_count"], 2)
        self.assertEqual(len(top_comment_data["replies"]), 2)

        # Check first reply has nested reply
        first_reply = next(
            r for r in top_comment_data["replies"] if r["id"] == self.reply1.id
        )
        self.assertEqual(len(first_reply["replies"]), 1)
        self.assertEqual(first_reply["replies"][0]["id"], self.nested_reply.id)

    def test_reply_count_calculation(self):
        """Test that reply_count only counts direct replies"""
        response = self.client_user1.get(f"/api/moods/{self.mood1.id}/comments/")
        top_comment_data = response.data["data"][0]
        # Should only count direct replies, not nested ones
        self.assertEqual(top_comment_data["reply_count"], 2)

    def test_replies_ordered_by_created_at(self):
        """Test that replies are ordered by creation date"""
        response = self.client_user1.get(f"/api/moods/{self.mood1.id}/comments/")
        top_comment_data = response.data["data"][0]
        replies = top_comment_data["replies"]

        # Replies should be ordered by created_at (oldest first)
        self.assertEqual(replies[0]["id"], self.reply1.id)
        self.assertEqual(replies[1]["id"], self.reply2.id)


class MoodCommentEdgeCasesTests(MoodCommentTestCase):
    """Tests for edge cases and boundary conditions"""

    def test_delete_comment_with_replies(self):
        """Test behavior when deleting a comment that has replies"""
        top_comment = MoodComment.objects.create(
            mood=self.mood1, user=self.user1, content="Comment with replies"
        )
        reply = MoodComment.objects.create(
            mood=self.mood1,
            user=self.user2,
            content="Reply",
            parent=top_comment,
        )

        # Delete the parent comment
        response = self.client_user1.delete(f"/api/moods/comments/{top_comment.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify both comment and reply are deleted (CASCADE)
        self.assertFalse(MoodComment.objects.filter(id=top_comment.id).exists())
        self.assertFalse(MoodComment.objects.filter(id=reply.id).exists())

    def test_delete_mood_with_comments(self):
        """Test that deleting a mood deletes all its comments (CASCADE)"""
        comment1 = MoodComment.objects.create(
            mood=self.mood1, user=self.user1, content="Comment 1"
        )
        comment2 = MoodComment.objects.create(
            mood=self.mood1, user=self.user2, content="Comment 2"
        )
        reply = MoodComment.objects.create(
            mood=self.mood1, user=self.user1, content="Reply", parent=comment1
        )

        # Delete the mood
        self.mood1.delete()

        # Verify all comments are deleted
        self.assertFalse(MoodComment.objects.filter(id=comment1.id).exists())
        self.assertFalse(MoodComment.objects.filter(id=comment2.id).exists())
        self.assertFalse(MoodComment.objects.filter(id=reply.id).exists())

    def test_comment_fields_read_only(self):
        """Test that read-only fields cannot be modified"""
        comment = MoodComment.objects.create(
            mood=self.mood1, user=self.user1, content="Original"
        )
        original_user = comment.user
        original_created_at = comment.created_at

        # Try to update read-only fields
        response = self.client_user1.patch(
            f"/api/moods/comments/{comment.id}/",
            {
                "user": self.user2.id,
                "created_at": "2020-01-01T00:00:00Z",
                "content": "Updated",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify read-only fields were not changed
        comment.refresh_from_db()
        self.assertEqual(comment.user, original_user)
        self.assertEqual(comment.created_at, original_created_at)
        self.assertEqual(comment.content, "Updated")

    def test_comment_ordering(self):
        """Test that comments are ordered by creation date (newest first)"""
        comment1 = MoodComment.objects.create(
            mood=self.mood1, user=self.user1, content="First"
        )
        import time
        time.sleep(0.1)
        comment2 = MoodComment.objects.create(
            mood=self.mood1, user=self.user2, content="Second"
        )

        response = self.client_user1.get(f"/api/moods/{self.mood1.id}/comments/")
        comments = response.data["data"]
        # Should be ordered newest first
        self.assertEqual(comments[0]["id"], comment2.id)
        self.assertEqual(comments[1]["id"], comment1.id)

    def test_comment_on_different_moods(self):
        """Test that comments are properly scoped to their moods"""
        comment1 = MoodComment.objects.create(
            mood=self.mood1, user=self.user1, content="Comment on mood1"
        )
        comment2 = MoodComment.objects.create(
            mood=self.mood2, user=self.user2, content="Comment on mood2"
        )

        # Get comments for mood1
        response = self.client_user1.get(f"/api/moods/{self.mood1.id}/comments/")
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["data"][0]["id"], comment1.id)

        # Get comments for mood2
        response = self.client_user1.get(f"/api/moods/{self.mood2.id}/comments/")
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["data"][0]["id"], comment2.id)


class MoodCommentIntegrationTests(MoodCommentTestCase):
    """Integration tests for complete workflows"""

    def test_complete_comment_workflow(self):
        """Test a complete workflow: create, list, update, delete"""
        # 1. Create a comment
        create_response = self.client_user1.post(
            f"/api/moods/{self.mood1.id}/comments/",
            {"content": "Initial comment"},
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        comment_id = create_response.data["data"]["id"]

        # 2. List comments and verify it appears
        list_response = self.client_user1.get(f"/api/moods/{self.mood1.id}/comments/")
        self.assertEqual(list_response.data["count"], 1)
        self.assertEqual(list_response.data["data"][0]["id"], comment_id)

        # 3. Update the comment
        update_response = self.client_user1.patch(
            f"/api/moods/comments/{comment_id}/",
            {"content": "Updated comment"},
        )
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)

        # 4. Verify update in list
        list_response = self.client_user1.get(f"/api/moods/{self.mood1.id}/comments/")
        self.assertEqual(list_response.data["data"][0]["content"], "Updated comment")

        # 5. Delete the comment
        delete_response = self.client_user1.delete(f"/api/moods/comments/{comment_id}/")
        self.assertEqual(delete_response.status_code, status.HTTP_200_OK)

        # 6. Verify deletion
        list_response = self.client_user1.get(f"/api/moods/{self.mood1.id}/comments/")
        self.assertEqual(list_response.data["count"], 0)

    def test_nested_reply_workflow(self):
        """Test complete workflow with nested replies"""
        # 1. Create top-level comment
        top_response = self.client_user1.post(
            f"/api/moods/{self.mood1.id}/comments/",
            {"content": "Top comment"},
        )
        top_comment_id = top_response.data["data"]["id"]

        # 2. Create reply
        reply_response = self.client_user2.post(
            f"/api/moods/comments/{top_comment_id}/replies/",
            {"content": "Reply"},
        )
        reply_id = reply_response.data["data"]["id"]

        # 3. Create nested reply
        nested_response = self.client_user1.post(
            f"/api/moods/comments/{reply_id}/replies/",
            {"content": "Nested reply"},
        )
        nested_id = nested_response.data["data"]["id"]

        # 4. Verify structure
        list_response = self.client_user1.get(f"/api/moods/{self.mood1.id}/comments/")
        top_comment = list_response.data["data"][0]
        self.assertEqual(top_comment["reply_count"], 1)
        self.assertEqual(len(top_comment["replies"][0]["replies"]), 1)
        self.assertEqual(top_comment["replies"][0]["replies"][0]["id"], nested_id)
