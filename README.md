# Real Estate CRM Full-stack App

A full-stack CRM system for real estate sales teams to manage leads, follow-up tasks, customer notes, and sales pipeline visibility.

## Business Problem

Real estate sales teams often manage customer leads manually using spreadsheets and chat messages. This can cause duplicate data, missed follow-ups, unclear task ownership, and poor visibility for managers.

## Solution

This app provides a centralized CRM dashboard where users can manage leads, create follow-up tasks, write customer notes, and track sales activities.

## Core Features

- User authentication
- JWT-based protected routes
- Role-based access control
- Lead management
- Task management
- Customer notes
- Dashboard summary
- Lead filtering and search
- Duplicate phone detection
- Overdue task tracking
- Seed data for demo

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic
- JWT Authentication
- pwdlib Argon2 password hashing

### Database

- PostgreSQL

## Main User Flow

1. Manager logs in.
2. Manager creates a new customer lead.
3. Manager assigns or tracks the lead.
4. Sales user adds notes after contacting the customer.
5. Sales user or manager creates follow-up tasks.
6. Manager views dashboard summary.

## Roles

| Role | Permission |
|---|---|
| admin | Manage all data and view global dashboard |
| manager | Manage all leads/tasks and view global dashboard |
| sales | Access assigned leads/tasks and personal dashboard |
| viewer | Access read-only global dashboard |

## Project Structure

```txt
real-estate-crm-fullstack/
  backend/
    app/
    scripts/
    API_DOCS.md
    README.md
    requirements.txt
  frontend/
    src/
      app/
      components/
      lib/
      types/

Backend Setup
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt

Create .env:

DATABASE_URL=postgresql://postgres:your_password@localhost:5432/real_estate_crm
SECRET_KEY=replace-with-your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

Run backend:

uvicorn app.main:app --reload

Seed demo data:

python scripts/seed.py

Backend docs:

http://127.0.0.1:8000/docs
Frontend Setup
cd frontend
npm install
npm run dev

Create .env.local:

NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

Frontend app:

http://localhost:3000
Demo Accounts
manager@example.com / password123
sales1@example.com / password123
sales2@example.com / password123
viewer@example.com / password123
API Overview
POST /auth/login
GET /auth/me
GET /leads
POST /leads
GET /leads/{id}
PUT /leads/{id}
GET /tasks
POST /tasks
GET /leads/{id}/notes
POST /leads/{id}/notes
GET /dashboard/summary
What I Learned
Building a full-stack application
Designing REST APIs
Connecting frontend to backend
Managing PostgreSQL database
Implementing JWT authentication
Applying role-based access control
Creating business logic for CRM workflows
Structuring a real-world project