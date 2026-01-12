# Vibera

A mood tracking and journaling application built with Django REST Framework and JWT authentication.

## Tech Stack

- **Backend**: Django 6.0
- **API**: Django REST Framework
- **Authentication**: JWT (Djoser + SimpleJWT)
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
- `is_active`, `is_staff`, `date_joined`

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

### Mood Tracking

| Action          | Method | URL           | Auth Required |
| --------------- | ------ | ------------- | ------------- |
| Create Mood Log | POST   | `/api/moods/` | Yes           |
| Get All Moods   | GET    | `/api/moods/` | Yes           |

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
