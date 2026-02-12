// ----------------------------------------
// Imports
// ----------------------------------------

import { formatJobTypeOrMode } from "@/lib/utils";
import { Currency, JobMode, JobType } from "@/generated/prisma/client";
import { CardContent } from "@/components/ui/card";

import {
  DollarSign,
  IndianRupee,
  Euro,
  Timer,
  BriefcaseBusiness,
  MapPin,
  Building,
  Wallet,
} from "lucide-react";

// ----------------------------------------
// Currency Icon
// ----------------------------------------
function CurrencyIcon({ currency }: { currency: Currency }) {
  if (currency === "USD") return <DollarSign size={16} />;
  if (currency === "INR") return <IndianRupee size={16} />;
  if (currency === "EUR") return <Euro size={16} />;
  return <DollarSign size={16} />;
}

// ----------------------------------------
// Job Detail Row
// ----------------------------------------
interface JobDetailRowProps {
  icon: React.ReactNode;
  value: string | number;
  isExperience?: boolean;
  currency?: Currency;
  isLocation?: boolean;
}

function JobDetailRow({
  icon,
  value,
  isExperience,
  currency,
  isLocation,
}: JobDetailRowProps) {
  const displayValue =
    isLocation && typeof value === "string" ? value.split(",")[0] : value;

  return (
    <div className="flex items-center gap-2">
      <span>{icon}</span>
      <span className="text-sm flex items-center text-slate-600 dark:text-muted-foreground">
        {currency && <CurrencyIcon currency={currency} />}
        {displayValue}
        {isExperience && " years"}
      </span>
    </div>
  );
}

// ----------------------------------------
// Job Card Metadata
// ----------------------------------------
interface JobMetadataProps {
  experienceMin: number | null;
  experienceMax: number | null;
  salary: number;
  currency: Currency;
  jobType: JobType;
  jobMode: JobMode;
  location: string;
}

export function JobCardMetadata({
  experienceMin,
  experienceMax,
  salary,
  currency,
  jobType,
  jobMode,
  location,
}: JobMetadataProps) {
  const experience =
    experienceMin === experienceMax
      ? `${experienceMin}`
      : `${experienceMin}-${experienceMax}`;

  return (
    <CardContent>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Experience */}
        <JobDetailRow
          icon={<BriefcaseBusiness size={16} />}
          value={experience}
          isExperience
        />

        {/* Salary */}
        <JobDetailRow
          icon={<Wallet size={16} />}
          value={salary}
          currency={currency}
        />

        {/* Job Type */}
        <JobDetailRow
          icon={<Timer size={16} />}
          value={formatJobTypeOrMode(jobType)}
        />

        {/* Job Mode */}
        <JobDetailRow
          icon={<Building size={16} />}
          value={formatJobTypeOrMode(jobMode)}
        />

        {/* Location */}
        <JobDetailRow
          icon={<MapPin size={16} />}
          value={location || "Not specified"}
          isLocation
        />
      </div>
    </CardContent>
  );
}
