"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import BrutalBox from "@/components/ui/BrutalBox";
import SkeuoSlider from "@/components/ui/SkeuoSlider";
import AxisSphere from "@/components/three/AxisSphere";

const MIN_SPIN = 0;
const MAX_SPIN = 1.5;
const MIN_TILT = -45;
const MAX_TILT = 45;

export default function DynamicRotationSection() {
  const [spin, setSpin] = useState(0.35);
  const [tilt, setTilt] = useState(23.5);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Control panel */}
        <div className="lg:col-span-4">
          <p className="text-ink/40 mb-3 font-mono text-[10px] tracking-[0.3em] uppercase">
            Panel // Axis control
          </p>

          <div className="space-y-5">
            <SkeuoSlider
              id="axis-spin"
              label="Spin"
              value={spin}
              min={MIN_SPIN}
              max={MAX_SPIN}
              step={0.05}
              onChange={setSpin}
              readout={`${spin.toFixed(2)} rev/s`}
            />

            <SkeuoSlider
              id="axis-tilt"
              label="Axis tilt"
              value={tilt}
              min={MIN_TILT}
              max={MAX_TILT}
              step={0.5}
              onChange={setTilt}
              readout={`${tilt.toFixed(1)}°`}
            />
          </div>

          <dl className="mt-6 space-y-2 font-mono text-[11px] tracking-[0.15em] uppercase">
            {[
              ["Surface", "GLSL shader"],
              ["Shading", "3-step posterised"],
              ["Edges", "step(), no blend"],
              ["Segments", "96 × 96"],
            ].map(([key, value]) => (
              <div
                key={key}
                className="border-ink/10 flex items-baseline justify-between gap-4 border-b pb-1.5"
              >
                <dt className="text-ink/40">{key}</dt>
                <dd className="text-ink/75">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="text-ink/45 mt-5 max-w-xs font-mono text-xs leading-relaxed">
            The surface is a hand-written shader. Every colour edge is snapped
            with step(), so the bands, ribs and terminator stay hard rather than
            fading out. Drag the scene to orbit it.
          </p>
        </div>

        {/* Scene */}
        <div className="relative lg:col-span-8">
          <span className="bg-void text-hazard absolute -top-3 left-4 z-10 px-2 font-mono text-[10px] tracking-[0.3em] uppercase">
            Scene_03 // Axis_Rotation
          </span>

          <BrutalBox
            accent="hazard"
            surface="void"
            className="h-[45vh] w-full overflow-hidden lg:h-[60vh]"
          >
            <Canvas camera={{ position: [0, 0, 6.5], fov: 50 }}>
              <AxisSphere spin={spin} tilt={tilt} />
              <OrbitControls
                enablePan={false}
                minDistance={4}
                maxDistance={12}
              />
            </Canvas>
          </BrutalBox>
        </div>
      </div>
    </div>
  );
}
