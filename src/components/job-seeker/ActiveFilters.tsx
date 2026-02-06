"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { usePathname, useSearchParams } from "next/navigation";

// hooks
import { useCustomRouter } from "@/hooks/useCustomRouter";

// lib
import { JobWithRelationships } from "@/lib/job-seeker/fetch-jobs";

// components
import { Badge } from "@/components/ui/badge";

// 3rd party
import { X } from "lucide-react";

// ----------------------------------------
// Types
// ----------------------------------------
type ActiveFiltersProps = {
  jobs: JobWithRelationships[];
};

type FilterType = "search" | "experience" | "jobType" | "jobMode";

// ----------------------------------------
// Main Component
// ----------------------------------------
export function ActiveFilters({ jobs }: ActiveFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useCustomRouter();

  const search = searchParams.get("search") ?? "";
  const experience = searchParams.get("experience") ?? "";
  const jobType = searchParams.get("jobType")?.split(",") ?? [];
  const jobMode = searchParams.get("jobMode")?.split(",") ?? [];

  // Build sets of matched enum values from jobs
  const matchedValues = {
    jobType: new Set(jobs.map((job) => job.jobType.toLowerCase())),
    jobMode: new Set(jobs.map((job) => job.jobMode.toLowerCase())),
  };

  // Active filters list
  const activeFilters: { type: FilterType; value: string }[] = [
    ...(search.trim() ? [{ type: "search" as const, value: search }] : []),

    ...(experience.trim()
      ? [{ type: "experience" as const, value: experience }]
      : []),

    ...jobType.map((value) => ({
      type: "jobType" as const,
      value,
    })),

    ...jobMode.map((value) => ({
      type: "jobMode" as const,
      value,
    })),
  ];

  function clearAllFilters() {
    const params = new URLSearchParams(searchParams.toString());

    ["search", "experience", "jobType", "jobMode"].forEach((key) => {
      params.delete(key);
    });

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      {activeFilters.map(({ type, value }) => {
        let isMatched = true;

        // Only enum filters are matched against job results
        if (type === "jobType" || type === "jobMode") {
          isMatched = matchedValues[type].has(value.toLowerCase());
        }

        return (
          <FilterTag
            key={`${type}-${value}`}
            type={type}
            value={value}
            isMatched={isMatched}
          />
        );
      })}

      {activeFilters.length > 1 && (
        <Badge
          onClick={clearAllFilters}
          className="cursor-default border border-red-300 bg-red-100 text-red-600 hover:bg-red-200 dark:border-red-800 dark:bg-red-950/40 dark:text-red-500 dark:hover:bg-red-950"
        >
          Clear all
        </Badge>
      )}
    </div>
  );
}

// ----------------------------------------
// Filter Tag
// ----------------------------------------
function FilterTag({
  value,
  type,
  isMatched,
}: {
  value: string;
  type: FilterType;
  isMatched: boolean;
}) {
  const router = useCustomRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function removeFilter() {
    const params = new URLSearchParams(searchParams.toString());

    if (type === "search" || type === "experience") {
      params.delete(type);
    } else {
      const current = params.get(type);
      if (!current) return;

      const values = current.split(",").filter((v) => v !== value);
      values.length === 0
        ? params.delete(type)
        : params.set(type, values.join(","));
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Badge
      variant="secondary"
      onClick={removeFilter}
      className={`cursor-pointer flex items-center gap-2 ${
        isMatched ? "" : "opacity-40 line-through"
      }`}
    >
      {formatLabel(type, value)}
      <X className="text-red-600" />
    </Badge>
  );
}

// ----------------------------------------
// Helpers
// ----------------------------------------
function formatLabel(type: FilterType, value: string): string {
  if (type === "experience") {
    return formatExperience(value);
  }

  if (type === "search") {
    return value;
  }

  return formatEnumLabel(value);
}

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatExperience(value: string): string {
  // supports: "0-2", "3-5", "5+"
  if (value.includes("-")) {
    const [min, max] = value.split("-");
    return `${min}–${max} years`;
  }
  return `${value}+ years`;
}
