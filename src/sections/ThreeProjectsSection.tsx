"use client";

import dynamic from "next/dynamic";

// WebGL scenes cannot render on the server, so this only loads in the browser.
const LetterMorphScene = dynamic(
  () => import("@/components/three/LetterMorphScene"),
  { ssr: false },
);

export default function ThreeProjectsSection() {
  return (
    <div className="min-h-screen px-6 pt-24 text-center text-white">
      <h1 className="mb-10 text-4xl font-bold">My 3D Projects</h1>

      <section>
        <h2 className="block p-5 text-white">Camera Scenematic</h2>
        <div className="mx-auto h-[50vh] w-[90vw] rounded-xl border-4 border-white lg:h-[50vh] lg:w-[50vw]">
          <LetterMorphScene />
        </div>
        <p className="mt-4 block p-5 text-white">
          Click the bar under the particles to morph them into my name.
        </p>
      </section>

      <hr className="my-10 border-white/10" />

      <section>
        <h2 className="block p-5 pt-10 text-white">Project 2</h2>
        <div className="mx-auto flex h-[50vh] w-[90vw] items-center justify-center rounded-xl border-4 border-dashed border-white/30 lg:h-[50vh] lg:w-[50vw]">
          <p className="text-white/50">Coming soon.</p>
        </div>
      </section>
    </div>
  );
}
