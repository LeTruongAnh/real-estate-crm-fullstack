import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/StatCard";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of leads, tasks, and sales activity.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Leads" value={0} description="All leads" />
          <StatCard label="New Leads" value={0} description="New pipeline" />
          <StatCard label="Won Leads" value={0} description="Closed deals" />
          <StatCard
            label="Overdue Tasks"
            value={0}
            description="Need attention"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Lead Sources
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            API integration will be added in the next frontend steps.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}