import { API_BASE_URL } from "@/lib/config";
import type { DashboardSummary, Lead, LoginResponse, Note, Task, User } from "@/types";

type LoginPayload = {
  email: string;
  password: string;
};

type ApiErrorResponse = {
  detail?: string;
};

type LeadPayload = {
  name: string;
  phone: string;
  email?: string | null;
  source: string;
  interest: string;
  budget?: number | null;
  status: string;
  assigned_to?: string | null;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = "Something went wrong";

    try {
      const errorData = (await response.json()) as ApiErrorResponse;
      errorMessage = errorData.detail || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<LoginResponse>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Cannot connect to backend server. Please make sure FastAPI is running.",
      );
    }

    throw error;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
}

export function saveAuthSession(data: LoginResponse): void {
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("current_user", JSON.stringify(data.user));
}

export function clearAuthSession(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("current_user");
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Cannot connect to backend server. Please make sure FastAPI is running.",
      );
    }

    throw error;
  }
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiFetch<DashboardSummary>("/dashboard/summary");
}

export async function getLeads(): Promise<Lead[]> {
  return apiFetch<Lead[]>("/leads");
}

export async function getTasks(): Promise<Task[]> {
  return apiFetch<Task[]>("/tasks");
}

export async function createLead(payload: LeadPayload): Promise<Lead> {
  return apiFetch<Lead>("/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateLead(
  leadId: string,
  payload: Partial<LeadPayload>,
): Promise<Lead> {
  return apiFetch<Lead>(`/leads/${leadId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getLeadById(leadId: string): Promise<Lead> {
  return apiFetch<Lead>(`/leads/${leadId}`);
}

export async function getLeadNotes(leadId: string): Promise<Note[]> {
  return apiFetch<Note[]>(`/leads/${leadId}/notes`);
}

export async function createLeadNote(
  leadId: string,
  content: string,
): Promise<Note> {
  return apiFetch<Note>(`/leads/${leadId}/notes`, {
    method: "POST",
    body: JSON.stringify({
      content,
    }),
  });
}

type TaskPayload = {
  lead_id?: string | null;
  title: string;
  description?: string | null;
  assignee_id: string;
  status: string;
  priority: string;
  deadline?: string | null;
};

export async function createTask(payload: TaskPayload): Promise<Task> {
  return apiFetch<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUserFromStorage(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = localStorage.getItem("current_user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    return null;
  }
}

export async function getSalesUsers(): Promise<User[]> {
  return apiFetch<User[]>("/users/sales");
}