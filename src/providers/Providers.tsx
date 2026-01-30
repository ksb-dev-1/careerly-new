"use client";

import { SessionProvider } from "@/providers/SessionProvider";
import { TanstackProvider } from "@/providers/TanstackProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TanstackProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </TanstackProvider>
      <Toaster position="top-center" />
    </SessionProvider>
  );
}
