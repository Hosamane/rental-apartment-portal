from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User
from app import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "User already exists"}), 409

    user = User(
        name=data.get("name"),
        email=data["email"],
        role="USER",
        password_hash=generate_password_hash(data["password"])
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password_hash, data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(
    identity=str(user.id),   # MUST be string
    additional_claims={
        "role": user.role,
        "email": user.email
    
    })

    return jsonify({
        "access_token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    })
