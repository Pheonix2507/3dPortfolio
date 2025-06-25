'use client'
import dynamic from "next/dynamic";

const SceneCanvas = dynamic(() => import("@/app/components/SceneCanvas"));

export default function Home() {
  return (
    <main>
      <SceneCanvas />
    </main>
  );
}
