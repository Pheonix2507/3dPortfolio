import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing to index behind the résumé redirect; it is a 307 to a PDF on
      // another host, so crawling it only wastes the budget.
      disallow: "/resume",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
