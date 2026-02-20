# Authentication Server Platform :shield:

A full-stack authentication and session-governance platform built with **FastAPI + PostgreSQL + React (Vite)**. The system is designed for organizations that need strong control over user access, short-lived session security, and admin-grade operational visibility from a single product.

It combines identity workflows, JWT lifecycle control, anomaly-aware monitoring, and an administrative analytics dashboard into one integrated solution.

## :dart: Executive Summary

This project functions as a centralized **Identity, Access, and Session Control** product. The backend enforces credential-based access and session validity, while the frontend gives administrators operational control over users and login behavior.

At a practical level, the platform is suitable for internal enterprise tools, controlled operations environments, and security-sensitive deployments where session revocation, user blocking, and login intelligence are required.

Key outcomes delivered by the product:

- A controlled user onboarding and login pipeline
- Session trust anchored in database-backed JWT revocation checks
- Admin-level controls for account state and session governance
- Analytics to inspect login patterns and detect suspicious usage
- Optional endpoint lockdown agent for managed Linux systems
- Real-time session monitoring through dashboard-fed API polling
- Login time and logout time visibility via session history endpoints
- Extensible Linux endpoint telemetry channel for host/network activity reporting

## :sparkles: Product Capabilities

### Identity and Authentication

The authentication layer provides secure account registration and credential verification using bcrypt password hashing. Credentials are never stored in plaintext, and login always returns a signed JWT token with a strict expiration window.

Core capabilities:

- User registration with profile metadata fields
- Username availability checks
- Password hashing and verification via bcrypt
- JWT generation on successful login
- User logout with server-side session revocation

### JWT Session Governance

Unlike stateless-only JWT implementations, this platform keeps session records in the database and validates active state per request. This enables immediate revocation without waiting for token expiry.

Session governance includes:

- Persistent `jti` per login session
- Active/inactive session state tracking
- Revocation via user logout and admin action
- Session history retrieval for users and admins
- 15-minute token expiry model enforced at token level

### Administrative Control Plane

Administrators can inspect users, update user metadata, block/unblock access, and revoke specific sessions. The admin API layer is built for operational speed and incident response workflows.

Admin controls include:

- Admin authentication endpoints
- Full user listing with role and block-state visibility
- User attribute updates (rank, department, name, age)
- Account block/unblock actions
- Paginated JWT session inventory
- Session-specific revocation endpoint
- User profile analytics and aggregate user stats endpoints

### Security Monitoring and Anomaly Tracking

The platform records anomaly events when concurrent login behavior is detected within the active session window. This enables the dashboard to surface suspicious access patterns for manual investigation.

Monitoring features:

- Concurrent-login anomaly logging
- Timestamped anomaly feed endpoint
- Dashboard polling integration for alert visibility

### Real-Time Session Monitoring and Reporting

Session monitoring is an operational first-class feature. Admin operators can inspect active/revoked JWT sessions, correlate user state, and track authentication timelines through dashboard views backed by API pagination.

Monitoring and reporting coverage includes:

- Near real-time dashboard refresh using repeated API pulls
- Session table views with `created_at` and `is_active` state
- User profile timelines that expose recent login and logout indicators
- Centralized revocation actions with immediate operational feedback
- Historical session insights for user behavior investigation

### Linux Endpoint Telemetry (Registered Host Model)

When Linux systems are registered to the server-side control model, each endpoint can be represented as a managed node that reports runtime telemetry to admin services. The current repo already includes the control-loop agent foundation (`static/client_agent.py`) and can be extended to include deeper host/network telemetry.

Telemetry scope you can surface in admin reports:

- Host identity and registration metadata (hostname, username, OS)
- Session-level activity (login windows, active state, forced lock events)
- File transfer metadata (download/share event summaries)
- Packet/network summaries (top destinations, protocol counts, byte volume)
- Process/file audit summaries from the endpoint

### Admin Dashboard Analytics

