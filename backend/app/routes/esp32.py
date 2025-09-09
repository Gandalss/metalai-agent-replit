from flask import Blueprint, current_app, jsonify
import requests
import tempfile
import os

from app.image_handler.main import process_ground_images

esp32_bp = Blueprint("esp32", __name__)


def _fetch_image(url: str) -> bytes:
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    return resp.content


def _fix_jpeg_bytes(data: bytes) -> bytes:
    """Return *data* truncated at the JPEG end marker if present."""
    end_marker = b"\xff\xd9"
    idx = data.rfind(end_marker)
    if idx != -1:
        return data[: idx + 2]
    return data


@esp32_bp.route("/capture_ground_level", methods=["POST"])
def capture_ground_level():
    cam1 = current_app.config.get("ESP32_CAM1_URL")
    cam2 = current_app.config.get("ESP32_CAM2_URL")

    try:
        requests.post(f"{cam1}/trigger_dual", timeout=5)
    except Exception as e:
        return jsonify({"error": "Failed to trigger cameras", "details": str(e)}), 500

    try:
        front_bytes = _fix_jpeg_bytes(_fetch_image(f"{cam1}/get_captured_image"))
        side_bytes = _fix_jpeg_bytes(_fetch_image(f"{cam2}/get_captured_image"))
    except Exception as e:
        return jsonify({"error": "Failed to fetch images", "details": str(e)}), 500

    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as f1:
        f1.write(front_bytes)
        front_path = f1.name
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as f2:
        f2.write(side_bytes)
        side_path = f2.name

    try:
        data = process_ground_images(front_path, side_path)
    except Exception as e:
        msg = str(e)
        if "Unzureichende Linienabst" in msg:
            return jsonify({"error": "Calibration failed", "details": msg}), 400
        return jsonify({"error": "Failed to process images", "details": msg}), 500
    finally:
        os.remove(front_path)
        os.remove(side_path)

    return jsonify({"data": data})
