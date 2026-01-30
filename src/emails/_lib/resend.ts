import { Resend } from "resend";

if (!process.env.AUTH_RESEND_KEY) {
  throw new Error("AUTH_RESEND_KEY is not defined");
}

export const resend = new Resend(process.env.AUTH_RESEND_KEY);
