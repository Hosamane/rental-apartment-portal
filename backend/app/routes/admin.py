
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from app.models import Tower, Unit, Booking, Amenity, TowerAmenity, User, TenantProfile
from app import db
from sqlalchemy import func, asc, desc
from datetime import date, timedelta

admin_bp = Blueprint("admin", __name__)

# ------------------------------------------------
# HELPER: ADMIN CHECK
# ------------------------------------------------
def admin_only():
    claims = get_jwt()
    return claims.get("role") == "ADMIN"


# =================================================
# TOWER CRUD
# =================================================

# CREATE Tower
@admin_bp.route("/towers", methods=["POST"])
@jwt_required()
def create_tower():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    data = request.get_json()
    if not data or "name" not in data:
        return {"message": "Tower name is required"}, 400

    tower = Tower(name=data["name"])
    db.session.add(tower)
    db.session.commit()

    return {"message": "Tower created", "tower_id": tower.id}, 201


# READ all Towers
@admin_bp.route("/towers", methods=["GET"])
@jwt_required()
def get_towers():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    towers = Tower.query.all()
    return jsonify([
        {"id": t.id, "name": t.name} for t in towers
    ])


# UPDATE Tower
@admin_bp.route("/towers/<int:id>", methods=["PUT"])
@jwt_required()
def update_tower(id):
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    tower = Tower.query.get_or_404(id)
    data = request.get_json()

    if "name" in data:
        tower.name = data["name"]

    db.session.commit()
    return {"message": "Tower updated"}


