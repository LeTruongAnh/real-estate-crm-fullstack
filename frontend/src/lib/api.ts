import { API_BASE_URL } from "@/lib/config";
import type { DashboardSummary, Lead, LoginResponse, Task } from "@/types";

type LoginPayload = {
  email: string;
  password: string;
};

type ApiErrorResponse = {
  detail?: string;
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
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<LoginResponse>(response);
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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  return handleResponse<T>(response);
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