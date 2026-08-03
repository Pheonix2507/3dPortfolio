export interface Project {
  title: string;
  role: string;
  /** Rendered as individual tags on the project cards. */
  tech: string[];
  description: string;
  link?: string;
}

export const projects: Project[] = [
  {
    title: "MBS Global",
    role: "Lead Frontend Developer",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Strapi CMS",
      "Vercel",
    ],
    description:
      "B2B corporate and lead-generation site for an enterprise workforce-services firm, built from scratch on the Next.js App Router. Custom Strapi REST client with request de-duplication, timeouts and tag-based caching, plus a secret-protected webhook that revalidates content on CMS edits without a redeploy. Around ten routes and 35 components.",
    link: "https://www.mbsglobal.io/",
  },
  {
    title: "Vahaan Record Portal",
    role: "Frontend Lead",
    tech: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "NestJS",
      "SQL",
      "Vercel",
    ],
    description:
      "Multi-role B2B portal covering Admin, Employee and Client panels, owned end-to-end on the frontend alongside a NestJS and SQL backend collaborator. Role-based dashboards, data tables and forms built on a reusable component set.",
    link: "https://adviz-portal-fe.vercel.app/",
  },
  {
    title: "Markencr",
    role: "Primary Developer",
    tech: [
      "Next.js",
      "JavaScript",
      "Locomotive Scroll",
      "Tailwind CSS",
      "Vercel",
    ],
    description:
      "Responsive marketing site for a design-services startup, built with their team and integrating TopMate for client communication.",
    link: "https://markencr-test.vercel.app/",
  },
];
