import type { LeadSource } from "@/types";

type LeadSourceBadgeProps = {
  source: LeadSource;
};

const sourceLabels: Record<LeadSource, string> = {
  facebook: "Facebook",
  website: "Website",
  referral: "Referral",
  zalo: "Zalo",
  other: "Other",
};

export function LeadSourceBadge({ source }: LeadSourceBadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
      {sourceLabels[source]}
    </span>
  );
}