"use client";

import { useEffect, useMemo, useState } from "react";

import { LeadTable } from "@/components/LeadTable";
import { AppLayout } from "@/components/layout/AppLayout";
import { getLeads } from "@/lib/api";
import type { Lead, LeadSource, LeadStatus } from "@/types";

const statusOptions: { label: string; value: LeadStatus | "all" }[] = [
  { label: "All statuses", value: "all" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Negotiating", value: "negotiating" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
];

const sourceOptions: { label: string; value: LeadSource | "all" }[] = [
  { label: "All sources", value: "all" },
  { label: "Facebook", value: "facebook" },
  { label: "Website", value: "website" },
  { label: "Referral", value: "referral" },
  { label: "Zalo", value: "zalo" },
  { label: "Other", value: "other" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeads() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getLeads();
        setLeads(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load leads";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        keyword.length === 0 ||
        lead.name.toLowerCase().includes(keyword) ||
        lead.phone.toLowerCase().includes(keyword) ||
        (lead.email || "").toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;

      const matchesSource =
        sourceFilter === "all" || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, search, statusFilter, sourceFilter]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage customer leads and sales pipeline.
            </p>
          </div>

          <div className="rounded-xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredLeads.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {leads.length}
            </span>{" "}
            leads
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
          <div>
            <label
              htmlFor="lead-search"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Search
            </label>
            <input
              id="lead-search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, phone, email..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="status-filter"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as LeadStatus | "all")
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="source-filter"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Source
            </label>
            <select
              id="source-filter"
              value={sourceFilter}
              onChange={(event) =>
                setSourceFilter(event.target.value as LeadSource | "all")
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            >
              {sourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <LeadsLoadingState />
        ) : error ? (
          <LeadsErrorState message={error} />
        ) : (
          <LeadTable leads={filteredLeads} />
        )}
      </div>
    </AppLayout>
  );
}

function LeadsLoadingState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-700">Loading leads...</p>
    </div>
  );
}

function LeadsErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
      {message}
    </div>
  );
}