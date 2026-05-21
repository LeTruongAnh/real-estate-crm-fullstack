from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.routers.auth import get_current_user
from app.schemas.user import UserResponse
from app.services.user_service import get_all_users, get_sales_users, get_user_or_404


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "",
    response_model=list[UserResponse],
)
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_users(db, current_user)


@router.get(
    "/sales",
    response_model=list[UserResponse],
)
def list_sales_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_sales_users(db, current_user)


@router.get(
    "/{user_id}",
    response_model=UserResponse,
)
def get_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_or_404(user_id, db, current_user)