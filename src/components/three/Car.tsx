"use client";

import type { RefObject } from "react";
import type * as THREE from "three";
import { Edges } from "@react-three/drei";

const VOID = "#000000";
const INK = "#ffffff";
const HAZARD = "#ffff00";
const ALERT = "#ff2200";
const GLASS = "#14141b";

/** Rolling radius. The driver of the wheels divides distance by this. */
export const WHEEL_RADIUS = 0.115;

const WHEEL_WIDTH = 0.085;
/** Axle positions: half-track on X, wheelbase on Z. */
const HALF_TRACK = 0.27;
const WHEELBASE = 0.34;
const AXLE_HEIGHT = -0.1;

const WHEEL_POSITIONS: [number, number, number][] = [
  [-HALF_TRACK, AXLE_HEIGHT, WHEELBASE],
  [HALF_TRACK, AXLE_HEIGHT, WHEELBASE],
  [-HALF_TRACK, AXLE_HEIGHT, -WHEELBASE],
  [HALF_TRACK, AXLE_HEIGHT, -WHEELBASE],
];

interface CarProps {
  /**
   * The sprung mass. Rocking is applied here rather than to the whole car, so
   * the wheels stay planted on the road while the body leans over them.
   */
  bodyRef: RefObject<THREE.Group | null>;
  /** One spin group per wheel, rotated about its axle by the driver. */
  wheelRefs: RefObject<(THREE.Group | null)[]>;
}

/**
 * A car, modelled facing +Z so `lookAt` aims it down the route's tangent.
 *
 * Blocks only, with hard edges and flat fills: enough form to read as a car —
 * separate bonnet, cabin and boot, bumpers, lamps, glass — without softening
 * into something that belongs to a different design language.
 *
 * The wheels sit outside the rocking body so the two can move independently:
 * wheels roll with distance travelled, the body leans with cornering.
 */
export default function Car({ bodyRef, wheelRefs }: CarProps) {
  return (
    <group>
      <group ref={bodyRef}>
        {/* Chassis */}
        <mesh>
          <boxGeometry args={[0.5, 0.16, 0.94]} />
          <meshBasicMaterial color={HAZARD} />
          <Edges color={VOID} />
        </mesh>

        {/* Bonnet, lower than the cabin so the profile is not one slab */}
        <mesh position={[0, 0.11, 0.31]}>
          <boxGeometry args={[0.46, 0.1, 0.3]} />
          <meshBasicMaterial color={HAZARD} />
          <Edges color={VOID} />
        </mesh>

        {/* Boot */}
        <mesh position={[0, 0.1, -0.36]}>
          <boxGeometry args={[0.46, 0.08, 0.22]} />
          <meshBasicMaterial color={HAZARD} />
          <Edges color={VOID} />
        </mesh>

        {/* Cabin, set back from the bonnet */}
        <mesh position={[0, 0.2, -0.04]}>
          <boxGeometry args={[0.42, 0.22, 0.42]} />
          <meshBasicMaterial color={VOID} />
          <Edges color={HAZARD} />
        </mesh>

        {/* Windscreen and rear glass, inset a shade darker than the cabin */}
        <mesh position={[0, 0.21, 0.172]}>
          <boxGeometry args={[0.36, 0.15, 0.02]} />
          <meshBasicMaterial color={GLASS} />
          <Edges color={INK} />
        </mesh>
        <mesh position={[0, 0.21, -0.252]}>
          <boxGeometry args={[0.36, 0.15, 0.02]} />
          <meshBasicMaterial color={GLASS} />
          <Edges color={INK} />
        </mesh>

        {/* Bumpers */}
        <mesh position={[0, -0.02, 0.5]}>
          <boxGeometry args={[0.52, 0.09, 0.06]} />
          <meshBasicMaterial color={INK} />
          <Edges color={VOID} />
        </mesh>
        <mesh position={[0, -0.02, -0.5]}>
          <boxGeometry args={[0.52, 0.09, 0.06]} />
          <meshBasicMaterial color={INK} />
          <Edges color={VOID} />
        </mesh>

        {/* Headlamps */}
        {[-0.16, 0.16].map((x) => (
          <mesh key={`head-${x}`} position={[x, 0.11, 0.465]}>
            <boxGeometry args={[0.11, 0.06, 0.03]} />
            <meshBasicMaterial color={INK} />
          </mesh>
        ))}

        {/* Tail lamps: the rationed red, and the only way to tell front from back
            at a glance when the car is heading away from the camera. */}
        {[-0.16, 0.16].map((x) => (
          <mesh key={`tail-${x}`} position={[x, 0.1, -0.475]}>
            <boxGeometry args={[0.11, 0.05, 0.03]} />
            <meshBasicMaterial color={ALERT} />
          </mesh>
        ))}

        {/* Side sills, breaking up the flat flank */}
        {[-0.255, 0.255].map((x) => (
          <mesh key={`sill-${x}`} position={[x, -0.08, 0]}>
            <boxGeometry args={[0.02, 0.05, 0.66]} />
            <meshBasicMaterial color={VOID} />
          </mesh>
        ))}
      </group>

      {/*
        Wheels are outside the body group. Each is a spin group holding a
        cylinder already turned so its axle lies along X, which lets the driver
        roll it with a single rotation.x without fighting the euler order.
      */}
      {WHEEL_POSITIONS.map((position, i) => (
        <group
          key={`${position[0]}-${position[2]}`}
          position={position}
          ref={(node) => {
            wheelRefs.current[i] = node;
          }}
        >
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry
              args={[WHEEL_RADIUS, WHEEL_RADIUS, WHEEL_WIDTH, 12]}
            />
            <meshBasicMaterial color={VOID} />
            <Edges color={INK} />
          </mesh>

          {/* Hub spoke, so the rotation is actually visible on a dark tyre */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry
              args={[WHEEL_WIDTH + 0.012, 0.022, WHEEL_RADIUS * 1.5]}
            />
            <meshBasicMaterial color={INK} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
