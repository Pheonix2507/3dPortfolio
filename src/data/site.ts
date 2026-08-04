import { resolveSiteUrl } from "@/lib/site-url";

/**
 * Single source of truth for anything that describes the site itself.
 * Consumed by the root metadata and the navbar.
 */
export const siteConfig = {
  name: "Chintan Bhara",
  shortName: "Chintan Bhara",
  title: "Chintan Bhara — Interactive 3D Portfolio",
  /**
   * Stable link on this domain. The route redirects to RESUME_URL, so the PDF
   * itself stays out of the repo and can be replaced without a deploy.
   */
  resumePath: "/resume",
  description:
    "Frontend and 3D developer building interactive web experiences with React Three Fiber, Framer Motion and Next.js.",
  keywords: [
    "Chintan Bhara",
    "3D portfolio",
    "React Three Fiber",
    "Next.js",
    "Framer Motion",
    "creative developer",
    "frontend developer",
  ],
  /**
   * Origin used for canonical, Open Graph, sitemap and robots URLs.
   *
   * Resolved in order so that a correct deployment needs no manual setup:
   *
   *   1. NEXT_PUBLIC_SITE_URL — explicit override, e.g. a custom domain that is
   *      not yet the shortest one Vercel would pick.
   *   2. VERCEL_PROJECT_PRODUCTION_URL — set automatically on Vercel at build
   *      time, and always the production domain even on preview deployments, so
   *      previews do not advertise themselves as canonical. Carries no protocol.
   *   3. localhost, for development.
   *
   * Build and server only. Non-NEXT_PUBLIC variables are not exposed to the
   * browser, so a client component reading this would see the localhost
   * fallback. Nothing client-side uses it; keep it that way.
   */
  url: resolveSiteUrl(),
} as const;

/** Cycled on the split-flap status board in the about section. */
export const statusPhrases = [
  "BUILDING 3D WEB",
  "OPEN TO WORK",
  "SHIPPING MOTION",
  "BASED IN INDIA",
] as const;

/** Scrolling ticker copy used between sections. */
export const tickerItems = [
  "React Three Fiber",
  "WebGL",
  "Next.js",
  "TypeScript",
  "Framer Motion",
  "GLSL",
  "Tailwind CSS",
  "Motion Design",
] as const;

/**
 * Standalone routes, kept separate from the section anchors below because these
 * navigate rather than scroll. Without this, /three-projects was reachable only
 * by clicking a cube inside the hero WebGL scene.
 */
export const navRoutes = [
  { href: "/three-projects", label: "Scenes" },
] as const;

/** Sections on the landing page, in order. Drives the navbar. */
export const navSections = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "dynamic-rotation", label: "Playground" },
] as const;
