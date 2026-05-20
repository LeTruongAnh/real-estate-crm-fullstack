from fastapi import FastAPI

from app.db.database import Base, engine, test_database_connection
from app.db import models
from app.routers import auth, leads, tasks

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Real Estate CRM API",
    description="Backend API for Real Estate CRM Full-stack App",
    version="1.0.0",
)


app.include_router(auth.router)
app.include_router(leads.router)
app.include_router(tasks.router)

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