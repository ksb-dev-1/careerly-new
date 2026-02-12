// ----------------------------------------
// Imports
// ----------------------------------------
import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// lib
import { fetchJobSeekerProfileDetails } from "@/lib/job-seeker/fetch-job-seeker-profile-details";

// components
import { ServerError } from "@/components/errors/ServerError";
import { LoadingFallback } from "@/components/LoadingFallback";
import { EditJobSeekerProfileForm } from "@/components/job-seeker/edit-job-seeker-profile-form/EditJobSeekerProfileForm";
import { NotFoundError } from "@/components/errors/NotFoundError";

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
async function EditJobSeekerProfileContent() {
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

  return <EditJobSeekerProfileForm details={response.data.formData} />;
}

// ----------------------------------------
//  Page component
// ----------------------------------------
export default async function EditJobSeekerProfilePage() {
  return (
    <Suspense fallback={<LoadingFallback color="text-brand" />}>
      <EditJobSeekerProfileContent />
    </Suspense>
  );
}
