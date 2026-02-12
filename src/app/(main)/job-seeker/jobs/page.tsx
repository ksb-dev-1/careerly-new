// ----------------------------------------
// Imports
// ----------------------------------------
import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// lib
import { fetchJobs } from "@/lib/job-seeker/fetch-jobs";

// components
import { ServerError } from "@/components/errors/ServerError";
import { EmptyState } from "@/components/errors/EmptyState";
import { LoadingFallback } from "@/components/LoadingFallback";
import { JobList } from "@/components/job-seeker/JobList";

// ----------------------------------------
// Metadata
// ----------------------------------------
export const metadata: Metadata = {
  title: "Jobs - Careerly",
  description: "Easily browse job listings using filters and pagination.",
};

// ----------------------------------------
// Types
// ----------------------------------------
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface JobDetailsContent {
  filters: {
    page: number;
    jobType?: string[];
    jobMode?: string[];
    experience?: [number, number];
    search?: string;
    limit?: number;
  };
}

// ----------------------------------------
// Job List Content (Server Component)
// ----------------------------------------
async function JobListContent({ filters }: JobDetailsContent) {
  const response = await fetchJobs(filters);

  if (!response.success) {
    switch (response.status) {
      case 401:
        redirect("/sign-in");
      case 403:
        return redirect("/select-role");
      default:
        return <ServerError message={response.message} />;
    }
  }

  const hasFilters =
    (filters.search && filters.search.trim() !== "") ||
    !!filters.experience ||
    (filters.jobType?.length ?? 0) > 0 ||
    (filters.jobMode?.length ?? 0) > 0;

  if (response.jobs.length === 0 && !hasFilters && filters.page === 1) {
    return (
      <EmptyState message="There are no active job postings from employers at the moment." />
    );
  }

  return (
    <JobList
      jobs={response.jobs}
      totalJobs={response.totalJobs}
      totalPages={response.totalPages}
      filters={filters}
    />
  );
}

// ----------------------------------------
// Search Params Parser
// ----------------------------------------
async function JobListContentLoader(props: PageProps) {
  const searchParams = await props.searchParams;

  const page =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;

  const jobType =
    typeof searchParams.jobType === "string"
      ? searchParams.jobType.split(",")
      : [];

  const jobMode =
    typeof searchParams.jobMode === "string"
      ? searchParams.jobMode.split(",")
      : [];

  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";

  // ✅ FIXED EXPERIENCE PARSING
  let experience: [number, number] | undefined;

  if (typeof searchParams.experience === "string") {
    const parts = searchParams.experience.split("-").map(Number);

    if (parts.length === 2 && !parts.some(isNaN)) {
      experience = [parts[0], parts[1]];
    }
  }

  const limit = 6;

  const filters = {
    page,
    jobType,
    jobMode,
    experience, // now correctly typed
    search,
    limit,
  };

  return <JobListContent filters={filters} />;
}

// ----------------------------------------
// Page Component with Streaming
// ----------------------------------------
export default async function JobListPage(props: PageProps) {
  return (
    <Suspense fallback={<LoadingFallback color="text-brand" />}>
      <JobListContentLoader {...props} />
    </Suspense>
  );
}
