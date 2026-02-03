// ----------------------------------------
// Imports
// ----------------------------------------
import Link from "next/link";

// 3rd party
import { Button } from "../ui/button";
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
      <p className="text-slate-700 dark:text-muted-foreground max-w-sm text-center mt-1">
        {message}
      </p>
      {href && (
        <Button
          asChild
          className="bg-brand hover:bg-brand-hover! mt-6 rounded-full"
        >
          <Link href={href} prefetch={true}>
            {btnIcon}
            <span>{btnLabel}</span>
          </Link>
        </Button>
      )}
    </div>
  );
}
