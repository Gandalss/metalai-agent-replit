from flask import Blueprint, request, jsonify
from PIL import Image
import io
from ..image_handler.main import process_image

image_handler_bp = Blueprint("image_handler", __name__)


@image_handler_bp.route("/", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "No image part"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Optionally: validate image type
    if not file.content_type.startswith("image/"):
        return jsonify({"error": "Invalid file type"}), 400

    # Read image into memory (e.g. for OpenCV or PIL use)
    image_bytes = file.read()

    # Example: use PIL
    image = Image.open(io.BytesIO(image_bytes))

    # Call your processing function
    result = process_image(image)

    return jsonify({"result": result})