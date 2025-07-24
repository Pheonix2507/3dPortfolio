"use client";

import React, { useState, useRef } from "react";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Trail } from '@react-three/drei';
import { useRouter } from 'next/navigation';

type Props = {
    name: string;
    position: [number, number, number];
    color: string;
    color2: string;
    access:string;
    infoContent: React.ReactNode
};

type PieceData = {
  id: number;
  from: THREE.Vector3;
  to: THREE.Vector3;
  delay: number;
  shape: string;
};

type PieceProps = {
    from: THREE.Vector3;
    to: THREE.Vector3;
    color: string;
    delay: number;
    isReturning: boolean;
    shape: string;
};

function ExplodingPiece({ from, to, color, delay, isReturning, shape }: PieceProps) {
    const start = isReturning ? to : from;
    const end = isReturning ? from : to;
    const meshRef = useRef<THREE.Mesh>(null);

    const { position } = useSpring({
        from: { position: start.toArray() },
        to: { position: end.toArray() },
        delay,
        config: { mass: 1, tension: 140, friction: 16 },
    });

    // 🔁 Rotate only when exploded (i.e., !isReturning)
    useFrame(() => {
        if (!isReturning && meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <animated.mesh ref={meshRef} position={position as unknown as [number, number, number]}>
            {shape === "box" && <boxGeometry args={[0.2, 0.2, 0.2]} />}
            {shape === "sphere" && <sphereGeometry args={[0.15, 16, 16]} />}
            {shape === "cone" && <coneGeometry args={[0.15, 0.3, 16]} />}
            {shape === "torus" && <torusGeometry args={[0.12, 0.04, 8, 24]} />}
            {shape === "octahedron" && <octahedronGeometry args={[0.15]} />}
            {shape === "cylinder" && <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />}
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </animated.mesh>

    );
}


export default function ExplodingBox({ position, color, infoContent,color2,access }: Props) {
    const [exploded, setExploded] = useState(false);
    const [piecesData, setPiecesData] = useState<PieceData[]>([]);
    const shapeTypes = ["box", "sphere", "cone", "torus", "octahedron", "cylinder"];
    const [isAnimating, setIsAnimating] = useState(false);
    const [hovered, setHovered] = useState(false);
    const orbitRef = useRef<THREE.Mesh>(null);
    const router = useRouter();
    const { orbitSpeed } = useSpring({
  orbitSpeed: hovered ? 0 : 1,
  config: { mass: 1, tension: 120, friction: 14 },
});

    const angleRef = useRef(0);

useFrame((_,delta) => {
  if (!orbitRef.current) return;

  // update angle only if not hovered
  if (!hovered) {
    angleRef.current += delta * orbitSpeed.get();
  }

  if (orbitRef.current && !exploded) {
    // const t = clock.getElapsedTime()/2;
    const radius = 1.5;
    orbitRef.current.position.set(
      position[0] + radius * Math.cos(angleRef.current),
      position[1] + radius * Math.cos(angleRef.current),
      position[2] + radius * Math.sin(angleRef.current)
    );
  }
});


    const handleClick = () => {
        if (isAnimating) return;

        setIsAnimating(true);

        if (!exploded) {
            const origin = new THREE.Vector3(...position);
            const newPieces = new Array(30).fill(null).map((_, i) => {
                const offset = new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                )
                    .normalize()
                    .multiplyScalar(1.5 + Math.random());

                return {
                    id: i,
                    from: origin.clone(),
                    to: origin.clone().add(offset),
                    delay: i * 20,
                    shape: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
                };
            });

            setPiecesData(newPieces);
            setExploded(true);

            // allow animation to finish
            setTimeout(() => setIsAnimating(false), 1500);
        } else {
            setExploded(false);

            // allow return animation to play before clearing
            setTimeout(() => {
                setPiecesData([]);
                setIsAnimating(false);
            }, 1500);
        }
    };

    return (
        <>
{!exploded && (
  <Trail
    width={5}
    length={10}
    color={color2}
    attenuation={(t) => t * t}
  >
    <mesh
      ref={orbitRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        // document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        // document.body.style.cursor = 'default';
      }}
      onClick={() => {
        router.push(`${access}`); // Change to your desired route
      }}
    >
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color={color2} emissive="cyan" emissiveIntensity={1}/>
    </mesh>
  </Trail>
)}



            {/* Only show the cube when it's not exploded and animation is over */}
            {!exploded && !isAnimating && piecesData.length === 0 && (
                <mesh position={position} onClick={handleClick}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color={color} />
                </mesh>
            )}

            {exploded && (<Html center position={[position[0], position[1] + 2, position[2]]}>
                <div
                    style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "16px",
                        padding: "1rem",
                        minWidth: "220px",
                        maxWidth: "300px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                        color: "#fff",
                        fontFamily: "sans-serif",
                        textAlign: "center",
                    }}
                >
                    {infoContent}
                </div>
            </Html>)}

            {/* Pieces when exploded or returning */}
            {piecesData.map((piece:PieceData) => (
                <ExplodingPiece
                    key={piece.id}
                    from={piece.from}
                    to={piece.to}
                    delay={piece.delay}
                    color={color}
                    isReturning={!exploded}
                    shape={piece.shape}
                />
            ))}


            {/* Always clickable transparent box */}
            <mesh position={position} onClick={handleClick}>
                <boxGeometry args={[1.5, 1.5, 1.5]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
        </>
    );
}
