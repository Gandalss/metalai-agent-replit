# Overview

This is a metal piece measurement system that combines computer vision, machine learning, and industrial automation. The system uses ESP32 cameras to capture images of metal pieces and employs YOLO object detection with perspective correction to calculate precise measurements. It features a full-stack architecture with a Flask backend for image processing and measurement calculations, and a React frontend for user interaction and data management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 19 with Vite build system for fast development and modern tooling
- **State Management**: Zustand for lightweight, centralized state management across measurement workflows
- **Styling**: Tailwind CSS 4 for utility-first styling and responsive design
- **Routing**: React Router DOM for multi-page navigation
- **UI Components**: Lucide React for consistent iconography and React Hot Toast for user notifications

## Backend Architecture
- **Framework**: Flask with modular blueprint structure for organized API endpoints
- **Database ORM**: SQLAlchemy with Flask-SQLAlchemy integration for database operations
- **Data Validation**: Marshmallow schemas for request/response serialization and validation
- **Database Migrations**: Alembic via Flask-Migrate for version-controlled schema changes
- **CORS**: Flask-CORS enabled for cross-origin requests from frontend

## Computer Vision Pipeline
- **Object Detection**: YOLO (Ultralytics) for detecting metal pieces and reference objects in images
- **Image Processing**: OpenCV for image manipulation, perspective correction, and calibration
- **Grid Calibration**: Custom homography computation for perspective correction using reference grid
- **Measurement Calculation**: Pixel-to-centimeter conversion based on grid calibration and reference objects

## Data Models
- **MetalPiece**: Core entity storing width, height, depth measurements with optional notes and timestamps
- **Database**: SQLite for development with easy migration to PostgreSQL for production
- **Schema Validation**: Marshmallow schemas ensure data integrity for metal piece CRUD operations

## Hardware Integration
- **ESP32 Cameras**: Dual camera setup for capturing different angles (front/side views)
- **Coordinated Capture**: ThreadPoolExecutor for simultaneous image capture from multiple cameras
- **Image Storage**: Debug image storage with timestamps for troubleshooting and analysis

## API Structure
- **Measurements Endpoint**: `/api/measurements/` for processing uploaded images
- **Metal Pieces CRUD**: `/api/metal_pieces/` for stock management operations
- **ESP32 Integration**: `/api/dual_esp32/` for automated camera capture workflows
- **Error Handling**: Comprehensive error responses with JSON format to prevent frontend parsing issues

# External Dependencies

## Machine Learning & Computer Vision
- **Ultralytics YOLO**: Object detection model for identifying metal pieces and reference objects
- **PyTorch**: Deep learning framework powering YOLO inference
- **OpenCV**: Image processing library for perspective correction and calibration
- **Matplotlib**: Visualization library for debugging and analysis output

## Hardware Communication
- **ESP32 Cameras**: Network-connected cameras accessible via HTTP endpoints
- **Requests Library**: HTTP client for communicating with ESP32 camera modules

## Frontend Libraries
- **QRCode Generation**: qrcode library for encoding measurement data into QR codes
- **State Management**: Zustand for client-side state management
- **HTTP Client**: Native Fetch API for backend communication

## Development Tools
- **Gunicorn**: WSGI HTTP server for production deployment
- **Pillow**: Python imaging library for image format handling
- **NumPy**: Numerical computing library for array operations in image processing

## Database & ORM
- **SQLite**: Development database with migration path to PostgreSQL
- **SQLAlchemy**: ORM for database operations and model definitions
- **Alembic**: Database migration tool for schema version control