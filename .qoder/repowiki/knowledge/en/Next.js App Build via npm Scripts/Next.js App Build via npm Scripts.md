---
kind: build_system
name: Next.js App Build via npm Scripts
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - next.config.ts
    - tsconfig.json
---

This repository uses the standard Next.js build system with no custom build orchestration. The entire build pipeline is defined in `package.json` scripts and relies on Next.js's built-in tooling:

- **Development**: `npm run dev` runs `next dev`, starting the development server with hot reload.
- **Production build**: `npm run build` invokes `next build`, which compiles TypeScript, optimizes assets (via `sharp-cli`), generates static pages, and produces the `.next/` artifact directory ready for production serving.
- **Production serve**: `npm run start` runs `next start` against the pre-built output.
- **Linting**: `npm run lint` runs ESLint using the Next.js default config (`eslint-config-next`).

TypeScript compilation is configured in `tsconfig.json` with strict mode, ES2017 target, bundler module resolution, path aliases (`@/*` → root), and the Next.js compiler plugin. No separate bundler (Webpack/Vite) configuration exists — `next.config.ts` is present but empty, deferring all behavior to Next.js defaults.

There are no Dockerfiles, CI pipelines, Makefiles, shell build scripts, or deployment manifests in this repository. The project appears intended for direct deployment to Vercel (the Next.js host), where the platform automatically detects the Next.js app, installs dependencies from `package-lock.json`, runs `next build`, and serves the resulting output.