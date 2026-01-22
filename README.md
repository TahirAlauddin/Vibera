# Vibera

A mood tracking and journaling application built with Django REST Framework and JWT authentication.

## Tech Stack

- **Backend**: Django 6.0
- **API**: Django REST Framework
- **Authentication**: JWT (Djoser + SimpleJWT)
- **2FA**: Email-based OTP
- **Database**: PostgreSQL

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/TahirAlauddin/Vibera.git
cd Vibera
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS / Linux
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update:

```env
SECRET_KEY=your_secret_key
DB_ENGINE=django.db.backends.postgresql
DB_NAME=vibera_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=127.0.0.1,localhost

# Email Configuration (for 2FA OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
```

### 4. Run Migrations

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 5. Start the Server

```bash
python manage.py runserver
```

API Base URL: `http://127.0.0.1:8000/`

## Database Models

### User Model

- `email`, `username` (unique, for login)
- `first_name`, `last_name` (optional)
- `is_active`, `is_staff`, `is_2fa_enabled`, `date_joined`

### EmailOTP Model (Two-Factor Authentication)

- `user` - ForeignKey to User
- `hashed_code` - Securely hashed OTP code
- `expires_at` - OTP expiration time
- `is_used` - Whether OTP has been used
- `attempts` - Failed verification attempts
- `created_at` - Creation timestamp

### Mood Model

- `user` - ForeignKey to User
- `emoji` - Mood emoji (😊 Happy, 😔 Sad, 😡 Angry, 😰 Anxious, 😴 Tired, 😌 Calm)
- `reason` - Optional text
- `created_at`, `updated_at`

### EmojiJournalEntry Model

- `mood` - ForeignKey to Mood
- `user` - ForeignKey to User
- `note` - Journal text
- `created_at`, `updated_at`

### Follow Model

- `follower` - ForeignKey to User (the user who follows)
- `following` - ForeignKey to User (the user being followed)
- `created_at` - Timestamp when follow was created
- **Constraints**: Unique together (follower, following), Self-follow prevention
- **Indexes**: Optimized for follower/following lookups and relationship checks

The JWT endpoints are configured at `/api/auth/`:

- User registration, login, and profile management via Djoser
- Token creation, refresh, and verification via Simple JWT

All configuration is already set up in `settings.py` and `urls.py`.

## PostgreSQL Setup (Docker)

### Using Docker Compose (Recommended)

```bash
cd backend
docker compose -f docker-compose.yml up -d
```

This will start a PostgreSQL 16 container with the following configuration:

- Database: `vibera_db`
- User: `postgres`
- Password: `postgres`
- Port: `5432`

### Using Docker Run

```bash
docker run -d \
  --name vibera-postgres \
  -e POSTGRES_DB=vibera_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16
```

### Testing PostgreSQL Logging with Docker

The project includes a comprehensive test command to validate PostgreSQL logging functionality when running with Docker Desktop. This is a standard industry practice for ensuring logging works correctly in containerized environments.

#### Prerequisites

- Docker Desktop installed and running
- PostgreSQL container running (see setup above)
- Database configured to use PostgreSQL in `.env` file:
  ```env
  DB_ENGINE=django.db.backends.postgresql
  DB_NAME=vibera_db
  DB_USER=postgres
  DB_PASSWORD=postgres
  DB_HOST=localhost
  DB_PORT=5432
  ```

#### Running the Test

```bash
cd backend
python manage.py test_postgres_logging
```

#### Test Options

```bash
# Basic test (checks Docker, starts container if needed)
python manage.py test_postgres_logging

# Include Docker container logs in output
python manage.py test_postgres_logging --check-docker-logs

# Skip Docker check (useful if Docker is not installed)
python manage.py test_postgres_logging --skip-docker-check
```

#### What the Test Validates

The test command comprehensively validates:

1. **Docker Environment**

   - Docker installation and availability
   - Docker Desktop running status
   - PostgreSQL container status (starts container if needed)

2. **Database Connection Logging**

   - Connection creation events
   - Connection closure events
   - Connection details (database, host, port, user)

