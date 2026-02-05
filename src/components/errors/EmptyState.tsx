// ----------------------------------------
// Imports
// ----------------------------------------
import Link from "next/link";

// 3rd party
import { FolderOpen } from "lucide-react";

// ----------------------------------------
// Interfaces and types
// ----------------------------------------
interface EmptyStateProps {
  message: string;
  href?: string;
  btnIcon?: React.ReactNode;
  btnLabel?: string;
}

// ----------------------------------------
// Main component
// ----------------------------------------
export function EmptyState({
  message,
  href,
  btnIcon,
  btnLabel,
}: EmptyStateProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="relative h-14 w-14 rounded-full bg-brand/20 text-brand border border-brand/30">
        <FolderOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="font-bold text-xl mt-4">Nothing to show</p>
      <p className="text-slate-600 dark:text-muted-foreground max-w-sm text-center mt-1">
        {message}
      </p>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-2 text-brand mt-4 hover:text-brand-hover"
        >
          {btnIcon}
          <span>{btnLabel}</span>
        </Link>
      )}
    </div>
  );
}
