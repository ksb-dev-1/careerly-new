"use server";

import { ApplicationStatus } from "@/generated/prisma/client";
import EmployerActionMail from "../_components/employer-action-mail";
import { resend } from "./resend";

// Map enum to email subject
const subjectMap: Record<ApplicationStatus, string> = {
  PENDING: "Application Pending",
  APPROVED: "Application Approved",
  OFFERED: "Job Offer Received",
  REJECTED: "Application Rejected",
};

type SendEmployerActionEmailParams = {
  to: string;
  from: string;
  companyName: string;
  role: string;
  action: ApplicationStatus;
};

export async function sendEmployerActionEmail({
  to,
  from,
  companyName,
  role,
  action,
}: SendEmployerActionEmailParams) {
  // Capitalize first letter of username from email
  const userName =
    to.split("@")[0].charAt(0).toUpperCase() + to.split("@")[0].slice(1);

  await resend.emails.send({
    from,
    to,
    subject: subjectMap[action],
    react: EmployerActionMail({
      userName,
      companyName,
      role,
      action: action,
    }),
  });
}
