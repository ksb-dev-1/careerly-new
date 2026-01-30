// ----------------------------------------
// Imports
// ----------------------------------------
import { Suspense } from "react";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";

// auth
import { auth } from "@/auth";

// generated
import { UserRole } from "@/generated/prisma/client";

// lib
import { fetchApplications } from "@/lib/job-seeker/fetch-applications";

// components
import { UnauthorizedError } from "@/components/errors/UnauthorizedError";
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
  description: "View all your applications.",
};

// ----------------------------------------
// Posted Job List content
// ----------------------------------------
async function ApplicationsContent({ jobSeekerId }: { jobSeekerId: string }) {
  "use cache";
  cacheLife("max");
  cacheTag(`applications-${jobSeekerId}`);

  const response = await fetchApplications(jobSeekerId);

  // Handle errors
  if (!response.success) {
    return <ServerError message={response.message} />;
  }

  if (response.applications.length === 0) {
    return (
      <EmptyState
        message="You haven’t applied to any jobs yet."
        href="/job-seeker/jobs"
        btnIcon={<ArrowLeft />}
        btnLabel="Back to jobs"
      />
    );
  }

  return <Applications applications={response.applications} />;
}

// ----------------------------------------
//  Auth Content
// ----------------------------------------
async function AuthContent() {
  const session = await auth();

  if (!session?.user.id) redirect("/sign-in");

  if (session.user.role !== UserRole.JOB_SEEKER) {
    return (
      <UnauthorizedError message="Fetching applied jobs is restricted to users with the Job Seeker role." />
    );
  }

  return <ApplicationsContent jobSeekerId={session.user.id} />;
}

// ----------------------------------------
//  Page component
// ----------------------------------------
export default async function ApplicationsPage() {
  return (
    <Suspense fallback={<LoadingFallback color="text-brand" />}>
      <AuthContent />
    </Suspense>
  );
}
