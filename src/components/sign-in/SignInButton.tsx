"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { useFormStatus } from "react-dom";

// components
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";

// 3rd party
import { cn } from "@/lib/utils";

// ----------------------------------------
// Sign in button
// ----------------------------------------
interface SignInButtonProps {
  icon?: React.ReactNode;
  text: string;
  className?: string;
}

export function SignInButton({ icon, text, className }: SignInButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      variant={icon ? "outline" : "default"}
      className={cn("relative w-full", className)}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span>{text}</span>
      {pending && (
        <Spinner
          aria-hidden="true"
          className="absolute right-2 h-4 w-4"
          color={`${icon ? "" : "text-white dark:text-background"}`}
        />
      )}
    </Button>
  );
}
