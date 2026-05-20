from datetime import datetime

from pydantic import BaseModel, Field


class NoteCreate(BaseModel):
    content: str = Field(..., min_length=2)


class NoteResponse(BaseModel):
    id: str
    lead_id: str
    user_id: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True