"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// generated
import { JobMode, JobType } from "@/generated/prisma/enums";

// hooks
import { useCustomRouter } from "@/hooks/useCustomRouter";

// components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// icons
import {
  ListFilter,
  Timer,
  Building,
  Check,
  BriefcaseBusiness,
} from "lucide-react";

// ----------------------------------------
// Constants
// ----------------------------------------
const DEFAULT_EXPERIENCE: [number, number] = [0, 30];

// ----------------------------------------
// Filters Component
// ----------------------------------------
export function Filters() {
  // applied (URL)
  const [activeJobType, setActiveJobType] = useState<string[]>([]);
  const [activeJobMode, setActiveJobMode] = useState<string[]>([]);
  const [activeExperience, setActiveExperience] =
    useState<[number, number]>(DEFAULT_EXPERIENCE);

  // temporary (UI only)
  const [tempJobType, setTempJobType] = useState<string[]>([]);
  const [tempJobMode, setTempJobMode] = useState<string[]>([]);
  const [tempExperience, setTempExperience] =
    useState<[number, number]>(DEFAULT_EXPERIENCE);

  const router = useCustomRouter();
  const searchParams = useSearchParams();

  // ----------------------------------------
  // Sync active filters from URL
  // ----------------------------------------
  useEffect(() => {
    const jobType = searchParams.get("jobType")?.split(",") ?? [];
    const jobMode = searchParams.get("jobMode")?.split(",") ?? [];

    const expParam = searchParams.get("experience");
    const exp = expParam?.split("-").map(Number) as
      | [number, number]
      | undefined;

    setActiveJobType(jobType);
    setActiveJobMode(jobMode);
    setTempJobType(jobType);
    setTempJobMode(jobMode);

    if (exp && exp.length === 2) {
      setActiveExperience(exp);
      setTempExperience(exp);
    } else {
      setActiveExperience(DEFAULT_EXPERIENCE);
      setTempExperience(DEFAULT_EXPERIENCE);
    }
  }, [searchParams]);

  // ----------------------------------------
  // Apply filters
  // ----------------------------------------
  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (tempJobType.length) {
      params.set("jobType", tempJobType.join(","));
    } else {
      params.delete("jobType");
    }

    if (tempJobMode.length) {
      params.set("jobMode", tempJobMode.join(","));
    } else {
      params.delete("jobMode");
    }

    if (tempExperience[0] !== 0 || tempExperience[1] !== 30) {
      params.set("experience", `${tempExperience[0]}-${tempExperience[1]}`);
    } else {
      params.delete("experience");
    }

    router.push(`/job-seeker/jobs?${params.toString()}`);
  };

  // ----------------------------------------
  // Clear all
  // ----------------------------------------
  // const handleClearAll = () => {
  //   setTempJobType([]);
  //   setTempJobMode([]);
  //   setTempExperience(DEFAULT_EXPERIENCE);

  //   const params = new URLSearchParams(searchParams.toString());
  //   params.set("page", "1");
  //   params.delete("jobType");
  //   params.delete("jobMode");
  //   params.delete("experience");

  //   router.push(`/job-seeker/jobs?${params.toString()}`);
  // };

  const totalSelections =
    tempJobType.length +
    tempJobMode.length +
    (tempExperience[0] !== 0 || tempExperience[1] !== 30 ? 1 : 0);

  const hasChanges =
    tempJobType.join() !== activeJobType.join() ||
    tempJobMode.join() !== activeJobMode.join() ||
    tempExperience.join() !== activeExperience.join();

  return (
    <Card className="max-w-62.5 w-full gap-0! hidden md:block sticky top-8">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <p className="flex items-center gap-2">
            <ListFilter size={16} />
            <span className="text-lg font-bold">Filters</span>
          </p>

          {totalSelections > 0 ? (
            <span className="h-6 w-6 text-xs rounded-full bg-brand text-white dark:text-background flex items-center justify-center">
              {totalSelections}
            </span>
          ) : (
            <span className="h-6 w-6 rounded-full" />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 border-y py-6">
        <FilterGroup
          label="Job Type"
          values={tempJobType}
          onChange={setTempJobType}
          options={Object.values(JobType)}
          icon={<Timer size={16} />}
        />

        <FilterGroup
          label="Job Mode"
          values={tempJobMode}
          onChange={setTempJobMode}
          options={Object.values(JobMode)}
          icon={<Building size={16} />}
        />

        {/* Experience */}
        <div className="space-y-4">
          <div className="font-bold flex items-center gap-2">
            <span>
              <BriefcaseBusiness size={16} />
            </span>
            <span>Experience</span>
          </div>

          <Slider
            value={tempExperience}
            min={0}
            max={30}
            step={1}
            onValueChange={(value) =>
              setTempExperience(value as [number, number])
            }
          />

          <div className="flex justify-between text-xs text-slate-600 dark:text-muted-foreground">
            <span>{tempExperience[0]} yrs</span>
            <span>{tempExperience[1]} yrs</span>
          </div>
        </div>

        {/* {totalSelections > 0 && (
          <div className="flex justify-end">
            <Badge
              variant="outline"
              onClick={handleClearAll}
              className="border bg-red-100 text-red-600 hover:bg-red-200 border-red-300 dark:bg-red-950/40 dark:text-red-500 dark:hover:bg-red-950 dark:border-red-800 cursor-default"
            >
              Clear All
            </Badge>
          </div>
        )} */}
      </CardContent>

      <CardFooter className="mt-6">
        <Button
          onClick={handleApply}
          disabled={!hasChanges}
          className="w-full bg-brand text-white dark:text-background hover:bg-brand-hover"
        >
          Apply Filters
        </Button>
      </CardFooter>
    </Card>
  );
}

// ----------------------------------------
// Reusable Filter Group
// ----------------------------------------
interface FilterGroupProps {
  label: string;
  options: JobType[] | JobMode[];
  values: string[];
  onChange: (values: string[]) => void;
  icon: React.ReactNode;
}

function capitalize(value: JobType | JobMode) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function FilterGroup({
  label,
  options,
  values,
  onChange,
  icon,
}: FilterGroupProps) {
  const toggle = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="font-semibold flex items-center gap-2">
        <span>{icon}</span>
        <span className="font-bold">{label}</span>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        {options.map((option) => {
          const isActive = values.includes(option);

          return (
            <div key={option} className="flex items-center gap-2">
              {isActive ? (
                <span className="h-4 w-4 rounded bg-brand text-white dark:text-background flex items-center justify-center">
                  <Check size={12} />
                </span>
              ) : (
                <span className="inline-block h-4 w-4 rounded border border-slate-400 dark:border-[#444]" />
              )}
              <button
                onClick={() => toggle(option)}
                className={`transition text-sm ${
                  isActive
                    ? "text-brand"
                    : "text-slate-600 dark:text-muted-foreground hover:text-brand dark:hover:text-brand"
                }`}
              >
                {capitalize(option)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
