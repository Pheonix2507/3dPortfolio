'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const projects = [
  {
    title: '🎉 Event Site for Synapse (DAIICT)',
    role: 'Frontend Developer',
    tech: 'Next.js, GitHub, UI Collaboration',
    description: 'Built the official site for DAIICT\'s techfest Synapse. Maintained the GitHub page and collaborated with designers and backend devs to ship a functional, scalable event platform.',
    link: null,
  },
  {
    title: '🏡 Real Estate (Land) Site',
    role: 'Team Lead / Fullstack Developer',
    tech: 'MongoDB, Firebase, GitHub',
    description: 'College SE project simulating real-world team dynamics. Built the site from scratch, integrated databases, handled deployment, and led the entire GitHub pipeline.',
    link: null,
  },
  {
    title: '📊 CodeInbound - Survey Form Builder',
    role: 'Freelancer Project',
    tech: 'React, Custom Forms, Deployment',
    description: 'Developed a secure React-based dynamic survey form system. Supported multiple question types, validation ranges, and client-side editing for B2B survey deployment.',
    link: null,
  },
];

export default function ProjectsContent() {
  return (
    <div className="pt-24 px-6 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-10">My Projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.5, ease: 'easeOut' }}
          >
            <Card className="bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg hover:shadow-cyan-500/20 transition duration-300">
              <CardHeader>
                <CardTitle className="text-cyan-300">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-300 space-y-2">
                <p><strong>Role:</strong> {project.role}</p>
                <p><strong>Tech Stack:</strong> {project.tech}</p>
                <p>{project.description}</p>
                {project.link && (
                  <a href={project.link} className="text-cyan-400 underline text-sm" target="_blank">
                    View Project
                  </a>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
