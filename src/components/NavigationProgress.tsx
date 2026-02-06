"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
// import "nprogress/nprogress.css";

// Optional: CSS customization
// import "./nprogress-custom.css";

// Track if NProgress is currently running
let progressStarted = false;

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
  speed: 300,
  minimum: 0.08,
});

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();

    // Complete progress when route changes
    if (progressStarted) {
      NProgress.done();
      progressStarted = false;
    }

    // Handle browser back/forward buttons
    const handlePopState = () => {
      NProgress.start();
      progressStarted = true;
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      // Ensure progress is stopped on unmount
      NProgress.done();
      progressStarted = false;
    };
  }, [pathname, searchParams]);

  return null;
}
