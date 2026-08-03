import type { Metadata } from "next";
import AboutSection from "@/sections/AboutSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Chintan Bhara — frontend and 3D developer. Where to find me and what I build.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 text-white">
      <AboutSection />
    </main>
  );
}
