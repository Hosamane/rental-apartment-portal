import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:rmRvKicgQOKfloTywFxHOfBibypuopoS@postgres.railway.internal:5432/railway"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False


uri = os.getenv("DATABASE_URL")

if uri and uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = uri
