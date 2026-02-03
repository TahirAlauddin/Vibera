"""
Tests for Social app serializers.

Covers FollowSerializer (create + validation), FollowerListSerializer,
and FollowingListSerializer output.
"""

import pytest
from unittest.mock import Mock

from social.serializers import (
    FollowSerializer,
    FollowerListSerializer,
    FollowingListSerializer,
)
from social.models import Follow
from users.models import User


# -----------------------------------------------------------------------------
# FollowSerializer - creation and validation
# -----------------------------------------------------------------------------


@pytest.mark.django_db
def test_follow_serializer_creates_follow(user):
    """FollowSerializer creates a follow relationship with valid context."""
    target = User.objects.create_user(username="target", password="pass", email="target@example.com")

    request = Mock()
    request.user = user
    serializer = FollowSerializer(
        data={},
        context={"request": request, "following_user": target},
    )

    assert serializer.is_valid()
    follow = serializer.save()

    assert follow.follower == user
    assert follow.following == target


@pytest.mark.django_db
def test_follow_serializer_output_contains_expected_fields(user):
    """FollowSerializer serialization returns id, follower, following, created_at."""
    target = User.objects.create_user(username="target", password="pass", email="target@example.com")
    follow = Follow.objects.create(follower=user, following=target)

    serializer = FollowSerializer(follow)
    data = serializer.data

    expected_fields = {"id", "follower", "following", "created_at"}
    assert set(data.keys()) == expected_fields
    assert data["follower"]["id"] == user.id
    assert data["follower"]["username"] == user.username
    assert data["following"]["id"] == target.id
    assert data["following"]["username"] == target.username


@pytest.mark.django_db
def test_follow_serializer_prevents_self_follow(user):
    """FollowSerializer rejects self-follow."""
    request = Mock()
    request.user = user
    serializer = FollowSerializer(
        data={},
        context={"request": request, "following_user": user},
    )

    assert not serializer.is_valid()
    assert "You cannot follow yourself." in str(serializer.errors)


@pytest.mark.django_db
def test_follow_serializer_prevents_duplicate_follow(user):
    """FollowSerializer rejects duplicate follow."""
    target = User.objects.create_user(username="target", password="pass", email="target@example.com")
    Follow.objects.create(follower=user, following=target)

    request = Mock()
    request.user = user
    serializer = FollowSerializer(
        data={},
        context={"request": request, "following_user": target},
    )

    assert not serializer.is_valid()
    assert "already following" in str(serializer.errors)


@pytest.mark.django_db
def test_follow_serializer_ignores_read_only_fields(user):
    """Read-only fields (follower, created_at) are not writable from input."""
    target = User.objects.create_user(username="target", password="pass", email="target@example.com")

    request = Mock()
    request.user = user
    serializer = FollowSerializer(
        data={"follower": 999, "created_at": "2020-01-01"},
        context={"request": request, "following_user": target},
    )

    assert serializer.is_valid()
    follow = serializer.save()

    assert follow.follower == user


# -----------------------------------------------------------------------------
# FollowerListSerializer
# -----------------------------------------------------------------------------


@pytest.mark.django_db
def test_follower_list_serializer_contains_expected_fields(user):
    """FollowerListSerializer outputs id, follower (nested), created_at."""
    target = User.objects.create_user(username="target", password="pass", email="target@example.com")
    follow = Follow.objects.create(follower=user, following=target)

    serializer = FollowerListSerializer(follow)
    data = serializer.data

    assert set(data.keys()) == {"id", "follower", "created_at"}
    assert data["follower"]["id"] == user.id
    assert data["follower"]["username"] == user.username
    assert set(data["follower"].keys()) == {"id", "username", "first_name", "last_name"}
    assert "created_at" in data


@pytest.mark.django_db
def test_follower_list_serializer_many(user, other_user):
    """FollowerListSerializer works with many=True."""
    target = User.objects.create_user(username="target", password="pass", email="target@example.com")
    Follow.objects.create(follower=user, following=target)
    Follow.objects.create(follower=other_user, following=target)

    follows = Follow.objects.filter(following=target).order_by("-created_at")
    serializer = FollowerListSerializer(follows, many=True)
    data = serializer.data

    assert len(data) == 2
    assert data[0]["follower"]["username"] in (user.username, other_user.username)
    assert data[1]["follower"]["username"] in (user.username, other_user.username)


# -----------------------------------------------------------------------------
# FollowingListSerializer
# -----------------------------------------------------------------------------


@pytest.mark.django_db
def test_following_list_serializer_contains_expected_fields(user):
    """FollowingListSerializer outputs id, following (nested), created_at."""
    target = User.objects.create_user(username="target", password="pass", email="target@example.com")
    follow = Follow.objects.create(follower=user, following=target)

    serializer = FollowingListSerializer(follow)
    data = serializer.data

    assert set(data.keys()) == {"id", "following", "created_at"}
    assert data["following"]["id"] == target.id
    assert data["following"]["username"] == target.username
    assert set(data["following"].keys()) == {"id", "username", "first_name", "last_name"}
    assert "created_at" in data


@pytest.mark.django_db
def test_following_list_serializer_many(user):
    """FollowingListSerializer works with many=True."""
    target1 = User.objects.create_user(username="target1", password="pass", email="target1@example.com")
    target2 = User.objects.create_user(username="target2", password="pass", email="target2@example.com")
    Follow.objects.create(follower=user, following=target1)
    Follow.objects.create(follower=user, following=target2)

    follows = Follow.objects.filter(follower=user).order_by("-created_at")
    serializer = FollowingListSerializer(follows, many=True)
    data = serializer.data

    assert len(data) == 2
    usernames = {data[0]["following"]["username"], data[1]["following"]["username"]}
    assert usernames == {"target1", "target2"}
