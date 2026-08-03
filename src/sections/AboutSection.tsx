"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { socialLinks } from "@/data/socials";

export default function AboutSection() {
  return (
    <div className="ms-10 min-h-screen">
      <div className="max-w-4xl">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <figure className="w-full max-w-sm flex-none md:w-80">
            <div className="rounded-2xl bg-linear-to-br from-white/10 via-white/5 to-white/10 p-1">
              <div className="relative flex h-100 w-full rotate-1 items-center justify-center overflow-hidden rounded-xl bg-slate-900 transition-transform duration-700 hover:rotate-0 md:h-80">
                <Image
                  src="/potrait.jpg"
                  alt="Portrait of Chintan Bhara"
                  fill
                  sizes="(min-width: 768px) 20rem, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 mix-blend-overlay ring-1 ring-white/5" />
                <span className="absolute -top-3 -left-3 h-6 w-6 rounded-sm border-t-2 border-l-2 border-white/20" />
                <span className="absolute -right-3 -bottom-3 h-6 w-6 rounded-sm border-r-2 border-b-2 border-white/20" />
              </div>
            </div>
          </figure>

          <div className="flex-1">
            <h1 className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent drop-shadow-[0_0_15px_rgba(0,255,255,0.2)] sm:text-5xl md:text-6xl">
              Yo!! I&apos;m <span className="text-cyan-300">Chintan</span> aka{" "}
              <span className="text-cyan-300">Ghost</span>.
            </h1>

            <p className="mt-2 text-lg font-bold text-white/80">
              Frontend &amp; 3D enthusiast — building interactive web
              experiences.
            </p>
          </div>
        </div>
      </div>

      <p className="my-8 max-w-2xl text-lg text-white/70">
        I craft{" "}
        <span className="font-medium text-cyan-300">
          interactive 3D web experiences
        </span>{" "}
        with motion, depth, and story. Currently exploring futuristic interfaces
        and creative web design.
      </p>

      <div className="my-6 h-[2px] w-32 bg-linear-to-r from-transparent via-cyan-400/60 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="relative mb-8 max-w-xl overflow-hidden rounded-2xl border border-cyan-500/10 bg-linear-to-br from-[#0b0c1a] via-[#141433] to-[#1a0033] p-6 text-white shadow-[0_0_25px_rgba(0,255,255,0.15)] transition-transform duration-500 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(0,255,255,0.25)]">
          {/* Glowing light orbs */}
          <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-cyan-500/10 mix-blend-screen blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-28 h-56 w-56 rounded-full bg-purple-600/10 mix-blend-screen blur-3xl" />

          <div className="mb-5 flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-cyan-300 drop-shadow-[0_0_5px_rgba(0,255,255,0.4)]">
                Connect with Ghost
              </h3>
              <p className="mt-1 text-sm text-white/70">
                Find me across the grid — open for collabs, projects, and chaos.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
