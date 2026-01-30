"use server";

// ----------------------------------------
// Imports
// ----------------------------------------
import { updateTag } from "next/cache";

// auth
import { auth } from "@/auth";

// lib
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

// generated
import { Prisma } from "@/generated/prisma/client";

// ----------------------------------------
// Types
// ----------------------------------------
export type UploadResumeActionSuccess = {
  success: true;
  status: 200;
  message: string;
  data: {
    url: string;
    publicId: string;
    fileName: string;
    fileSize: number;
  };
};

export type UploadResumeActionError = {
  success: false;
  status: 400 | 404 | 500 | 503;
  message: string;
  data: null;
};

export type UploadResumeActionResponse =
  | UploadResumeActionSuccess
  | UploadResumeActionError;

// ----------------------------------------
// Constants
// ----------------------------------------
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ----------------------------------------
// Upload Resume Server Action
// ----------------------------------------
export async function uploadResume(
  base64File: string,
  fileName: string,
): Promise<UploadResumeActionResponse> {
  const session = await auth();
  const jobSeekerId = session?.user.id;

  try {
    if (!jobSeekerId) {
      return {
        success: false,
        status: 400,
        message: "User ID required",
        data: null,
      };
    }

    if (!fileName?.trim()) {
      return {
        success: false,
        status: 400,
        message: "File name required",
        data: null,
      };
    }

    if (!base64File) {
      return {
        success: false,
        status: 400,
        message: "File data required",
        data: null,
      };
    }

    const extension = fileName.split(".").pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        success: false,
        status: 400,
        message: `Only ${ALLOWED_EXTENSIONS.join(", ")} files allowed`,
        data: null,
      };
    }

    const buffer = Buffer.from(base64File, "base64");
    if (buffer.length > MAX_FILE_SIZE) {
      return {
        success: false,
        status: 400,
        message: "File too large (max 5MB)",
        data: null,
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: jobSeekerId },
      select: { id: true },
    });

    if (!user) {
      return {
        success: false,
        status: 404,
        message: "User not found",
        data: null,
      };
    }

    const cleanFileName = fileName
      .replace(/[<>:"/\\|?*]/g, "_")
      .replace(/\s+/g, "_")
      .slice(0, 255);

    const cloudinaryResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw",
            folder: "careerly/job-seeker/resumes",
            filename_override: cleanFileName,
            disposition: "attachment",
            use_filename: true,
          },
          (error, result) => {
            if (error) reject(new Error(`Cloudinary: ${error.message}`));
            else if (!result) reject(new Error("Upload failed"));
            else
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
          },
        )
        .end(buffer);
    });

    const existingResume = await prisma.resume.findUnique({
      where: { userId: jobSeekerId },
    });

    // ------------------------------
    // Transaction: upsert resume
    // ------------------------------
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.resume.upsert({
        where: { userId: jobSeekerId },
        update: {
          url: cloudinaryResult.secure_url,
          publicId: cloudinaryResult.public_id,
          fileName: cleanFileName,
          fileSize: buffer.length,
        },
        create: {
          userId: jobSeekerId,
          url: cloudinaryResult.secure_url,
          publicId: cloudinaryResult.public_id,
          fileName: cleanFileName,
          fileSize: buffer.length,
        },
      });
    });

    // Delete old resume from Cloudinary (optional, outside transaction)
    if (existingResume?.publicId) {
      try {
        await cloudinary.uploader.destroy(existingResume.publicId, {
          resource_type: "raw",
        });
      } catch (error) {
        console.warn("Failed to delete old resume:", error);
      }
    }

    const appliedJobs = await prisma.jobApplication.findMany({
      where: { userId: jobSeekerId },
      select: {
        jobId: true,
        job: {
          select: {
            employerId: true,
          },
        },
      },
    });

    for (const application of appliedJobs) {
      updateTag(
        `posted-job-details-${application.jobId}-${application.job.employerId}`,
      );
    }

    updateTag(`job-details-${jobSeekerId}`);
    updateTag(`job-seeker-profile-${jobSeekerId}`);

    // Success
    return {
      success: true,
      status: 200,
      message: "Resume uploaded successfully",
      data: {
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        fileName: cleanFileName,
        fileSize: buffer.length,
      },
    };
  } catch (error: any) {
    console.error("Upload error:", error);

    if (error.message?.includes("Cloudinary")) {
      return {
        success: false,
        status: 503,
        message: "File storage service error",
        data: null,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Failed to upload resume",
      data: null,
    };
  }
}
