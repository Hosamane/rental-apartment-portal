
# import os

# class Config:
#     SQLALCHEMY_DATABASE_URI = "postgresql://postgres:postgres@db:5432/rental_db"
#     SQLALCHEMY_TRACK_MODIFICATIONS = False


import os

class Config:
    uri = os.getenv("DATABASE_URL")

    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI = uri
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")


