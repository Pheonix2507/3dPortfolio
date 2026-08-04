import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

/** Every route that should be indexed, with the landing page ranked highest. */
const ROUTES = [
  { path: "", priority: 1 },
  { path: "/projects", priority: 0.8 },
  { path: "/about", priority: 0.8 },
  { path: "/three-projects", priority: 0.6 },
  { path: "/dynamic-rotation", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Build time, not request time: these pages are statically generated, so the
  // deploy is the only moment anything can actually have changed.
  const lastModified = new Date();

  return ROUTES.map(({ path, priority }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
