"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// generated
import { UserRole } from "@/generated/prisma/browser";

// hooks
import { useAutoCloseOnGreaterThanOrEqualToBreakpoint } from "@/hooks/useAutoCloseModalOnBreakpoint";

// components
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { ProfileDropdownMenu } from "@/components/ProfileDropdownMenu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ThemeSwitchMobile } from "@/components/ThemeSwitchMobile";

// 3rd party
import { signOut, useSession } from "next-auth/react";
import {
  Bookmark,
  BriefcaseBusiness,
  FileText,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import { toast } from "sonner";

// ----------------------------------------
// Navigation items
// ----------------------------------------
type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const JOB_SEEKER_NAV_ITEMS: NavItem[] = [
  {
    href: "/job-seeker/jobs?page=1",
    label: "Jobs",
    icon: <BriefcaseBusiness size={16} />,
  },
  {
    href: "/job-seeker/bookmarks",
    label: "Bookmarks",
    icon: <Bookmark size={16} />,
  },
  {
    href: "/job-seeker/applications",
    label: "Applications",
    icon: <FileText size={16} />,
  },
];

const EMPLOYER_NAV_ITEMS: NavItem[] = [
  {
    href: "/employer/jobs?page=1",
    label: "Posted Jobs",
    icon: <BriefcaseBusiness size={16} />,
  },
];

// ----------------------------------------
// Navbar wrapper component
// ----------------------------------------
function NavbarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <header className="fixed z-30 top-0 left-0 right-0 w-full border-b h-16 bg-background flex items-center justify-center">
      <nav className="w-full flex items-center justify-between px-4">
        <div className="flex items-center">
          <Suspense>
            <SideMenu />
          </Suspense>

          <Link
            href="/"
            className="font-extrabold text-2xl text-brand hover:text-brand-hover transition-colors"
          >
            Careerly
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {children}
          <ThemeSwitch />
        </div>
      </nav>
    </header>
  );
}

// ----------------------------------------
// Navbar loading component
// ----------------------------------------
function NavbarLoading() {
  return (
    <NavbarWrapper>
      <div className="flex items-center gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton
            key={`skeleton-${i}`}
            className="skeleton flex items-center gap-2 w-18 h-8"
          />
        ))}
        <span className="inline-block h-5 border-r-2 mx-2" />

        <Skeleton className="skeleton h-8 w-8" />
      </div>
    </NavbarWrapper>
  );
}

// ----------------------------------------
// Navbar without auth component
// ----------------------------------------
function NavbarWithoutAuth() {
  const path = usePathname();
  const isActive = path === "/job-seeker/jobs";

  return (
    <NavbarWrapper>
      <Button
        size="sm"
        asChild
        variant="ghost"
        className={`${isActive ? "text-brand hover:text-brand" : ""}`}
      >
        <Link href="/job-seeker/jobs?page=1" prefetch={true}>
          Jobs
        </Link>
      </Button>

      <span className="inline-block h-5 border-r-2" />

      <Button asChild size="sm" variant="outline" className="ml-2">
        <Link href="/sign-in">Sign in</Link>
      </Button>
    </NavbarWrapper>
  );
}

// ----------------------------------------
// Navbar without auth component
// ----------------------------------------
function NavbarWithAuth() {
  const { data: session } = useSession();

  return (
    <NavbarWrapper>
      <ProfileDropdownMenu
        image={session?.user.image}
        role={session?.user.role}
      />
    </NavbarWrapper>
  );
}

// ----------------------------------------
// Job seeker navbar component
// ----------------------------------------
function JobSeekerNavbar() {
  const { data: session } = useSession();
  const path = usePathname();

  return (
    <NavbarWrapper>
      <div className="flex items-center gap-2">
        {JOB_SEEKER_NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = path === href.split("?")[0];

          return (
            <Button
              key={href}
              asChild
              size="sm"
              variant="ghost"
              className={`${isActive ? "text-brand hover:text-brand" : ""}`}
            >
              <Link href={href} prefetch={true}>
                {icon}
                {label}
              </Link>
            </Button>
          );
        })}
        <span className="inline-block h-5 border-r-2" />
      </div>

      <ProfileDropdownMenu
        image={session?.user.image}
        role={session?.user.role}
      />
    </NavbarWrapper>
  );
}

