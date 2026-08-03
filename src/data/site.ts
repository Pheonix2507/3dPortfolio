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
   * Set NEXT_PUBLIC_SITE_URL in the deploy environment so absolute URLs in
   * Open Graph tags resolve correctly. Falls back to localhost in dev.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
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

/** Sections on the landing page, in order. Drives the navbar. */
export const navSections = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "dynamic-rotation", label: "Playground" },
] as const;
