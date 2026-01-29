# Vibera Backend Test Report

## Overview

This document provides a comprehensive guide to the pytest testing framework setup for the Vibera Django backend.

**Test Framework:** pytest 9.0.2  l
**Django Version:** 6.0  
**Database:** PostgreSQL (via Docker)  
**Total Tests:** 187 tests across 7 test files

---

## Table of Contents

1. [Installation & Dependencies](#1-installation--dependencies)
2. [Configuration Files](#2-configuration-files)
3. [Project Structure](#3-project-structure)
4. [Fixtures (conftest.py)](#4-fixtures-conftestpy)
5. [Factory Boy (factories.py)](#5-factory-boy-factoriespy)
6. [Test Files Summary](#6-test-files-summary)
7. [Running Tests](#7-running-tests)
8. [Test Categories](#8-test-categories)
9. [Best Practices](#9-best-practices)

---

## 1. Installation & Dependencies

### Required Packages

The following packages are installed in `requirements.txt`:

```
pytest==9.0.2
pytest-django==4.11.1
pytest-cov==7.0.0
pytest-mock==3.15.1
factory_boy==3.3.3
Faker==40.1.2
```

### Installation

```bash
cd backend
pip install -r requirements.txt
```

---

## 2. Configuration Files

### pytest.ini

Location: `backend/pytest.ini`

```ini
[pytest]
DJANGO_SETTINGS_MODULE = vibera.settings
python_files = test_*.py *_test.py
addopts = -ra -q
testpaths = moods notifications social users
norecursedirs = .* venv __pycache__
```

**Configuration Explained:**

| Setting                  | Description                                         |
| ------------------------ | --------------------------------------------------- |
| `DJANGO_SETTINGS_MODULE` | Points to Django settings                           |
| `python_files`           | Pattern for test file discovery                     |
| `addopts`                | Default options: `-ra` (show summary), `-q` (quiet) |
| `testpaths`              | Directories to search for tests                     |
| `norecursedirs`          | Directories to exclude                              |

---

## 3. Project Structure

```
backend/
├── pytest.ini              # Pytest configuration
├── conftest.py             # Global fixtures
├── factories.py            # Factory Boy factories
├── moods/
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_basic.py           # 8 tests - DB access patterns
│   │   ├── test_models.py          # 23 tests - Model testing
│   │   ├── test_views.py           # 34 tests - API endpoint testing
│   │   ├── test_permissions.py     # 33 tests - Permission testing
│   │   ├── test_serializers.py     # 32 tests - Serializer testing
│   │   ├── test_fixtures_demo.py   # 21 tests - Fixture examples
│   │   └── test_factories.py       # 36 tests - Factory Boy examples
│   └── tests.py            # Django default (empty)
├── notifications/
│   └── tests/              # Ready for tests
├── social/
│   └── tests/              # Ready for tests
└── users/
    └── tests/              # Ready for tests
```

---

## 4. Fixtures (conftest.py)

Location: `backend/conftest.py`

Fixtures provide reusable test data and avoid repetition.

### Available Fixtures

#### API Client Fixtures

| Fixture                | Description                | Usage                               |
| ---------------------- | -------------------------- | ----------------------------------- |
| `api_client`           | Unauthenticated DRF client | `def test_x(api_client):`           |
| `authenticated_client` | Pre-authenticated client   | `def test_x(authenticated_client):` |
| `admin_client`         | Admin-authenticated client | `def test_x(admin_client):`         |

#### User Fixtures

| Fixture        | Description                  | Usage                            |
| -------------- | ---------------------------- | -------------------------------- |
| `user`         | Standard test user           | `def test_x(user):`              |
| `other_user`   | Second user for interactions | `def test_x(other_user):`        |
| `admin_user`   | Superuser for admin tests    | `def test_x(admin_user):`        |
| `user_factory` | Create multiple users        | `user_factory(username="alice")` |

#### Mood Fixtures

| Fixture             | Description                  | Usage                                 |
| ------------------- | ---------------------------- | ------------------------------------- |
| `mood`              | Basic mood entry             | `def test_x(mood):`                   |
| `mood_factory`      | Create multiple moods        | `mood_factory(user=user, emoji="😊")` |
| `mood_with_comment` | Mood + comment tuple         | `mood, comment = mood_with_comment`   |
| `journal_entry`     | Journal entry linked to mood | `def test_x(journal_entry):`          |
| `sample_moods`      | List of 5 moods              | `def test_list(sample_moods):`        |

#### Authentication Fixtures

| Fixture           | Description              | Usage                                     |
| ----------------- | ------------------------ | ----------------------------------------- |
| `user_with_token` | User + JWT token tuple   | `user, token = user_with_token`           |
| `auth_headers`    | Ready-to-use JWT headers | `api_client.get('/api/', **auth_headers)` |

### Usage Example

```python
import pytest

@pytest.mark.django_db
def test_user_can_create_mood(authenticated_client, user):
    """Test that authenticated user can create a mood."""
    response = authenticated_client.post("/api/moods/", {"emoji": "😊"})

    assert response.status_code == 201
    assert user.moods.count() == 1
```

---

## 5. Factory Boy (factories.py)

Location: `backend/factories.py`

Factory Boy provides a professional approach to test data generation.

### Available Factories

| Factory                    | Model             | Features                                     |
| -------------------------- | ----------------- | -------------------------------------------- |
| `UserFactory`              | User              | Sequences, traits (admin, staff, inactive)   |
| `MoodFactory`              | Mood              | SubFactory, traits (happy, sad, angry, etc.) |
| `MoodCommentFactory`       | MoodComment       | SubFactory, `create_reply()` helper          |
| `EmojiJournalEntryFactory` | EmojiJournalEntry | LazyAttribute, traits                        |
| `MoodWithCommentsFactory`  | Mood              | Post-generation hooks                        |
| `MoodWithJournalFactory`   | Mood              | Post-generation hooks                        |

### Usage Examples

```python
from factories import UserFactory, MoodFactory, MoodCommentFactory

# Basic creation
user = UserFactory()
mood = MoodFactory()

# With custom attributes
user = UserFactory(username="custom_user")
mood = MoodFactory(user=user, emoji="😊")

# Using traits
admin = UserFactory(admin=True)
happy_mood = MoodFactory(happy=True)

# Batch creation
users = UserFactory.create_batch(10)
moods = MoodFactory.create_batch(5, user=user)

# Build without saving (for unit tests)
user = UserFactory.build()  # pk is None

# SubFactory (auto-creates related objects)
comment = MoodCommentFactory()  # Creates user AND mood automatically!

# Helper methods
reply = MoodCommentFactory.create_reply(parent_comment)

# Composite factories
mood = MoodWithCommentsFactory(comments__count=5)
```

### Helper Functions

```python
from factories import create_user_with_moods, create_mood_with_thread

# Create user with multiple moods
user = create_user_with_moods(mood_count=10)

# Create mood with comment thread
mood = create_mood_with_thread(comment_count=3, reply_count=2)
```

---

## 6. Test Files Summary

### test_basic.py (8 tests)

Demonstrates database access patterns with pytest-django.

**Topics Covered:**

- Tests without DB access
- `@pytest.mark.django_db` decorator
- `db` fixture usage
- Fixture-based DB access

```python
# Method 1: Decorator
@pytest.mark.django_db
def test_with_decorator():
    User.objects.create_user(...)

# Method 2: Fixture
def test_with_fixture(db):
    User.objects.create_user(...)

# Method 3: Via other fixtures
def test_with_user(user):  # user fixture has db access
    assert user.pk is not None
```

---

### test_models.py (23 tests)

Tests Django models: Mood, EmojiJournalEntry, MoodComment.

**Test Classes:**

- `TestMoodModel` (8 tests)
- `TestEmojiJournalEntryModel` (4 tests)
- `TestMoodCommentModel` (7 tests)
- Plus parametrized tests

**Topics Covered:**

- Model creation
- Field validation
- Relationships (ForeignKey)
- Cascade delete
- `__str__` representation
- Model ordering

```python
@pytest.mark.django_db
class TestMoodModel:
    def test_mood_creation(self, user):
        mood = Mood.objects.create(user=user, emoji="😊")
        assert mood.pk is not None

    @pytest.mark.parametrize("emoji,expected", [
        ("😊", "😊"),
        ("😔", "😔"),
    ])
    def test_mood_choices(self, user, emoji, expected):
        mood = Mood.objects.create(user=user, emoji=emoji)
        assert mood.emoji == expected
```

---

### test_views.py (34 tests)

Tests DRF API Views using APIClient.

**Test Classes:**

- `TestMoodLogView` (9 tests) - `GET/POST /api/moods/`
- `TestMoodLogDetailView` (10 tests) - `GET/PUT/PATCH/DELETE /api/moods/<pk>/`
- `TestMoodCommentListView` (5 tests) - Comments endpoints
- `TestMoodCommentDetailView` (4 tests) - Comment CRUD
- `TestMoodCommentReplyView` (3 tests) - Reply endpoints
- `TestMoodAPIIntegration` (2 tests) - Full workflows

**Topics Covered:**

- Authentication requirements (401)
- CRUD operations (200, 201, 204)
- Validation errors (400)
- Not found errors (404)
- Integration tests

```python
@pytest.mark.django_db
class TestMoodLogView:
    def test_list_moods_unauthenticated(self, api_client):
        response = api_client.get("/api/moods/")
        assert response.status_code == 401

    def test_create_mood_success(self, authenticated_client):
        response = authenticated_client.post("/api/moods/", {"emoji": "😊"})
        assert response.status_code == 201
```

---

### test_permissions.py (33 tests)

Tests API permission handling.

**Test Classes:**

- `TestIsAuthenticatedPermission` (9 tests)
- `TestObjectLevelPermissions` (10 tests)
- `TestCrossUserPermissions` (3 tests)
- `TestAdminPermissions` (3 tests)
- `TestJWTPermissions` (5 tests)
- `TestPermissionEdgeCases` (3 tests)

**Topics Covered:**

- `IsAuthenticated` permission (401)
- Object-level permissions (403/404)
- JWT token authentication
- Admin vs regular user
- Cross-user interactions

```python
def test_user_cannot_update_other_users_comment(self, authenticated_client, other_user):
    comment = MoodComment.objects.create(mood=mood, user=other_user, content="Not mine")
    response = authenticated_client.put(f"/api/comments/{comment.pk}/", {"content": "Hack"})
    assert response.status_code == 403
```

---

### test_serializers.py (32 tests)

Tests DRF Serializers.

**Test Classes:**

- `TestMoodLogSerializer` (16 tests)
- `TestMoodCommentSerializer` (12 tests)
- `TestSerializerEdgeCases` (4 tests)

**Topics Covered:**

- Serialization (Model → JSON)
- Deserialization (JSON → Model)
- Validation (valid/invalid data)
- Custom validation methods
- Read-only fields
- Computed fields (SerializerMethodField)
- Nested serialization
- Context handling (request.user)

```python
def test_serialization(self, mood):
    serializer = MoodLogSerializer(mood)
    data = serializer.data

    assert data["emoji"] == mood.emoji
    assert data["comment_count"] == 0  # Computed field

def test_validation_empty_content_fails(self, user):
    data = {"content": ""}
    serializer = MoodCommentSerializer(data=data, context={"request": request})

    assert not serializer.is_valid()
    assert "content" in serializer.errors
```

---

### test_fixtures_demo.py (21 tests)

Demonstrates fixture usage patterns.

**Test Classes:**

- `TestBasicFixtureUsage` (4 tests)
- `TestFactoryFixtures` (3 tests)
- `TestCompositeFixtures` (3 tests)
- `TestFixtureCombinations` (3 tests)
- `TestNoRepetition` (5 tests)
- `TestAuthFixtures` (2 tests)

---

### test_factories.py (36 tests)

Demonstrates Factory Boy usage.

**Test Classes:**

- `TestUserFactory` (8 tests)
- `TestMoodFactory` (7 tests)
- `TestMoodCommentFactory` (6 tests)
- `TestEmojiJournalEntryFactory` (3 tests)
- `TestCompositeFactories` (3 tests)
- `TestHelperFunctions` (3 tests)
- `TestFactoryIntegration` (3 tests)
- `TestFactoryVsManual` (3 tests)

---

## 7. Running Tests

### Run All Tests

```bash
cd backend
pytest
```

### Run with Verbose Output

```bash
pytest -v
```

### Run Specific Test File

```bash
pytest moods/tests/test_models.py
```

### Run Specific Test Class

```bash
pytest moods/tests/test_models.py::TestMoodModel
```

### Run Specific Test

```bash
pytest moods/tests/test_models.py::TestMoodModel::test_mood_creation
```

### Run with Coverage

```bash
pytest --cov=moods --cov-report=html
```

### Run Tests Matching Pattern

```bash
pytest -k "test_create"  # Run tests containing "test_create"
```

### Run with Print Statements Visible

```bash
pytest -s
```

### Run Failed Tests Only

```bash
pytest --lf  # Last failed
pytest --ff  # Failed first
```

---

## 8. Test Categories

### Unit Tests

- Model tests (`test_models.py`)
- Serializer tests (`test_serializers.py`)

### Integration Tests

- View tests (`test_views.py`)
- Permission tests (`test_permissions.py`)

### Functional Tests

- API workflow tests
- End-to-end scenarios

---

## 9. Best Practices

### 1. Use Fixtures to Avoid Repetition

```python
# Bad: Repetitive setup
def test_one():
    user = User.objects.create_user(username="test", ...)
    mood = Mood.objects.create(user=user, ...)

def test_two():
    user = User.objects.create_user(username="test", ...)  # Repeated!
    mood = Mood.objects.create(user=user, ...)  # Repeated!

# Good: Use fixtures
def test_one(user, mood):
    assert mood.user == user

def test_two(user, mood):
    assert mood.user == user
```

### 2. Use Factory Boy for Complex Data

```python
# Create related objects automatically
comment = MoodCommentFactory()  # Creates user AND mood!

# Use traits for common variations
happy_mood = MoodFactory(happy=True)
admin = UserFactory(admin=True)
```

### 3. Test One Thing Per Test

```python
# Bad: Testing multiple things
def test_mood():
    # Tests creation, validation, and deletion

# Good: Separate tests
def test_mood_creation(): ...
def test_mood_validation(): ...
def test_mood_deletion(): ...
```

### 4. Use Descriptive Test Names

```python
# Bad
def test_mood(): ...

# Good
def test_mood_creation_with_valid_emoji_succeeds(): ...
def test_mood_creation_without_emoji_fails(): ...
```

### 5. Use `@pytest.mark.django_db` for Database Access

```python
@pytest.mark.django_db
def test_database_operation():
    User.objects.create_user(...)
```

### 6. Test Edge Cases

```python
def test_empty_list(): ...
def test_nonexistent_resource_returns_404(): ...
def test_invalid_input_returns_400(): ...
```

### 7. Use Parametrize for Multiple Similar Tests

```python
@pytest.mark.parametrize("emoji", ["😊", "😔", "😡", "😰", "😴", "😌"])
def test_all_valid_emojis(self, user, emoji):
    mood = Mood.objects.create(user=user, emoji=emoji)
    assert mood.emoji == emoji
```

---

## Test Statistics

| Test File             | Tests   | Description              |
| --------------------- | ------- | ------------------------ |
| test_basic.py         | 8       | Database access patterns |
| test_models.py        | 23      | Model testing            |
| test_views.py         | 34      | API endpoint testing     |
| test_permissions.py   | 33      | Permission testing       |
| test_serializers.py   | 32      | Serializer testing       |
| test_fixtures_demo.py | 21      | Fixture examples         |
| test_factories.py     | 36      | Factory Boy examples     |
| **Total**             | **187** |                          |

---

## Quick Reference

### Database Access

```python
# Method 1: Decorator
@pytest.mark.django_db
def test_x(): ...

# Method 2: Fixture
def test_x(db): ...

# Method 3: Via other fixtures
def test_x(user): ...  # user fixture includes db
```

### HTTP Status Codes Tested

| Code | Meaning      | When                      |
| ---- | ------------ | ------------------------- |
| 200  | OK           | Successful GET/PUT/PATCH  |
| 201  | Created      | Successful POST           |
| 204  | No Content   | Successful DELETE         |
| 400  | Bad Request  | Validation error          |
| 401  | Unauthorized | No/invalid authentication |
| 403  | Forbidden    | Not authorized for action |
| 404  | Not Found    | Resource doesn't exist    |

---

_Generated: January 2026_
_Test Framework: pytest 9.0.2 + pytest-django 4.11.1_
