"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// actions
import { UpdateJobSeekerProfile } from "@/actions/job-seeker/update-job-seeker-profile";

// lib
import { JobSeekerProfileData } from "@/lib/job-seeker/fetch-job-seeker-profile-details";
import {
  jobSeekerProfileSchema,
  JobSeekerProfileFormData,
} from "@/lib/validation";

// components
import { LocationInput } from "@/components/LocationInput";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Spinner } from "@/components/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// 3rd party
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Trash2, X, Image as ImageIcon, SquarePen } from "lucide-react";

// ----------------------------------------
// Helper Functions
// ----------------------------------------
function arraysEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every(
    (value, index) => JSON.stringify(value) === JSON.stringify(sorted2[index]),
  );
}

function stripHtmlTags(html: string): string {
  return html.replace(/(<([^>]+)>)/gi, "").trim();
}

//  Ensures projects is always an array
const normalizeProjects = (
  value: unknown,
): JobSeekerProfileFormData["projects"] => {
  return Array.isArray(value) ? value : [];
};

//  Ensures social links is always an array
const normalizeSocialLinks = (
  value: unknown,
): JobSeekerProfileFormData["socials"] => {
  return Array.isArray(value) ? value : [];
};

// Social platform types
type SocialPlatform =
  | "github"
  | "linkedin"
  | "twitter"
  | "portfolio"
  | "leetcode"
  | "hackerrank";

// Extended type for server response (if you can't modify the original)
type ExtendedActionSuccess = {
  success: true;
  status: 200;
  message: string;
  imageUrl?: string;
  name?: string;
  skills?: string[];
  projects?: JobSeekerProfileFormData["projects"];
  socials?: JobSeekerProfileFormData["socials"];
  location?: string;
  about?: string;
};

type ExtendedResponse =
  | ExtendedActionSuccess
  | {
      success: false;
      status: 401 | 400 | 404 | 500;
      message: string;
    };

