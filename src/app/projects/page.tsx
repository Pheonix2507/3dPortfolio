import type { Metadata } from "next";
import ProjectsSection from "@/sections/ProjectsSection";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected freelance and event work by Chintan Bhara, built with React, Next.js and Tailwind CSS.",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen text-white">
      <h1 className="pt-24 text-center text-4xl font-bold text-cyan-300">
        My Projects
      </h1>
      <ProjectsSection />
    </main>
  );
}
