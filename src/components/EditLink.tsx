"use client";

import { usePathname } from "next/navigation";

// components
import { CustomLink } from "@/components/CustomLink";
import { Button } from "@/components/ui/button";

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
        "bg-brand/20 hover:bg-brand/30 border border-brand/30 text-brand",
        className,
      )}
      aria-label="edit-link"
    >
      <CustomLink
        href={`${href}?callbackUrl=${encodeURIComponent(pathname)}`}
        prefetch={true}
        isActive={pathname === href}
      >
        <SquarePen />
      </CustomLink>
    </Button>
  );
}
