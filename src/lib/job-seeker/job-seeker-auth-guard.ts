// ----------------------------------------
// Imports
// ----------------------------------------

import { redirect } from "next/navigation";

// auth
import { auth } from "@/auth";

// generated
import { UserRole } from "@/generated/prisma/enums";

// components
import { UnauthorizedError } from "@/components/errors/UnauthorizedError";

export async function jobSeekerAuthGuard() {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  if (session.user.role !== UserRole.JOB_SEEKER) redirect("/select-role");

  return session.user.id;
}
