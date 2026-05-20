from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.routers.auth import get_current_user
from app.schemas.note import NoteCreate, NoteResponse
from app.services.note_service import (
    create_note_for_lead,
    delete_note,
    get_notes_by_lead,
)


router = APIRouter(
    tags=["Notes"],
)


@router.get(
    "/leads/{lead_id}/notes",
    response_model=list[NoteResponse],
)
def get_lead_notes(
    lead_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_notes_by_lead(lead_id, db)


@router.post(
    "/leads/{lead_id}/notes",
    response_model=NoteResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_lead_note(
    lead_id: str,
    payload: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_note_for_lead(lead_id, payload, current_user, db)


@router.delete(
    "/notes/{note_id}",
)
def delete_note_endpoint(
    note_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_note(note_id, db)