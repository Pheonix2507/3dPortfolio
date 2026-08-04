"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Edges, Html } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import type * as THREE from "three";

interface SpineBlock {
  label: string;
  fill: string;
  edge: string;
}

/** Read top to bottom: the order they are stacked, and the order they leave. */
const BLOCKS: SpineBlock[] = [
  { label: "01 / SHADERS", fill: "#000000", edge: "#ffffff" },
  { label: "02 / FRAME LOOP", fill: "#ffff00", edge: "#000000" },
  { label: "03 / GEOMETRY", fill: "#000000", edge: "#ffffff" },
  { label: "04 / CONTROLS", fill: "#000000", edge: "#ffff00" },
  { label: "05 / MOTION", fill: "#ff2200", edge: "#000000" },
  { label: "06 / GLSL", fill: "#000000", edge: "#ffffff" },
  { label: "07 / NO BRIEF", fill: "#000000", edge: "#ffff00" },
];

const BLOCK_WIDTH = 1.15;
const BLOCK_HEIGHT = 0.34;
const BLOCK_DEPTH = 1.15;
const GAP = 0.14;
const PITCH = BLOCK_HEIGHT + GAP;

/**
 * Scroll window the disassembly occupies. It finishes well before the end of
 * the pin, leaving the last stretch to watch the completed wheel turn.
 */
const START = 0.08;
const END = 0.62;
/** Progress one block takes to travel out. Wide, so the move reads unhurried. */
const DETACH_WINDOW = 0.12;

/** Where the vertebrae settle once they are in orbit. */
const ORBIT_RADIUS = 2.25;
/** Radians per second. Slow: this is a mechanism, not a fidget spinner. */
const ORBIT_SPEED = 0.22;
/** Vertebrae shrink on their way out, so the wheel reads lighter than the column. */
const ORBIT_SCALE = 0.55;

/**
 * Lean of the spine axis. The wheel is perpendicular to it, so this tips the
 * whole mechanism off upright.
 */
const AXIS_TILT = (20 * Math.PI) / 180;

/**
 * Framing only, kept separate from AXIS_TILT so the design decision and the
 * camera compensation do not get confused for each other.
 *
 * The wheel sits perpendicular to the spine, which means a camera near the
 * horizon sees it edge-on as a flat line rather than a wheel. Tipping the whole
 * assembly toward the viewer opens it into an ellipse.
 */
const VIEW_TIP = (30 * Math.PI) / 180;

const COUNT = BLOCKS.length;
const COLUMN_HEIGHT = COUNT * PITCH;

/** Rest height of each vertebra, first in the list at the top. */
const REST_Y = BLOCKS.map(
  (_, i) => COLUMN_HEIGHT / 2 - i * PITCH - BLOCK_HEIGHT / 2,
);

/** Evenly spaced around the ring, so the finished wheel is regular. */
const BASE_ANGLE = BLOCKS.map((_, i) => (i / COUNT) * Math.PI * 2);

/** Slight alternating thickness, so the disc is not perfectly flat. */
const DISC_Y = BLOCKS.map((_, i) => (i % 2 === 0 ? 0.11 : -0.11));

/** Progress at which block `i` starts to leave the column. */
const THRESHOLD = BLOCKS.map((_, i) => START + (i / COUNT) * (END - START));

/** Widest the finished wheel gets, used to scale it down on narrow viewports. */
const WHEEL_WIDTH = (ORBIT_RADIUS + (BLOCK_WIDTH * ORBIT_SCALE) / 2) * 2;

/** Extent of the core rod, which is consumed as the vertebrae leave it. */
const ROD_TOP = COLUMN_HEIGHT / 2 + BLOCK_HEIGHT;
const ROD_BOTTOM = -COLUMN_HEIGHT / 2 - BLOCK_HEIGHT;
const ROD_LENGTH = ROD_TOP - ROD_BOTTOM;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

interface SpineColumnProps {
  /** Scroll progress of the pinned section, 0 to 1. */
  progress: MotionValue<number>;
  reduceMotion: boolean;
}

