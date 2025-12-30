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

## API Endpoints

### Authentication

| Action            | Method | URL                     |
| ----------------- | ------ | ----------------------- |
| Register User     | POST   | `/api/auth/users/`      |
| Login (Get Token) | POST   | `/api/auth/jwt/create/` |
| Refresh Token     | POST   | `/api/auth/jwt/refresh/`|
| Current User Info | GET    | `/api/auth/users/me/`   |

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

## Contributing

Please read [contribution.md](contribution.md) for contribution guidelines.
