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
import { EditJobSeekerProfileForm } from "@/components/job-seeker/edit-job-seeker-profile-form/EditJobSeekerProfileForm";

// ----------------------------------------
// Metadata
// ----------------------------------------
export const metadata: Metadata = {
  title: "Edit Profile - Careerly",
  description: "Edit your job seeker profile easily.",
};

// ----------------------------------------
// Edit Employer Profile Content
// ----------------------------------------
async function EditJobSeekerProfileContent({
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

  return <EditJobSeekerProfileForm details={response.data.formData} />;
}

// ----------------------------------------
//  Auth Content
// ----------------------------------------
async function AuthContent() {
  const session = await auth();

  if (!session?.user.id) redirect("/sign-in");

  if (session.user.role !== UserRole.JOB_SEEKER) {
    return (
      <UnauthorizedError message="Only users with the Job Seeker role can edit their profile." />
    );
  }

  return <EditJobSeekerProfileContent jobSeekerId={session.user.id} />;
}

// ----------------------------------------
//  Page component
// ----------------------------------------
export default async function EditJobSeekerProfilePage() {
  return (
    <Suspense fallback={<LoadingFallback color="text-brand" />}>
      <AuthContent />
    </Suspense>
  );
}
