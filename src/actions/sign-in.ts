"use server";

import { signIn } from "@/auth";

export async function googleSignin() {
  await signIn("google");
}

export async function githubSignin() {
  await signIn("github");
}

export async function resendSignin(formData: FormData) {
  await signIn("resend", formData);
}
