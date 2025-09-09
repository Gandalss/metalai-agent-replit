from flask import Blueprint, request, jsonify
from app.models.metal_piece import MetalPiece
from app.schemas.metal_piece import MetalPieceSchema
from app.extensions import db

metal_piece_bp = Blueprint("metal_piece", __name__)
metal_piece_schema = MetalPieceSchema()
metal_pieces_schema = MetalPieceSchema(many=True)

@metal_piece_bp.route("/", methods=["POST"])
def create_metal_piece():
    metal_piece = metal_piece_schema.load(request.json)
    db.session.add(metal_piece)
    db.session.commit()
    return metal_piece_schema.jsonify(metal_piece), 201

@metal_piece_bp.route("/", methods=["GET"])
def get_metal_pieces():
    metal_pieces = MetalPiece.query.all()
    return metal_pieces_schema.jsonify(metal_pieces), 200

@metal_piece_bp.route("/<int:id>", methods=["DELETE"])
def delete_metal_piece(id):
    metal_piece = MetalPiece.query.get(id)
    if metal_piece:
        db.session.delete(metal_piece)
        db.session.commit()
        return jsonify({"message": "Metal piece deleted successfully!"}), 200