// ----------------------------------------
// Main Component
// ----------------------------------------
export function EditJobSeekerProfileForm({
  jobSeekerId,
  details,
}: {
  jobSeekerId?: string;
  details: JobSeekerProfileData;
}) {
  const [suggestions, setSuggestions] = useState<{ label: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session, update } = useSession();
  const router = useRouter();

  /**
   * Store the original data from props to compare against later
   * This helps us detect if the user has made any changes
   */
  const originalData = {
    name: details.name ?? "",
    experience: details.experience ?? "",
    skills: details.skills ?? [],
    projects: normalizeProjects(details.projects),
    socials: normalizeSocialLinks(details.socials),
    location: details.location ?? "",
    about: details.about ?? "",
    profileImage: undefined as FileList | undefined,
  };

  // Initialize the form with validation schema and default values
  const form = useForm<JobSeekerProfileFormData>({
    resolver: zodResolver(jobSeekerProfileSchema),
    defaultValues: {
      ...originalData,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Destructure commonly used form methods for easier access
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    control,
    watch,
  } = form;

  // ==================== DYNAMIC FIELD ARRAYS ====================
  const {
    fields: projectFields,
    append: addProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  });

  const {
    fields: socialFields,
    append: addSocial,
    remove: removeSocial,
  } = useFieldArray({
    control,
    name: "socials",
  });

  // Watch form values for changes
  const watchedValues = watch();

  // Detect if user has made any changes to the form
  const hasChanges = (() => {
    // Check image changes
    if (selectedImage) return true;

    // Check simple fields
    if (watchedValues.name !== originalData.name) return true;
    if (watchedValues.location !== originalData.location) return true;
    if (watchedValues.experience !== originalData.experience) return true;

    // Check arrays
    if (!arraysEqual(watchedValues.skills || [], originalData.skills || []))
      return true;
    if (!arraysEqual(watchedValues.projects || [], originalData.projects || []))
      return true;
    if (!arraysEqual(watchedValues.socials || [], originalData.socials || []))
      return true;

    // Check about (strip HTML tags)
    const currentAbout = stripHtmlTags(watchedValues.about || "");
    const originalAbout = stripHtmlTags(originalData.about || "");
    if (currentAbout !== originalAbout) return true;

    return false;
  })();

  // Get current skills for UI display
  const currentSkills = watchedValues.skills || [];

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      setValue("profileImage", dataTransfer.files, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setValue("profileImage", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle reset all state
  const resetAllState = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setSuggestions([]);
    reset(originalData);
    setResetKey((prev) => prev + 1);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // On mount reset to defaults
  useEffect(() => {
    resetAllState();
  }, [details]);

  // Tanstack mutation for update job seeker profile
  const { mutate, isPending } = useMutation({
    mutationFn: async (
      data: JobSeekerProfileFormData,
    ): Promise<ExtendedResponse> => {
      const imageFile = data.profileImage?.[0];
      const response = await UpdateJobSeekerProfile(data, imageFile);

      // Type assertion to ExtendedResponse
      return response as ExtendedResponse;
    },
    onSuccess: async (response: ExtendedResponse) => {
      if (response.success) {
        // Update session with new profile image
        if (session && response.imageUrl) {
          await update({
            ...session,
            user: {
              ...session.user,
              image: response.imageUrl,
            },
          });
        }

        toast.success(response.message);

        // Use response fields if available, otherwise keep current form values
        const updatedOriginalData = {
          name: response.name || watchedValues.name,
          skills: response.skills || watchedValues.skills || [],
          projects: response.projects || watchedValues.projects || [],
          socials: response.socials || watchedValues.socials || [],
          location: response.location || watchedValues.location,
          about: response.about || watchedValues.about,
          profileImage: undefined as FileList | undefined,
        };

        // Reset form to updated values
        reset(updatedOriginalData);
        setSelectedImage(null);
        setImagePreview(response.imageUrl || null);
        setSuggestions([]);

        router.push("/job-seeker/profile");
      } else {
        toast.error(response.message);
      }
    },
    onError: (error: Error) => {
      console.error("Profile update failed:", error);
      toast.error("Something went wrong. Please try again.");
    },
  });

  // Handle form submit
  const onSubmit: SubmitHandler<JobSeekerProfileFormData> = (data) => {
    mutate(data);
  };

  // Handle form reset
  const handleFormReset = () => {
    resetAllState();
    toast.success("Form reset to original values");
  };

  // Handle skill change
  const handleSkillsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const skill = input.value.trim();

    if (e.key === "Enter" && skill) {
      e.preventDefault();

      if (currentSkills.length >= 20) {
        toast.error("Maximum 20 skills allowed");
        return;
      }

      if (currentSkills.includes(skill)) {
        toast.error("Skill already added");
        return;
      }

      setValue("skills", [...currentSkills, skill], {
        shouldValidate: true,
        shouldDirty: true,
      });

      input.value = "";
    }
  };

  // Handle remove skill
  const removeSkill = (index: number) => {
    setValue(
      "skills",
      currentSkills.filter((_, i) => i !== index),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  return (
    <div className="min-h-screen max-w-custom w-full pt-32 pb-16 mx-auto px-4">
      <div className="max-w-xl w-full mx-auto">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="font-bold">Edit Job Seeker Profile</CardTitle>
            <CardDescription>
              Complete or update your job seeker profile.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              id="job-seeker-profile-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FieldGroup>
                {/* Profile Image */}
                <Field>
                  <div className="space-y-4">
                    {/* Image preview with edit icon */}
                    <div className="relative inline-block">
                      {imagePreview || details.profileImage ? (
                        <div className="relative h-24 w-24">
                          <Image
                            src={imagePreview || details.profileImage || ""}
                            alt="Profile preview"
                            className="rounded-full object-cover border-2"
                            fill
                            sizes="96px"
                            priority
                          />

                          {/* Small edit icon button */}
                          <label
                            htmlFor="profileImage"
                            className="absolute top-0 right-0 cursor-pointer bg-brand text-white dark:text-background p-1.5 rounded-full shadow-md hover:bg-brand-hover transition-colors border-4 border-background"
                            title="Change image"
                          >
                            <SquarePen size={14} />
                          </label>

                          {/* Remove button for new images */}
                          {imagePreview && (
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute border-4 border-background bottom-0 right-0 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                              aria-label="Remove image"
                              title="Remove image"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ) : (
                        /* Empty state */
                        <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                          <label
                            htmlFor="profileImage"
                            className="cursor-pointer flex flex-col items-center gap-2 p-4"
                          >
                            <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                              <ImageIcon className="text-brand" size={20} />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Add photo
                            </span>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Hidden file input */}
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />

                    {/* File info */}
                    {selectedImage && (
                      <div className="text-sm text-muted-foreground">
                        Selected: {selectedImage.name} (
                        {(selectedImage.size / 1024).toFixed(1)} KB)
                      </div>
                    )}

                    {/* Instructions */}
                    <p className="text-sm text-muted-foreground">
                      Maximum file size: 5MB. Supported formats: JPEG, PNG,
                      WebP.
                    </p>
                  </div>

                  {errors.profileImage && (
                    <FieldError>
                      {errors.profileImage.message?.toString()}
                    </FieldError>
                  )}
                </Field>

                {/* Name */}
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input placeholder="John Doe" {...register("name")} />
                  {errors.name && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </Field>

                {/* Experience */}
                <Field>
                  <FieldLabel htmlFor="experience">
                    Experience (years)
                  </FieldLabel>
                  <Input
                    id="experience"
                    autoComplete="off"
                    placeholder="2"
                    {...register("experience")}
                  />
                  {errors.experience && (
                    <FieldError>{errors.experience.message}</FieldError>
                  )}
                </Field>

                {/* Skills */}
                <Field>
                  <FieldLabel htmlFor="skills">
                    Skills (Press Enter to add)
                  </FieldLabel>
                  <Input
                    id="skills"
                    autoComplete="off"
                    placeholder="TypeScript"
                    onKeyDown={handleSkillsChange}
                  />
                  {errors.skills && (
                    <FieldError>{errors.skills.message}</FieldError>
                  )}
                  {currentSkills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {currentSkills.map((skill, index) => (
                        <Badge key={`${skill}-${index}`} variant="secondary">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="ml-2 text-destructive hover:text-destructive/80 font-bold"
                            aria-label={`Remove ${skill}`}
                          >
                            <X size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {currentSkills.length}/20 skills added
                  </p>
                </Field>

                {/* Projects */}
                <Field>
                  <FieldLabel>Projects</FieldLabel>

                  {projectFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Project name"
                        {...register(`projects.${index}.name`)}
                      />
                      <Input
                        placeholder="Project link"
                        {...register(`projects.${index}.link`)}
                      />
                      <Button
                        type="button"
                        size="icon"
                        onClick={() => removeProject(index)}
                        className="bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-950 dark:text-red-500 dark:hover:bg-red-900"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => addProject({ name: "", link: "" })}
                  >
                    Add Project
                  </Button>
                </Field>

                {/* Social Links */}
                <Field>
                  <FieldLabel>Social Profiles</FieldLabel>

                  {socialFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-2 mb-2 items-center"
                    >
                      {/* Platform dropdown */}
                      <Controller
                        control={control}
                        name={`socials.${index}.platform`}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              setValue(
                                `socials.${index}.platform`,
                                value as SocialPlatform,
                                {
                                  shouldDirty: true,
                                },
                              );
                            }}
                          >
                            <SelectTrigger className="w-37.5">
                              <SelectValue placeholder="Platform" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="github">GitHub</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="twitter">Twitter</SelectItem>
                              <SelectItem value="portfolio">
                                Portfolio
                              </SelectItem>
                              <SelectItem value="leetcode">LeetCode</SelectItem>
                              <SelectItem value="hackerrank">
                                HackerRank
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {/* URL input */}
                      <Input
                        placeholder="Profile URL"
                        {...register(`socials.${index}.url`)}
                      />

                      {/* Remove */}
                      <Button
                        type="button"
                        onClick={() => removeSocial(index)}
                        size="icon"
                        className="bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-950 dark:text-red-500 dark:hover:bg-red-900"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => addSocial({ platform: "github", url: "" })}
                  >
                    Add Social Link
                  </Button>
                </Field>

                {/* Location */}
                <LocationInput
                  key={`location-${resetKey}`}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  suggestions={suggestions}
                  setSuggestions={setSuggestions}
                  name="location"
                />

                {/* About */}
                <RichTextEditor
                  key={`description-${resetKey}`}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  name="about"
                  label="About"
                  initialContent={details.about ?? ""}
                />
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter className="grid grid-cols-2 gap-2 sm:gap-4 border-t pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={handleFormReset}
              disabled={isPending || !hasChanges}
              className="rounded-full"
            >
              Reset
            </Button>

            <Button
              type="submit"
              form="job-seeker-profile-form"
              disabled={isPending || !hasChanges}
              className="bg-brand hover:bg-brand-hover rounded-full"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner color="text-white dark:text-background" />
                  Updating
                </span>
              ) : (
                "Update"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
