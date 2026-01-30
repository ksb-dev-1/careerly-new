// lib
import { getJobApplicationStatusColor, cn } from "@/lib/utils";

// components
import { Badge } from "./ui/badge";

// 3rd party
import { ApplicationStatus } from "@/generated/prisma/client";

interface ApplicationStatusProps {
  appliedOn: Date | null | undefined;
  applicationStatus: ApplicationStatus | undefined | null;
  className?: string;
}

export function ApplicationStatusBadge({
  appliedOn,
  applicationStatus,
  className,
}: ApplicationStatusProps) {
  if (!appliedOn || !applicationStatus) return null;

  return (
    <Badge
      className={cn(getJobApplicationStatusColor(applicationStatus), className)}
    >
      {applicationStatus.charAt(0) + applicationStatus.slice(1).toLowerCase()}
    </Badge>
  );
}
