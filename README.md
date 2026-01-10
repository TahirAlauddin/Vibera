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

The JWT endpoints are configured at `/api/auth/`:

- User registration, login, and profile management via Djoser
- Token creation, refresh, and verification via Simple JWT

All configuration is already set up in `settings.py` and `urls.py`.

## PostgreSQL Setup (Docker)

```bash
docker run -d \
  --name vibera-postgres \
  -e POSTGRES_DB=vibera_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:18
```

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
