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
    title: "Kubernetes Cost Analyzer",
    role: "Solo Developer",
    tech: [
      "Go",
      "Kubernetes",
      "Prometheus",
      "PostgreSQL",
      "Helm",
      "Next.js",
      "TypeScript",
    ],
    description:
      "Attributes Kubernetes spend to the teams and workloads that cause it. Clusters bill for what you reserve rather than what you use, so the waste is the gap between the two: a Go collector reads live topology through client-go informers and usage from Prometheus, then writes container-grain rows into a partitioned Postgres star schema with exact decimal money throughout. A Helm chart installs the collector, API and nightly rollup into a cluster, with a Next.js dashboard reading it behind a server-side API key.",
    link: "https://github.com/Pheonix2507/kubernetes-cost-analyzer",
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
