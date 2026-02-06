from app import db
from app.models import User
from werkzeug.security import generate_password_hash
import os
def create_default_admin():
    admin_email = os.getenv("ADMIN_EMAIL")
    # "admin@rental.com"
    admin_password = os.getenv("ADMIN_PASSWORD") 
    # "admin123"

    admin = User.query.filter_by(email=admin_email).first()

    if not admin:
        admin = User(
            name="Admin",
            email=admin_email,
            password_hash=generate_password_hash(admin_password),
            role="ADMIN"
        )
        db.session.add(admin)
        db.session.commit()
        print("✅ Default admin created")
    else:
        print("ℹ️ Admin already exists")
