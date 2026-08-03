"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/** Maximum rotation at the extreme corners, in degrees. */
const MAX_TILT = 9;

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Tilts towards the pointer using transforms only.
 *
 * The effect this replaced used `clip-path` to fake a 3D turn, which cropped
 * the card's right edge and clipped its offset shadow out of existence. Rotation
 * leaves the box intact, so hard borders and brutalist shadows survive.
 *
 * Children get a `group` ancestor, so they can react with `group-hover:`.
 */
export default function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Pointer position within the card, normalised to 0..1.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const springs = { stiffness: 220, damping: 24, mass: 0.6 };
  const smoothX = useSpring(px, springs);
  const smoothY = useSpring(py, springs);

  const rotateY = useTransform(smoothX, [0, 1], [-MAX_TILT, MAX_TILT]);
  const rotateX = useTransform(smoothY, [0, 1], [MAX_TILT, -MAX_TILT]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds || bounds.width === 0 || bounds.height === 0) return;

    px.set((event.clientX - bounds.left) / bounds.width);
    py.set((event.clientY - bounds.top) / bounds.height);
  };

  const recentre = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div
      ref={ref}
      onPointerMove={reduceMotion ? undefined : handlePointerMove}
      onPointerLeave={reduceMotion ? undefined : recentre}
      className={cn("[perspective:900px]", className)}
    >
      <motion.div
        style={
          reduceMotion
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
        className="group h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
