"use client";

import { useRef } from "react";
import { animated, useSpring } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import type { ShapeType } from "@/types/three";

/**
 * Canonical geometry for each primitive. Callers scale the whole mesh with
 * `size` rather than passing their own dimensions, so every scene draws the
 * same shapes at consistent proportions.
 */
function ShapeGeometry({ shape }: { shape: ShapeType }) {
  switch (shape) {
    case "box":
      return <boxGeometry args={[0.2, 0.2, 0.2]} />;
    case "sphere":
      return <sphereGeometry args={[0.15, 16, 16]} />;
    case "cone":
      return <coneGeometry args={[0.15, 0.3, 16]} />;
    case "torus":
      return <torusGeometry args={[0.12, 0.04, 8, 24]} />;
    case "octahedron":
      return <octahedronGeometry args={[0.15]} />;
    case "cylinder":
      return <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />;
  }
}

export interface AnimatedShapeProps {
  /** Where the piece starts. Only read when the spring first mounts. */
  from: THREE.Vector3;
  /** Where the piece travels to. Changing this re-runs the animation. */
  to: THREE.Vector3;
  shape: ShapeType;
  color: string;
  /** Stagger before this piece starts moving, in milliseconds. */
  delay?: number;
  /** Uniform multiplier over the canonical geometry size. */
  size?: number;
  /** Tumble on every frame while true. */
  spin?: boolean;
  springConfig?: { mass: number; tension: number; friction: number };
}

/**
 * A single spring-animated particle. Shared by the exploding cubes on the
 * landing scene and the letter-morph scene so the travel, tumble and material
 * behaviour only exists in one place.
 */
export default function AnimatedShape({
  from,
  to,
  shape,
  color,
  delay = 0,
  size = 1,
  spin = true,
  springConfig = { mass: 1, tension: 140, friction: 16 },
}: AnimatedShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { position } = useSpring({
    from: { position: from.toArray() },
    to: { position: to.toArray() },
    delay,
    config: springConfig,
  });

  useFrame(() => {
    if (!spin || !meshRef.current) return;
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <animated.mesh
      ref={meshRef}
      // react-spring types position as SpringValue<number[]>, which R3F's
      // tuple-typed prop does not accept directly.
      position={position as unknown as [number, number, number]}
      scale={size}
    >
      <ShapeGeometry shape={shape} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
      />
    </animated.mesh>
  );
}
