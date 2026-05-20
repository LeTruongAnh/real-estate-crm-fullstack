from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Lead, User
from app.routers.auth import get_current_user
from app.schemas.lead import LeadCreate, LeadResponse, LeadUpdate


router = APIRouter(
    prefix="/leads",
    tags=["Leads"],
)


@router.get(
    "",
    response_model=list[LeadResponse],
)
def get_leads(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    leads = db.query(Lead).order_by(Lead.created_at.desc()).all()
    return leads


@router.post(
    "",
    response_model=LeadResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_lead(
    payload: LeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_lead = db.query(Lead).filter(Lead.phone == payload.phone).first()

    if existing_lead:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lead with this phone already exists",
        )

    if payload.assigned_to:
        assigned_user = db.query(User).filter(User.id == payload.assigned_to).first()

        if not assigned_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assigned user not found",
            )

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


@router.get(
    "/{lead_id}",
    response_model=LeadResponse,
)
def get_lead_by_id(
    lead_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found",
        )

    return lead


@router.put(
    "/{lead_id}",
    response_model=LeadResponse,
)
def update_lead(
    lead_id: str,
    payload: LeadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

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

    if "assigned_to" in update_data and update_data["assigned_to"]:
        assigned_user = db.query(User).filter(User.id == update_data["assigned_to"]).first()

        if not assigned_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assigned user not found",
            )

    for field, value in update_data.items():
        setattr(lead, field, value)

    db.commit()
    db.refresh(lead)

    return lead


@router.delete(
    "/{lead_id}",
)
def delete_lead(
    lead_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found",
        )

    db.delete(lead)
    db.commit()

    return {
        "message": "Lead deleted successfully"
    }