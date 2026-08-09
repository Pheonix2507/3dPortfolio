"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { animated, useSpring } from "@react-spring/three";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import {
  FontLoader,
  type Font,
} from "three/examples/jsm/loaders/FontLoader.js";
import LazyCanvas from "@/components/three/LazyCanvas";
import { clamp01, lerp } from "@/lib/math";

const VOID = "#000000";
const INK = "#ffffff";
const HAZARD = "#ffff00";

/** Particles in the cloud. One InstancedMesh, so this is not a draw-call count. */
const PARTICLE_COUNT = 600;
const WORD = "Chintan";
const FONT_SIZE = 3;
/**
 * Vendored into public/fonts because three stopped shipping examples/fonts in
 * the npm package as of r185. Licence sits alongside it.
 */
const FONT_URL = "/fonts/optimer_regular.typeface.json";

/** Seconds for the whole cloud to finish assembling or dispersing. */
const MORPH_SECONDS = 1.3;
/**
 * Share of the duration spent staggering the particles.
 *
 * The previous version delayed each particle by index times 20ms, which at 600
 * particles meant the last one began twelve seconds after the click. The morph
 * appeared never to finish. Stagger is now a fraction of a fixed duration, so
 * adding particles changes the density rather than the running time.
 */
const STAGGER_SHARE = 0.45;

const PARTICLE_SIZE = 0.055;

interface Particle {
  cloud: THREE.Vector3;
  letter: THREE.Vector3;
  /** 0..1 position in the stagger order. */
  delay: number;
  rotation: THREE.Euler;
  colour: THREE.Color;
}

/** A loose cloud for the particles to rest in when not assembled. */
function randomCloud(count: number) {
  return Array.from(
    { length: count },
    () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 11,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 8,
      ),
  );
}

/**
 * Samples points evenly along the outlines of `word`.
 *
 * The previous version triangulated the glyphs into a ShapeGeometry and walked
 * its position attribute at a fixed index step. Triangulation order is not
 * spatial, so the budget landed arbitrarily: "Chintan" is nine closed contours
 * whose perimeters range from 1.44 to 13.25, and index stepping gave the dot of
 * the i as many points as the C. Letters came out with detached fragments and
 * gaps in their strokes.
 *
 * Walking each contour by arc length instead, with a share proportional to its
 * perimeter, spaces points evenly everywhere and keeps every letterform whole.
 */
function sampleWordPoints(font: Font, word: string, wanted: number) {
  const shapes = font.generateShapes(word, FONT_SIZE);

  // Every closed contour: each glyph's outline, plus counters like the one in a.
  const contours: THREE.Path[] = [];
  for (const shape of shapes) {
    contours.push(shape);
    contours.push(...shape.holes);
  }

  const lengths = contours.map((contour) => contour.getLength());
  const total = lengths.reduce((sum, length) => sum + length, 0);
  if (total === 0) return [];

  const points: THREE.Vector3[] = [];
  contours.forEach((contour, i) => {
    // A floor of three keeps the smallest marks from vanishing entirely.
    const share = Math.max(3, Math.round((lengths[i] / total) * wanted));
    for (const point of contour.getSpacedPoints(share)) {
      points.push(new THREE.Vector3(point.x, point.y, 0));
    }
  });

  const centre = new THREE.Box3()
    .setFromPoints(points)
    .getCenter(new THREE.Vector3());
  for (const point of points) point.sub(centre);

  return points;
}

/**
 * A latching push button: a recessed housing with a cap that sinks into it.
 * The skeuomorphic control language from the DOM, carried into the scene.
 */
function PushButton({
  pressed,
  onPress,
  reduceMotion,
}: {
  pressed: boolean;
  onPress: () => void;
  reduceMotion: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const { capY } = useSpring({
    capY: pressed ? -0.16 : 0,
    config: { tension: 320, friction: 22 },
    immediate: reduceMotion,
  });

  return (
    <group position={[0, -3.4, 0]}>
      <mesh position={[0, -0.14, 0]}>
        <boxGeometry args={[3.5, 0.42, 1.95]} />
        <meshBasicMaterial color="#0e0e15" />
      </mesh>

      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[3.24, 0.12, 1.72]} />
        <meshBasicMaterial color={VOID} />
      </mesh>

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
        <meshBasicMaterial
          color={pressed ? HAZARD : hovered ? INK : "#c8c8d2"}
        />
      </animated.mesh>
    </group>
  );
}

