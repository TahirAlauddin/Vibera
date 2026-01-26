# Getting Started with Vibera

Welcome to **Vibera** — a mood-tracking and journaling app with a Django REST API and Next.js frontend. This guide gets you **running** the app and points you to what’s next.

**New to the project?** Complete [Environment Setup](environment-setup.md) first (clone, backend & frontend setup, database, env vars, migrations, superuser). Then return here to run and verify.

---

## Prerequisites

You need **Python 3.11+**, **Node.js 18+**, **Git**, and optionally **Docker** (for PostgreSQL). For install steps, version checks, and OS-specific setup, see [Environment Setup](environment-setup.md).

---

## Before You Run

Ensure you’ve finished [Environment Setup](environment-setup.md):

- [ ] Backend venv created, `pip install -r requirements.txt` done
- [ ] Frontend `npm install` done
- [ ] `backend/.env` and `frontend/.env.local` exist (see [Environment Setup → Environment Variables](environment-setup.md#environment-variables))
- [ ] Database ready (SQLite or PostgreSQL via Docker)
- [ ] `python manage.py migrate` and `python manage.py createsuperuser` completed

---

## Running the Project

Use **two terminals**.

**Terminal 1 – Backend:**

```bash
cd backend
venv\Scripts\activate   # Windows (or source venv/bin/activate on macOS/Linux)
python manage.py runserver
```

**Expected:** `Starting development server at http://127.0.0.1:8000/`

**Terminal 2 – Frontend:**

```bash
cd frontend
npm run dev
```

**Expected:** `Ready on http://localhost:3000`

- **API:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **App:** [http://localhost:3000](http://localhost:3000)
- **Admin:** [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) (log in with your superuser)

---

## Verifying Installation

Quick checks:

- [ ] **Backend:** `GET http://127.0.0.1:8000/api/test/` returns JSON like `{"status":"success","message":"Django REST Framework is configured correctly!",...}`
- [ ] **Frontend:** [http://localhost:3000](http://localhost:3000) loads without errors
- [ ] **Admin:** [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) — you can log in with the superuser
- [ ] **Register:** `POST http://127.0.0.1:8000/api/auth/users/` with `{"email":"...","username":"...","password":"...","re_password":"..."}` returns `201`
- [ ] **Login:** `POST http://127.0.0.1:8000/api/auth/jwt/create/` with `{"username":"...","password":"..."}` returns `{"access":"...","refresh":"..."}`

**Quick smoke test:**

```bash
curl http://127.0.0.1:8000/api/test/
```

For the full verification checklist (versions, deps, env, DB, etc.), see [Environment Setup → Verification Checklist](environment-setup.md#verification-checklist).

---

## Project Structure

```
Vibera/
├── backend/                 # Django API
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env                 # your env (create from .env.example)
│   ├── docker-compose.yml   # PostgreSQL
│   ├── vibera/              # project config (settings, urls)
│   ├── users/               # auth, profiles, 2FA
│   ├── moods/               # mood logging, tags
│   ├── social/              # follow / unfollow
│   └── notifications/       # notifications
├── frontend/                # Next.js app
│   ├── package.json
│   ├── .env.local           # your env (create from .env.example)
│   └── src/
│       ├── app/             # pages, layouts
│       ├── components/      # UI components
│       └── lib/             # api client, utils
├── docs/                    # documentation
│   ├── api/                 # API overview & endpoints
│   ├── guides/              # getting started, environment setup
│   └── ...
└── README.md
```

---

## Useful Commands

| Context | Command |
|---------|---------|
| **Backend** | `python manage.py runserver` |
| **Backend** | `python manage.py migrate` |
| **Backend** | `python manage.py createsuperuser` |
| **Backend** | `python manage.py test_postgres_logging` (Postgres + Docker) |
| **Frontend** | `npm run dev` |
| **Frontend** | `npm run build` · `npm run start` |
| **Frontend** | `npm run lint` · `npm run lint:fix` · `npm run format` |
| **Docker** | `docker compose -f backend/docker-compose.yml up -d` |
| **Docker** | `docker compose -f backend/docker-compose.yml down` |

---

## Next Steps

- **[API Overview](../api/overview.md)** — Auth, base URL, request/response format
- **[API Endpoints](../api/endpoints.md)** — Full REST endpoint reference
- **[Architecture](../ARCHITECTURE.md)** — Tech stack, data flow, deployment
- **[Contributing](../contributing.md)** — Branching, PRs, code style

---

## Getting Help

- **Setup & config:** [Environment Setup](environment-setup.md) — env vars, database, IDE, Git workflow, [troubleshooting](environment-setup.md#troubleshooting)
- **README:** [Project README](../../README.md) — setup, API examples, Postgres
- **Contributing:** [Contributing to Vibera](../contributing.md) — workflow, conventions
- **Code of Conduct:** [CODE_OF_CONDUCT](../CODE_OF_CONDUCT.md) — community guidelines
- **Issues:** [GitHub Issues](https://github.com/TahirAlauddin/Vibera/issues) for bugs or feature ideas

---

You’re ready to hack. Check [API Endpoints](../api/endpoints.md) and [Contributing](../contributing.md) next.