# DELETE Tower
@admin_bp.route("/towers/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_tower(id):
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    tower = Tower.query.get_or_404(id)
    db.session.delete(tower)
    db.session.commit()

    return {"message": "Tower deleted"}


# =================================================
# UNIT CRUD
# =================================================

# CREATE Unit
@admin_bp.route("/units", methods=["POST"])
@jwt_required()
def create_unit():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    data = request.get_json()
    required = ["tower_id", "unit_number", "bedrooms", "rent"]

    if not data or not all(k in data for k in required):
        return {
            "message": "tower_id, unit_number, bedrooms, rent required"
        }, 400

    unit = Unit(
        tower_id=data["tower_id"],
        unit_number=data["unit_number"],
        bedrooms=data["bedrooms"],
        rent=data["rent"],
        status="AVAILABLE"
    )

    db.session.add(unit)
    db.session.commit()

    return {"message": "Unit created", "unit_id": unit.id}, 201


# READ all Units
@admin_bp.route("/units", methods=["GET"])
@jwt_required()
def get_units():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    units = Unit.query.all()
    return jsonify([
        {
            "id": u.id,
            "tower_id": u.tower_id,
            "unit_number": u.unit_number,
            "bedrooms": u.bedrooms,
            "rent": float(u.rent),
            "status": u.status
        } for u in units
    ])


# UPDATE Unit
@admin_bp.route("/units/<int:id>", methods=["PUT"])
@jwt_required()
def update_unit(id):
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    unit = Unit.query.get_or_404(id)
    data = request.get_json()

    unit.unit_number = data.get("unit_number", unit.unit_number)
    unit.bedrooms = data.get("bedrooms", unit.bedrooms)
    unit.rent = data.get("rent", unit.rent)
    unit.status = data.get("status", unit.status)

    db.session.commit()
    return {"message": "Unit updated"}


# DELETE Unit
@admin_bp.route("/units/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_unit(id):
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    unit = Unit.query.get_or_404(id)
    db.session.delete(unit)
    db.session.commit()

    return {"message": "Unit deleted"}


# =================================================
# BOOKING CRUD
# =================================================

# READ all Bookings
@admin_bp.route("/bookings", methods=["GET"])
@jwt_required()
def get_bookings():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    status = request.args.get("status")

    query = Booking.query

    if status:
        query = query.filter_by(status=status)

    bookings = query.all()

    return [
        {
            "id": b.id,
            "user_id": b.user_id,
            "unit_id": b.unit_id,
            "status": b.status
        } for b in bookings
    ]


# UPDATE Booking (Approve / Decline)
@admin_bp.route("/bookings/<int:id>", methods=["PUT"])
@jwt_required()
def update_booking(id):
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    booking = Booking.query.get_or_404(id)
    data = request.get_json()

    if "status" not in data:
        return {"message": "Status required"}, 400

    booking.status = data["status"]

    # Business logic
    if data["status"] == "APPROVED":
        unit = Unit.query.get(booking.unit_id)
        unit.status = "OCCUPIED"

    db.session.commit()
    return {"message": "Booking updated"}


# DELETE Booking
@admin_bp.route("/bookings/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_booking(id):
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    booking = Booking.query.get_or_404(id)
    db.session.delete(booking)
    db.session.commit()

    return {"message": "Booking deleted"}

# GET TOWER BY ID
@admin_bp.route("/towers/<int:id>", methods=["GET"])
@jwt_required()
def get_tower_by_id(id):
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    tower = Tower.query.get_or_404(id)

    return {
        "id": tower.id,
        "name": tower.name
    }


# GET UNITS BY ID
@admin_bp.route("/units/<int:id>", methods=["GET"])
@jwt_required()
def get_unit_by_id(id):
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    unit = Unit.query.get_or_404(id)

    return {
        "id": unit.id,
        "tower_id": unit.tower_id,
        "unit_number": unit.unit_number,
        "bedrooms": unit.bedrooms,
        "rent": float(unit.rent),
        "status": unit.status
    }


# GET BOOKINGS BY ID
@admin_bp.route("/bookings/<int:id>", methods=["GET"])
@jwt_required()
def get_booking_by_id(id):
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    booking = Booking.query.get_or_404(id)

    return {
        "id": booking.id,
        "user_id": booking.user_id,
        "unit_id": booking.unit_id,
        "status": booking.status
    }

@admin_bp.route("/amenities", methods=["POST"])
@jwt_required()
def create_amenity():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    data = request.get_json()
    if not data or "name" not in data:
        return {"message": "Amenity name required"}, 400

    amenity = Amenity(name=data["name"])
    db.session.add(amenity)
    db.session.commit()

    return {"message": "Amenity created", "id": amenity.id}, 201

@admin_bp.route("/amenities", methods=["GET"])
@jwt_required()
def get_amenities():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    amenities = Amenity.query.all()
    return jsonify([
        {
            "id": a.id,
            "name": a.name
        } for a in amenities
    ])



@admin_bp.route("/amenities/<int:id>", methods=["PUT"])
@jwt_required()
def update_amenity(id):
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    amenity = Amenity.query.get_or_404(id)
    data = request.get_json()

    if "name" in data:
        amenity.name = data["name"]

    db.session.commit()
    return {"message": "Amenity updated"}



@admin_bp.route("/amenities/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_amenity(id):
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    amenity = Amenity.query.get_or_404(id)
    db.session.delete(amenity)
    db.session.commit()

    return {"message": "Amenity deleted"}


# OCCUPANCY REPORT

@admin_bp.route("/reports/occupancy", methods=["GET"])
@jwt_required()
def occupancy_report():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    view = request.args.get("view", "TOTAL").upper()
    tower_id = request.args.get("tower_id", type=int)
    sort = request.args.get("sort")  # rent_asc / rent_desc

    # Base query
    query = Unit.query
    if tower_id:
        query = query.filter_by(tower_id=tower_id)

    # Sorting
    if sort == "rent_asc":
        query = query.order_by(asc(Unit.rent))
    elif sort == "rent_desc":
        query = query.order_by(desc(Unit.rent))

    def serialize_unit(u):
        return {
            "id": u.id,
            "tower_id": u.tower_id,
            "unit_number": u.unit_number,
            "bedrooms": u.bedrooms,
            "rent": float(u.rent),
            "status": u.status
        }

    if view == "AVAILABLE":
        units = query.filter_by(status="AVAILABLE").all()
        return {
            "view": "AVAILABLE",
            "tower_id": tower_id,
            "sorted_by": sort,
            "count": len(units),
            "units": [serialize_unit(u) for u in units]
        }

    if view == "OCCUPIED":
        units = query.filter_by(status="OCCUPIED").all()
        return {
            "view": "OCCUPIED",
            "tower_id": tower_id,
            "sorted_by": sort,
            "count": len(units),
            "units": [serialize_unit(u) for u in units]
        }

    # DEFAULT → TOTAL
    all_units = query.all()
    available = query.filter_by(status="AVAILABLE").count()
    occupied = query.filter_by(status="OCCUPIED").count()

    return {
        "view": "TOTAL",
        "tower_id": tower_id,
        "sorted_by": sort,
        "summary": {
            "total_units": len(all_units),
            "available": available,
            "occupied": occupied
        },
        "units": [serialize_unit(u) for u in all_units]
    }



# BOOKING STATUS REPORT

@admin_bp.route("/reports/bookings", methods=["GET"])
@jwt_required()
def booking_status_report():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    status_filter = request.args.get("status")  # APPROVED / PENDING / DECLINED / None

    query = Booking.query

    if status_filter in ["APPROVED", "PENDING", "DECLINED"]:
        query = query.filter_by(status=status_filter)

    bookings = query.all()

    return {
        "filter": status_filter or "ALL",
        "total": len(bookings),
        "bookings": [
            {
                "id": b.id,
                "user_id": b.user_id,
                "unit_id": b.unit_id,
                "status": b.status
            } for b in bookings
        ]
    }



# TOWER-WISE OCCUPANCY REPORT
@admin_bp.route("/reports/tower-occupancy", methods=["GET"])
@jwt_required()
def tower_occupancy_report():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    tower_id = request.args.get("tower_id", type=int)
    status_filter = request.args.get("status")  # AVAILABLE / OCCUPIED / None

    # Select towers
    if tower_id:
        towers = Tower.query.filter_by(id=tower_id).all()
    else:
        towers = Tower.query.all()

    report = []

    for tower in towers:
        query = Unit.query.filter_by(tower_id=tower.id)

        if status_filter in ["AVAILABLE", "OCCUPIED"]:
            query = query.filter_by(status=status_filter)

        units = query.all()

        report.append({
            "tower_id": tower.id,
            "tower": tower.name,
            "total_units": len(units),
            "units": [
                {
                    "id": u.id,
                    "unit_number": u.unit_number,
                    "bedrooms": u.bedrooms,
                    "rent": float(u.rent),
                    "status": u.status
                } for u in units
            ]
        })

    return report


@admin_bp.route("/tower-amenities", methods=["POST"])
@jwt_required()
def add_tower_amenities():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    data = request.get_json()
    tower_id = data.get("tower_id")
    amenity_ids = data.get("amenity_ids", [])

    for aid in amenity_ids:
        exists = TowerAmenity.query.filter_by(
            tower_id=tower_id,
            amenity_id=aid
        ).first()

        if not exists:
            db.session.add(TowerAmenity(
                tower_id=tower_id,
                amenity_id=aid
            ))

    db.session.commit()
    return {"message": "Amenities added to tower"}


@admin_bp.route("/tower-amenities/<int:tower_id>", methods=["GET"])
@jwt_required()
def get_tower_amenities(tower_id):
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    tower = Tower.query.get_or_404(tower_id)

    return {
        "tower_id": tower.id,
        "tower_name": tower.name,
        "amenities": [
            {"id": a.id, "name": a.name}
            for a in tower.amenities
        ]
    }


@admin_bp.route("/tower-amenities/<int:tower_id>", methods=["PUT"])
@jwt_required()
def update_tower_amenities(tower_id):
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    data = request.get_json()
    amenity_ids = data.get("amenity_ids", [])

    # Remove existing
    TowerAmenity.query.filter_by(tower_id=tower_id).delete()

    # Add new
    for aid in amenity_ids:
        db.session.add(TowerAmenity(
            tower_id=tower_id,
            amenity_id=aid
        ))

    db.session.commit()
    return {"message": "Tower amenities updated"}




@admin_bp.route("/tower-amenities", methods=["DELETE"])
@jwt_required()
def bulk_delete_tower_amenities():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    data = request.get_json()
    tower_id = data.get("tower_id")
    amenity_ids = data.get("amenity_ids", [])

    if not tower_id or not amenity_ids:
        return {
            "message": "tower_id and amenity_ids are required"
        }, 400

    TowerAmenity.query.filter(
        TowerAmenity.tower_id == tower_id,
        TowerAmenity.amenity_id.in_(amenity_ids)
    ).delete(synchronize_session=False)

    db.session.commit()

    return {
        "message": "Selected amenities removed from tower"
    }



# @admin_bp.route("/amenities", methods=["GET"])
# @jwt_required()
# def get_all_amenities():
#     if not admin_only():
#         return {"message": "Unauthorized"}, 403

#     amenities = Amenity.query.all()
#     return {
#         "mode": "ALL",
#         "amenities": [
#             {"id": a.id, "name": a.name}
#             for a in amenities
#         ]
#     }

@admin_bp.route("/tower-amenities", methods=["GET"])
@jwt_required()
def get_all_tower_amenities():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    towers = Tower.query.all()
    response = []

    for tower in towers:
        response.append({
            "tower_id": tower.id,
            "tower_name": tower.name,
            "amenities": [
                {"id": a.id, "name": a.name}
                for a in tower.amenities
            ]
        })

    return response


@admin_bp.route("/bookings/<int:booking_id>/approve", methods=["PUT"])
@jwt_required()
def approve_booking(booking_id):
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    booking = Booking.query.get_or_404(booking_id)

    # Safety check
    if booking.status != "PENDING":
        return {
            "message": "Only pending bookings can be approved"
        }, 400

    unit_id = booking.unit_id

    #  Approve this booking
    booking.status = "APPROVED"

    #  Mark unit as occupied
    unit = Unit.query.get(unit_id)
    unit.status = "OCCUPIED"

    #  Auto-reject all OTHER pending bookings for same unit
    Booking.query.filter(
        Booking.unit_id == unit_id,
        Booking.id != booking_id,
        Booking.status == "PENDING"
    ).update(
        {"status": "DECLINED"},
        synchronize_session=False
    )

    db.session.commit()

    return {
        "message": "Booking approved. Other requests auto-declined."
    }


@admin_bp.route("/tenants", methods=["GET"])
@jwt_required()
def get_tenants():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    view_type = request.args.get("type", "all")
    tower_id = request.args.get("tower_id", type=int)
    unit_id = request.args.get("unit_id", type=int)
    tenant_type = request.args.get("tenant_type")
    lease_ending_days = request.args.get("lease_ending_days", type=int)

    query = (
        db.session.query(Booking, User, Unit, Tower, TenantProfile)
        .join(User, Booking.user_id == User.id)
        .join(Unit, Booking.unit_id == Unit.id)
        .join(Tower, Unit.tower_id == Tower.id)
        .outerjoin(TenantProfile, TenantProfile.user_id == User.id)
    )

    if view_type == "current":
        query = query.filter(
            Booking.status == "APPROVED",
            Booking.vacated_on.is_(None)
        )

    elif view_type == "previous":
        query = query.filter(Booking.vacated_on.isnot(None))

    if tower_id:
        query = query.filter(Tower.id == tower_id)

    if unit_id:
        query = query.filter(Unit.id == unit_id)

    if tenant_type:
        query = query.filter(TenantProfile.tenant_type == tenant_type.upper())

    if lease_ending_days:
        today = date.today()
        end_date = today + timedelta(days=lease_ending_days)

        query = query.filter(
            Booking.lease_end.isnot(None),
            Booking.vacated_on.is_(None),
            Booking.lease_end <= end_date
        )

    results = query.all()

    tenants = []
    for booking, user, unit, tower, profile in results:
        tenants.append({
            "tenant_id": user.id,
            "name": user.name,
            "email": user.email,
            "tenant_type": profile.tenant_type if profile else None,
            "tower_id": tower.id,
            "tower": tower.name,
            "unit_id": unit.id,
            "unit": unit.unit_number,
            "lease_start": booking.lease_start,
            "lease_end": booking.lease_end,
            "current": booking.vacated_on is None
        })

    return {
        "count": len(tenants),
        "tenants": tenants
    }


@admin_bp.route("/tenants/check", methods=["GET"])
@jwt_required()
def check_tenant():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    user_id = request.args.get("user_id", type=int)
    email = request.args.get("email")
    unit_id = request.args.get("unit_id", type=int)
    tower_id = request.args.get("tower_id", type=int)
    check_type = request.args.get("type")

    provided = [p for p in [user_id, email, unit_id, tower_id, check_type] if p is not None]

    if not (
        len(provided) == 1 or
        (len(provided) == 2 and tower_id and unit_id)
    ):
        return {
            "message": "Invalid parameters. Use ONE filter or tower_id + unit_id"
        }, 400

    # USER
    if user_id:
        booking = Booking.query.filter(
            Booking.user_id == user_id,
            Booking.status == "APPROVED",
            Booking.vacated_on.is_(None)
        ).first()
        return {"user_id": user_id, "is_current_tenant": booking is not None}

    # EMAIL
    if email:
        user = User.query.filter_by(email=email).first()
        if not user:
            return {"message": "User not found"}, 404

        booking = Booking.query.filter(
            Booking.user_id == user.id,
            Booking.status == "APPROVED",
            Booking.vacated_on.is_(None)
        ).first()
        return {
            "user_id": user.id,
            "email": user.email,
            "is_current_tenant": booking is not None
        }

    # UNIT
    if unit_id and not tower_id:
        booking = Booking.query.filter(
            Booking.unit_id == unit_id,
            Booking.status == "APPROVED",
            Booking.vacated_on.is_(None)
        ).first()
        return {
            "unit_id": unit_id,
            "occupied": booking is not None,
            "tenant_user_id": booking.user_id if booking else None
        }

    # TOWER + UNIT
    if tower_id and unit_id:
        unit = Unit.query.filter_by(id=unit_id, tower_id=tower_id).first()
        if not unit:
            return {"message": "Unit does not belong to tower"}, 400

        booking = Booking.query.filter(
            Booking.unit_id == unit_id,
            Booking.status == "APPROVED",
            Booking.vacated_on.is_(None)
        ).first()

        if not booking:
            return {"tower_id": tower_id, "unit_id": unit_id, "occupied": False}

        user = User.query.get(booking.user_id)
        return {
            "tower_id": tower_id,
            "unit_id": unit.id,
            "unit_number": unit.unit_number,
            "occupied": True,
            "tenant": {
                "user_id": user.id,
                "name": user.name,
                "email": user.email,
                "lease_start": booking.lease_start,
                "lease_end": booking.lease_end
            }
        }

    # TOWER
    if tower_id:
        bookings = (
            db.session.query(Booking, Unit, User)
            .join(Unit, Booking.unit_id == Unit.id)
            .join(User, Booking.user_id == User.id)
            .filter(
                Unit.tower_id == tower_id,
                Booking.status == "APPROVED",
                Booking.vacated_on.is_(None)
            )
            .all()
        )

        return {
            "tower_id": tower_id,
            "occupied_units": len(bookings),
            "tenants": [
                {
                    "user_id": user.id,
                    "name": user.name,
                    "unit_id": unit.id,
                    "unit_number": unit.unit_number,
                    "lease_end": booking.lease_end
                }
                for booking, unit, user in bookings
            ]
        }

    # ALL CURRENT
    if check_type == "current":
        bookings = Booking.query.filter(
            Booking.status == "APPROVED",
            Booking.vacated_on.is_(None)
        ).all()

        return {
            "count": len(bookings),
            "current_tenants": [
                {
                    "user_id": b.user_id,
                    "unit_id": b.unit_id,
                    "lease_end": b.lease_end
                } for b in bookings
            ]
        }

    return {"message": "Invalid request"}, 400


@admin_bp.route("/reports/vacant-units", methods=["GET"])
@jwt_required()
def vacant_units_in_tower():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    tower_id = request.args.get("tower_id", type=int)

    if not tower_id:
        return {"message": "tower_id is required"}, 400

    tower = Tower.query.get_or_404(tower_id)

    vacant_units = Unit.query.filter_by(
        tower_id=tower_id,
        status="AVAILABLE"
    ).all()

    return {
        "tower_id": tower.id,
        "tower_name": tower.name,
        "total_vacant_units": len(vacant_units),
        "vacant_units": [
            {
                "unit_id": u.id,
                "unit_number": u.unit_number,
                "bedrooms": u.bedrooms,
                "rent": float(u.rent),
                "status": u.status
            }
            for u in vacant_units
        ]
    }


@admin_bp.route("/reports/vacant-units/all", methods=["GET"])
@jwt_required()
def vacant_units_all_towers():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    towers = Tower.query.all()
    result = []
    total_vacant = 0

    for tower in towers:
        units = Unit.query.filter_by(
            tower_id=tower.id,
            status="AVAILABLE"
        ).all()

        if units:
            result.append({
                "tower_id": tower.id,
                "tower_name": tower.name,
                "vacant_count": len(units),
                "units": [
                    {
                        "unit_id": u.id,
                        "unit_number": u.unit_number,
                        "bedrooms": u.bedrooms,
                        "rent": float(u.rent)
                    }
                    for u in units
                ]
            })
            total_vacant += len(units)

    return {
        "total_vacant_units": total_vacant,
        "towers": result
    }


@admin_bp.route("/reports/occupancy-per-tower", methods=["GET"])
@jwt_required()
def occupancy_percentage_per_tower():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    towers = Tower.query.all()
    report = []

    for tower in towers:
        total_units = Unit.query.filter_by(tower_id=tower.id).count()
        occupied_units = Unit.query.filter_by(
            tower_id=tower.id,
            status="OCCUPIED"
        ).count()

        vacant_units = total_units - occupied_units

        occupancy_percentage = (
            round((occupied_units / total_units) * 100, 2)
            if total_units > 0 else 0
        )

        report.append({
            "tower_id": tower.id,
            "tower_name": tower.name,
            "total_units": total_units,
            "occupied_units": occupied_units,
            "vacant_units": vacant_units,
            "occupancy_percentage": occupancy_percentage
        })

    return {
        "total_towers": len(report),
        "towers": report
    }


@admin_bp.route("/reports/overall-occupancy", methods=["GET"])
@jwt_required()
def overall_occupancy():
    if not admin_only():
        return {"message": "Unauthorized"}, 403

    total_units = Unit.query.count()
    occupied_units = Unit.query.filter_by(status="OCCUPIED").count()
    vacant_units = total_units - occupied_units

    occupancy_percentage = (
        round((occupied_units / total_units) * 100, 2)
        if total_units > 0 else 0
    )

    return {
        "total_units": total_units,
        "occupied_units": occupied_units,
        "vacant_units": vacant_units,
        "overall_occupancy_percentage": occupancy_percentage
    }
