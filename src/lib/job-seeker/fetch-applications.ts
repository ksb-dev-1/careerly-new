// ----------------------------------------
// Imports
// ----------------------------------------

// lib
import { prisma } from "@/lib/prisma";

// 3rd party
import { Job, ApplicationStatus, UserRole } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { cacheLife, cacheTag } from "next/cache";

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
  status: 401 | 403 | 500;
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
// Fetch cached applications
// ----------------------------------------
async function _fetchCachedApplications(
  jobSeekerId?: string,
): Promise<FetchApplicationsResponse> {
  "use cache";
  cacheLife("max");
  cacheTag(`applications-${jobSeekerId}`);
  console.log("🔵 DB HIT: fetching applications");

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

// ----------------------------------------
// Fetch applications
// ----------------------------------------
export async function fetchApplications(): Promise<FetchApplicationsResponse> {
  const session = await auth();

  const jobSeekerId = session?.user.id;
  const role = session?.user.role;

  if (!jobSeekerId) {
    return {
      success: false,
      message: "You must be signed in to fetch applications",
      status: 401,
    };
  }

  if (role !== UserRole.JOB_SEEKER) {
    return {
      success: false,
      message: "Only users with the Job Seeker role can fetch applications",
      status: 403,
    };
  }

  return _fetchCachedApplications(jobSeekerId);
}
