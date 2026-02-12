// ----------------------------------------
// Imports
// ----------------------------------------
import { cacheLife, cacheTag } from "next/cache";

// auth
import { auth } from "@/auth";

// generated
import {
  ApplicationStatus,
  Job,
  Resume,
  UserRole,
} from "@/generated/prisma/client";

// lib
import { prisma } from "@/lib/prisma";

// 3rd party
import { z } from "zod";

// ----------------------------------------
// Types
// ----------------------------------------
export type JobDetailsWithUserSpecificData = Job & {
  isBookmarked: boolean;
  isApplied: boolean;
  applicationStatus: ApplicationStatus;
  appliedOn: Date | null;
  resume: Resume | null;
};

export type FetchJobDetailsSuccess = {
  success: true;
  job: JobDetailsWithUserSpecificData;
};

export type FetchJobDetailsError = {
  success: false;
  status: 400 | 401 | 403 | 404 | 500;
  message: string;
};

export type FetchJobDetailsResponse =
  | FetchJobDetailsSuccess
  | FetchJobDetailsError;

// ----------------------------------------
// Fetch cached job details
// ----------------------------------------
async function _fetchCachedJobDetails(
  jobSeekerId: string,
  jobId: string,
): Promise<FetchJobDetailsResponse> {
  "use cache";
  cacheLife("max");
  cacheTag(`job-details-${jobSeekerId}`);
  cacheTag(`job-details-${jobId}-${jobSeekerId}`);
  console.log("🔵 DB HIT: fetching job details", jobId);

  try {
    // 1️⃣ Validate jobId
    const idCheck = z.uuid().safeParse(jobId);
    if (!idCheck.success) {
      return {
        success: false,
        message: "Bad Request - Invalid job ID format.",
        status: 400,
      };
    }

    // 2️⃣ Fetch job, bookmark, application, and resume in parallel
    const [job, bookmark, application, resume] = await Promise.all([
      prisma.job.findFirst({
        where: { id: jobId, jobStatus: "OPEN", isDeleted: false },
      }),
      prisma.bookmark.findFirst({
        where: { jobId, userId: jobSeekerId },
        select: { id: true },
      }),
      prisma.jobApplication.findFirst({
        where: { jobId, userId: jobSeekerId },
        select: { applicationStatus: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.resume.findUnique({
        where: { userId: jobSeekerId },
      }),
    ]);

    if (!job) {
      return { success: false, message: "Job not found", status: 404 };
    }

    // 3️⃣ Merge job with relationship + resume
    const jobWithRelationship: JobDetailsWithUserSpecificData = {
      ...job,
      isBookmarked: Boolean(bookmark),
      isApplied: Boolean(application),
      applicationStatus: application?.applicationStatus ?? "PENDING",
      appliedOn: application?.createdAt ?? null,
      resume: resume ?? null,
    };

    return { success: true, job: jobWithRelationship };
  } catch (error) {
    console.error("[fetchJobDetails] Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

// ----------------------------------------
// Fetch job details
// ----------------------------------------
export async function fetchJobDetails(
  jobId: string,
): Promise<FetchJobDetailsResponse> {
  const session = await auth();

  const jobSeekerId = session?.user.id;
  const role = session?.user.role;

  if (!jobSeekerId) {
    return {
      success: false,
      message: "You must be signed in to fetch job details",
      status: 401,
    };
  }

  if (role !== UserRole.JOB_SEEKER) {
    return {
      success: false,
      message: "Only users with the Job Seeker role can fetch job details",
      status: 403,
    };
  }

  return _fetchCachedJobDetails(jobSeekerId, jobId);
}
