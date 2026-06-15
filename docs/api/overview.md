# API Overview

Complete guide to integrating with the Vibera REST API. Use this overview for authentication, request/response conventions, and common flows. For the full endpoint reference, see [API Endpoints](./endpoints.md).

---

## Base URL & Versioning

**Base URL:** `http://127.0.0.1:8000` (development) or your deployed API origin (e.g. `https://api.vibera.example.com`).

The API is **unversioned**. All endpoints live under `/api/`. Breaking changes will be announced in release notes. When versioning is introduced, a path prefix such as `/api/v1/` may be used.

---

## Authentication

Vibera uses **JWT Bearer tokens**. Send the access token in the `Authorization` header for protected endpoints.

```
Authorization: Bearer <access_token>
```

**Token generation**

- **Standard login:** `POST /api/auth/jwt/create/` with `username` and `password`. Response includes `access` and `refresh` tokens.
- **2FA login:** `POST /api/users/auth/2fa/login/` with credentials → receive OTP by email → `POST /api/users/auth/2fa/verify/` with `token` and session cookie → response includes `access` and `refresh`.

**Expiration**

- Access token: **60 minutes**.
- Refresh token: **7 days**.
- OTP: **5 minutes**; max **3** verification attempts.

**Refresh mechanism**

When the access token expires, call:

```
POST /api/auth/jwt/refresh/
Content-Type: application/json

{ "refresh": "<refresh_token>" }
```

Response: `{ "access": "<new_access_token>" }`. Use the new access token for subsequent requests.

**Token storage**

- Do **not** store tokens in publicly readable storage (e.g. unsecured localStorage) if the client is exposed to XSS. Prefer httpOnly cookies, secure in-memory storage, or platform-specific secure storage (e.g. Keychain, Keystore) where appropriate.
- Send **only** the access token in `Authorization`. Use the refresh token only for `/api/auth/jwt/refresh/`.

---

## Request / Response Format

**Content-Type**

- **Request:** `Content-Type: application/json` for all JSON bodies.
- **Response:** API returns `Content-Type: application/json`.

**Request headers (typical)**

```
Content-Type: application/json
Authorization: Bearer <access_token>   # required for protected endpoints
```

**Request example**

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Response structure**

- **Success:** Often `{ "data": ... }`, sometimes with `"message"` or `"count"`. Structure varies by endpoint.
- **Auth:** Login/2FA use `"success"`, `"access"`, `"refresh"`, `"requires_2fa"`, `"message"`, etc.
- **Errors:** JSON body with `"detail"`, `"error"`, or field-level errors (see [Status Codes & Error Handling](#status-codes--error-handling)).

Example success (create mood):

```json
{
  "message": "Mood logged successfully",
  "data": {
    "id": 1,
    "user": "johndoe",
    "emoji": "😊",
    "reason": "Great day!",
    "tags": [],
    "created_at": "2025-01-23T10:30:00Z",
    "updated_at": "2025-01-23T10:30:00Z"
  }
}
```

---

## Status Codes & Error Handling

| Code | Meaning | When used |
|------|---------|-----------|
| **200** OK | Success | GET, PUT, PATCH, DELETE succeeded |
| **201** Created | Resource created | POST created a new resource |
| **400** Bad Request | Invalid input | Validation errors, bad JSON, missing required fields |
| **401** Unauthorized | Auth required or invalid | Missing/invalid/expired token |
| **403** Forbidden | Not allowed | Valid token but no permission |
| **404** Not Found | Resource missing | Invalid ID or path |
| **500** Internal Server Error | Server error | Unexpected backend failure |

**Error response format**

- **DRF default (401/403/404):** `{ "detail": "Error message" }`
- **Validation (400):** Field-level object, e.g. `{ "username": ["This field is required."], "password": ["This password is too common."] }`
- **Custom (e.g. 2FA):** `{ "success": false, "error": "Invalid credentials" }`

Example (400):

```json
{
  "email": ["Enter a valid email address."],
  "password": ["This password is too common."]
}
```

Example (401):

```json
{
  "detail": "Given token not valid for any token type."
}
```

---

## Common Use Cases

**1. User registration & login**

1. `POST /api/auth/users/` — Register with `email`, `username`, `password` (and optionally `re_password`).
2. `POST /api/auth/jwt/create/` — Login with `username` and `password` → receive `access` and `refresh`.
3. `GET /api/auth/users/me/` — Get current user (send `Authorization: Bearer <access>`).

**2. Creating & listing moods**

1. `POST /api/moods/` — Create mood with `emoji` (and optionally `reason`, `tag_ids`). Auth required.
2. `GET /api/moods/` — List current user’s moods. Response: `{ "count": N, "data": [...] }`.
3. `GET /api/moods/:id/` — Fetch a single mood by ID. Auth required.

**3. 2FA login flow**

1. `POST /api/users/auth/2fa/login/` — Send `username`, `password`. If 2FA enabled → OTP emailed, response `requires_2fa: true`; optionally no 2FA → JWT returned immediately.
2. User receives OTP and submits it to `POST /api/users/auth/2fa/verify/` with `{ "token": "123456" }` and session cookie from step 1.
3. Response contains `access` and `refresh`. Use `access` in `Authorization` for later API calls.

---

## API Response Examples

**GET /api/users/profile/**

```
GET /api/users/profile/
Authorization: Bearer <access_token>
```

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

**POST /api/auth/jwt/create/**

```
POST /api/auth/jwt/create/
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePass123"
}
```

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**GET /api/moods/**

```
GET /api/moods/
Authorization: Bearer <access_token>
```

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

**POST /api/moods/**

```
POST /api/moods/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "emoji": "😊",
  "reason": "Had a great day!"
}
```

```json
{
  "message": "Mood logged successfully",
  "data": {
    "id": 3,
    "user": "johndoe",
    "emoji": "😊",
    "reason": "Had a great day!",
    "tags": [],
    "created_at": "2025-01-23T16:00:00Z",
    "updated_at": "2025-01-23T16:00:00Z"
  }
}
```

---

For complete endpoint reference, request/response schemas, and optional parameters, see [API Endpoints](./endpoints.md).
