// ----------------------------------------
// Imports
// ----------------------------------------
import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// lib
import { fetchBookmarks } from "@/lib/job-seeker/fetch-bookmarks";

// components
import { ServerError } from "@/components/errors/ServerError";
import { LoadingFallback } from "@/components/LoadingFallback";
import { EmptyState } from "@/components/errors/EmptyState";
import { Bookmarks } from "@/components/job-seeker/Bookmarks";

// 3rd party
import { ArrowLeft } from "lucide-react";

// ----------------------------------------
// Metadata
// ----------------------------------------
export const metadata: Metadata = {
  title: "Bookmarks - Careerly",
  description: "View and manage all your bookmarks.",
};

// ----------------------------------------
// Posted Job List content
// ----------------------------------------
async function BookmarksContent() {
  const response = await fetchBookmarks();

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

  if (response.bookmarks.length === 0) {
    return (
      <EmptyState
        message="You haven't saved any jobs yet."
        href="/job-seeker/jobs"
        btnIcon={<ArrowLeft size={16} />}
        btnLabel="Back to jobs"
      />
    );
  }

  return <Bookmarks bookmarks={response.bookmarks} />;
}

// ----------------------------------------
//  Page component
// ----------------------------------------
export default async function BookmarksPage() {
  return (
    <Suspense fallback={<LoadingFallback color="text-brand" />}>
      <BookmarksContent />
    </Suspense>
  );
}
