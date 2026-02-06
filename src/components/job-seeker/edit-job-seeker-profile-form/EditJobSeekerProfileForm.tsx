"use client";

// ----------------------------------------
// Imports
// ----------------------------------------

// lib
import {
  JobSeekerProfileFormData,
  jobSeekerProfileFormSchema,
} from "@/lib/validation/job-seeker-profile-validation-schema";

// components
import { SkillsInput } from "@/components/job-seeker/edit-job-seeker-profile-form/SkillsInput";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 3rd party
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import ProfileImageEdit from "./ProfileImageEdit";
import { useRef } from "react";

export function EditJobSeekerProfileForm({
  details,
}: {
  details: JobSeekerProfileFormData;
}) {
  // Transform the details to match form structure and store in ref
  const originalDetails = useRef<JobSeekerProfileFormData>({
    name: details.name ?? "",
    experience: details.experience?.toString() ?? "",
    skills: details.skills ?? [],
    projects: details.projects ?? [],
    socials: details.socials ?? [],
    location: details.location ?? "",
    about: details.about ?? "",
    profileImageFile: undefined,
    profileImageUrl: details.profileImageUrl ?? "",
  });

  const methods = useForm<JobSeekerProfileFormData>({
    resolver: zodResolver(jobSeekerProfileFormSchema),
    defaultValues: originalDetails.current,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
  } = methods;

  // Handle form reset
  function handleFormReset() {
    reset(originalDetails.current, {
      keepDefaultValues: true,
    });
  }

  const onSubmit: SubmitHandler<JobSeekerProfileFormData> = (data) => {
    const payload = {
      ...data,
      experience: data.experience === "" ? undefined : Number(data.experience),
    };
    console.log(payload);
  };

  return (
    <div className="min-h-screen max-w-custom w-full py-16 mx-auto px-4">
      <div className="max-w-xl w-full mx-auto">
        <Card className="max-w-xl w-full">
          <CardHeader>
            <CardTitle className="font-bold text-lg">
              Edit Profile Details
            </CardTitle>
            <CardDescription>
              Complete or update your job seeker profile.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FormProvider {...methods}>
              <form
                id="job-seeker-profile-form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <FieldGroup>
                  {/* Profile image */}
                  <ProfileImageEdit />

                  {/* Name */}
                  <Field>
                    <FieldLabel htmlFor="name" className="font-bold">
                      Name
                    </FieldLabel>

                    <Input
                      id="name"
                      placeholder="Enter your name"
                      autoComplete="off"
                      aria-invalid={!!errors.name}
                      {...register("name")}
                    />

                    {errors.name && <FieldError errors={[errors.name]} />}
                  </Field>

                  {/* Experience */}
                  <Field>
                    <FieldLabel htmlFor="experience" className="font-bold">
                      Experience
                    </FieldLabel>

                    <Input
                      id="experience"
                      placeholder="Enter your experience"
                      autoComplete="off"
                      aria-invalid={!!errors.experience}
                      {...register("experience")}
                    />

                    {errors.experience && (
                      <FieldError errors={[errors.experience]} />
                    )}
                  </Field>

                  {/* Skills */}
                  <SkillsInput />
                </FieldGroup>
              </form>
            </FormProvider>
          </CardContent>

          <CardFooter className="grid grid-cols-2 gap-2 sm:gap-4 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleFormReset}
              disabled={!isDirty}
            >
              Reset
            </Button>

            <Button
              type="submit"
              form="job-seeker-profile-form"
              disabled={!isDirty}
              className="bg-brand hover:bg-brand-hover"
            >
              Update
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
