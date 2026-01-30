import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import type { NextAuthConfig } from "next-auth";
import { sendVerificationEmail } from "./emails/_lib/send-verification-email";
import { UserRole } from "@/generated/prisma/client";

export default {
  providers: [
    Google,
    GitHub,
    ...(process.env.EMAIL_PROVIDER_ENABLED === "true"
      ? [
          Resend({
            from: process.env.EMAIL_FROM!,

            async sendVerificationRequest({ identifier, url, provider }) {
              await sendVerificationEmail({
                to: identifier,
                url,
                from: provider.from!,
              });
            },
          }),
        ]
      : []),
  ],
  pages: {
    signIn: "/sign-in",
    newUser: "/select-user-role",
    verifyRequest: "/verify-email",
    error: "/auth-error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // may be null initially
      }

      if (trigger === "update" && session?.user?.role) {
        token.role = session.user.role;
      }

      if (trigger === "update" && session?.user?.image) {
        token.picture = session.user.image;
      }

      return token;
    },

    async session({ session, token }) {
      try {
        if (token?.id) {
          session.user.id = token.id as string;
          session.user.role = token.role as UserRole; // UserRole

          session.user.name = token.name as string;
          session.user.email = token.email as string;
          session.user.image = token.picture as string;
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },
} satisfies NextAuthConfig;
