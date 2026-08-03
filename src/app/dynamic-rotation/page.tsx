import type { Metadata } from "next";
import DynamicRotationSection from "@/sections/DynamicRotationSection";

export const metadata: Metadata = {
  title: "Dynamic Rotation",
  description:
    "An interactive orbit demo: drag the radius and watch the frame loop respond.",
};

export default function DynamicRotationPage() {
  return (
    <main className="min-h-screen pt-20 text-white">
      <DynamicRotationSection />
    </main>
  );
}
