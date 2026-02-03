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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 3rd party
import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { Trash2 } from "lucide-react";

type SocialPlatform =
  | "github"
  | "linkedin"
  | "twitter"
  | "portfolio"
  | "leetcode"
  | "hackerrank";

interface SocialLinksFieldArrayProps {
  control: Control<JobSeekerProfileFormData>;
  register: UseFormRegister<JobSeekerProfileFormData>;
  setValue: UseFormSetValue<JobSeekerProfileFormData>;
}

export function SocialLinksFieldArray({
  control,
  register,
  setValue,
}: SocialLinksFieldArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "socials",
  });

  return (
    <div className="space-y-2">
      <FieldLabel>Social Profiles</FieldLabel>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 mb-2 items-center">
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
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="leetcode">LeetCode</SelectItem>
                  <SelectItem value="hackerrank">HackerRank</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <Input
            placeholder="Profile URL"
            {...register(`socials.${index}.url`)}
          />

          <Button
            type="button"
            onClick={() => remove(index)}
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
        onClick={() => append({ platform: "github", url: "" })}
        className="w-full"
      >
        Add Social Link
      </Button>
    </div>
  );
}
