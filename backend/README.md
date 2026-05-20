Thay toàn bộ bằng bản này cho sạch:

# Real Estate CRM Backend

FastAPI backend for a Real Estate CRM full-stack application.

## Overview

This backend provides authentication, lead management, task management, customer notes, role-based access control, and dashboard summary APIs for a real estate sales CRM.

## Tech Stack

- FastAPI
- Python
- SQLAlchemy
- PostgreSQL
- Pydantic
- JWT Authentication
- pwdlib Argon2 password hashing

## Features

- Health check API
- PostgreSQL connection
- User registration
- JWT login
- Current user API
- Lead CRUD API
- Task CRUD API
- Lead notes API
- Dashboard summary API
- Basic role-based access control
- Phone number normalization
- Duplicate phone validation
- Input validation
- Seed data script

## Roles

| Role | Permission |
|---|---|
| admin | Manage all data |
| manager | Manage all leads and tasks |
| sales | Access assigned leads and tasks |
| viewer | Access dashboard only |

## Project Structure

```txt
backend/
  app/
    core/
    db/
    routers/
    schemas/
    services/
    main.py
  scripts/
    seed.py
  API_DOCS.md
  README.md
  requirements.txt
  .env.example
Run Locally

Create virtual environment:

python -m venv venv

Activate virtual environment on Windows PowerShell:

venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Create .env from .env.example:

DATABASE_URL=postgresql://postgres:your_password@localhost:5432/real_estate_crm
SECRET_KEY=replace-with-your-own-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

Run server:

uvicorn app.main:app --reload

Open API docs:

http://127.0.0.1:8000/docs
Seed Data

Run seed script:

python scripts/seed.py

If import fails on Windows PowerShell:

$env:PYTHONPATH="."
python scripts/seed.py

Sample accounts:

manager@example.com / password123
sales1@example.com / password123
sales2@example.com / password123
viewer@example.com / password123
Main Endpoints
GET  /health
GET  /db-health

POST /auth/register
POST /auth/login
GET  /auth/me

GET    /leads
POST   /leads
GET    /leads/{lead_id}
PUT    /leads/{lead_id}
DELETE /leads/{lead_id}

GET    /tasks
POST   /tasks
GET    /tasks/{task_id}
PUT    /tasks/{task_id}
DELETE /tasks/{task_id}

GET    /leads/{lead_id}/notes
POST   /leads/{lead_id}/notes
DELETE /notes/{note_id}

GET /dashboard/summary
Environment Variables
Variable	Description
DATABASE_URL	PostgreSQL connection string
SECRET_KEY	JWT signing secret
ALGORITHM	JWT algorithm
ACCESS_TOKEN_EXPIRE_MINUTES	Access token expiry time