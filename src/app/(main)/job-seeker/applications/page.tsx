// ----------------------------------------
// Imports
// ----------------------------------------
import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// lib
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
  description: "View all your applications.",
};

// ----------------------------------------
// Posted Job List content
// ----------------------------------------
async function ApplicationsContent() {
  const response = await fetchApplications();

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

  if (response.applications.length === 0) {
    return (
      <EmptyState
        message="You haven’t applied to any jobs yet."
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
export default async function ApplicationsPage() {
  return (
    <Suspense fallback={<LoadingFallback color="text-brand" />}>
      <ApplicationsContent />
    </Suspense>
  );
}
