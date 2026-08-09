"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Edges, Html } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import Car, { WHEEL_RADIUS } from "@/components/three/Car";
import { clamp01, lerp } from "@/lib/math";
import type { JourneyStation } from "@/data/journey";

const VOID = "#000000";
const INK = "#ffffff";
const HAZARD = "#ffff00";

/** World-space gap between consecutive stations. Sets the pace of the descent. */
const STATION_SPACING = 3.2;
/**
 * Widest the route swings from centre, as a fraction of the visible half-width
 * and then capped, so the road spans the page instead of sitting in a column.
 */
const REACH_FRACTION = 0.38;
const MAX_REACH = 3.6;
/** Depth wobble, so the road reads as three-dimensional rather than flat. */
const DEPTH = 0.45;

/**
 * Below this visible world width the frame is too narrow to put a panel beside a
 * station, so it is centred under the block instead.
 */
const NARROW_WORLD_WIDTH = 5;

/**
 * Dash and gap lengths in world units, cycled rather than randomised.
 *
 * The two lists are deliberately different lengths and share no common factor,
 * so the pattern does not settle into a repeating rhythm across the route. Fixed
 * values rather than Math.random keeps the road identical on every render and
 * keeps this out of the render-purity rules.
 */
const DASH_LENGTHS = [0.62, 0.3, 0.95, 0.44, 1.15, 0.26, 0.78];
const GAP_LENGTHS = [0.34, 0.52, 0.24, 0.62, 0.4];

const DASH_WIDTH = 0.075;
const DASH_HEIGHT = 0.05;

/** Camera sits slightly below the car, so there is more road visible ahead. */
const CAMERA_LEAD = 0.7;
const CAMERA_DISTANCE = 7.5;

/** Body roll into corners. */
const LEAN_GAIN = 1.1;
const MAX_LEAN = 0.17;
const LEAN_SMOOTHING = 0.12;
/** Ride motion, keyed to distance travelled so a parked car sits still. */
const HEAVE_AMPLITUDE = 0.013;
const PITCH_AMPLITUDE = 0.024;

const FORWARD = new THREE.Vector3(0, 0, 1);

interface ProjectJourneyProps {
  /** Scroll progress of the section, 0 to 1. */
  progress: MotionValue<number>;
  stations: JourneyStation[];
  /** Station currently being explained. */
  active: number;
  reduceMotion: boolean;
}

/**
 * A car driving a long, dashed route past one station per pipeline stage.
 *
 * The route is deliberately taller than the frustum. Rather than growing the
 * canvas to match — a viewport-height-multiple drawing buffer risks exceeding the
 * device's maximum renderbuffer — the canvas stays viewport-sized and the camera
 * travels down the route with the car. The scene overflows in world space, not in
 * DOM space.
 *
 * Stations are the curve's control points and scroll is remapped through their
 * arc-length positions, so the car sits exactly on a station at the moment that
 * station is highlighted.
 *
 * The road is one InstancedMesh of unevenly spaced blocks rather than a tube.
 * That gives hard-ended dashes with an irregular rhythm for a single draw call,
 * and the travelled portion is shown by recolouring instances rather than by
 * rebuilding anything.
 */
