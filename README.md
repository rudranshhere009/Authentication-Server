# Authentication Server Platform :shield:

A production-oriented authentication and session-governance platform built with **FastAPI + PostgreSQL + React (Vite)**.

It is designed as a central control plane for secure user access, short-lived JWT session control, admin monitoring, anomaly detection, and optional endpoint lockdown automation.

## :dart: Executive Summary

This product provides two major surfaces:

1. **Core Auth API**
2. **Admin Security Dashboard**

Together they deliver:

- Secure user registration and login
- JWT issuance with server-side revocation control
- Real-time session visibility for admins
- User access governance (block/unblock)
- Concurrent login anomaly logging
- Operational scripts for bootstrap and lifecycle management
- Optional Linux client agent for enforced endpoint blocking

## :sparkles: Full Feature Set

### Authentication and Identity

- User registration with profile metadata
- Password hashing with bcrypt
- Credential login with JWT token return
- Username availability check API

### JWT Session Management

- Unique session IDs (`jti`) persisted in database
- Session validity requires:
  - token signature valid
  - token not expired
  - session record active in DB
- User logout revokes current session
- Admin can revoke any session
- User can view own JWT session history

### Admin Control Plane

- Admin login/logout
- List all users
- Update selected user fields
- Block/unblock user accounts
- Paginated JWT session explorer
- User-level analytics/profile endpoint
- Aggregate active/inactive user stats endpoint

### Security Monitoring

- Concurrent login anomaly detection
- Anomaly log feed endpoint for dashboard polling

### Dashboard Analytics (React)

- KPI cards (users, sessions, blocked, admins)
- Weekly login trend chart
- Monthly login trend chart
- Session health chart
- User distribution chart
- Hourly activity heatmap
- User profile analytics view

### Endpoint Lockdown Automation

- Client agent polls `/api/client-status`
- If blocked, disables display manager/TTY services (Linux)
- If unblocked, re-enables services
- Deployable as systemd service (`static/setup_client.sh`)

## :triangular_ruler: Architecture

```mermaid
flowchart LR
    User[End User] --> API[FastAPI Service]
    Admin[Admin Dashboard] --> API
    API --> DB[(PostgreSQL)]
    API --> JWT[(jwt_sessions)]
    API --> LOG[(anomaly_logs)]
    Agent[Linux Client Agent] -->|poll /api/client-status| API
    API -->|is_blocked true/false| Agent
```

## :open_file_folder: Repository Layout

```text
authserver-main/
|-- main.py
|-- models.py
|-- database.py
|-- auth_utils.py
|-- grid_utils.py
|-- geo_utils.py
|-- init_db.py
|-- reset_db.py
|-- make_admin.py
|-- reset_admin.py
|-- setup.sh
|-- tty_client.py
|-- static/
|   |-- client_agent.py
|   |-- setup_client.sh
`-- admin-dashboard/
    |-- package.json
    |-- vite.config.js
    |-- src/
    `-- public/
```

## :card_file_box: Data Model (Reliable Rendering)

### Entity Relationship Flow

```mermaid
flowchart TD
    U[users]
    JS[jwt_sessions]
    GS[grid_sessions]
    AL[anomaly_logs]

    U -->|1-to-many| JS
    U -->|1-to-many| GS
    U -->|1-to-many| AL
```

### `users`

| Field | Type | Notes |
|---|---|---|
| id | int | PK |
| username | string | Unique |
| password_hash | string | bcrypt hash |
| is_admin | bool | admin role flag |
| is_blocked | bool | lockout flag |
| name | string | optional |
| age | int | optional |
| rank | string | optional |
| department | string | optional |
| contact_no | string | optional |
| date_of_joining | datetime | optional |
| dob | datetime | optional |
| ip | string | optional |
| location | string | optional |
| address | string | optional |

### `jwt_sessions`

| Field | Type | Notes |
|---|---|---|
| id | int | PK |
| user_id | int | FK -> users.id |
| jti | string | unique token id |
| created_at | datetime | session creation time |
| is_active | bool | server-side revocation flag |

### `grid_sessions`

| Field | Type | Notes |
|---|---|---|
| id | int | PK |
| user_id | int | FK -> users.id |
| grid_data | string | JSON string grid payload |
| grid_signature | string | HMAC signature |
| created_at | datetime | created timestamp |
| is_active | bool | lifecycle flag |

### `anomaly_logs`

| Field | Type | Notes |
|---|---|---|
| id | int | PK |
| user_id | int | FK -> users.id |
| description | string | anomaly message |
| created_at | datetime | timestamp |

## :link: API Reference

### Public and User Routes

- `GET /`
- `GET /api/client-status?username=<name>`
- `GET /api/check-username?username=<name>`
- `POST /register`
- `POST /login`
- `POST /logout`
- `POST /logout-debug`
- `GET /user/jwt-sessions` (Bearer token required)

### Admin Routes

