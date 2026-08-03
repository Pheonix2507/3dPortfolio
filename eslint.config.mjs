import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

/**
 * Flat config, consuming eslint-config-next's native flat entrypoints directly.
 * The FlatCompat/eslintrc bridge is deliberately absent: it throws on ESLint 10
 * when it tries to serialise the react plugin's circular config object.
 */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },

  ...nextCoreWebVitals,
  ...nextTypescript,

  {
    rules: {
      // React Three Fiber props (args, position, intensity...) are not DOM
      // attributes, so the unknown-property rule misfires on every scene.
      "react/no-unknown-property": "off",
    },
  },

  // Must stay last: switches off the stylistic rules Prettier owns.
  eslintConfigPrettier,
];

export default eslintConfig;
