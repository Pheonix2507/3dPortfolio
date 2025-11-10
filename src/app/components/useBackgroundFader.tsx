'use client';

import { useEffect } from 'react';
import { useScroll, useTransform } from 'framer-motion';

/**
 * useBackgroundFader:
 * - targetRef: ref of section to observe (React ref to a DOM element)
 * - options.start / options.end: local progress range (0..1) when fading is active
 *
 * This hook sets `--bg-3d-opacity` on :root; your Scroll3DBackground should pick this up
 * (via CSS `opacity: var(--bg-3d-opacity, 1)` or style reading).
 */
export default function useBackgroundFader(
  targetRef: React.RefObject<HTMLElement | null>,
  options: { start?: number; end?: number } = {}
) {
  const start = options.start ?? 0;
  const end = options.end ?? 1;

  // create a scroll tracker tied to the provided ref (hook must be called at top level)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  // map range [0..1] -> [1 .. 0] (fade out as progress grows)
  const mapped = useTransform(scrollYProgress, [start, end], [1, 0]);

  // subscribe and set CSS var on root
  useEffect(() => {
    // mapped is a MotionValue; subscribe to changes
    interface MotionValueLike {
      on(event: 'change', callback: (v: number) => void): (() => void) | void;
    }

    const mv = mapped as unknown as MotionValueLike;
    const unsubscribe = mv.on('change', (v: number) => {
      const clamped = Math.max(0, Math.min(1, v));
      document.documentElement.style.setProperty('--bg-3d-opacity', String(clamped));
    });

    return () => {
      try {
        if (typeof unsubscribe === 'function') unsubscribe();
      } catch {
        // noop
      }
    };
  }, [mapped]);
}