/**
 * Particles that scatter into a cloud and reassemble into the word "Chintan".
 *
 * One InstancedMesh rather than 600 meshes each carrying their own spring. The
 * morph is a single clock advanced in the frame loop, and every particle reads
 * its own offset from it, which is what makes the timing controllable at all:
 * the per-particle springs it replaced could not be given a total duration.
 */
function MorphingScene({ reduceMotion }: { reduceMotion: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [morphed, setMorphed] = useState(false);

  /** Global morph clock, 0 dispersed to 1 assembled. */
  const anim = useRef(0);
  const font = useLoader(FontLoader, FONT_URL);

  const scratch = useRef({
    matrix: new THREE.Matrix4(),
    position: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(),
    scale: new THREE.Vector3(PARTICLE_SIZE, PARTICLE_SIZE, PARTICLE_SIZE),
  });

  const particles = useMemo<Particle[]>(() => {
    const cloud = randomCloud(PARTICLE_COUNT);
    const letters = sampleWordPoints(font, WORD, PARTICLE_COUNT);

    return cloud.map((point, i) => ({
      cloud: point,
      /*
       * Mapped across the whole outline rather than by modulo. Modulo truncates
       * the word whenever the outline yields more points than there are
       * particles: everything past the particle count is simply never used, so
       * the last letters go missing. Scaling the index covers every contour
       * proportionally regardless of which side the counts fall on.
       */
      letter:
        letters.length > 0
          ? (letters[Math.floor((i * letters.length) / PARTICLE_COUNT)] ??
            point)
          : point,
      /*
       * Hashed rather than sequential, so the assembly reads as a swarm settling
       * instead of a wipe travelling across the word. Deterministic, so it stays
       * out of the render-purity rules and looks the same every load.
       */
      delay: ((i * 2654435761) % 1000) / 1000,
      rotation: new THREE.Euler((i % 7) * 0.42, (i % 5) * 0.63, (i % 3) * 0.51),
      colour: new THREE.Color(i % 4 === 0 ? HAZARD : INK),
    }));
  }, [font]);

  // Colours never change, so they are uploaded once.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    particles.forEach((particle, i) => mesh.setColorAt(i, particle.colour));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [particles]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const target = morphed ? 1 : 0;

    if (reduceMotion) {
      anim.current = target;
    } else if (anim.current !== target) {
      const step = delta / MORPH_SECONDS;
      anim.current =
        target > anim.current
          ? Math.min(target, anim.current + step)
          : Math.max(target, anim.current - step);
    }

    const { matrix, position, quaternion, scale } = scratch.current;
    const global = anim.current;

    particles.forEach((particle, i) => {
      // Each particle runs the same move, offset within the stagger window.
      const local = clamp01(
        (global - particle.delay * STAGGER_SHARE) / (1 - STAGGER_SHARE),
      );

      position.set(
        lerp(particle.cloud.x, particle.letter.x, local),
        lerp(particle.cloud.y, particle.letter.y, local),
        lerp(particle.cloud.z, particle.letter.z, local),
      );
      quaternion.setFromEuler(particle.rotation);
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(i, matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, PARTICLE_COUNT]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <PushButton
        pressed={morphed}
        onPress={() => setMorphed((on) => !on)}
        reduceMotion={reduceMotion}
      />
    </>
  );
}

export default function LetterMorphScene() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <LazyCanvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ preserveDrawingBuffer: true }}
    >
      {/* Zoom off, matching the other scenes: fixed camera distance, and the
          canvas no longer swallows wheel events meant for the page. */}
      <OrbitControls enableZoom={false} />

      <Suspense fallback={null}>
        <MorphingScene reduceMotion={reduceMotion} />
      </Suspense>
    </LazyCanvas>
  );
}
