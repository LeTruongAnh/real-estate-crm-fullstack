# Real Estate CRM API Docs

Base URL:

```txt
http://127.0.0.1:8000

Auth
Register
POST /auth/register

Request:

{
  "name": "Manager User",
  "email": "manager@example.com",
  "password": "password123",
  "role": "manager"
}
Login
POST /auth/login

Request:

{
  "email": "manager@example.com",
  "password": "password123"
}

Response:

{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": "user_id",
    "name": "Manager User",
    "email": "manager@example.com",
    "role": "manager"
  }
}
Current User
GET /auth/me

Header:

Authorization: Bearer <access_token>
Leads
Get leads
GET /leads
Create lead
POST /leads

Request:

{
  "name": "Nguyen Van A",
  "phone": "0909123456",
  "email": "vana@example.com",
  "source": "facebook",
  "interest": "2-bedroom apartment",
  "budget": 2500000000,
  "status": "new",
  "assigned_to": "user_id"
}
Update lead
PUT /leads/{lead_id}

Request:

{
  "status": "contacted",
  "interest": "2-bedroom apartment near river"
}
Delete lead
DELETE /leads/{lead_id}
Tasks
Get tasks
GET /tasks
Create task
POST /tasks

Request:

{
  "lead_id": "lead_id",
  "title": "Call customer about payment policy",
  "description": "Send brochure and explain payment timeline",
  "assignee_id": "user_id",
  "status": "todo",
  "priority": "high",
  "deadline": "2026-06-05"
}
Update task
PUT /tasks/{task_id}

Request:

{
  "status": "in_progress"
}
Notes
Get lead notes
GET /leads/{lead_id}/notes
Create lead note
POST /leads/{lead_id}/notes

Request:

{
  "content": "Customer asked for bank loan support and payment schedule."
}
Delete note
DELETE /notes/{note_id}
Dashboard
Summary
GET /dashboard/summary

Response:

{
  "total_leads": 5,
  "new_leads": 1,
  "qualified_leads": 1,
  "won_leads": 1,
  "overdue_tasks": 1,
  "high_priority_tasks": 3,
  "leads_by_source": [
    {
      "source": "facebook",
      "count": 2
    }
  ]
}