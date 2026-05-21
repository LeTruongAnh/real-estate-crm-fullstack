from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.permissions import is_admin_or_manager, is_sales, is_viewer
from app.db.models import Lead, Task, User


def get_dashboard_summary(db: Session, current_user: User):
    today = date.today()

    lead_query = db.query(Lead)
    task_query = db.query(Task)

    if is_sales(current_user):
        lead_query = lead_query.filter(Lead.assigned_to == current_user.id)
        task_query = task_query.filter(Task.assignee_id == current_user.id)

    elif is_admin_or_manager(current_user) or is_viewer(current_user):
        pass

    else:
        lead_query = lead_query.filter(False)
        task_query = task_query.filter(False)

    total_leads = lead_query.count()

    new_leads = lead_query.filter(Lead.status == "new").count()
    contacted_leads = lead_query.filter(Lead.status == "contacted").count()
    qualified_leads = lead_query.filter(Lead.status == "qualified").count()
    negotiating_leads = lead_query.filter(Lead.status == "negotiating").count()
    won_leads = lead_query.filter(Lead.status == "won").count()
    lost_leads = lead_query.filter(Lead.status == "lost").count()

    overdue_tasks = (
        task_query
        .filter(
            Task.deadline.isnot(None),
            Task.deadline < today,
            Task.status != "done",
        )
        .count()
    )

    high_priority_tasks = (
        task_query
        .filter(
            Task.priority == "high",
            Task.status != "done",
        )
        .count()
    )

    leads_by_source_rows = (
        lead_query
        .with_entities(
            Lead.source,
            func.count(Lead.id),
        )
        .group_by(Lead.source)
        .all()
    )

    leads_by_source = [
        {
            "source": source,
            "count": count,
        }
        for source, count in leads_by_source_rows
    ]

    return {
        "total_leads": total_leads,
        "new_leads": new_leads,
        "contacted_leads": contacted_leads,
        "qualified_leads": qualified_leads,
        "negotiating_leads": negotiating_leads,
        "won_leads": won_leads,
        "lost_leads": lost_leads,
        "overdue_tasks": overdue_tasks,
        "high_priority_tasks": high_priority_tasks,
        "leads_by_source": leads_by_source,
    }