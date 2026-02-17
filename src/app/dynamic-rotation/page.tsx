"use client";
import { useEffect, useRef, useState } from "react";

function RevolvingCircle({radiusValue}:{radiusValue:number}) {
    const refPoint = useRef<HTMLDivElement>(null);
    // revolve the circle around one fixed point

    const [angle, setAngle] = useState(0);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    // Smooth, faster animation using requestAnimationFrame
    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();
        const speed = 0.004; // radians per millisecond (increase for faster rotation)

        const animate = (time: number) => {
            const delta = time - lastTime;
            lastTime = time;
            setAngle((prev) => prev + delta * speed);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    useEffect(() => {
        setX(Math.cos(angle) * radiusValue); 
        setY(Math.sin(angle) * radiusValue);
    }, [angle, radiusValue]);
    
  return (  
    <div
      ref={refPoint}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      className="w-10 h-10 mask-circle border-2 border-cyan-300 rounded-full"
    >
    </div>
  );
}

export default function DynamicRotation() {

    const [radius, setRadius] = useState(40);
    useEffect(() => {
        setRadius(radius);
    }, [radius]);
    
  return (
    <div className="flex flex-col items-center justify-center my-[800]">
      <span className="text-4xl font-bold text-center text-cyan-300 mb-10">
        Dynamic Rotation
      </span>
      <div>
        <input value={radius} onChange={(e) => setRadius(Number(e.target.value))}/>   
        <RevolvingCircle radiusValue={radius}/>
      </div>
    </div>
  );
}
