// 3rd party
import z from "zod";

// Profile image schema
export const optionalImageSchema = z
  .array(z.instanceof(File))
  .max(1, "Only one file allowed")
  .refine((files) => !files[0] || files[0].size <= 5 * 1024 * 1024, "Max 5MB")
  .refine(
    (files) =>
      !files[0] ||
      ["image/jpeg", "image/png", "image/webp"].includes(files[0].type),
    "Only JPG, PNG, WEBP allowed",
  )
  .optional();

// Url schema
const urlSchema = z.string().refine(
  (val) => {
    try {
      const url = new URL(val);
      return url.protocol === "https:";
    } catch {
      return false;
    }
  },
  { message: "Invalid URL. Must start with http:// or https://" },
);

// Experience schema (optional, numeric, 0-50)
export const experienceSchema = z
  .string()
  .regex(/^\d*$/, "Must be a number")
  .refine((val) => val === "" || Number(val) <= 50, "Experience must be <= 50")
  .optional();

// Project schema
export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").optional(),
  link: urlSchema.optional(),
});

// Social link schema
export const socialLinkSchema = z.object({
  platform: z
    .enum([
      "github",
      "linkedin",
      "twitter",
      "portfolio",
      "leetcode",
      "hackerrank",
    ])
    .optional(),
  url: urlSchema.optional(),
});

// Job seeker profile schema
export const jobSeekerProfileFormSchema = z.object({
  name: z.string().optional(),
  profileImageUrl: z.url().optional(),
  profileImageFile: optionalImageSchema,
  experience: experienceSchema,
  skills: z.array(z.string().min(1)).optional(),
  projects: z.array(projectSchema).optional(),
  socials: z.array(socialLinkSchema).optional(),
  location: z.string().optional(),
  about: z.string().optional(),
});

// Types
export type Project = z.infer<typeof projectSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type JobSeekerProfileFormData = z.infer<
  typeof jobSeekerProfileFormSchema
>;
