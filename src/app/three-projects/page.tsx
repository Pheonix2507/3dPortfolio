'use client';
import CameraCanvas from "@/app/components/CameraCanvas"

export default function ProjectsContent() {
  return (
    <div className="pt-24 px-6 min-h-screen text-white text-center">
      <h1 className="text-4xl font-bold mb-10">My 3D Projects</h1>
       <span className="text-white block p-5">Camera Scenematic</span>
        <div className="mx-auto lg:w-[50vw] lg:h-[50vh] w-[90vw] h-[50vh] border-5 outline-offset-4 border-white rounded-xl"><CameraCanvas/></div>
        <span className="text-white block mt-4 p-5">Click on the cubes to explore more!</span>
<hr/>
        <span className="text-white block p-5 pt-10">Project 2</span>
        <div className="mx-auto lg:w-[50vw] lg:h-[50vh] w-[90vw] h-[50vh] border-5 outline-offset-4 border-white rounded-xl"></div>
        <span className="text-white block mt-4 p-5">Click on the cubes to explore more!</span>
    </div>
  );
}
