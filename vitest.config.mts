import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Mirrors the `@/*` path alias from tsconfig, so tests import the same way
    // application code does.
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // Node only. Nothing under test touches the DOM or a WebGL context; the
    // point of extracting this logic was that it can be checked without one.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
