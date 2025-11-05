'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function Scroll3DBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 🌌 Soft color haze (far background glow) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(0,255,255,0.04), rgba(255,0,255,0.03), transparent 80%)',
          filter: 'blur(80px) saturate(160%) brightness(45%)',
        }}
      />
      <Canvas camera={{ position: [0, 0, 14], fov: 60 }}>
        {/* 👇 Pushed camera further back (was 8 → now 14) */}
        <color attach="background" args={['#01000a']} />
        <fog attach="fog" args={['#01000a', 10, 28]} />
        <Suspense fallback={null}>
          <FragmentedCube />
        </Suspense>
      </Canvas>
    </div>
  );
}

function FragmentedCube() {
  const groupRef = useRef<THREE.Group>(null);
  const { scrollYProgress } = useScroll();

  // Generate cube fragments
  const fragments = useMemo(() => {
    const arr = [];
    const count = 400;
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10; // 🔹 Wider spread since camera is farther
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      const size = Math.random() * 0.12 + 0.04;
      arr.push({ x, y, z, size });
    }
    return arr;
  }, []);

  // Scroll-driven transforms
  const spread = useTransform(scrollYProgress, [0, 1], [0, 1.5]);
  const rot = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);
  const explodeIntensity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  const tmp = new THREE.Vector3();

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    group.rotation.y = rot.get() * 0.4;
    group.rotation.x = rot.get() * 0.2;
    const scale = 1 + spread.get() * 0.15;
    group.scale.set(scale, scale, scale);

    // 💥 Explosion drift near bottom scroll
    const explode = explodeIntensity.get();
    if (explode > 0) {
      group.children.forEach((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          tmp.set(
            (Math.random() - 0.5) * 0.015 * explode,
            (Math.random() - 0.5) * 0.015 * explode,
            (Math.random() - 0.5) * 0.015 * explode
          );
          child.position.add(tmp);
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -8]}>
      {/* 🔹 Entire group offset back (Z = -8) */}
      <ambientLight intensity={0.15} />
      <pointLight position={[6, 6, 10]} intensity={1.2} color="#00ffff" />
      <pointLight position={[-6, -6, -10]} intensity={0.7} color="#ff00ff" />

      {fragments.map((frag, i) => (
        <mesh
          key={i}
          position={[
            frag.x * (1 + spread.get() * 0.2),
            frag.y * (1 + spread.get() * 0.2),
            frag.z * (1 + spread.get() * 0.2),
          ]}
          rotation={[frag.x, frag.y, frag.z]}
        >
          <boxGeometry args={[frag.size, frag.size, frag.size]} />
          <meshStandardMaterial
            color={new THREE.Color().setHSL(Math.random() * 0.3 + 0.6, 1, 0.45)}
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
