'use client';
import dynamic from 'next/dynamic';
import ScrollReveal from '@/app/components/ScrollReveal';

const SceneCanvas = dynamic(() => import('@/app/components/SceneCanvas'), { ssr: false });
const About = dynamic(() => import('@/app/about/page'), { ssr: false });
const Projects = dynamic(() => import('@/app/projects/page'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      {/* Hero */}
      <section id="home" className="pt-20 text-center">
        <span className="block p-5">Welcome to My Interactive 3D Page</span>
        <div className="mx-auto lg:w-[70vw] lg:h-[70vh] w-[90vw] h-[50vh] border-5 outline-offset-4 border-white rounded-xl">
          <SceneCanvas />
        </div>
        <span className="block mt-4 pt-5">Click on the cubes to explore more!</span>
      </section>

      {/* Projects Section */}
      <section id="projects" className="pt-32">
        <ScrollReveal>
          <h2 className="text-4xl font-bold text-center text-cyan-300 mb-10">
            My Projects
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Projects />
        </ScrollReveal>
      </section>

      {/* About Section */}
      <section id="about" className="pt-32 pb-32">
        <ScrollReveal>
          <h2 className="text-4xl font-bold text-center text-cyan-300 mb-10">
            About Me
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <About />
        </ScrollReveal>
      </section>
    </main>
  );
}
