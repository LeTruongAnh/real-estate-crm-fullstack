import type { Lead } from "@/types";
import { LeadSourceBadge } from "@/components/ui/LeadSourceBadge";
import { LeadStatusBadge } from "@/components/ui/LeadStatusBadge";
import Link from "next/link";

type LeadTableProps = {
  leads: Lead[];
  onEditLead?: (lead: Lead) => void;
};

export function LeadTable({ leads, onEditLead }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-sm font-medium text-slate-700">No leads found</p>
        <p className="mt-1 text-sm text-slate-500">
          Try changing your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Interest
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Source
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Budget
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div>
                    <Link
                      href={`/leads/${lead.id}`}
                      className="text-sm font-semibold text-slate-900 hover:underline"
                    >
                      {lead.name}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      {lead.email || "No email"}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-4 text-sm text-slate-700">
                  {lead.phone}
                </td>

                <td className="max-w-xs px-4 py-4 text-sm text-slate-700">
                  <p className="line-clamp-2">{lead.interest}</p>
                </td>

                <td className="px-4 py-4">
                  <LeadSourceBadge source={lead.source} />
                </td>

                <td className="px-4 py-4">
                  <LeadStatusBadge status={lead.status} />
                </td>

                <td className="px-4 py-4 text-right text-sm font-medium text-slate-900">
                  {formatBudget(lead.budget)}
                </td>

                <td className="px-4 py-4 text-right">
                  {onEditLead ? (
                    <button
                      type="button"
                      onClick={() => onEditLead(lead)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatBudget(value: number | null) {
  if (value === null) {
    return "-";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}