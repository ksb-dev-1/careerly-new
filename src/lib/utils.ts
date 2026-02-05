// generated
import {
  ApplicationStatus,
  JobMode,
  JobStatus,
  JobType,
} from "@/generated/prisma/browser";

// 3rd party
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInSeconds } from "date-fns";

export function formatMoney(
  amount: number,
  currency: "USD" | "INR" | "EUR" = "USD",
  locale?: string,
) {
  // Default locales for each currency if locale not provided
  const currencyLocales: Record<string, string> = {
    USD: "en-US",
    INR: "en-IN",
    EUR: "de-DE", // common Euro format
  };

  return new Intl.NumberFormat(locale || currencyLocales[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function relativeDate(date: Date) {
  // return formatDistanceToNow(from, { addSuffix: true });
  const seconds = differenceInSeconds(new Date(), date);

  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function dayMonthYearFormat(from: Date) {
  return format(from, "dd MMM yyyy");
}

export function formatJobTypeOrMode(field: JobType | JobMode): string {
  return field
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getJobApplicationStatusColor(status: ApplicationStatus) {
  switch (status) {
    case ApplicationStatus.PENDING:
      return "bg-amber-600 text-white dark:bg-amber-950 dark:text-brand";
    case ApplicationStatus.APPROVED:
      return "bg-blue-600 text-white dark:bg-blue-950 dark:text-brand";
    case ApplicationStatus.OFFERED:
      return "bg-green-600 text-white ddark:bg-green-950 dark:text-brand";
    case ApplicationStatus.REJECTED:
      return "bg-rose-600 text-white dark:bg-rose-950 dark:text-brand";
    default:
      return "bg-gray-600 text-white dark:bg-amber-950 dark:text-brand";
  }
}

export function getJobStatusColor(status: JobStatus) {
  switch (status) {
    case JobStatus.OPEN:
      return "bg-emerald-100 text-emerald-600 border border-emerald-300 dark:bg-emerald-950/20 dark:text-emerald-500 dark:border-emerald-800";
    case JobStatus.CLOSED:
      return "bg-red-100 text-red-600 border border-red-300 dark:bg-red-950/20 dark:text-red-500 dark:border-red-800";
    default:
      return "bg-gray-100 text-gray-600 border border-gray-300 dark:bg-gray-950 dark:text-gray-600 darK:border-gray-800";
  }
}
