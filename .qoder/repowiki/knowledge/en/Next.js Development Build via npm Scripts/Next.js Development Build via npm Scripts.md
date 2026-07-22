---
kind: build_system
name: Next.js Development Build via npm Scripts
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - next.config.ts
---

This project uses a minimal, standard Next.js build setup with no custom build orchestration, containerization, or CI pipeline files in the repository.

**Build system**: The entire build is driven by `npm` scripts defined in `package.json`, which delegate to the Next.js CLI:
- `npm run dev` → `next dev` (development server)
- `npm run build` → `next build` (production build output to `.next/`)
- `npm run start` → `next start` (serve production build)
- `npm run lint` → `eslint`

There are no Makefiles, Dockerfiles, shell build/deploy scripts, GitHub Actions workflows, Vercel/Netlify config files, or other external build orchestrators present in the repository. The only non-standard tooling is under `scripts/`, which contains Cloudinary image upload helpers (`upload-missing-images.js`, `upload-missing.js`, `upload-to-cloudinary.js`) — these are data-management utilities, not part of the application build pipeline.

**Build configuration**: `next.config.ts` is minimal and focused on one integration: it disables Next.js's built-in image optimization (`images.unoptimized = true`) because images are served from Cloudinary, which already handles resizing/formatting. It also whitelists the Cloudinary hostname for remote image fetching.

**TypeScript & toolchain**: TypeScript 5 compiles alongside Next.js; ESLint 9 with `eslint-config-next` provides linting; Tailwind CSS v4 is configured through PostCSS (`postcss.config.mjs`).

**Conventions / gaps**:
- No version pinning beyond caret ranges in `package.json`; no lockfile strategy documented.
- No environment variable schema or validation at build time.
- No separate staging/prod build targets or artifact naming conventions.
- Deployment target is not declared in-repo (likely Vercel given the Next.js default, but no `vercel.json` exists).
- Image assets are managed externally via Cloudinary rather than bundled during build.