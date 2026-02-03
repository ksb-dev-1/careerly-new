"use server";

// ----------------------------------------
// Imports
// ----------------------------------------
import { updateTag } from "next/cache";

// auth
import { auth } from "@/auth";

// lib
import { prisma } from "@/lib/prisma";
import {
  jobSeekerProfileFormSchema,
  JobSeekerProfileFormData,
} from "@/lib/validation/job-seeker-profile-validation-schema";
import cloudinary from "@/lib/cloudinary";

// ----------------------------------------
// Types
// ----------------------------------------
export type UpdateJobSeekerProfileActionSuccess = {
  success: true;
  status: 200;
  message: string;
};

export type UpdateJobSeekerProfileActionError = {
  success: false;
  status: 401 | 400 | 404 | 500;
  message: string;
};

export type UpdateJobSeekerProfileActionResponse =
  | UpdateJobSeekerProfileActionSuccess
  | UpdateJobSeekerProfileActionError;

// ----------------------------------------
// Update Job Seeker Profile Server Action
// ----------------------------------------
export async function updateJobSeekerProfile(
  formData: JobSeekerProfileFormData,
  imageFile?: File,
): Promise<UpdateJobSeekerProfileActionResponse> {
  const session = await auth();
  const jobSeekerId = session?.user.id;

  if (!jobSeekerId) {
    return {
      success: false,
      status: 401,
      message: "You must be signed in.",
    };
  }

  const parsed = jobSeekerProfileFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: jobSeekerId },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  if (!user) {
    return {
      success: false,
      status: 404,
      message: "User not found.",
    };
  }

  try {
    const updateUserData: Record<string, any> = {};
    let imageUrl: string | undefined;

    if (imageFile instanceof File) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "careerly/job-seeker/profile-images",
              public_id: jobSeekerId,
              overwrite: true,
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            },
          )
          .end(buffer);
      });

      updateUserData.image = uploadResult.secure_url;
      imageUrl = uploadResult.secure_url;
    }

    if (!user.name && formData.name) {
      updateUserData.name = formData.name;
    }

    if (Object.keys(updateUserData).length > 0) {
      await prisma.user.update({
        where: { id: jobSeekerId },
        data: updateUserData,
      });
    }

    // Prepare experience data - handle undefined/null
    let experienceValue: number | null = null;
    if (formData.experience !== undefined && formData.experience !== null) {
      experienceValue = Number(formData.experience);
    }

    // Since Prisma requires non-nullable strings, we need to ensure:
    // 1. Projects have both name and link as non-empty strings
    // 2. Socials have both platform and url as non-empty strings
    // Solution: Only create records where ALL required fields are present

    // Prepare projects - only create if BOTH name and link are provided
    const projectsToCreate =
      formData.projects
        ?.filter((p) => p.name?.trim() && p.link?.trim()) // Both must be non-empty
        .map((p) => ({
          name: p.name!.trim(), // Non-null assertion since we filtered
          link: p.link!.trim(),
        })) || [];

    // Prepare socials - only create if BOTH platform and url are provided
    const socialsToCreate =
      formData.socials
        ?.filter((s) => s.platform?.trim() && s.url?.trim()) // Both must be non-empty
        .map((s) => ({
          platform: s.platform!.trim(), // Non-null assertion since we filtered
          url: s.url!.trim(),
        })) || [];

    await prisma.jobSeekerProfile.upsert({
      where: { userId: jobSeekerId },
      create: {
        userId: jobSeekerId,
        experience: experienceValue,
        skills: formData.skills ?? [],
        location: formData.location ?? null,
        about: formData.about ?? null,
        projects: {
          create: projectsToCreate,
        },
        socials: {
          create: socialsToCreate,
        },
      },
      update: {
        experience: experienceValue,
        skills: formData.skills ?? [],
        location: formData.location ?? null,
        about: formData.about ?? null,
        projects: {
          deleteMany: {}, // remove old projects
          create: projectsToCreate,
        },
        socials: {
          deleteMany: {}, // remove old socials
          create: socialsToCreate,
        },
      },
    });

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

    updateTag(`job-seeker-profile-${jobSeekerId}`);

    return {
      success: true,
      status: 200,
      message: "Profile updated successfully.",
    };
  } catch (error) {
    console.error("❌ Profile update error:", error);

    return {
      success: false,
      status: 500,
      message: "Failed to update profile.",
    };
  }
}
