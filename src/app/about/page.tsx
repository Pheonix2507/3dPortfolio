"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Image  from "next/image";
export default function HomeContent() {
  const socialLinks = [
    {
      href: "https://github.com/Pheonix2507",
      label: "GitHub",
      icon: <Github size={20} />,
    },
    {
      href: "https://instagram.com/chintu.003",
      label: "Instagram",
      icon: <Instagram size={20} />,
    },
    {
      href: "https://linkedin.com/in/chintub2",
      label: "LinkedIn",
      icon: <Linkedin size={20} />,
    },
    {
      href:"mailto:chintub2507@gmail.com",
      label:"Email",
      icon:<Mail size={20}/>,
    }
  ];

  return (
    <div className="min-h-screen ms-10">

      <div className="">
        <div className="max-w-4xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <figure className="flex-none w-full max-w-sm md:w-80">
              {/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/10 via-fuchsia-500/5 to-transparent blur-2xl" /> */}
              <div className="rounded-2xl p-1 bg-gradient-to-br from-white/10 via-white/5 to-white/10">
                <div className="relative bg-slate-900 rounded-xl overflow-hidden w-full h-100 md:h-80 flex items-center justify-center  transform rotate-1 hover:rotate-0 transition-transform duration-700">
                  <Image
                    src="/potrait.jpg"
                    alt="Framed portrait"
                    fill
                    className="absolute inset-0 w-full h-full object-fit"
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-white/5 mix-blend-overlay" />
                  <span className="absolute -left-3 -top-3 w-6 h-6 border-t-2 border-l-2 border-white/20 rounded-sm" />
                  <span className="absolute -right-3 -bottom-3 w-6 h-6 border-b-2 border-r-2 border-white/20 rounded-sm" />
                </div>
              </div>
            </figure>

            <div className="flex-1">
<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 drop-shadow-[0_0_15px_rgba(0,255,255,0.2)]">
  Yo!! I&apos;m <span className="text-cyan-300">Chintan</span> aka <span className="text-cyan-300">Ghost</span>.
</h1>


              <p className="mt-2 text-lg text-white/80 font-bold">
                Frontend & 3D enthusiast — building interactive web experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
<p className="text-lg text-white/70 my-8 max-w-2xl">
  I craft <span className="text-cyan-300 font-medium">interactive 3D web experiences</span> with motion, depth, and story.  
  Currently exploring futuristic interfaces and creative web design.
</p>

<div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent my-6"></div>

<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
>
<Card className="relative overflow-hidden max-w-xl p-6 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.15)] bg-gradient-to-br from-[#0b0c1a] via-[#141433] to-[#1a0033] border border-cyan-500/10 text-white mb-8 transition-transform duration-500 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(0,255,255,0.25)]">
  {/* Glowing light orbs */}
  <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl mix-blend-screen" />
  <div className="pointer-events-none absolute -left-28 -bottom-16 h-56 w-56 rounded-full bg-purple-600/10 blur-3xl mix-blend-screen" />

  {/* Header */}
  <div className="flex items-start justify-between mb-5">
    <div>
      <h3 className="text-2xl font-bold tracking-tight text-cyan-300 drop-shadow-[0_0_5px_rgba(0,255,255,0.4)]">
        Connect with Ghost
      </h3>
  
      <p className="mt-1 text-sm text-white/70">
        Find me across the grid — open for collabs, projects, and chaos.
      </p>
    </div>
    {/* <span className="text-xs px-3 py-1 bg-cyan-400/10 text-cyan-300/90 rounded-full border border-cyan-500/20 backdrop-blur-sm">
      Open to work
      </span> */}
  </div>

  {/* Social Links */}
  <div className="flex flex-wrap gap-3">
    {socialLinks.map(({ href, label, icon }) => (
      <Link
      key={label}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm text-sm font-medium text-white/80 hover:text-cyan-300"
      >
        {icon}
        <span>{label}</span>
      </Link>
    ))}
  </div>
</Card>
    </motion.div>

    </div>
  );
}
