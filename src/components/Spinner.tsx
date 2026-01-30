// ----------------------------------------
// Imports
// ----------------------------------------
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ----------------------------------------
// Types
// ----------------------------------------
interface SpinnerProps {
  className?: string;
  size?: number;
  color?: string;
}

// ----------------------------------------
// Main component
// ----------------------------------------
export function Spinner({ className, size = 16, color }: SpinnerProps) {
  return (
    <LoaderCircle
      className={cn("animate-spin", className, color)}
      size={size}
      aria-label="Loading"
    />
  );
}
