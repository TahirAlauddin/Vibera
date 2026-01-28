# Mood Comments Feature - Comprehensive Testing Guide

This guide provides a complete overview of how to test the mood comments feature thoroughly, including automated tests, manual testing, and API testing.

## Table of Contents

1. [Running Automated Tests](#running-automated-tests)
2. [Test Coverage Overview](#test-coverage-overview)
3. [API Contract](#api-contract)
4. [Manual Testing Checklist](#manual-testing-checklist)
5. [API Testing with Tools](#api-testing-with-tools)
6. [Edge Cases to Verify](#edge-cases-to-verify)
7. [Performance Testing](#performance-testing)

## Running Automated Tests

### Run All Mood Comment Tests

```bash
cd backend
python manage.py test moods.tests
```

### Run Specific Test Classes

```bash
# Test comment listing and creation
python manage.py test moods.tests.MoodCommentListCreateTests

# Test comment updates and deletions
python manage.py test moods.tests.MoodCommentDetailTests

# Test nested replies
python manage.py test moods.tests.MoodCommentReplyTests

# Test nested structure and serialization
python manage.py test moods.tests.MoodCommentNestedStructureTests

# Test edge cases
python manage.py test moods.tests.MoodCommentEdgeCasesTests

# Test integration workflows
python manage.py test moods.tests.MoodCommentIntegrationTests
```

### Run with Verbose Output

```bash
python manage.py test moods.tests --verbosity=2
```

### Run Specific Test Methods

```bash
python manage.py test moods.tests.MoodCommentListCreateTests.test_create_comment_authenticated
```

## Test Coverage Overview

The test suite includes **40+ test cases** covering:

### 1. Authentication & Authorization (8 tests)
- ✅ Unauthenticated access prevention
- ✅ Authenticated access allowed
- ✅ Ownership verification for updates/deletes
- ✅ Permission checks for different users

### 2. CRUD Operations (15 tests)
- ✅ Create top-level comments
- ✅ List comments (top-level only)
- ✅ Update own comments (PUT & PATCH)
- ✅ Delete own comments
- ✅ Prevent updating/deleting others' comments

### 3. Nested Replies (8 tests)
- ✅ Create replies to top-level comments
- ✅ Prevent replies to replies (single-level nesting enforced)
- ✅ Reply inheritance of mood
- ✅ Multiple replies to same comment

### 4. Validation & Error Handling (12 tests)
- ✅ Empty content rejection
- ✅ Whitespace-only rejection
- ✅ Missing field validation
- ✅ Non-existent resource handling (404)
- ✅ Special characters and emojis support
- ✅ Long content handling

### 5. Data Structure & Serialization (6 tests)
- ✅ Nested reply serialization (only direct replies nested)
- ✅ Reply count calculation (counts only direct replies)
- ✅ Comment ordering (newest first for top-level comments)
- ✅ Reply ordering (oldest first for replies)
- ✅ Read-only field protection

## API Contract

This section documents the expected request/response shapes for the Mood Comments API,
based on the current `ModelViewSet` implementation.

### 1. List Comments for a Mood

- **Endpoint**: `GET /api/moods/{mood_id}/comments/`
- **Auth**: Required (JWT)
- **Response 200 OK**:
  - Returns a **JSON array** of top-level comments (no wrapper object):
  ```json
  [
    {
      "id": 1,
      "user": "user1",
      "content": "Top level comment",
      "parent": null,
      "replies": [
        {
          "id": 2,
          "user": "user2",
          "content": "Reply",
          "created_at": "...",
          "updated_at": "..."
        }
      ],
      "reply_count": 1,
      "created_at": "...",
      "updated_at": "..."
    }
  ]
  ```
  - **Notes**:
    - Only **top-level** comments are returned at the root level.
    - `replies` contains **only direct replies**, ordered by `created_at` ascending
      (oldest first).
    - `reply_count` counts **only direct** replies.

### 2. Create a Top-Level Comment

- **Endpoint**: `POST /api/moods/{mood_id}/comments/`
- **Auth**: Required (JWT)
- **Body**:
  ```json
  { "content": "This is a comment" }
  ```
- **Response 201 Created**:
  ```json
  {
    "id": 123,
    "user": "user1",
    "content": "This is a comment",
    "parent": null,
    "replies": [],
    "reply_count": 0,
    "created_at": "...",
    "updated_at": "..."
  }
  ```
- **Validation errors 400 Bad Request**:
  ```json
  { "content": ["Comment content cannot be empty."] }
  ```
- **Notes**:
  - `content` must not be empty or whitespace-only.
  - There is no artificial maximum length enforced at serializer level; database
    limits still apply.

### 3. Create a Reply

- **Endpoint**: `POST /api/moods/comments/{comment_id}/replies/`
- **Auth**: Required (JWT)
- **Body**:
  ```json
  { "content": "This is a reply" }
  ```
- **Response 201 Created (for valid reply to top-level comment)**:
  ```json
  {
    "id": 200,
    "user": "user2",
    "content": "This is a reply",
    "parent": 123,
    "created_at": "...",
    "updated_at": "..."
  }
  ```
- **Reply-to-reply rejected 400 Bad Request**:
  ```json
  {
    "parent": [
      "Cannot reply to a reply. Only top-level comments can have replies."
    ]
  }
  ```
- **Notes**:
  - Replies automatically **inherit the mood** from the parent comment.
  - Only **one level of nesting** is allowed (`comment -> reply`). Deeper nesting
    attempts are rejected with the `parent` validation error above.

### 4. Update a Comment

- **Endpoint**:
  - `PUT /api/moods/comments/{comment_id}/`
  - `PATCH /api/moods/comments/{comment_id}/`
- **Auth**: Required, owner-only
- **Body** (example PATCH):
  ```json
  { "content": "Updated content" }
  ```
- **Response 200 OK**:
  ```json
  {
    "id": 123,
    "user": "user1",
    "content": "Updated content",
    "parent": null,
    "replies": [],
    "reply_count": 0,
    "created_at": "...",
    "updated_at": "..."
  }
  ```
- **Permission failure 403 Forbidden** (non-owner):
  ```json
  { "detail": "You do not have permission to perform this action." }
  ```

### 5. Delete a Comment

- **Endpoint**: `DELETE /api/moods/comments/{comment_id}/`
- **Auth**: Required, owner-only
- **Response 204 No Content**:
  - Empty body on success.
- **Permission failure 403 Forbidden**:
  ```json
  { "detail": "You do not have permission to perform this action." }
  ```

### 6. Common Error Responses

- **401 Unauthorized** (no or invalid token):
  ```json
  { "detail": "Authentication credentials were not provided." }
  ```
- **404 Not Found** (non-existent mood or comment):
  ```json
  { "detail": "Not found." }
  ```

### 6. Edge Cases & Cascades (8 tests)
- ✅ Deleting comment with replies (CASCADE)
- ✅ Deleting mood with comments (CASCADE)
- ✅ Multiple users commenting on same mood
- ✅ Comments scoped to correct moods

### 7. Integration Workflows (3 tests)
- ✅ Complete CRUD workflow
- ✅ Nested reply workflow
- ✅ Multi-user interaction scenarios

## Manual Testing Checklist

### Prerequisites

1. **Set up authentication:**
   ```bash
   # Register a user
   POST /api/auth/users/
   {
     "email": "test@example.com",
     "username": "testuser",
     "password": "testpass123"
   }

   # Get JWT token
   POST /api/auth/jwt/create/
   {
     "username": "testuser",
     "password": "testpass123"
   }
   ```

2. **Create test moods:**
   ```bash
   POST /api/moods/
   Authorization: Bearer <token>
   {
     "emoji": "😊",
     "reason": "Feeling great!"
   }
   ```

### Test Scenarios

#### ✅ Basic Comment Operations

- [ ] **Create Comment**
  - POST `/api/moods/{mood_id}/comments/`
  - Verify: 201 Created, comment appears in list
  
- [ ] **List Comments**
  - GET `/api/moods/{mood_id}/comments/`
  - Verify: Returns only top-level comments with nested replies
  
- [ ] **Update Comment**
  - PUT/PATCH `/api/moods/comments/{comment_id}/`
  - Verify: Only owner can update, content changes
  
- [ ] **Delete Comment**
  - DELETE `/api/moods/comments/{comment_id}/`
  - Verify: Only owner can delete, comment removed

#### ✅ Nested Replies

- [ ] **Create Reply**
  - POST `/api/moods/comments/{comment_id}/replies/`
  - Verify: Reply appears nested under parent
  
- [ ] **Reply to Reply (Should Fail)**
  - POST `/api/moods/comments/{reply_id}/replies/` where `{reply_id}` is itself a reply
  - Verify: 400 Bad Request with a `parent` validation error indicating that only
    top-level comments can have replies
  
- [ ] **Multiple Replies**
  - Create multiple replies to same comment
  - Verify: All replies appear, properly ordered

#### ✅ Authentication & Permissions

- [ ] **Unauthenticated Access**
  - Try all endpoints without token
  - Verify: 401 Unauthorized for all
  
- [ ] **Cross-User Permissions**
  - User A creates comment
  - User B tries to update/delete
  - Verify: 403 Forbidden

#### ✅ Validation

- [ ] **Empty Content**
  - POST with empty string
  - Verify: 400 Bad Request
  
- [ ] **Whitespace Only**
  - POST with only spaces
  - Verify: 400 Bad Request
  
- [ ] **Missing Fields**
  - POST without content field
  - Verify: 400 Bad Request

#### ✅ Edge Cases

- [ ] **Non-existent Mood**
  - POST to `/api/moods/99999/comments/`
  - Verify: 404 Not Found
  
- [ ] **Non-existent Comment**
  - GET/PUT/DELETE `/api/moods/comments/99999/`
  - Verify: 404 Not Found
  
- [ ] **Special Characters**
  - Create comment with emojis, symbols
  - Verify: Handled correctly
  
- [ ] **Long Content**
  - Create comment with 10,000+ characters
  - Verify: Handles gracefully

#### ✅ Data Integrity

- [ ] **Cascade Deletion**
  - Delete comment with replies
  - Verify: Replies also deleted
  
- [ ] **Mood Deletion**
  - Delete mood with comments
  - Verify: All comments deleted
  
- [ ] **Comment Scoping**
  - Create comments on different moods
  - Verify: Comments only appear for correct mood

## API Testing with Tools

### Using cURL

```bash
# Set your token
TOKEN="your_jwt_token_here"
MOOD_ID=1

# Create a comment
curl -X POST "http://localhost:8000/api/moods/${MOOD_ID}/comments/" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"content": "This is a test comment"}'

# List comments
curl -X GET "http://localhost:8000/api/moods/${MOOD_ID}/comments/" \
  -H "Authorization: Bearer ${TOKEN}"

# Update comment
COMMENT_ID=1
curl -X PATCH "http://localhost:8000/api/moods/comments/${COMMENT_ID}/" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"content": "Updated comment"}'

# Delete comment
curl -X DELETE "http://localhost:8000/api/moods/comments/${COMMENT_ID}/" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Using Postman

1. **Create Environment Variables:**
   - `base_url`: `http://localhost:8000`
   - `token`: Your JWT token
   - `mood_id`: Test mood ID
   - `comment_id`: Test comment ID

2. **Create Collection:**
   - Mood Comments - List
   - Mood Comments - Create
   - Mood Comments - Update
   - Mood Comments - Delete
   - Mood Comments - Create Reply
   - Mood Comments - Nested Reply

3. **Set Authorization:**
   - Type: Bearer Token
   - Token: `{{token}}`

### Using HTTPie

```bash
# Install HTTPie if needed
pip install httpie

# Create comment
http POST localhost:8000/api/moods/1/comments/ \
  "Authorization: Bearer ${TOKEN}" \
  content="Test comment"

# List comments
http GET localhost:8000/api/moods/1/comments/ \
  "Authorization: Bearer ${TOKEN}"

# Update comment
http PATCH localhost:8000/api/moods/comments/1/ \
  "Authorization: Bearer ${TOKEN}" \
  content="Updated"
```

## Edge Cases to Verify

### 1. Concurrent Operations
- Multiple users commenting simultaneously
- Same user updating while another views
- Race conditions in reply creation

### 2. Large Data Sets
- Mood with 100+ comments
- Comment with 50+ replies
- Deep nesting (10+ levels)

### 3. Unicode & Special Content
- Emojis in comments
- HTML/script tags (should be escaped)
- SQL injection attempts
- XSS attempts

### 4. Performance
- Response time with many comments
- Database query efficiency
- Serialization performance

### 5. Boundary Conditions
- Maximum content length
- Minimum content length (1 character)
- Very old comments
- Very recent comments

## Performance Testing

### Load Testing with Locust

Create `locustfile.py`:

```python
from locust import HttpUser, task, between
import random

class MoodCommentUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        # Login and get token
        response = self.client.post("/api/auth/jwt/create/", json={
            "username": "testuser",
            "password": "testpass123"
        })
        self.token = response.json()["access"]
        self.client.headers = {"Authorization": f"Bearer {self.token}"}
        self.mood_id = 1
    
    @task(3)
    def list_comments(self):
        self.client.get(f"/api/moods/{self.mood_id}/comments/")
    
    @task(2)
    def create_comment(self):
        self.client.post(
            f"/api/moods/{self.mood_id}/comments/",
            json={"content": f"Test comment {random.randint(1, 1000)}"}
        )
    
    @task(1)
    def create_reply(self):
        comment_id = random.randint(1, 10)
        self.client.post(
            f"/api/moods/comments/{comment_id}/replies/",
            json={"content": f"Reply {random.randint(1, 1000)}"}
        )
```

Run:
```bash
locust -f locustfile.py --host=http://localhost:8000
```

## Test Results Interpretation

### Success Criteria

All tests should pass with:
- ✅ 100% authentication coverage
- ✅ 100% CRUD operation coverage
- ✅ 100% permission check coverage
- ✅ 100% validation coverage
- ✅ All edge cases handled

### Common Issues

1. **401 Unauthorized**: Check token expiration, authentication setup
2. **403 Forbidden**: Verify ownership checks working
3. **404 Not Found**: Check mood/comment IDs exist
4. **400 Bad Request**: Verify validation rules
5. **500 Server Error**: Check logs, database connections

## Continuous Integration

Add to your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run Mood Comment Tests
  run: |
    cd backend
    python manage.py test moods.tests --verbosity=2
```

## Next Steps

1. Run the automated test suite
2. Complete manual testing checklist
3. Perform API testing with your preferred tool
4. Test edge cases specific to your use case
5. Monitor performance under load
6. Document any issues found

---

**Note**: This guide assumes you have:
- Django REST Framework installed
- JWT authentication configured
- Database migrations applied
- Test database configured

For questions or issues, refer to the test file: `backend/moods/tests.py`
