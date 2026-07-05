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

This project uses the standard Next.js 16 build pipeline with no custom build orchestration. The entire build system is defined through npm scripts and framework configuration files.

Build toolchain: Next.js 16 (App Router) with TypeScript 5, Tailwind CSS v4 via @tailwindcss/postcss, ESLint v9 using eslint-config-next core-web-vitals + typescript presets.

Scripts (package.json):
- npm run dev — Next.js development server
- npm run build — Production build (Turbopack enabled by default in Next.js 16)
- npm run start — Start production server
- npm run lint — Run ESLint

TypeScript config (tsconfig.json): Target ES2017, strict mode, bundler module resolution, path alias @/* to root, Next.js plugin included, incremental builds enabled. No emitted JS — Next.js handles compilation.

PostCSS (postcss.config.mjs): Single plugin @tailwindcss/postcss for Tailwind v4 processing.

ESLint (eslint.config.mjs): Flat config format, extends Next.js vitals + TS rules, ignores .next/, out/, build/, next-env.d.ts.

No containerization or CI: There are no Dockerfiles, docker-compose files, GitHub Actions, CircleCI, GitLab CI, Jenkinsfile, Makefile, or shell build/deploy scripts anywhere in the repository. Deployment is intended to be a direct next build + next start on a host platform (likely Vercel given the vercel.svg asset).

Artifacts: Build output goes to .next/ (standard Next.js), which is gitignored. Static assets live under public/ and are served as-is.