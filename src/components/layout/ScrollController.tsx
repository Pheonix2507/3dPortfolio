"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

/**
 * Sets up Lenis smooth scrolling for the whole document.
 *
 * `autoRaf` lets Lenis own its own animation frame loop, which `destroy()` then
 * tears down. The previous hand-rolled loop re-scheduled itself on every frame
 * but was never cancelled on cleanup, so it kept driving a destroyed Lenis
 * instance for the lifetime of the page.
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
      autoRaf: true,
    });

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
