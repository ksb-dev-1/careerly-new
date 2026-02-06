"use client";

import { useRouter as useNextRouter } from "next/navigation";
import NProgress from "nprogress";

export function useCustomRouter() {
  const router = useNextRouter();

  // Wrap all navigation methods with progress
  const push = (href: string) => {
    NProgress.start();
    return router.push(href);
  };

  const replace = (href: string) => {
    NProgress.start();
    return router.replace(href);
  };

  const back = () => {
    NProgress.start();
    return router.back();
  };

  const forward = () => {
    NProgress.start();
    return router.forward();
  };

  const refresh = () => {
    NProgress.start();
    return router.refresh();
  };

  return {
    ...router,
    push,
    replace,
    back,
    forward,
    refresh,
  };
}
