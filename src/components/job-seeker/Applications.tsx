// ----------------------------------------
// Imports
// ----------------------------------------
import Link from "next/link";

// lib
import { JobApplicationsWithBookmarkStatus } from "@/lib/job-seeker/fetch-applications";

// generated
import { JobStatus } from "@/generated/prisma/client";

// components
import { JobCardHeader } from "@/components/JobCardHeader";
import { JobCardMetadata } from "@/components/JobCardMetadata";
import { JobCardFooter } from "@/components/JobCardFooter";
import { BookmarkButton } from "@/components/job-seeker/BookmarkButton";
import { Card } from "@/components/ui/card";

// 3rd party
import { FileText } from "lucide-react";

// ----------------------------------------
// Job Card Component
// ----------------------------------------
function JobCard({ job }: { job: JobApplicationsWithBookmarkStatus }) {
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
    appliedOn,
    applicationStatus,
    isBookmarked,
    isDeleted,
    isFeatured,
  } = job;

  const canNavigate = jobStatus === JobStatus.OPEN && !isDeleted;

  const CardContent = (
    <Card
      className={`h-full transition ${isFeatured ? "bg-brand/5 border-brand/20" : ""} ${
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
export function Applications({
  applications,
}: {
  applications: JobApplicationsWithBookmarkStatus[];
}) {
  return (
    <div className="min-h-screen max-w-4xl w-full pt-32 pb-16 mx-auto px-4">
      <div className="mb-6 flex items-center gap-2 dark:text-background">
        <div className="w-fit bg-brand/10 border border-brand/20 text-brand p-2 rounded-tr-full rounded-br-full flex items-center gap-2">
          <FileText size={20} />
          <span className="font-bold">Applications</span>
          <span className="h-7 w-7 rounded-full bg-brand text-white dark:text-background flex items-center justify-center text-sm font-medium">
            {applications.length}
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {applications.map((application) => (
          <JobCard key={application.id} job={application} />
        ))}
      </div>
    </div>
  );
}
