// ----------------------------------------
// Imports
// ----------------------------------------
// components (local)
import { HeroSection } from "@/components/home/hero-section";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { Faq } from "@/components/home/faq";

// ----------------------------------------
// Root page component
// ----------------------------------------
export default function HomePage() {
  return (
    <>
      <section className="relative min-h-screen mt-16 overflow-hidden border-b">
        <HeroSection />
      </section>
      <section className="py-16 border-b">
        <Features />
      </section>
      <section className="py-16 border-b">
        <HowItWorks />
      </section>
      <section className="py-16">
        <Faq />
      </section>
    </>
  );
}
