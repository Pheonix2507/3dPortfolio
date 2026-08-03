import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fail the production build on type errors rather than shipping them.
  // Linting runs via the `lint` script, not the build, since Next 16 dropped
  // the built-in `next lint` integration.
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
