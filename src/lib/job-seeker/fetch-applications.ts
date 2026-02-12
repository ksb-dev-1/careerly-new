// ----------------------------------------
// Imports
// ----------------------------------------

// lib
import { prisma } from "@/lib/prisma";

// 3rd party
import { Job, ApplicationStatus } from "@/generated/prisma/client";

// ----------------------------------------
// Types
// ----------------------------------------
export type JobApplicationsWithBookmarkStatus = Job & {
  isBookmarked: boolean;
  applicationStatus: ApplicationStatus | null;
  appliedOn: Date | null;
};

export type FetchApplicationsSuccess = {
  success: true;
  status: 200;
  applications: JobApplicationsWithBookmarkStatus[];
};

export type FetchApplicationsError = {
  success: false;
  status: 500;
  message: string;
};

export type FetchApplicationsResponse =
  | FetchApplicationsSuccess
  | FetchApplicationsError;

export type JobApplicationWithJob = {
  job: Job & {
    bookmarks: { id: string }[];
    applications: { applicationStatus: ApplicationStatus; createdAt: Date }[];
  };
};

// ----------------------------------------
// Fetch  applications
// ----------------------------------------
export async function fetchApplications(
  jobSeekerId: string,
): Promise<FetchApplicationsResponse> {
  try {
    const applications = await prisma.jobApplication.findMany({
      where: { userId: jobSeekerId },
      orderBy: { createdAt: "asc" },
      include: {
        job: {
          include: {
            bookmarks: {
              where: { userId: jobSeekerId },
              select: { id: true },
            },
            applications: {
              where: { userId: jobSeekerId },
              select: { applicationStatus: true, createdAt: true },
            },
          },
        },
      },
    });

    const jobsWithStatus: JobApplicationsWithBookmarkStatus[] =
      applications.map((app: JobApplicationWithJob) => {
        const job = app.job;

        return {
          ...job,

          isBookmarked: job.bookmarks.length > 0,

          applicationStatus: job.applications[0]?.applicationStatus ?? null,

          appliedOn: job.applications[0]?.createdAt ?? null,
        };
      });

    return {
      success: true,
      status: 200,
      applications: jobsWithStatus,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: (error as Error).message ?? "Internal Server Error",
    };
  }
}
