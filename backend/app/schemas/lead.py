from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


LeadSource = Literal["facebook", "website", "referral", "zalo", "other"]
LeadStatus = Literal["new", "contacted", "qualified", "negotiating", "won", "lost"]


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=8)
    email: EmailStr | None = None
    source: LeadSource = "other"
    interest: str = Field(..., min_length=2)
    budget: float | None = None
    status: LeadStatus = "new"
    assigned_to: str | None = None


class LeadUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2)
    phone: str | None = Field(default=None, min_length=8)
    email: EmailStr | None = None
    source: LeadSource | None = None
    interest: str | None = Field(default=None, min_length=2)
    budget: float | None = None
    status: LeadStatus | None = None
    assigned_to: str | None = None


class LeadResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: EmailStr | None
    source: str
    interest: str
    budget: float | None
    status: str
    assigned_to: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True