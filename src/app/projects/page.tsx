import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectsSection from "@/sections/ProjectsSection";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected freelance and event work by Chintan Bhara, built with React, Next.js and Tailwind CSS.",
};

export default function ProjectsPage() {
  return (
    <main className="text-ink min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pt-32 lg:px-8 lg:pt-40">
        <SectionHeading
          index="02"
          eyebrow="Work"
          title="Projects"
          meta="Selected freelance and event builds"
        />
      </div>

      <div className="mt-14">
        <ProjectsSection />
      </div>
    </main>
  );
}
