"use client";

import { Suspense, useMemo, useState } from "react";
import * as THREE from "three";
import { animated, useSpring } from "@react-spring/three";
import { useLoader } from "@react-three/fiber";
import LazyCanvas from "@/components/three/LazyCanvas";
import { Gltf, OrbitControls, Stars } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import {
  FontLoader,
  type Font,
} from "three/examples/jsm/loaders/FontLoader.js";
import AnimatedShape from "@/components/three/AnimatedShape";
import { sampleStep } from "@/lib/math";
import type { ShapeType } from "@/types/three";

/**
 * Every particle owns its own spring and draw call, so this is the main
 * performance dial for the scene.
 */
const PARTICLE_COUNT = 600;
const WORD = "Chintan";
const FONT_SIZE = 3;
/**
 * Vendored into public/fonts because three stopped shipping examples/fonts in
 * the npm package as of r185. Licence sits alongside it.
 */
const FONT_URL = "/fonts/optimer_regular.typeface.json";
const MORPH_SHAPES: ShapeType[] = ["box", "sphere", "cone", "torus"];
const COLORS = ["#ffffff", "#ffff00"];
const MORPH_SPRING = { mass: 1, tension: 120, friction: 18 };

/** A loose cloud of points for the particles to rest in when not morphed. */
function randomCloud(count: number) {
  return Array.from(
    { length: count },
    () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 15,
      ),
  );
}

/** Samples roughly `wanted` evenly spaced points along the outline of `word`. */
function sampleWordPoints(font: Font, word: string, wanted: number) {
  const geometry = new THREE.ShapeGeometry(
    font.generateShapes(word, FONT_SIZE),
  );
  geometry.center();

  const position = geometry.getAttribute("position");
  // sampleStep floors at 1. A short word can yield fewer vertices than `wanted`,
  // and a step of 0 would spin this loop forever. Covered in lib/math.test.ts.
  const step = sampleStep(position.count, wanted);
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < position.count; i += step) {
    points.push(new THREE.Vector3(position.getX(i), position.getY(i), 0));
  }

  geometry.dispose();
  return points;
}

/**
 * A latching push button, built as real geometry rather than a flat plane: a
 * recessed housing with a cap that sinks into it and lights up while held down.
 * The skeuomorphic control language from the DOM, carried into the scene.
 */
function PushButton({
  pressed,
  onPress,
}: {
  pressed: boolean;
  onPress: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const { capY } = useSpring({
    capY: pressed ? -0.16 : 0,
    config: { tension: 320, friction: 22 },
  });

  return (
    <group position={[0, -4, 0]}>
      {/* Housing the cap sinks into */}
      <mesh position={[0, -0.14, 0]}>
        <boxGeometry args={[3.5, 0.42, 1.95]} />
        <meshStandardMaterial
          color="#0e0e15"
          metalness={0.55}
          roughness={0.6}
        />
      </mesh>

      {/* Bezel lip */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[3.24, 0.12, 1.72]} />
        <meshStandardMaterial color="#05050a" metalness={0.4} roughness={0.8} />
      </mesh>

      {/* Cap */}
      <animated.mesh
        position-y={capY}
        onClick={(event) => {
          event.stopPropagation();
          onPress();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[3, 0.34, 1.5]} />
        <meshStandardMaterial
          color={hovered ? "#f2f2f8" : "#d2d2de"}
          metalness={0.35}
          roughness={0.32}
          emissive={pressed ? "#ffff00" : "#000000"}
          emissiveIntensity={pressed ? 0.55 : 0}
        />
      </animated.mesh>
    </group>
  );
}

function MorphingScene() {
  const [morphed, setMorphed] = useState(false);
  // Suspends until the typeface is fetched; the Suspense boundary catches it.
  const font = useLoader(FontLoader, FONT_URL);
  const cloud = useMemo(() => randomCloud(PARTICLE_COUNT), []);
  const letters = useMemo(
    () => sampleWordPoints(font, WORD, PARTICLE_COUNT),
    [font],
  );

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} />

      {cloud.map((cloudPoint, i) => {
        // Falls back to the cloud point if the word produced no outline at all.
        const letterPoint = letters[i % letters.length] ?? cloudPoint;

        return (
          <AnimatedShape
            key={i}
            from={morphed ? cloudPoint : letterPoint}
            to={morphed ? letterPoint : cloudPoint}
            delay={i * 20}
            size={0.7}
            shape={MORPH_SHAPES[i % MORPH_SHAPES.length]}
            color={COLORS[i % COLORS.length]}
            springConfig={MORPH_SPRING}
          />
        );
      })}

      <PushButton pressed={morphed} onPress={() => setMorphed((on) => !on)} />
    </>
  );
}

/**
 * Particles that scatter into a cloud and reassemble into the word "Chintan"
 * when the bar beneath them is clicked.
 */
export default function LetterMorphScene() {
  return (
    <LazyCanvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      className="rounded-xl border-none"
      gl={{ preserveDrawingBuffer: true }}
    >
      {/* Zoom off, matching the other scenes: fixed camera distance, and the
          canvas no longer swallows wheel events meant for the page. */}
      <OrbitControls enableZoom={false} />
      <Stars
        radius={250}
        depth={100}
        count={3000}
        factor={6}
        fade
        speed={0.8}
      />

      <Suspense fallback={null}>
        <Gltf src="/scene.gltf" scale={[150, 150, 150]} position={[0, -5, 1]} />
        <MorphingScene />
      </Suspense>

      <EffectComposer>
        <Bloom intensity={0.6} />
      </EffectComposer>
    </LazyCanvas>
  );
}
