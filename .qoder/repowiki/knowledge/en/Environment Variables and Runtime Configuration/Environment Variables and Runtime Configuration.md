---
kind: configuration_system
name: Environment Variables and Runtime Configuration
category: configuration_system
scope:
    - '**'
source_files:
    - lib/cloudinary.ts
    - lib/email.ts
    - lib/images.ts
    - app/actions/auth.ts
    - app/actions/admin.ts
    - next.config.ts
    - CLOUDINARY_SETUP.md
    - .gitignore
---

This Next.js project uses a straightforward environment-variable-based configuration system with no dedicated config loader, schema validation, or centralized config module. Configuration is consumed directly via process.env at the point of use across several service modules.

How it works
- Local development: .env.local (gitignored) holds secrets and per-machine overrides. The repo includes setup docs (CLOUDINARY_SETUP.md, CLOUDINARY_MIGRATION.md) that list every required variable for first-time setup.
- Production: Vercel dashboard variables are documented as the deployment target; the same NEXT_PUBLIC_* / CLOUDINARY_* / SMTP_* / ADMIN_PASSWORD names apply there.
- Next.js build-time exposure: Only variables prefixed with NEXT_PUBLIC_ are baked into the client bundle (e.g. NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_SITE_URL). All other secrets stay server-only.

Where each setting is consumed
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: lib/cloudinary.ts, lib/images.ts — Cloudinary public cloud name (client + server)
- CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET: lib/cloudinary.ts, lib/images.ts — Cloudinary write access (server only)
- SMTP_USER / SMTP_PASS: lib/email.ts — Nodemailer Gmail auth; email sending is disabled when missing
- ADMIN_PASSWORD: app/actions/auth.ts, app/actions/admin.ts — Admin login password; falls back to 'rhema2026' if unset
- NODE_ENV: app/actions/auth.ts — Controls cookie secure flag
- NEXT_PUBLIC_SITE_URL: lib/email.ts — Base URL used in admin-dashboard links inside emails

Runtime defaults and fallbacks
- ADMIN_PASSWORD defaults to 'rhema2026' on first login and is persisted into Supabase's rhema_content table so admins can change it through the dashboard later.
- Email sending gracefully degrades: if SMTP_USER/SMTP_PASS are absent, sendEmail returns { success: false } instead of throwing.
- Image optimization is explicitly disabled in next.config.ts (images.unoptimized = true) because Cloudinary handles resizing/formatting, and the allowed remote host is whitelisted for res.cloudinary.com.

Architecture and conventions
- There is no single config/ directory or typed config object — each feature reads its own env vars where needed. This keeps things simple but means new settings must be added in multiple places.
- Server-only vs client-visible variables follow the standard Next.js convention: only NEXT_PUBLIC_* variables are safe to reference in components; everything else lives in server actions / route handlers / lib/* server modules.
- Secrets are never committed: .env* is listed in .gitignore.

Rules developers should follow
1. Put all secrets in .env.local during development and in the Vercel dashboard for production — do not hardcode them.
2. Use NEXT_PUBLIC_ prefix only for values that must reach the browser; keep API keys, passwords, and DB credentials server-only.
3. When adding a new service, document the required env vars in the relevant setup doc (follow the pattern in CLOUDINARY_SETUP.md) and add a runtime default/fallback if the feature can operate without it.
4. Do not import dotenv manually — rely on Next.js automatic .env loading.
5. If a setting controls behavior that should differ between dev/prod, guard it with process.env.NODE_ENV rather than separate files.