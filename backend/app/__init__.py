from flask import Flask
import os
from .extensions import db, ma, migrate
from .routes.image_handler import image_handler_bp
from .routes.measurements import measurements_bp
from .routes.metal_pieces import metal_piece_bp
from .routes.esp32 import esp32_bp
from .routes.dual_esp32 import dual_esp32_bp
from flask_cors import CORS

def create_app(config_class="app.config.Config"):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Ensure the debug image directory exists
    debug_dir = app.config.get("DEBUG_DIR")
    if debug_dir:
        os.makedirs(debug_dir, exist_ok=True)

    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    CORS(app)
    app.register_blueprint(image_handler_bp, url_prefix="/api/image_handler")
    app.register_blueprint(measurements_bp, url_prefix="/api/measurements")
    app.register_blueprint(metal_piece_bp, url_prefix="/api/metal_pieces")
    app.register_blueprint(esp32_bp, url_prefix="/api/esp32")
    app.register_blueprint(dual_esp32_bp, url_prefix="/api/dual_esp32")

    return app
