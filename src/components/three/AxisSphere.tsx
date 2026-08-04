"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

const VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vPositionL;
  varying vec3 vViewDir;

  void main() {
    // Local position stays in -1..1 because the geometry is a unit sphere and
    // the size comes from the mesh scale. Bands therefore travel with the spin.
    vPositionL = position;
    vNormalW = normalize(mat3(modelMatrix) * normal);

    vec4 world = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - world.xyz);

    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/**
 * Every colour decision is snapped with step(). Brutalism does not blend, so
 * there is no smoothstep and no gradient anywhere in here: the terminator, the
 * bands, the ribs and the rim are all hard edges.
 */
const FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec3 uVoid;
  uniform vec3 uInk;
  uniform vec3 uHazard;
  uniform vec3 uAlert;

  varying vec3 vNormalW;
  varying vec3 vPositionL;
  varying vec3 vViewDir;

  void main() {
    vec3 n = normalize(vNormalW);
    vec3 lightDir = normalize(vec3(0.65, 0.85, 0.55));
    float lambert = dot(n, lightDir);

    // Three-step posterised shading instead of a smooth falloff.
    float shade = step(-0.10, lambert) * 0.45 + step(0.42, lambert) * 0.55;

    // Latitude bands climbing the axis.
    float bands = step(0.0, sin(vPositionL.y * 15.0 - uTime * 1.8));

    // Sparse longitude ribs.
    float lon = atan(vPositionL.z, vPositionL.x);
    float ribs = step(0.965, abs(sin(lon * 9.0)));

    // A hard equator line, so the spin axis is readable.
    float equator = step(abs(vPositionL.y), 0.045);

    vec3 col = mix(uVoid, uInk, shade);
    col = mix(col, uHazard, bands * shade * 0.75);
    col = mix(col, uAlert, ribs);
    col = mix(col, uHazard, equator);

    // Rim, so the silhouette reads against a black page.
    float rim = 1.0 - max(dot(n, vViewDir), 0.0);
    col = mix(col, uHazard, step(0.80, rim));

    gl_FragColor = vec4(col, 1.0);
  }
`;

interface AxisSphereProps {
  /** Revolutions per second about the tilted axis. */
  spin: number;
  /** Axis lean away from vertical, in degrees. */
  tilt: number;
}

/**
 * A ball spinning on a visible, tiltable axis inside two gimbal rings. The
 * surface is a custom shader rather than a standard material so the colour
 * dynamics stay inside the palette and stay hard-edged.
 */
export default function AxisSphere({ spin, tilt }: AxisSphereProps) {
  const spinRef = useRef<THREE.Group>(null);
  const outerRing = useRef<THREE.Mesh>(null);
  const innerRing = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const reduceMotion = useReducedMotion() ?? false;

  // Initial values only. The clock is advanced through materialRef below,
  // because mutating a memoised object directly is not allowed.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVoid: { value: new THREE.Color("#000000") },
      uInk: { value: new THREE.Color("#ffffff") },
      uHazard: { value: new THREE.Color("#ffff00") },
      uAlert: { value: new THREE.Color("#ff2200") },
    }),
    [],
  );

  useFrame((_, delta) => {
    // Everything in this scene is decorative motion, so under reduced motion the
    // sphere simply sits still at its tilt with the shader clock stopped.
    if (reduceMotion) return;

    const material = materialRef.current;
    if (material) material.uniforms.uTime.value += delta;

    if (spinRef.current) {
      spinRef.current.rotation.y += delta * spin * Math.PI * 2;
    }

    // Gimbals drift on their own axes, counter to each other.
    if (outerRing.current) outerRing.current.rotation.z += delta * 0.18;
    if (innerRing.current) innerRing.current.rotation.x -= delta * 0.26;
  });

  return (
    <group rotation={[0, 0, (tilt * Math.PI) / 180]}>
      {/* The axis itself, deliberately not spinning. */}
      <mesh>
        <cylinderGeometry args={[0.018, 0.018, 4.4, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Pole caps */}
      {[1, -1].map((end) => (
        <mesh key={end} position={[0, end * 2.2, 0]}>
          <coneGeometry args={[0.07, 0.22, 16]} />
          <meshBasicMaterial color="#ff2200" />
        </mesh>
      ))}

      {/* Gimbal rings */}
      <mesh ref={outerRing} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.05, 0.01, 8, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.45} />
      </mesh>
      <mesh ref={innerRing} rotation={[0, Math.PI / 2.4, 0]}>
        <torusGeometry args={[1.78, 0.008, 8, 128]} />
        <meshBasicMaterial color="#ffff00" transparent opacity={0.35} />
      </mesh>

      {/* The ball */}
      <group ref={spinRef}>
        <mesh scale={1.5}>
          <sphereGeometry args={[1, 96, 96]} />
          <shaderMaterial
            ref={materialRef}
            vertexShader={VERTEX_SHADER}
            fragmentShader={FRAGMENT_SHADER}
            uniforms={uniforms}
          />
        </mesh>

        {/* Low-poly cage over the surface, so the rotation is legible. */}
        <mesh scale={1.53}>
          <sphereGeometry args={[1, 18, 12]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.14}
          />
        </mesh>
      </group>
    </group>
  );
}
