
# Contributing to Vibera

Thank you for contributing to **Vibera** 💜  
This document defines how we collaborate, write code, and ship safely.

Please read this carefully before contributing.

---

## General Principles

- **Never push directly to `main`**
- All changes must go through **Pull Requests**
- Keep changes **small, atomic, and reviewable**
- Follow existing patterns and conventions
- Ask questions early if anything is unclear

---

## Branching Strategy

### Protected Branches

- `main`  
  Production-ready and always stable

- `develop` (optional)  
  Integration branch if needed later

---

### Branch Naming Convention

Use the following format:

```

<type>/<short-description>

```

#### Allowed Types

- `feature` – New features
- `fix` – Bug fixes
- `chore` – Tooling, setup, cleanup
- `refactor` – Code refactors (no behavior change)
- `docs` – Documentation only

#### Examples

```

feature/mood-logging-api
fix/login-token-refresh
chore/setup-eslint
docs/update-contribution-guide

```

---

## Pull Requests (PRs)

### Before Opening a PR

- Branch is up to date with `main`
- Code builds and runs locally
- No commented-out code
- No debug logs left behind

---

### PR Title Format

```

[Type] Short, clear description

```

**Examples:**
- `[Feature] Add mood logging endpoint`
- `[Fix] Resolve token refresh loop`
- `[Chore] Configure CORS`

---

### PR Description Requirements

Every PR **must include**:

#### What
Explain what was changed.

#### Why
Explain why the change was necessary.

#### How to Test
Explain how reviewers can verify the change.

**Example:**

```

What:
Added API endpoint to log daily mood entries.

Why:
Required for MVP journaling feature.

How to Test:
POST /api/v1/moods with a valid JWT token.

```

---

### PR Size Guidelines

- Prefer **small PRs**
- One PR = one responsibility
- If a PR feels too large, split it

---

## Code Review Process

- At least **one reviewer approval** is required
- Address all review comments before merging
- Do not self-merge unless explicitly allowed
- Reviews focus on:
  - Code clarity
  - Security
  - Edge cases
  - Naming and structure

---

## Commit Message Guidelines

### Commit Message Format

```

<type>: short, present-tense description

```

#### Allowed Types

- `feat` – New feature
- `fix` – Bug fix
- `chore` – Tooling or setup
- `refactor` – Code refactor
- `docs` – Documentation

#### Examples

```

feat: add mood model
fix: prevent duplicate mood entries
chore: configure django rest framework
refactor: simplify auth middleware
docs: update api readme

```

---

### Commit Rules

- One logical change per commit
- Avoid vague commit messages such as:
  - `update stuff`
  - `fix issue`
- Commits should clearly describe the change

---

## What Not to Do

- Do **not** push directly to `main`
- Do **not** commit secrets or `.env` files
- Do **not** mix frontend and backend changes in one PR unless necessary
- Do **not** ignore failing checks

---

## Frontend Guidelines (Next.js)

- Use functional components
- Prefer server components where appropriate
- Keep components small and reusable
- Avoid inline styles unless necessary
- Maintain consistent naming and structure

---

## Backend Guidelines (Django)

- Follow Django REST Framework best practices
- Keep views thin; move logic to services when possible
- Validate all input data
- Use serializers properly
- Handle migrations carefully

---

## Security & Quality

- Never expose sensitive data in responses
- Validate permissions on all protected endpoints
- Consider edge cases
- Prefer explicit logic over implicit behavior

---

## Communication

- Communicate early if blocked
- Ask before making assumptions
- Respect code reviews — feedback is about the code, not the person

---

## Final Checklist Before Merging

- [ ] Code runs locally
- [ ] PR description is complete
- [ ] No secrets committed
- [ ] Conventions followed
- [ ] Reviewer approval obtained

---

Happy building 🚀  
**— Vibera Team**
