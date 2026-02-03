// ----------------------------------------
// Imports
// ----------------------------------------
import { cacheLife, cacheTag } from "next/cache";

// generated
import { Resume } from "@/generated/prisma/client";

// lib
import { JobSeekerProfileFormData } from "@/lib/validation/job-seeker-profile-validation-schema";
import { Project, SocialLink } from "@/lib/validation";
import { prisma } from "@/lib/prisma";

// ----------------------------------------
// Types
// ----------------------------------------
export type JobSeekerProfileCompleteData = {
  formData: JobSeekerProfileFormData;
  email: string;
  resume?: Resume;
  hasProfile: boolean;
};

export type FetchJobseekerProfileDetailsSuccess = {
  success: true;
  status: 200;
  data: JobSeekerProfileCompleteData;
};

export type FetchJobseekerProfileDetailsError = {
  success: false;
  status: 404 | 500;
  message: string;
};

export type FetchJobseekerProfileDetailsResponse =
  | FetchJobseekerProfileDetailsSuccess
  | FetchJobseekerProfileDetailsError;

// ----------------------------------------
// Fetch job seeker profile details
// ----------------------------------------
export async function fetchJobSeekerProfileDetails(
  jobSeekerId?: string,
): Promise<FetchJobseekerProfileDetailsResponse> {
  "use cache";
  cacheLife("max");
  cacheTag(`job-seeker-profile-${jobSeekerId}`);
  console.log("🔵 DB HIT: fetching jobseeker details");

  try {
    const user = await prisma.user.findUnique({
      where: { id: jobSeekerId },
      include: {
        jobSeekerProfile: {
          include: {
            projects: true,
            socials: true,
          },
        },
        resume: true,
      },
    });

    if (!user) {
      return { success: false, status: 404, message: "User not found." };
    }

    const profile = user.jobSeekerProfile;
    const hasProfile = !!profile;

    const projects: Project[] = profile?.projects?.length
      ? profile.projects.map((p) => ({
          name: p.name ?? undefined,
          link: p.link ?? undefined,
        }))
      : [];

    const socials: SocialLink[] = profile?.socials?.length
      ? profile.socials.map((s) => ({
          platform: s.platform as SocialLink["platform"],
          url: s.url ?? undefined,
        }))
      : [];

    // Prepare data in the exact shape your Zod form expects
    const data: JobSeekerProfileCompleteData = {
      formData: {
        // Form fields only
        // name: user.name ?? undefined,
        // profileImageUrl: user.image ?? undefined,
        // profileImageFile: undefined,
        // experience: String(profile?.experience) ?? undefined,
        // skills: profile?.skills?.length ? profile.skills : undefined,
        // projects,
        // socials,
        // location: profile?.location ?? undefined,
        // about: profile?.about ?? undefined,
        name: user.name ?? "",
        profileImageUrl: user.image ?? "",
        profileImageFile: undefined,
        experience:
          profile?.experience === undefined ? "" : String(profile.experience),
        skills: profile?.skills?.length ? profile.skills : [],
        projects,
        socials,
        location: profile?.location ?? "",
        about: profile?.about ?? "",
      },
      email: user.email,
      resume: user.resume ?? undefined,
      hasProfile,
    };

    return {
      success: true,
      status: 200,
      data,
    };
  } catch (error) {
    console.error("Failed to fetch jobseeker details:", error);
    return {
      success: false,
      status: 500,
      message: "Failed to fetch jobseeker details. Please try again.",
    };
  }
}
