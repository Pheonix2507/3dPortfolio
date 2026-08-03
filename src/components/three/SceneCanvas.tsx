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
    color: "#ccff00",
    satelliteColor: "cyan",
    href: "/three-projects",
    heading: "Home",
    body: "Radhe Radhe!! This is my new project of 3D portFolio 😄",
  },
  {
    name: "About Me",
    position: [3, 0, -1] as [number, number, number],
    color: "#00ffff",
    satelliteColor: "white",
    href: "/about",
    heading: "Chintu",
    body: "I'm a trainee developer working with ThreeJS, also a Frontend Dev 🙂‍↔",
  },
  {
    name: "Contact Me",
    position: [0, 0, 3] as [number, number, number],
    color: "#7fff00",
    satelliteColor: "yellow",
    href: "/projects",
    heading: "Contact",
    body: "Checkout my Instagram: WebDevChintuworks 😅! No promotions, just fun projects.",
  },
];

export default function SceneCanvas() {
  return (
    <Suspense fallback={null}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        className="flex items-center justify-center rounded-xl border-none"
        style={{
          background: "linear-gradient(135deg, #191921, #0e0d1f, #0e0e1a)",
          backgroundAttachment: "fixed",
          margin: 0,
          overflow: "hidden",
          color: "var(--foreground)",
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
                <h3>
                  <b>{cube.heading}</b>
                </h3>
                <p>{cube.body}</p>
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