export default function ProjectJourney({
  progress,
  stations,
  active,
  reduceMotion,
}: ProjectJourneyProps) {
  const carRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<(THREE.Group | null)[]>([]);
  const dashRef = useRef<THREE.InstancedMesh>(null);

  const camera = useThree((state) => state.camera);
  const viewportWidth = useThree((state) => state.viewport.width);

  const scratch = useRef({
    point: new THREE.Vector3(),
    tangent: new THREE.Vector3(),
    ahead: new THREE.Vector3(),
    target: new THREE.Vector3(),
    colour: new THREE.Color(),
  });

  /** Carried between frames to derive travel and to smooth the body roll. */
  const ride = useRef({ t: 0, lean: 0, passed: -1 });

  const count = stations.length;
  const isNarrow = viewportWidth < NARROW_WORLD_WIDTH;

  /**
   * Rebuilt when the viewport changes width, because the route's horizontal
   * reach is a fraction of what is actually visible rather than a fixed number.
   */
  const { route, points, stationProgress, arcLength } = useMemo(() => {
    const reach = Math.min(MAX_REACH, viewportWidth * REACH_FRACTION);
    const last = Math.max(1, count - 1);

    const built = Array.from({ length: count }, (_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      return new THREE.Vector3(
        side * reach,
        (last / 2 - i) * STATION_SPACING,
        side * -DEPTH,
      );
    });

    const curve = new THREE.CatmullRomCurve3(built, false, "catmullrom", 0.5);

    // Convert each control point's curve parameter into arc-length progress, so
    // the constant-speed car and the evenly-indexed stations agree.
    const divisions = 800;
    const lengths = curve.getLengths(divisions);
    const total = lengths[divisions];
    const progressAt = built.map((_, i) =>
      total > 0 ? lengths[Math.round((i / last) * divisions)] / total : 0,
    );

    return {
      route: curve,
      points: built,
      stationProgress: progressAt,
      arcLength: total,
    };
  }, [count, viewportWidth]);

  /** Midpoint and length of every dash, walked along the route by arc length. */
  const dashes = useMemo(() => {
    const out: { at: number; length: number }[] = [];
    let travelled = 0;
    let i = 0;

    while (travelled < arcLength && out.length < 400) {
      const length = Math.min(
        DASH_LENGTHS[i % DASH_LENGTHS.length],
        arcLength - travelled,
      );
      out.push({ at: (travelled + length / 2) / arcLength, length });
      travelled += length + GAP_LENGTHS[i % GAP_LENGTHS.length];
      i += 1;
    }

    return out;
  }, [arcLength]);

  // Lay the dashes along the route once, then only their colours change.
  useEffect(() => {
    const mesh = dashRef.current;
    if (!mesh) return;

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    dashes.forEach((dash, i) => {
      route.getPointAt(dash.at, position);
      route.getTangentAt(dash.at, tangent);
      // The block's length runs along +Z, so turn +Z onto the tangent.
      quaternion.setFromUnitVectors(FORWARD, tangent.normalize());
      scale.set(DASH_WIDTH, DASH_HEIGHT, dash.length);

      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(i, matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
    ride.current.passed = -1; // force a colour pass on the next frame
  }, [dashes, route]);

  useFrame(() => {
    const p = reduceMotion ? 0 : clamp01(progress.get());

    const last = stationProgress.length - 1;
    const scaled = p * last;
    const leg = Math.min(Math.max(0, last - 1), Math.floor(scaled));
    const t = lerp(
      stationProgress[leg],
      stationProgress[leg + 1] ?? 1,
      scaled - leg,
    );

    const { point, tangent, ahead, target, colour } = scratch.current;
    route.getPointAt(t, point);
    route.getTangentAt(t, tangent);

    const car = carRef.current;
    if (car) {
      car.position.copy(point);
      target.copy(point).add(tangent);
      car.lookAt(target);
    }

    // Wheels roll by however far the car actually moved, so reversing the scroll
    // reverses them and a stationary car keeps its wheels still.
    const travelDelta = (t - ride.current.t) * arcLength;
    ride.current.t = t;

    if (!reduceMotion && travelDelta !== 0) {
      const spin = travelDelta / WHEEL_RADIUS;
      for (const wheel of wheelRefs.current) {
        if (wheel) wheel.rotation.x += spin;
      }
    }

    const body = bodyRef.current;
    if (body) {
      if (reduceMotion) {
        body.rotation.set(0, 0, 0);
        body.position.y = 0;
      } else {
        // Lean into the corner: how much the heading is about to change, taken
        // geometrically rather than from elapsed time, so the roll depends on
        // where the car is rather than on how fast the page is being scrolled.
        route.getTangentAt(Math.min(1, t + 0.012), ahead);
        const turn = ahead.x - tangent.x;
        const targetLean = Math.max(
          -MAX_LEAN,
          Math.min(MAX_LEAN, turn * LEAN_GAIN),
        );
        ride.current.lean = lerp(ride.current.lean, targetLean, LEAN_SMOOTHING);

        // Ride motion keyed to distance, so the car rocks as it travels rather
        // than idling on the spot.
        const travelled = t * arcLength;
        body.rotation.z = ride.current.lean;
        body.rotation.x = Math.sin(travelled * 4.2 + 1.1) * PITCH_AMPLITUDE;
        body.position.y = Math.sin(travelled * 5.5) * HEAVE_AMPLITUDE;
      }
    }

    camera.position.set(0, point.y - CAMERA_LEAD, CAMERA_DISTANCE);

    // Recolour only when the car has actually crossed a dash boundary.
    const mesh = dashRef.current;
    if (mesh) {
      let passed = 0;
      while (passed < dashes.length && dashes[passed].at <= t) passed += 1;

      if (passed !== ride.current.passed) {
        ride.current.passed = passed;
        for (let i = 0; i < dashes.length; i += 1) {
          colour.set(i < passed ? HAZARD : INK);
          mesh.setColorAt(i, colour);
        }
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      <ambientLight intensity={0.75} />

      {/* The road: uneven dashes, one draw call */}
      <instancedMesh
        ref={dashRef}
        args={[undefined, undefined, dashes.length]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {points.map((position, i) => {
        const station = stations[i];
        const isActive = i === active;
        const isPassed = i < active;
        const onLeft = position.x < 0;

        return (
          <group key={station.index} position={position}>
            <mesh>
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              <meshBasicMaterial
                color={isActive ? HAZARD : isPassed ? INK : VOID}
              />
              <Edges color={isActive ? VOID : HAZARD} />
            </mesh>

            <mesh position={[0, isActive ? 0.55 : 0.36, 0]}>
              <boxGeometry args={[0.03, isActive ? 0.7 : 0.32, 0.03]} />
              <meshBasicMaterial color={isActive ? HAZARD : INK} />
            </mesh>

            {isActive && (
              <Html
                position={[0, 0, 0]}
                zIndexRange={[10, 0]}
                style={{ pointerEvents: "none" }}
              >
                <div
                  className="brut-edge-thin border-hazard bg-void/92 w-[min(74vw,22rem)] p-4"
                  style={{
                    /*
                      Beside the block when there is room, centred below when
                      there is not. On a phone the panel is wider than the gap
                      between a station and the centre of the frame, so
                      offsetting sideways would push it off the far edge.
                    */
                    transform: isNarrow
                      ? "translate(-50%, 1.75rem)"
                      : onLeft
                        ? "translate(1.5rem, -50%)"
                        : "translate(calc(-100% - 1.5rem), -50%)",
                  }}
                >
                  <p className="text-hazard font-mono text-[10px] tracking-[0.3em] uppercase">
                    {station.index} / {station.title}
                  </p>
                  <p className="text-ink/80 mt-2 font-mono text-xs leading-relaxed">
                    {station.body}
                  </p>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      <group ref={carRef}>
        <Car bodyRef={bodyRef} wheelRefs={wheelRefs} />
      </group>
    </group>
  );
}
