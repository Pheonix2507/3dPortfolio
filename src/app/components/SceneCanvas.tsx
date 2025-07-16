"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense } from "react";
import ExplodingBox from "@/app/components/ExplodingBox";
import { Stars } from "@react-three/drei";

// function ClickableBox({ name, position, color }: { name: string; position: [number, number, number]; color: string }) {
//   const handleClick = useCallback(() => {
//     console.log(`${name} clicked`);
//   }, [name]);

//   return (
//     <mesh position={position} onClick={handleClick}>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={color} />
//     </mesh>
//   );
// }

export default function SceneCanvas() {
    return (
        <Suspense>
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }} className="flex border-none rounded-xl item-center justify-center" 
            style={{
                background: "linear-gradient(135deg, #191921, #0e0d1f, #0e0e1a)",
                backgroundAttachment: "fixed",
                margin: 0,
                overflow: "hidden",
                color: "var(--foreground)"
            }} gl={{ preserveDrawingBuffer: true }}>
            {/* <Environment background files="/hdr/nebula.hdr"/> */}
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
            <ExplodingBox name="Home" position={[-3, 0, -1]} color="#ccff00" infoContent={
                <>
                    <h3><b>Home</b></h3>
                    <p>Radhe Radhe!! This is my new project of 3D portFolio😄
                        .</p>
                </>
            } />
            <ExplodingBox name="About Me" position={[3, 0, -1]} color="#00ffff" infoContent={
                <>
                    <h3><b>Chintu</b></h3>
                    <p>I&apos;m a trainee developer working with ThreeJS also a Frontend Dev🙂‍↔
                        .</p>
                </>
            } />
            <ExplodingBox name="Contact Me" position={[0, 0, 3]} color="#7fff00" infoContent={
                <>
                    <h3><b>Contact</b></h3>
                    <p>Checkout my Instagram : WebDevChintuworks😅! No promotions just watch fun projects and enjoy.</p>
                </>
            } />
            <EffectComposer>
                <Bloom intensity={1.5} luminanceThreshold={0.2} />
            </EffectComposer>
        </Canvas>
        </Suspense >
    );
}
