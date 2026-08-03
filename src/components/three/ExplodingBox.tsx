"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSpring } from "@react-spring/three";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html, Trail } from "@react-three/drei";
import { useRouter } from "next/navigation";
import AnimatedShape from "@/components/three/AnimatedShape";
import { SHAPE_TYPES, type ScenePiece } from "@/types/three";

/** How many fragments a cube bursts into. */
const PIECE_COUNT = 30;
/** Time the burst / regroup animation needs before input is accepted again. */
const ANIMATION_MS = 1500;
/** Radius of the little satellite that orbits each cube. */
const ORBIT_RADIUS = 1.5;

interface ExplodingBoxProps {
  /** Accessible label for the info panel this cube opens. */
  name: string;
  position: [number, number, number];
  /** Cube and fragment colour. */
  color: string;
  /** Colour of the orbiting satellite and its trail. */
  satelliteColor: string;
  /** Route the orbiting satellite navigates to when clicked. */
  href: string;
  infoContent: ReactNode;
}

function createPieces(origin: THREE.Vector3): ScenePiece[] {
  return Array.from({ length: PIECE_COUNT }, (_, i) => {
    const offset = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5,
    )
      .normalize()
      .multiplyScalar(1.5 + Math.random());

    return {
      id: i,
      from: origin.clone(),
      to: origin.clone().add(offset),
      delay: i * 20,
      shape: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
    };
  });
}

/**
 * A clickable cube that bursts into fragments and reveals an info panel, with a
 * satellite orbiting it that links off to a route.
 */
export default function ExplodingBox({
  name,
  position,
  color,
  satelliteColor,
  href,
  infoContent,
}: ExplodingBoxProps) {
  const [exploded, setExploded] = useState(false);
  const [pieces, setPieces] = useState<ScenePiece[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hovered, setHovered] = useState(false);

  const orbitRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Easing the orbit to a halt on hover, rather than stopping it dead.
  const { orbitSpeed } = useSpring({
    orbitSpeed: hovered ? 0 : 1,
    config: { mass: 1, tension: 120, friction: 14 },
  });

  // Pending timers must not outlive the component, or they call setState on an
  // unmounted tree when the user navigates mid-animation.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useFrame((_, delta) => {
    const orbit = orbitRef.current;
    if (!orbit || exploded) return;

    angleRef.current += delta * orbitSpeed.get();
    orbit.position.set(
      position[0] + ORBIT_RADIUS * Math.cos(angleRef.current),
      position[1] + ORBIT_RADIUS * Math.cos(angleRef.current),
      position[2] + ORBIT_RADIUS * Math.sin(angleRef.current),
    );
  });

  const handleClick = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (!exploded) {
      setPieces(createPieces(new THREE.Vector3(...position)));
      setExploded(true);
      timeoutRef.current = setTimeout(
        () => setIsAnimating(false),
        ANIMATION_MS,
      );
      return;
    }

    // Let the regroup animation play out before the pieces are unmounted.
    setExploded(false);
    timeoutRef.current = setTimeout(() => {
      setPieces([]);
      setIsAnimating(false);
    }, ANIMATION_MS);
  }, [exploded, isAnimating, position]);

  return (
    <>
      {!exploded && (
        <Trail
          width={5}
          length={10}
          color={satelliteColor}
          attenuation={(t) => t * t}
        >
          <mesh
            ref={orbitRef}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(true);
            }}
            onPointerOut={() => setHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              router.push(href);
            }}
          >
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color={satelliteColor}
              emissive="cyan"
              emissiveIntensity={1}
            />
          </mesh>
        </Trail>
      )}

      {/* The solid cube, hidden while fragments are on screen. */}
      {!exploded && !isAnimating && pieces.length === 0 && (
        <mesh position={position}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
      )}

      {exploded && (
        <Html center position={[position[0], position[1] + 2, position[2]]}>
          <div
            role="note"
            aria-label={name}
            className="max-w-[300px] min-w-[220px] rounded-2xl border border-white/20 bg-white/10 p-4 text-center font-sans text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-[10px]"
          >
            {infoContent}
          </div>
        </Html>
      )}

      {pieces.map((piece) => (
        <AnimatedShape
          key={piece.id}
          // Swapping from/to drives the spring back to the origin on regroup.
          from={exploded ? piece.from : piece.to}
          to={exploded ? piece.to : piece.from}
          delay={piece.delay}
          color={color}
          shape={piece.shape}
          spin={exploded}
        />
      ))}

      {/* Slightly oversized invisible hit area so the cube is easy to click. */}
      <mesh
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}
