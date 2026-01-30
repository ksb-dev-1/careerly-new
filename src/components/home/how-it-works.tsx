"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
// 3rd party
import { motion } from "framer-motion";
import { BriefcaseBusiness, User } from "lucide-react";

// ----------------------------------------
// Constants
// ----------------------------------------
const jobSeekerSteps = [
  {
    number: "1",
    title: "Create Job Seeker Account",
    description:
      "Sign up quickly with your professional email address or using OAuth",
  },
  {
    number: "2",
    title: "Upload Your Resume",
    description: "Add your resume and let employers discover your skills",
  },
  {
    number: "3",
    title: "Apply & Track",
    description: "Submit applications and monitor your progress easily",
  },
];

const employerSteps = [
  {
    number: "1",
    title: "Create Employer Account",
    description:
      "Sign up quickly with your professional email address or using OAuth",
  },
  {
    number: "2",
    title: "Post Job Openings",
    description: "Create detailed listings that attract quality candidates",
  },
  {
    number: "3",
    title: "Manage Candidates",
    description: "Review applications and connect with potential hires",
  },
];

// ----------------------------------------
// How it works component
// ----------------------------------------
export function HowItWorks() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 overflow--x-hidden">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-16 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          How It <span className="text-brand">Works</span>
        </h2>
        <p className="md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Whether you're seeking opportunities or talent, our platform makes the
          process seamless, efficient, and effective.
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Job Seekers Card */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative border rounded-xl bg-card shadow-sm"
        >
          <div className="p-4 sm:p-6">
            {/* Card Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative bg-brand/20 h-12 w-12 rounded-full">
                <User className="text-brand absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Job Seekers</h3>
                <p className="text-muted-foreground">
                  Find your dream role in 3 simple steps
                </p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-6 ml-4">
              {jobSeekerSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="shrink-0">
                    <span className="text-brand font-bold">{step.number}</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{step.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Employers Card */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative border rounded-xl bg-card shadow-sm"
        >
          <div className="p-4 sm:p-6">
            {/* Card Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative bg-brand/20 h-12 w-12 rounded-full">
                <BriefcaseBusiness className="text-brand absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Employers</h3>
                <p className="text-muted-foreground">
                  Find perfect candidates effortlessly
                </p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-6 ml-4">
              {employerSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-full transition-all duration-200"
                >
                  <div className="shrink-0">
                    <span className="text-brand font-bold">{step.number}</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{step.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
