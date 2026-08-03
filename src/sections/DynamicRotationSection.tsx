"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import RevolvingCircle from "@/components/three/RevolvingCircle";

const MIN_RADIUS = 0.5;
const MAX_RADIUS = 4;

export default function DynamicRotationSection() {
  const [radius, setRadius] = useState(2);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-24">
      <h2 className="mb-10 text-center text-4xl font-bold text-cyan-300">
        Dynamic Rotation
      </h2>

      <div className="mb-6 flex w-full max-w-sm flex-col gap-2">
        <label
          htmlFor="orbit-radius"
          className="flex justify-between text-sm text-white/70"
        >
          <span>Orbit radius</span>
          <span className="font-mono text-cyan-300">{radius.toFixed(1)}</span>
        </label>
        <input
          id="orbit-radius"
          type="range"
          min={MIN_RADIUS}
          max={MAX_RADIUS}
          step={0.1}
          value={radius}
          onChange={(event) => setRadius(Number(event.target.value))}
          className="accent-cyan-400"
        />
      </div>

      <div className="mx-auto h-[50vh] w-[90vw] rounded-xl border-4 border-white lg:h-[60vh] lg:w-[60vw]">
        <Canvas camera={{ position: [0, 0, 9], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[6, 6, 8]} intensity={1.2} />
          <RevolvingCircle radius={radius} />
        </Canvas>
      </div>
    </div>
  );
}
