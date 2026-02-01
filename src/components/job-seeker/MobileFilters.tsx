"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// hooks
import { useAutoCloseOnGreaterThanOrEqualToBreakpoint } from "@/hooks/useAutoCloseModalOnBreakpoint";

// generated
import { JobType, JobMode } from "@/generated/prisma/enums";

// components
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

// 3rd party
import {
  BriefcaseBusiness,
  Building,
  Check,
  ListFilter,
  Timer,
} from "lucide-react";

// ----------------------------------------
// Constants
// ----------------------------------------
const DEFAULT_EXPERIENCE: [number, number] = [0, 30];

export function MobileFilters() {
  const [open, setOpen] = useState<boolean>(false);

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

  const router = useRouter();
  const searchParams = useSearchParams();

  useAutoCloseOnGreaterThanOrEqualToBreakpoint(open, setOpen, 768);

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

    setTimeout(() => setOpen(false), 300);

    router.push(`/job-seeker/jobs?${params.toString()}`);
  };

  const totalSelections =
    tempJobType.length +
    tempJobMode.length +
    (tempExperience[0] !== 0 || tempExperience[1] !== 30 ? 1 : 0);

  const hasChanges =
    tempJobType.join() !== activeJobType.join() ||
    tempJobMode.join() !== activeJobMode.join() ||
    tempExperience.join() !== activeExperience.join();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden rounded-full">
          <ListFilter />
          <span>Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0! gap-0! max-w-75!">
        <SheetHeader className="h-16">
          <SheetTitle className="flex items-center gap-2">
            <p className="flex items-center gap-2">
              <ListFilter size={20} />
              <span className="font-bold">Filters</span>
            </p>
            {totalSelections > 0 ? (
              <span className="h-6 w-6 text-xs rounded-full bg-brand text-white dark:text-background flex items-center justify-center">
                {totalSelections}
              </span>
            ) : (
              <span className="h-6 w-6 rounded-full" />
            )}
          </SheetTitle>
        </SheetHeader>

        <Separator />

        <div className="space-y-6 p-6">
          <FilterGroup
            label="Job Type"
            values={tempJobType}
            onChange={setTempJobType}
            options={Object.values(JobType)}
            icon={<Timer size={20} />}
          />

          <FilterGroup
            label="Job Mode"
            values={tempJobMode}
            onChange={setTempJobMode}
            options={Object.values(JobMode)}
            icon={<Building size={20} />}
          />

          {/* Experience */}
          <div className="space-y-4">
            <div className="font-bold flex items-center gap-2 text-brand">
              <span>
                <BriefcaseBusiness size={20} />
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

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{tempExperience[0]} yrs</span>
              <span>{tempExperience[1]} yrs</span>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t">
          <Button
            onClick={handleApply}
            disabled={!hasChanges}
            className="bg-brand text-white dark:text-background hover:bg-brand-hover rounded-full"
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
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
      <div className="text-sm font-bold flex items-center gap-2 text-brand">
        <span>{icon}</span>
        <span>{label}</span>
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
                <span className="inline-block h-4 w-4 rounded border border-slate-300 dark:border-[#444]" />
              )}
              <button
                onClick={() => toggle(option)}
                className={`transition ${
                  isActive
                    ? "text-brand"
                    : "hover:text-muted-foreground dark:hover:text-white/80"
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
