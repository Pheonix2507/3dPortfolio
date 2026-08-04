"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion, useScroll } from "framer-motion";
import SpineColumn from "@/components/three/SpineColumn";
import useBackgroundFader from "@/hooks/useBackgroundFader";

/**
 * The transition into the playground: a spine of labelled blocks that throws its
 * own vertebrae off as you scroll past, leaving the bare core.
 *
 * The section is tall and the scene inside is sticky, so the disassembly is tied
 * to scroll position rather than flying past. `offset` is start/start to end/end
 * so progress runs 0 to 1 across exactly the pinned travel.
 */
export default function PlaygroundIntro() {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Fade the 400-mesh backdrop down here: it competes with the spine, and it is
  // the most expensive thing on screen while this section is pinned.
  useBackgroundFader(ref, { start: 0.05, end: 0.35 });

  return (
    <section ref={ref} className="relative h-[240vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Scene */}
        {/*
          Camera sits square on the Z axis so its aim is unambiguous. The
          assembly tips itself toward the viewer instead, which keeps framing a
          property of the scene rather than of the camera's default orientation.
        */}
        {/*
          Further back and a narrower field of view than a close 40°, which was
          skewing the blocks into long slabs and pushing the column off frame.
        */}
        <Canvas
          camera={{ position: [0, 0, 10], fov: 38 }}
          dpr={[1, 1.5]}
          className="absolute inset-0"
        >
          <SpineColumn progress={scrollYProgress} reduceMotion={reduceMotion} />
        </Canvas>

        {/*
          Chrome sits above the scene at z-20. The block labels are capped at
          z-index 10 by the scene, so they pass behind this rather than over it.
          Text is held to its own column so the wheel, which is offset right, is
          not competing for the same space.
        */}
        <div className="pointer-events-none absolute inset-0 z-20 mx-auto flex max-w-7xl flex-col justify-between px-4 py-24 lg:px-8">
          <header className="max-w-md">
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase">
              <span className="bg-hazard text-void px-1.5">05</span>
              <span className="text-ink/40">/</span>
              <span className="text-ink/60">Structure</span>
            </div>

            <h2 className="font-display mt-3 text-[clamp(1.75rem,4.5vw,3.25rem)] leading-[0.85] tracking-tighter uppercase">
              Welcome to the
              <br />
              <span className="text-hazard">playground</span>
            </h2>
          </header>

          <footer className="flex flex-wrap items-end justify-between gap-6">
            <p className="text-ink/50 max-w-sm font-mono text-xs leading-relaxed">
              Scroll to strip the column back. Each block detaches in turn and
              takes up an orbit, so the spine resolves into a turning wheel
              rather than deleting itself.
            </p>
            <span className="text-ink/30 font-mono text-[10px] tracking-[0.3em] uppercase">
              Spine // 7 vertebrae → orbit
            </span>
          </footer>
        </div>
      </div>
    </section>
  );
}
