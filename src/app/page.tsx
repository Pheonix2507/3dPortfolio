import ScrollReveal from "@/components/motion/ScrollReveal";
import ParallaxReveal from "@/components/motion/ParallaxReveal";
import Scroll3DBackground from "@/components/three/Scroll3DBackground";
import Marquee from "@/components/ui/Marquee";
import SectionHeading from "@/components/ui/SectionHeading";
import HeroSection from "@/sections/HeroSection";
import ProjectsSection from "@/sections/ProjectsSection";
import AboutSection from "@/sections/AboutSection";
import DynamicRotationSection from "@/sections/DynamicRotationSection";
import { tickerItems } from "@/data/site";

/**
 * The landing page stitches the sections together. It stays a server component
 * — each section opts into the client itself, so the page shell ships no JS.
 */
export default function Home() {
  return (
    <main className="text-ink min-h-screen">
      <Scroll3DBackground />

      <section id="home" className="pt-28 lg:pt-36">
        <HeroSection />
      </section>

      <Marquee items={tickerItems} className="mt-24" />

      <section id="projects" className="pt-24 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              index="02"
              eyebrow="Work"
              title="Projects"
              meta="Selected freelance and event builds"
            />
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.1}>
          <div className="mt-14">
            <ProjectsSection />
          </div>
        </ScrollReveal>
      </section>

      <section id="about" className="pt-32 lg:pt-40">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              index="03"
              eyebrow="Profile"
              title="About"
              meta="Who is behind the cubes"
            />
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.1}>
          <div className="mt-14">
            <AboutSection />
          </div>
        </ScrollReveal>

        <ParallaxReveal
          text="Welcome to my world of interactive 3D and motion."
          focusIndex={0}
          revealThreshold={0.15}
        />
      </section>

      <Marquee items={tickerItems} className="mt-24" />

      <section id="dynamic-rotation" className="pt-24 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              index="04"
              eyebrow="Lab"
              title="Playground"
              meta="Experiments that are not projects yet"
            />
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.1}>
          <div className="mt-14">
            <DynamicRotationSection />
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
