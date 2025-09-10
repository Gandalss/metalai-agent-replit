"""
FastAPI application setup for the metal piece measurement system.
This file creates the FastAPI app instance and configures it with
dependency injection for database sessions.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession

from .database.session import get_db_session, create_tables, close_db_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events.
    Handles startup and shutdown events for the FastAPI application.
    """
    # Startup
    await create_tables()
    yield
    # Shutdown
    await close_db_engine()


# Create FastAPI application instance
app = FastAPI(
    title="Metal Piece Measurement System",
    description="API for managing metal piece inventory and measurements",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """
    Root endpoint for health check.
    """
    return {
        "message": "Metal Piece Measurement System API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_db_session)):
    """
    Health check endpoint that verifies database connectivity.
    """
    try:
        # Simple database query to verify connection
        result = await db.execute("SELECT 1")
        return {
            "status": "healthy",
            "database": "connected",
            "message": "FastAPI application is running correctly"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }


# Example route demonstrating dependency injection
@app.get("/materials/")
async def list_materials(db: AsyncSession = Depends(get_db_session)):
    """
    Example endpoint to list materials.
    Demonstrates how to use the database session dependency.
    """
    from sqlalchemy import select
    from .database.models import Material
    
    try:
        result = await db.execute(select(Material))
        materials = result.scalars().all()
        return {
            "materials": [
                {
                    "id": material.id,
                    "name": material.name,
                    "description": material.description,
                    "material_type": material.material_type,
                    "density": float(material.density) if material.density else None,
                    "created_at": material.created_at.isoformat() if material.created_at else None
                }
                for material in materials
            ]
        }
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.fastapi_app:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )