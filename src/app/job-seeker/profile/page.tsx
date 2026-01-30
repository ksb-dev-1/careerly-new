// ----------------------------------------
// Imports
// ----------------------------------------
import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// auth
import { auth } from "@/auth";

// generated
import { UserRole } from "@/generated/prisma/client";

// lib
import { fetchJobSeekerProfileDetails } from "@/lib/job-seeker/fetch-job-seeker-profile-details";

// components
import { UnauthorizedError } from "@/components/errors/UnauthorizedError";
import { EmptyState } from "@/components/errors/EmptyState";
import { ServerError } from "@/components/errors/ServerError";
import { LoadingFallback } from "@/components/LoadingFallback";
import { JobSeekerProfile } from "@/components/job-seeker/JobSeekerProfile";

// ----------------------------------------
// Metadata
// ----------------------------------------
export const metadata: Metadata = {
  title: "Profile - Careerly",
  description: "Manage your profile easily.",
};

// ----------------------------------------
// Profile Content
// ----------------------------------------
async function JobSeekerProfileContent({
  jobSeekerId,
}: {
  jobSeekerId: string;
}) {
  const response = await fetchJobSeekerProfileDetails(jobSeekerId);

  if (!response.success) {
    if (response.status === 404) {
      return <EmptyState message={response.message} />;
    }

    return <ServerError message={response.message} />;
  }

  return <JobSeekerProfile details={response.data} />;
}

// ----------------------------------------
//  Auth Content
// ----------------------------------------
async function AuthContent() {
  const session = await auth();

  if (!session?.user.id) redirect("/sign-in");

  if (session.user.role !== UserRole.JOB_SEEKER) {
    return (
      <UnauthorizedError message="Fetching job seeker profile is restricted to users with the Job Seeker role." />
    );
  }

  return <JobSeekerProfileContent jobSeekerId={session.user.id} />;
}

// ----------------------------------------
//  Page component
// ----------------------------------------
export default async function JobSeekerProfilePage() {
  return (
    <Suspense fallback={<LoadingFallback color="text-brand" />}>
      <AuthContent />
    </Suspense>
  );
}
