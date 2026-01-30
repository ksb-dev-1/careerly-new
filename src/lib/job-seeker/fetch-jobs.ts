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
export type FetchPublicJobsSuccess = {
  success: true;
  jobs: Job[];
  totalJobs: number;
  totalPages: number;
};

export type FetchPublicJobsError = {
  success: false;
  message: string;
  status: 500;
};

export type FetchPublicJobsResponse =
  | FetchPublicJobsSuccess
  | FetchPublicJobsError;

export type Filter = {
  jobType?: string[];
  jobMode?: string[];
  experience?: string;
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

export type FetchUserSpecificJobDataSuccess = {
  success: true;
  relationships: Record<string, JobRelationship>;
};

export type FetchUserSpecificJobDataError = {
  success: false;
  message: string;
  status: 401 | 403 | 500;
};

export type FetchUserSpecificJobDataResponse =
  | FetchUserSpecificJobDataSuccess
  | FetchUserSpecificJobDataError;

export type JobWithRelationships = Job & {
  isBookmarked?: boolean;
  isApplied?: boolean;
  applicationStatus?: ApplicationStatus;
  appliedOn?: Date | null;
};

export type FetchJobsWithUserSpecificDataSuccess = {
  success: true;
  jobs: JobWithRelationships[];
  totalJobs: number;
  totalPages: number;
};

export type FetchJobsWithUserSpecificDataError = {
  success: false;
  message: string;
  status: 401 | 403 | 404 | 500;
};

export type FetchJobsWithUserSpecificDataResponse =
  | FetchJobsWithUserSpecificDataSuccess
  | FetchJobsWithUserSpecificDataError;

// ----------------------------------------
// Fetch Public Jobs (CACHED - NO AUTH)
// ----------------------------------------
export async function fetchPublicJobs(
  filters: Filter,
): Promise<FetchPublicJobsResponse> {
  "use cache";
  cacheLife("max");
  cacheTag("jobs-public");
  console.log("🔵 Fetching public jobs with filters:");

  const limit = filters.limit ?? 5;
  const page = filters.page ?? 1;
  const skip = (page - 1) * limit;

  const jobTypes = (filters.jobType ?? []).filter((t): t is JobType =>
    Object.values(JobType).includes(t as JobType),
  );

  const jobModes = (filters.jobMode ?? []).filter((m): m is JobMode =>
    Object.values(JobMode).includes(m as JobMode),
  );

  const conditions: Prisma.JobWhereInput[] = [
    { jobStatus: JobStatus.OPEN },
    { isDeleted: false },
  ];

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

  if (jobTypes.length) {
    conditions.push({ jobType: { in: jobTypes } });
  }

  if (jobModes.length) {
    conditions.push({ jobMode: { in: jobModes } });
  }

  // Add experience filter with range overlap logic
  // If filter is "3-6", include jobs with ranges like "3-4", "4-5", "5-6", "3-6", "2-7", etc.
  let experienceFilter: { min: number; max: number } | null = null;

  if (filters.experience?.trim()) {
    const expRange = filters.experience.trim();
    const match = expRange.match(/^(\d+)-(\d+)$/);

    if (match) {
      const [, filterMin, filterMax] = match;
      const filterMinNum = parseInt(filterMin, 10);
      const filterMaxNum = parseInt(filterMax, 10);

      experienceFilter = {
        min: filterMinNum,
        max: filterMaxNum,
      };

      // Add a condition to filter jobs that have experience field matching the pattern
      // This will at least filter out jobs without experience or with invalid format
      conditions.push({
        experience: {
          contains: "-", // Must contain a hyphen (basic validation)
        },
      });
    }
  }

  const where: Prisma.JobWhereInput = { AND: conditions };

  try {
    const [allJobs] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      }),
      prisma.job.count({ where }),
    ]);

    // Filter by experience range overlap if needed
    let jobs = allJobs;

    if (experienceFilter) {
      jobs = allJobs.filter((job) => {
        if (!job.experience) return false;

        const match = job.experience.match(/^(\d+)-(\d+)$/);
        if (!match) return false;

        const [, jobMin, jobMax] = match;
        const jobMinNum = parseInt(jobMin, 10);
        const jobMaxNum = parseInt(jobMax, 10);

        // Check if ranges overlap
        // Ranges overlap if: jobMin <= filterMax AND jobMax >= filterMin
        return (
          jobMinNum <= experienceFilter.max && jobMaxNum >= experienceFilter.min
        );
      });
    }

    // Apply pagination after filtering
    const totalJobs = jobs.length;
    const paginatedJobs = jobs.slice(skip, skip + limit);

    return {
      success: true,
      jobs: paginatedJobs,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
    };
  } catch (error) {
    console.error("[fetchPublicJobs] Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed to fetch jobs",
    };
  }
}

