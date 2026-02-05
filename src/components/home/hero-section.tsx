// ----------------------------------------
// Imports
// ----------------------------------------
// components (local)
import { AnimatedUnderline } from "@/components/home/animated-underline";
import { StartExploringButton } from "@/components/home/start-exploring-button";

// ----------------------------------------
// Hero section component
// ----------------------------------------
export function HeroSection() {
  return (
    <div className="min-h-screen w-full max-w-custom mx-auto px-6 flex flex-col items-center justify-center">
      {/* Main Headline */}
      <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-center">
        Unlock Your <span className="text-brand">Career</span> Potential
      </h1>

      {/* Subheadline */}
      <p className="text-xl sm:text-2xl md:text-4xl font-extrabold text-center max-w-3xl mx-auto mt-8">
        Discover <span className="text-brand">Dream Jobs</span> That Inspire You
      </p>

      {/* Description */}
      <p className="text-lg font-medium text-center max-w-2xl mx-auto mt-8 text-slate-600 dark:text-muted-foreground">
        Discover jobs effortlessly with intelligent filtering, instant search
        results, and an elegant, modern UI designed for your success.
      </p>

      <AnimatedUnderline />

      {/* CTA Section */}
      <div className="mt-10 sm:mt-12">
        <StartExploringButton />
      </div>
    </div>
  );
}
