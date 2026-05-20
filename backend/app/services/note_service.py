from sqlalchemy.orm import Session

from app.core.errors import not_found_error
from app.db.models import Lead, Note, User
from app.schemas.note import NoteCreate


def get_lead_or_404(lead_id: str, db: Session):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        not_found_error("Lead")

    return lead


def get_notes_by_lead(lead_id: str, db: Session):
    get_lead_or_404(lead_id, db)

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
    get_lead_or_404(lead_id, db)

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
        not_found_error("Note")

    db.delete(note)
    db.commit()

    return {
        "message": "Note deleted successfully"
    }