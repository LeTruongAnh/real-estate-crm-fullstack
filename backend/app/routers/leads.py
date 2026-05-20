from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.routers.auth import get_current_user
from app.schemas.lead import LeadCreate, LeadResponse, LeadUpdate
from app.services.lead_service import (
    create_lead,
    delete_lead,
    get_all_leads,
    get_lead_or_404,
    update_lead,
)


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
    return get_all_leads(db, current_user)


@router.post(
    "",
    response_model=LeadResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_lead_endpoint(
    payload: LeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_lead(payload, db, current_user)


@router.get(
    "/{lead_id}",
    response_model=LeadResponse,
)
def get_lead_by_id(
    lead_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_lead_or_404(lead_id, db, current_user)


@router.put(
    "/{lead_id}",
    response_model=LeadResponse,
)
def update_lead_endpoint(
    lead_id: str,
    payload: LeadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_lead(lead_id, payload, db, current_user)


@router.delete(
    "/{lead_id}",
)
def delete_lead_endpoint(
    lead_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_lead(lead_id, db, current_user)