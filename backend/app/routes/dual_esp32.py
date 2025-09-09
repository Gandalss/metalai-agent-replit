from flask import Blueprint, current_app, jsonify
import requests
import tempfile
import os
import base64
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

from app.image_handler.main import process_ground_images
from .esp32 import _fetch_image, _fix_jpeg_bytes

# Directory where raw camera images are stored for debugging purposes.
# Can be overridden via the ``DEBUG_DIR`` environment variable.
DEFAULT_DEBUG_DIR = os.getenv(
    "DEBUG_DIR",
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "captured_images")),
)
os.makedirs(DEFAULT_DEBUG_DIR, exist_ok=True)

dual_esp32_bp = Blueprint("dual_esp32", __name__)

@dual_esp32_bp.route("/capture_coordinated", methods=["POST"])
def capture_coordinated():
    cam1 = current_app.config.get("ESP32_CAM1_URL")
    cam2 = current_app.config.get("ESP32_CAM2_URL")

    def capture_and_get(cam_url: str):
        # Direkt /capture aufrufen (gibt sofort Bild zurück)
        resp = requests.get(f"{cam_url}/capture", timeout=10)
        resp.raise_for_status()
        return _fix_jpeg_bytes(resp.content)

    try:
        with ThreadPoolExecutor(max_workers=2) as executor:
            # Beide Kameras parallel - direkt /capture verwenden
            future_front = executor.submit(capture_and_get, cam1)
            future_side = executor.submit(capture_and_get, cam2)
            front_bytes = future_front.result()
            side_bytes = future_side.result()

        # Save raw images for debugging with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        debug_dir = current_app.config.get("DEBUG_DIR", DEFAULT_DEBUG_DIR)
        front_debug_path = os.path.join(debug_dir, f"front_{timestamp}.jpg")
        side_debug_path = os.path.join(debug_dir, f"side_{timestamp}.jpg")
        with open(front_debug_path, "wb") as debug_front:
            debug_front.write(front_bytes)
        with open(side_debug_path, "wb") as debug_side:
            debug_side.write(side_bytes)
    except Exception as e:
        return jsonify({"error": "Failed to capture images", "details": str(e)}), 500

    front_b64 = base64.b64encode(front_bytes).decode("utf-8")
    side_b64 = base64.b64encode(side_bytes).decode("utf-8")

    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as f1:
        f1.write(front_bytes)
        front_path = f1.name
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as f2:
        f2.write(side_bytes)
        side_path = f2.name

    try:
        data = process_ground_images(front_path, side_path)
    except Exception as e:
        os.remove(front_path)
        os.remove(side_path)
        msg = str(e)
        if "Unzureichende Linienabst" in msg:
            return (
                jsonify({
                    "error": "Calibration failed",
                    "details": msg,
                    "front_image": front_b64,
                    "side_image": side_b64,
                }),
                400,
            )
        return (
            jsonify({
                "error": "Failed to process images",
                "details": msg,
                "front_image": front_b64,
                "side_image": side_b64,
            }),
            500,
        )
    else:
        os.remove(front_path)
        os.remove(side_path)
        return jsonify({"data": data, "front_image": front_b64, "side_image": side_b64})



@dual_esp32_bp.route("/capture_images", methods=["POST"])
def capture_images():
    cam1 = current_app.config.get("ESP32_CAM1_URL")
    cam2 = current_app.config.get("ESP32_CAM2_URL")

    def trigger(cam_url: str):
        requests.post(f"{cam_url}/capture", timeout=5)

    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = [executor.submit(trigger, cam1), executor.submit(trigger, cam2)]
        for f in futures:
            try:
                f.result()
            except Exception as e:
                return jsonify({"error": "Failed to trigger cameras", "details": str(e)}), 500

    try:
        with ThreadPoolExecutor(max_workers=2) as executor:
            future_front = executor.submit(_fetch_image, f"{cam1}/get_captured_image")
            future_side = executor.submit(_fetch_image, f"{cam2}/get_captured_image")
            front_bytes = _fix_jpeg_bytes(future_front.result())
            side_bytes = _fix_jpeg_bytes(future_side.result())
    except Exception as e:
        return jsonify({"error": "Failed to fetch images", "details": str(e)}), 500

    front_b64 = base64.b64encode(front_bytes).decode("utf-8")
    side_b64 = base64.b64encode(side_bytes).decode("utf-8")

    return jsonify({"front_image": front_b64, "side_image": side_b64})
