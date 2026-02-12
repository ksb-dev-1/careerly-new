// ----------------------------------------
// Imports
// ----------------------------------------
import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// lib
import { fetchJobSeekerProfileDetails } from "@/lib/job-seeker/fetch-job-seeker-profile-details";

// components
import { NotFoundError } from "@/components/errors/NotFoundError";
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
async function JobSeekerProfileContent() {
  const response = await fetchJobSeekerProfileDetails();

  if (!response.success) {
    switch (response.status) {
      case 401:
        redirect("/sign-in");
      case 403:
        return redirect("/select-role");
      case 404:
        return <NotFoundError message={response.message} />;
      default:
        return <ServerError message={response.message} />;
    }
  }

  return <JobSeekerProfile details={response.data} />;
}

// ----------------------------------------
//  Page component
// ----------------------------------------
export default async function JobSeekerProfilePage() {
  return (
    <Suspense fallback={<LoadingFallback color="text-brand" />}>
      <JobSeekerProfileContent />
    </Suspense>
  );
}
