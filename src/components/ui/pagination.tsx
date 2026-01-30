import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="Pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

/**
 * ⚠️ IMPORTANT:
 * This is now a <div>, NOT <ul>
 * So children can safely be <a>
 */
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size: "icon",
        }),
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious(
  props: React.ComponentProps<typeof PaginationLink>,
) {
  return (
    <PaginationLink aria-label="Go to previous page" {...props}>
      <ChevronLeftIcon />
      <span className="sr-only">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext(props: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to next page" {...props}>
      <ChevronRightIcon />
      <span className="sr-only">Next</span>
    </PaginationLink>
  );
}

function PaginationEllipsis() {
  return (
    <span aria-hidden className="flex size-9 items-center justify-center">
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
