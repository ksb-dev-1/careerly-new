"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { useState } from "react";
import { usePathname } from "next/navigation";

// generated
import { Resume } from "@/generated/prisma/browser";

// components
import { ApplyForJobButton } from "@/components/job-seeker/ApplyForJobButton";

// components
import { CustomLink } from "@/components/CustomLink";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

// 3rd party

import { Download, MoveRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// ----------------------------------------
// Helper Functions
// ----------------------------------------
const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`; // Shows KB for small files
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`; // Shows MB for large files
};

// ----------------------------------------
// Apply For Job Dialog Component
// ----------------------------------------
interface ApplyForJobDialogProps {
  resume: Resume | null;
  jobId: string;
}

export function ApplyForJobDialog({ resume, jobId }: ApplyForJobDialogProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        {status === "loading" ? (
          <Skeleton className="h-9 sm:mr-11" aria-hidden="true" />
        ) : session?.user.id ? (
          <DialogTrigger asChild>
            <Button
              type="button"
              className="bg-brand hover:bg-brand-hover mr-11"
            >
              Apply
            </Button>
          </DialogTrigger>
        ) : (
          <Button
            type="button"
            className="bg-brand hover:bg-brand-hover mr-11"
            onClick={() => toast.error("Authentication Required!")}
          >
            Apply
          </Button>
        )}

        <DialogContent className="p-6!">
          <DialogHeader>
            <DialogTitle className="font-bold">Apply for this Job</DialogTitle>
            <DialogDescription>
              Review your resume details before submitting your application.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {/* Resume Section */}
            {resume ? (
              <div>
                <div className="flex items-center justify-between rounded-xl border p-4 shadow-sm">
                  <div>
                    <p className="font-medium text-brand">{resume.fileName}</p>
                    {resume.fileSize && (
                      <p className="text-xs text-slate-600 dark:text-muted-foreground">
                        {formatFileSize(resume.fileSize)}
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    onClick={() => window.open(resume.url, "_blank")}
                    className="bg-brand/10 text-brand hover:bg-brand/20 border border-brand/20 rounded-md"
                    aria-label="download resume"
                  >
                    <Download />
                  </Button>
                </div>

                <div className="rounded-xl border p-4 space-y-4 mt-6 flex flex-col items-center justify-center">
                  <p className="text-center font-bold">
                    Do you want to update your resume before applying?
                  </p>

                  <Button
                    asChild
                    className="w-full bg-brand/10 text-brand hover:bg-brand/20 border border-brand/20 font-medium flex items-center gap-2"
                  >
                    <CustomLink
                      href={`/job-seeker/profile?callbackUrl=${encodeURIComponent(pathname)}`}
                      prefetch={true}
                      isActive={pathname === "/job-seeker/profile"}
                    >
                      <span className="inline-flex items-center gap-1">
                        Upload New Resume
                        <MoveRight className="h-4 w-4 mt-1" />
                      </span>
                    </CustomLink>
                  </Button>

                  <p className="text-center text-sm text-slate-600 dark:text-muted-foreground">
                    You’ll be redirected back after uploading.
                  </p>
                </div>

                <ApplyForJobButton jobId={jobId} setOpen={setOpen} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-5 space-y-4">
                <div className="text-red-600 dark:text-red-400">
                  <p className="text-center text-xl font-bold">
                    Resume Required!
                  </p>
                  <p className="text-center mt-2">
                    You must upload a resume before applying for this position.
                  </p>
                </div>

                <Button
                  asChild
                  className="w-full text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 font-medium flex items-center gap-2 bg-red-200 dark:bg-red-950/50 hover:bg-red-200/70 dark:hover:bg-red-950/80"
                >
                  <CustomLink
                    href={`/job-seeker/profile?callbackUrl=${encodeURIComponent(
                      pathname,
                    )}`}
                    prefetch={true}
                    isActive={pathname === "/job-seeker/profile"}
                  >
                    Upload Resume <MoveRight className="h-4 w-4 mt-1" />
                  </CustomLink>
                </Button>

                <p className="text-center text-sm text-slate-600 dark:text-muted-foreground">
                  You’ll be redirected back after uploading.
                </p>
              </div>
            )}
          </div>

          {!resume && (
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          )}
        </DialogContent>
      </form>
    </Dialog>
  );
}
