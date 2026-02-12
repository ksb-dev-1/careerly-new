"use server";

// ----------------------------------------
// Imports
// ----------------------------------------

// generated
import { ApplicationStatus, Job } from "@/generated/prisma/client";

// lib
import { prisma } from "@/lib/prisma";

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

// ----------------------------------------
// Fetch bookmarks
// ----------------------------------------
export async function fetchBookmarks(
  jobSeekerId: string,
): Promise<FetchBookmarksResponse> {
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
