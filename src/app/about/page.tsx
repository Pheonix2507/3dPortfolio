import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import AboutSection from "@/sections/AboutSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Chintan Bhara, full stack developer working across React, Next.js, Go and Kubernetes. Where to find me and what I build.",
};

export default function AboutPage() {
  return (
    <main className="text-ink min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pt-32 lg:px-8 lg:pt-40">
        <SectionHeading
          index="03"
          eyebrow="Profile"
          title="About"
          meta="Who is behind the cubes"
        />
      </div>

      <div className="mt-14">
        <AboutSection />
      </div>
    </main>
  );
}
