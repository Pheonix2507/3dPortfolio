import type { Metadata } from "next";
import ThreeProjectsSection from "@/sections/ThreeProjectsSection";

export const metadata: Metadata = {
  title: "3D Projects",
  description:
    "WebGL experiments by Chintan Bhara, built with React Three Fiber and Three.js.",
};

export default function ThreeProjectsPage() {
  return <ThreeProjectsSection />;
}
