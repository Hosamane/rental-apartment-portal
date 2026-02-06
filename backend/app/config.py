
import os

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:postgres@db:5432/rental_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "super-secret-key"

