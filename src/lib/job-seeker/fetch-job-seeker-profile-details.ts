// ----------------------------------------
// Imports
// ----------------------------------------
import { cacheLife, cacheTag } from "next/cache";

// lib
import { prisma } from "@/lib/prisma";
import { Project, SocialLink } from "@/lib/validation";

// 3rd party
import { Resume } from "@/generated/prisma/client";

// ----------------------------------------
// Types
// ----------------------------------------
export type JobSeekerProfileData = {
  name?: string | null;
  email: string;
  profileImage?: string | null;

  experience: string;
  skills: string[];

  projects: Project[];
  socials: SocialLink[];

  location?: string | null;
  about?: string | null;

  resume: Resume | null;
  hasProfile: boolean;
};

export type FetchJobseekerProfileDetailsSuccess = {
  success: true;
  status: 200;
  data: JobSeekerProfileData;
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
// Data fetching function
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

    const hasProfile = !!user.jobSeekerProfile;

    // Map relational data to frontend types
    const projects: Project[] =
      user.jobSeekerProfile?.projects.map((p) => ({
        name: p.name,
        link: p.link,
      })) ?? [];

    const socials: SocialLink[] =
      user.jobSeekerProfile?.socials.map((s) => ({
        platform: s.platform as SocialLink["platform"],
        url: s.url,
      })) ?? [];

    const data: JobSeekerProfileData = {
      name: user.name,
      email: user.email,
      profileImage: user.image,
      experience: user.jobSeekerProfile?.experience ?? "",
      skills: user.jobSeekerProfile?.skills ?? [],
      projects,
      socials,
      location: user.jobSeekerProfile?.location ?? null,
      about: user.jobSeekerProfile?.about ?? null,
      resume: user.resume ?? null,
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
