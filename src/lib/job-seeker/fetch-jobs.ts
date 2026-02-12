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
  JobMode,
  JobStatus,
  JobType,
  Prisma,
  UserRole,
} from "@/generated/prisma/client";

// lib
import { prisma } from "@/lib/prisma";

// ----------------------------------------
// Types
// ----------------------------------------
export type Filter = {
  jobType?: string[];
  jobMode?: string[];
  experience?: [number, number]; // ✅ tuple
  page?: number;
  limit?: number;
  search?: string;
};

export type JobRelationship = {
  isBookmarked: boolean;
  isApplied: boolean;
  applicationStatus: ApplicationStatus;
  appliedOn: Date | null;
};

export type JobWithRelationships = Job & JobRelationship;

export type FetchJobsResponse =
  | {
      success: true;
      jobs: JobWithRelationships[];
      totalJobs: number;
      totalPages: number;
    }
  | {
      success: false;
      message: string;
      status: 401 | 403 | 500;
    };

// ----------------------------------------
// Fetch cached jobs
// ----------------------------------------
// async function _fetchJobsCached(
//   filters: Filter,
//   jobSeekerId: string,
// ): Promise<FetchJobsResponse> {
//   "use cache";
//   cacheLife("max");
//   cacheTag(`jobs-${jobSeekerId}`);
//   console.log("🔵 DB HIT: fetching jobs", filters);

//   try {
//     const limit = filters.limit ?? 6;
//     const page = filters.page ?? 1;
//     const skip = (page - 1) * limit;

//     // ----------------------------------------
//     // Build filters
//     // ----------------------------------------
//     const conditions: Prisma.JobWhereInput[] = [
//       { jobStatus: JobStatus.OPEN },
//       { isDeleted: false },
//     ];

//     if (filters.search?.trim()) {
//       const term = filters.search.trim();
//       conditions.push({
//         OR: [
//           { role: { contains: term, mode: "insensitive" } },
//           { companyName: { contains: term, mode: "insensitive" } },
//           { skills: { hasSome: [term] } },
//         ],
//       });
//     }

//     if (filters.jobType?.length) {
//       conditions.push({
//         jobType: {
//           in: filters.jobType.filter((t): t is JobType =>
//             Object.values(JobType).includes(t as JobType),
//           ),
//         },
//       });
//     }

//     if (filters.jobMode?.length) {
//       conditions.push({
//         jobMode: {
//           in: filters.jobMode.filter((m): m is JobMode =>
//             Object.values(JobMode).includes(m as JobMode),
//           ),
//         },
//       });
//     }

//     const where: Prisma.JobWhereInput = { AND: conditions };

//     // ----------------------------------------
//     // Fetch jobs + relationships in parallel
//     // ----------------------------------------
//     const [jobs, totalJobs, bookmarks, applications] = await Promise.all([
//       prisma.job.findMany({
//         where,
//         orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
//         skip,
//         take: limit,
//       }),

//       prisma.job.count({ where }),

//       prisma.bookmark.findMany({
//         where: {
//           userId: jobSeekerId,
//         },
//         select: { jobId: true },
//       }),

//       prisma.jobApplication.findMany({
//         where: {
//           userId: jobSeekerId,
//         },
//         select: {
//           jobId: true,
//           applicationStatus: true,
//           createdAt: true,
//         },
//         orderBy: { createdAt: "desc" },
//       }),
//     ]);

//     // ----------------------------------------
//     // Build lookup maps
//     // ----------------------------------------
//     const bookmarkSet = new Set(bookmarks.map((b) => b.jobId));
//     const applicationMap = new Map(applications.map((a) => [a.jobId, a]));

//     // ----------------------------------------
//     // Merge
//     // ----------------------------------------
//     const jobsWithRelationships: JobWithRelationships[] = jobs.map((job) => {
//       const application = applicationMap.get(job.id);

//       return {
//         ...job,
//         isBookmarked: bookmarkSet.has(job.id),
//         isApplied: Boolean(application),
//         applicationStatus: application?.applicationStatus ?? "PENDING",
//         appliedOn: application?.createdAt ?? null,
//       };
//     });

//     return {
//       success: true,
//       jobs: jobsWithRelationships,
//       totalJobs,
//       totalPages: Math.ceil(totalJobs / limit),
//     };
//   } catch (error) {
//     console.error("[fetchJobs] Error:", error);
//     return {
//       success: false,
//       message: "Failed to fetch jobs",
//       status: 500,
//     };
//   }
// }

