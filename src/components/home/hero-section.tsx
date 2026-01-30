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
    <div className="absolute z-20 inset-0 flex flex-col items-center justify-center px-6">
      {/* Main Headline */}
      <h1 className="font-extrabold text-4xl sm:text-5xl md:text-7xl tracking-tight text-center">
        Unlock Your <span className="text-brand">Career</span> Potential
      </h1>

      {/* Subheadline */}
      <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center max-w-3xl mx-auto mt-6">
        Discover <span className="text-brand">Dream Jobs</span> That Inspire You
      </p>

      {/* Description */}
      <p className="text-lg text-center max-w-2xl mx-auto mt-8 text-muted-foreground">
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
