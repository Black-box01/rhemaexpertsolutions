---
kind: configuration_system
name: Environment-based Configuration via process.env
category: configuration_system
scope:
    - '**'
source_files:
    - lib/supabase.ts
    - lib/supabase-admin.ts
    - lib/email.ts
    - app/actions/auth.ts
    - next.config.ts
---

This Next.js application uses a flat, environment-variable-driven configuration approach with no dedicated config files or runtime loader. All settings are consumed directly from `process.env` at module load time across several service modules.

**What system/approach is used**
- Pure `process.env` consumption — no config library (e.g., dotenv, conf, zod-env) is used.
- No `.env`, `.env.local`, or similar files exist in the repository; secrets and settings are expected to be provided by the deployment platform (Vercel/Node runtime).
- Supabase clients are instantiated at import time using env values, with permissive fallbacks so the app still builds without them.
- Email transport is configured inline in `lib/email.ts` using hardcoded Gmail service with user/pass from env.

**Key files and packages**
- `lib/supabase.ts` — public Supabase client (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`). Exposes `isSupabaseConfigured()` helper.
- `lib/supabase-admin.ts` — admin client for server actions (`SUPABASE_SERVICE_ROLE_KEY`, falls back to anon key). Disables session persistence.
- `lib/email.ts` — Nodemailer transport (`SMTP_USER`, `SMTP_PASS`) plus site URL (`NEXT_PUBLIC_SITE_URL`) used in email body links.
- `app/actions/auth.ts` — Admin password sourced from DB first, then `ADMIN_PASSWORD` env var, with a hard-coded default `'rhema2026'`. Cookie `secure` flag toggled on `NODE_ENV === 'production'`.
- `next.config.ts` — empty placeholder; no build-time env exposure via `env:` or `publicRuntimeConfig:`.

**Architecture and conventions**
- **Per-service env keys**: each integration owns its own variables rather than a central schema. There is no single source of truth or validation layer.
- **Graceful degradation**: missing env vars produce console warnings and placeholder clients rather than throwing, allowing local development without full setup.
- **Public vs private split**: variables prefixed `NEXT_PUBLIC_` are intentionally exposed to the browser; all secrets (`SUPABASE_SERVICE_ROLE_KEY`, `SMTP_*`, `ADMIN_PASSWORD`) are server-only.
- **Admin password dual-source**: the login action reads the password from Supabase `rhema_content` table first, then falls back to `ADMIN_PASSWORD`, then to a literal default — effectively making the database the canonical store after first run.
- **No feature flags or layered overrides**: there is no staging/development/prod branching beyond the `NODE_ENV` check in one place.

**Rules developers should follow**
1. Add new secrets as top-level `process.env.XXX` reads in the relevant `lib/*` file; do not scatter env access across components.
2. Prefer `NEXT_PUBLIC_` prefix only when the value must reach the browser; keep credentials server-side.
3. Provide a sensible default or warning when an env var is missing, mirroring the existing pattern in `supabase.ts` and `email.ts`.
4. Do not commit `.env*` files — this repo has none and they must be supplied by the hosting platform.
5. If adding build-time env exposure, use Next.js `env:` in `next.config.ts` instead of relying solely on runtime `process.env`.