The React dashboard provides operational metrics and visual telemetry over login/session behavior. It is intended for security and admin operators, not only developers.

Analytics experience includes:

- KPI cards (users, blocked users, admins, active sessions)
- Weekly and monthly login trend visualizations
- Session-health and user-distribution views
- Hourly activity heatmap
- Profile-level behavior view per user
- Paginated JWT session management table

### Endpoint Lockdown Agent

The optional Linux agent can enforce endpoint-level lock/unlock behavior by polling account block status from the server. This is useful for controlled environments where account state should directly affect local machine access.

Agent behavior:

- Polls `/api/client-status`
- On blocked status, disables display manager + TTY services
- On unblocked status, restores services
- Can be installed as a persistent systemd unit

## :hammer_and_wrench: Tech Stack

This product has a core stack and an extension stack for deep monitoring workloads.

### Core stack in this repository

- Backend API: `FastAPI`, `SQLAlchemy Async`, `python-jose`, `bcrypt`
- Data store: `PostgreSQL` (`asyncpg`, `psycopg2-binary`)
- Frontend: `React 18`, `Vite`, `MUI`, `Nivo`
- Agent/control scripts: `Python`, `systemd`, shell automation

### Monitoring extension stack for deep telemetry

- Host metrics/process data: `psutil`
- Packet inspection/flow summaries: `pyshark` or `scapy`
- Linux audit events: `auditd` integration
- Endpoint inventory/process/file visibility: `osquery`
- Stream transport to backend: HTTPS JSON events or message queue

## :triangular_ruler: Architecture

The system is split into backend API, database, admin frontend, and optional endpoint agent. Backend is the policy authority; database is the source of truth for users/sessions/anomalies; dashboard is the operator UI.

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

Component responsibilities:

- Backend (`main.py`): auth, session checks, admin operations, stats
- Data layer (`models.py`, `database.py`): schema + async persistence
- Frontend (`admin-dashboard/`): admin workflow UX
- Agent (`static/client_agent.py`): endpoint enforcement loop

## :open_file_folder: Repository Layout

The repository keeps backend, frontend, and operational scripts in one workspace, making deployment and maintenance straightforward.

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
|   `-- setup_client.sh
`-- admin-dashboard/
    |-- package.json
    |-- vite.config.js
    |-- src/
    `-- public/
```

Important working paths:

- API entrypoint: `main.py`
- Models: `models.py`
- Dashboard app root: `admin-dashboard/src`
- Client agent setup: `static/setup_client.sh`

## :card_file_box: Data Model

The data model is centered around `users`, with related session and anomaly entities. A single user can own many JWT sessions and many anomaly entries.

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

### users

Stores identity, credential hash, authorization flags, and optional profile metadata.

| Field | Type | Notes |
|---|---|---|
| id | int | PK |
| username | string | Unique |
| password_hash | string | bcrypt hash |
| is_admin | bool | role flag |
| is_blocked | bool | access lock flag |
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

### jwt_sessions

Stores session lifecycle state for each token issuance event.

| Field | Type | Notes |
|---|---|---|
| id | int | PK |
| user_id | int | FK -> users.id |
| jti | string | unique session id |
| created_at | datetime | issuance time |
| is_active | bool | revocation state |

### grid_sessions

Keeps grid challenge state for the grid auth module (currently retained in model layer).

| Field | Type | Notes |
|---|---|---|
| id | int | PK |
| user_id | int | FK -> users.id |
| grid_data | string | serialized grid |
| grid_signature | string | HMAC signature |
| created_at | datetime | timestamp |
| is_active | bool | state flag |

### anomaly_logs

Captures security-relevant events for admin review and alerting.

| Field | Type | Notes |
|---|---|---|
| id | int | PK |
| user_id | int | FK -> users.id |
| description | string | event explanation |
| created_at | datetime | log timestamp |

## :link: API Reference

The API is organized into public/user routes and admin routes. Protected routes rely on bearer token auth and DB-backed session validity checks.

### Public and User Routes

