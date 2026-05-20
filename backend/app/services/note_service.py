from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.db.models import Lead, Note, User
from app.schemas.note import NoteCreate


def get_notes_by_lead(lead_id: str, db: Session):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found",
        )

    return (
        db.query(Note)
        .filter(Note.lead_id == lead_id)
        .order_by(Note.created_at.desc())
        .all()
    )


def create_note_for_lead(
    lead_id: str,
    payload: NoteCreate,
    current_user: User,
    db: Session,
):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found",
        )

    note = Note(
        lead_id=lead_id,
        user_id=current_user.id,
        content=payload.content,
    )

    db.add(note)
    db.commit()
    db.refresh(note)

    return note


def delete_note(note_id: str, db: Session):
    note = db.query(Note).filter(Note.id == note_id).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )

    db.delete(note)
    db.commit()

    return {
        "message": "Note deleted successfully"
    }