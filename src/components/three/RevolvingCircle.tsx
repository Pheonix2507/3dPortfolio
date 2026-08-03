"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";

/** Radians per second. Matches the 0.004 rad/ms of the original DOM version. */
const ANGULAR_SPEED = 4;

interface RevolvingCircleProps {
  /** Orbit radius in world units. */
  radius: number;
}

/**
 * A sphere orbiting the origin, with the orbit path and centre drawn for
 * reference. The position is mutated in the frame loop rather than held in
 * state, so spinning it does not re-render React.
 */
export default function RevolvingCircle({ radius }: RevolvingCircleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(0);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    angleRef.current += delta * ANGULAR_SPEED;
    mesh.position.set(
      Math.cos(angleRef.current) * radius,
      Math.sin(angleRef.current) * radius,
      0,
    );
  });

  return (
    <>
      {/* The point being revolved around. */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#f472b6" emissive="#ec4899" />
      </mesh>

      {/* The orbit path, so a radius change is visible immediately. */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[radius, 0.005, 8, 96]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.35} />
      </mesh>

      <mesh ref={meshRef}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#22d3ee"
          emissiveIntensity={1.2}
        />
      </mesh>
    </>
  );
}
