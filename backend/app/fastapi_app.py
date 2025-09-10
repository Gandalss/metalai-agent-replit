"""
FastAPI application setup for the metal piece measurement system.
This file creates the FastAPI app instance and configures it with
dependency injection for database sessions.
"""

import os
import tempfile
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from .database.session import get_db_session, create_tables, close_db_engine
from .image_handler.main import process_images, save_uploaded_file


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
        from sqlalchemy import text
        result = await db.execute(text("SELECT 1"))
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
                    "density": float(material.density) if material.density is not None else None,
                    "created_at": material.created_at.isoformat() if material.created_at is not None else None
                }
                for material in materials
            ]
        }
    except Exception as e:
        return {"error": str(e)}


@app.post("/api/process-images")
async def process_images_endpoint(
    image_bottom: UploadFile = File(..., description="Bottom view image for width and height measurement"),
    image_side: UploadFile = File(..., description="Side view image for depth measurement"),
    db: AsyncSession = Depends(get_db_session)
):
    """
    Process two uploaded images to extract metal piece measurements.
    
    Critical Script Assignment:
    - image_bottom → Main2Bottom.py (width) + Main4High.py (height)  
    - image_side → Main7BottomWidthBETTER.py (depth)
    
    Returns JSON with measurements array containing precise measurements.
    """
    
    # Validate file types
    allowed_types = {"image/jpeg", "image/jpg", "image/png"}
    if image_bottom.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Bottom image must be JPEG or PNG")
    if image_side.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Side image must be JPEG or PNG")
    
    # Save uploaded files temporarily
    temp_files = []
    try:
        bottom_path = save_uploaded_file(image_bottom, "bottom")
        side_path = save_uploaded_file(image_side, "side")
        temp_files.extend([bottom_path, side_path])
        
        print(f"Processing images: bottom={bottom_path}, side={side_path}")
        
        # Process images with correct script assignment
        measurements = process_images(bottom_path, side_path)
        
        # Create response in the required format
        response = {
            "measurements": [
                {
                    "item_id": 1,  # Placeholder as requested
                    "material_id": 1,  # Placeholder as requested  
                    "width_mm": measurements.get("width_mm"),
                    "height_mm": measurements.get("height_mm"),
                    "depth_mm": measurements.get("depth_mm"),
                    "confidence": 0.85,  # Placeholder as requested
                    "calculated_weight_kg": measurements.get("calculated_weight_kg"),
                    "volume_mm3": measurements.get("volume_mm3"),
                    "processing_errors": measurements.get("errors", []),
                    "processing_successful": measurements.get("processing_successful", False)
                }
            ],
            "status": "success" if measurements.get("processing_successful", False) else "partial_success",
            "message": "Image processing completed" if measurements.get("processing_successful", False) else "Image processing completed with some errors"
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Image processing failed: {str(e)}"
        )
    
    finally:
        # Clean up temporary files
        for temp_file in temp_files:
            try:
                if os.path.exists(temp_file):
                    os.unlink(temp_file)
            except Exception as e:
                print(f"Warning: Failed to clean up temporary file {temp_file}: {e}")


@app.get("/api/process-images/test")
async def test_process_images():
    """
    Test endpoint to verify the image processing structure without file uploads.
    Returns the expected response format with mock data.
    """
    return {
        "measurements": [
            {
                "item_id": 1,
                "material_id": 1,
                "width_mm": 45.2,
                "height_mm": 78.3,
                "depth_mm": 23.1,
                "confidence": 0.85,
                "calculated_weight_kg": 0.642,
                "volume_mm3": 81742.56,
                "processing_errors": [],
                "processing_successful": True
            }
        ],
        "status": "success",
        "message": "Test response - image processing structure verified"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.fastapi_app:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )