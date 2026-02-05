// // ----------------------------------------
// // Imports
// // ----------------------------------------
// import { cacheLife, cacheTag } from "next/cache";

// // auth
// import { auth } from "@/auth";

// // lib
// import { prisma } from "@/lib/prisma";

// // 3rd party
// import z from "zod";
// import {
//   Job,
//   Resume,
//   ApplicationStatus,
//   UserRole,
// } from "@/generated/prisma/client";

// // ----------------------------------------
// // Types
// // ----------------------------------------
// type ApiErrorStatus = 400 | 401 | 403 | 404 | 500;

// export type FetchPublicJobDetailsSuccess = {
//   success: true;
//   job: Job;
// };

// export type FetchPublicJobDetailsError = {
//   success: false;
//   message: string;
//   status: 400 | 404 | 500;
// };

// export type FetchPublicJobDetailsResponse =
//   | FetchPublicJobDetailsSuccess
//   | FetchPublicJobDetailsError;

// export type UserJobRelationship = {
//   isBookmarked: boolean;
//   applicationStatus: ApplicationStatus;
//   appliedOn: Date | null;
//   resume: Resume | null;
// };

// export type FetchJobDetailsWithUserSpecificDataSuccess = {
//   success: true;
//   relationship: UserJobRelationship;
// };

// export type FetchJobDetailsWithUserSpecificDataError = {
//   success: false;
//   message: string;
//   status: 401 | 403 | 404 | 500;
// };

// export type FetchJobDetailsWithUserSpecificDataResponse =
//   | FetchJobDetailsWithUserSpecificDataSuccess
//   | FetchJobDetailsWithUserSpecificDataError;

// export type JobDetailsWithBookmarkStatusAndApplicationStatus = Job & {
//   isBookmarked: boolean;
//   applicationStatus: ApplicationStatus;
//   appliedOn: Date | null;
//   resume: Resume | null;
// };

// type FetchJobDetailsSuccess = {
//   success: true;
//   status: 200;
//   job: JobDetailsWithBookmarkStatusAndApplicationStatus;
// };

// type FetchJobDetailsError = {
//   success: false;
//   message: string;
//   status: 400 | 401 | 403 | 404 | 500;
// };

// export type FetchJobResponse = FetchJobDetailsSuccess | FetchJobDetailsError;

// // ----------------------------------------
// // 1. PUBLIC Job Details (No Auth Required)
// // ----------------------------------------
// export async function fetchPublicJobDetails(
//   jobId: string,
// ): Promise<FetchPublicJobDetailsResponse> {
//   "use cache";
//   cacheLife("max");
//   cacheTag(`job-details-${jobId}`);
//   console.log(`🔵 DB HIT: fetching PUBLIC job details - ${jobId}`);

//   const idCheck = z.uuid().safeParse(jobId);
//   if (!idCheck.success) {
//     return {
//       success: false,
//       message: "Bad Request - Invalid job ID format.",
//       status: 400,
//     };
//   }

//   try {
//     const job = await prisma.job.findFirst({
//       where: {
//         id: jobId,
//       },
//     });

//     if (!job) {
//       return {
//         success: false,
//         message: "Job details not found.",
//         status: 404,
//       };
//     }

//     return {
//       success: true,
//       job,
//     };
//   } catch (error) {
//     console.error("Failed to fetch public job details:", error);
//     return {
//       success: false,
//       message: "Internal Server Error",
//       status: 500,
//     };
//   }
// }

// // ----------------------------------------
// // 2. User Job Relationship for Single Job (Auth Required)
// // ----------------------------------------
// export async function fetchJobDetailsWithUserSpecificData(
//   jobSeekerId?: string,
//   jobId?: string,
//   role?: UserRole,
// ): Promise<FetchJobDetailsWithUserSpecificDataResponse> {
//   "use cache";
//   cacheLife("max");
//   cacheTag(`job-details-${jobSeekerId}`);
//   cacheTag(`job-details-${jobId}-${jobSeekerId}`);
//   console.log(
//     `🔵 DB HIT: fetching job details with user specific data - ${jobId}`,
//   );

//   if (role !== UserRole.JOB_SEEKER) {
//     return {
//       success: false,
//       message: "Only job seekers can view this page",
//       status: 403,
//     };
//   }

//   if (!jobSeekerId) {
//     return {
//       success: false,
//       message: "User not authenticated",
//       status: 401,
//     };
//   }

//   try {
//     const [jobWithRelationships, resume] = await Promise.all([
//       prisma.job.findUnique({
//         where: { id: jobId },
//         select: {
//           bookmarks: {
//             where: { userId: jobSeekerId },
//             select: { id: true },
//           },
//           applications: {
//             where: { userId: jobSeekerId },
//             select: {
//               applicationStatus: true,
//               updatedAt: true,
//             },
//           },
//         },
//       }),
//       prisma.resume.findUnique({
//         where: { userId: jobSeekerId },
//       }),
//     ]);

//     if (!jobWithRelationships) {
//       return {
//         success: false,
//         message: "Job not found or access denied",
//         status: 404,
//       };
//     }

//     const isBookmarked = jobWithRelationships.bookmarks.length > 0;
//     const userApplication = jobWithRelationships.applications[0];
//     const applicationStatus =
//       userApplication?.applicationStatus || ApplicationStatus.PENDING;
//     const appliedOn = userApplication?.updatedAt || null;

//     return {
//       success: true,
//       relationship: {
//         isBookmarked,
//         applicationStatus,
//         appliedOn,
//         resume,
//       },
//     };
//   } catch (error) {
//     console.error("Failed to fetch user job relationship:", error);
//     return {
//       success: false,
//       message: "Failed to fetch user job relationship",
//       status: 500,
//     };
//   }
// }

// // ----------------------------------------
// // 3. Merged Job Details with User Data
// // ----------------------------------------
// export async function fetchJobDetails(
//   jobId: string,
// ): Promise<FetchJobResponse> {
//   const session = await auth();
//   const jobSeekerId = session?.user.id;
//   const role = session?.user.role;

//   try {
//     const publicJobResponse = await fetchPublicJobDetails(jobId);

//     if (!publicJobResponse.success) {
//       return {
//         success: false,
//         message: publicJobResponse.message,
//         status: publicJobResponse.status,
//       };
//     }

//     const { job: publicJob } = publicJobResponse;

//     if (jobSeekerId) {
//       const userRelationshipResponse =
//         await fetchJobDetailsWithUserSpecificData(jobSeekerId, jobId, role);

//       if (userRelationshipResponse.success) {
//         const mergedJob: JobDetailsWithBookmarkStatusAndApplicationStatus = {
//           ...publicJob,
//           ...userRelationshipResponse.relationship,
//         };

//         return {
//           success: true,
//           status: 200,
//           job: mergedJob,
//         };
//       }
//     }

//     const jobWithoutUserData: JobDetailsWithBookmarkStatusAndApplicationStatus =
//       {
//         ...publicJob,
//         isBookmarked: false,
//         applicationStatus: ApplicationStatus.PENDING,
//         appliedOn: null,
//         resume: null,
//       };

//     return {
//       success: true,
//       status: 200,
//       job: jobWithoutUserData,
//     };
//   } catch (error) {
//     console.error("Failed to fetch job details:", error);
//     return {
//       success: false,
//       message: "Internal Server Error",
//       status: 500,
//     };
//   }
// }

// ----------------------------------------
// Imports
// ----------------------------------------
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ApplicationStatus, Job, Resume } from "@/generated/prisma/client";

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

export type FetchJobDetailsResponse =
  | { success: true; job: JobDetailsWithUserSpecificData }
  | { success: false; message: string; status: 400 | 404 | 500 };

// ----------------------------------------
// Fetch Job Details (Private, for logged-in users)
// ----------------------------------------
export async function fetchJobDetails(
  jobSeekerId: string,
  jobId: string,
): Promise<FetchJobDetailsResponse> {
  try {
    // 1️⃣ Validate jobId
    const idCheck = z.string().uuid().safeParse(jobId);
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
