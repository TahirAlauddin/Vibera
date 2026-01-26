# 📚 Documentation Hub

Welcome to the **Vibera** docs. This page is your entry point — use the tables and sections below to jump to any guide in two clicks.

---

## Quick Navigation

| Guide | Purpose | Link |
|-------|---------|------|
| Getting Started | Run the app, verify, useful commands | [./guides/getting-started.md](./guides/getting-started.md) |
| Environment Setup | Env vars, database, IDE, Git, migrations | [./guides/environment-setup.md](./guides/environment-setup.md) |
| API Overview | Auth, base URL, request/response format | [./api/overview.md](./api/overview.md) |
| API Endpoints | Full REST endpoint reference | [./api/endpoints.md](./api/endpoints.md) |
| Architecture | System design, scaling, deployment | [./ARCHITECTURE.md](./ARCHITECTURE.md) |
| Database Schema | Tables, relationships, migrations | [./database/schema.md](./database/schema.md) |
| Deployment | Environments, Docker, CI/CD, config | [./deployment/deployment.md](./deployment/deployment.md) |
| Contributing | Branching, PRs, code style | [./contributing.md](./contributing.md) |
| Code of Conduct | Community guidelines | [./CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) |

---

## By Topic

### 🚀 Getting Started

| Doc | Description |
|-----|-------------|
| [Getting Started](./guides/getting-started.md) | Run backend + frontend, verify install, project structure |
| [Environment Setup](./guides/environment-setup.md) | Prerequisites, database, env vars, IDE, troubleshooting |

### 🔧 Development

| Doc | Description |
|-----|-------------|
| [Database Schema](./database/schema.md) | Tables, ER diagram, indexes, constraints, query examples |

### 📖 API

| Doc | Description |
|-----|-------------|
| [API Overview](./api/overview.md) | Authentication, status codes, common flows |
| [API Endpoints](./api/endpoints.md) | Full endpoint list with request/response examples |

### 🏗 Architecture

| Doc | Description |
|-----|-------------|
| [Architecture](./ARCHITECTURE.md) | Tech stack, layers, data flow, design decisions |

### 🚀 Deployment

| Doc | Description |
|-----|-------------|
| [Deployment](./deployment/deployment.md) | Environments, Docker, CI/CD, environment config |

---

## File Structure

```
docs/
├── README.md                 ← You are here (Docs Hub)
├── ARCHITECTURE.md
├── CODE_OF_CONDUCT.md
├── contributing.md
├── api/
│   ├── overview.md
│   └── endpoints.md
├── database/
│   ├── schema.md
│   └── erd.png
├── deployment/
│   └── deployment.md
└── guides/
    ├── getting-started.md
    └── environment-setup.md
```

---

## How to Use

1. **New to the project?** Start with [Getting Started](./guides/getting-started.md), then [Environment Setup](./guides/environment-setup.md) if you need full config details.
2. **Integrating with the API?** Use [API Overview](./api/overview.md) for auth and conventions, then [API Endpoints](./api/endpoints.md) for specific routes.
3. **Understanding the system?** Read [Architecture](./ARCHITECTURE.md) and [Database Schema](./database/schema.md).
4. **Deploying or configuring environments?** See [Deployment](./deployment/deployment.md).
5. **Contributing?** Follow [Contributing](./contributing.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).

All links use relative paths (`./...`) so they work in GitHub, VS Code, or any Markdown viewer. Use **Quick Navigation** for a single list, or **By Topic** for grouped access.

> **Future Note:**  
> Add section-wise direct links for easier navigation to each doc section.