import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from qdrant_client import QdrantClient

# Derived via internal Airflow environments or systems 
DATABASE_URL = os.getenv("NEON_DATABASE_URL", "postgresql+asyncpg://user:pass@host/db")
engine = create_async_engine(DATABASE_URL, echo=False, future=True)

AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

QDRANT_HOST = os.getenv("QDRANT_URL", "http://localhost:6333")
QDRANT_KEY = os.getenv("QDRANT_API_KEY")
qdrant_client = QdrantClient(url=QDRANT_HOST, api_key=QDRANT_KEY)