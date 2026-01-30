"use server";

import JobApplyConfirmationMail from "../_components/job-apply-confirmation-mail";
import { resend } from "./resend";

type SendJobApplyConfirmationEmailParams = {
  to: string;
  from: string;
  companyName: string;
  role: string;
};

export async function sendJobApplyConfirmationEmail({
  to,
  from,
  companyName,
  role,
}: SendJobApplyConfirmationEmailParams) {
  const userName = to.split("@")[0].charAt(0) + to.split("@")[0].slice(1);

  await resend.emails.send({
    from,
    to,
    subject: "Job apply confirmation",
    react: JobApplyConfirmationMail({
      userName,
      companyName,
      role,
    }),
  });
}
