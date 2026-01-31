// ----------------------------------------
// Imports
// ----------------------------------------

// generated
import { ApplicationStatus } from "@/generated/prisma/client";

// lib
import { getJobApplicationStatusColor } from "@/lib/utils";
import { JobDetailsWithBookmarkStatusAndApplicationStatus } from "@/lib/job-seeker/fetch-job-details";

// components
import { BookmarkButton } from "@/components/job-seeker/BookmarkButton";
import { JobCardHeader } from "@/components/JobCardHeader";
import { JobCardMetadata } from "@/components/JobCardMetadata";
import { JobCardFooter } from "@/components/JobCardFooter";
import { JobDescription } from "@/components/JobDescription";
import { Card } from "@/components/ui/card";

// ----------------------------------------
// Application Status Info Component
// ----------------------------------------
interface ApplicationStatusInfoProps {
  applicationStatus: ApplicationStatus;
  appliedOn: Date | null;
}

function ApplicationStatusInfo({
  applicationStatus,
  appliedOn,
}: ApplicationStatusInfoProps) {
  function getMessage(status: ApplicationStatus) {
    switch (status) {
      case ApplicationStatus.PENDING:
        return "Your application has been received successfully and is now under review by the hiring team. You will be notified once there is an update.";

      case ApplicationStatus.APPROVED:
        return "Your application has been shortlisted. The hiring team will contact you soon regarding the next steps in the selection process.";

      case ApplicationStatus.OFFERED:
        return "Congratulations! You have received a job offer. Please review the offer details carefully and respond within the given timeline.";

      case ApplicationStatus.REJECTED:
        return "Thank you for applying. After careful consideration, your application was not selected for this role. We encourage you to apply for other opportunities.";

      default:
        return "There has been an update to your application status. Please log in to your account for more details.";
    }
  }

  return (
    <>
      {appliedOn ? (
        <div
          className={`${getJobApplicationStatusColor(applicationStatus)} p-4 rounded-xl shadow-sm`}
        >
          <p className="font-bold">
            Applied on - {new Date(appliedOn).toLocaleDateString()}
          </p>
          <p className="font-medium mt-2">{getMessage(applicationStatus)}</p>
        </div>
      ) : null}
    </>
  );
}

// ----------------------------------------
// Job Card Component
// ----------------------------------------
interface JobCardProps {
  job: JobDetailsWithBookmarkStatusAndApplicationStatus;
}

function JobCard({ job }: JobCardProps) {
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
    resume,
  } = job;

  return (
    <div key={id} className="relative">
      <Card
        className={`${isFeatured ? "bg-brand/5 border-brand/20" : ""} h-full outline-brand/50 hover:outline-3 transition-all duration-100`}
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
        <JobCardFooter
          variant="job-details"
          postedOn={createdAt}
          jobId={id}
          appliedOn={appliedOn}
          resume={resume}
        />
      </Card>

      {/* Bookmark button */}
      <BookmarkButton
        jobId={id}
        isBookmarked={isBookmarked}
        className="absolute bottom-6 right-6"
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
interface JobDetailsProps {
  job: JobDetailsWithBookmarkStatusAndApplicationStatus;
}

export function JobDetails({ job }: JobDetailsProps) {
  return (
    <div className="min-h-screen max-w-4xl w-full pt-32 pb-16 mx-auto px-4 space-y-6">
      {/* Job Card */}
      <JobCard job={job} />

      {/* Apply for Job Section */}
      <ApplicationStatusInfo
        applicationStatus={job.applicationStatus}
        appliedOn={job.appliedOn}
      />

      {/* Job Description */}
      <JobDescription description={job.description} />
    </div>
  );
}
