"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { useState } from "react";
import { useRouter } from "next/navigation";

// generated
import { UserRole } from "@/generated/prisma/browser";

// actions
import { assignUserRole } from "@/actions/assign-user-role";

// components
import { Spinner } from "@/components/Spinner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 3rd party
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

// ----------------------------------------
// Select user role component
// ----------------------------------------
const ROLE_REDIRECT_MAP: Record<UserRole, string> = {
  JOB_SEEKER: "/job-seeker/jobs?page=1",
  EMPLOYER: "/employer/jobs",
};

export function SelectUserRole() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    UserRole.JOB_SEEKER,
  );

  // Select user role tanstack mutation
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      return await assignUserRole(selectedRole);
    },

    onSuccess: async (response) => {
      if (!session?.user.id) return;

      if (response.success) {
        await update({
          ...session,
          user: {
            ...session.user,
            role: selectedRole,
          },
        });

        toast.success("Role assigned successfully!");

        router.replace(ROLE_REDIRECT_MAP[selectedRole]);
      } else {
        toast.error(response.message ?? "Failed to assign role");
      }
    },

    onError: (error: Error) => {
      console.error("Role assignment error:", error);
      toast.error("Something went wrong. Please try again.");
    },
  });

  // Handle role assign
  const handleRoleAssign = () => {
    mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-4 sm:p-8">
        {/* Role Toggle */}
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-xl sm:text-3xl text-brand">I am a</h2>

          <div
            role="group"
            aria-label="Select role"
            className="relative flex items-center justify-between border dark:bg-accent shadow-sm rounded-full w-full p-1"
          >
            {/* Slider */}
            <div
              className={`absolute z-10 top-1 bottom-1 w-1/2 rounded-full transition-transform duration-300 flex items-center justify-center shadow-sm bg-brand text-white dark:text-background font-medium sm:font-semibold ${
                selectedRole === UserRole.JOB_SEEKER
                  ? "translate-x-0"
                  : "translate-x-[calc(100%-8px)]"
              }`}
            >
              {selectedRole === UserRole.JOB_SEEKER ? "Job seeker" : "Employer"}
            </div>

            {/* Job seeker */}
            <button
              type="button"
              aria-pressed={selectedRole === UserRole.JOB_SEEKER}
              disabled={isPending}
              onClick={() => setSelectedRole(UserRole.JOB_SEEKER)}
              className="relative flex-1 py-4 text-center font-medium sm:font-semibold hover:text-brand transition-colors"
            >
              Job seeker
            </button>

            {/* Employer */}
            <button
              type="button"
              aria-pressed={selectedRole === UserRole.EMPLOYER}
              disabled={isPending}
              onClick={() => setSelectedRole(UserRole.EMPLOYER)}
              className="relative flex-1 py-4 text-center font-medium sm:font-semibold hover:text-brand transition-colors"
            >
              Employer
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <Button
            type="button"
            onClick={handleRoleAssign}
            disabled={isPending}
            className="bg-brand hover:bg-brand-hover rounded-full font-semibold"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Spinner color="text-white dark:text-background" />
                Submit
              </span>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
