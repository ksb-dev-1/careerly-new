"use client";

// ----------------------------------------
// Imports
// ----------------------------------------

// generated
import { UserRole } from "@/generated/prisma/browser";

// actions
import { googleSignin, githubSignin, resendSignin } from "@/actions/sign-in";

// hooks
import { useCustomRouter } from "@/hooks/useCustomRouter";

// components
import { SignInButton } from "@/components/sign-in/SignInButton";

// components
import { LoadingFallback } from "@/components/LoadingFallback";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// 3rd party
import { useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

// ----------------------------------------
// Constants
// ----------------------------------------
const OAUTH_PROVIDERS = [
  {
    action: googleSignin,
    icon: <FcGoogle size={20} aria-hidden="true" />,
    label: "Sign in with Google",
  },
  {
    action: githubSignin,
    icon: <FaGithub size={20} aria-hidden="true" />,
    label: "Sign in with GitHub",
  },
] as const;

// ----------------------------------------
// Sign in form component
// ----------------------------------------
export function SigninForm() {
  const { data: session, status } = useSession();
  const router = useCustomRouter();

  if (status === "loading") {
    return <LoadingFallback color="text-brand" />;
  }

  if (session?.user?.id) {
    switch (session.user.role) {
      case UserRole.JOB_SEEKER:
        router.push("/job-seeker/jobs?page=1");
        break;
      case UserRole.EMPLOYER:
        router.push("/employer/jobs?page=1");
        break;
      default:
        router.push("/select-user-role");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-sm w-full mx-auto">
        <CardHeader>
          <CardTitle className="font-bold text-lg">
            Sign in to <span className="text-brand">Careerly</span>
          </CardTitle>
          <CardDescription>
            Enter your email below to sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Email Sign-in Form */}
            <form action={resendSignin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="johndoe@example.com"
                  autoComplete="email"
                  required
                  aria-required="true"
                />
              </div>
              <SignInButton
                text="Sign in with Email"
                className="bg-brand hover:bg-brand-hover"
                aria-label="Sign in with email"
              />
            </form>

            <div className="relative my-2">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-slate-600 dark:text-muted-foreground">
                Or continue with
              </span>
            </div>

            {/* OAuth Sign-in Buttons */}
            {OAUTH_PROVIDERS.map(({ action, icon, label }) => (
              <form key={label} action={action}>
                <SignInButton aria-label={label} icon={icon} text={label} />
              </form>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
