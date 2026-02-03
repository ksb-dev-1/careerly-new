// ----------------------------------------
// Imports
// ----------------------------------------
import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// auth
import { auth } from "@/auth";

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
async function BookmarksContent({ jobseekerId }: { jobseekerId: string }) {
  const response = await fetchBookmarks(jobseekerId);

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

  if (session?.user.role !== "JOB_SEEKER") {
    return (
      <UnauthorizedError message="Only user with job seeker role can access bookmarks." />
    );
  }

  return <BookmarksContent jobseekerId={session.user.id} />;
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

// ------------------------------------------------------------------------------------------

// ----------------------------------------
// Imports
// ----------------------------------------
// import { Suspense } from "react";
// import { Metadata } from "next";
// import { redirect } from "next/navigation";

// // auth
// import { auth } from "@/auth";

// // lib
// import { getServerQueryClient } from "@/lib/getServerQueryClient";
// import { fetchBookmarks } from "@/lib/job-seeker/fetch-bookmarks";

// // components
// import { UnauthorizedError } from "@/components/errors/UnauthorizedError";
// import { LoadingFallback } from "@/components/LoadingFallback";
// import { Bookmarks } from "@/components/job-seeker/Bookmarks";

// // 3rd party
// import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

// // ----------------------------------------
// // Metadata
// // ----------------------------------------
// export const metadata: Metadata = {
//   title: "Bookmarks - Careerly",
//   description: "View and manage all your bookmarks.",
// };

// // ----------------------------------------
// //  Content Loader
// // ----------------------------------------
// async function BookmarksContent({ jobseekerId }: { jobseekerId: string }) {
//   const queryClient = getServerQueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ["bookmarks"],
//     queryFn: () => fetchBookmarks(jobseekerId),
//   });

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <Bookmarks jobseekerId={jobseekerId} />
//     </HydrationBoundary>
//   );
// }

// // ----------------------------------------
// //  Auth Content Loader
// // ----------------------------------------
// async function AuthContentLoader() {
//   const session = await auth();

//   if (!session?.user.id) {
//     redirect("/sign-in");
//   }

//   if (session?.user.role !== "JOB_SEEKER") {
//     return (
//       <UnauthorizedError message="Only user with job seeker role can access bookmarks." />
//     );
//   }

//   return <BookmarksContent jobseekerId={session.user.id} />;
// }

// // ----------------------------------------
// //  Page component
// // ----------------------------------------
// export default async function BookmarksPage() {
//   return (
//     <Suspense fallback={<LoadingFallback color="text-brand" />}>
//       <AuthContentLoader />
//     </Suspense>
//   );
// }
