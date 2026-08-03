"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import ExplodingBox from "@/components/three/ExplodingBox";

/** The three clickable cubes on the landing scene. */
const CUBES = [
  {
    name: "Home",
    position: [-3, 0, -1] as [number, number, number],
    color: "#ffff00",
    satelliteColor: "#ffff00",
    href: "/three-projects",
    heading: "Home",
    body: "Radhe Radhe!! This is my new project of 3D portFolio 😄",
  },
  {
    name: "About Me",
    position: [3, 0, -1] as [number, number, number],
    color: "#ffffff",
    satelliteColor: "#ffffff",
    href: "/about",
    heading: "Chintan",
    body: "I'm a trainee developer working with ThreeJS, also a Frontend Dev 🙂‍↔",
  },
  {
    name: "Contact Me",
    position: [0, 0, 3] as [number, number, number],
    color: "#ff2200",
    satelliteColor: "#ffffff",
    href: "/projects",
    heading: "Contact",
    body: "Open to frontend and 3D work. Reach me on any of the links in the About section.",
  },
];

export default function SceneCanvas() {
  return (
    <Suspense fallback={null}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        className="flex items-center justify-center border-none"
        style={{
          // Flat black. The old blue-tinted gradient was the last soft edge in
          // the scene chrome, and brutalism does not blend.
          background: "#000000",
          margin: 0,
          overflow: "hidden",
        }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Stars
          radius={100}
          depth={50}
          count={1000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />

        {CUBES.map((cube) => (
          <ExplodingBox
            key={cube.name}
            name={cube.name}
            position={cube.position}
            color={cube.color}
            satelliteColor={cube.satelliteColor}
            href={cube.href}
            infoContent={
              <>
                <h3 className="font-display text-hazard text-sm tracking-[0.2em] uppercase">
                  {cube.heading}
                </h3>
                <p className="text-ink/75 mt-2 font-mono text-[11px] leading-relaxed">
                  {cube.body}
                </p>
              </>
            }
          />
        ))}

        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.2} />
        </EffectComposer>
      </Canvas>
    </Suspense>
  );
}
