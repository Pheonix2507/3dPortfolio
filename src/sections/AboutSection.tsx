"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AsciiPortrait from "@/components/ui/AsciiPortrait";
import BrutalBox from "@/components/ui/BrutalBox";
import SplitFlapBoard from "@/components/ui/SplitFlapBoard";
import { socialLinks } from "@/data/socials";
import { siteConfig, statusPhrases } from "@/data/site";

export default function AboutSection() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Portrait, rendered as characters rather than pixels */}
        <div className="lg:col-span-5">
          <div className="group relative">
            <span className="bg-void text-alert absolute -top-3 left-4 z-10 px-2 font-mono text-[10px] tracking-[0.3em] uppercase">
              Subject // Portrait
            </span>

            <BrutalBox
              accent="alert"
              surface="void"
              className="h-[420px] w-full overflow-hidden md:h-[460px]"
            >
              <AsciiPortrait
                src="/potrait.jpg"
                alt={`Portrait of ${siteConfig.name}, rendered as ASCII characters`}
              />

              {/* Registration marks, purely structural decoration */}
              <span
                aria-hidden="true"
                className="border-hazard/70 absolute top-2 left-2 h-5 w-5 border-t-2 border-l-2"
              />
              <span
                aria-hidden="true"
                className="border-hazard/70 absolute right-2 bottom-2 h-5 w-5 border-r-2 border-b-2"
              />
            </BrutalBox>

            <p className="text-ink/35 mt-3 font-mono text-[10px] tracking-[0.25em] uppercase">
              Sampled to a character grid on hover
            </p>
          </div>
        </div>

        {/* Copy */}
        <div className="lg:col-span-7">
          <h2 className="font-display text-ink text-[clamp(2.25rem,7vw,4.5rem)] leading-[0.85] tracking-tighter uppercase">
            {siteConfig.name.split(" ")[0]}
            <br />
            <span className="text-hazard">{siteConfig.name.split(" ")[1]}</span>
          </h2>

          <div className="brut-rule mt-5" />

          <p className="text-ink/60 mt-6 max-w-2xl font-mono text-sm leading-relaxed">
            Full stack developer working in React, Next.js and TypeScript, with
            production Go, PostgreSQL and Kubernetes behind it. I build design
            systems, data-dense dashboards that stay fast, and the services that
            feed them, and I spend the rest of my time on interactive 3D that
            rewards poking at it.
          </p>

          {/* Contact grid */}
          <div className="mt-8">
            <p className="text-ink/40 mb-3 font-mono text-[10px] tracking-[0.3em] uppercase">
              Connect // Open for collabs
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brut-edge-thin group border-ink/30 bg-surface/60 hover:border-hazard hover:bg-hazard/10 flex flex-col items-start gap-2 p-3 transition-all duration-150 hover:-translate-y-1"
                >
                  <Icon className="text-hazard h-4 w-4" />
                  <span className="text-ink/70 group-hover:text-ink font-mono text-[10px] tracking-[0.2em] uppercase">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-10 max-w-md"
          >
            <SplitFlapBoard phrases={statusPhrases} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
