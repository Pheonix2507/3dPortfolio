"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import useBackgroundFader from "@/hooks/useBackgroundFader";

interface ParallaxRevealProps {
  text: string; // the full line/paragraph
  focusIndex?: number; // which character to zoom (0-based). default 0
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
    offset: ["start end", "end start"],
  });

  // smooth progress for nicer motion
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    mass: 0.4,
  });

  // character zoom: from 1 -> 6 as user scrolls 0..revealThreshold
  const charScale = useTransform(smooth, [0, revealThreshold], [1, 2]);
  // small 3D tilt on char
  const charRotate = useTransform(smooth, [0, revealThreshold], [0, -12]);

  // the remaining content fades / slides in once progress > revealThreshold
  const revealProgress = useTransform(smooth, [revealThreshold, 1], [0, 1]);

  const restOpacity = useTransform(revealProgress, [0, 0.3, 1], [0, 0.9, 1]);
  const restY = useTransform(revealProgress, [0, 1], ["30px", "0px"]);
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
    <section
      ref={ref}
      className="relative mt-10 flex min-h-fit flex-col justify-center"
    >
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex flex-col items-start gap-6">
          {/* Line with the hero char that zooms */}
          <div className="flex items-end text-[clamp(18px,4vw,44px)] leading-tight font-extrabold text-white md:text-[clamp(26px,5vw,72px)]">
            {/* before text (static small) */}
            <span className="mr-2 text-lg opacity-80 md:text-2xl">
              {before}
            </span>

            {/* focused character (motion) */}
            <motion.span
              style={{
                scale: charScale,
                rotate: charRotate,
                transformOrigin: "center center",
                zIndex: 40,
                display: "inline-block",
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
                transformOrigin: "left center",
              }}
              className="ml-3 text-lg text-white/90 md:text-2xl"
            >
              {after}
            </motion.span>
          </div>

          {/* A subline or content that appears after the "transcend" */}
          <motion.div
            style={{ opacity: restOpacity, y: restY }}
            className="mt-2 max-w-2xl text-white/70"
          >
            <p>
              As you dive deeper the character zooms forward — revealing the
              story beneath. This area can contain the next parts of the page
              (projects, features, or a call-to-action).
            </p>
          </motion.div>

          {/* CTA / revealed block */}
          <motion.div
            style={{
              opacity: restOpacity,
              y: restY,
              scale: restScale,
            }}
            className="mt-6 w-full"
          >
            {/* Replace this with whatever you want to reveal */}
            <div className="rounded-xl border border-white/6 bg-linear-to-r from-white/3 to-white/2 p-4">
              <p className="text-sm text-white/80">
                Revealed content area — you can render project links, previews,
                or a short gallery here.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
