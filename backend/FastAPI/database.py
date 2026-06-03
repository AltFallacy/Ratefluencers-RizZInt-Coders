import os
import ssl
from dotenv import load_dotenv

load_dotenv()

# ── NeonDB (PostgreSQL) ───────────────────────────────────────────────────────

_raw_url = os.getenv("NEON_DATABASE_URL", "")

# Only initialise the engine if a real connection string is provided.
# When running without a database (using the in-memory influencer store)
# we skip engine creation so the app starts cleanly.
engine = None
AsyncSessionLocal = None
Base = None

if _raw_url and _raw_url.strip() and not _raw_url.startswith("postgresql://user:"):
    try:
        from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
        from sqlalchemy.orm import sessionmaker, declarative_base

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
        print("[DB] NeonDB engine initialised.")
    except Exception as e:
        print(f"[DB] WARNING: Could not initialise NeonDB engine: {e}")
        engine = None
        AsyncSessionLocal = None
        Base = None
else:
    print("[DB] No NEON_DATABASE_URL configured — running with in-memory store only.")


async def get_db():
    """FastAPI dependency that yields an async DB session (no-op if DB not configured)."""
    if AsyncSessionLocal is None:
        yield None
        return
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