3. **Query Logging**

   - SELECT queries
   - INSERT operations
   - UPDATE operations
   - Query execution tracking

4. **Slow Query Detection**

   - Queries exceeding threshold (default: 1000ms)
   - Slow query warnings with execution time
   - Uses `pg_sleep()` for testing

5. **Error Logging**

   - Invalid SQL errors
   - Constraint violations (e.g., unique constraints)
   - Error details with exception information

6. **Log Output Verification**
   - Logs appear in log files (`backend/logs/`)
   - Logs appear in stdout (for Docker log collection)
   - Optional Docker container log verification

#### Expected Output

The test provides a detailed report showing:

- Docker and container status
- Test results for each category (passed/failed)
- Log file location
- Instructions for viewing Docker logs

#### Viewing Logs

**Log Files:**

```bash
# View current day's logs
cat backend/logs/2026-Jan-09.logs

# Or use any text editor
```

**Docker Container Logs:**

```bash
# View PostgreSQL container logs
docker logs vibera-postgres

# Follow logs in real-time
docker logs -f vibera-postgres

# View last 50 lines
docker logs --tail 50 vibera-postgres
```

#### Troubleshooting

- **Docker not detected**: Ensure Docker Desktop is running
- **Container won't start**: Check if port 5432 is already in use
- **Database connection fails**: Verify `.env` file has correct PostgreSQL settings
- **Tests skipped**: If database is not PostgreSQL, tests will be skipped with a warning

## API Endpoints

### Authentication

| Action            | Method | URL                      |
| ----------------- | ------ | ------------------------ |
| Register User     | POST   | `/api/auth/users/`       |
| Login (Get Token) | POST   | `/api/auth/jwt/create/`  |
| Refresh Token     | POST   | `/api/auth/jwt/refresh/` |
| Verify Token      | POST   | `/api/auth/jwt/verify/`  |
| Current User Info | GET    | `/api/auth/users/me/`    |

### Two-Factor Authentication (2FA)

| Action              | Method | URL                           | Description                          |
| ------------------- | ------ | ----------------------------- | ------------------------------------ |
| Login (Request OTP) | POST   | `/api/users/auth/2fa/login/`  | Validate credentials, send OTP email |
| Verify OTP          | POST   | `/api/users/auth/2fa/verify/` | Verify OTP, get JWT tokens           |
| Resend OTP          | POST   | `/api/users/auth/2fa/resend/` | Send a new OTP to email              |

#### 2FA Login Flow

1. **Login with credentials:**

   ```
   POST /api/users/auth/2fa/login/
   Body: {"username": "testuser", "password": "TestPassword123"}
   Response: {"success": true, "requires_2fa": true, "message": "OTP sent to your email", "email_hint": "tes***@example.com"}
   ```

2. **Check your email for the 6-digit OTP code**

3. **Verify OTP:**

   ```
   POST /api/users/auth/2fa/verify/
   Headers: Cookie: sessionid=<session-id-from-login>
   Body: {"token": "123456"}
   Response: {"success": true, "access": "...", "refresh": "..."}
   ```

4. **Resend OTP (optional):**
   ```
   POST /api/users/auth/2fa/resend/
   Headers: Cookie: sessionid=<session-id-from-login>
   Response: {"success": true, "message": "OTP sent to your email"}
   ```

> **Note:** 2FA is enabled by default for all users. OTP codes expire after 5 minutes. Maximum 3 verification attempts per OTP.

### Mood Tracking

| Action          | Method | URL              | Auth Required |
| --------------- | ------ | ---------------- | ------------- |
| Create Mood Log | POST   | `/api/moods/`    | Yes           |
| Get All Moods   | GET    | `/api/moods/`    | Yes           |
| Get Single Mood | GET    | `/api/moods/<id>/` | Yes         |
| Update Mood     | PUT    | `/api/moods/<id>/` | Yes         |
| Partial Update  | PATCH  | `/api/moods/<id>/` | Yes         |
| Delete Mood     | DELETE | `/api/moods/<id>/` | Yes         |

