// ----------------------------------------
// Imports
// ----------------------------------------

// utils
import { formatJobTypeOrMode } from "@/lib/utils";

// generated
import { Currency, JobMode, JobType } from "@/generated/prisma/client";

// components
import { CardContent } from "@/components/ui/card";

// 3rd party
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

  // fallback icon
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
    <div className="text-sm flex items-center gap-2 font-medium">
      <span className="">{icon}</span>
      <span className="flex items-center text-muted-foreground">
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
  experience: string;
  salary: number;
  currency: Currency;
  jobType: JobType;
  jobMode: JobMode;
  location: string;
}

export function JobCardMetadata({
  experience,
  salary,
  currency,
  jobType,
  jobMode,
  location,
}: JobMetadataProps) {
  return (
    <CardContent>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Experience */}
        <JobDetailRow
          icon={<BriefcaseBusiness size={16} />}
          value={experience}
          isExperience={true}
        />

        {/* Salary */}
        <JobDetailRow
          icon={<Wallet size={16} />}
          value={salary}
          currency={currency}
        />

        {/* Job type */}
        <JobDetailRow
          icon={<Timer size={16} />}
          value={formatJobTypeOrMode(jobType)}
        />

        {/* Job mode */}
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
