# Deployment

## Purpose of this document

This document gives a high-level overview of how Vibera is run and deployed. It describes supported environments, Docker usage, CI/CD, and how configuration and secrets are managed. It does not provide step-by-step runbooks or infrastructure specifics.

---

## Supported environments

**Local (development)** — Runs on your machine. The backend uses SQLite or a local PostgreSQL container; the frontend talks to the backend via a configurable API URL. Used for day-to-day development and testing.

**Staging** — A mirror of production used to validate changes before release. Typically uses the same stack as production (e.g. PostgreSQL, same env structure) but with separate data and non-production secrets.

**Production** — The live environment serving real users. Backend and frontend are deployed to appropriate hosts; the database is PostgreSQL. Configuration, secrets, and scaling follow production standards.

---
