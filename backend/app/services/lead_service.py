from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.db.models import Lead, User
from app.schemas.lead import LeadCreate, LeadUpdate
from app.core.permissions import is_admin_or_manager, is_sales, require_roles


def get_all_leads(db: Session, current_user: User):
    query = db.query(Lead)

    if is_admin_or_manager(current_user):
        return query.order_by(Lead.created_at.desc()).all()

    if is_sales(current_user):
        return (
            query
            .filter(Lead.assigned_to == current_user.id)
            .order_by(Lead.created_at.desc())
            .all()
        )

    if current_user.role == "viewer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Viewers cannot access leads",
        )

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to access leads",
    )


def get_lead_or_404(lead_id: str, db: Session, current_user: User | None = None):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found",
        )

    if current_user:
        if is_admin_or_manager(current_user):
            return lead

        if is_sales(current_user) and lead.assigned_to == current_user.id:
            return lead

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this lead",
        )

    return lead


def validate_assigned_user(assigned_to: str | None, db: Session):
    if not assigned_to:
        return

    assigned_user = db.query(User).filter(User.id == assigned_to).first()

    if not assigned_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assigned user not found",
        )


def create_lead(payload: LeadCreate, db: Session, current_user: User):
    require_roles(current_user, ["admin", "manager"])
    existing_lead = db.query(Lead).filter(Lead.phone == payload.phone).first()

    if existing_lead:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lead with this phone already exists",
        )

    validate_assigned_user(payload.assigned_to, db)

    lead = Lead(
        name=payload.name,
        phone=payload.phone,
        email=payload.email,
        source=payload.source,
        interest=payload.interest,
        budget=payload.budget,
        status=payload.status,
        assigned_to=payload.assigned_to,
    )

    db.add(lead)
    db.commit()
    db.refresh(lead)

    return lead


def update_lead(lead_id: str, payload: LeadUpdate, db: Session, current_user: User):
    lead = get_lead_or_404(lead_id, db, current_user)

    update_data = payload.model_dump(exclude_unset=True)

    if is_sales(current_user) and "assigned_to" in update_data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sales users cannot reassign leads",
        )

    if "phone" in update_data:
        existing_lead = (
            db.query(Lead)
            .filter(Lead.phone == update_data["phone"], Lead.id != lead_id)
            .first()
        )

        if existing_lead:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Lead with this phone already exists",
            )

    if "assigned_to" in update_data:
        validate_assigned_user(update_data["assigned_to"], db)

    for field, value in update_data.items():
        setattr(lead, field, value)

    db.commit()
    db.refresh(lead)

    return lead


def delete_lead(lead_id: str, db: Session, current_user: User):
    require_roles(current_user, ["admin", "manager"])

    lead = get_lead_or_404(lead_id, db)

    db.delete(lead)
    db.commit()

    return {
        "message": "Lead deleted successfully"
    }