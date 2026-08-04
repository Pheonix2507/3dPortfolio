import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "./site-url";

describe("resolveSiteUrl", () => {
  it("prefers an explicit NEXT_PUBLIC_SITE_URL", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://chintan.dev",
        VERCEL_PROJECT_PRODUCTION_URL: "ignored.vercel.app",
      }),
    ).toBe("https://chintan.dev");
  });

  it("falls back to the Vercel production domain and adds the protocol", () => {
    expect(
      resolveSiteUrl({
        VERCEL_PROJECT_PRODUCTION_URL: "3d-portfolio-bice-ten.vercel.app",
      }),
    ).toBe("https://3d-portfolio-bice-ten.vercel.app");
  });

  it("falls back to localhost when nothing is set", () => {
    expect(resolveSiteUrl({})).toBe("http://localhost:3000");
  });

  /**
   * Regression: the first version used `??`, which only catches null and
   * undefined. A variable that exists but is empty returned "" and produced
   * relative Open Graph and sitemap URLs that no crawler can resolve.
   */
  it("treats a blank variable as unset rather than as an empty origin", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "",
        VERCEL_PROJECT_PRODUCTION_URL: "fallback.vercel.app",
      }),
    ).toBe("https://fallback.vercel.app");

    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "   ",
      }),
    ).toBe("http://localhost:3000");

    expect(
      resolveSiteUrl({
        VERCEL_PROJECT_PRODUCTION_URL: "  ",
      }),
    ).toBe("http://localhost:3000");
  });

  it("strips trailing slashes so paths do not end up doubled", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://x.dev/" })).toBe(
      "https://x.dev",
    );
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://x.dev///" })).toBe(
      "https://x.dev",
    );
    expect(
      resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app/" }),
    ).toBe("https://x.vercel.app");
  });

  it("never returns a value ending in a slash", () => {
    for (const env of [
      { NEXT_PUBLIC_SITE_URL: "https://a.dev/" },
      { VERCEL_PROJECT_PRODUCTION_URL: "b.vercel.app/" },
      {},
    ]) {
      expect(resolveSiteUrl(env).endsWith("/")).toBe(false);
    }
  });
});
