---
kind: dependency_management
name: npm-based dependency management with lockfile pinning
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - package-lock.json
---

This Next.js project uses npm as its package manager with a standard `package.json` + `package-lock.json` setup. There is no vendoring, private registry, or Go module usage in this repository.

**System used**
- Package manager: npm (lockfileVersion 3)
- Manifest: `package.json` at the repository root
- Lockfile: `package-lock.json` committed to version control for reproducible installs
- No `.npmrc`, no private registries, no `vendor/` directory, no Go modules present

**Key files**
- `package.json` — declares runtime and dev dependencies with caret (`^`) ranges
- `package-lock.json` — pins every transitive dependency to exact versions and integrity hashes
- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs` — configuration files that constrain which versions of tooling can be used (e.g., `@tailwindcss/postcss` ^4, Tailwind v4, ESLint v9, TypeScript v5)

**Architecture and conventions**
- Dependencies are split into `dependencies` (runtime: next, react, @supabase/supabase-js, nodemailer, sharp-cli) and `devDependencies` (tooling: typescript, eslint, tailwindcss, @types/*).
- All version ranges use caret (`^`), allowing minor/patch upgrades within the major version; the lockfile ensures deterministic builds.
- The project is marked `"private": true`, so it is not published to any registry.
- No custom npm scripts beyond the default Next.js ones (`dev`, `build`, `start`, `lint`).

**Rules developers should follow**
- Declare new packages only in `package.json`; do not edit `package-lock.json` by hand.
- Use `npm install <pkg>` (not manual edits) so the lockfile stays in sync.
- Keep runtime vs. dev dependencies separated as already done.
- Do not introduce a private registry or `.npmrc` without updating CI/build instructions.
- When upgrading, prefer bumping the caret range in `package.json` and re-running `npm install` to regenerate the lockfile.