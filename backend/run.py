from app import create_app, db
from app.utils.create_admin import create_default_admin
app = create_app()

with app.app_context():
    db.create_all()
    create_default_admin()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
