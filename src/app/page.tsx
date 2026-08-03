import ScrollReveal from "@/components/motion/ScrollReveal";
import ParallaxReveal from "@/components/motion/ParallaxReveal";
import Scroll3DBackground from "@/components/three/Scroll3DBackground";
import HeroSection from "@/sections/HeroSection";
import ProjectsSection from "@/sections/ProjectsSection";
import AboutSection from "@/sections/AboutSection";
import DynamicRotationSection from "@/sections/DynamicRotationSection";

/**
 * The landing page stitches the sections together. It stays a server component
 * — each section opts into the client itself, so the page shell ships no JS.
 */
export default function Home() {
  return (
    <main className="min-h-screen text-white">
      <Scroll3DBackground />

      <section id="home" className="pt-20 text-center">
        <HeroSection />
      </section>

      <section id="projects" className="pt-32">
        <ScrollReveal>
          <h2 className="mb-10 text-center text-4xl font-bold text-cyan-300">
            My Projects
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ProjectsSection />
        </ScrollReveal>
      </section>

      <section id="about" className="pt-32">
        <ScrollReveal delay={0.1}>
          <AboutSection />
        </ScrollReveal>

        <ParallaxReveal
          text="Welcome to my world of interactive 3D and motion."
          focusIndex={0}
          revealThreshold={0.15}
        />
      </section>

      <section id="dynamic-rotation" className="pt-32">
        <ScrollReveal delay={0.1}>
          <DynamicRotationSection />
        </ScrollReveal>
      </section>
    </main>
  );
}
