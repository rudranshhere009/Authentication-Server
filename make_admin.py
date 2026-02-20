# make_admin.py
import asyncio
from database import async_session
from models import User
from sqlalchemy.future import select
from auth_utils import hash_password

async def make_admin(username, password):
    async with async_session() as session:
        result = await session.execute(
            select(User).where(User.username == username)
        )
        user = result.scalar_one_or_none()
        if user:
            user.is_admin = True
            await session.commit()
            print(f"{username} is now an admin.")
        else:
            # Create new admin user
            hashed_pw = hash_password(password)
            new_user = User(username=username, password_hash=hashed_pw, is_admin=True)
            session.add(new_user)
            await session.commit()
            print(f"Admin user '{username}' created.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python make_admin.py <username> <password>")
    else:
        username = sys.argv[1]
        password = sys.argv[2]
        asyncio.run(make_admin(username, password))

