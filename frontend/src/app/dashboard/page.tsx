"use client";

import { useEffect, useState } from "react";

import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/StatCard";
import { getDashboardSummary, getCurrentUserFromStorage } from "@/lib/api";
import type { DashboardSummary } from "@/types";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = getCurrentUserFromStorage();

  const dashboardMode =
    currentUser?.role === "sales" ? "Personal Dashboard" : "Global Dashboard";

  useEffect(() => {
    async function loadDashboardSummary() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load dashboard";

        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardSummary();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            {dashboardMode} · Overview of leads, tasks, and sales activity.
          </p>
        </div>

        {isLoading ? (
          <DashboardLoadingState />
        ) : error ? (
          <DashboardErrorState message={error} />
        ) : summary ? (
          <DashboardContent summary={summary} />
        ) : null}
      </div>
    </AppLayout>
  );
}

function DashboardContent({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Leads"
          value={summary.total_leads}
          description="All customer leads"
        />
        <StatCard
          label="New Leads"
          value={summary.new_leads}
          description="New pipeline"
        />
        <StatCard
          label="Won Leads"
          value={summary.won_leads}
          description="Closed deals"
        />
        <StatCard
          label="Overdue Tasks"
          value={summary.overdue_tasks}
          description="Need attention"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Contacted"
          value={summary.contacted_leads}
          description="Already contacted"
        />
        <StatCard
          label="Qualified"
          value={summary.qualified_leads}
          description="Good-fit leads"
        />
        <StatCard
          label="Negotiating"
          value={summary.negotiating_leads}
          description="In negotiation"
        />
        <StatCard
          label="High Priority Tasks"
          value={summary.high_priority_tasks}
          description="Active high-priority work"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Lead Pipeline
          </h2>
          <div className="mt-5 space-y-3">
            <PipelineRow label="New" value={summary.new_leads} />
            <PipelineRow label="Contacted" value={summary.contacted_leads} />
            <PipelineRow label="Qualified" value={summary.qualified_leads} />
            <PipelineRow
              label="Negotiating"
              value={summary.negotiating_leads}
            />
            <PipelineRow label="Won" value={summary.won_leads} />
            <PipelineRow label="Lost" value={summary.lost_leads} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Leads by Source
          </h2>

          {summary.leads_by_source.length > 0 ? (
            <div className="mt-5 space-y-3">
              {summary.leads_by_source.map((item) => (
                <PipelineRow
                  key={item.source}
                  label={formatSourceLabel(item.source)}
                  value={item.count}
                />
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              No lead source data available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PipelineRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="text-sm font-bold text-slate-900">{value}</span>
    </div>
  );
}

function DashboardLoadingState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-700">
        Loading dashboard data...
      </p>
    </div>
  );
}

function DashboardErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
      {message}
    </div>
  );
}

function formatSourceLabel(source: string) {
  return source.charAt(0).toUpperCase() + source.slice(1);
}