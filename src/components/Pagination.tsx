"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { useSearchParams } from "next/navigation";

// hooks
import { useCustomRouter } from "@/hooks/useCustomRouter";

// components
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type JobPaginationProps = {
  totalPages: number;
};

// ----------------------------------------
// Pagination Component
// ----------------------------------------
export function JobPagination({ totalPages }: JobPaginationProps) {
  const router = useCustomRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        {/* Previous */}
        <PaginationPrevious
          href="#"
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          onClick={(e) => {
            e.preventDefault();
            if (currentPage > 1) goToPage(currentPage - 1);
          }}
        />

        {/* Page numbers */}
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;

          if (
            page !== 1 &&
            page !== totalPages &&
            Math.abs(page - currentPage) > 1
          ) {
            if (page === currentPage - 2 || page === currentPage + 2) {
              return <PaginationEllipsis key={page} />;
            }
            return null;
          }

          return (
            <PaginationLink
              key={page}
              href="#"
              isActive={page === currentPage}
              onClick={(e) => {
                e.preventDefault();
                goToPage(page);
              }}
            >
              {page}
            </PaginationLink>
          );
        })}

        {/* Next */}
        <PaginationNext
          href="#"
          className={
            currentPage === totalPages ? "pointer-events-none opacity-50" : ""
          }
          onClick={(e) => {
            e.preventDefault();
            if (currentPage < totalPages) goToPage(currentPage + 1);
          }}
        />
      </PaginationContent>
    </Pagination>
  );
}
