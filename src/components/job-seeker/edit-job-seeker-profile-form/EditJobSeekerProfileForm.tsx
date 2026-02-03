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
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

export function EditJobSeekerProfileForm({
  details,
}: {
  details: JobSeekerProfileFormData;
}) {
  const methods = useForm<JobSeekerProfileFormData>({
    resolver: zodResolver(jobSeekerProfileFormSchema),
    defaultValues: {
      name: details.name ?? "",
      experience: details.experience ?? "",
      skills: details.skills ?? [],
      projects: details.projects ?? [],
      socials: details.socials ?? [],
      location: details.location ?? "",
      about: details.about ?? "",
      profileImageFile: undefined,
      profileImageUrl: details.profileImageUrl ?? "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const {
    control,
    formState: { isDirty },
    handleSubmit,
    reset,
  } = methods;

  const onSubmit: SubmitHandler<JobSeekerProfileFormData> = (data) => {
    // convert experience here if needed
    const payload = {
      ...data,
      experience: data.experience === "" ? undefined : Number(data.experience),
    };

    console.log(payload);
  };

  function handleFormReset() {
    reset();
  }

  return (
    <div className="min-h-screen max-w-custom w-full pt-32 pb-16 mx-auto px-4">
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
                  {/* Name */}
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter your name"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* Experience */}
                  <Controller
                    name="experience"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Experience</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="Enter years of experience (eg: 2)"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* Skills */}
                  <SkillsInput />
                </FieldGroup>
              </form>
            </FormProvider>
          </CardContent>

          <CardFooter className="grid grid-cols-2 gap-2 sm:gap-4 border-t pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={handleFormReset}
              disabled={!isDirty}
              className="rounded-full"
            >
              Reset
            </Button>

            <Button
              type="submit"
              form="job-seeker-profile-form"
              disabled={!isDirty}
              className="bg-brand hover:bg-brand-hover rounded-full"
            >
              Update
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
