# System Architecture

**Vibera** is a mood-tracking and journaling platform built with a modern JAMstack-style frontend and a REST API backend. Users log moods with emojis, optionally attach journal notes, and interact socially via follow/unfollow. The system supports JWT authentication with optional email-based 2FA.

This document targets new developers and future maintainers. It explains the **why** behind major choices, not just the **what**. For API request/response details, see the [main README](../README.md#api-endpoints). For database models, see [README – Database Models](../README.md#database-models).

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend | Next.js | 16.x | React framework, SSR, routing, API proxy |
| Frontend | React | 19.x | UI components |
| Frontend | Tailwind CSS | 4.x | Styling |
| Backend | Django | 6.0 | Web framework, ORM, admin |
| API | Django REST Framework | 3.16 | REST API, serializers, permissions |
| Auth | Djoser + Simple JWT | 2.3 / 5.5 | Registration, login, JWT issue/refresh |
| 2FA | Custom (Email OTP) | — | Optional two-factor via email |
| Database | PostgreSQL | 16 | Persistent storage |
| Logging | Python `logging` | — | File + stdout, rotation, middleware |

---

## System Overview Diagram

```text
+-------------+        HTTP / HTTPS        +-----------------------+        API Calls        +-----------------------+
|   Browser   | <-----------------------> |   Next.js Frontend    | ---------------------> |   Django + DRF API    |
|   (Client)  |                           |  React · Tailwind CSS |                        |     (Backend)        |
+-------------+                           +-----------------------+                        +-----------+-----------+
                                                                                                        |
                                                                                                        |
                                                                                                        v
                                                                                             +-----------------------+
                                                                                             |     PostgreSQL        |
                                                                                             |      Database         |
                                                                                             +-----------------------+
```
The frontend runs separately (e.g. `localhost:3000`) and calls the Django API (e.g. `localhost:8000`). There is no built-in API proxy; the frontend uses configurable base URLs for API requests.

---

## Architecture Layers

**Frontend (Next.js + React)**  
Handles all UI: landing, login, signup, mood check‑ins, journal entries, and social views. It consumes the REST API via `fetch` (e.g. `apiFetch` in `src/lib/api.ts`), stores JWT tokens (e.g. in memory or storage), and sends `Authorization: Bearer <token>` for protected endpoints.

**API (Django + DRF)**  
Validates input, enforces authentication and permissions, executes business logic, and returns JSON. JWT is the primary auth mechanism; 2FA uses sessions only during the OTP step. The API layer does not serve static frontend assets.

**Data (PostgreSQL)**  
Stores users, profiles, moods, journal entries, follow relationships, and notifications. Migrations are managed via Django. Optional Docker Compose setup runs PostgreSQL 16 locally.

**External services**  
SMTP is used for 2FA OTP emails. File storage for avatars uses Django’s default (local or configured backend); no S3 or similar is required by the base architecture.

---

## Data Flow Diagram

**Example: User login (with 2FA enabled)**

1. **User submits credentials** → `POST /api/users/auth/2fa/login/` with `username` and `password`.
2. **Backend validates** → Django `authenticate()`; if valid and 2FA enabled, an OTP is generated, hashed, stored, and sent via email. Session stores `pending_2fa_user`.
3. **Backend responds** → `{ "success": true, "requires_2fa": true, "message": "OTP sent...", "email_hint": "..." }`. No JWT yet.
4. **User submits OTP** → `POST /api/users/auth/2fa/verify/` with `token`, plus session cookie.
5. **Backend verifies OTP** → Checks hash, expiry, attempts. On success, issues JWT access + refresh via Simple JWT.
6. **Frontend stores tokens** → Saves access/refresh (e.g. in memory or localStorage) and sends `Authorization: Bearer <access>` on subsequent API calls.

**Without 2FA:** Steps 1–3 simplify to `POST /api/users/auth/2fa/login/` returning JWT immediately (`requires_2fa: false`), or the standard `POST /api/auth/jwt/create/` flow.

---


## Authentication & Security

**Auth flow**  
- **Registration:** `POST /api/auth/users/` (Djoser). Passwords are validated by Django validators and stored hashed.  
- **Login:** `POST /api/auth/jwt/create/` returns access + refresh tokens.  
- **2FA:** Use `/api/users/auth/2fa/login/` → receive OTP by email → `POST /api/users/auth/2fa/verify/` with OTP + session cookie → receive JWT.  
- **Protected routes:** Send `Authorization: Bearer <access_token>`. Use `POST /api/auth/jwt/refresh/` when the access token expires.

**Security measures**  
- Passwords hashed with Django’s default (PBKDF2).  
- JWT: HS256, access lifetime 60 minutes, refresh 7 days.  
- OTPs hashed (e.g. SHA-256), expiry and attempt limits (see `OTP_EXPIRY_MINUTES`, `OTP_MAX_ATTEMPTS`).  
- CORS restricted via `CORS_ALLOWED_ORIGINS`; credentials and auth headers allowed as needed.  
- HTTPS in production; `SECRET_KEY`, DB credentials, and email credentials from environment.

**Relevant env variables**  
`SECRET_KEY`, `DB_*`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `EMAIL_*`, `OTP_EXPIRY_MINUTES`, `OTP_MAX_ATTEMPTS`. See [backend `.env.example`](../backend/.env.example).

---

## Deployment Architecture

The project does not prescribe a single production deployment. A typical setup:

- **Frontend:** Host the Next.js app on **Vercel** (or similar) with env vars for the API base URL.  
- **Backend:** Run Django + DRF on a **Linux server** (e.g. **AWS EC2**, GCP VM) via Gunicorn/uWSGI behind Nginx.  
- **Database:** **PostgreSQL** on **AWS RDS** (or managed Postgres elsewhere), with private access from the app server.  
- **Static/media:** Use Django `STATIC_ROOT` / `MEDIA_*` and, if needed, S3 or equivalent for avatars.

Docker Compose in the repo is for **local** PostgreSQL only, not full app deployment.

---

## Scalability & Performance

**Current limitations**  
- Single Django process (or a few workers) behind one server.  
- No caching layer (Redis/Memcached).  
- No CDN for frontend assets.  
- Database has no read replicas.

**Future scaling**  
- Add **Redis** for caching (e.g. sessions, hot API responses) and, if needed, Celery broker.  
- Use a **load balancer** and multiple app instances.  
- Add **read replicas** for PostgreSQL for heavy read workloads.  
- Consider **CDN** for static/media assets.  
- Optional: rate limiting (e.g. django-ratelimit) on auth and sensitive endpoints.

---

## Design Decisions & Rationale

**Why Next.js?**  
SSR and good defaults improve SEO and perceived performance for landing/marketing pages. React 19 and the App Router align with modern frontend practices.

**Why Django + DRF?**  
Django provides ORM, admin, migrations, and auth out of the box. DRF gives a consistent, browsable REST API and integrates cleanly with JWT and permissions.

**Why PostgreSQL?**  
Robust, ACID-compliant, and supports JSON if needed later. Docker Compose standardizes local dev.

**Why JWT?**  
Stateless auth fits API-only backends and avoids server-side session storage for token checks. Simple JWT + Djoser reduce custom auth code.

**Why email OTP for 2FA?**  
Lower friction than TOTP apps for a mood-tracking product; email is already required for signup. OTPs are short-lived and attempt-limited.

**Why CORS and no API proxy in Next?**  
Frontend and API are separate origins. Explicit CORS keeps security clear and allows frontend and backend to be deployed and scaled independently.

---

## Monitoring & Logging

**Logging**  
- Python `logging` with handlers to **stdout** and **rotating file** handlers (see [LOGGING.md](../backend/LOGGING.md)).  
- **Request/response middleware** logs method, path, user, IP, status, and duration.  
- **DB layer:** Optional PostgreSQL logging; slow-query logging via `db_logging` (threshold configurable).  
- **Error-only** file (e.g. `errors.log`) for ERROR/CRITICAL.  
- Formatters: `verbose` (default), `detailed`, `simple`. Rotation by size or date, retention configurable via env.

**Metrics & health**  
- No built-in metrics server. `/api/test/` exists for basic smoke checks.  
- **Recommendation:** Add a `/health/` or `/api/health/` endpoint (DB ping, optional dependency checks) and expose it to your orchestration or load balancer.

**Alerts**  
- No out-of-the-box alerting. **Recommendation:** In production, ship logs to CloudWatch, Datadog, or similar, and configure alerts on error rates, latency, and health-check failures.

---


*For contribution workflow, branch strategy, and code style, see [Contributing](./contributing.md).*
