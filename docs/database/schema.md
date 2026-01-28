# Database Schema

This document describes the **Vibera** relational schema: tables, columns, relationships, indexes, and constraints. The backend uses Django ORM with PostgreSQL. Target audience: backend developers.

---

## Entity Relationship Diagram
![Entity Relationship Diagram](../database/erd.png)
<details>
<summary>Click to view the ER Diagram image file directly</summary>

[Open <code>docs/database/erd.png</code> in a new tab](./erd.png)
</details>




---

## Tables Overview

| Table | Purpose |
|-------|---------|
| `users_user` | Auth: email, username, password, 2FA flag. Custom user model. |
| `users_userprofile` | Extended profile: avatar, followers_count, following_count. One per user. |
| `users_emailotp` | 2FA: hashed OTP, expiry, attempts. One-time use. |
| `moods_mood` | Mood logs: emoji, reason, user. Core tracking entity. |
| `moods_moodtag` | Predefined tags (e.g. work, family). Many-to-many with Mood. |
| `moods_mood_tags` | M2M through table: mood ↔ moodtag. |
| `moods_emojijournalentry` | Journal note tied to a mood and user. |
| `social_follow` | Follow relationships: follower → following. Self-follow disallowed. |
| `notifications_notification` | In-app notifications: recipient, sender, type, read status. |

---

## Users Table (`users_user`)

Custom user model (Django `AbstractBaseUser` + `PermissionsMixin`). Login via `username`; `email` required.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| `id` | `bigint` | No | auto | PRIMARY KEY |
| `password` | `varchar(128)` | No | — | — |
| `last_login` | `timestamptz` | Yes | NULL | — |
| `is_superuser` | `boolean` | No | `false` | — |
| `email` | `varchar(254)` | No | — | UNIQUE |
| `first_name` | `varchar(50)` | Yes | NULL | — |
| `last_name` | `varchar(50)` | No | `''` | — |
| `username` | `varchar(50)` | No | — | UNIQUE |
| `is_active` | `boolean` | No | `true` | — |
| `is_staff` | `boolean` | No | `false` | — |
| `is_2fa_enabled` | `boolean` | No | `true` | — |
| `date_joined` | `timestamptz` | No | `now()` | — |

`groups` and `user_permissions` are M2M to `auth_group` and `auth_permission` (Django auth).

---

## Moods Table (`moods_mood`)

One row per mood log. User selects an emoji and optionally adds a reason and tags.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| `id` | `bigint` | No | auto | PRIMARY KEY |
| `user_id` | `bigint` | No | — | FK → `users_user`, ON DELETE CASCADE |
| `emoji` | `varchar(2)` | No | — | CHECK IN (😊,😔,😡,😰,😴,😌) |
| `reason` | `text` | Yes | NULL | — |
| `created_at` | `timestamptz` | No | `now()` | — |
| `updated_at` | `timestamptz` | No | `now()` | — |

**Relationships:** `user` → `users_user`. `tags` → `moods_moodtag` via `moods_mood_tags`.

---

## Journal Entries Table (`moods_emojijournalentry`)

Optional reflection note linked to a mood. Both `mood` and `user` are stored.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| `id` | `bigint` | No | auto | PRIMARY KEY |
| `mood_id` | `bigint` | No | — | FK → `moods_mood`, ON DELETE CASCADE |
| `user_id` | `bigint` | No | — | FK → `users_user`, ON DELETE CASCADE |
| `note` | `text` | Yes | NULL | — |
| `created_at` | `timestamptz` | No | `now()` | — |
| `updated_at` | `timestamptz` | No | `now()` | — |

**Relationships:** `mood` → `moods_mood`, `user` → `users_user`.

---

## Additional Tables

### `users_userprofile`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | `bigint` | No | auto (PK) |
| `user_id` | `bigint` | No | FK → `users_user`, UNIQUE, CASCADE |
| `avatar` | `varchar(100)` | Yes | NULL |
| `followers_count` | `int` | No | `0` |
| `following_count` | `int` | No | `0` |
| `created_at` | `timestamptz` | No | `now()` |

