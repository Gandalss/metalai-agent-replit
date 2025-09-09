from datetime import datetime
from app.extensions import db

class MetalPiece(db.Model):
    __tablename__ = "metal_pieces"

    id = db.Column(db.Integer, primary_key=True)
    width = db.Column(db.Float, nullable=False)
    height = db.Column(db.Float, nullable=False)
    depth = db.Column(db.Float, nullable=False)
    note = db.Column(db.String(255), nullable=True)  # Description field
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<MetalPiece {self.id}: {self.width}x{self.height}x{self.depth}>"