import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:rmRvKicgQOKfloTywFxHOfBibypuopoS@postgres.railway.internal:5432/railway"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
