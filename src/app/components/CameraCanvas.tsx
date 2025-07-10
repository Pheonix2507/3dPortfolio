// LetterMorphScene.tsx
'use client';

import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { OrbitControls } from '@react-three/drei';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import optimer from 'three/examples/fonts/optimer_regular.typeface.json';

const shapeTypes = ['box', 'sphere', 'cone', 'torus'] as const;
type ShapeType = typeof shapeTypes[number];

interface Piece {
  from: THREE.Vector3;
  to: THREE.Vector3;
  delay: number;
  shape: ShapeType;
  color: string;
}




function getRandomPositions(count: number) {
  return Array.from({ length: count }, () =>
    new THREE.Vector3(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 15
    )
  );
}

function FloatingPiece({ from, to, delay, shape, color }: Piece) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { position } = useSpring({
    from: { position: from.toArray() },
    to: { position: to.toArray() },
    config: { mass: 1, tension: 120, friction: 18 },
    delay,
  });

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <animated.mesh ref={meshRef} position={position as unknown as [number, number, number]}>
      {shape === 'box' && <boxGeometry args={[0.15, 0.15, 0.15]} />}
      {shape === 'sphere' && <sphereGeometry args={[0.1, 16, 16]} />}
      {shape === 'cone' && <coneGeometry args={[0.1, 0.2, 16]} />}
      {shape === 'torus' && <torusGeometry args={[0.1, 0.04, 8, 16]} />}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
    </animated.mesh>
  );
}

function MorphingScene() {
  const COUNT = 600;
  const [active, setActive] = useState(false);
  const randomPositions = useMemo(() => getRandomPositions(COUNT), []);
  const colorPool = ['cyan', 'magenta', 'lime', 'orange', 'violet'];

  const letterPositions = useMemo(() => {
    const loader = new FontLoader();
    const font = loader.parse(optimer);

    const geometry = new TextGeometry('Chintan', {
      font,
      size: 3,
        depth: 0.01, // replaces height
        bevelEnabled: false,
      curveSegments: 4,
    });

    geometry.center();
    geometry.computeBoundingBox();

    const nonIndexed = geometry.toNonIndexed();
    const posAttr = nonIndexed.getAttribute('position');
    const points: THREE.Vector3[] = [];

    // only collect front-facing flat points (ignore depth)
    for (let i = 0; i < posAttr.count; i += Math.floor(posAttr.count / COUNT)) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      points.push(new THREE.Vector3(x, y, 0));
    }

    return points;
  }, [COUNT]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} />

      {randomPositions.map((pos, i) => (
        <FloatingPiece
          key={i}
          from={active ? pos : letterPositions[i % letterPositions.length]}
          to={active ? letterPositions[i % letterPositions.length] : pos}
          delay={i * 20}
          shape={shapeTypes[i % shapeTypes.length]}
          color={colorPool[i % colorPool.length]}
        />
      ))}

      <mesh
        position={[0, -4, 0]}
        onClick={() => setActive(!active)}
      >
        <boxGeometry args={[3, 0.3, 1.5]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.4} />
      </mesh>
    </>
  );
}

export default function LetterMorphScene() {
  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
      <OrbitControls />
      <MorphingScene />
    </Canvas>
  );
}
