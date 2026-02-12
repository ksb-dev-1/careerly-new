// ----------------------------------------
// Imports
// ----------------------------------------

// generated
import { ApplicationStatus, Job, Resume } from "@/generated/prisma/client";

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
  status: 400 | 404 | 500;
  message: string;
};

export type FetchJobDetailsResponse =
  | FetchJobDetailsSuccess
  | FetchJobDetailsError;

// ----------------------------------------
// Fetch cached job details
// ----------------------------------------
export async function fetchJobDetails(
  jobSeekerId: string,
  jobId: string,
): Promise<FetchJobDetailsResponse> {
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
