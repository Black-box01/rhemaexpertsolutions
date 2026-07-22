---
kind: dependency_management
name: npm + lockfile-based dependency management
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - package-lock.json
---

This Next.js project uses the standard npm ecosystem for dependency management with no custom registry, vendoring, or private package strategy.

**System and tools**
- Package manager: npm (inferred from `package-lock.json`)
- Manifest: `package.json` declares runtime and dev dependencies using caret (`^`) ranges
- Lockfile: `package-lock.json` pins exact transitive versions for reproducible installs
- No `.npmrc`, `.yarnrc`, `pnpm-lock.yaml`, or `bun.lock` present — default public npm registry is used
- No `vendor/`, `node_modules` in git, and no workspace/multi-package setup

**Runtime vs. build-time split**
- Runtime deps: `next`, `react`, `react-dom`, `@supabase/supabase-js`, `nodemailer`, `sharp-cli`
- Dev-only tooling: TypeScript, ESLint + `eslint-config-next`, Tailwind CSS v4 (`tailwindcss` + `@tailwindcss/postcss`), type packages for React/Next/Nodemailer
- Build scripts are thin wrappers around Next CLI (`dev`, `build`, `start`) plus `eslint`

**Versioning conventions**
- All top-level dependencies use caret ranges (`^x.y.z`), allowing minor/patch updates within a major version
- No explicit sub-dependency pinning beyond the lockfile; no `overrides` or `resolutions` fields
- The project is marked `"private": true`, so it is not published to any registry

**What is NOT present**
- No private npm registry configuration (`registry = ...` in `.npmrc`)
- No `GOPRIVATE`, Go modules, Cargo, pip, or other language-specific manifests
- No vendoring of third-party JS code inside the repo
- No CI job that explicitly runs `npm ci` / `npm audit` / `npm outdated` visible in this snapshot

**Rules developers should follow**
- Add new dependencies only via `npm install <pkg>` so `package-lock.json` stays in sync
- Keep `package-lock.json` committed; never delete it before committing changes
- Prefer caret ranges (`^`) as already used; avoid tilde (`~`) unless an exact patch is required
- Do not commit `node_modules/` or create a local `.npmrc` pointing at a private registry without documenting it
- When upgrading, run `npm update` and verify the lockfile diff before committing