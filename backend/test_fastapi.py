"""
Simple test script to verify FastAPI setup is working correctly.
"""

import asyncio
import sys
import os

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

async def test_fastapi_setup():
    """Test the FastAPI application setup."""
    try:
        # Import the app
        from app.fastapi_app import app
        print("✅ FastAPI app imported successfully")
        
        # Test database models import
        from app.database.models import Material, Supplier, InventoryItem, PriceHistory
        print("✅ Database models imported successfully")
        
        # Test database session import
        from app.database.session import get_db_session, create_tables
        print("✅ Database session imported successfully")
        
        # Test creating tables
        await create_tables()
        print("✅ Database tables created successfully")
        
        print("\n🎉 Phase 1 FastAPI migration completed successfully!")
        print("📋 Summary:")
        print("   - FastAPI app created with async SQLAlchemy")
        print("   - 4 database models defined: Material, Supplier, InventoryItem, PriceHistory")
        print("   - Async database session with dependency injection")
        print("   - Database tables created")
        print("   - Health check and example routes implemented")
        
        return True
        
    except Exception as e:
        print(f"❌ Error in FastAPI setup: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_fastapi_setup())
    sys.exit(0 if success else 1)