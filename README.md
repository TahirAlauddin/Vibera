# Vibera

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![Django 6](https://img.shields.io/badge/Django-6.0-green.svg)](https://www.djangoproject.com/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A mood-tracking and journaling app** — log how you feel, add notes, follow friends, and get notifications. Built with Django REST + JWT and a Next.js frontend.

---

---

## ✨ Key Features

- 🎭 **Mood logging** — Track daily moods with emojis (Happy, Sad, Calm, etc.) and optional reasons
- 📔 **Journal entries** — Attach reflective notes to moods
- 👥 **Follow system** — Connect with others; see followers and following
- 🔐 **JWT + 2FA** — Secure login with optional email OTP
- 🔔 **Notifications** — Welcome, new follower, follow-back, and daily mood reminders
- 📱 **REST API** — Open API for integrations and clients

---

## 🚀 Quick Start

```bash
# 1. Clone the repository and navigate to the project root
git clone https://github.com/TahirAlauddin/Vibera.git
cd Vibera

# 2. Set up the backend (Python virtual environment & dependencies)
cd backend
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Copy environment variables and configure
cp .env.example .env           # Edit SECRET_KEY, ALLOWED_HOSTS, CORS_ALLOWED_ORIGINS in .env

# 4. Run initial migrations and create a superuser
python manage.py migrate
python manage.py createsuperuser

# 5. Set up the frontend (Next.js/React)
cd ../frontend
npm install
npm run dev
```


**Then:** Activate `backend/venv`, run `python manage.py runserver`, and open [http://localhost:3000](http://localhost:3000).  
**Read More:** [Getting Started](docs/guides/getting-started.md) · [Environment Setup](docs/guides/environment-setup.md)

---

## 🛠 Tech Stack

| Layer       | Tech                          |
|------------|-------------------------------|
| **Frontend** | Next.js 16, React 19, Tailwind |
| **Backend**  | Django 6, Django REST Framework |
| **Auth**     | JWT (Djoser + Simple JWT), email 2FA |
| **Database** | PostgreSQL 16 (or SQLite for dev) |
| **Deploy**   | Docker Compose (DB); see [Deployment](docs/deployment/deployment.md) |

---

## 📚 Documentation

**[📖 Documentation hub](docs/README.md)** — Index and navigation for all docs.

| Doc | Description |
|-----|-------------|
| [Getting Started](docs/guides/getting-started.md) | Run the app, verify, useful commands |
| [Environment Setup](docs/guides/environment-setup.md) | Env vars, database, IDE, Git workflow |
| [API Overview](docs/api/overview.md) | Auth, base URL, request/response format |
| [API Endpoints](docs/api/endpoints.md) | Full REST endpoint reference |
| [Architecture](docs/ARCHITECTURE.md) | System design, scaling, deployment |
| [Database Schema](docs/database/schema.md) | Tables, relationships, migrations |

---

## 🤝 Contributing

1. **Fork** the repo and clone it.
2. **Branch** from `main` using `feature/` or `fix/` (e.g. `feature/mood-filters`).
3. **Commit** with clear messages (`feat: …`, `fix: …`).
4. **Open a PR** and fill the description (What, Why, How to test).
5. **Review** — address feedback; maintainers will merge when ready.

📋 [Contributing guide](docs/contributing.md) · [Code of Conduct](docs/CODE_OF_CONDUCT.md)

---

## 📄 License · Author · Support

- **License:** MIT
- **Author:** [Tahir Alauddin](https://github.com/TahirAlauddin)
- **Support:** [Open an issue](https://github.com/TahirAlauddin/Vibera/issues) for bugs or ideas.

---

*Vibera — track moods, journal, and connect.*
