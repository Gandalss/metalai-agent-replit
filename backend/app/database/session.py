"""
Async database session configuration for FastAPI with SQLAlchemy.
Supports both PostgreSQL (via asyncpg) and SQLite (via aiosqlite) databases.
"""

import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from .models import Base

# Database configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite+aiosqlite:///./instance/app.db"  # Default to async SQLite
)

# Handle PostgreSQL URL format if provided
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Create async engine
async_engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL debugging
    future=True,
)

# Create async session factory
async_sessionmaker = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def create_tables():
    """
    Create all tables in the database.
    This should be called on application startup.
    """
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency injection function for FastAPI.
    Provides an async database session for each request.
    
    Usage in FastAPI route:
    async def some_route(db: AsyncSession = Depends(get_db_session)):
        # Use db session here
        pass
    """
    async with async_sessionmaker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def close_db_engine():
    """
    Close the database engine.
    This should be called on application shutdown.
    """
    await async_engine.dispose()