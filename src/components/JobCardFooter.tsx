"use client";

// ----------------------------------------
// Imports
// ----------------------------------------

// generated
import { Resume } from "@/generated/prisma/client";

// lib
import { relativeDate } from "@/lib/utils";

// components
import { ApplyForJobDialog } from "@/components/job-seeker/ApplyForJobDialog";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type JobFooterProps =
  | {
      variant: "job-list" | "posted-job-list";
      postedOn: Date;
    }
  | {
      variant: "job-details";
      postedOn: Date;
      jobId: string;
      appliedOn: Date | null;
      resume: Resume | null;
    }
  | {
      variant: "posted-job-details";
      postedOn: Date;
      jobId: string;
    };

export function JobCardFooter(props: JobFooterProps) {
  return (
    <CardFooter className="flex items-center justify-between gap-2">
      {/* Posted on */}
      <span className="text-xs text-muted-foreground font-semibold">
        {relativeDate(props.postedOn)}
      </span>

      {/* Right-side action */}
      <div className="flex items-center gap-4">
        {props.variant === "job-details" && !props.appliedOn && (
          <ApplyForJobDialog
            resume={props.resume ?? null}
            jobId={props.jobId}
          />
        )}

        {props.variant === "posted-job-details" && (
          <Button
            className="bg-brand text-white dark:text-background hover:bg-brand-hover md:mr-11"
            onClick={() => {
              document
                .getElementById("applicant-list")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Applications
          </Button>
        )}
      </div>
    </CardFooter>
  );
}
