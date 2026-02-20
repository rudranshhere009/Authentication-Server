
from collections import Counter


import os
import json
import random
import requests 
import uuid
from datetime import datetime, timedelta, timezone, date
from typing import List




from fastapi import FastAPI, HTTPException, Request, Depends, Path, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from dotenv import load_dotenv

from database import async_session
from models import User, GridSession, JwtSession, AnomalyLog
from auth_utils import hash_password, verify_password
from grid_utils import generate_grid, sign_grid, verify_grid

from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

# Load environment variables
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

app = FastAPI()
#pagination logic 
from typing import Generic, TypeVar, List
from pydantic.generics import GenericModel

T = TypeVar("T")
IST = timezone(timedelta(hours=5, minutes=30))

origins = [
    "http://localhost:3000" , 
    "http://localhost:5173"
]


class PaginatedResponse(GenericModel, Generic[T]):
    total: int
    skip: int
    limit: int
    data: List[T]


# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  #   (jas) For development only; restrict in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files
if not os.path.exists("static"):
    os.makedirs("static")
app.mount("/static", StaticFiles(directory="static"), name="static")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# ---------------------------
# Pydantic Schemas
# ---------------------------
class UserCreate(BaseModel):
    username: str 
    password: str
    name: str | None = None
    age: int | None = None
    rank: str | None = None
    contact_no: str | None = None
    date_of_joining: date | None = None
    dob: date | None = None
    ip: str | None = None
    location: str | None = None
    department: str | None = None
    address: str | None = None

# --- Input for login ---
class UserLogin(BaseModel):
    username: str
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str

# --- Output user info ---
class UserOut(BaseModel):
    id: int   # 👈 back to 'id' to match users.id
    username: str
    name: str | None = None
    age: int | None = None
    rank: str | None = None
    contact_no: str | None = None
    date_of_joining: date | None = None
    dob: date | None = None
    ip: str | None = None
    location: str | None = None
    department: str | None = None
    address: str | None = None
    is_admin: bool
    is_blocked: bool = False

    class Config:
        orm_mode = True

# --- For sessions ---
class SessionOut(BaseModel):
    id: int          # PK of session table
    user_id: int     # FK to users.id
    username: str
    created_at: str
    is_active: bool

class UserBlockRequest(BaseModel):
    username: str
    block: bool

class UserSessionOut(BaseModel):
    id: int        # PK of session
    user_id: int   # FK to users.id
    created_at: str
    is_active: bool

# --- JWT SESSION TRACKING ---
class JwtSessionOut(BaseModel):
    id: int
    username: str
    created_at: str
    is_active: bool


# ---------------------------
# JWT Auth Helper
# ---------------------------
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        jti = payload.get("jti")
        if user_id is None or jti is None:
            raise credentials_exception
        user_id = int(user_id)  # <-- FIX: cast to int for DB query
    except JWTError:
        raise credentials_exception

    async with async_session() as session:
        result = await session.execute(
            select(JwtSession).where(JwtSession.jti == jti, JwtSession.is_active == True)
        )
        jwt_session = result.scalar_one_or_none()
        if not jwt_session:
            raise HTTPException(status_code=401, detail="Session revoked or expired")

        result = await session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise credentials_exception
        return user

# ---------------------------
# Endpoints
# ---------------------------


@app.get("/")
async def root():
    return {"message": "Grid Auth Server is running!"}

# Endpoint for client agent to check block status
from database import async_session
from models import User
from sqlalchemy.future import select

@app.get("/api/client-status")
async def client_status(username: str):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.username == username))
        user = result.scalar_one_or_none()
        if not user:
            return {"error": "User not found", "is_blocked": False}
        return {"is_blocked": getattr(user, "is_blocked", False)}

@app.post("/register")
async def register(user: UserCreate):
    print("Received registration data:", user.dict())  # Debug print
    async with async_session() as session:
        async with session.begin():
            new_user = User(
                # User identity fields
                username=user.username,
                password_hash=hash_password(user.password),
                
                # Personal information
                name=user.name,
                age=user.age,
                dob=user.dob,
                
                # Professional information
                rank=user.rank,
                department=user.department,
                date_of_joining=user.date_of_joining,
                
                # Contact information
                contact_no=user.contact_no,
                address=user.address,
                
                # Location information
                ip=user.ip,
                location=user.location,
            )
            session.add(new_user)
            try:
                await session.commit()
            except IntegrityError:
                await session.rollback()
                raise HTTPException(status_code=400, detail="Username already exists")
    return {"message": "User registered successfully"}

@app.post("/login")
async def login(user: UserLogin, request: Request):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.username == user.username))
        db_user = result.scalar_one_or_none()
        if not db_user or not verify_password(user.password, db_user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        jti = str(uuid.uuid4())
        jwt_session = JwtSession(
            user_id=db_user.id,
            jti=jti,
            created_at=datetime.now(IST) ,
            is_active=True
        )
        session.add(jwt_session)
        await session.commit()

        #anomaly
        result = await session.execute(
            select(JwtSession)
            .where(JwtSession.user_id == db_user.id)
            .where(JwtSession.is_active == True)
            .where(JwtSession.jti != jti)  # exclude the current session
            .where(JwtSession.created_at + timedelta(minutes=15) > datetime.now(IST))  # still valid
        )
        other_active_sessions = result.scalars().all()

        if other_active_sessions:
            from models import AnomalyLog
            anomaly = AnomalyLog(
                user_id=db_user.id,
                description=f"Concurrent login detected for {db_user.username}"
            )
            session.add(anomaly)
            await session.commit()
            print(f"[ANOMALY] Concurrent login detected for {db_user.username}")

        # Return JWT token for user portal
        token_payload = {
            "sub": str(db_user.id),  # <-- FIX: use int, not str
            "jti": jti,
            "exp": datetime.utcnow() + timedelta(minutes=15)  # <-- 15 MIN EXPIRY
        }
        access_token = jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": access_token, "token_type": "bearer"}
    
@app.post("/logout")
async def user_logout(token: str = Depends(oauth2_scheme)):
    """
    Logs out a user by revoking the current JWT session.
    Works for both normal users and admins.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        jti = payload.get("jti")
        if user_id is None or jti is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user_id = int(user_id)  # <-- FIX: cast to int for DB query
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    async with async_session() as session:
        result = await session.execute(
            select(JwtSession).where(JwtSession.jti == jti, JwtSession.user_id == user_id)
        )
        jwt_session = result.scalar_one_or_none()
        if not jwt_session or not jwt_session.is_active:
            raise HTTPException(status_code=404, detail="Active session not found")

        jwt_session.is_active = False
        await session.commit()

    return {"message": "User logged out successfully"}


@app.post("/logout-debug")
async def logout_debug(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"decoded_payload": payload}
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"JWTError: {str(e)}")



# @app.post("/grid-challenge", response_model=GridChallengeResponse)
# async def grid_challenge(req: GridChallengeRequest):
#     grid = generate_grid()
#     signature = sign_grid(grid, SECRET_KEY)
#     coords = random.sample(list(grid.keys()), 3)
#     async with async_session() as session:
#         async with session.begin():
#             result = await session.execute(select(User).where(User.username == req.username))
#             db_user = result.scalar_one_or_none()
#             if not db_user:
#                 raise HTTPException(status_code=404, detail="User not found")
#             grid_session = GridSession(
#                 user_id=db_user.id,
#                 grid_data=json.dumps(grid),
#                 grid_signature=signature,
#                 is_active=True
#             )
#             session.add(grid_session)
#             await session.commit()
#     return GridChallengeResponse(grid=grid, signature=signature, challenge_coords=coords)

# @app.post("/grid-validate")
# async def grid_validate(req: GridValidateRequest):
#     async with async_session() as session:
#         result = await session.execute(select(User).where(User.username == req.username))
#         db_user = result.scalar_one_or_none()
#         if not db_user:
#             raise HTTPException(status_code=404, detail="User not found")
#         result = await session.execute(
#             select(GridSession)
#             .where(GridSession.user_id == db_user.id)
#             .where(GridSession.grid_signature == req.signature)
#             .where(GridSession.is_active == True)
#             .order_by(GridSession.created_at.desc())
#         )
#         grid_session = result.scalar_one_or_none()
#         if not grid_session:
#             raise HTTPException(status_code=404, detail="Active grid session not found")
#         grid = json.loads(grid_session.grid_data)
#         if not verify_grid(grid, req.signature, SECRET_KEY):
#             raise HTTPException(status_code=400, detail="Invalid grid signature")
#         for coord, value in req.answers.items():
#             if grid.get(coord) != value:
#                 raise HTTPException(status_code=401, detail=f"Incorrect value for {coord}")
#         grid_session.is_active = False
#         await session.commit()
#     return {"message": "Grid MFA successful"}

# ---------------------------
# Admin Endpoints
# ---------------------------


@app.get("/admin/anomalies")
async def list_anomalies():
    async with async_session() as session:
        result = await session.execute(
            select(AnomalyLog, User)
            .join(User, AnomalyLog.user_id == User.id)
            .order_by(AnomalyLog.created_at.desc())
        )
        anomalies = result.all()
        return [
            {
                "id": anomaly.id,
                "username": user.username,
                "description": anomaly.description,
                "created_at": str(anomaly.created_at)
            }
            for anomaly, user in anomalies
        ]


@app.post("/admin/logout")
async def admin_logout(current_user: User = Depends(get_current_user), token: str = Depends(oauth2_scheme)):
    """
    Logs out an admin by revoking the current JWT session.
    Only works for users with is_admin=True.
    """
    # ✅ Security check: ensure only admins can hit this endpoint
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access admin logout")

    async with async_session() as session:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            jti = payload.get("jti")
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Find admin session
        result = await session.execute(
            select(JwtSession).where(JwtSession.jti == jti, JwtSession.user_id == current_user.id)
        )
        jwt_session = result.scalar_one_or_none()
        if not jwt_session or not jwt_session.is_active:
            raise HTTPException(status_code=404, detail="Active admin session not found")

        # Mark session as inactive
        jwt_session.is_active = False
        await session.commit()

    # Notify any connected admin dashboards
    await broadcast_session_update()

    return {"message": "Admin logged out successfully"}
 

 
# Add this helper function in main.py:
def format_datetime_for_frontend(dt):
    """Convert UTC datetime to IST and format as string"""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    
    ist = pytz.timezone('Asia/Kolkata')
    ist_time = dt.astimezone(ist)
    return ist_time.isoformat()


@app.post("/admin/login")
async def admin_login(admin: AdminLogin, request: Request):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.username == admin.username))
        db_user = result.scalar_one_or_none()
        if not db_user or not verify_password(admin.password, db_user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if not db_user.is_admin:
            raise HTTPException(status_code=403, detail="Not an admin user")
        # --- JWT SESSION TRACKING ---
        jti = str(uuid.uuid4())
        jwt_session = JwtSession(
            user_id=db_user.id,
            jti=jti,
            created_at=datetime.now(IST),
            is_active=True
        )
        session.add(jwt_session)
        await session.commit()
        # Return JWT token for admin if needed
        token_payload = {
            "sub": db_user.id,  # <-- FIX: use int, not str
            "jti": jti,
            "exp": datetime.utcnow() + timedelta(minutes=15)  # <-- 15 MIN EXPIRY
        }
        access_token = jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/admin/users", response_model=List[UserOut])
async def list_users():
    async with async_session() as session:
        result = await session.execute(select(User))
        users = result.scalars().all()
        user_list = []
        for u in users:
            print(f"Debug - User data: id={u.id}, username={u.username}, rank={u.rank}, department={u.department}")  # Debug print
            user_data = UserOut(
                id=u.id,
                username=u.username,
                name=u.name,
                age=u.age,
                rank=u.rank,
                contact_no=u.contact_no,
                date_of_joining=u.date_of_joining,
                dob=u.dob,
                ip=u.ip,
                location=u.location,
                department=u.department,
                address=u.address,
                is_admin=u.is_admin,
                is_blocked=u.is_blocked
            )
            user_list.append(user_data)
        return user_list

# @app.get("/admin/sessions", response_model=PaginatedResponse[SessionOut])
# async def list_sessions(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100)):
#     async with async_session() as session:
#             total_result = await session.execute(select(func.count(GridSession.id)))
#             total = total_result.scalar() or 0

#             result = await session.execute(
#                 select(GridSession, User)
#                 .join(User, GridSession.user_id == User.id)
#                 .order_by(GridSession.created_at.desc())
#                 .offset(skip)
#                 .limit(limit)
#             )
#             sessions = []
#             for grid_session, user in result.all():
#                 sessions.append(SessionOut(
#                     id=grid_session.id,
#                     username=user.username,
#                     created_at=str(grid_session.created_at),
#                     is_active=grid_session.is_active
#                 ))
#             return {
#                 "total": total,
#                 "skip": skip,
#                 "limit": limit,
#                 "data": sessions
#             }

        

@app.get("/admin/jwt-sessions", response_model=PaginatedResponse[JwtSessionOut])
async def list_jwt_sessions(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=1000)):
    async with async_session() as session:
        total_result = await session.execute(select(func.count(JwtSession.id)))
        total = total_result.scalar() or 0

        result = await session.execute(
            select(JwtSession, User)
            .join(User, JwtSession.user_id == User.id)
            .order_by(JwtSession.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        sessions = []
        for jwt_session, user in result.all():
            sessions.append(JwtSessionOut(
                id=jwt_session.id,
                username=user.username,
                created_at=str(jwt_session.created_at),
                is_active=jwt_session.is_active
            ))
        return {
            "total": total,
            "skip": skip,
            "limit": limit,
            "data": sessions
        }
#error for db_user- changed
# New endpoint to update user info
class UserUpdateRequest(BaseModel):
    username: str
    rank: str | None = None
    department: str | None = None
    name: str | None = None
    age: int | None = None

@app.post("/admin/update-user")
async def update_user(req: UserUpdateRequest):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.username == req.username))
        db_user = result.scalar_one_or_none()
        
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if req.rank is not None:
            db_user.rank = req.rank
        if req.department is not None:
            db_user.department = req.department
        if req.name is not None:
            db_user.name = req.name
        if req.age is not None:
            db_user.age = req.age
            
        await session.commit()
        return {"message": "User updated successfully"}

@app.post("/admin/block-user")
async def block_user(req: UserBlockRequest):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.username == req.username))
        db_user = result.scalar_one_or_none()

        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        db_user.is_blocked = req.block
        await session.commit()

    return {"message": f"User {'blocked' if req.block else 'unblocked'} successfully"}

@app.post("/admin/jwt-sessions/{session_id}/revoke")
async def revoke_jwt_session(session_id: int = Path(...)):
    async with async_session() as session:
        result = await session.execute(select(JwtSession).where(JwtSession.id == session_id))
        jwt_session = result.scalar_one_or_none()
        if not jwt_session:
            raise HTTPException(status_code=404, detail="Session not found")
        jwt_session.is_active = False
        await session.commit()
    return {"message": "Session revoked"}

# ---------------------------
# NEW: Admin Dashboard Stats & User Profile Endpoints
# ---------------------------

@app.get("/admin/user-stats")
async def user_stats():
    async with async_session() as session:
        # Get all users
        result = await session.execute(select(User))
        users = result.scalars().all()
        user_ids = [u.id for u in users]

        # Get all active JWT sessions (not expired, is_active)
        now = datetime.utcnow()
        result = await session.execute(
            select(JwtSession.user_id)
            .where(JwtSession.is_active == True)
            .where(JwtSession.created_at + timedelta(minutes=15) > now)
        )
        active_user_ids = set([row[0] for row in result.all()])

        active_users = len(active_user_ids)
        inactive_users = len(user_ids) - active_users

        return {"active_users": active_users, "inactive_users": inactive_users}

@app.get("/admin/user-profile/{user_id}")
async def user_profile(user_id: int):
    async with async_session() as session:
        # Get user info
        result = await session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get JWT sessions for this user
        result = await session.execute(
            select(JwtSession)
            .where(JwtSession.user_id == user_id)
            .order_by(JwtSession.created_at.desc())
        )
        sessions = result.scalars().all()

        # Prepare session logs
        session_logs = [
            {
                "id": s.id,
                "created_at": str(s.created_at),
                "is_active": s.is_active,
            }
            for s in sessions
        ]

        # Last login/logout
        last_login = sessions[0].created_at if sessions else None
        last_logout = None
        for s in sessions:
            if not s.is_active:
                last_logout = s.created_at
                break

        # Activity data for graph (list of login times)
        activity_data = [
            {"login": str(s.created_at), "active": s.is_active}
            for s in sessions
        ]

        return {
            "user": {
                "id": user.id,
                "username": user.username,
                "is_admin": user.is_admin,
                "is_blocked": getattr(user, "is_blocked", False)
            },
            "session_logs": session_logs,
            "last_login": str(last_login) if last_login else None,
            "last_logout": str(last_logout) if last_logout else None,
            "activity_data": activity_data
        }

# ---------------------------
# User Portal Endpoints
# ---------------------------

# @app.post("/user/sessions", response_model=List[UserSessionOut])
# async def user_sessions(user: UserLogin):
#     async with async_session() as session:
#         result = await session.execute(select(User).where(User.username == user.username))
#         db_user = result.scalar_one_or_none()
#         if not db_user or not verify_password(user.password, db_user.password_hash):
#             raise HTTPException(status_code=401, detail="Invalid credentials")
#         result = await session.execute(
#             select(GridSession).where(GridSession.user_id == db_user.id)
#         )
#         sessions = result.scalars().all()
#         return [
#             UserSessionOut(
#                 id=s.id,
#                 created_at=str(s.created_at),
#                 is_active=s.is_active
#             ) for s in sessions
#         ]

@app.get("/user/jwt-sessions")
async def user_jwt_sessions(current_user: User = Depends(get_current_user)):
    async with async_session() as session:
        result = await session.execute(
            select(JwtSession)
            .where(JwtSession.user_id == current_user.id)
            .order_by(JwtSession.created_at.desc())
        )
        sessions = result.scalars().all()
        return [
            {
                "id": s.id,
                "created_at": str(s.created_at),
                "is_active": s.is_active,
            }
            for s in sessions
        ]



@app.get("/api/check-username")
async def check_username(username: str = Query(...)):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.username == username))
        user = result.scalar_one_or_none()
        return {"exists": bool(user)}



