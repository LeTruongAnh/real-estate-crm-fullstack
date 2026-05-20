from pydantic import BaseModel


class LeadSourceSummary(BaseModel):
    source: str
    count: int


class DashboardSummaryResponse(BaseModel):
    total_leads: int
    new_leads: int
    contacted_leads: int
    qualified_leads: int
    negotiating_leads: int
    won_leads: int
    lost_leads: int
    overdue_tasks: int
    high_priority_tasks: int
    leads_by_source: list[LeadSourceSummary]