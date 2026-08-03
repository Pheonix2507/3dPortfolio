/**
 * Single source of truth for anything that describes the site itself.
 * Consumed by the root metadata and the navbar.
 */
export const siteConfig = {
  name: "Chintan Bhara",
  alias: "Ghost",
  shortName: "Chintu's 3D Portfolio",
  title: "Chintan Bhara — Interactive 3D Portfolio",
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

/** Sections on the landing page, in order. Drives the navbar. */
export const navSections = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "dynamic-rotation", label: "Playground" },
] as const;
