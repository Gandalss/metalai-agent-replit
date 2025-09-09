from app.extensions import ma
from app.models.metal_piece import MetalPiece

class MetalPieceSchema(ma.SQLAlchemySchema):
    class Meta:
        model = MetalPiece
        load_instance = True

    id = ma.auto_field(dump_only=True)
    width = ma.auto_field(required=True)
    height = ma.auto_field(required=True)
    depth = ma.auto_field(required=True)
    note = ma.auto_field()