"use client";

// ----------------------------------------
// Imports
// ----------------------------------------

// lib
import { JobSeekerProfileFormData } from "@/lib/validation";

// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";

// 3rd party
import { Control, UseFormRegister, useFieldArray } from "react-hook-form";
import { Trash2 } from "lucide-react";

interface ProjectsFieldArrayProps {
  control: Control<JobSeekerProfileFormData>;
  register: UseFormRegister<JobSeekerProfileFormData>;
}

export function ProjectsFieldArray({
  control,
  register,
}: ProjectsFieldArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  return (
    <div className="space-y-2">
      <FieldLabel>Projects</FieldLabel>

      {fields.map((field, index) => (
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
            onClick={() => remove(index)}
            className="bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-950 dark:text-red-500 dark:hover:bg-red-900"
          >
            <Trash2 />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        onClick={() => append({ name: "", link: "" })}
        className="w-full"
      >
        Add Project
      </Button>
    </div>
  );
}
