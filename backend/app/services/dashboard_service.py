from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.models import Lead, Task


def get_dashboard_summary(db: Session):
    today = date.today()

    total_leads = db.query(Lead).count()

    new_leads = db.query(Lead).filter(Lead.status == "new").count()
    contacted_leads = db.query(Lead).filter(Lead.status == "contacted").count()
    qualified_leads = db.query(Lead).filter(Lead.status == "qualified").count()
    negotiating_leads = db.query(Lead).filter(Lead.status == "negotiating").count()
    won_leads = db.query(Lead).filter(Lead.status == "won").count()
    lost_leads = db.query(Lead).filter(Lead.status == "lost").count()

    overdue_tasks = (
        db.query(Task)
        .filter(
            Task.deadline.isnot(None),
            Task.deadline < today,
            Task.status != "done",
        )
        .count()
    )

    high_priority_tasks = (
        db.query(Task)
        .filter(
            Task.priority == "high",
            Task.status != "done",
        )
        .count()
    )

    leads_by_source_rows = (
        db.query(
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