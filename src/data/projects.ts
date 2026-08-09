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
      "Docker",
      "Next.js",
    ],
    description:
      "Attributes Kubernetes spend to the teams and workloads that cause it. Clusters bill for what you reserve rather than what you use, so the waste is the gap between the two: client-go informers and PromQL feed a cost engine that splits spend and waste across ten dimensions, into a partitioned Postgres star schema with exact decimal money throughout. A nightly rollup compresses history 292x into immutable monthly statements, served by a versioned REST API with bearer auth, cursor pagination and rate limiting. Ships as a Helm chart with Prometheus alert rules and a Next.js dashboard typed from the OpenAPI spec.",
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
