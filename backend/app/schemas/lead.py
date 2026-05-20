from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator


LeadSource = Literal["facebook", "website", "referral", "zalo", "other"]
LeadStatus = Literal["new", "contacted", "qualified", "negotiating", "won", "lost"]


def normalize_phone(value: str) -> str:
    return value.replace(" ", "").replace("-", "").replace(".", "")


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=8, max_length=20)
    email: EmailStr | None = None
    source: LeadSource = "other"
    interest: str = Field(..., min_length=2, max_length=255)
    budget: float | None = Field(default=None, ge=0)
    status: LeadStatus = "new"
    assigned_to: str | None = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        phone = normalize_phone(value)

        if not phone.isdigit():
            raise ValueError("Phone number must contain digits only")

        if len(phone) < 8 or len(phone) > 20:
            raise ValueError("Phone number must be between 8 and 20 digits")

        return phone


class LeadUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    phone: str | None = Field(default=None, min_length=8, max_length=20)
    email: EmailStr | None = None
    source: LeadSource | None = None
    interest: str | None = Field(default=None, min_length=2, max_length=255)
    budget: float | None = Field(default=None, ge=0)
    status: LeadStatus | None = None
    assigned_to: str | None = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        if value is None:
            return value

        phone = normalize_phone(value)

        if not phone.isdigit():
            raise ValueError("Phone number must contain digits only")

        if len(phone) < 8 or len(phone) > 20:
            raise ValueError("Phone number must be between 8 and 20 digits")

        return phone


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