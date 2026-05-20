export type UserRole = "admin" | "manager" | "sales" | "viewer";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
};

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "negotiating"
  | "won"
  | "lost";

export type LeadSource =
  | "facebook"
  | "website"
  | "referral"
  | "zalo"
  | "other";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  source: LeadSource;
  interest: string;
  budget: number | null;
  status: LeadStatus;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  lead_id: string | null;
  title: string;
  description: string | null;
  assignee_id: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string | null;
  created_at: string;
  updated_at: string;
};

export type DashboardSummary = {
  total_leads: number;
  new_leads: number;
  contacted_leads: number;
  qualified_leads: number;
  negotiating_leads: number;
  won_leads: number;
  lost_leads: number;
  overdue_tasks: number;
  high_priority_tasks: number;
  leads_by_source: {
    source: string;
    count: number;
  }[];
};

export type LoginResponse = {
  access_token: string;
  token_type: "bearer";
  user: User;
};