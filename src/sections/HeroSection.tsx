"use client";

import dynamic from "next/dynamic";

// WebGL scenes cannot render on the server, so this only loads in the browser.
const SceneCanvas = dynamic(() => import("@/components/three/SceneCanvas"), {
  ssr: false,
});

export default function HeroSection() {
  return (
    <>
      <h1 className="block p-5 text-2xl font-bold">
        Welcome to My Interactive 3D Page
      </h1>

      <div className="mx-auto h-[50vh] w-[90vw] rounded-xl border-5 border-white outline-offset-4 lg:h-[70vh] lg:w-[70vw]">
        <SceneCanvas />
      </div>

      <p className="mt-4 block pt-5">
        Click on the cubes to explore more! Use <i>Ctrl + scroll</i> or
        Scrollpad to zoom out!!
      </p>
    </>
  );
}
