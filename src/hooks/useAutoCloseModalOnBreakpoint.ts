import { useEffect } from "react";

export function useAutoCloseOnGreaterThanOrEqualToBreakpoint(
  open: boolean,
  setOpen: (open: boolean) => void,
  breakpoint: number = 768,
) {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= breakpoint && open) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open, setOpen, breakpoint]);
}
