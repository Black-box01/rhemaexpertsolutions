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

This Next.js project uses npm as its package manager with a single `package.json` at the repository root. Dependencies are split into runtime (`dependencies`) and development-only (`devDependencies`) categories, and a `package-lock.json` (lockfileVersion 3) is committed to pin exact transitive resolutions for reproducible builds.

Key characteristics:
- No vendoring strategy — all packages are resolved from the public npm registry; there is no `.npmrc`, private registry configuration, or `vendor/` directory.
- Version ranges use caret (`^`) semantics in `package.json`, while the lockfile records exact versions of every installed package.
- Build tooling is declared as devDependencies (`next`, `eslint`, `tailwindcss`, `@tailwindcss/postcss`, `typescript`, `dotenv`).
- Runtime dependencies include the Next.js framework, React 19, Supabase client, Cloudinary SDK, Nodemailer, and Sharp CLI (used by upload scripts under `scripts/`).
- Scripts expose standard Next.js commands (`dev`, `build`, `start`) plus `lint` and no dedicated update/maintenance script (e.g., no `npm audit` or `ncu` alias).
- There is no CI step visible here that enforces lockfile updates or runs automated dependency audits.