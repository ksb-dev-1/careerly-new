"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// components
import { Button } from "./ui/button";

// 3rd party
import { SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";

export function EditLink({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <Button
      asChild
      size="icon"
      className={cn(
        "bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand rounded-full",
        className,
      )}
      aria-label="edit-link"
    >
      <Link
        href={`${href}?callbackUrl=${encodeURIComponent(pathname)}`}
        prefetch={true}
      >
        <SquarePen />
      </Link>
    </Button>
  );
}
