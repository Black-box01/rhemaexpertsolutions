---
kind: dependency_management
name: npm-based dependency management with lockfile
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - package-lock.json
    - .gitignore
    - next.config.ts
---

This Next.js project uses npm as its package manager. Dependencies are declared in `package.json` and pinned by a `package-lock.json` lockfile at the repository root, ensuring deterministic installs across environments.

**System overview**
- Package manager: npm (no Yarn/PNPM usage despite `.gitignore` entries for those managers).
- Lockfile: `package-lock.json` is committed to version control, providing reproducible builds.
- No vendoring strategy — `node_modules/` is ignored via `.gitignore`; dependencies are installed fresh on each build.
- No private registry or custom npm configuration detected; all packages resolve from the public npm registry.

**Key files**
- `package.json` — declares runtime and dev dependencies, plus scripts (`dev`, `build`, `start`, `lint`).
- `package-lock.json` — exact version resolution for every transitive dependency.
- `.gitignore` — excludes `node_modules`, PnP/Yarn artifacts, and Next.js build output.
- `next.config.ts` — minimal Next.js config with no special dependency overrides.

**Runtime vs. development split**
- Runtime deps: `next`, `react`, `react-dom`, `@supabase/supabase-js`, `nodemailer`, `sharp-cli`.
- Dev-only deps: TypeScript, ESLint + `eslint-config-next`, Tailwind CSS v4 (`tailwindcss` + `@tailwindcss/postcss`), type definitions for React/Next/Nodemailer.

**Conventions & constraints**
- All versions use caret ranges (`^x.y.z`) in `package.json`, allowing minor/patch upgrades while keeping major versions locked.
- The project is marked `"private": true`, preventing accidental publication to the npm registry.
- Build tooling is driven by Next.js scripts rather than custom Makefiles or CI-specific install steps.
- Environment variables (`.env*`) are gitignored, so secrets like Supabase credentials are not bundled into the lockfile.