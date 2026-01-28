# Environment Setup Guide

This guide walks new team members through **environment configuration** for Vibera: local dev setup, database, env vars, third-party services, tooling, IDE, Git workflow, migrations, and troubleshooting. Follow the steps in order and use the verification checklist to confirm setup is complete. **To run the app and verify it works**, see [Getting Started](getting-started.md) next.

---

## Development Environment

### 1. Install core runtime and tools

| Software | Version | Check command |
|----------|---------|----------------|
| **Python** | 3.11+ | `python --version` |
| **Node.js** | 18+ (LTS) | `node --version` |
| **npm** | (bundled) | `npm --version` |
| **Git** | Latest | `git --version` |
| **Docker** | Latest | `docker --version` |

**Windows:** Install Python from [python.org](https://www.python.org/downloads/) and Node from [nodejs.org](https://nodejs.org). Ensure both are on `PATH`. For Docker, use [Docker Desktop](https://www.docker.com/products/docker-desktop/).

**macOS:** `brew install python@3.11 node git docker`

**Linux (Debian/Ubuntu):**

```bash
sudo apt update
sudo apt install python3.11 python3.11-venv nodejs npm git docker.io
```

### 2. Clone and open the project

```bash
git clone https://github.com/TahirAlauddin/Vibera.git
cd Vibera
```

**Expected:** Project root contains `backend/`, `frontend/`, `docs/`.

### 3. Backend virtual environment

```bash
cd backend
python -m venv venv
```

**Activate:**

- **Windows (PowerShell):** `.\venv\Scripts\Activate.ps1`
- **Windows (CMD):** `venv\Scripts\activate.bat`
- **macOS / Linux:** `source venv/bin/activate`

```bash
pip install -r requirements.txt
```

**Expected:** `Successfully installed ...` with no errors.

### 4. Frontend dependencies

From project root (new terminal):

```bash
cd frontend
npm install
```

**Expected:** `added XXX packages` in `node_modules/`.

---

## Database Setup

### Option A: SQLite (quick local dev)

No extra install. Use SQLite by **not** setting `DB_ENGINE` (or set `DB_ENGINE=django.db.backends.sqlite3`) in `backend/.env`. The app uses `backend/db.sqlite3` by default. Suitable for API-only work; 2FA email still requires SMTP config.

### Option B: PostgreSQL via Docker (recommended)

**Start PostgreSQL:**

```bash
cd backend
docker compose -f docker-compose.yml up -d
```

**Expected:**

```
[+] Running 1/1
 ✔ Container vibera-postgres  Started
```

**Verify:**

```bash
docker ps
```

You should see `vibera-postgres` on port `5432`.

**Connection details:**

| Setting | Value |
|--------|--------|
| Host | `localhost` |
| Port | `5432` |
| Database | `vibera_db` |
| User | `postgres` |
| Password | `postgres` |

**Stop:**

```bash
docker compose -f docker-compose.yml down
```

### Option C: System PostgreSQL

Install Postgres 14+ locally, create DB and user, then set `DB_*` in `backend/.env` to match (see [Environment Variables](#environment-variables)).

---

## Environment Variables

### Backend (`backend/.env`)

Create from `backend/.env.example`:

```bash
cd backend
copy .env.example .env   # Windows
# cp .env.example .env   # macOS / Linux
```

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SECRET_KEY` | **Yes** | Django secret; never commit | Generate (see below) |
| `ALLOWED_HOSTS` | **Yes** | Comma-separated hosts | `127.0.0.1,localhost` |
| `CORS_ALLOWED_ORIGINS` | **Yes** | Frontend origins | `http://localhost:3000` |
| `DB_ENGINE` | No | DB backend (default: SQLite) | `django.db.backends.postgresql` |
| `DB_NAME` | If Postgres | Database name | `vibera_db` |
| `DB_USER` | If Postgres | DB user | `postgres` |
| `DB_PASSWORD` | If Postgres | DB password | `postgres` |
| `DB_HOST` | If Postgres | DB host | `localhost` |
| `DB_PORT` | If Postgres | DB port | `5432` |
| `EMAIL_HOST` | For 2FA | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | For 2FA | SMTP port | `587` |
| `EMAIL_USE_TLS` | For 2FA | Use TLS | `True` |
| `EMAIL_HOST_USER` | For 2FA | SMTP user | Your Gmail |
| `EMAIL_HOST_PASSWORD` | For 2FA | SMTP password | Gmail App Password |
| `DEFAULT_FROM_EMAIL` | For 2FA | From address | Your Gmail |
| `OTP_EXPIRY_MINUTES` | No | OTP validity (default: 5) | `5` |
| `OTP_MAX_ATTEMPTS` | No | OTP attempts (default: 3) | `3` |

**Optional logging:**

| Variable | Default | Description |
|----------|---------|-------------|
| `LOG_FORMATTER` | `verbose` | `verbose` \| `detailed` \| `simple` |
| `LOG_RETENTION_DAYS` | `30` | Days to keep date-rotated logs |
| `LOG_MAX_BYTES` | `5242880` | Max bytes before size rotation |
| `ENABLE_DATE_ROTATION` | `false` | Use date-based log rotation |
| `ROOT_LOG_LEVEL` | `INFO` | Root logger level |
| `APPLICATION_LOG_LEVEL` | `INFO` | App log level |
| `DB_SLOW_QUERY_THRESHOLD_MS` | `1000` | Slow-query threshold (ms) |

**Generate `SECRET_KEY`:**

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Minimal `.env` (SQLite, no 2FA):**

```env
SECRET_KEY=<output-from-command-above>
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**PostgreSQL + 2FA example:** See [Third-Party Services](#third-party-services) for email setup.

### Frontend (`frontend/.env.local`)

Create from `frontend/.env.example`:

```bash
cd frontend
copy .env.example .env.local   # Windows
# cp .env.example .env.local   # macOS / Linux
```

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | **Yes** | Backend API base URL | `http://127.0.0.1:8000` |

**Never commit** `.env` or `.env.local`; both are gitignored.

---

## Third-Party Services

### Email (2FA OTP)

2FA sends OTPs by email. Configure SMTP in `backend/.env`.

**Gmail:**

1. Enable [2-Step Verification](https://myaccount.google.com/security).
2. Create an [App Password](https://myaccount.google.com/apppasswords) for “Mail.”
3. Use that 16-character password as `EMAIL_HOST_PASSWORD`.

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER=your@gmail.com
EMAIL_HOST_PASSWORD=xxxx-xxxx-xxxx-xxxx
DEFAULT_FROM_EMAIL=your@gmail.com
```

**Other SMTP:** Set `EMAIL_HOST`, `EMAIL_PORT`, and TLS/SSL to match your provider.

**Local testing without email:** Use the standard JWT login (`POST /api/auth/jwt/create/`) or disable 2FA for your user. OTP endpoints will fail if SMTP is not configured.

### OAuth / API keys

Vibera uses JWT + optional email 2FA. There is no OAuth or external API key setup required for core auth. If you add OAuth later, store client IDs and secrets in env vars and never commit them.

---

## Development Tools

### Git

- **Install:** [git-scm.com](https://git-scm.com/)
- **Identify:** `git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"`

### Docker

- **Install:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/macOS) or `docker.io` (Linux).
- **Use:** Postgres via `backend/docker-compose.yml` (see [Database Setup](#database-setup)).

### Redis (optional)

Vibera does **not** use Redis currently. If you introduce caching or task queues later, install Redis locally or via Docker and add corresponding env vars. No action required for standard setup.

---

## IDE Configuration

### VS Code / Cursor

**Recommended extensions:**

| Extension | ID | Purpose |
|-----------|-----|---------|
| Python | `ms-python.python` | Python support |
| Pylance | `ms-python.vscode-pylance` | Type checking, IntelliSense |
| Black Formatter | `ms-python.black-formatter` | Python formatting |
| ESLint | `dbaeumer.vscode-eslint` | JS/TS linting |
| Prettier | `esbenp.prettier-vscode` | JS/TS/CSS formatting |
| Docker | `ms-azuretools.vscode-docker` | Docker workflows |

**Project settings:** The repo includes `.vscode/settings.json`:

- **Python:** Black as formatter, line length 88, format on save.
- **Linting:** Flake8, max line length 88, exclude venv and cache dirs.
- **Organize imports** on save.

Use the workspace settings as-is so formatting and linting stay consistent across the team.

**Python interpreter:** Select `backend/venv` (e.g. `Python: Select Interpreter` → `./venv/bin/python` or `.\venv\Scripts\python.exe`).

---

## Git Workflow

### Branch naming

Format: `<type>/<short-description>`

| Type | Use for |
|------|---------|
| `feature` | New features |
| `fix` | Bug fixes |
| `chore` | Tooling, setup, cleanup |
| `refactor` | Code refactors |
| `docs` | Documentation only |

**Examples:** `feature/mood-logging-api`, `fix/login-token-refresh`, `chore/setup-eslint`, `docs/update-contribution-guide`

### Commit messages

Format: `<type>: short, present-tense description`

**Types:** `feat`, `fix`, `chore`, `refactor`, `docs`

**Examples:**

```
feat: add mood model
fix: prevent duplicate mood entries
chore: configure django rest framework
docs: update api readme
```

- One logical change per commit.
- Never push directly to `main`; use pull requests.
- Never commit `.env` or secrets.

See [Contributing to Vibera](../contributing.md) for PR rules and review process.

---

## Database Migrations

### Apply migrations

From `backend/` with venv activated:

```bash
python manage.py migrate
```

**Expected:** `Applying users.0001_initial... OK`, etc. Tables created in the configured DB.

### Create new migrations (after model changes)

```bash
python manage.py makemigrations
python manage.py migrate
```

### Inspect migration status

```bash
python manage.py showmigrations
```

### Create superuser (local admin)

```bash
python manage.py createsuperuser
```

Follow prompts (email, username, password). Use this account for [Django Admin](http://127.0.0.1:8000/admin/).

**Seeding:** The project does not ship with seed data or fixtures. Use the API or admin to create users and test data.

---

## Verification Checklist

Confirm each **setup** item (runtime checks are in [Getting Started](getting-started.md#verifying-installation)):

- [ ] **Python & Node:** `python --version` (3.11+), `node --version` (18+).
- [ ] **Backend deps:** `cd backend && pip install -r requirements.txt` completes.
- [ ] **Frontend deps:** `cd frontend && npm install` completes.
- [ ] **Env files:** `backend/.env` and `frontend/.env.local` exist; `SECRET_KEY`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `NEXT_PUBLIC_API_BASE_URL` set.
- [ ] **Database:** Postgres container running (if used) or SQLite default; `python manage.py migrate` runs without errors.
- [ ] **Superuser:** `python manage.py createsuperuser` completed.

Next: [Run the app and verify](getting-started.md#running-the-project) (servers, health check, frontend, admin, register/login).

---

## Team Environment Sync

- **Shared:** Use `*.env.example` as the source of truth. Document new vars there with comments; add them to this guide.
- **Local:** Copy to `.env` / `.env.local` and fill in **local-only** values (e.g. `SECRET_KEY`, email credentials). Never commit actual secrets.
- **Onboarding:** New members run the same clone → venv → `pip install` → `npm install` → copy env → migrate → run servers. This guide and [Getting Started](getting-started.md) should be enough.
- **Changes:** When new env vars are added, update `.env.example` and this doc, then announce in PR or team chat.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| **`SECRET_KEY` / env error** | Ensure `backend/.env` exists. Add `SECRET_KEY`; generate via `get_random_secret_key` command above. |
| **`DB connection` / `OperationalError`** | Postgres: start Docker (`docker compose up -d`), check `DB_*` in `.env`. SQLite: omit Postgres vars or set `DB_ENGINE=django.db.backends.sqlite3`. |
| **Port 5432 in use** | Another Postgres is using it. Stop that service or change the host port in `docker-compose.yml`. |
| **Port 8000 or 3000 in use** | Use `runserver 8001` or `next dev -p 3001`, or stop the process using the port. |
| **CORS errors from frontend** | Add `http://localhost:3000` to `CORS_ALLOWED_ORIGINS` in `backend/.env`. |
| **`ModuleNotFoundError`** | Activate `backend/venv` and run `pip install -r requirements.txt` again. |
| **Frontend can’t reach API** | Set `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000` in `frontend/.env.local`. |
| **2FA OTP not sending** | Configure `EMAIL_*` in `backend/.env`. For Gmail, use an App Password; check spam. |
| **Black / Flake8 conflicts** | Use the repo’s `.vscode/settings.json`; ensure Black line length 88 and Flake8 `--max-line-length=88`. |
| **Docker Postgres won’t start** | Ensure Docker Desktop is running. Run `docker compose -f backend/docker-compose.yml up -d` from `backend/`. |

---

**Next:** [Getting Started](getting-started.md) for run instructions and first API calls, or [API Overview](../api/overview.md) for integration details.
