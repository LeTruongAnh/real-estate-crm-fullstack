"use client";

import { FormEvent, useState } from "react";

import type { Lead, LeadSource, LeadStatus } from "@/types";

type LeadFormValues = {
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  interest: string;
  budget: string;
  status: LeadStatus;
};

type LeadFormProps = {
  initialLead?: Lead | null;
  isSubmitting: boolean;
  error: string;
  onCancel: () => void;
  onSubmit: (values: LeadFormValues) => Promise<void>;
};

const sourceOptions: { label: string; value: LeadSource }[] = [
  { label: "Facebook", value: "facebook" },
  { label: "Website", value: "website" },
  { label: "Referral", value: "referral" },
  { label: "Zalo", value: "zalo" },
  { label: "Other", value: "other" },
];

const statusOptions: { label: string; value: LeadStatus }[] = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Negotiating", value: "negotiating" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
];

export function LeadForm({
  initialLead,
  isSubmitting,
  error,
  onCancel,
  onSubmit,
}: LeadFormProps) {
  const [values, setValues] = useState<LeadFormValues>({
    name: initialLead?.name || "",
    phone: initialLead?.phone || "",
    email: initialLead?.email || "",
    source: initialLead?.source || "facebook",
    interest: initialLead?.interest || "",
    budget: initialLead?.budget ? String(initialLead.budget) : "",
    status: initialLead?.status || "new",
  });

  function updateField<K extends keyof LeadFormValues>(
    field: K,
    value: LeadFormValues[K],
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(values);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          {initialLead ? "Edit Lead" : "Create Lead"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Fill in customer information and sales pipeline status.
        </p>
      </div>

      {error ? (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Customer name
          </label>
          <input
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
            minLength={2}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            placeholder="Nguyen Van A"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Phone
          </label>
          <input
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            required
            minLength={8}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            placeholder="0909123456"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            placeholder="customer@example.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Budget
          </label>
          <input
            type="number"
            min={0}
            value={values.budget}
            onChange={(event) => updateField("budget", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            placeholder="2500000000"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Source
          </label>
          <select
            value={values.source}
            onChange={(event) =>
              updateField("source", event.target.value as LeadSource)
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

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            value={values.status}
            onChange={(event) =>
              updateField("status", event.target.value as LeadStatus)
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

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Interest
          </label>
          <textarea
            value={values.interest}
            onChange={(event) => updateField("interest", event.target.value)}
            required
            minLength={2}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            placeholder="2-bedroom apartment near river"
          />
        </div>

        <div className="flex gap-3 md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting
              ? "Saving..."
              : initialLead
                ? "Save changes"
                : "Create lead"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export type { LeadFormValues };