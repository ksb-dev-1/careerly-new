// ----------------------------------------
// Imports
// ----------------------------------------
import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// auth
import { auth } from "@/auth";

// components
import { LoadingFallback } from "@/components/LoadingFallback";
import { SelectUserRole } from "@/components/select-user-role/SelectUserRole";

// 3rd party
import { UserRole } from "@/generated/prisma/client";

// ----------------------------------------
// Metadata
// ----------------------------------------
export const metadata: Metadata = {
  title: "Select Your Role",
  description:
    "Choose whether you want to continue as a Job Seeker or an Employer to get started.",
};

// ----------------------------------------
// Content loader
// ----------------------------------------
async function SelectUserRolePageContent() {
  const session = await auth();
  const userId = session?.user.id;
  const role = session?.user.role;

  if (!userId) redirect("/sign-in");

  if (role === UserRole.JOB_SEEKER) {
    redirect("/job-seeker/jobs?page=1");
  }

  if (role === UserRole.EMPLOYER) {
    redirect("/employer/jobs");
  }

  return <SelectUserRole />;
}

// ----------------------------------------
// Select user role page
// ----------------------------------------
export default async function SelectUserRolePage() {
  return (
    <Suspense fallback={<LoadingFallback color="text-brand" />}>
      <SelectUserRolePageContent />
    </Suspense>
  );
}