- `POST /admin/login`
- `POST /admin/logout`
- `GET /admin/anomalies`
- `GET /admin/users`
- `GET /admin/jwt-sessions?skip=<n>&limit=<n>`
- `POST /admin/update-user`
- `POST /admin/block-user`
- `POST /admin/jwt-sessions/{session_id}/revoke`
- `GET /admin/user-stats`
- `GET /admin/user-profile/{user_id}`

## :key: Auth and Session Lifecycle

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant D as DB

    C->>A: POST /login (username, password)
    A->>D: validate user + hash check
    A->>D: insert jwt_sessions row (jti, is_active=true)
    A-->>C: JWT access_token (exp=15m)

    C->>A: protected request + Bearer token
    A->>A: decode JWT (sub, jti)
    A->>D: find active session by jti
    D-->>A: session exists
    A-->>C: success

    C->>A: POST /logout
    A->>D: set is_active=false for jti
    A-->>C: logged out
```

## :bar_chart: JWT Session Pie (Real Logic, Not Conceptual)

The pie chart must always be computed from **real API data** from `/admin/jwt-sessions`.

Classification rules used by backend logic:

- `Active`: `is_active == true` and `created_at` within last 15 minutes
- `Expired`: `is_active == true` and `created_at` older than 15 minutes
- `Revoked`: `is_active == false`

### Real-time calculation example (frontend)

```js
const now = Date.now();
const FIFTEEN_MIN = 15 * 60 * 1000;

const counts = sessions.reduce(
  (acc, s) => {
    const age = now - new Date(s.created_at).getTime();
    if (s.is_active && age <= FIFTEEN_MIN) acc.active += 1;
    else if (s.is_active && age > FIFTEEN_MIN) acc.expired += 1;
    else acc.revoked += 1;
    return acc;
  },
  { active: 0, expired: 0, revoked: 0 }
);
```

This ensures the pie is data-driven and environment-specific, not static.

## :desktop_computer: Admin Dashboard Coverage

Primary pages in `admin-dashboard/src/Pages`:

- `DashboardPage.jsx`
- `UsersPage.jsx`
- `UserProfilePage.jsx`
- `AllJwtSessionsPage.jsx`
- `AnalyticsPage.jsx`

Core frontend service/hooks:

- `admin-dashboard/src/api/AdminServices.js`
- `admin-dashboard/src/hooks/useAdmin.jsx`

## :robot: Client Agent Flow

```mermaid
flowchart TD
    P[Poll /api/client-status] --> D{is_blocked}
    D -->|true| B[Disable gdm3 + tty1..tty6]
    D -->|false| U[Enable gdm3 + tty1..tty6]
    B --> W[Sleep 15 sec]
    U --> W
    W --> P
```

## :gear: Environment Variables

Required variables:

- `DATABASE_URL`
- `SECRET_KEY`

Optional but useful:

- `VITE_API_URL`
- `REACT_APP_API_URL`

Example:

```env
DATABASE_URL=postgresql+asyncpg://auth_admin:admin_pass@localhost/auth_server
SECRET_KEY=change_this_to_a_long_random_secret
VITE_API_URL=http://localhost:8000
```

## :wrench: Local Setup

### Backend

```bash
python -m venv venv
# Linux/macOS
source venv/bin/activate
# Windows PowerShell
venv\Scripts\Activate.ps1

pip install --upgrade pip
pip install -r requirements.txt
python init_db.py
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

```bash
cd admin-dashboard
npm install
npm run dev
```

Vite config currently serves dashboard on port `3000`.

## :toolbox: Operations Scripts

- `setup.sh` - Linux dependency/bootstrap automation
- `init_db.py` - create schema
- `reset_db.py` - drop and recreate schema
- `make_admin.py` - create/promote admin account
- `reset_admin.py` - reset admin password directly in PostgreSQL
- `static/setup_client.sh` - deploy and enable client agent service

## :lock: Security Notes

- Passwords are stored as bcrypt hashes
- Session revocation is enforced in DB
- JWT expiry is set to 15 minutes
- Admin controls allow rapid incident response (revoke, block)
- Do not commit sensitive `.env` secrets

## :chart_with_upwards_trend: Scalability Guidance

To scale this as a larger product:

1. Add API worker scaling (`gunicorn` + uvicorn workers)
2. Use reverse proxy with TLS (Nginx/Traefik)
3. Add Redis for caching/session telemetry fanout
4. Add rate limiting and audit logging
5. Add CI/CD and automated tests
6. Add containerized deployment (API + DB + dashboard)

## :memo: Project Status and Next Expansion

Current project is already strong as a centralized auth/session control platform.

High-impact next additions:

- refresh token rotation
- role-based access controls beyond admin flag
- complete Grid MFA route activation
- full anomaly notification channel (push/WebSocket)
- production-grade observability (metrics + traces)

---

This repository represents a serious, scalable foundation for identity access control, security operations, and centralized session governance. :rocket:
