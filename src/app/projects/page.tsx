'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const projects = [
  {
    title: '🎉 Event Site for Synapse (DAIICT)',
    role: 'Frontend Developer',
    tech: 'React, Node JS, Tailwind CSS, GSAP, TypeScript, AWS, Vercel',
    description:
      'Implemented UI features dynamically based on ongoing feedback from the designer. Collaborated effectively with a cross-functional team to complete the site within 2 to 3 weeks.',
    link: 'https://www.synapse-daiict.co.in/',
  },
  {
    title: 'Vahaan Record Portal',
    role: 'Frontend Developer',
    tech: 'React, TailWind CSS, ShadCN UI, NestJS, SQL, TypeScript, Vercel, Render',
    description:
      'Freelance project with one backend developer. Three-panel system for Superadmin, Employee, and Clients with forms, payments, and task management.',
    link: 'https://adviz-portal-fe.vercel.app/',
  },
  {
    title: 'Markencr - Startup Website',
    role: 'Primary Developer',
    tech: 'Next, JavaScript, Locomotive Scroll, Tailwind CSS, Vercel',
    description:
      'Startup focused on UI design services. Built responsive UI from mockups and integrated TopMate for client communication.',
    link: 'https://markencr-test.vercel.app/',
  },

];

export default function ProjectsContent() {
  return (
    <div className="pt-24 px-6 text-white space-y-10">
      {/* <h1 className="text-4xl font-bold">My Projects</h1> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-15 place-items-center">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.5, ease: 'easeOut' }}
          >
            <div className="parallax-card">
              <Card className="relative bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-cyan-300">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-300 space-y-2">
                  <p><strong>Role:</strong> {project.role}</p>
                  <p><strong>Tech Stack:</strong> {project.tech}</p>
                  <p>{project.description}</p>
                  {project.link && (
                    <a
                      href={project.link}
                      className="text-cyan-400 underline text-sm"
                      target="_blank"
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
