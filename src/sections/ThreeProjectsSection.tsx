"use client";

import dynamic from "next/dynamic";
import BrutalBox from "@/components/ui/BrutalBox";
import SectionHeading from "@/components/ui/SectionHeading";

// WebGL scenes cannot render on the server, so this only loads in the browser.
const LetterMorphScene = dynamic(
  () => import("@/components/three/LetterMorphScene"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-void flex h-full w-full items-center justify-center">
        <span className="text-hazard/70 font-mono text-[11px] tracking-[0.3em] uppercase">
          Loading particles…
        </span>
      </div>
    ),
  },
);

export default function ThreeProjectsSection() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-8 lg:px-8 lg:pt-40">
      <SectionHeading
        index="05"
        eyebrow="WebGL"
        title="3D Projects"
        meta="Scene experiments in React Three Fiber"
      />

      <section className="mt-14">
        <div className="relative">
          <span className="bg-void text-hazard absolute -top-3 left-4 z-10 px-2 font-mono text-[10px] tracking-[0.3em] uppercase">
            Scene_02 // Letter_Morph
          </span>

          <BrutalBox
            accent="hazard"
            surface="void"
            className="h-[55vh] w-full overflow-hidden lg:h-[65vh]"
          >
            <LetterMorphScene />
          </BrutalBox>
        </div>

        <div className="text-ink/45 mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.15em] uppercase">
          <span className="text-alert">◆</span>
          <span>Press the button to morph the cloud into my name</span>
          <span className="text-ink/20">|</span>
          <span>Drag to orbit</span>
        </div>
      </section>
    </div>
  );
}
