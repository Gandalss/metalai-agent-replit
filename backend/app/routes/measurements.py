from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import tempfile

from app.image_handler.main import process_images


measurements_bp = Blueprint("measurements", __name__)


@measurements_bp.route("/", methods=["POST"])
def create_measurement():
    if "image1" not in request.files or "image2" not in request.files:
        return jsonify({"error": "Two images required"}), 400

    file1 = request.files["image1"]
    file2 = request.files["image2"]

    temp_dir = tempfile.mkdtemp()
    path1 = os.path.join(temp_dir, secure_filename(file1.filename))
    path2 = os.path.join(temp_dir, secure_filename(file2.filename))
    file1.save(path1)
    file2.save(path2)

    try:
        result = process_images(path1, path2)
    except Exception as e:
        # Log the error server side and return a JSON error to the client
        # This prevents HTML error pages which the frontend cannot parse
        print(f"Error processing images: {e}")
        return jsonify({"error": "Failed to process images", "details": str(e)}), 500

    return jsonify({"data": result})

