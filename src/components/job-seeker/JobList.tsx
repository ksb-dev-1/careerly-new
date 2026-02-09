// ----------------------------------------
// Imports
// ----------------------------------------

// lib
import { JobWithRelationships } from "@/lib/job-seeker/fetch-jobs";

// components
import { ActiveFilters } from "@/components/job-seeker/ActiveFilters";
import { Filters } from "@/components/job-seeker/Filters";
import { MobileFilters } from "@/components/job-seeker/MobileFilters";
import { BookmarkButton } from "@/components/job-seeker/BookmarkButton";
import { CustomLink } from "@/components/CustomLink";
import { JobCardHeader } from "@/components/JobCardHeader";
import { JobCardMetadata } from "@/components/JobCardMetadata";
import { JobCardFooter } from "@/components/JobCardFooter";
import { JobPagination } from "@/components/Pagination";
import { Card } from "@/components/ui/card";

// 3rd Party
import { BriefcaseBusiness, FolderOpen } from "lucide-react";

// ----------------------------------------
// Job Card Component
// ----------------------------------------
function JobCard({ job }: { job: JobWithRelationships }) {
  const {
    id,
    role,
    companyName,
    createdAt,
    experience,
    salary,
    currency,
    jobType,
    jobMode,
    location,
    isBookmarked,
    appliedOn,
    applicationStatus,
    companyLogo,
    isFeatured,
  } = job;

  return (
    <div key={id} className="relative">
      <CustomLink href={`/job-seeker/jobs/${id}`} prefetch={false}>
        <Card
          className={`${isFeatured ? "bg-brand/5 border-brand/20" : ""} h-full outline-brand/50 hover:outline-1 transition-all duration-100`}
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
      </CustomLink>

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
interface JobListProps {
  jobs: JobWithRelationships[];
  totalJobs: number;
  totalPages: number;
  filters: {
    page: number;
    jobType?: string[];
    jobMode?: string[];
    experience?: string;
    search?: string;
    limit?: number;
  };
}

export function JobList({
  jobs,
  totalJobs,
  totalPages,
  filters,
}: JobListProps) {
  const { page, jobType, jobMode, experience, search } = filters;
  const isFilterApplied =
    search !== "" || jobType?.length || jobMode?.length || experience !== "";

  const hasFilters =
    (search && search.trim() !== "") ||
    (jobType?.length ?? 0) > 0 ||
    (jobMode?.length ?? 0) > 0;

  if (jobs.length === 0 && hasFilters && page === 1) {
    return (
      <div className="max-w-custom w-full mx-auto px-4 min-h-screen py-16 gap-6">
        <div>
          <div className="mb-6 flex items-end justify-between">
            <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between gap4 md:gap-2">
              <div className="flex items-center gap-2 dark:text-background">
                <div className="w-fit bg-brand/10 border border-brand/20 text-brand p-2 rounded-tr-full rounded-br-full flex items-center gap-2">
                  <BriefcaseBusiness size={20} />
                  <span className="font-bold">All Jobs</span>
                  <span className="h-7 w-7 rounded-full bg-brand text-white dark:text-background flex items-center justify-center text-sm font-medium">
                    {totalJobs}
                  </span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-muted-foreground text-sm">
                Showing {jobs.length} of {totalJobs} jobs
              </p>
            </div>

            {/* Mobile filters */}
            <MobileFilters />
          </div>

          {/* Active filters */}
          {isFilterApplied ? <ActiveFilters jobs={jobs} /> : null}
        </div>
        <div className="flex items-start gap-6">
          <Filters />
          <div className="w-full border h-100 p-6 flex flex-col items-center justify-center rounded-xl shadow-sm bg-card">
            <div className="relative h-10 w-10 rounded-lg bg-muted">
              <FolderOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="font-bold text-xl mt-4">No results found 😕</p>
            <p className="text-slate-600 dark:text-muted-foreground mt-2">
              Try clearing some filters or adjusting your search.
            </p>
            <p className="text-slate-600 dark:text-muted-foreground mt-1">
              For better results, use the exact search term. For example:{" "}
              <code>react.js</code> instead of <code>react</code>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-custom w-full mx-auto px-4 min-h-screen py-16 gap-6">
      <div>
        <div className="mb-6 flex items-end justify-between">
          <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-2">
            <div className="flex items-center gap-2 dark:text-background">
              <div className="w-fit bg-brand/10 border border-brand/20 text-brand p-2 rounded-tr-full rounded-br-full flex items-center gap-2">
                <BriefcaseBusiness size={20} />
                <span className="font-bold">All Jobs</span>
                <span className="h-7 w-7 rounded-full bg-brand text-white dark:text-background flex items-center justify-center text-sm font-medium">
                  {totalJobs}
                </span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-muted-foreground text-sm">
              Showing {jobs.length} of {totalJobs} jobs
            </p>
          </div>

          {/* Mobile filters */}
          <MobileFilters />
        </div>

        {/* Active filters */}
        {isFilterApplied ? <ActiveFilters jobs={jobs} /> : null}
      </div>
      <div className="flex items-start gap-6">
        <Filters />
        <div className="w-full">
          {/* Job listings */}
          <div className="grid gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          <JobPagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
