// ----------------------------------------
// Imports
// ----------------------------------------

// lib
import { BookmarksWithIsApplied } from "@/lib/job-seeker/fetch-bookmarks";

// generated
import { JobStatus } from "@/generated/prisma/client";

// components
import { CustomLink } from "@/components/CustomLink";
import { JobCardHeader } from "@/components/JobCardHeader";
import { JobCardMetadata } from "@/components/JobCardMetadata";
import { JobCardFooter } from "@/components/JobCardFooter";
import { BookmarkButton } from "@/components/job-seeker/BookmarkButton";
import { Card } from "@/components/ui/card";

// 3rd party
import { Bookmark } from "lucide-react";

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
    experienceMax,
    experienceMin,
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
          ? "outline-brand/50 hover:outline-1"
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
        experienceMin={experienceMin}
        experienceMax={experienceMax}
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
        <CustomLink href={`/job-seeker/jobs/${id}`} prefetch={false}>
          {CardContent}
        </CustomLink>
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
        <span className="text-xs font-medium absolute top-0 right-0 bg-brand text-white dark:text-background rounded-tr-xl rounded-bl-xl px-3 py-1 ">
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
    <div className="min-h-screen max-w-4xl w-full py-16 mx-auto px-4">
      <div className="mb-6 flex items-center gap-2 dark:text-background">
        <div className="w-fit bg-brand/10 border border-brand/20 text-brand p-2 rounded-tr-full rounded-br-full flex items-center gap-2">
          <Bookmark size={20} />
          <span className="font-bold">Bookmarks</span>
          <span className="h-7 w-7 rounded-full bg-brand text-white dark:text-background flex items-center justify-center text-sm font-medium">
            {bookmarks.length}
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {bookmarks.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
