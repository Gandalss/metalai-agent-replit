import os


class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ESP32_CAM1_URL = os.getenv("ESP32_CAM1_URL", "http://192.168.1.184")
    ESP32_CAM2_URL = os.getenv("ESP32_CAM2_URL", "http://192.168.1.225")
    DEBUG_DIR = os.getenv(
        "DEBUG_DIR",
        os.path.abspath(os.path.join(os.path.dirname(__file__), "captured_images")),
    )
    os.makedirs(DEBUG_DIR, exist_ok=True)
