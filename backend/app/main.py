from fastapi import FastAPI

from app.db.database import Base, engine, test_database_connection
from app.db import models
from app.routers import auth, dashboard, leads, notes, tasks, users
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Real Estate CRM API",
    description="Backend API for Real Estate CRM Full-stack App",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(leads.router)
app.include_router(tasks.router)
app.include_router(notes.router)
app.include_router(dashboard.router)
app.include_router(users.router)

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