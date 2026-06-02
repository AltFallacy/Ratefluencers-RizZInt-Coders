import os
import ssl
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# ── NeonDB (PostgreSQL) ───────────────────────────────────────────────────────

_raw_url = os.getenv("NEON_DATABASE_URL", "")

# Strip any ?sslmode=... query params — asyncpg handles SSL via connect_args
_database_url = _raw_url.split("?")[0] if "?" in _raw_url else _raw_url

# Permissive SSL context (required for NeonDB pooler from Docker / Windows)
_ssl_ctx = ssl.create_default_context()
_ssl_ctx.check_hostname = False
_ssl_ctx.verify_mode = ssl.CERT_NONE

engine = create_async_engine(
    _database_url,
    echo=False,
    future=True,
    connect_args={"ssl": _ssl_ctx},
)

AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


async def get_db():
    """FastAPI dependency that yields an async DB session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
