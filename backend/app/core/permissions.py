from fastapi import HTTPException, status

from app.db.models import User


def require_roles(current_user: User, allowed_roles: list[str]) -> None:
    if current_user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action",
        )


def is_admin_or_manager(current_user: User) -> bool:
    return current_user.role in ["admin", "manager"]


def is_sales(current_user: User) -> bool:
    return current_user.role == "sales"


def is_viewer(current_user: User) -> bool:
    return current_user.role == "viewer"