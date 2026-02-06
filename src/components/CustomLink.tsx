"use client";

import Link, { LinkProps } from "next/link";
import NProgress from "nprogress";
import { MouseEvent, ReactNode } from "react";

interface CustomLinkProps extends LinkProps {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
}

export function CustomLink({
  children,
  isActive = false,
  onClick,
  ...props
}: CustomLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Don't trigger NProgress if link is active
    if (isActive) {
      e.preventDefault();
      onClick?.(e);
      return;
    }

    // Check if this is a regular navigation (not modified click)
    const isRegularNavigation =
      !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0;

    // Check if it's an external link
    const href = props.href.toString();
    const isExternal =
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    // Check if it's an anchor link
    const isAnchorLink = href.startsWith("#");

    // Only trigger progress for internal navigation that's not an anchor link
    if (isRegularNavigation && !isExternal && !isAnchorLink) {
      NProgress.start();

      // Set a timeout as fallback in case navigation doesn't complete
      setTimeout(() => {
        NProgress.done();
      }, 5000); // 5 second timeout
    }

    // Call original onClick if provided
    onClick?.(e);
  };

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
