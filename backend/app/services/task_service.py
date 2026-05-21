from sqlalchemy.orm import Session

from app.core.errors import bad_request_error, forbidden_error, not_found_error
from app.core.permissions import is_admin_or_manager, is_sales, require_roles
from app.db.models import Lead, Task, User
from app.schemas.task import TaskCreate, TaskUpdate


def get_all_tasks(db: Session, current_user: User):
    query = db.query(Task)

    if is_admin_or_manager(current_user):
        return query.order_by(Task.created_at.desc()).all()

    if is_sales(current_user):
        return (
            query
            .filter(Task.assignee_id == current_user.id)
            .order_by(Task.created_at.desc())
            .all()
        )

    if current_user.role == "viewer":
        forbidden_error("Viewers cannot access tasks")

    forbidden_error("You do not have permission to access tasks")


def get_task_or_404(task_id: str, db: Session, current_user: User | None = None):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        not_found_error("Task")

    if current_user:
        if is_admin_or_manager(current_user):
            return task

        if is_sales(current_user) and task.assignee_id == current_user.id:
            return task

        forbidden_error("You do not have permission to access this task")

    return task


def validate_lead_exists(lead_id: str | None, db: Session):
    if not lead_id:
        return

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        bad_request_error("Lead not found")


def validate_assignee_exists(assignee_id: str | None, db: Session):
    if not assignee_id:
        return

    user = db.query(User).filter(User.id == assignee_id).first()

    if not user:
        bad_request_error("Assignee user not found")


def create_task(payload: TaskCreate, db: Session, current_user: User):
    validate_lead_exists(payload.lead_id, db)
    validate_assignee_exists(payload.assignee_id, db)

    if is_admin_or_manager(current_user):
        pass

    elif is_sales(current_user):
        if payload.assignee_id != current_user.id:
            forbidden_error("Sales users can only assign tasks to themselves")

        if not payload.lead_id:
            forbidden_error("Sales users can only create tasks for assigned leads")

        lead = db.query(Lead).filter(Lead.id == payload.lead_id).first()

        if not lead:
            bad_request_error("Lead not found")

        if lead.assigned_to != current_user.id:
            forbidden_error("Sales users can only create tasks for their own leads")

    else:
        forbidden_error("You do not have permission to create tasks")

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


def update_task(task_id: str, payload: TaskUpdate, db: Session, current_user: User):
    task = get_task_or_404(task_id, db, current_user)

    update_data = payload.model_dump(exclude_unset=True)

    if is_sales(current_user) and "assignee_id" in update_data:
        forbidden_error("Sales users cannot reassign tasks")

    if "lead_id" in update_data:
        validate_lead_exists(update_data["lead_id"], db)

    if "assignee_id" in update_data:
        validate_assignee_exists(update_data["assignee_id"], db)

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    return task


def delete_task(task_id: str, db: Session, current_user: User):
    require_roles(current_user, ["admin", "manager"])

    task = get_task_or_404(task_id, db)

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }