// LetterMorphScene.tsx
'use client';

import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Gltf, OrbitControls, Stars } from '@react-three/drei';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import optimer from 'three/examples/fonts/optimer_regular.typeface.json';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

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
  const font = loader.parse(optimer); // or any other loaded font

  const shapes = font.generateShapes('Chintan', 3); // 'Chintan' at size 3
  const geometry = new THREE.ShapeGeometry(shapes);
  geometry.center();

  const posAttr = geometry.getAttribute('position');
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < posAttr.count; i += Math.floor(posAttr.count / COUNT)) {
    points.push(
      new THREE.Vector3(
        posAttr.getX(i),
        posAttr.getY(i),
        0 // flat Z
      )
    );
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
    <Canvas camera={{ position: [0, 0, 12], fov: 60 }} className="border-none rounded-xl" gl={{ preserveDrawingBuffer: true }}>
       {/* <color attach="background" args={['black']} /> */}
  <OrbitControls />

  {/* <Environment background files="/hdr/nebula.hdr"/> */}

<Gltf src="/scene.gltf" scale={[150, 150, 150]} position={[0,-5,1]}/>
  <Stars radius={250} depth={100} count={3000} factor={6} fade speed={0.8} />
  {/* <Sparkles count={100} size={1.5} scale={[60, 60, 60]} speed={1} /> */}

  <EffectComposer>
    {/* <DepthOfField focusDistance={0.01} focalLength={0.015} bokehScale={2.5} /> */}
    <Bloom intensity={0.6} />
  </EffectComposer>
      <MorphingScene />
    </Canvas>
  );
}
