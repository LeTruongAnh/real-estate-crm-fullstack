# Real Estate CRM Full-stack App Case Study

## Overview

Real Estate CRM is a full-stack web application for sales teams to manage customer leads, follow-up tasks, notes, and sales visibility.

## Business Problem

In many real estate teams, customer leads are managed manually through spreadsheets and chat messages. This often leads to missed follow-ups, duplicate customer records, unclear ownership, and limited visibility for managers.

## Solution

I built a CRM system that centralizes lead data, allows sales users to manage follow-up tasks, and gives managers a dashboard view of sales activities.

## Target Users

- Sales managers
- Sales consultants
- Business owners
- Real estate project teams

## Core Features

- Login and JWT authentication
- Role-based access control
- Lead management
- Task management
- Customer notes
- Dashboard summary
- Lead filtering and search
- Duplicate phone validation
- Overdue task detection

## Technical Architecture

The frontend is built with Next.js and TypeScript. The backend is built with FastAPI and exposes REST APIs. PostgreSQL is used as the main database. JWT authentication protects private routes.

## Data Flow

User action on frontend → API request → FastAPI validation → business logic → PostgreSQL query → API response → frontend UI update.

## Role Logic

- Manager can view and manage all data.
- Sales user can view assigned leads and tasks.
- Viewer can view the dashboard only.
- Dashboard summary is scoped by role.

## Key Backend Decisions

- SQLAlchemy models represent database tables.
- Pydantic schemas validate API input and output.
- Service layer separates business logic from routers.
- JWT token stores the user identity through the `sub` field.
- Passwords are hashed with Argon2 using `pwdlib`.

## Key Frontend Decisions

- Next.js App Router is used for routing.
- API calls are centralized in `src/lib/api.ts`.
- Protected pages use a client-side auth guard.
- Loading, error, and empty states are handled in the UI.
- Leads page supports search and filtering.

## What I Learned

This project helped me practice full-stack development, API design, database modeling, authentication, role-based permission, frontend integration, and business workflow implementation.