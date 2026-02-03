"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// generated
import { Resume } from "@/generated/prisma/browser";

// components
import { ApplyForJobButton } from "@/components/job-seeker/ApplyForJobButton";

// components
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
                    className="bg-brand/10 text-brand hover:bg-brand/20 border border-brand/20 rounded-full"
                    aria-label="download resume"
                  >
                    <Download />
                  </Button>
                </div>

                <div className="rounded-xl border p-4 space-y-2 mt-6">
                  <p className="text-sm">
                    Do you want to update your resume before applying?
                  </p>

                  <Link
                    className="text-sm font-medium text-brand underline"
                    href={`/job-seeker/profile?callbackUrl=${encodeURIComponent(
                      pathname,
                    )}`}
                    prefetch={true}
                  >
                    Upload new resume
                  </Link>

                  <p className="text-xs text-slate-600 dark:text-muted-foreground mt-1">
                    You will be redirected back to this page after uploading
                    your resume.
                  </p>
                </div>

                <ApplyForJobButton jobId={jobId} setOpen={setOpen} />
              </div>
            ) : (
              <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-300 dark:border-red-800 bg-white dark:bg-red-900 text-red-600 dark:text-red-400 font-semibold">
                    !
                  </span>

                  <div>
                    <p className="text-base font-semibold text-red-700 dark:text-red-400">
                      Resume required
                    </p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-muted-foreground">
                      You must upload a resume before applying for this
                      position.
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    You’ll be redirected back after uploading.
                  </p>

                  <Button
                    asChild
                    className="bg-red-600 text-white hover:bg-red-600/90 dark:bg-red-500 dark:text-background dark:hover:bg-red-500/90"
                  >
                    <Link
                      href={`/job-seeker/profile?callbackUrl=${encodeURIComponent(pathname)}`}
                      prefetch
                      className="flex items-center gap-2"
                    >
                      Got to upload resume
                      <MoveRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
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
