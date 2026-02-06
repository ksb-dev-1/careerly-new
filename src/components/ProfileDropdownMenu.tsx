"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// prisma
import { UserRole } from "@/generated/prisma/browser";

// components
import { CustomLink } from "@/components/CustomLink";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 3rd party
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

// ----------------------------------------
// Types
// ----------------------------------------
interface ProfileDropdownProps {
  image?: string | null;
  role?: UserRole;
}

// ----------------------------------------
// Constants
// ----------------------------------------
const ROLE_ROUTES: Record<UserRole, string> = {
  [UserRole.JOB_SEEKER]: "/job-seeker/profile",
  [UserRole.EMPLOYER]: "/employer/profile",
} as const;

const AVATAR_SIZE = 32;

// ----------------------------------------
// Profile dropdown component
// ----------------------------------------
export function ProfileDropdownMenu({ image, role }: ProfileDropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const path = usePathname();

  const handleSignOut = async () => {
    setOpen(false);
    setIsSigningOut(true);

    try {
      await signOut({ callbackUrl: "/" });
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const profileRoute = role ? ROLE_ROUTES[role] : null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full ml-2"
        aria-label="Open user menu"
      >
        <Avatar>
          {image ? (
            <Image
              src={image}
              alt="Profile picture"
              height={AVATAR_SIZE}
              width={AVATAR_SIZE}
              className="border rounded-full object-cover"
            />
          ) : (
            <AvatarFallback>
              <User size={16} aria-hidden="true" />
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="font-bold">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {profileRoute && (
          <DropdownMenuItem asChild onClick={() => setOpen(false)}>
            <CustomLink
              href={profileRoute}
              className="cursor-pointer"
              prefetch={true}
              isActive={path === profileRoute}
            >
              <User className="mr-2 h-4 w-4" aria-hidden="true" />
              Profile
            </CustomLink>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          disabled={isSigningOut}
          onClick={handleSignOut}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          {isSigningOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
