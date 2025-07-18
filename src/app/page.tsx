'use client';
import dynamic from 'next/dynamic';
// import Navbar from '@/app/components/Navbar';

const SceneCanvas = dynamic(() => import('@/app/components/SceneCanvas'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="pt-20 text-center">
        <span className="text-white block p-5">Welcome to My Interactive 3D Page</span>
        <div className="mx-auto lg:w-[70vw] lg:h-[70vh] w-[90vw] h-[50vh] border-5 outline-offset-4 border-white rounded-xl"><SceneCanvas /></div>
        <span className="text-white block mt-4 pt-5">Click on the cubes to explore more!</span>
      </div>
    </main>
  );
}