async function _fetchJobsCached(
  filters: Filter,
  jobSeekerId: string,
): Promise<FetchJobsResponse> {
  "use cache";
  cacheLife("max");
  cacheTag(`jobs-${jobSeekerId}`);
  console.log("🔵 DB HIT: fetching jobs", filters);

  try {
    const limit = filters.limit ?? 6;
    const page = filters.page ?? 1;
    const skip = (page - 1) * limit;

    // ----------------------------------------
    // Build filters
    // ----------------------------------------
    const conditions: Prisma.JobWhereInput[] = [
      { jobStatus: JobStatus.OPEN },
      { isDeleted: false },
    ];

    // ----------------------------------------
    // Search
    // ----------------------------------------
    if (filters.search?.trim()) {
      const term = filters.search.trim();

      conditions.push({
        OR: [
          { role: { contains: term, mode: "insensitive" } },
          { companyName: { contains: term, mode: "insensitive" } },
          { skills: { hasSome: [term] } },
        ],
      });
    }

    // ----------------------------------------
    // Job Type
    // ----------------------------------------
    if (filters.jobType?.length) {
      conditions.push({
        jobType: {
          in: filters.jobType.filter((t): t is JobType =>
            Object.values(JobType).includes(t as JobType),
          ),
        },
      });
    }

    // ----------------------------------------
    // Job Mode
    // ----------------------------------------
    if (filters.jobMode?.length) {
      conditions.push({
        jobMode: {
          in: filters.jobMode.filter((m): m is JobMode =>
            Object.values(JobMode).includes(m as JobMode),
          ),
        },
      });
    }

    // ----------------------------------------
    // Experience Range (OVERLAP LOGIC)
    // ----------------------------------------
    // ----------------------------------------
    // Experience Range (OVERLAP LOGIC)
    // ----------------------------------------
    if (filters.experience) {
      const [minExp, maxExp] = filters.experience;

      conditions.push({
        AND: [
          { experienceMin: { lte: maxExp } },
          { experienceMax: { gte: minExp } },
        ],
      });
    }

    const where: Prisma.JobWhereInput = {
      AND: conditions,
    };

    // ----------------------------------------
    // Fetch everything in parallel
    // ----------------------------------------
    const [jobs, totalJobs, bookmarks, applications] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),

      prisma.job.count({ where }),

      prisma.bookmark.findMany({
        where: { userId: jobSeekerId },
        select: { jobId: true },
      }),

      prisma.jobApplication.findMany({
        where: { userId: jobSeekerId },
        select: {
          jobId: true,
          applicationStatus: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // ----------------------------------------
    // Relationship maps
    // ----------------------------------------
    const bookmarkSet = new Set(bookmarks.map((b) => b.jobId));
    const applicationMap = new Map(applications.map((a) => [a.jobId, a]));

    // ----------------------------------------
    // Merge data
    // ----------------------------------------
    const jobsWithRelationships: JobWithRelationships[] = jobs.map((job) => {
      const application = applicationMap.get(job.id);

      return {
        ...job,
        isBookmarked: bookmarkSet.has(job.id),
        isApplied: Boolean(application),
        applicationStatus: application?.applicationStatus ?? "PENDING",
        appliedOn: application?.createdAt ?? null,
      };
    });

    return {
      success: true,
      jobs: jobsWithRelationships,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
    };
  } catch (error) {
    console.error("[fetchJobs] Error:", error);

    return {
      success: false,
      message: "Failed to fetch jobs",
      status: 500,
    };
  }
}

// ----------------------------------------
// Fetch jobs
// ----------------------------------------
export async function fetchJobs(filters: Filter): Promise<FetchJobsResponse> {
  const session = await auth();

  const jobSeekerId = session?.user.id;
  const role = session?.user.role;

  if (!jobSeekerId) {
    return {
      success: false,
      message: "You must be signed in to fetch jobs",
      status: 401,
    };
  }

  if (role !== UserRole.JOB_SEEKER) {
    return {
      success: false,
      message: "Only users with the Job Seeker role can fetch jobs",
      status: 403,
    };
  }

  return _fetchJobsCached(filters, jobSeekerId);
}
