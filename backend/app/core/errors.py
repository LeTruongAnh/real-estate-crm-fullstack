from fastapi import HTTPException, status


def not_found_error(resource_name: str):
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"{resource_name} not found",
    )


def bad_request_error(message: str):
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=message,
    )


def forbidden_error(message: str = "You do not have permission to perform this action"):
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=message,
    )