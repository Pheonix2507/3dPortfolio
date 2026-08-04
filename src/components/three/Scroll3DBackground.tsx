"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Suspense, useEffect, useRef } from "react";
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
    /*
     * Monochrome field with one fragment in eight picked out in hazard yellow.
     * The old version ran full-saturation hues across cyan to violet, which is
     * a neon move and read as noise behind a yellow-on-black page.
     */
    color:
      Math.random() < 0.125
        ? new THREE.Color("#ffff00")
        : new THREE.Color().setHSL(0, 0, 0.55 + Math.random() * 0.35),
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
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 10, 28]} />
        <Suspense fallback={null}>
          <FragmentedCube />
        </Suspense>
      </Canvas>
    </div>
  );
}

/**
 * One InstancedMesh rather than 400 separate ones.
 *
 * Each fragment used to be its own mesh with its own material, which is 400 draw
 * calls every frame for a decorative backdrop that is on screen the entire time.
 * Instancing collapses that to a single call, with per-instance transforms and
 * colours uploaded once at mount.
 *
 * This is the one canvas that cannot be paused when off screen, because it is
 * position:fixed and therefore never off screen, so it is the one that most
 * needed the draw calls removed.
 */
function FragmentedCube() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Scratch objects reused every frame so the drift never allocates.
  const scratch = useRef({
    matrix: new THREE.Matrix4(),
    position: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(),
    scale: new THREE.Vector3(),
    euler: new THREE.Euler(),
  });

  /** Live positions, seeded from the fragment data and mutated by the drift. */
  const positions = useRef(
    FRAGMENTS.map((frag) => new THREE.Vector3(frag.x, frag.y, frag.z)),
  );

  const reduceMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();

  const spread = useTransform(scrollYProgress, [0, 1], [0, 1.5]);
  const rot = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);
  const explodeIntensity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  // Seed every instance's transform and colour once.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const { matrix, quaternion, scale, euler } = scratch.current;

    FRAGMENTS.forEach((frag, i) => {
      euler.set(frag.x, frag.y, frag.z);
      quaternion.setFromEuler(euler);
      scale.setScalar(frag.size);
      matrix.compose(positions.current[i], quaternion, scale);
      mesh.setMatrixAt(i, matrix);
      mesh.setColorAt(i, frag.color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  useFrame(() => {
    const group = groupRef.current;
    if (!group || reduceMotion) return;

    group.rotation.y = rot.get() * 0.4;
    group.rotation.x = rot.get() * 0.2;

    const scaleFactor = 1 + spread.get() * 0.15;
    group.scale.setScalar(scaleFactor);

    // Fragments drift apart as the page bottoms out.
    const explode = explodeIntensity.get();
    if (explode <= 0) return;

    const mesh = meshRef.current;
    if (!mesh) return;

    const { matrix, quaternion, scale, euler } = scratch.current;

    FRAGMENTS.forEach((frag, i) => {
      const position = positions.current[i];
      position.x += (Math.random() - 0.5) * 0.015 * explode;
      position.y += (Math.random() - 0.5) * 0.015 * explode;
      position.z += (Math.random() - 0.5) * 0.015 * explode;

      euler.set(frag.x, frag.y, frag.z);
      quaternion.setFromEuler(euler);
      scale.setScalar(frag.size);
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(i, matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef} position={[0, 0, -8]}>
      <ambientLight intensity={0.15} />
      <pointLight position={[6, 6, 10]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-6, -6, -10]} intensity={0.7} color="#ffff00" />

      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, FRAGMENT_COUNT]}
        frustumCulled={false}
      >
        {/* Unit cube; per-instance scale carries each fragment's size. */}
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          metalness={0.75}
          roughness={0.3}
          emissive="#ffffff"
          emissiveIntensity={0.35}
          transparent
          opacity={0.55}
        />
      </instancedMesh>
    </group>
  );
}