Profile created via signal on user registration. Counts are denormalized; updated when follows change.

### `users_emailotp`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | `bigint` | No | auto (PK) |
| `user_id` | `bigint` | No | FK → `users_user`, CASCADE |
| `hashed_code` | `varchar(128)` | No | — |
| `expires_at` | `timestamptz` | No | — |
| `is_used` | `boolean` | No | `false` |
| `attempts` | `smallint` | No | `0` |
| `created_at` | `timestamptz` | No | `now()` |

### `moods_moodtag`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | `bigint` | No | auto (PK) |
| `name` | `varchar(50)` | No | — (UNIQUE) |
| `color` | `varchar(7)` | No | `'#6366f1'` |

### `moods_mood_tags` (M2M through)

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `bigint` | PK |
| `mood_id` | `bigint` | FK → `moods_mood`, CASCADE |
| `moodtag_id` | `bigint` | FK → `moods_moodtag`, CASCADE |

### `social_follow`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | `bigint` | No | auto (PK) |
| `follower_id` | `bigint` | No | FK → `users_user`, CASCADE |
| `following_id` | `bigint` | No | FK → `users_user`, CASCADE |
| `created_at` | `timestamptz` | No | `now()` |

UNIQUE (`follower_id`, `following_id`). CHECK: `follower_id <> following_id`.

### `notifications_notification`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | `bigint` | No | auto (PK) |
| `recipient_id` | `bigint` | No | FK → `users_user`, CASCADE |
| `sender_id` | `bigint` | Yes | FK → `users_user`, CASCADE |
| `notification_type` | `varchar(20)` | No | `welcome` \| `new_follower` \| `followed_back` \| `daily_mood` |
| `is_read` | `boolean` | No | `false` |
| `created_at` | `timestamptz` | No | `now()` |
| `content_type_id` | `int` | Yes | FK → `django_content_type` (generic FK) |
| `object_id` | `int` | Yes | — |
| `expires_at` | `timestamptz` | Yes | NULL |
| `requires_action` | `boolean` | No | `false` |
| `custom_message` | `text` | Yes | NULL |

---

## Relationships

| From | To | Type | FK column(s) | Delete |
|------|-----|------|--------------|--------|
| `users_userprofile` | `users_user` | 1:1 | `user_id` | CASCADE |
| `users_emailotp` | `users_user` | N:1 | `user_id` | CASCADE |
| `moods_mood` | `users_user` | N:1 | `user_id` | CASCADE |
| `moods_mood` | `moods_moodtag` | M:N | `moods_mood_tags` | CASCADE |
| `moods_emojijournalentry` | `moods_mood` | N:1 | `mood_id` | CASCADE |
| `moods_emojijournalentry` | `users_user` | N:1 | `user_id` | CASCADE |
| `social_follow` | `users_user` | N:1 (×2) | `follower_id`, `following_id` | CASCADE |
| `notifications_notification` | `users_user` | N:1 (×2) | `recipient_id`, `sender_id` | CASCADE |

**Joins:** Moods by user: `moods_mood` JOIN `users_user` ON `user_id`. Followers: `social_follow` WHERE `following_id = ?`; following: WHERE `follower_id = ?`. Notifications: `notifications_notification` WHERE `recipient_id = ?` ORDER BY `created_at` DESC.

---

## Indexes

| Table | Index | Columns | Rationale |
|-------|-------|---------|-----------|
| `users_user` | PK | `id` | Lookups by ID |
| `users_user` | unique | `email`, `username` | Login, uniqueness |
| `users_emailotp` | — | `(user_id, is_used)` | Find valid OTP for user |
| `users_emailotp` | — | `expires_at` | Cleanup expired OTPs |
| `moods_mood` | — | `user_id` (FK) | List moods by user |
| `social_follow` | `follow_pair_idx` | `(follower_id, following_id)` | Existence check, uniqueness support |
| `social_follow` | `follow_following_idx` | `following_id` | “Who follows me” |
| `social_follow` | `follow_created_idx` | `created_at` | Sort by recency |
| `notifications_notification` | — | `(recipient_id, -created_at)` | Feed by recipient |
| `notifications_notification` | — | `(recipient_id, is_read)` | Unread filter |
| `notifications_notification` | — | `(notification_type, -created_at)` | Filter by type |

