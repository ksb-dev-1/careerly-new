// ----------------------------------------
// Imports
// ----------------------------------------
import { Suspense } from "react";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

// lib
import { jobSeekerAuthGuard } from "@/lib/job-seeker/job-seeker-auth-guard";
import { fetchApplications } from "@/lib/job-seeker/fetch-applications";

// components
import { ServerError } from "@/components/errors/ServerError";
import { LoadingFallback } from "@/components/LoadingFallback";
import { EmptyState } from "@/components/errors/EmptyState";
import { Applications } from "@/components/job-seeker/Applications";

// 3rd party
import { ArrowLeft } from "lucide-react";

// ----------------------------------------
// Metadata
// ----------------------------------------
export const metadata: Metadata = {
  title: "Applications - Careerly",
  description: "View and manage all your bookmarks.",
};

// ----------------------------------------
// Posted Job List content
// ----------------------------------------
async function ApplicationsContent({ jobSeekerId }: { jobSeekerId: string }) {
  "use cache";
  cacheLife("max");
  cacheTag(`bookmarks-${jobSeekerId}`);
  console.log("🔵 DB HIT: fetching bookmarks");

  const response = await fetchApplications(jobSeekerId);

  if (!response.success) {
    return <ServerError message={response.message} />;
  }

  if (response.applications.length === 0) {
    return (
      <EmptyState
        message="You haven't saved any jobs yet."
        href="/job-seeker/jobs"
        btnIcon={<ArrowLeft size={16} />}
        btnLabel="Back to jobs"
      />
    );
  }

  return <Applications applications={response.applications} />;
}

// ----------------------------------------
//  Page component
// ----------------------------------------
async function AuthContentLoader() {
  const jobSeekerId = await jobSeekerAuthGuard();

  return <ApplicationsContent jobSeekerId={jobSeekerId} />;
}

// ----------------------------------------
//  Page component
// ----------------------------------------
export default async function ApplicationsPage() {
  return (
    <Suspense fallback={<LoadingFallback color="text-brand" />}>
      <AuthContentLoader />
    </Suspense>
  );
}
