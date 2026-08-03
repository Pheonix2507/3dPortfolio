"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useScroll, useTransform } from "framer-motion";
import { Suspense, useRef } from "react";
import * as THREE from "three";

const FRAGMENT_COUNT = 400;

interface Fragment {
  x: number;
  y: number;
  z: number;
  size: number;
  color: THREE.Color;
}

/**
 * Built once at module load rather than during render. Doing this inside the
 * component body made the colours re-randomise on every re-render, and React
 * gives no guarantee that a useMemo result survives.
 */
const FRAGMENTS: Fragment[] = Array.from(
  { length: FRAGMENT_COUNT },
  (): Fragment => ({
    // Wide spread, since the camera sits well back at z = 14.
    x: (Math.random() - 0.5) * 10,
    y: (Math.random() - 0.5) * 10,
    z: (Math.random() - 0.5) * 10,
    size: Math.random() * 0.12 + 0.04,
    color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.6, 1, 0.45),
  }),
);

export default function Scroll3DBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Soft colour haze behind the fragments. */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: "var(--bg-3d-opacity, 1)",
          background:
            "radial-gradient(circle at 50% 40%, rgba(0,255,255,0.04), rgba(255,0,255,0.03), transparent 80%)",
          filter: "blur(80px) saturate(160%) brightness(45%)",
        }}
      />
      <Canvas camera={{ position: [0, 0, 14], fov: 60 }}>
        <color attach="background" args={["#01000a"]} />
        <fog attach="fog" args={["#01000a", 10, 28]} />
        <Suspense fallback={null}>
          <FragmentedCube />
        </Suspense>
      </Canvas>
    </div>
  );
}

function FragmentedCube() {
  const groupRef = useRef<THREE.Group>(null);
  // Scratch vector reused each frame so the drift does not allocate.
  const driftRef = useRef(new THREE.Vector3());
  const { scrollYProgress } = useScroll();

  const spread = useTransform(scrollYProgress, [0, 1], [0, 1.5]);
  const rot = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);
  const explodeIntensity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    group.rotation.y = rot.get() * 0.4;
    group.rotation.x = rot.get() * 0.2;

    const scale = 1 + spread.get() * 0.15;
    group.scale.set(scale, scale, scale);

    // Fragments drift apart as the page bottoms out.
    const explode = explodeIntensity.get();
    if (explode <= 0) return;

    const drift = driftRef.current;
    for (const child of group.children) {
      if (!(child instanceof THREE.Mesh)) continue;
      drift.set(
        (Math.random() - 0.5) * 0.015 * explode,
        (Math.random() - 0.5) * 0.015 * explode,
        (Math.random() - 0.5) * 0.015 * explode,
      );
      child.position.add(drift);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -8]}>
      <ambientLight intensity={0.15} />
      <pointLight position={[6, 6, 10]} intensity={1.2} color="#00ffff" />
      <pointLight position={[-6, -6, -10]} intensity={0.7} color="#ff00ff" />

      {FRAGMENTS.map((frag, i) => (
        <mesh
          key={i}
          position={[frag.x, frag.y, frag.z]}
          rotation={[frag.x, frag.y, frag.z]}
        >
          <boxGeometry args={[frag.size, frag.size, frag.size]} />
          <meshStandardMaterial
            color={frag.color}
            metalness={0.75}
            roughness={0.3}
            emissive="#00bfff"
            emissiveIntensity={0.35}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}
