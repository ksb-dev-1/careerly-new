import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { UserRole } from "@/generated/prisma/client";

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Ignore internal & static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // -----------------------------
  // PUBLIC ROUTES
  // -----------------------------
  const publicRoutes =
    pathname === "/" ||
    pathname === "/sign-in" ||
    pathname === "/job-seeker/jobs" ||
    pathname.startsWith("/job-seeker/jobs/");

  // -----------------------------
  // NO USER
  // -----------------------------
  if (!session?.user) {
    // force redirect for random URLs
    if (!publicRoutes) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // -----------------------------
  // USER EXISTS BUT NO ROLE
  // -----------------------------
  if (!session.user.role) {
    if (pathname !== "/select-user-role") {
      return NextResponse.redirect(new URL("/select-user-role", request.url));
    }
    return NextResponse.next();
  }

  // -----------------------------
  // JOB SEEKER
  // -----------------------------
  if (session.user.role === UserRole.JOB_SEEKER) {
    if (pathname !== "/" && !pathname.startsWith("/job-seeker")) {
      return NextResponse.redirect(
        new URL("/job-seeker/jobs?page=1", request.url),
      );
    }
    return NextResponse.next();
  }

  // -----------------------------
  // EMPLOYER
  // -----------------------------
  if (session.user.role === UserRole.EMPLOYER) {
    if (pathname !== "/" && !pathname.startsWith("/employer")) {
      return NextResponse.redirect(
        new URL("/employer/jobs?page=1", request.url),
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
