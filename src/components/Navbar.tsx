"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// generated
import { UserRole } from "@/generated/prisma/browser";

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

// 3rd party
import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";

// ----------------------------------------
// Navigation items
// ----------------------------------------
type NavItem = {
  href: string;
  label: string;
};

const JOB_SEEKER_NAV_ITEMS: NavItem[] = [
  {
    href: "/job-seeker/jobs?page=1",
    label: "Jobs",
  },
  {
    href: "/job-seeker/bookmarks",
    label: "Bookmarks",
  },
  {
    href: "/job-seeker/applications",
    label: "Applications",
  },
];

const EMPLOYER_NAV_ITEMS: NavItem[] = [
  {
    href: "/employer/jobs?page=1",
    label: "Posted Jobs",
  },
];

// ----------------------------------------
// Navbar wrapper component
// ----------------------------------------
function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  return (
    <header className="fixed z-30 top-0 left-0 right-0 w-full border-b h-16 flex items-center justify-center bg-background">
      <nav className="w-full flex items-center justify-between px-4">
        <div className="flex items-center">
          {session?.user.role && (
            <SideMenu
              links={
                session?.user.role === UserRole.JOB_SEEKER
                  ? JOB_SEEKER_NAV_ITEMS
                  : EMPLOYER_NAV_ITEMS
              }
            />
          )}
          <Link
            href="/"
            className="font-extrabold text-2xl text-brand hover:text-brand-hover transition-colors"
          >
            Careerly
          </Link>
        </div>

        <div className="flex items-center gap-2">
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

        <Skeleton className="skeleton h-8 w-8 rounded-full" />
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
      <div className="hidden md:flex items-center gap-2">
        {JOB_SEEKER_NAV_ITEMS.map(({ href, label }) => {
          const isActive = path === href.split("?")[0];

          return (
            <Button
              key={href}
              size="sm"
              asChild
              variant="ghost"
              className={`${isActive ? "text-brand hover:text-brand" : ""}`}
            >
              <Link href={href} prefetch={true}>
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
      <div className="hidden md:flex items-center gap-2">
        {EMPLOYER_NAV_ITEMS.map(({ href, label }) => {
          const isActive = path === href.split("?")[0];

          return (
            <Button
              key={href}
              size="sm"
              asChild
              variant="ghost"
              className={`${isActive ? "text-brand hover:text-brand" : ""}`}
            >
              <Link href={href} prefetch={true}>
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

export function SideMenu({ links }: { links: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="mr-3 md:hidden rounded-full"
          aria-label="Open navigation menu"
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-48 gap-0 p-0!">
        <SheetHeader className="p-0!">
          <SheetTitle className="text-brand text-2xl font-extrabold border-b h-16 p-4">
            Careerly
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 mx-4 mt-4">
          {links.map(({ href, label }) => (
            <Button
              key={href}
              asChild
              variant="ghost"
              className="justify-start"
              onClick={() => setIsOpen(false)}
            >
              <Link href={href} prefetch={true}>
                {label}
              </Link>
            </Button>
          ))}
        </nav>
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
