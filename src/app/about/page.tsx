"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
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
    <div className="pt-20 min-h-screen ms-10">

      <div className="mb-8">
        <div className="max-w-4xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <figure className="flex-none w-full max-w-sm md:w-80">
              <div className="rounded-2xl p-1 bg-gradient-to-br from-white/10 via-white/5 to-white/10">
                <div className="relative bg-slate-900 rounded-xl overflow-hidden w-full h-100 md:h-80 flex items-center justify-center">
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl text-white font-bold leading-tight">
                Yoo!! This is Chintan aka Ghost.
              </h1>
              <p className="mt-2 text-sm text-white/70">
                Frontend & 3D enthusiast — building interactive web experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-lg text-gray-300 mb-8 ">
        Welcome to my personal website! I`&apos;`m a passionate developer and tech
        enthusiast. Here, you`&apos;`ll find information about my projects and ways to
        connect with me. Feel free to explore and reach out!
      </p>

      <Card className="relative overflow-hidden max-w-xl p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-slate-900 via-violet-900 to-pink-700 text-white mb-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5 blur-3xl mix-blend-overlay" />
        <div className="pointer-events-none absolute -left-20 -bottom-12 h-48 w-48 rounded-full bg-white/10 blur-2xl mix-blend-overlay" />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">
              Connect with Ghost
            </h3>
            <p className="mt-1 text-sm text-white/80">
              Find me on these platforms — always happy to collaborate.
            </p>
          </div>
          <span className="text-xs px-2 py-1 bg-white/10 rounded-full">
            Open to work
          </span>
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
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-transform hover:-translate-y-0.5 backdrop-blur-sm text-sm font-medium"
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
