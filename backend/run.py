"""
Entry point for the FastAPI backend server.
This runs the FastAPI application using uvicorn.
"""

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.fastapi_app:app",
        host="0.0.0.0",  # Bind to all interfaces for Replit
        port=8000,
        reload=True
    )