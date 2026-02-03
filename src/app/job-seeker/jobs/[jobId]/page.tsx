// ----------------------------------------
// Imports
// ----------------------------------------
import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// auth
import { auth } from "@/auth";

// generated
import { UserRole } from "@/generated/prisma/enums";

// lib
import { fetchJobDetails } from "@/lib/job-seeker/fetch-job-details";

// components
import { UnauthorizedError } from "@/components/errors/UnauthorizedError";
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
async function JobDetailsContent({ jobId }: { jobId: string }) {
  const response = await fetchJobDetails(jobId);

  // Handle errors
  if (!response.success) {
    switch (response.status) {
      case 401:
        redirect("/sign-in");

      case 403:
        return <UnauthorizedError message={response.message} />;

      case 404:
        return (
          <EmptyState
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
async function AuthContentLoader(props: PageProps) {
  const session = await auth();
  const params = await props.params;
  const { jobId } = params;

  return <JobDetailsContent jobId={jobId} />;
}

// ----------------------------------------
// Page component
// ----------------------------------------
export default function JobDetailsPage(props: PageProps) {
  return (
    <Suspense fallback={<LoadingFallback color="text-brand" />}>
      <AuthContentLoader {...props} />
    </Suspense>
  );
}
