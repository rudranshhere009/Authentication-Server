# ?? Authentication Server Platform

A full-stack authentication and session-governance platform built with **FastAPI + PostgreSQL + React (Vite)**.

It provides secure login, JWT session lifecycle management, admin analytics, anomaly visibility, and optional endpoint-driven client lockdown automation.

## ? Product Vision

This project is designed as a central **Identity + Session Control Plane** for internal organizations that need:

- ? Fast user onboarding and credential auth
- ? JWT-based short-lived sessions with revocation
- ? Admin-level visibility over all active/inactive sessions
- ? User-level controls (block/unblock)
- ? Concurrent-login anomaly tracking
- ? Operational tooling for provisioning and recovery
- ? Dashboard-first observability for security teams

## ?? Table of Contents

- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Core Capabilities](#-core-capabilities)
- [Repository Structure](#-repository-structure)
- [Data Model](#-data-model)
- [API Surface](#-api-surface)
- [Auth and Session Flow](#-auth-and-session-flow)
- [Admin Dashboard](#-admin-dashboard)
- [Client Agent Lock/Unlock Flow](#-client-agent-lockunlock-flow)
- [Environment Variables](#-environment-variables)
- [Local Development Setup](#-local-development-setup)
- [Operations Scripts](#-operations-scripts)
- [Security Model](#-security-model)
- [Scalability Playbook](#-scalability-playbook)
- [Troubleshooting](#-troubleshooting)
- [Known Gaps and Hardening Notes](#-known-gaps-and-hardening-notes)
- [Roadmap](#-roadmap)

## ?? Architecture

```mermaid
flowchart LR
    U[Users] -->|Login/Register| API[FastAPI Auth Server]
    A[Admin Dashboard] -->|Admin APIs| API
    API --> DB[(PostgreSQL)]
    API --> SESS[(JWT Sessions)]
    API --> ANOM[(Anomaly Logs)]
    C[Client Agent] -->|Poll /api/client-status| API
    API -->|is_blocked| C
```

### Service Layers

- **API Layer (`main.py`)**: authentication, admin controls, session retrieval, anomaly APIs.
- **Data Layer (`models.py`, `database.py`)**: async SQLAlchemy + PostgreSQL.
- **Security Layer (`auth_utils.py`)**: bcrypt hashing + JWT validation/revocation checks.
- **Operations Layer (`setup.sh`, `init_db.py`, `reset_db.py`, admin scripts)**.
- **Presentation Layer (`admin-dashboard`)**: React dashboard for ops/security workflows.

## ?? Tech Stack

### Backend

- **Python + FastAPI**
- **SQLAlchemy (Async)**
- **PostgreSQL** (`asyncpg`, `psycopg2-binary`)
- **python-jose** (JWT)
- **bcrypt** (password hashing)
- **python-dotenv**

### Frontend

- **React 18 + Vite**
- **MUI (Material UI)**
- **Nivo** charts (`line`, `bar`, `pie`, `heatmap`)
- **React Router**

## ?? Core Capabilities

- ?? User registration and login
- ?? JWT token issuance with 15-minute expiry
- ?? JWT session persistence (`jti`, active flag)
- ?? Session revocation (user/admin)
- ?? User block/unblock controls
- ??? Concurrent-login anomaly detection/logging
- ?? Admin dashboard with session and user analytics
- ?? Optional Linux client-agent based lock/unlock enforcement

## ?? Repository Structure

```text
authserver-main/
+-- main.py                     # FastAPI app and all API routes
+-- models.py                   # SQLAlchemy models (users, sessions, anomalies)
+-- database.py                 # Async DB engine/session factory
+-- auth_utils.py               # Password hashing and verification
+-- grid_utils.py               # Grid generation/sign helpers (legacy/disabled route usage)
+-- geo_utils.py                # GeoIP lookup helper (not wired to current API path)
+-- init_db.py                  # Create database tables
+-- reset_db.py                 # Drop + recreate tables
+-- make_admin.py               # Promote/create admin user
+-- reset_admin.py              # Reset admin password (direct PostgreSQL)
+-- tty_client.py               # TTY client flow (legacy grid challenge flow)
+-- static/
¦   +-- client_agent.py         # Polling lock/unlock client agent
¦   +-- setup_client.sh         # Install agent as systemd service
+-- setup.sh                    # Linux bootstrap installer
+-- admin-dashboard/            # React admin application
```

## ?? Data Model

```mermaid
erDiagram
    USERS ||--o{ JWT_SESSIONS : has
    USERS ||--o{ GRID_SESSIONS : has
    USERS ||--o{ ANOMALY_LOGS : triggers

    USERS {
      int id PK
      string username UNIQUE
      string password_hash
      bool is_admin
      bool is_blocked
      string name
      int age
      string rank
      string department
      string contact_no
      datetime date_of_joining
      datetime dob
      string ip
      string location
      string address
    }

    JWT_SESSIONS {
      int id PK
      int user_id FK
      string jti UNIQUE
      datetime created_at
      bool is_active
    }

    GRID_SESSIONS {
      int id PK
      int user_id FK
      string grid_data
      string grid_signature
      datetime created_at
      bool is_active
    }

    ANOMALY_LOGS {
      int id PK
      int user_id FK
      string description
      datetime created_at
    }
```

## ?? API Surface

All routes are implemented in `main.py`.

### Public/User APIs

- `GET /` - health/info message
- `GET /api/client-status?username=...` - current block status for client agent
- `GET /api/check-username?username=...` - username existence check
- `POST /register` - create user profile + credentials
- `POST /login` - login and issue JWT token
- `POST /logout` - revoke current JWT session
- `POST /logout-debug` - decode/debug token payload
- `GET /user/jwt-sessions` - list current user sessions (auth required)

### Admin APIs

- `POST /admin/login` - admin login JWT
- `POST /admin/logout` - admin logout/revoke own token
- `GET /admin/users` - list users
- `POST /admin/update-user` - update user metadata
- `POST /admin/block-user` - block/unblock account
- `GET /admin/jwt-sessions?skip=&limit=` - paginated JWT sessions
- `POST /admin/jwt-sessions/{session_id}/revoke` - revoke session by id
- `GET /admin/user-stats` - active/inactive summary
- `GET /admin/user-profile/{user_id}` - profile + activity/session logs
- `GET /admin/anomalies` - anomaly event feed

### Legacy/Commented API Paths

- Grid MFA endpoints (`/grid-challenge`, `/grid-validate`) exist as commented blocks and are not active.

## ?? Auth and Session Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as FastAPI
    participant DB as PostgreSQL

    Client->>API: POST /login (username/password)
    API->>DB: Validate user + hash check
    API->>DB: Insert JWT session (jti, is_active=true)
    API-->>Client: access_token (exp=15m)

    Client->>API: Protected request + Bearer token
    API->>API: Decode JWT (sub + jti)
    API->>DB: Verify jti is active
    DB-->>API: Session valid
    API-->>Client: Data

    Client->>API: POST /logout
    API->>DB: Mark jti is_active=false
    API-->>Client: Logged out
```

### Session State Composition

```mermaid
pie showData
    title JWT Session Health (Conceptual)
    "Active + Valid" : 60
    "Expired (15m window)" : 25
    "Revoked" : 15
```

## ?? Admin Dashboard

Admin app path: `admin-dashboard/`

### Main Pages

- ?? Dashboard (`/`): KPIs, recent JWT sessions, session health, user distribution, weekly/monthly trends
- ?? Users (`/users`): searchable/filterable user list, block/unblock controls
- ?? User Profile (`/users/:userId`): per-user charts + recent activity table
- ?? JWT Sessions (`/jwt-sessions`): paginated session table and revoke action
- ?? Analytics (`/analytics`): monthly trends, weekly trends, heatmap, engagement summaries

### Dashboard KPIs

- Total users
- Active users
- Active sessions
- Blocked users
- Admin users
- Total JWT sessions

## ?? Client Agent Lock/Unlock Flow

`static/client_agent.py` implements periodic polling (`/api/client-status`) and can:

- disable display manager and TTY services when user is blocked
- re-enable services when unblocked

Install helper: `static/setup_client.sh`

```mermaid
flowchart TD
    AG[Client Agent] --> POLL[Poll /api/client-status]
    POLL --> DEC{is_blocked?}
    DEC -->|Yes| BLK[Disable gdm3 + tty1..tty6]
    DEC -->|No| UNBLK[Enable gdm3 + tty1..tty6]
    BLK --> WAIT[Sleep 15s]
    UNBLK --> WAIT
    WAIT --> POLL
```

## ?? Environment Variables

Current backend/frontend env usage:

- `DATABASE_URL` - async SQLAlchemy database connection string
- `SECRET_KEY` - JWT signing key
- `VITE_API_URL` - frontend API base URL (also used by `tty_client.py` fallback chain)
- `REACT_APP_API_URL` - compatibility fallback for API base URL

Recommended `.env` template:

```env
DATABASE_URL=postgresql+asyncpg://postgres:change_me@localhost/auth_server
SECRET_KEY=change_me_to_a_long_random_value
VITE_API_URL=http://localhost:8000
```

## ?? Local Development Setup

### 1. Backend setup

```bash
python -m venv venv
# Linux/macOS
source venv/bin/activate
# Windows PowerShell
venv\Scripts\Activate.ps1

pip install --upgrade pip
pip install -r requirements.txt
```

### 2. Configure environment

Create `.env` in project root with your values.

### 3. Initialize DB

```bash
python init_db.py
```

### 4. Run API

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Run dashboard

```bash
cd admin-dashboard
npm install
npm run dev
```

Dashboard serves on `http://localhost:3000` (see `admin-dashboard/vite.config.js`).

## ?? Operations Scripts

- `setup.sh`: Linux bootstrap for Python, Node, PostgreSQL, dependencies
- `init_db.py`: create tables from SQLAlchemy metadata
- `reset_db.py`: drop and recreate all tables
- `make_admin.py <username> <password>`: promote/create admin
- `reset_admin.py`: direct DB-based admin password reset utility
- `static/setup_client.sh`: deploy lock agent as systemd service

## ?? Security Model

- Passwords are hashed using bcrypt (`auth_utils.py`)
- JWT tokens include `sub`, `jti`, and `exp`
- Protected endpoints validate both token integrity and active session state
- Logout revokes active session server-side
- Admin controls can revoke any JWT session and block users
- Concurrent active session windows can trigger anomaly logs

## ?? Scalability Playbook

For product-scale deployment, recommended upgrades:

- Run API under multiple workers (`gunicorn + uvicorn workers`)
- Put Nginx/Traefik in front for TLS + routing
- Move from polling to event-driven updates (WebSocket/Redis pub-sub)
- Add Redis for session/anomaly cache and rate limiting
- Add DB indexing strategy for `jwt_sessions(user_id, created_at, is_active)`
- Add structured logs + tracing (OpenTelemetry)
- Add CI checks for lint, type validation, and API contract tests

## ?? Suggested API Smoke Tests

- Register user -> login -> fetch `/user/jwt-sessions` -> logout
- Admin login -> fetch `/admin/users` and `/admin/jwt-sessions`
- Block user -> verify `/api/client-status` returns blocked
- Revoke active session -> verify protected call fails

## ?? Troubleshooting

### Push rejected with `fetch first`

```bash
git fetch origin main
git merge origin/main --allow-unrelated-histories
git push -u origin main
```

### `401 Invalid token`

- Ensure `Authorization: Bearer <token>` header is set
- Ensure token is not expired (15 min)
- Ensure session was not revoked

### DB connection issues

- Verify `DATABASE_URL`
- Ensure PostgreSQL is running and DB exists
- Run `python init_db.py` after schema changes

### CORS problems

- Confirm frontend origin is listed in `origins` in `main.py`

## ? Known Gaps and Hardening Notes

- `main.py` references `broadcast_session_update()` but no implementation is present.
- `main.py` includes `pytz` usage in a helper without import.
- `tty_client.py` calls grid MFA endpoints currently commented out in backend.
- `geo_utils.py` has a machine-specific GeoIP DB path and is not integrated into active auth flow.
- Secrets should never be committed in plaintext `.env`; rotate values if exposed.

## ?? Roadmap

- [ ] Implement/restore production-ready Grid MFA flow
- [ ] Add refresh-token strategy and token rotation
- [ ] Role-based access policies beyond admin/non-admin
- [ ] Add audit trails for all admin actions
- [ ] Add pagination/search server-side for users
- [ ] Add automated tests (backend + frontend)
- [ ] Containerize with Docker Compose (API + DB + dashboard)
- [ ] Introduce CI/CD pipeline and deploy profiles

---

Built for scalable authentication operations with strong admin visibility, session control, and extensible security workflows. ??
