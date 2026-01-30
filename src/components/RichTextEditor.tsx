"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
// components
import { MenuBar } from "@/components/MenuBar";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

// 3rd party
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
  Path,
} from "react-hook-form";

// ----------------------------------------
// Interfaces and types
// ----------------------------------------
interface RichTextEditorProps<T extends Record<string, any>> {
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  label?: string;
  initialContent?: string;
}

// ----------------------------------------
// Main component
// ----------------------------------------
export function RichTextEditor<T extends Record<string, any>>({
  register,
  setValue,
  errors,
  name,
  label = "Description",
  initialContent = "",
}: RichTextEditorProps<T>) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate({ editor }) {
      const value = editor.isEmpty ? "" : editor.getHTML();
      setValue(name, value as any, {
        shouldValidate: false,
        shouldDirty: true,
      });
    },

    // REMOVE onBlur validation - let the form handle it
    editorProps: {
      attributes: {
        class:
          "border rounded-lg p-4 min-h-[250px] h-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition dark:bg-input/30 prose prose-sm max-w-none",
      },
    },
    immediatelyRender: false,
  });

  return (
    <Field className="mt-8 md:mt-0">
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      {editor && <MenuBar editor={editor} />}

      <EditorContent editor={editor} />

      {/* Hidden input to register RHF */}
      <input type="hidden" {...register(name)} />

      {errors[name] && (
        <FieldError>{(errors[name] as any)?.message}</FieldError>
      )}
    </Field>
  );
}
