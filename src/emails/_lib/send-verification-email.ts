"use server";

import VerifyEmail from "../_components/verify-email";
import { resend } from "./resend";

type SendVerificationEmailParams = {
  to: string;
  url: string;
  from: string;
};

export async function sendVerificationEmail({
  to,
  url,
  from,
}: SendVerificationEmailParams) {
  const firstName = to.split("@")[0].charAt(0) + to.split("@")[0].slice(1);

  await resend.emails.send({
    from,
    to,
    subject: "Verify your Careerly account",
    react: VerifyEmail({
      url,
      firstName,
    }),
  });
}
