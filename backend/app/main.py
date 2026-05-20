from fastapi import FastAPI

from app.db.database import test_database_connection

app = FastAPI(
    title="Real Estate CRM API",
    description="Backend API for Real Estate CRM Full-stack App",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "Real Estate CRM API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }


@app.get("/db-health")
def db_health_check():
    result = test_database_connection()

    return {
        "database": "connected",
        "result": result
    }