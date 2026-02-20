# init_db.py
import asyncio
from models import Base
from database import engine

async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(init_models())
 
 
 
 #changes
 #import asyncio
#from database import engine, Base

#async def init_db():
 #   async with engine.begin() as conn:
  #      await conn.run_sync(Base.metadata.drop_all)
   #     await conn.run_sync(Base.metadata.create_all)

#if __name__ == "__main__":
 #   asyncio.run(init_db())