- `GET /` - service health message
- `GET /api/client-status?username=<name>` - account block status for agent
- `GET /api/check-username?username=<name>` - username existence probe
- `POST /register` - new user registration
- `POST /login` - user login and JWT issuance
- `POST /logout` - revoke current JWT session
- `POST /logout-debug` - debug token decode helper
- `GET /user/jwt-sessions` - authenticated user session list

### Admin Routes

- `POST /admin/login` - admin authentication
- `POST /admin/logout` - admin session revoke
- `GET /admin/anomalies` - anomaly feed
- `GET /admin/users` - full user list
- `GET /admin/jwt-sessions?skip=<n>&limit=<n>` - paginated sessions
- `POST /admin/update-user` - update selected user fields
- `POST /admin/block-user` - block/unblock user
- `POST /admin/jwt-sessions/{session_id}/revoke` - revoke by session id
- `GET /admin/user-stats` - active/inactive user summary
- `GET /admin/user-profile/{user_id}` - profile and session activity

Suggested telemetry APIs for extended monitoring surface:

- `POST /agent/register` - register Linux endpoint with identity metadata
- `POST /agent/heartbeat` - periodic host status update
- `POST /agent/telemetry/network` - packet/flow aggregate reports
- `POST /agent/telemetry/files` - download/share event summaries
- `GET /admin/endpoints` - endpoint inventory and health
- `GET /admin/reports/activity` - consolidated user and endpoint reports

## :page_facing_up: Monitoring Code Patterns

Below are implementation-ready patterns you can add so the admin dashboard receives the exact telemetry you described.

### 1) Backend telemetry model example

```python
# models_telemetry.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from models import Base

class EndpointTelemetry(Base):
    __tablename__ = "endpoint_telemetry"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    hostname = Column(String, nullable=False)
    event_type = Column(String, nullable=False)  # packet_summary, file_share, download
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

### 2) Backend ingestion endpoint example

```python
# main.py (example extension)
from pydantic import BaseModel
from sqlalchemy import select
from models import User

class TelemetryIn(BaseModel):
    username: str
    hostname: str
    event_type: str
    payload: dict

@app.post("/agent/telemetry")
async def ingest_telemetry(body: TelemetryIn):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.username == body.username))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        session.add(EndpointTelemetry(
            user_id=user.id,
            hostname=body.hostname,
            event_type=body.event_type,
            payload=body.payload
        ))
        await session.commit()
    return {"message": "telemetry accepted"}
```

### 3) Linux agent packet summary pattern

```python
# agent_network_summary.py (example extension)
import socket
import psutil
import requests

API = "http://localhost:8000/agent/telemetry"
USERNAME = "registered_user"

def summarize_network():
    net = psutil.net_io_counters()
    return {
        "bytes_sent": net.bytes_sent,
        "bytes_recv": net.bytes_recv,
        "packets_sent": net.packets_sent,
        "packets_recv": net.packets_recv,
    }

def push():
    requests.post(API, json={
        "username": USERNAME,
        "hostname": socket.gethostname(),
        "event_type": "packet_summary",
        "payload": summarize_network(),
    }, timeout=10)
```

### 4) Admin report query pattern

```python
# report example (extension)
@app.get("/admin/reports/activity")
async def activity_report(limit: int = 200):
    async with async_session() as session:
        rows = await session.execute(
            select(EndpointTelemetry).order_by(EndpointTelemetry.created_at.desc()).limit(limit)
        )
        return [r.__dict__ for r in rows.scalars().all()]
