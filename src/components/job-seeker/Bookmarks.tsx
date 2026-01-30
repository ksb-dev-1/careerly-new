// ----------------------------------------
// Imports
// ----------------------------------------
import Link from "next/link";

// lib
import { BookmarksWithIsApplied } from "@/lib/job-seeker/fetch-bookmarks";

// generated
import { JobStatus } from "@/generated/prisma/client";

// components
import { JobCardHeader } from "@/components/JobCardHeader";
import { JobCardMetadata } from "@/components/JobCardMetadata";
import { JobCardFooter } from "@/components/JobCardFooter";
import { BookmarkButton } from "@/components/job-seeker/BookmarkButton";
import { Card } from "@/components/ui/card";

// ----------------------------------------
// Job Card Component
// ----------------------------------------
function JobCard({ job }: { job: BookmarksWithIsApplied }) {
  const {
    id,
    role,
    companyLogo,
    companyName,
    createdAt,
    experience,
    salary,
    currency,
    jobType,
    jobMode,
    location,
    jobStatus,
    isBookmarked,
    appliedOn,
    applicationStatus,
    isDeleted,
    isFeatured,
  } = job;

  const canNavigate = jobStatus === JobStatus.OPEN && !isDeleted;

  const CardContent = (
    <Card
      className={`h-full transition-all ${isFeatured ? "bg-brand/5 border-brand/20" : ""} ${
        canNavigate
          ? "outline-brand/50 hover:outline-3"
          : "opacity-60 cursor-not-allowed"
      }`}
    >
      {/* Job card header */}
      <JobCardHeader
        companyLogo={companyLogo}
        role={role}
        companyName={companyName}
        applicationStatus={applicationStatus}
        appliedOn={appliedOn}
      />

      {/* Job card metadata */}
      <JobCardMetadata
        experience={experience}
        salary={salary}
        currency={currency}
        jobType={jobType}
        jobMode={jobMode}
        location={location}
      />

      {/* Job footer */}
      <JobCardFooter variant="job-list" postedOn={createdAt} />
    </Card>
  );

  return (
    <div className="relative">
      {canNavigate ? (
        <Link href={`/job-seeker/jobs/${id}`} prefetch={true}>
          {CardContent}
        </Link>
      ) : (
        <div aria-hidden="true">{CardContent}</div>
      )}

      {/* Bookmark button */}
      <BookmarkButton
        jobId={id}
        isBookmarked={isBookmarked}
        className="absolute bottom-4 right-4"
      />

      {/* Feature tag */}
      {isFeatured ? (
        <span className="font-semibold text-xs absolute top-0 right-0 bg-brand text-white dark:text-background rounded-tr-xl rounded-bl-xl px-3 py-1 ">
          Featured
        </span>
      ) : (
        ""
      )}
    </div>
  );
}

