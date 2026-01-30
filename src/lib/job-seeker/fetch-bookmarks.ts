// ----------------------------------------
// Imports
// ----------------------------------------
import { cacheLife, cacheTag } from "next/cache";

// auth
import { auth } from "@/auth";

// generated
import { UserRole } from "@/generated/prisma/client";

// lib
import { prisma } from "@/lib/prisma";

// 3rd party
import { ApplicationStatus, Job } from "@/generated/prisma/client";

// ----------------------------------------
// Types
// ----------------------------------------
export type BookmarksWithIsApplied = Job & {
  isBookmarked: boolean;
  appliedOn: Date | null;
  applicationStatus: ApplicationStatus | null;
};

export type FetchBookmarkSuccess = {
  success: true;
  status: 200;
  bookmarks: BookmarksWithIsApplied[];
};

export type FetchBookmarkError = {
  success: false;
  status: 500;
  message: string;
};

export type FetchBookmarksResponse = FetchBookmarkSuccess | FetchBookmarkError;

export type BookmarkWithJob = {
  job: Job & {
    applications: { applicationStatus: string }[];
  };
};

// ----------------------------------------
// Data fetching helper function
// ----------------------------------------
export async function fetchBookmarks(
  jobSeekerId?: string,
): Promise<FetchBookmarksResponse> {
  "use cache";
  cacheLife("max");
  cacheTag(`bookmarks-${jobSeekerId}`);
  console.log("🔵 DB HIT: fetching bookmarks");

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: jobSeekerId },
      orderBy: { createdAt: "asc" },
      include: {
        job: {
          include: {
            applications: {
              where: { userId: jobSeekerId },
              select: {
                applicationStatus: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    const bookmarksWithStatus = bookmarks.map((item) => {
      const application = item.job.applications[0] ?? null;

      return {
        ...item.job,
        isBookmarked: true,
        appliedOn: application?.createdAt ?? null,
        applicationStatus:
          application?.applicationStatus ?? ApplicationStatus.PENDING,
      };
    });

    return {
      success: true,
      status: 200,
      bookmarks: bookmarksWithStatus,
    };
  } catch (error) {
    console.error("Failed to fetch bookmarks:", (error as Error).message);

    return {
      success: false,
      status: 500,
      message: (error as Error).message || "Internal Server Error",
    };
  }
}

// export async function fetchBookmarks(): Promise<FetchBookmarksResponse> {
//   const session = await auth();
//   if (!session?.user.id) {
//     return {
//       success: false,
//       status: 401,
//       message: "Unauthenticated",
//     };
//   }

//   if (session?.user.role !== UserRole.JOB_SEEKER) {
//     return {
//       success: false,
//       status: 403,
//       message: "Only user with job seeker role can access bookmarks.",
//     };
//   }

//   return fetchBookmarksHelper(session.user.id);
// }