### Social (Follow/Unfollow)

| Action                    | Method | URL                              | Auth Required |
| ------------------------- | ------ | -------------------------------- | ------------- |
| Follow a User             | POST   | `/api/social/follow/<user_id>/`  | Yes           |
| Unfollow a User           | DELETE | `/api/social/unfollow/<user_id>/`| Yes           |
| Get My Followers          | GET    | `/api/social/followers/`         | Yes           |
| Get My Following          | GET    | `/api/social/following/`         | Yes           |
| Get User's Followers      | GET    | `/api/social/followers/<user_id>/` | Yes         |
| Get User's Following      | GET    | `/api/social/following/<user_id>/` | Yes         |

## Testing with Postman

### 1. Register & Login

**Register:**

```
POST /api/auth/users/
Body: {"email": "user@example.com", "username": "testuser", "password": "TestPassword123"}
```

**Login:**

```
POST /api/auth/jwt/create/
Body: {"username": "testuser", "password": "TestPassword123"}
Response: {"refresh": "...", "access": "..."}
```

### 2. Create Mood (Requires Token)

```
POST /api/moods/
Headers: Authorization: Bearer YOUR_ACCESS_TOKEN
Body: {"emoji": "😊", "reason": "Had a great day!"}
```

**Emoji choices:** 😊 😔 😡 😰 😴 😌

### 3. Get Moods (Requires Token)

```
GET /api/moods/
Headers: Authorization: Bearer YOUR_ACCESS_TOKEN
Response: {"count": 2, "data": [...]}
```

### 4. Get Single Mood (Requires Token)

```
GET /api/moods/1/
Headers: Authorization: Bearer YOUR_ACCESS_TOKEN
Response: {"id": 1, "user": "testuser", "emoji": "😊", "reason": "...", "created_at": "...", "updated_at": "..."}
```

### 5. Update Mood (Requires Token)

```
PUT /api/moods/1/
Headers: Authorization: Bearer YOUR_ACCESS_TOKEN
Body: {"emoji": "😔", "reason": "Feeling sad today"}
Response: {"message": "Mood log updated successfully", "data": {...}}
```

### 6. Partial Update Mood (Requires Token)

```
PATCH /api/moods/1/
Headers: Authorization: Bearer YOUR_ACCESS_TOKEN
Body: {"reason": "Updated reason only"}
Response: {"message": "Mood log updated successfully", "data": {...}}
```

### 7. Delete Mood (Requires Token)

```
DELETE /api/moods/1/
Headers: Authorization: Bearer YOUR_ACCESS_TOKEN
Response: {"message": "Mood log deleted successfully"}
```

### 8. Follow a User (Requires Token)

```
POST /api/social/follow/2/
Headers: Authorization: JWT YOUR_ACCESS_TOKEN
Response: {"id": 1, "follower": {...}, "following": {...}, "created_at": "..."}
```

### 9. Unfollow a User (Requires Token)

```
DELETE /api/social/unfollow/2/
Headers: Authorization: JWT YOUR_ACCESS_TOKEN
Response: {"message": "Successfully unfollowed username"}
```

### 6. Get Followers (Requires Token)

```
GET /api/social/followers/
Headers: Authorization: JWT YOUR_ACCESS_TOKEN
Response: {"count": 2, "results": [...]}
```

### 11. Get Following (Requires Token)

```
GET /api/social/following/
Headers: Authorization: JWT YOUR_ACCESS_TOKEN
Response: {"count": 1, "results": [...]}
```

## JWT Configuration

- **Access Token**: 60 minutes
- **Refresh Token**: 7 days
- **Login Field**: Username

## Frontend

### Dependencies

- **Next.js**: 16.1.1
- **React**: 19.2.3
- **React DOM**: 19.2.3

### Steps to Run the Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Install class-variance-authority for cva, slot, VarianceProps

```bash
npm install class-variance-authority
```

4. Install clsx

```bash
npm install clsx
```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

Please read [contribution.md](contribution.md) for contribution guidelines.
