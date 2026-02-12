"use server";

// ----------------------------------------
// Imports
// ----------------------------------------
import { updateTag } from "next/cache";

// auth
import { auth } from "@/auth";

// lib
import { prisma } from "@/lib/prisma";

// generated
import { ApplicationStatus, JobStatus } from "@/generated/prisma/client";

// emails
import { sendJobApplyConfirmationEmail } from "@/emails/_lib/send-job-apply-confirmation";

// 3rd party
import z from "zod";

// ----------------------------------------
// Types
// ----------------------------------------
export type ApplyForJobActionSuccess = {
  success: true;
  status: 200;
  isApplied: boolean;
};

export type ApplyForJobActionError = {
  success: false;
  status: 400 | 401 | 404 | 500;
  message: string;
};

export type ApplyForJobActionResponse =
  | ApplyForJobActionSuccess
  | ApplyForJobActionError;

// ----------------------------------------
// Apply For Job Server action
// ----------------------------------------
export async function applyForJob(
  jobId: string,
): Promise<ApplyForJobActionResponse> {
  const session = await auth();
  const jobSeekerId = session?.user.id;

  if (!jobSeekerId) {
    return {
      success: false,
      status: 401,
      message: "User must be signed in",
    };
  }

  if (!session.user.email) {
    return {
      success: false,
      status: 400,
      message: "User email is required",
    };
  }

  const idCheck = z.uuid().safeParse(jobId);
  if (!idCheck.success || !jobId) {
    return {
      success: false,
      status: 400,
      message: "Invalid job ID",
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Check if the user already applied
      const existingApp = await tx.jobApplication.findUnique({
        where: { userId_jobId: { userId: jobSeekerId, jobId } },
      });

      if (existingApp) {
        throw new Error("You have already applied to this job");
      }

      // 2️⃣ Atomically decrement openings if > 0 and job is OPEN
      const updatedJob = await tx.job.updateMany({
        where: {
          id: jobId,
          jobStatus: JobStatus.OPEN,
          openings: { gt: 0 },
        },
        data: { openings: { decrement: 1 } },
      });

      if (updatedJob.count === 0) {
        throw new Error("This job is no longer accepting applications");
      }

      // 3️⃣ Fetch job info for email and caching
      const job = await tx.job.findUnique({
        where: { id: jobId },
        select: {
          employerId: true,
          role: true,
          companyName: true,
        },
      });

      if (!job) return null;

      // 4️⃣ Create job application
      await tx.jobApplication.create({
        data: {
          jobId,
          userId: jobSeekerId,
          applicationStatus: ApplicationStatus.PENDING,
        },
      });

      return job;
    });

    if (!result) {
      return {
        success: false,
        status: 404,
        message: "Job not found",
      };
    }

    if (!process.env.EMAIL_FROM) {
      return {
        success: false,
        status: 500,
        message: "Email configuration is missing",
      };
    }

    // 5️⃣ Send confirmation email
    await sendJobApplyConfirmationEmail({
      to: session.user.email,
      from: process.env.EMAIL_FROM,
      role: result.role,
      companyName: result.companyName,
    });

    // 6️⃣ Update caches
    updateTag(`jobs-${jobSeekerId}`);
    updateTag(`bookmarks-${jobSeekerId}`);
    updateTag(`applications-${jobSeekerId}`);
    updateTag(`job-details-${jobSeekerId}`);
    updateTag(`job-details-${jobId}-${jobSeekerId}`);

    updateTag(`posted-jobs-${result.employerId}`);
    updateTag(`posted-job-details-${jobId}-${result.employerId}`);

    return {
      success: true,
      status: 200,
      isApplied: true,
    };
  } catch (error: any) {
    console.error("Error applying for job:", error);

    return {
      success: false,
      status: 500,
      message: error.message || "Failed to apply for job",
    };
  }
}

// ✅ Key Takeaways

// 1. findUnique + update = two separate queries → not atomic → race condition
// 2. updateMany with condition = one atomic query → safe for concurrent users
// 3. Always check updatedJob.count to see if the decrement succeeded.
