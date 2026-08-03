export interface Project {
  title: string;
  role: string;
  /** Rendered as a comma-separated list; kept structured so it can become chips. */
  tech: string[];
  description: string;
  link?: string;
}

export const projects: Project[] = [
  {
    title: "🎉 Event Site for Synapse (DAIICT)",
    role: "Frontend Developer",
    tech: [
      "React",
      "Node.js",
      "Tailwind CSS",
      "GSAP",
      "TypeScript",
      "AWS",
      "Vercel",
    ],
    description:
      "Implemented UI features dynamically based on ongoing feedback from the designer. Collaborated effectively with a cross-functional team to complete the site within 2 to 3 weeks.",
    link: "https://www.synapse-daiict.co.in/",
  },
  {
    title: "Vahaan Record Portal",
    role: "Frontend Developer",
    tech: [
      "React",
      "Tailwind CSS",
      "shadcn/ui",
      "NestJS",
      "SQL",
      "TypeScript",
      "Vercel",
      "Render",
    ],
    description:
      "Freelance project with one backend developer. Three-panel system for Superadmin, Employee, and Clients with forms, payments, and task management.",
    link: "https://adviz-portal-fe.vercel.app/",
  },
  {
    title: "Markencr - Startup Website",
    role: "Primary Developer",
    tech: [
      "Next.js",
      "JavaScript",
      "Locomotive Scroll",
      "Tailwind CSS",
      "Vercel",
    ],
    description:
      "Startup focused on UI design services. Built responsive UI from mockups and integrated TopMate for client communication.",
    link: "https://markencr-test.vercel.app/",
  },
];
