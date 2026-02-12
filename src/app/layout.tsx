import { Suspense } from "react";
import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";

// providers
import { Providers } from "@/providers/Providers";

// components
import { NavigationProgress } from "@/components/NavigationProgress";

// 3rd party
import { SpeedInsights } from "@vercel/speed-insights/next";

const fontFamily = Mulish({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home - Careerly",
  description: "A go to platform for job seekers and employers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontFamily.className} antialiased`}>
        <Suspense>
          <NavigationProgress />
          <Providers>
            <main>{children}</main>
          </Providers>
          <SpeedInsights />
        </Suspense>
      </body>
    </html>
  );
}
