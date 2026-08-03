# 3D Portfolio

An interactive portfolio built around WebGL scenes: clickable cubes that burst
into fragments, particles that reassemble into my name, and a scroll-driven
fragment field behind the whole page.

## Stack

| Concern   | Choice                                                 |
| --------- | ------------------------------------------------------ |
| Framework | Next.js 16 (App Router, Turbopack in dev)              |
| Language  | TypeScript, strict                                     |
| 3D        | Three.js via React Three Fiber, drei, postprocessing   |
| Animation | Framer Motion (DOM), React Spring (3D), Lenis (scroll) |
| Styling   | Tailwind CSS v4, shadcn/ui primitives                  |
| Tooling   | ESLint 9 flat config, Prettier with Tailwind plugin    |

## Getting started

Requires Node 20.9 or newer.

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000.

For correct absolute URLs in Open Graph tags, set the deployed origin:

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

It falls back to `http://localhost:3000`, so this is only needed in deployed
environments.

## Scripts

| Script                 | Does                                      |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Dev server with Turbopack                 |
| `npm run build`        | Production build                          |
| `npm start`            | Serve the production build                |
| `npm run lint`         | ESLint                                    |
| `npm run lint:fix`     | ESLint with autofix                       |
| `npm run typecheck`    | `tsc --noEmit`                            |
| `npm run format`       | Prettier write                            |
| `npm run format:check` | Prettier check, no writes                 |
| `npm run check`        | Typecheck, lint and format check together |

Run `npm run check` before opening a PR.

## Project structure

```
src/
├── app/                  Routes only. Thin pages that compose sections.
│   ├── layout.tsx        Root layout, fonts, metadata, scroll controller
│   ├── page.tsx          Landing page (server component)
│   ├── globals.css       Tailwind entry, theme variables, custom effects
│   ├── about/
│   ├── projects/
│   ├── three-projects/
│   └── dynamic-rotation/
├── sections/             Page sections, reused by the landing page and routes
├── components/
│   ├── layout/           Navbar, ScrollController
│   ├── motion/           Scroll and parallax reveal wrappers
│   ├── three/            Every WebGL scene and 3D primitive
│   └── ui/               shadcn/ui primitives only
├── hooks/                Reusable hooks
├── data/                 Site config, projects, social links
├── lib/                  Helpers (`cn`)
└── types/                Shared types
```

### Routes are not components

A route file's only job is to set metadata and render a section. The content
lives in `src/sections/`, so the landing page and the standalone route can both
render it without one page importing another page's `page.tsx`.

### Client boundaries

`app/page.tsx` is a server component. Each section opts into the client itself,
so the page shell ships no JavaScript of its own. WebGL scenes cannot render on
the server, so they load through `next/dynamic` with `ssr: false` from inside a
client component.

### The 3D layer

`components/three/` holds the scenes. `AnimatedShape` is the shared
spring-animated particle used by both the exploding cubes and the letter morph,
so travel, tumble and material behaviour live in one place.

The typeface used by the letter morph is vendored into
`public/fonts/optimer_regular.typeface.json` with its licence, because Three.js
stopped shipping `examples/fonts` in the npm package at r185.

## Conventions

- Components are `PascalCase.tsx`, hooks are `useCamelCase.ts`.
- Import through the `@/` alias, not relative parent paths.
- Scene tuning values (counts, radii, durations) are named constants at the top
  of the file, not inline magic numbers.
- Prettier owns formatting. Do not hand-align code.

## Known follow-ups

- `Scroll3DBackground` draws 400 individual meshes and `LetterMorphScene` runs
  600 springs. Both would benefit from instanced rendering.
- The satellite orbit in `ExplodingBox` uses `cos` for both x and y, so it
  tracks a diagonal rather than a circle. Left alone in case it is deliberate.
- Project cards render the tech list as comma-separated text; the data is
  already an array, so chips are a small change away.
