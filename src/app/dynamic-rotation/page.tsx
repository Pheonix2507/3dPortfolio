import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import DynamicRotationSection from "@/sections/DynamicRotationSection";

export const metadata: Metadata = {
  title: "Dynamic Rotation",
  description:
    "An interactive orbit demo: drag the radius and watch the frame loop respond.",
};

export default function DynamicRotationPage() {
  return (
    <main className="text-ink min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pt-32 lg:px-8 lg:pt-40">
        <SectionHeading
          index="04"
          eyebrow="Lab"
          title="Playground"
          meta="Experiments that are not projects yet"
        />
      </div>

      <div className="mt-14">
        <DynamicRotationSection />
      </div>
    </main>
  );
}
