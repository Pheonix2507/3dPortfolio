"use client";

import { useRef, type ComponentProps, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type LazyCanvasProps = Omit<ComponentProps<typeof Canvas>, "frameloop"> & {
  children: ReactNode;
  className?: string;
};

/**
 * A Canvas that only renders while it is on screen.
 *
 * Without this, every canvas on the page keeps its own animation frame loop
 * running forever, so scrolling to the footer still costs four scenes' worth of
 * GPU work per frame. Switching frameloop to "never" stops the loop and leaves
 * the last drawn frame in place, so scrolling back reveals no gap.
 *
 * The margin starts it slightly before it becomes visible, so nothing is caught
 * mid-render as it enters.
 */
export default function LazyCanvas({
  children,
  className,
  ...props
}: LazyCanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px" });

  return (
    <div ref={ref} className={cn("h-full w-full", className)}>
      <Canvas frameloop={inView ? "always" : "never"} {...props}>
        {children}
      </Canvas>
    </div>
  );
}
