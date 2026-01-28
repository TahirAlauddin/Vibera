# API Endpoints

Complete reference for all Vibera REST API endpoints, including request/response examples, authentication, and status codes. See [API Overview](./overview.md) for auth details, base URL, and common use cases.

---

## API Endpoints Summary

_You can click any endpoint path to jump to the detailed documentation for that endpoint below._

| Method                     | Endpoint                                                                                    | Purpose                  | Auth required      |
| -------------------------- | ------------------------------------------------------------------------------------------- | ------------------------ | ------------------ |
| POST                       | [`/api/auth/users/`](#post-apiauthusers-register)                                           | Register                 | No                 |
| POST                       | [`/api/auth/jwt/create/`](#post-apiauthjwtcreate-login)                                     | Login (JWT)              | No                 |
| POST                       | [`/api/auth/jwt/refresh/`](#post-apiauthjwtrefresh-refresh-token)                           | Refresh JWT              | No (refresh token) |
| POST                       | [`/api/auth/jwt/verify/`](#post-apiauthjwtverify-verify-token)                              | Verify JWT               | No                 |
| GET                        | [`/api/auth/users/me/`](#get-apiauthusersme-current-user)                                   | Current user             | Yes                |
| POST                       | [`/api/users/auth/2fa/login/`](#post-apiusersauth2falogin-2fa--request-otp)                 | 2FA: request OTP         | No                 |
| POST                       | [`/api/users/auth/2fa/verify/`](#post-apiusersauth2faverify-2fa--verify-otp)                | 2FA: verify OTP, get JWT | Session            |
| POST                       | [`/api/users/auth/2fa/resend/`](#post-apiusersauth2faresend-2fa--resend-otp)                | 2FA: resend OTP          | Session            |
| GET                        | [`/api/users/profile/`](#get-apiusersprofile-own-profile)                                   | Own profile              | Yes                |
| PUT / PATCH                | [`/api/users/profile/`](#get-apiusersprofile-own-profile)                      | Update own profile       | Yes                |
| GET                        | [`/api/users/profile/<id>/`](#get-apiusersprofileuser_id-user-profile-by-id)                | User profile by ID       | Yes                |
| GET                        | [`/api/moods/`](#get-apimoods-list-moods)                                                   | List moods               | Yes                |
| POST                       | [`/api/moods/`](#post-apimoods-create-mood)                                                 | Create mood              | Yes                |
| GET / PUT / PATCH / DELETE | [`/api/moods/<id>/`](#get-apimoodsid-get-single-mood)                                       | Mood detail              | Yes                |
| GET                        | [`/api/moods/tags/`](#get-apimoodstags-list-mood-tags)                                      | List mood tags           | Yes                |
| POST                       | [`/api/social/follow/<user_id>/`](#post-apisocialfollowuser_id-follow-user)                 | Follow user              | Yes                |
| DELETE                     | [`/api/social/unfollow/<user_id>/`](#delete-apisocialunfollowuser_id-unfollow-user)         | Unfollow user            | Yes                |
| GET                        | [`/api/social/followers/`](#get-apisocialfollowers-my-followers)                            | My followers             | Yes                |
| GET                        | [`/api/social/following/`](#get-apisocialfollowing-my-following)                            | My following             | Yes                |
| GET                        | [`/api/social/followers/<user_id>/`](#get-apisocialfollowersuser_id-users-followers)        | User’s followers         | Yes                |
| GET                        | [`/api/social/following/<user_id>/`](#get-apisocialfollowinguser_id-users-following)        | User’s following         | Yes                |
| GET                        | [`/api/notifications/`](#get-apinotifications-list-notifications)                           | List notifications       | Yes                |
| GET                        | [`/api/notifications/unread-count/`](#get-apinotificationsunread-count-unread-count)        | Unread count             | Yes                |
| POST                       | [`/api/notifications/mark-all-read/`](#post-apinotificationsmark-all-read-mark-all-as-read) | Mark all read            | Yes                |
| GET / PATCH / DELETE       | [`/api/notifications/<id>/`](#get-apinotificationsid-get-notification)                      | Notification detail      | Yes                |

_Tip: Each link jumps to the specific section with request and response examples for the given endpoint below!_

---

## Authentication Endpoints

### POST /api/auth/users/ (Register)

Create a new user account.

**Request**

```http
POST /api/auth/users/
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123",
  "re_password": "SecurePass123"
}
```

**Response (201 Created)**

```json
{
  "email": "user@example.com",
  "id": 1,
  "username": "johndoe"
}
```

**Authentication:** No  
**Status codes:** `201` Created, `400` Bad Request (validation), `409` Conflict (email/username exists)

**Error (400)**

```json
{
  "email": ["This field must be unique."],
  "password": ["This password is too common."]
}
```

---

### POST /api/auth/jwt/create/ (Login)

Obtain JWT access and refresh tokens.

**Request**

```http
POST /api/auth/jwt/create/
Content-Type: application/json
```

```json
{
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Response (200 OK)**

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Authentication:** No  
**Status codes:** `200` OK, `401` Unauthorized (invalid credentials), `400` Bad Request (missing fields)

**Error (401)**

```json
{
  "detail": "No active account found with the given credentials"
}
```

---

### POST /api/auth/jwt/refresh/ (Refresh token)

Exchange a refresh token for a new access token.

**Request**

```http
POST /api/auth/jwt/refresh/
Content-Type: application/json
```

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK)**

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Authentication:** No (refresh token in body)  
**Status codes:** `200` OK, `401` Unauthorized (invalid/expired refresh token)

---

### POST /api/auth/jwt/verify/ (Verify token)

Verify that an access token is valid.

**Request**

```http
POST /api/auth/jwt/verify/
Content-Type: application/json
```

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):** `{}`  
**Authentication:** No  
**Status codes:** `200` OK, `401` Unauthorized (invalid token)

---

### GET /api/auth/users/me/ (Current user)

Return the authenticated user.

**Request**

```http
GET /api/auth/users/me/
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "first_name": "",
  "last_name": ""
}
```

**Authentication:** Yes (JWT)  
**Status codes:** `200` OK, `401` Unauthorized

---

<a id="post-apiusersauth2falogin-2fa--request-otp"></a>
### POST /api/users/auth/2fa/login/ (2FA – request OTP)

Validate credentials and send OTP by email (if 2FA enabled), or return JWT directly if not.

**Request**

```http
POST /api/users/auth/2fa/login/
Content-Type: application/json
```

```json
{
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Response – 2FA required (200 OK)**

```json
{
  "success": true,
  "requires_2fa": true,
  "message": "OTP sent to your email",
  "email_hint": "joh***@example.com"
}
```

**Response – no 2FA (200 OK)**

```json
{
  "success": true,
  "requires_2fa": false,
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Authentication:** No  
**Status codes:** `200` OK, `401` Unauthorized (invalid credentials), `400` Bad Request, `500` Server Error (OTP send failed)

**Error (401)**

```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

<a id="post-apiusersauth2faverify-2fa--verify-otp"></a>
### POST /api/users/auth/2fa/verify/ (2FA – verify OTP)


Verify OTP and receive JWT tokens. Requires session cookie from 2FA login.

**Request**

```http
POST /api/users/auth/2fa/verify/
Content-Type: application/json
Cookie: sessionid=<session_from_2fa_login>
```

```json
{
  "token": "123456"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Authentication:** Session (from 2FA login)  
**Status codes:** `200` OK, `400` Bad Request (invalid OTP, missing token), `408` Request Timeout (session expired)

**Error (408)**

```json
{
  "success": false,
  "error": "Session expired. Please login again."
}
```

---

<a id="post-apiusersauth2faresend-2fa--resend-otp"></a>
### POST /api/users/auth/2fa/resend/ (2FA – resend OTP)


Resend OTP to the user’s email.

**Request**

```http
POST /api/users/auth/2fa/resend/
Cookie: sessionid=<session_from_2fa_login>
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "OTP sent to your email",
  "email_hint": "joh***@example.com"
}
```

**Authentication:** Session (from 2FA login)  
**Status codes:** `200` OK, `400` Bad Request (session expired), `500` Server Error (OTP send failed)

---

## User Profile Endpoints

### GET /api/users/profile/ (Own profile)

Get the authenticated user’s profile.

**Request**

```http
GET /api/users/profile/
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "id": 1,
  "user": 1,
  "avatar": null,
  "followers_count": 0,
  "following_count": 0,
  "created_at": "2025-01-23T10:30:00Z"
}
```

**Authentication:** Yes (JWT)  
**Status codes:** `200` OK, `401` Unauthorized, `404` Not Found (profile missing)

**Error (404)**

```json
{
  "error": "Profile does not exist"
}
```

---

### PUT /api/users/profile/ (Update own profile – full)

**PATCH /api/users/profile/ (Update own profile – partial)**

Update the authenticated user’s profile.

**Request**

```http
PATCH /api/users/profile/
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "avatar": "avatars/profile.jpg"
}
```

**Response (200 OK)**

```json
{
  "id": 1,
  "user": 1,
  "avatar": "avatars/profile.jpg",
  "followers_count": 0,
  "following_count": 0,
  "created_at": "2025-01-23T10:30:00Z"
}
```

**Authentication:** Yes (JWT, own profile only)  
**Status codes:** `200` OK, `400` Bad Request (validation), `401` Unauthorized, `404` Not Found

---

### GET /api/users/profile/<user_id>/ (User profile by ID)

Get another user’s profile by user ID.

**Request**

```http
GET /api/users/profile/2/
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "id": 2,
  "user": 2,
  "avatar": "avatars/user2.jpg",
  "followers_count": 5,
  "following_count": 3,
  "created_at": "2025-01-20T08:15:00Z"
}
```

**Authentication:** Yes (JWT)  
**Status codes:** `200` OK, `401` Unauthorized, `404` Not Found

---

## Mood Endpoints

### POST /api/moods/ (Create mood)

Create a new mood log.

**Request**

```http
POST /api/moods/
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "emoji": "😊",
  "reason": "Had a great day!",
  "tag_ids": [1, 2]
}
```

**Emoji choices:** `😊` Happy, `😔` Sad, `😡` Angry, `😰` Anxious, `😴` Tired, `😌` Calm. `reason` and `tag_ids` are optional.

**Response (201 Created)**

```json
{
  "message": "Mood logged successfully",
  "data": {
    "id": 1,
    "user": "johndoe",
    "emoji": "😊",
    "reason": "Had a great day!",
    "tags": [{ "id": 1, "name": "work", "color": "#6366f1" }],
    "created_at": "2025-01-23T10:30:00Z",
    "updated_at": "2025-01-23T10:30:00Z"
  }
}
```

**Authentication:** Yes (JWT)  
**Status codes:** `201` Created, `400` Bad Request (validation), `401` Unauthorized

---

### GET /api/moods/ (List moods)

List all mood logs for the authenticated user.

**Request**

```http
GET /api/moods/
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "count": 2,
  "data": [
    {
      "id": 1,
      "user": "johndoe",
      "emoji": "😊",
      "reason": "Had a great day!",
      "tags": [],
      "created_at": "2025-01-23T10:30:00Z",
      "updated_at": "2025-01-23T10:30:00Z"
    },
    {
      "id": 2,
      "user": "johndoe",
      "emoji": "😌",
      "reason": null,
      "tags": [],
      "created_at": "2025-01-23T14:00:00Z",
      "updated_at": "2025-01-23T14:00:00Z"
    }
  ]
}
```

**Authentication:** Yes (JWT)  
**Status codes:** `200` OK, `401` Unauthorized

---

<a id="get-apimoodsid-get-single-mood"></a>
### GET /api/moods/<id>/ (Get single mood)


**Request**

```http
GET /api/moods/1/
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "id": 1,
  "user": "johndoe",
  "emoji": "😊",
  "reason": "Had a great day!",
  "tags": [],
  "created_at": "2025-01-23T10:30:00Z",
  "updated_at": "2025-01-23T10:30:00Z"
}
```

**Authentication:** Yes (JWT, owner only)  
**Status codes:** `200` OK, `401` Unauthorized, `404` Not Found

**Error (404)**

```json
{
  "error": "Mood log not found"
}
```

---

### PUT /api/moods/<id>/ (Update mood – full)

### PATCH /api/moods/<id>/ (Update mood – partial)

**Request**

```http
PATCH /api/moods/1/
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "reason": "Updated reason only"
}
```

**Response (200 OK)**

```json
{
  "message": "Mood log updated successfully",
  "data": {
    "id": 1,
    "user": "johndoe",
    "emoji": "😊",
    "reason": "Updated reason only",
    "tags": [],
    "created_at": "2025-01-23T10:30:00Z",
    "updated_at": "2025-01-23T16:00:00Z"
  }
}
```

**Authentication:** Yes (JWT, owner only)  
**Status codes:** `200` OK, `400` Bad Request (validation), `401` Unauthorized, `404` Not Found

---

### DELETE /api/moods/<id>/ (Delete mood)

**Request**

```http
DELETE /api/moods/1/
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

```json
{
  "message": "Mood log deleted successfully"
}
```

**Authentication:** Yes (JWT, owner only)  
**Status codes:** `204` No Content, `401` Unauthorized, `404` Not Found

---

### GET /api/moods/tags/ (List mood tags)

List available mood tags for use when creating/updating moods.

**Request**

```http
GET /api/moods/tags/
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "count": 3,
  "data": [
    { "id": 1, "name": "work", "color": "#6366f1" },
    { "id": 2, "name": "family", "color": "#22c55e" },
    { "id": 3, "name": "health", "color": "#ef4444" }
  ]
}
```

**Authentication:** Yes (JWT)  
**Status codes:** `200` OK, `401` Unauthorized

---

## Social Endpoints

### POST /api/social/follow/<user_id>/ (Follow user)

**Request**

```http
POST /api/social/follow/2/
Authorization: Bearer <access_token>
```

**Response (201 Created)**

```json
{
  "id": 1,
  "follower": {
    "id": 1,
    "username": "johndoe",
    "first_name": "",
    "last_name": ""
  },
  "following": {
    "id": 2,
    "username": "janedoe",
    "first_name": "Jane",
    "last_name": "Doe"
  },
  "created_at": "2025-01-23T10:00:00Z"
}
```

**Authentication:** Yes (JWT)  
**Status codes:** `201` Created, `400` Bad Request (self-follow, already following), `401` Unauthorized, `404` Not Found (user missing)

**Error (400)**

```json
{
  "non_field_errors": ["You cannot follow yourself."]
}
```

```json
{
  "non_field_errors": ["You are already following this user."]
}
```

---

### DELETE /api/social/unfollow/<user_id>/ (Unfollow user)

**Request**

```http
DELETE /api/social/unfollow/2/
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "message": "Successfully unfollowed janedoe"
}
```

**Authentication:** Yes (JWT)  
**Status codes:** `200` OK, `401` Unauthorized, `404` Not Found (user or follow relationship missing)

---

### GET /api/social/followers/ (My followers)

### GET /api/social/followers/<user_id>/ (User’s followers)

**Request**

```http
GET /api/social/followers/
Authorization: Bearer <access_token>
```

Or `GET /api/social/followers/2/` for a specific user’s followers.

**Response (200 OK)**

```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "follower": {
        "id": 2,
        "username": "janedoe",
        "first_name": "Jane",
        "last_name": "Doe"
      },
      "created_at": "2025-01-22T09:00:00Z"
    }
  ]
}
```

**Authentication:** Yes (JWT)  
**Status codes:** `200` OK, `401` Unauthorized, `404` Not Found (user missing)

---

### GET /api/social/following/ (My following)

### GET /api/social/following/<user_id>/ (User’s following)

**Request**

```http
GET /api/social/following/
Authorization: Bearer <access_token>
```

Or `GET /api/social/following/2/` for a specific user’s following list.

**Response (200 OK)**

```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "following": {
        "id": 2,
        "username": "janedoe",
        "first_name": "Jane",
        "last_name": "Doe"
      },
      "created_at": "2025-01-22T09:00:00Z"
    }
  ]
}
```

**Authentication:** Yes (JWT)  
**Status codes:** `200` OK, `401` Unauthorized, `404` Not Found (user missing)

---

## Notification Endpoints

### GET /api/notifications/ (List notifications)

List notifications for the authenticated user. Supports filtering.

| Query param | Type             | Description                                                              |
| ----------- | ---------------- | ------------------------------------------------------------------------ |
| `is_read`   | `true` / `false` | Filter by read status                                                    |
| `type`      | string           | Filter by type: `welcome`, `new_follower`, `followed_back`, `daily_mood` |

**Request**

```http
GET /api/notifications/?is_read=false&type=new_follower
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "sender": { "id": 2, "username": "janedoe" },
      "notification_type": "new_follower",
      "message": "janedoe started following you.",
      "is_read": false,
      "requires_action": false,
      "created_at": "2025-01-23T10:00:00Z"
    }
  ]
}
```

**Authentication:** Yes (JWT)  
**Status codes:** `200` OK, `401` Unauthorized

---

### GET /api/notifications/unread-count/ (Unread count)

**Request**

```http
GET /api/notifications/unread-count/
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "unread_count": 5
}
```

**Authentication:** Yes (JWT)  
**Status codes:** `200` OK, `401` Unauthorized

---

### POST /api/notifications/mark-all-read/ (Mark all as read)

**Request**

```http
POST /api/notifications/mark-all-read/
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "message": "All notifications marked as read",
  "updated_count": 5
}
```

**Authentication:** Yes (JWT)  
**Status codes:** `200` OK, `401` Unauthorized

---

<a id="get-apinotificationsid-get-notification"></a>
### GET /api/notifications/<id>/ (Get notification)


### PATCH /api/notifications/<id>/ (Mark as read)

### DELETE /api/notifications/<id>/ (Delete notification)

**Request – GET**

```http
GET /api/notifications/1/
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "id": 1,
  "recipient": 1,
  "sender": { "id": 2, "username": "janedoe" },
  "notification_type": "new_follower",
  "notification_type_display": "New Follower",
  "message": "janedoe started following you.",
  "is_read": false,
  "is_expired": false,
  "requires_action": false,
  "created_at": "2025-01-23T10:00:00Z",
  "expires_at": null
}
```

**Request – PATCH (mark as read)**

```http
PATCH /api/notifications/1/
Authorization: Bearer <access_token>
```

**Response (200 OK):** Same structure as GET, with `is_read: true`.

**Request – DELETE**

```http
DELETE /api/notifications/1/
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "message": "Notification deleted successfully"
}
```

**Authentication:** Yes (JWT, recipient only)  
**Status codes:** `200` OK, `401` Unauthorized, `404` Not Found

---

## Health & Status Endpoints

### GET /api/test/ (API health check)

Simple smoke test to verify the API is responding.

**Request**

```http
GET /api/test/
```

**Response (200 OK)**

```json
{
  "status": "success",
  "message": "Django REST Framework is configured correctly!",
  "timestamp": "2025-01-26T10:00:00.123456",
  "framework": "Django REST Framework"
}
```

**Authentication:** No  
**Status codes:** `200` OK

---

See [API Overview](./overview.md) for authentication, base URL, status-code conventions, and common flows.
