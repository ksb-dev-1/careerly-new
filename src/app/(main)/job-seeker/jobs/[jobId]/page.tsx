// ----------------------------------------
// Imports
// ----------------------------------------
import { Suspense } from "react";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

// lib
import { jobSeekerAuthGuard } from "@/lib/job-seeker/job-seeker-auth-guard";
import { fetchJobDetails } from "@/lib/job-seeker/fetch-job-details";

// components
import { NotFoundError } from "@/components/errors/NotFoundError";
import { EmptyState } from "@/components/errors/EmptyState";
import { ServerError } from "@/components/errors/ServerError";
import { LoadingFallback } from "@/components/LoadingFallback";
import { JobDetails } from "@/components/job-seeker/JobDetails";

// 3rd party
import { ArrowLeft } from "lucide-react";

// ----------------------------------------
// Types
// ----------------------------------------
interface PageProps {
  params: Promise<{ jobId: string }>;
}

// ----------------------------------------
// Metadata
// ----------------------------------------
export const metadata: Metadata = {
  title: "Job Details - Careerly",
  description: "View details of your posted job.",
};

// ----------------------------------------
// Posted job details content
// ----------------------------------------
async function JobDetailsContent({
  jobSeekerId,
  jobId,
}: {
  jobSeekerId: string;
  jobId: string;
}) {
  "use cache";
  cacheLife("max");
  cacheTag(`job-details-${jobSeekerId}`);
  cacheTag(`job-details-${jobId}-${jobSeekerId}`);
  console.log("🔵 DB HIT: fetching job details", jobId);

  const response = await fetchJobDetails(jobSeekerId, jobId);

  // Handle errors
  if (!response.success) {
    switch (response.status) {
      case 400:
        return (
          <EmptyState
            message={response.message}
            href="/job-seeker/jobs"
            btnIcon={<ArrowLeft size={16} />}
            btnLabel="Back to Jobs"
          />
        );

      case 404:
        return (
          <NotFoundError
            message={response.message}
            href="/job-seeker/jobs"
            btnIcon={<ArrowLeft size={16} />}
            btnLabel="Back to Jobs"
          />
        );

      default:
        return <ServerError message={response.message} />;
    }
  }

  return <JobDetails job={response.job} />;
}

// ----------------------------------------
//  Auth Content Loader
// ----------------------------------------
async function JobDetailsContentLoader(props: PageProps) {
  const jobSeekerId = await jobSeekerAuthGuard();
  const params = await props.params;
  const { jobId } = params;

  return <JobDetailsContent jobSeekerId={jobSeekerId} jobId={jobId} />;
}

// ----------------------------------------
// Page component
// ----------------------------------------
export default function JobDetailsPage(props: PageProps) {
  return (
    <Suspense fallback={<LoadingFallback color="text-brand" />}>
      <JobDetailsContentLoader {...props} />
    </Suspense>
  );
}
