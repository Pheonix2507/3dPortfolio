"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { brutalButton } from "@/components/ui/BrutalButton";
import TechTag from "@/components/ui/TechTag";
import TiltCard from "@/components/ui/TiltCard";
import { projects } from "@/data/projects";

export default function ProjectsSection() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
      <div className="grid grid-cols-1 items-stretch gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12, duration: 0.5, ease: "easeOut" }}
            className="h-full"
          >
            <TiltCard className="h-full">
              {/*
                Hover reaction, all on transforms and shadow so nothing clips:
                the card lifts up-left while its offset shadow deepens and turns
                hazard, which reads as the card rising off the page.
              */}
              <article
                className={[
                  "skeuo-raised brut-edge border-ink brut-shadow relative flex h-full flex-col",
                  "transition-[transform,box-shadow,border-color] duration-200 ease-out",
                  "group-hover:border-hazard group-hover:brut-shadow-lg",
                  "group-hover:-translate-x-1.5 group-hover:-translate-y-1.5",
                ].join(" ")}
              >
                {/* Header strip: inverts to solid hazard on hover */}
                <div className="border-ink/25 group-hover:bg-hazard flex items-center justify-between border-b-2 px-4 py-2.5 transition-colors duration-200 group-hover:border-black/60">
                  <span className="text-hazard font-mono text-[10px] tracking-[0.25em] uppercase transition-colors duration-200 group-hover:text-black">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className="bg-hazard h-2 w-2 transition-colors duration-200 group-hover:bg-black"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-4 p-4">
                  <h3 className="font-display text-ink text-xl leading-tight tracking-tight uppercase">
                    {project.title}
                  </h3>

                  <p className="text-alert font-mono text-[10px] tracking-[0.25em] uppercase">
                    {project.role}
                  </p>

                  <p className="text-ink/55 font-mono text-xs leading-relaxed">
                    {project.description}
                  </p>

                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {project.tech.map((tech) => (
                      <li key={tech}>
                        <TechTag>{tech}</TechTag>
                      </li>
                    ))}
                  </ul>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={brutalButton({
                        tone: "hazard",
                        className: "mt-2 w-full",
                      })}
                    >
                      View project
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
