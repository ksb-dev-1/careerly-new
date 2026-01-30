"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
// components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ----------------------------------------
// Types
// ----------------------------------------
interface FAQ {
  question: string;
  answer: string | React.ReactNode;
}

// ----------------------------------------
// FAQ Data
// ----------------------------------------
const faqs: FAQ[] = [
  {
    question: "What is the purpose of this portal?",
    answer:
      "This job portal connects job seekers with employers, allowing users to discover job opportunities and apply for them easily.",
  },
  {
    question: "How can I create an account?",
    answer: (
      <>
        Sign in with <span className="text-brand">Google</span> or{" "}
        <span className="text-brand">GitHub</span>, or enter your email to
        receive a confirmation link.
      </>
    ),
  },
  {
    question: "Is there a fee to use this job portal?",
    answer: "As of now, it’s completely free to use.",
  },
  {
    question: "Can I save my favorite jobs?",
    answer:
      "Yes, you can save your favorite jobs and also view your applied jobs.",
  },
  {
    question: "Can I apply for multiple jobs per day?",
    answer:
      "Yes, currently you can apply for multiple jobs per day. This may change once premium plans are introduced.",
  },
];

// ----------------------------------------
// Helper Components
// ----------------------------------------
function Header() {
  return (
    <div className="text-center mb-8 sm:mb-16 max-w-3xl mx-auto">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
        Frequently Asked <span className="text-brand">Questions</span>
      </h2>
      <p className="md:text-lg text-muted-foreground max-w-2xl mx-auto">
        Find answers to common questions about using our platform for job
        searching and hiring.
      </p>
    </div>
  );
}

function AccordionSection() {
  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-base">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// ----------------------------------------
// Faq component
// ----------------------------------------
export function Faq() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6">
      {/* Header */}
      <Header />

      {/* Accordion */}
      <AccordionSection />
    </div>
  );
}
