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

Copy the example env file and update with your settings:

```bash
cp .env.example .env
```

Required `.env` variables:

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

## JWT Authentication Setup

This project uses **Simple JWT** with **Djoser** for token-based authentication.

### Key Configuration

- **Access Token Lifetime**: 60 minutes
- **Refresh Token Lifetime**: 7 days
- **Token Rotation**: Enabled with blacklisting
- **Login Field**: Username
- **Custom User Model**: `users.User`

### Authentication Endpoints

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

## JWT Authentication Endpoints

| Action            | Method | URL                     |
| ----------------- | ------ | ----------------------- |
| Register User     | POST   | `/api/auth/users/`      |
| Login (Get Token) | POST   | `/api/auth/jwt/create/` |
| Refresh Token     | POST   | `/api/auth/jwt/refresh/`|
| Verify Token      | POST   | `/api/auth/jwt/verify/` |
| Current User Info | GET    | `/api/auth/users/me/`   |

## Testing with Postman

### Register a User

```
POST http://127.0.0.1:8000/api/auth/users/
```

Body (JSON):

```json
{
  "email": "user@example.com",
  "username": "testuser",
  "password": "TestPassword123"
}
```

### Login to Get Tokens

```
POST http://127.0.0.1:8000/api/auth/jwt/create/
```

Body (JSON):

```json
{
  "username": "testuser",
  "password": "TestPassword123"
}
```

Response:

```json
{
  "refresh": "REFRESH_TOKEN_HERE",
  "access": "ACCESS_TOKEN_HERE"
}
```

### Access Protected Endpoints

Add the following header to your requests:

```
Authorization: Bearer ACCESS_TOKEN_HERE
```

Example:

```
GET http://127.0.0.1:8000/api/auth/users/me/
```

## Contributing

Please read [contribution.md](contribution.md) for contribution guidelines.
