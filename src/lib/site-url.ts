/**
 * Treats a blank or whitespace-only variable as unset.
 *
 * A set-but-empty variable is common in CI and in dashboards where a field was
 * cleared rather than deleted, and `??` would happily return the empty string
 * and produce an origin of "" — which yields relative Open Graph and sitemap
 * URLs that no crawler can resolve.
 */
function fromEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Origin used for canonical, Open Graph, sitemap and robots URLs.
 *
 * Resolved in order so a correct deployment needs no manual setup:
 *
 *   1. NEXT_PUBLIC_SITE_URL — explicit override, for a custom domain that is not
 *      the shortest one Vercel would otherwise pick.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — set automatically on Vercel at build time,
 *      and always the production domain even on preview deployments, so previews
 *      never advertise themselves as canonical. Carries no protocol scheme.
 *   3. localhost, for development.
 *
 * Build and server only. Non-NEXT_PUBLIC variables are not exposed to the
 * browser, so a client component reading this would see the localhost fallback.
 */
/**
 * Only the variables this actually reads, so the dependency is explicit and a
 * test can pass a two-key object instead of faking a whole environment.
 *
 * The index signature is what makes `process.env` assignable: without it, an
 * all-optional interface is a "weak type" and TypeScript rejects anything that
 * does not declare at least one of these keys.
 */
interface SiteUrlEnv {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  [key: string]: string | undefined;
}

export function resolveSiteUrl(env: SiteUrlEnv = process.env): string {
  const explicit = fromEnv(env.NEXT_PUBLIC_SITE_URL);
  // Trailing slash stripped so callers can concatenate paths without doubling it.
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = fromEnv(env.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}
