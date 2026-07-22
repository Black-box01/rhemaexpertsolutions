---
kind: build_system
name: Next.js App Router Build Pipeline
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - next.config.ts
    - tsconfig.json
    - postcss.config.mjs
    - eslint.config.mjs
---

This project uses the standard Next.js (v16) build system with no custom build orchestration. The entire pipeline is defined in package.json scripts and relies on Next.js built-in tooling:

- Development: npm run dev -> next dev (TurboPack-enabled dev server)
- Build: npm run build -> next build (production compilation, static generation for App Router pages, server bundle for server actions)
- Start: npm run start -> next start (serves the production build)
- Lint: npm run lint -> eslint (via eslint.config.mjs)

TypeScript is configured via tsconfig.json with strict mode, bundler module resolution, path aliases (@/* -> root), and the Next.js compiler plugin. PostCSS + Tailwind v4 are wired through postcss.config.mjs. There is no Dockerfile, Makefile, CI/CD configuration, or deployment script present in this repository - the .next/ directory indicates builds are produced locally or by an external platform (most likely Vercel, given the Next.js default). Image optimization is handled by Sharp (sharp-cli dependency).