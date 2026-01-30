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
  jobSeekerProfileSchema,
  JobSeekerProfileFormData,
} from "@/lib/validation";
import cloudinary from "@/lib/cloudinary";

// ----------------------------------------
// Types
// ----------------------------------------
export type UpdateJobSeekerProfileActionSuccess = {
  success: true;
  status: 200;
  message: string;
  imageUrl?: string;
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
export async function UpdateJobSeekerProfile(
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

  const parsed = jobSeekerProfileSchema.safeParse(formData);

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

    // await prisma.jobSeekerProfile.upsert({
    //   where: { userId: jobSeekerId },
    //   create: {
    //     userId: jobSeekerId,
    //     experience: formData.experience ?? null,
    //     skills: formData.skills ?? [],
    //     projects: formData.projects ?? [],
    //     socials: formData.socials ?? [],
    //     location: formData.location ?? null,
    //     about: formData.about ?? null,
    //   },
    //   update: {
    //     experience: formData.experience ?? null,
    //     skills: formData.skills ?? [],
    //     projects: formData.projects ?? [],
    //     socials: formData.socials ?? [],
    //     location: formData.location ?? null,
    //     about: formData.about ?? null,
    //   },
    // });

    await prisma.jobSeekerProfile.upsert({
      where: { userId: jobSeekerId },
      create: {
        userId: jobSeekerId,
        experience: formData.experience ?? null,
        skills: formData.skills ?? [],
        location: formData.location ?? null,
        about: formData.about ?? null,
        projects: {
          create:
            formData.projects?.map((p) => ({
              name: p.name,
              link: p.link,
            })) ?? [],
        },
        socials: {
          create:
            formData.socials?.map((s) => ({
              platform: s.platform,
              url: s.url,
            })) ?? [],
        },
      },
      update: {
        experience: formData.experience ?? null,
        skills: formData.skills ?? [],
        location: formData.location ?? null,
        about: formData.about ?? null,
        projects: {
          deleteMany: {}, // remove old projects
          create:
            formData.projects?.map((p) => ({
              name: p.name,
              link: p.link,
            })) ?? [],
        },
        socials: {
          deleteMany: {}, // remove old socials
          create:
            formData.socials?.map((s) => ({
              platform: s.platform,
              url: s.url,
            })) ?? [],
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
      imageUrl: updateUserData.image ?? user.image,
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
