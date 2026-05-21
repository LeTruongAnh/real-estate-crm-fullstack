import type { LeadStatus } from "@/types";

type LeadStatusBadgeProps = {
  status: LeadStatus;
};

const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  negotiating: "Negotiating",
  won: "Won",
  lost: "Lost",
};

const statusClassNames: Record<LeadStatus, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  contacted: "bg-slate-50 text-slate-700 ring-slate-200",
  qualified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  negotiating: "bg-amber-50 text-amber-700 ring-amber-200",
  won: "bg-green-50 text-green-700 ring-green-200",
  lost: "bg-red-50 text-red-700 ring-red-200",
};

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClassNames[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}