// ----------------------------------------
// Main Component
// ----------------------------------------
export function Bookmarks({
  bookmarks,
}: {
  bookmarks: BookmarksWithIsApplied[];
}) {
  return (
    <div className="min-h-screen max-w-custom w-full pt-32 pb-16 mx-auto px-4">
      <div className="mb-6 flex items-center gap-2">
        <span className="text-lg font-bold">Bookmarks</span>
        <span className="h-6 w-6 rounded-full bg-brand text-white dark:text-background flex items-center justify-center text-xs font-semibold">
          {bookmarks.length}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {bookmarks.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------------------------------
// "use client";

// // ----------------------------------------
// // Imports
// // ----------------------------------------
// import Link from "next/link";

// // generated
// import { JobStatus } from "@/generated/prisma/browser";

// // lib
// import {
//   fetchBookmarks,
//   FetchBookmarksResponse,
// } from "@/lib/job-seeker/fetch-bookmarks";
// import { BookmarksWithIsApplied } from "@/lib/job-seeker/fetch-bookmarks";

// // components
// import { LoadingFallback } from "@/components/LoadingFallback";
// import { ServerError } from "@/components/errors/ServerError";
// import { EmptyState } from "@/components/errors/EmptyState";
// import { JobCardHeader } from "@/components/JobCardHeader";
// import { JobCardMetadata } from "@/components/JobCardMetadata";
// import { JobCardFooter } from "@/components/JobCardFooter";
// import { BookmarkButton } from "@/components/job-seeker/BookmarkButton";
// import { Card } from "@/components/ui/card";

// // 3rd party
// import { useQuery } from "@tanstack/react-query";
// import { ArrowLeft } from "lucide-react";

// // ----------------------------------------
// // Job Card Component
// // ----------------------------------------
// function JobCard({ job }: { job: BookmarksWithIsApplied }) {
//   const {
//     id,
//     role,
//     companyLogo,
//     companyName,
//     createdAt,
//     experience,
//     salary,
//     currency,
//     jobType,
//     jobMode,
//     location,
//     jobStatus,
//     isBookmarked,
//     appliedOn,
//     applicationStatus,
//     isDeleted,
//     isFeatured,
//   } = job;

//   const canNavigate = jobStatus === JobStatus.OPEN && !isDeleted;

//   const CardContent = (
//     <Card
//       className={`h-full transition-all ${isFeatured ? "bg-brand/5 border-brand/20" : ""} ${
//         canNavigate
//           ? "outline-brand/50 hover:outline-3"
//           : "opacity-60 cursor-not-allowed"
//       }`}
//     >
//       {/* Job card header */}
//       <JobCardHeader
//         companyLogo={companyLogo}
//         role={role}
//         companyName={companyName}
//         applicationStatus={applicationStatus}
//         appliedOn={appliedOn}
//       />

//       {/* Job card metadata */}
//       <JobCardMetadata
//         experience={experience}
//         salary={salary}
//         currency={currency}
//         jobType={jobType}
//         jobMode={jobMode}
//         location={location}
//       />

//       {/* Job footer */}
//       <JobCardFooter postedOn={createdAt} />
//     </Card>
//   );

//   return (
//     <div className="relative">
//       {canNavigate ? (
//         <Link href={`/job-seeker/jobs/${id}`}>{CardContent}</Link>
//       ) : (
//         <div aria-hidden="true">{CardContent}</div>
//       )}

//       {/* Bookmark button */}
//       <BookmarkButton
//         jobId={id}
//         isBookmarked={isBookmarked}
//         className="absolute top-6 right-6 md:bottom-6 md:top-auto"
//       />

//       {/* Feature tag */}
//       {isFeatured ? (
//         <span className="font-semibold text-xs absolute top-0 right-0 bg-brand text-white dark:text-background rounded-tr-xl rounded-bl-xl px-3 py-1 ">
//           Featured
//         </span>
//       ) : (
//         ""
//       )}
//     </div>
//   );
// }

// // ----------------------------------------
// // Bookmarks Component
// // ----------------------------------------
// export function Bookmarks({ jobseekerId }: { jobseekerId: string }) {
//   const { data, isLoading, isError } = useQuery<FetchBookmarksResponse>({
//     queryKey: ["bookmarks", jobseekerId],
//     queryFn: async () => fetchBookmarks(jobseekerId),
//   });

//   if (isLoading) {
//     return <LoadingFallback />;
//   }

//   if (isError) {
//     return <ServerError message="Something went wrong" />;
//   }

//   if (!data) {
//     return <ServerError message="No data received" />;
//   }

//   if (!data.success) {
//     return <ServerError message={data.message} />;
//   }

//   if (data.bookmarks.length === 0) {
//     return (
//       <EmptyState
//         message="You haven't saved any jobs yet."
//         href="/job-seeker/jobs"
//         btnIcon={<ArrowLeft />}
//         btnLabel="Back to jobs"
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen max-w-custom w-full pt-32 pb-16 mx-auto px-6">
//       <div className="mb-6 flex items-center gap-2">
//         <span className="text-lg font-bold">Bookmarks</span>
//         <span className="h-6 w-6 rounded-full bg-brand text-white dark:text-background flex items-center justify-center text-xs font-semibold">
//           {data.bookmarks.length}
//         </span>
//       </div>

//       <div className="grid grid-cols-1 gap-6">
//         {data.bookmarks.map((job) => (
//           <JobCard key={job.id} job={job} />
//         ))}
//       </div>
//     </div>
//   );
// }
