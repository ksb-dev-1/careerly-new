"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { Dispatch, SetStateAction } from "react";

//actions
import { applyForJob } from "@/actions/job-seeker/apply-for-job";

// components
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";

// 3rd party
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// ----------------------------------------
// Interfaces and types
// ----------------------------------------
interface ApplyForJobButtonProps {
  jobId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

// ----------------------------------------
// Main component
// ----------------------------------------
export function ApplyForJobButton({ jobId, setOpen }: ApplyForJobButtonProps) {
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      return await applyForJob(jobId);
    },

    onSuccess: (response) => {
      if (response.success) {
        toast.success("Application submitted successfully");
        setTimeout(() => setOpen(false), 300);
      } else {
        toast.error(response.message);
      }
    },

    onError: (error: Error) => {
      toast.error(error.message || "Application failed");
    },
  });

  const handleJobApply = () => {
    mutate();
  };

  return (
    <Button
      disabled={isPending}
      aria-label={isPending ? "applying" : "apply with current resume"}
      className="w-full mt-4 bg-brand hover:bg-brand-hover"
      onClick={handleJobApply}
    >
      {isPending ? (
        <span className="flex items-center gap-1">
          <Spinner color="text-white dark:text-background" /> Applying
        </span>
      ) : (
        "Apply with Current Resume"
      )}
    </Button>
  );
}
