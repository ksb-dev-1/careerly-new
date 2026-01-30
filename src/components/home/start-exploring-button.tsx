"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import Link from "next/link";
import { useRouter } from "next/navigation";

// auth
import { useSession } from "next-auth/react";

// generated
import { UserRole } from "@/generated/prisma/browser";

// components
import { Skeleton } from "@/components/ui/skeleton";

// ----------------------------------------
// Start exploing button omponent
// ----------------------------------------
export function StartExploringButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <Skeleton className="border text-transparent rounded-full px-6 py-4 font-medium">
        Start Exploring
      </Skeleton>
    );
  }

  if (session?.user.id && !session.user.role) {
    router.push("/select-user-role");
  }

  let href = "/sign-in";

  if (session?.user.role === UserRole.JOB_SEEKER) {
    href = "/job-seeker/jobs?page=1";
  }

  if (session?.user.role === UserRole.EMPLOYER) {
    href = "/employer/jobs?page=1";
  }

  return (
    <div className="flex items-center">
      <Link
        href={href}
        className="bg-brand rounded-full px-6 py-4 hover:bg-brand-hover transition text-white dark:text-background font-semibold"
      >
        Start Exploring
      </Link>
    </div>
  );
}
