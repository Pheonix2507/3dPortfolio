"use client";

import dynamic from "next/dynamic";
import { FileText } from "lucide-react";
import BrutalBox from "@/components/ui/BrutalBox";
import BrutalButton, { brutalButton } from "@/components/ui/BrutalButton";
import { siteConfig } from "@/data/site";

// WebGL scenes cannot render on the server, so this only loads in the browser.
const SceneCanvas = dynamic(() => import("@/components/three/SceneCanvas"), {
  ssr: false,
  loading: () => (
    <div className="bg-void flex h-full w-full items-center justify-center">
      <span className="text-hazard/70 font-mono text-[11px] tracking-[0.3em] uppercase">
        Booting scene…
      </span>
    </div>
  ),
});

export default function HeroSection() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
      {/* Masthead */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase">
            <span className="bg-hazard text-void px-1.5">01</span>
            <span className="text-ink/40">/</span>
            <span className="text-ink/60">Index</span>
          </div>

          <h1 className="font-display text-ink mt-4 text-[clamp(2.75rem,11vw,8rem)] leading-[0.82] tracking-tighter uppercase">
            Interactive
            <br />
            <span className="text-hazard">3D</span> Engineer
          </h1>

          <div className="brut-rule mt-6" />

          <p className="text-ink/60 mt-5 max-w-xl font-mono text-sm leading-relaxed">
            Full stack, front to back: React and TypeScript at the surface, Go
            and Postgres underneath, and WebGL when the interface should feel
            physical rather than decorative.
          </p>

          <div className="mt-7 flex flex-wrap gap-4">
            <BrutalButton tone="solid" onClick={() => scrollTo("projects")}>
              View work →
            </BrutalButton>
            <BrutalButton tone="ink" onClick={() => scrollTo("about")}>
              Get in touch
            </BrutalButton>
            {/*
              No `download` attribute: /resume redirects to an external host and
              browsers ignore `download` cross-origin, so it would quietly
              navigate instead of downloading. Opening in a tab is honest.
            */}
            <a
              href={siteConfig.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className={brutalButton({ tone: "hazard" })}
            >
              <FileText className="h-3.5 w-3.5" />
              Resume
            </a>
          </div>
        </div>

        {/* Spec block: brutalism likes exposing raw data */}
        <aside className="lg:col-span-4 lg:pt-12">
          <BrutalBox accent="bare" surface="glass" className="p-5">
            <dl className="space-y-3 font-mono text-[11px] tracking-[0.15em] uppercase">
              {[
                ["Role", "Full Stack"],
                ["Stack", "Next · TS · Go"],
                ["Based", "India"],
                ["Status", "Open to work"],
              ].map(([key, value]) => (
                <div
                  key={key}
                  className="border-ink/10 flex items-baseline justify-between gap-4 border-b pb-2 last:border-0"
                >
                  <dt className="text-ink/40">{key}</dt>
                  <dd className="text-ink/85 text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </BrutalBox>
        </aside>
      </div>

      {/* Scene */}
      <div className="relative mt-14 lg:mt-20">
        <span className="bg-void text-hazard absolute -top-3 left-4 z-10 px-2 font-mono text-[10px] tracking-[0.3em] uppercase">
          Scene_01 // Exploding_Cubes
        </span>

        <BrutalBox
          accent="hazard"
          surface="void"
          className="h-[55vh] w-full overflow-hidden lg:h-[70vh]"
        >
          <SceneCanvas />
        </BrutalBox>

        <div className="text-ink/45 mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.15em] uppercase">
          <span className="text-alert">◆</span>
          <span>Click a cube to detonate it</span>
          <span className="text-ink/20">|</span>
          <span>Drag to orbit</span>
        </div>
      </div>
    </div>
  );
}
