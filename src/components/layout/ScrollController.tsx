"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "@studio-freight/lenis";

/**
 * ScrollController: Sets up smooth scrolling via Lenis
 * and syncs Framer Motion scroll-based animations smoothly.
 */
export default function ScrollController({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.08,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
