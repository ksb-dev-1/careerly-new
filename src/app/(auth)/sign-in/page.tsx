// ----------------------------------------
// Imports
// ----------------------------------------
import { Metadata } from "next";

// components
import { SigninForm } from "@/components/sign-in/SignInForm";

// ----------------------------------------
// Metadata
// ----------------------------------------
export const metadata: Metadata = {
  title: "Sign in - Careerly",
  description: "Sign in to your Careerly account to explore",
};

export default async function SignInPage() {
  return <SigninForm />;
}
