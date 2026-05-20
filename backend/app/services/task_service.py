from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.db.models import Lead, Task, User
from app.schemas.task import TaskCreate, TaskUpdate


def get_all_tasks(db: Session):
    return db.query(Task).order_by(Task.created_at.desc()).all()


def get_task_or_404(task_id: str, db: Session):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task


def validate_lead_exists(lead_id: str | None, db: Session):
    if not lead_id:
        return

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lead not found",
        )


def validate_assignee_exists(assignee_id: str | None, db: Session):
    if not assignee_id:
        return

    user = db.query(User).filter(User.id == assignee_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assignee user not found",
        )


def create_task(payload: TaskCreate, db: Session):
    validate_lead_exists(payload.lead_id, db)
    validate_assignee_exists(payload.assignee_id, db)

    task = Task(
        lead_id=payload.lead_id,
        title=payload.title,
        description=payload.description,
        assignee_id=payload.assignee_id,
        status=payload.status,
        priority=payload.priority,
        deadline=payload.deadline,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


def update_task(task_id: str, payload: TaskUpdate, db: Session):
    task = get_task_or_404(task_id, db)

    update_data = payload.model_dump(exclude_unset=True)

    if "lead_id" in update_data:
        validate_lead_exists(update_data["lead_id"], db)

    if "assignee_id" in update_data:
        validate_assignee_exists(update_data["assignee_id"], db)

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    return task


def delete_task(task_id: str, db: Session):
    task = get_task_or_404(task_id, db)

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }