from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field


TaskStatus = Literal["todo", "in_progress", "done", "blocked"]
TaskPriority = Literal["low", "medium", "high"]


class TaskCreate(BaseModel):
    lead_id: str | None = None
    title: str = Field(..., min_length=2, max_length=150)
    description: str | None = Field(default=None, max_length=1000)
    assignee_id: str
    status: TaskStatus = "todo"
    priority: TaskPriority = "medium"
    deadline: date | None = None


class TaskUpdate(BaseModel):
    lead_id: str | None = None
    title: str | None = Field(default=None, min_length=2, max_length=150)
    description: str | None = Field(default=None, max_length=1000)
    assignee_id: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    deadline: date | None = None


class TaskResponse(BaseModel):
    id: str
    lead_id: str | None
    title: str
    description: str | None
    assignee_id: str
    status: str
    priority: str
    deadline: date | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True