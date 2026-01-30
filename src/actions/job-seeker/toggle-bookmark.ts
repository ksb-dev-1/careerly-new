"use server";

// ----------------------------------------
// Imports
// ----------------------------------------
import { revalidatePath, updateTag } from "next/cache";

// auth
import { auth } from "@/auth";

// lib
import { prisma } from "@/lib/prisma";

// 3rd party
import z from "zod";

// ----------------------------------------
// Types
// ----------------------------------------
export type ToggleBookmarkActionSuccess = {
  success: true;
  status: 200;
  message: string;
};

export type ToggleBookmarkActionError = {
  success: false;
  status: 400 | 401 | 403 | 404 | 500 | 503;
  message: string;
};

export type ToggleBookmarkActionResponse =
  | ToggleBookmarkActionSuccess
  | ToggleBookmarkActionError;

// ----------------------------------------
// Toggle Bookmark Server action
// ----------------------------------------
export async function ToggleBookmark(
  jobId: string,
): Promise<ToggleBookmarkActionResponse> {
  const session = await auth();
  const jobSeekerId = session?.user.id;

  if (!jobSeekerId) {
    return {
      success: false,
      status: 401,
      message: "You must be signed in to access this page.",
    };
  }

  const idCheck = z.uuid().safeParse(jobId);

  if (!idCheck.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid job ID format.",
    };
  }

  try {
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_jobId: { userId: jobSeekerId, jobId }, // uses your @@unique([userId, jobId])
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          userId_jobId: { userId: jobSeekerId, jobId },
        },
      });

      updateTag(`jobs-public`);
      updateTag(`jobs-${jobSeekerId}`);
      updateTag(`applications-${jobSeekerId}`);
      updateTag(`bookmarks-${jobSeekerId}`);
      updateTag(`job-details-${jobId}-${jobSeekerId}`);

      return {
        success: true,
        status: 200,
        message: "Bookmark removed.",
      };
    }

    await prisma.bookmark.create({
      data: {
        userId: jobSeekerId,
        jobId,
      },
    });

    updateTag(`jobs-public`);
    updateTag(`jobs-${jobSeekerId}`);
    updateTag(`applications-${jobSeekerId}`);
    updateTag(`bookmarks-${jobSeekerId}`);
    updateTag(`job-details-${jobId}-${jobSeekerId}`);

    return {
      success: true,
      status: 200,
      message: "Bookmark added.",
    };
  } catch (error) {
    console.error("Failed to toggle bookmark", error);

    return {
      success: false,
      status: 500,
      message:
        (error as Error).message ||
        "Something went wrong while toggling the bookmark.",
    };
  }
}
