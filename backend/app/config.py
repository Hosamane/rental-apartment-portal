
# import os

# class Config:
#     SQLALCHEMY_DATABASE_URI = "postgresql://postgres:postgres@db:5432/rental_db"
#     SQLALCHEMY_TRACK_MODIFICATIONS = False


import os

class Config:
    uri = os.getenv("DATABASE_URL")

    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)

    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
