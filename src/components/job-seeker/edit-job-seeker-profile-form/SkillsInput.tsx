"use client";

import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const MAX_SKILLS = 15;

export function SkillsInput() {
  const { control } = useFormContext();

  const { field, fieldState } = useController({
    name: "skills",
    control,
  });

  const [input, setInput] = useState("");

  const skills: string[] = field.value ?? [];

  function addSkill() {
    const value = input.trim();
    if (!value) return;

    const exists = skills.some((s) => s.toLowerCase() === value.toLowerCase());

    if (exists || skills.length >= MAX_SKILLS) return;

    field.onChange([...skills, value]);
    setInput("");
  }

  function removeSkill(skill: string) {
    field.onChange(skills.filter((s) => s !== skill));
  }

  function clearAll() {
    field.onChange([]);
  }

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel className="font-bold">Skills</FieldLabel>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a skill (eg: React)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
          disabled={skills.length >= MAX_SKILLS}
        />

        <Button
          type="button"
          onClick={addSkill}
          disabled={skills.length >= MAX_SKILLS || !input}
          className="bg-brand hover:bg-brand-hover"
        >
          Add
        </Button>
      </div>

      {skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => removeSkill(skill)}
              className="cursor-pointer bg-muted flex items-center gap-1 rounded-full text-xs border px-1.5 py-0.5 hover:bg-destructive/10 transition"
            >
              {skill}
              <X size={12} className="text-red-600 dark:text-red-400" />
            </button>
          ))}
        </div>
      )}

      <div className="mt-2 flex justify-between text-sm text-muted-foreground">
        <span>
          {skills.length} / {MAX_SKILLS}
        </span>

        {skills.length > 0 && (
          <Badge
            onClick={clearAll}
            className="cursor-pointer border bg-red-100 text-red-600 hover:bg-red-200 border-red-300 dark:bg-red-950/40 dark:text-red-500 dark:hover:bg-red-950 dark:border-red-800"
          >
            Clear all
          </Badge>
        )}
      </div>

      {fieldState.error && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