// ----------------------------------------
// Employer navbar component
// ----------------------------------------
function EmployerNavbar() {
  const { data: session } = useSession();
  const path = usePathname();

  return (
    <NavbarWrapper>
      <div className="flex items-center gap-2">
        {EMPLOYER_NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = path === href.split("?")[0];

          return (
            <Button
              key={href}
              asChild
              size="sm"
              variant="ghost"
              className={`${isActive ? "text-brand hover:text-brand" : ""}`}
            >
              <Link href={href} prefetch={true}>
                {icon}
                {label}
              </Link>
            </Button>
          );
        })}
        <span className="inline-block h-5 border-r-2" />
      </div>

      <ProfileDropdownMenu
        image={session?.user.image}
        role={session?.user.role}
      />
    </NavbarWrapper>
  );
}

export function SideMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();

  useAutoCloseOnGreaterThanOrEqualToBreakpoint(isOpen, setIsOpen);

  const handleSignOut = async () => {
    setIsOpen(false);

    try {
      await signOut({ callbackUrl: "/" });
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {status === "loading" ? (
        <Skeleton
          className="mr-3 md:hidden rounded-md h-9 w-9"
          aria-label="Open navigation loading"
        />
      ) : (
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="mr-3 md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu />
          </Button>
        </SheetTrigger>
      )}

      <SheetContent side="left" className="w-48 gap-0 p-0!">
        <SheetHeader className="p-0!">
          <SheetTitle className="text-brand text-2xl font-extrabold border-b h-16 p-4">
            Careerly
          </SheetTitle>
        </SheetHeader>

        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col">
            {!session?.user.id && (
              <nav className="flex flex-col gap-1 mt-4">
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  className="justify-start w-fit"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </nav>
            )}

            {session?.user.role === UserRole.JOB_SEEKER && (
              <nav className="flex flex-col gap-2 mt-4">
                {JOB_SEEKER_NAV_ITEMS.map(({ href, label, icon }) => {
                  const isActive = path === href.split("?")[0];

                  return (
                    <Button
                      key={href}
                      asChild
                      size="sm"
                      variant="link"
                      onClick={() => setIsOpen(false)}
                      className={`${isActive ? "text-brand hover:text-brand" : ""} justify-start w-fit`}
                    >
                      <Link href={href} prefetch={true}>
                        {icon}
                        {label}
                      </Link>
                    </Button>
                  );
                })}
              </nav>
            )}

            {session?.user.role === UserRole.EMPLOYER && (
              <nav className="flex flex-col gap-2 mt-4">
                {EMPLOYER_NAV_ITEMS.map(({ href, label, icon }) => {
                  const isActive = path === href.split("?")[0];

                  return (
                    <Button
                      key={href}
                      asChild
                      size="sm"
                      variant="link"
                      onClick={() => setIsOpen(false)}
                      className={`${isActive ? "text-brand hover:text-brand" : ""} justify-start w-fit`}
                    >
                      <Link href={href} prefetch={true}>
                        {icon}
                        {label}
                      </Link>
                    </Button>
                  );
                })}
              </nav>
            )}

            {session?.user.role === UserRole.JOB_SEEKER && (
              <Button
                asChild
                variant="link"
                onClick={() => setIsOpen(false)}
                className={`${path === "/job-seeker/profile" ? "text-brand hover:text-brand" : ""} justify-start w-fit mt-2`}
              >
                <Link href="/job-seeker/profile" prefetch={true}>
                  <User className="h-4 w-4" aria-hidden="true" />
                  Profile
                </Link>
              </Button>
            )}

            {session?.user.role === UserRole.EMPLOYER && (
              <Button
                asChild
                variant="link"
                onClick={() => setIsOpen(false)}
                className={`${path === "/employer/profile" ? "text-brand hover:text-brand" : ""} justify-start w-fit mt-2`}
              >
                <Link href="/employer/profile" prefetch={true}>
                  <User className="h-4 w-4" aria-hidden="true" />
                  Profile
                </Link>
              </Button>
            )}

            {session?.user.id && (
              <Button
                asChild
                variant="link"
                onClick={handleSignOut}
                className="justify-start w-fit mt-1"
              >
                <Link href="/employer/profile" prefetch={true}>
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign out
                </Link>
              </Button>
            )}
          </div>

          <ThemeSwitchMobile />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ----------------------------------------
// Navbar component
// ----------------------------------------
export function Navbar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <NavbarLoading />;
  }

  if (session?.user.role === UserRole.JOB_SEEKER) {
    return <JobSeekerNavbar />;
  }

  if (session?.user.role === UserRole.EMPLOYER) {
    return <EmployerNavbar />;
  }

  if (session?.user.id) {
    return <NavbarWithAuth />;
  }

  return <NavbarWithoutAuth />;
}
