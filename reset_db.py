# Save this as reset_db.py in your project directory
import asyncio
from database import engine
from models import Base

async def reset():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(reset())