---

## Constraints

| Table | Constraint | Definition |
|-------|------------|------------|
| `users_user` | PK | `id` |
| `users_user` | UNIQUE | `email`, `username` |
| `users_userprofile` | UNIQUE | `user_id` |
| `moods_moodtag` | UNIQUE | `name` |
| `social_follow` | UNIQUE | `(follower_id, following_id)` |
| `social_follow` | CHECK `prevent_self_follow` | `follower_id <> following_id` |
| All FKs | — | ON DELETE CASCADE unless noted |

**Defaults:** Booleans `false` where applicable; `created_at` / `updated_at` via `default=timezone.now` or `auto_now_add` / `auto_now`.

---

## Data Types (Django → PostgreSQL)

| Django field | PostgreSQL | Notes |
|--------------|------------|-------|
| `BigAutoField` | `bigserial` | PKs |
| `EmailField` | `varchar(254)` | — |
| `CharField(max_length=n)` | `varchar(n)` | — |
| `TextField` | `text` | — |
| `BooleanField` | `boolean` | — |
| `PositiveSmallIntegerField` | `smallint` | e.g. OTP attempts |
| `PositiveIntegerField` | `integer` | counts |
| `DateTimeField` | `timestamptz` | `USE_TZ=True` |
| `ImageField` | `varchar(100)` | path only |
| `ForeignKey` | `bigint` | references `id` |
| M2M | through table | `bigint` FKs |

---

## Migration History

| App | Migration | Summary |
|-----|-----------|---------|
| users | `0001_initial` | User model |
| users | `0002_user_username` | Add `username` |
| users | `0003_alter_user_first_name` | `first_name` nullable |
| users | `0004_emailotp` | EmailOTP for 2FA |
| users | `0005` / `0006` / `0007` | 2FA tweaks, EmailOTP indexes |
| users | `0008_userprofile` | UserProfile |
| users | `0009_*` | UserProfile cleanup (e.g. remove `updated_at`) |
| moods | `0001_initial` | Mood, EmojiJournalEntry |
| moods | `0002_moodtag_mood_tags` | MoodTag, M2M `tags` |
| social | `0001_initial` | Follow |
| notifications | `0001_initial` | Notification |

Apply with `python manage.py migrate`; create new ones via `makemigrations` after model changes.

---

## Design Decisions

- **Custom User:** `username` + `email` support both JWT login and 2FA email. Keeps auth in one model; profile split into `UserProfile` for optional/extended fields.
- **EmailOTP:** Hashed OTP, expiry, and attempt limit improve security. Index on `(user, is_used)` and `expires_at` speeds lookup and cleanup.
- **Mood + EmojiJournalEntry:** Mood is the lightweight check-in; journal entries add optional reflection. Separate table keeps mood list cheap and allows multiple entries per mood if needed later.
- **MoodTag M2M:** Tags are reusable and shared; M2M allows multiple tags per mood without duplicating tag names.
- **Follow:** Unique `(follower, following)` plus DB-level `prevent_self_follow` CHECK enforce integrity. Indexes support “who follows me,” “who I follow,” and existence checks.
- **Denormalized profile counts:** `followers_count` / `following_count` avoid repeated aggregates; they must be updated when follows change (e.g. via signals).
- **Notification generic FK:** `content_type` + `object_id` allow linking to different models (e.g. mood, user) for future notification types without schema churn.
- **CASCADE deletes:** User delete removes profile, OTPs, moods, follows, notifications. Simpler lifecycle; backup/soft-delete can be added later if required.

---

**See also:** [Environment Setup](../guides/environment-setup.md) for DB setup, [API Endpoints](../api/endpoints.md) for how the schema is exposed via the API.