// ----------------------------------------
// User Job Relationships (CACHED PER USER)
// ----------------------------------------
export async function fetchUserSpecificJobData(
  jobSeekerId: string,
  role: UserRole,
  jobIds: string[],
): Promise<FetchUserSpecificJobDataResponse> {
  "use cache";
  cacheLife("max");
  cacheTag(`jobs-${jobSeekerId}`);
  console.log("🔵 Fetching user-specific job data");

  if (!jobSeekerId || jobIds.length === 0) {
    return { success: true, relationships: {} };
  }

  if (role !== UserRole.JOB_SEEKER) {
    return {
      success: false,
      message: "User is not a job seeker",
      status: 403,
    };
  }

  try {
    // Single optimized query using raw SQL for better performance
    const [bookmarks, applications] = await Promise.all([
      prisma.bookmark.findMany({
        where: {
          userId: jobSeekerId,
          jobId: { in: jobIds },
        },
        select: { jobId: true },
      }),
      prisma.jobApplication.findMany({
        where: {
          userId: jobSeekerId,
          jobId: { in: jobIds },
        },
        select: {
          jobId: true,
          applicationStatus: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const bookmarkSet = new Set(bookmarks.map((b) => b.jobId));
    const applicationMap = new Map(applications.map((a) => [a.jobId, a]));

    const relationships: Record<string, JobRelationship> = {};

    for (const jobId of jobIds) {
      const application = applicationMap.get(jobId);
      relationships[jobId] = {
        isBookmarked: bookmarkSet.has(jobId),
        isApplied: Boolean(application),
        applicationStatus: application?.applicationStatus ?? "PENDING",
        appliedOn: application?.createdAt ?? null,
      };
    }

    return { success: true, relationships };
  } catch (error) {
    console.error("[fetchUserSpecificJobData] Error:", error);
    return {
      success: false,
      message: "Failed to fetch user job data",
      status: 500,
    };
  }
}

// ----------------------------------------
// Merge Public Jobs + User Data (NO CACHE - ORCHESTRATOR)
// ----------------------------------------
export async function fetchJobs(
  filters: Filter,
): Promise<FetchJobsWithUserSpecificDataResponse> {
  try {
    // Parallel fetch: auth + public jobs
    const [session, publicJobsResponse] = await Promise.all([
      auth(),
      fetchPublicJobs(filters),
    ]);

    if (!publicJobsResponse.success) {
      return {
        success: false,
        message: publicJobsResponse.message,
        status: publicJobsResponse.status,
      };
    }

    const { jobs, totalJobs, totalPages } = publicJobsResponse;

    // No user or no jobs - return public data immediately
    if (!session?.user.id || jobs.length === 0) {
      return {
        success: true,
        jobs: jobs.map((job) => ({
          ...job,
          isBookmarked: false,
          isApplied: false,
          applicationStatus: "PENDING" as ApplicationStatus,
          appliedOn: null,
        })),
        totalJobs,
        totalPages,
      };
    }

    // Fetch user-specific data (cached per user)
    const jobIds = jobs.map((job) => job.id);
    const userDataResponse = await fetchUserSpecificJobData(
      session.user.id,
      session.user.role,
      jobIds,
    );

    if (userDataResponse.success) {
      const jobsWithRelationships = jobs.map((job) => {
        const relationship = userDataResponse.relationships[job.id];
        return {
          ...job,
          isBookmarked: relationship?.isBookmarked ?? false,
          isApplied: relationship?.isApplied ?? false,
          applicationStatus: relationship?.applicationStatus ?? "PENDING",
          appliedOn: relationship?.appliedOn ?? null,
        };
      });

      return {
        success: true,
        jobs: jobsWithRelationships,
        totalJobs,
        totalPages,
      };
    }

    // Fallback if user data fetch fails
    return {
      success: true,
      jobs: jobs.map((job) => ({
        ...job,
        isBookmarked: false,
        isApplied: false,
        applicationStatus: "PENDING" as ApplicationStatus,
        appliedOn: null,
      })),
      totalJobs,
      totalPages,
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
