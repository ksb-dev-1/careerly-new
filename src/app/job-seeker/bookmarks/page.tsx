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
import { UserRole } from "@/generated/prisma/enums";

// lib
import { fetchBookmarks } from "@/lib/job-seeker/fetch-bookmarks";

// components
import { UnauthorizedError } from "@/components/errors/UnauthorizedError";
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
async function BookmarksContent({ jobSeekerId }: { jobSeekerId: string }) {
  "use cache";
  cacheLife("max");
  cacheTag(`bookmarks-${jobSeekerId}`);
  console.log("🔵 DB HIT: fetching bookmarks");

  const response = await fetchBookmarks(jobSeekerId);

  // Handle errors
  if (!response.success) {
    return <ServerError message={response.message} />;
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
//  Auth Content Loader
// ----------------------------------------
async function AuthContentLoader() {
  const session = await auth();

  if (!session?.user.id) {
    redirect("/sign-in");
  }

  if (session?.user.role !== UserRole.JOB_SEEKER) {
    return (
      <UnauthorizedError message="Only user with job seeker role can access bookmarks." />
    );
  }

  return <BookmarksContent jobSeekerId={session.user.id} />;
}

// ----------------------------------------
//  Page component
// ----------------------------------------
export default async function BookmarksPage() {
  return (
    <Suspense fallback={<LoadingFallback color="text-brand" />}>
      <AuthContentLoader />
    </Suspense>
  );
}
