// // ----------------------------------------
// // Imports
// // ----------------------------------------
// import { Suspense } from "react";
// import Link from "next/link";

// // generated
// import { UserRole } from "@/generated/prisma/browser";
// import { Skeleton } from "../ui/skeleton";
// import { auth } from "@/auth";

// // ----------------------------------------
// // Auth content loader
// // ----------------------------------------
// async function AuthContentLoader() {
//   const session = await auth();
//   let href = "/sign-in";

//   if (session?.user?.id) {
//     if (session.user.role === UserRole.JOB_SEEKER) {
//       href = "/job-seeker/jobs?page=1";
//     } else if (session.user.role === UserRole.EMPLOYER) {
//       href = "/employer/jobs?page=1";
//     }
//   }

//   return (
//     <Link
//       href={href}
//       className="bg-brand rounded-full px-6 py-4 hover:bg-brand-hover transition text-white dark:text-background font-medium"
//       prefetch={false}
//     >
//       Start Exploring
//     </Link>
//   );
// }

// // ----------------------------------------
// // Start exploing button
// // ----------------------------------------
// export async function StartExploringButton() {
//   return (
//     <Suspense
//       fallback={
//         <Skeleton className="border text-transparent rounded-full px-6 py-4 font-medium">
//           Start Exploring
//         </Skeleton>
//       }
//     >
//       <AuthContentLoader />
//     </Suspense>
//   );
// }

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
// Main Component
// ----------------------------------------
export function StartExploringButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <Skeleton className="border text-transparent rounded-full h-14 px-6 font-medium">
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
