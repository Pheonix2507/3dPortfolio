import type { Metadata } from "next";
import ThreeProjectsSection from "@/sections/ThreeProjectsSection";
import ProjectJourneySection from "@/sections/ProjectJourneySection";

export const metadata: Metadata = {
  title: "3D Projects",
  description:
    "WebGL experiments by Chintan Bhara, built with React Three Fiber and Three.js, including a scroll walkthrough of the Kubernetes Cost Analyzer.",
};

export default function ThreeProjectsPage() {
  return (
    <>
      <ThreeProjectsSection />
      {/* Full-bleed and pinned, so it sits outside the section's max-width. */}
      <ProjectJourneySection />
    </>
  );
}
