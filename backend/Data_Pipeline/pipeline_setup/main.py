import sys
import os
import asyncio
import ssl
from sqlalchemy.ext.asyncio import create_async_engine

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import Base
import schemas  # Maps your models cleanly

async def init_db():
    # ── THE ABSOLUTE CREDENTIAL DIRECTORY FIX ──
    # Using your exact real credentials with the direct (non-pooled) async host address
    database_url = "postgresql+asyncpg://neondb_owner:npg_CW0x6DslvAjV@ep-weathered-water-ap14dwje.us-east-1.aws.neon.tech/neondb"

    print("⏳ Connecting to Neon DB cluster with custom SSL mapping...")
    
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    local_engine = create_async_engine(
        database_url,
        connect_args={"ssl": ssl_context}
    )

    try:
        async with local_engine.begin() as conn:
            print("🧱 Syncing public schema tables to Neon...")
            await conn.run_sync(Base.metadata.create_all)
        print("🚀 Success! All database tables verified and created successfully in NeonDB!")
    except Exception as e:
        print(f"❌ Connection migration failed: {e}")
    finally:
        await local_engine.dispose()

if __name__ == "__main__":
    asyncio.run(init_db())