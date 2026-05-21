from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.models import User


def get_all_users(db: Session, current_user: User):
    require_roles(current_user, ["admin", "manager"])

    return db.query(User).order_by(User.created_at.desc()).all()


def get_sales_users(db: Session, current_user: User):
    require_roles(current_user, ["admin", "manager"])

    return (
        db.query(User)
        .filter(User.role == "sales")
        .order_by(User.name.asc())
        .all()
    )


def get_user_or_404(user_id: str, db: Session, current_user: User):
    require_roles(current_user, ["admin", "manager"])

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user