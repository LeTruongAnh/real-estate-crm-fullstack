# Real Estate CRM Backend

FastAPI backend for a Real Estate CRM full-stack application.

## Tech Stack

- FastAPI
- Python
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Pydantic

## Current Features

- Health check API
- PostgreSQL connection
- User registration
- JWT login
- Current user API
- Lead CRUD API
- Duplicate phone validation

## Run Locally

Create virtual environment:

```bash
python -m venv venv
Activate virtual environment:

venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Create .env:

DATABASE_URL=postgresql://postgres:your_password@localhost:5432/real_estate_crm
SECRET_KEY=change-this-secret-key-later
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

Run server:

uvicorn app.main:app --reload

Open API docs:

http://127.0.0.1:8000/docs
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

---

# Bước 7.6 — Kiểm tra cấu trúc backend

Sau bước này, cấu trúc nên là:

```txt
backend/
  app/
    core/
      config.py
      security.py
    db/
      database.py
      models.py
    routers/
      auth.py
      leads.py
    schemas/
      user.py
      lead.py
    services/
      lead_service.py
    main.py
  README.md
  requirements.txt
  .env