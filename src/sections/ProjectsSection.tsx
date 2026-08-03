"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/data/projects";

export default function ProjectsSection() {
  return (
    <div className="space-y-10 px-6 pt-24 text-white">
      <div className="grid grid-cols-1 place-items-center gap-y-15 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
          >
            <div className="parallax-card">
              <Card className="relative border border-white/10 bg-white/5 shadow-lg backdrop-blur-lg transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-cyan-300">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-300">
                  <p>
                    <strong>Role:</strong> {project.role}
                  </p>
                  <p>
                    <strong>Tech Stack:</strong> {project.tech.join(", ")}
                  </p>
                  <p>{project.description}</p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cyan-400 underline"
                    >
                      View Project
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
