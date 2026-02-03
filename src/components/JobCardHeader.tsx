// ----------------------------------------
// Imports
// ----------------------------------------

// generated
import { ApplicationStatus } from "@/generated/prisma/client";

// components
import { ApplicationStatusBadge } from "@/components/ApplicationStatusBadge";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// ----------------------------------------
// Types
// ----------------------------------------

interface JobHeaderProps {
  companyLogo: string | null;
  role: string;
  companyName: string;
  applicationStatus: ApplicationStatus | undefined | null;
  appliedOn: Date | null | undefined;
}

// ----------------------------------------
// Main Component
// ----------------------------------------
export function JobCardHeader({
  role,
  companyName,
  applicationStatus,
  appliedOn,
}: JobHeaderProps) {
  return (
    <CardHeader>
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-0">
            {/* Company logo */}
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${companyName}`}
              alt={companyName}
              className="h-12 w-12 rounded-xl"
            />

            {/* Application Status */}
            {applicationStatus && appliedOn ? (
              <ApplicationStatusBadge
                appliedOn={appliedOn}
                applicationStatus={applicationStatus}
                className="ml-2 sm:hidden"
              />
            ) : (
              ""
            )}
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              {/* Role */}
              <span className="text-lg font-bold">{role}</span>

              {/* Application Status */}
              {applicationStatus && appliedOn ? (
                <ApplicationStatusBadge
                  appliedOn={appliedOn}
                  applicationStatus={applicationStatus}
                  className="hidden sm:block"
                />
              ) : (
                ""
              )}
            </CardTitle>

            {/* Company name */}
            <CardDescription className="font-medium">
              {companyName}
            </CardDescription>
          </div>
        </div>
      </div>
    </CardHeader>
  );
}