/**
 * A spine of labelled blocks that peels itself apart as the section scrolls.
 * Each vertebra detaches in turn, travels out to an orbital radius, and then
 * revolves around the spine axis, so the column resolves into a slowly turning
 * wheel. The core rod is consumed as they leave it, so nothing is left holding
 * an empty column together.
 *
 * Blocks orient radially once in orbit, like teeth on a cog, which keeps the
 * result mechanical instead of a cloud of tumbling debris. Interpolation is
 * linear throughout: no easing curves, because springy motion reads playful and
 * this is meant to read as machinery.
 *
 * Labels are DOM overlays rather than 3D text so the type stays crisp, and their
 * z-index is capped below the section chrome so they pass behind the heading
 * instead of over it.
 */
export default function SpineColumn({
  progress,
  reduceMotion,
}: SpineColumnProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rodRef = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);

  const viewportWidth = useThree((state) => state.viewport.width);

  // Narrow viewports stack the chrome above the scene, so the assembly stays
  // centred there. Wide ones put the text down the left, so it shifts right to
  // keep out from under it.
  const offsetX = Math.min(2.1, viewportWidth * 0.18);
  const fit = Math.min(1, (viewportWidth * 0.52) / WHEEL_WIDTH);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group || reduceMotion) return;

    // Drives the orbit independently of scroll, so the wheel keeps turning even
    // when the page is still.
    elapsed.current += delta;

    const p = progress.get();
    let totalDetached = 0;

    group.children.forEach((child, i) => {
      if (i >= COUNT) return;

      const detached = clamp01((p - THRESHOLD[i]) / DETACH_WINDOW);
      totalDetached += detached;

      const angle = BASE_ANGLE[i] + elapsed.current * ORBIT_SPEED;

      child.position.set(
        lerp(0, Math.cos(angle) * ORBIT_RADIUS, detached),
        lerp(REST_Y[i], DISC_Y[i], detached),
        lerp(0, Math.sin(angle) * ORBIT_RADIUS, detached),
      );

      // Rotating +Z to point along the radius means y = atan2(cos, sin).
      child.rotation.y = lerp(0, Math.PI / 2 - angle, detached);

      child.scale.setScalar(lerp(1, ORBIT_SCALE, detached));
    });

    // The rod retracts from the top as the vertebrae leave it. Each block
    // accounts for one seventh of it, so the two stay in step by construction.
    const rod = rodRef.current;
    if (!rod) return;

    const consumed = totalDetached / COUNT;
    const remaining = 1 - consumed;

    if (remaining <= 0.001) {
      rod.visible = false;
      return;
    }

    rod.visible = true;
    rod.scale.y = remaining;
    rod.position.y = ROD_BOTTOM + (ROD_LENGTH * remaining) / 2;
  });

  return (
    // Outermost group is framing. The one inside it is the 20° axis lean, which
    // wraps the rod as well as the vertebrae so the axis and what revolves
    // around it stay rigidly attached.
    <group position={[offsetX, 0, 0]} rotation={[VIEW_TIP, 0, 0]} scale={fit}>
      <group rotation={[0, 0, AXIS_TILT]}>
        <group ref={groupRef}>
          {BLOCKS.map((block, i) => (
            <mesh key={block.label} position={[0, REST_Y[i], 0]}>
              <boxGeometry args={[BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_DEPTH]} />
              <meshBasicMaterial color={block.fill} />
              <Edges color={block.edge} />

              <Html
                center
                position={[0, BLOCK_HEIGHT / 2 + 0.16, BLOCK_DEPTH / 2]}
                zIndexRange={[10, 0]}
                style={{ pointerEvents: "none" }}
              >
                <span className="border-ink/30 bg-void/85 text-ink/80 border-2 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.2em] whitespace-nowrap uppercase">
                  {block.label}
                </span>
              </Html>
            </mesh>
          ))}
        </group>

        <mesh ref={rodRef}>
          <cylinderGeometry args={[0.03, 0.03, ROD_LENGTH, 10]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}
