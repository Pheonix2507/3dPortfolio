'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import useBackgroundFader from './useBackgroundFader';

interface ParallaxRevealProps {
  text: string;           // the full line/paragraph
  focusIndex?: number;    // which character to zoom (0-based). default 0
  revealThreshold?: number; // progress when reveal starts (0..1)
}

export default function ParallaxReveal({
  text,
  focusIndex = 0,
  revealThreshold = 0.15,
}: ParallaxRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  // hook to fade 3D background while this section scrolls
  useBackgroundFader(ref, { start: 0.15, end: 0.5 });

  // framer scroll tied to this section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // smooth progress for nicer motion
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 30,mass: 0.4 });

  // character zoom: from 1 -> 6 as user scrolls 0..revealThreshold
  const charScale = useTransform(smooth, [0, revealThreshold], [1, 2]);
  // small 3D tilt on char
  const charRotate = useTransform(smooth, [0, revealThreshold], [0, -12]);

  // the remaining content fades / slides in once progress > revealThreshold
  const revealProgress = useTransform(
    smooth,
    [revealThreshold, 1],
    [0, 1]
  );

  const restOpacity = useTransform(revealProgress, [0, 0.3, 1], [0, 0.9, 1]);
  const restY = useTransform(revealProgress, [0, 1], ['30px', '0px']);
  const restScale = useTransform(revealProgress, [0, 0.8], [0.9, 1]);

  // split text into focused char + rest
  const focusChar = text.charAt(focusIndex) || text[0];
  const before = text.slice(0, focusIndex);
  const after = text.slice(focusIndex + 1);

  // small accessibility: if focus index is out of range, fallback to first char
  useEffect(() => {
    if (focusIndex < 0 || focusIndex >= text.length) {
      // noop - handled by slicing fallback
    }
  }, [focusIndex, text.length]);

  return (
    <section ref={ref}  className="relative min-h-fit flex flex-col justify-center mt-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-start gap-6">
          {/* Line with the hero char that zooms */}
          <div className="flex items-end items-stretch text-[clamp(18px,4vw,44px)] md:text-[clamp(26px,5vw,72px)] font-extrabold leading-tight text-white">
            {/* before text (static small) */}
            <span className="opacity-80 mr-2 text-lg md:text-2xl">{before}</span>

            {/* focused character (motion) */}
            <motion.span
              style={{
                scale: charScale,
                rotate: charRotate,
                transformOrigin: 'center center',
                zIndex: 40,
                display: 'inline-block',
              }}
              className="text-cyan-300 drop-shadow-[0_6px_18px_rgba(0,255,255,0.08)]"
              aria-hidden="true"
            >
              {focusChar}
            </motion.span>

            {/* after text (will reveal) */}
            <motion.span
              style={{
                opacity: restOpacity,
                y: restY,
                scale: restScale,
                transformOrigin: 'left center',
              }}
              className="ml-3 text-white/90 text-lg md:text-2xl"
            >
              {after}
            </motion.span>
          </div>

          {/* A subline or content that appears after the "transcend" */}
          <motion.div
            style={{ opacity: restOpacity, y: restY }}
            className="mt-2 text-white/70 max-w-2xl"
          >
            <p>
              As you dive deeper the character zooms forward — revealing the story
              beneath. This area can contain the next parts of the page (projects,
              features, or a call-to-action).
            </p>
          </motion.div>

          {/* CTA / revealed block */}
          <motion.div
            style={{
              opacity: restOpacity,
              y: restY,
              scale: restScale,
            }}
            className="w-full mt-6"
          >
            {/* Replace this with whatever you want to reveal */}
            <div className="rounded-xl p-4 bg-gradient-to-r from-white/3 to-white/2 border border-white/6">
              <p className="text-sm text-white/80">
                Revealed content area — you can render project links, previews, or a
                short gallery here.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
