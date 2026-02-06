from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Unit, Booking, TowerAmenity, Amenity, Tower
from app import db
# from sqlalchemy  import asc,desc
from sqlalchemy import asc, desc, func

user_bp = Blueprint("user", __name__)

@user_bp.route("/db-check")
def db_check():
    users = User.query.all()
    return {
        "message": "DB Connected",
        "users": [u.email for u in users]
    }

# from sqlalchemy import asc, desc

# from app.models import Unit, Tower, TowerAmenity

@user_bp.route("/units", methods=["GET"])
@jwt_required()
def get_units():
    tower_id = request.args.get("tower_id", type=int)
    bedrooms = request.args.get("bedrooms", type=int)
    min_rent = request.args.get("min_rent", type=float)
    max_rent = request.args.get("max_rent", type=float)
    sort = request.args.get("sort")
    amenities = request.args.get("amenities")  # "1,3"

    query = Unit.query.filter_by(status="AVAILABLE")

    if tower_id:
        query = query.filter_by(tower_id=tower_id)

    if bedrooms:
        query = query.filter_by(bedrooms=bedrooms)

    if min_rent is not None:
        query = query.filter(Unit.rent >= min_rent)

    if max_rent is not None:
        query = query.filter(Unit.rent <= max_rent)

    # 🔥 AND LOGIC FOR AMENITIES (via tower)
    if amenities:
        amenity_ids = [int(a) for a in amenities.split(",")]

        query = (
            query
            .join(TowerAmenity, Unit.tower_id == TowerAmenity.tower_id)
            .filter(TowerAmenity.amenity_id.in_(amenity_ids))
            .group_by(Unit.id)
            .having(func.count(TowerAmenity.amenity_id) == len(amenity_ids))
        )

    if sort == "rent_asc":
        query = query.order_by(asc(Unit.rent))
    elif sort == "rent_desc":
        query = query.order_by(desc(Unit.rent))

    units = query.all()

    response = []
    for u in units:
        tower = Tower.query.get(u.tower_id)
        amenity_names = [a.name for a in tower.amenities]

        response.append({
            "id": u.id,
            "unit_number": u.unit_number,
            "bedrooms": u.bedrooms,
            "rent": float(u.rent),
            "status": u.status,
            "tower_id": u.tower_id,
            "tower_name": tower.name,
            "amenities": amenity_names
        })

    return jsonify(response)


@user_bp.route("/bookings", methods=["POST"])
@jwt_required()
def create_booking():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    unit_id = data.get("unit_id")
    lease_start_date = data.get("lease_start_date")
    lease_end_date = data.get("lease_end_date")

    if not unit_id or not lease_start_date or not lease_end_date:
        return {"message": "unit_id, lease_start_date and lease_end_date are required"}, 400

    lease_start = date.fromisoformat(lease_start_date)
    lease_end = date.fromisoformat(lease_end_date)

    if lease_start < date.today():
        return {"message": "Lease start date cannot be in the past"}, 400

    lease_days = (lease_end - lease_start).days

    if lease_days < 30:
        return {"message": "Minimum lease period is 30 days"}, 400

    booking = Booking(
        user_id=user_id,
        unit_id=unit_id,
        status="PENDING",
        lease_start=lease_start,
        lease_end=lease_end
    )

    db.session.add(booking)
    db.session.commit()

    return {
        "message": "Booking requested",
        "lease_start": lease_start.isoformat(),
        "lease_end": lease_end.isoformat(),
        "lease_days": lease_days
    }, 201



@user_bp.route("/bookings", methods=["GET"])
@jwt_required()
def my_bookings():
    user_id = int(get_jwt_identity())
    status = request.args.get("status")

    query = (
        db.session.query(Booking, Unit, Tower)
        .join(Unit, Booking.unit_id == Unit.id)
        .join(Tower, Unit.tower_id == Tower.id)
        .filter(Booking.user_id == user_id)
    )

    if status:
        query = query.filter(Booking.status == status)

    bookings = query.all()

    return jsonify([
        {
            "booking_id": b.id,
            "status": b.status,
            "tower_name": t.name,
            "unit_number": u.unit_number,
            "bedrooms": u.bedrooms,
            "rent": float(u.rent),
            "lease_start": b.lease_start,
            "lease_end": b.lease_end
        }
        for b, u, t in bookings
    ])


@user_bp.route("/bookings/<int:booking_id>/cancel", methods=["PUT"])
@jwt_required()
def cancel_booking(booking_id):
    user_id = int(get_jwt_identity())

    booking = Booking.query.filter_by(
        id=booking_id,
        user_id=user_id
    ).first()

    if not booking:
        return {"message": "Booking not found"}, 404

    if booking.status == "DECLINED":
        return {"message": "Cannot cancel a declined booking"}, 400

    # If approved, free the unit
    if booking.status == "APPROVED":
        unit = Unit.query.get(booking.unit_id)
        unit.status = "AVAILABLE"

    booking.status = "CANCELLED"

    db.session.commit()

    return {"message": "Booking cancelled successfully"}

# from flask import jsonify
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from app.models import TenantProfile
from datetime import datetime
from app.models import TenantProfile
from app.utils.age import calculate_age
from datetime import date, timedelta
@user_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data.get("date_of_birth"):
        return {"message": "Date of birth is required"}, 400

    dob = datetime.strptime(data["date_of_birth"], "%Y-%m-%d").date()
    age = calculate_age(dob)

    # Age validation
    if age < 18:
        return {
            "message": "Tenant must be at least 18 years old",
            "age": age
        }, 400

    profile = TenantProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        profile = TenantProfile(user_id=user_id)
        db.session.add(profile)

    profile.tenant_type = data.get("tenant_type")
    profile.date_of_birth = dob

    profile.college_name = data.get("college_name")
    profile.department = data.get("department")

    profile.company_name = data.get("company_name")
    profile.designation = data.get("designation")

    profile.id_proof_type = data.get("id_proof_type")
    profile.id_proof_number = data.get("id_proof_number")

    db.session.commit()

    return {
        "message": "Tenant profile saved successfully",
        "age": age
    }



@user_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())

    profile = TenantProfile.query.filter_by(user_id=user_id).first()

    if not profile:
        return jsonify({}), 200   # empty profile (first time user)

    return jsonify({
        "tenant_type": profile.tenant_type,
        "date_of_birth": profile.date_of_birth.isoformat()
            if profile.date_of_birth else None,

        "college_name": profile.college_name,
        "department": profile.department,

        "company_name": profile.company_name,
        "designation": profile.designation,

        "id_proof_type": profile.id_proof_type,
        "id_proof_number": profile.id_proof_number
    }), 200


# user.py or public.py
@user_bp.route("/towers", methods=["GET"])
@jwt_required()
def get_towers_for_users():
    towers = Tower.query.all()
    return [
        {"id": t.id, "name": t.name}
        for t in towers
    ]