```

## :key: Auth and Session Lifecycle

Session trust is established through two checks: JWT cryptographic validity and active session state in the database.

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

Lifecycle guarantees:

- Revoked sessions fail immediately even before JWT expiry
- Expired tokens fail even if DB row is active
- Admin revocation can terminate sessions centrally

## :bar_chart: JWT Session Pie (Data-Driven)

JWT pie segmentation should always be calculated from real `/admin/jwt-sessions` API results.

State definitions used for charting:

- `Active`: `is_active == true` and `created_at` is within last 15 minutes
- `Expired`: `is_active == true` and `created_at` is older than 15 minutes
- `Revoked`: `is_active == false`

Reference calculation:

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

## :desktop_computer: Admin Dashboard Coverage

The admin app is the operations console for this product and is implemented in `admin-dashboard/src`. It combines user governance, session control, and visual analytics in one workflow.

Primary page modules:

- `DashboardPage.jsx` - KPIs + recent session insights
- `UsersPage.jsx` - user table with filters and block actions
- `UserProfilePage.jsx` - user-specific charts and activity table
- `AllJwtSessionsPage.jsx` - paginated JWT session management
- `AnalyticsPage.jsx` - trend and heatmap analytics

Core integration files:

- `api/AdminServices.js` - API service layer
- `hooks/useAdmin.jsx` - state, data fetching, and actions

## :robot: Client Agent Flow

The optional client agent is for environments where account state should directly influence local machine access. It continuously polls backend block status and applies system-level service toggles.

```mermaid
flowchart TD
    P[Poll /api/client-status] --> D{is_blocked}
    D -->|true| B[Disable gdm3 + tty1..tty6]
    D -->|false| U[Enable gdm3 + tty1..tty6]
    B --> W[Sleep 15 sec]
    U --> W
    W --> P
```

Operational notes:

- Requires Linux/systemd context
- Uses privileged systemctl operations
- Must be deployed carefully in controlled environments

## :gear: Environment Variables

The backend and frontend rely on a small, clear env set.

Required backend values:

- `DATABASE_URL`
- `SECRET_KEY`

Frontend/API endpoint values:

- `VITE_API_URL`
- `REACT_APP_API_URL` (compatibility fallback)

Example:

```env
DATABASE_URL=postgresql+asyncpg://auth_admin:admin_pass@localhost/auth_server
SECRET_KEY=change_this_to_a_long_random_secret
VITE_API_URL=http://localhost:8000
```

## :wrench: Local Setup

### Backend Setup

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

### Frontend Setup

```bash
cd admin-dashboard
npm install
npm run dev
```

Development notes:

- Vite server is configured for port `3000`
- CORS origins in backend currently include localhost dashboard ports
- Ensure `.env` is present before starting API

## :toolbox: Operations Scripts

This repo includes direct operational helpers for deployment and account lifecycle tasks.

- `setup.sh`: installs Python/Node/PostgreSQL and project dependencies
- `init_db.py`: creates all tables from SQLAlchemy metadata
- `reset_db.py`: drops and recreates the schema
- `make_admin.py`: creates or promotes an admin account
- `reset_admin.py`: direct admin password reset via PostgreSQL
- `static/setup_client.sh`: installs and enables client agent service

## :lock: Security Notes

The current design follows strong baseline practices and can be hardened further for enterprise deployment.

Current protections:

- bcrypt password hashing
- JWT expiry enforcement
- DB-backed token revocation checks
- Admin-only control operations
- anomaly visibility for concurrent login behavior

Hardening recommendations:

- rotate and protect secrets outside repo
- add rate limiting and IP throttling
- add audit trails for all admin mutations
- integrate structured logs + centralized monitoring

## :mag: Troubleshooting

### Push rejected (`fetch first`)

```bash
git fetch origin main
git merge origin/main --allow-unrelated-histories
git push -u origin main
```

### 401 errors on protected routes

- Verify `Authorization: Bearer <token>` header
- Confirm token age is within 15-minute expiry
- Confirm session was not revoked in DB

### Database connection failures

- Re-check `DATABASE_URL`
- Verify PostgreSQL service and credentials
- Run `python init_db.py` after schema-level changes

### CORS issues in dashboard

- Confirm dashboard URL is present in backend `origins`
- Ensure frontend API URL points to running backend

---

Authentication Server Platform is a serious foundation for secure access control, session governance, and admin-led security operations at scale. :rocket:
