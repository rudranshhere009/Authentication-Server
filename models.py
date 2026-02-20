# # models.py
# from datetime import datetime
# from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
# from sqlalchemy.orm import sessionmaker, declarative_base
# from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Date
# from sqlalchemy.sql import func

# Base = declarative_base()

# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)  # back to 'id'
#     username = Column(String, unique=True, index=True)
#     password_hash = Column(String)

#     # your new fields
#     age = Column(Integer)
#     rank = Column(String)
#     name = Column(String)
#     contact_no = Column(String)
#     date_of_joining = Column(Date)
#     dob = Column(Date)
#     ip = Column(String)
#     location = Column(String)
#     department = Column(String)
#     address = Column(String)

#     is_admin = Column(Boolean, default=False)
#     is_blocked = Column(Boolean, default=False)
   
#      #  sessions = relationship("JwtSession", back_populates="user")

# class GridSession(Base):
#     __tablename__ = "grid_sessions"
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"))
#     grid_data = Column(String)  # JSON string of the grid
#     grid_signature = Column(String)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     is_active = Column(Boolean, default=True)

# # --- Added for JWT session tracking ---
# class JwtSession(Base):
#     __tablename__ = "jwt_sessions"
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"))
#     jti = Column(String, unique=True, index=True)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     is_active = Column(Boolean, default=True)
    
# class AnomalyLog(Base):
#     __tablename__ = "anomaly_logs"

#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
#     description = Column(String, nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow)

 
 
# models.py
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    age = Column(Integer, nullable=True)
    rank = Column(String, nullable=True)
    name = Column(String, nullable=True)
    contact_no = Column(String, nullable=True)
    date_of_joining = Column(DateTime, nullable=True)
    dob = Column(DateTime, nullable=True)
    ip = Column(String, nullable=True)
    location = Column(String, nullable=True)
    department = Column(String, nullable=True)
    address = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False)
    is_blocked = Column(Boolean, default=False)
   
     #  sessions = relationship("JwtSession", back_populates="user")

class GridSession(Base):
    __tablename__ = "grid_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    grid_data = Column(String)  # JSON string of the grid
    grid_signature = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)

# --- Added for JWT session tracking ---
class JwtSession(Base):
    __tablename__ = "jwt_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    jti = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    
class AnomalyLog(Base):
    __tablename__ = "anomaly_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    description = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

 
 