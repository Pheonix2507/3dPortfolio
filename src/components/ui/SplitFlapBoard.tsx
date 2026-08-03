"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitFlapBoardProps {
  /** Cycled in order. Padded to a common width so the board never resizes. */
  phrases: readonly string[];
  /** Milliseconds each phrase is held. */
  interval?: number;
  className?: string;
}

/**
 * A mechanical status board. Each cell flips on a rotateX transform, staggered
 * across the row so the change cascades the way a real departure board does.
 *
 * Under prefers-reduced-motion it settles on the first phrase and stops cycling
 * entirely, since auto-updating text is the part that causes trouble, not just
 * the animation.
 */
export default function SplitFlapBoard({
  phrases,
  interval = 3200,
  className,
}: SplitFlapBoardProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  const width = Math.max(...phrases.map((phrase) => phrase.length));

  useEffect(() => {
    if (reduceMotion || phrases.length < 2) return;

    const timer = setInterval(
      () => setIndex((current) => (current + 1) % phrases.length),
      interval,
    );

    return () => clearInterval(timer);
  }, [interval, phrases.length, reduceMotion]);

  const phrase = (phrases[index] ?? "").padEnd(width, " ");
  const cells = Array.from(phrase);

  return (
    <div className={cn("skeuo-metal brut-edge border-black/80 p-4", className)}>
      <p className="text-ink/40 mb-3 font-mono text-[10px] tracking-[0.3em] uppercase">
        Status board
      </p>

      {/* The readable version. The cells below are decorative. */}
      <span className="sr-only">Current status: {phrases[index]}</span>

      <div aria-hidden="true" className="flex flex-wrap gap-1">
        {cells.map((char, position) => (
          <div
            key={position}
            className="skeuo-inset brut-edge-thin relative h-9 w-6 border-black/85"
            style={{ perspective: "120px" }}
          >
            <motion.span
              // Re-keying on the character replays the enter animation, which is
              // what produces the flip.
              key={`${index}-${char}`}
              initial={reduceMotion ? undefined : { rotateX: -90, opacity: 0 }}
              animate={reduceMotion ? undefined : { rotateX: 0, opacity: 1 }}
              transition={{
                duration: 0.26,
                delay: position * 0.035,
                ease: "easeOut",
              }}
              className="text-hazard absolute inset-0 flex items-center justify-center font-mono text-sm"
              style={{ transformOrigin: "center top" }}
            >
              {char === " " ? " " : char}
            </motion.span>

            {/* The seam every split-flap cell has across its middle. */}
            <span className="absolute top-1/2 left-0 h-px w-full bg-black/70" />
          </div>
        ))}
      </div>
    </div>
  );
}
