"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
// 3rd aprty
import { Toggle } from "@/components/ui/toggle";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Undo,
  Redo,
} from "lucide-react";

// ----------------------------------------
// Helper component
// ----------------------------------------
function ToolbarButton({
  command,
  isActive,
  icon: Icon,
  label,
}: {
  command: () => void;
  isActive: boolean;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Toggle
      onClick={command}
      className={`border rounded-md ${isActive ? "is-active" : ""}`}
      aria-label={label}
    >
      <Icon />
    </Toggle>
  );
}

// ----------------------------------------
// Main component
// ----------------------------------------
export function MenuBar({ editor }: { editor: Editor }) {
  if (!editor) return null;

  return (
    <div className="control-group">
      <div className="button-group border p-2 rounded-lg mb-1 flex items-center flex-wrap gap-2">
        <ToolbarButton
          command={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={Bold}
          label="bold"
        />

        <ToolbarButton
          command={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={Italic}
          label="italic"
        />

        <ToolbarButton
          command={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          icon={Heading1}
          label="heading-1"
        />

        <ToolbarButton
          command={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          icon={Heading2}
          label="heading-2"
        />

        <ToolbarButton
          command={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          icon={Heading3}
          label="heading-3"
        />

        <ToolbarButton
          command={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          isActive={editor.isActive("heading", { level: 4 })}
          icon={Heading4}
          label="heading-4"
        />

        <ToolbarButton
          command={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive("paragraph")}
          icon={Pilcrow}
          label="paragraph"
        />

        <ToolbarButton
          command={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={List}
          label="bullet-list"
        />

        <ToolbarButton
          command={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={ListOrdered}
          label="ordered-list"
        />

        <ToolbarButton
          command={() => editor.chain().focus().undo().run()}
          isActive={false}
          icon={Undo}
          label="undo"
        />

        <ToolbarButton
          command={() => editor.chain().focus().redo().run()}
          isActive={false}
          icon={Redo}
          label="redo"
        />
      </div>
    </div>
  );
}
