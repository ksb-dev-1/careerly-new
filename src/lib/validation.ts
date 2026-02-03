// generated
import { JobType, JobMode, Currency } from "@/generated/prisma/browser";

// 3rd party
import z from "zod";

function stripHtmlTags(html: string): string {
  return html.replace(/(<([^>]+)>)/gi, "").trim();
}

export const jobFormSchema = z.object({
  companyName: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters long" })
    .max(100, { message: "Company name must be less than 100 characters" }),

  role: z
    .string()
    .min(2, { message: "Role must be at least 2 characters long" })
    .max(100, { message: "Role must be less than 100 characters" }),

  jobType: z.enum([JobType.FULL_TIME, JobType.PART_TIME, JobType.INTERNSHIP], {
    message: "Job type is required",
  }),

  jobMode: z.enum([JobMode.ONSITE, JobMode.REMOTE, JobMode.HYBRID], {
    message: "Job mode is required",
  }),

  experience: z
    .string()
    .regex(/^[0-9]+-[0-9]+$/, {
      message: "Experience must be in format '1-3' (numbers only)",
    })
    .refine(
      (val) => {
        const [min, max] = val.split("-").map(Number);
        return min < max;
      },
      { message: "Minimum experience must be less than maximum" },
    )
    .refine(
      (val) => {
        const [min, max] = val.split("-").map(Number);
        return min >= 0 && max <= 50;
      },
      { message: "Experience range must be between 0-50 years" },
    ),

  salary: z
    .string()
    .min(1, { message: "Salary is required" })
    .regex(/^[0-9]+$/, { message: "Salary must be a valid number" })
    .refine((val) => Number(val) >= 1000, {
      message: "Salary must be at least 1,000",
    })
    .refine((val) => Number(val) <= 10_000_000, {
      message: "Salary must be less than 10,000,000",
    }),

  currency: z.enum([Currency.INR, Currency.USD, Currency.EUR], {
    message: "Currency is required",
  }),

  openings: z
    .string()
    .min(1, { message: "Openings is required" })
    .regex(/^[0-9]+$/, { message: "Openings must be a valid number" })
    .refine((val) => Number(val) >= 1, {
      message: "At least 1 opening is required",
    })
    .refine((val) => Number(val) <= 100, {
      message: "Maximum 100 openings allowed",
    }),

  skills: z
    .array(z.string().min(1, { message: "Skill cannot be empty" }))
    .min(1, { message: "At least one skill is required" })
    .max(20, { message: "Maximum 20 skills allowed" }),

  location: z
    .string()
    .min(3, { message: "Location must be at least 3 characters" })
    .max(100, { message: "Location must be less than 100 characters" }),

  description: z
    .string()
    .min(1, "Description is required")
    .refine(
      (value) => {
        const plainText = stripHtmlTags(value);
        return plainText.length >= 10;
      },
      {
        message: "Description must be at least 10 characters long",
      },
    ),
});

export type JobFormData = z.infer<typeof jobFormSchema>;

// ----------------------------------------------------------------
const optionalImageSchema = z
  .any()
  .optional()
  .refine(
    (files) =>
      !files ||
      (typeof files === "object" && "length" in files && files.length <= 1),
    "Only one file allowed",
  )
  .refine(
    (files) => !files || !files[0] || files[0].size <= 5 * 1024 * 1024,
    "Max 5MB",
  )
  .refine(
    (files) =>
      !files ||
      !files[0] ||
      ["image/jpeg", "image/png", "image/webp"].includes(files[0].type),
    "Only JPG, PNG, WEBP allowed",
  );

export const employerProfileSchema = z.object({
  name: z.string().optional(),
  profileImage: optionalImageSchema.optional(),
  companyName: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
});

export type EmployerProfileFormData = z.infer<typeof employerProfileSchema>;

// ----------------------------------------------------------------
// const urlSchema = z.string().refine(
//   (val) => {
//     try {
//       new URL(val);
//       return true;
//     } catch {
//       return false;
//     }
//   },
//   { message: "Invalid URL" },
// );

// export const projectSchema = z.object({
//   name: z.string().min(1, "Project name is required"),
//   link: urlSchema,
// });

// export const socialLinkSchema = z.object({
//   platform: z.enum([
//     "github",
//     "linkedin",
//     "twitter",
//     "portfolio",
//     "leetcode",
//     "hackerrank",
//   ]),
//   url: urlSchema,
// });

// export const jobSeekerProfileSchema = z.object({
//   name: z.string().optional(),
//   profileImage: optionalImageSchema.optional(),
//   experience: z
//     .string()
//     .trim()
//     .optional()
//     .refine(
//       (val) => {
//         if (!val) return true; // allow empty / undefined
//         return /^[0-9]+$/.test(val);
//       },
//       { message: "Experience must be a number" },
//     )
//     .refine(
//       (val) => {
//         if (!val) return true;
//         const years = Number(val);
//         return years >= 0 && years <= 50;
//       },
//       { message: "Experience must be between 0 and 50 years" },
//     ),
//   skills: z.array(z.string().min(1)).optional(),
//   projects: z.array(projectSchema).optional(),
//   socials: z.array(socialLinkSchema).optional(),
//   location: z.string().optional(),
//   about: z.string().optional(),
// });

// export type Project = z.infer<typeof projectSchema>;
// export type SocialLink = z.infer<typeof socialLinkSchema>;
// export type JobSeekerProfileFormData = z.infer<typeof jobSeekerProfileSchema>;

// Stricter URL schema
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

// Experience schema (optional, numeric, 0-50, transforms to number)
export const experienceSchema = z
  .string()
  .trim()
  .optional()
  .refine((val) => !val || /^[0-9]+$/.test(val), {
    message: "Experience must be a number",
  })
  .refine((val) => !val || (+val >= 0 && +val <= 50), {
    message: "Experience must be between 0 and 50 years",
  })
  .transform((val) => (val ? Number(val) : undefined));

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
export const jobSeekerProfileSchema = z.object({
  name: z.string().optional(),
  profileImage: optionalImageSchema.optional(),
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
export type JobSeekerProfileFormData = z.infer<typeof jobSeekerProfileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
