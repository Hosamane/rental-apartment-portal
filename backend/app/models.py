# from flask_sqlalchemy import SQLAlchemy
# from werkzeug.security import generate_password_hash, check_password_hash


# db = SQLAlchemy()
# # bcrypt = Bcrypt()

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(120), unique=True)
#     password_hash = db.Column(db.String(255))

#     def set_password(self, password):
#         self.password_hash = generate_password_hash(password)

#     def check_password(self, password):
#         return check_password_hash(self.password_hash, password)


from app import db

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password_hash = db.Column(db.Text)
    role = db.Column(db.String(20))


# class Tower(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(50))


class Tower(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))

    amenities = db.relationship(
        "Amenity",
        secondary="tower_amenities",
        backref="towers"
    )


class Unit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tower_id = db.Column(db.Integer, db.ForeignKey("tower.id"))
    unit_number = db.Column(db.String(20))
    bedrooms = db.Column(db.Integer)
    rent = db.Column(db.Numeric)
    status = db.Column(db.String(20))


class Amenity(db.Model):
    __tablename__ = "amenities"   # ✅ THIS FIXES THE ERROR

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    unit_id = db.Column(db.Integer, db.ForeignKey("unit.id"))
    status = db.Column(db.String(20))

    lease_start = db.Column(db.Date)
    lease_end = db.Column(db.Date)
    vacated_on = db.Column(db.Date)


class TowerAmenity(db.Model):
    __tablename__ = "tower_amenities"

    tower_id = db.Column(
        db.Integer,
        db.ForeignKey("tower.id"),
        primary_key=True
    )

    amenity_id = db.Column(
        db.Integer,
        db.ForeignKey("amenities.id"),
        primary_key=True
    )

class TenantProfile(db.Model):
    __tablename__ = "tenant_profile"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    tenant_type = db.Column(db.String(20), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)

    college_name = db.Column(db.String(150))
    department = db.Column(db.String(100))

    company_name = db.Column(db.String(150))
    designation = db.Column(db.String(100))

    id_proof_type = db.Column(db.String(50))
    id_proof_number = db.Column(db.String(50))

