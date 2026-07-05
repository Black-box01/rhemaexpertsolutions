---
kind: configuration_system
name: Environment-Based Configuration via Next.js dotenv
category: configuration_system
scope:
    - '**'
source_files:
    - .env.local
    - .env.local.example
    - lib/supabase.ts
    - lib/supabase-admin.ts
    - lib/email.ts
    - app/actions/auth.ts
    - app/actions/admin.ts
---

This project uses a flat, environment-variable-driven configuration system built on top of Next.js's built-in .env loading. There is no centralized config module, schema validator, or feature-flag framework — configuration is consumed directly from process.env wherever needed.

How it works
- All runtime settings live in .env.local (gitignored) and are documented in .env.local.example.
- Variables are read at module load time by each consumer:
  - Supabase client initialization reads NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY from lib/supabase.ts and lib/supabase-admin.ts.
  - Email notifications read SMTP_USER, SMTP_PASS, and NEXT_PUBLIC_SITE_URL from lib/email.ts.
  - Admin dashboard password is read inline in app/actions/admin.ts and app/actions/auth.ts as ADMIN_PASSWORD with a hardcoded fallback (rhema2026).

Variable categories and conventions
- NEXT_PUBLIC_* variables are intentionally exposed to the browser; these are only non-secret values like the Supabase URL and anon key.
- Server-only secrets (SUPABASE_SERVICE_ROLE_KEY, SMTP_PASS, ADMIN_PASSWORD) use plain names without the NEXT_PUBLIC_ prefix and are only accessed inside server actions / server-side modules.
- Optional features (email) gracefully degrade: if SMTP_USER/SMTP_PASS are missing, sendEmail returns { success: false } instead of throwing.

Fallbacks and validation
- No runtime validation library is used. Consumers provide defaults inline:
  - Supabase clients fall back to placeholder URLs/keys when env vars are absent.
  - isSupabaseConfigured() checks for a sentinel value (your-project-url) rather than strict presence.
  - ADMIN_PASSWORD falls back to 'rhema2026' if unset.
  - NEXT_PUBLIC_SITE_URL falls back to http://localhost:3000 in email templates.

Security notes
- Secrets are stored in plaintext in .env.local (which is gitignored).
- The admin password is not hashed — it is compared as a plain string against user input.
- The Supabase service role key is present in .env.local; the example file documents that it must never be committed.

Rules developers should follow
1. Add new secrets to both .env.local and .env.local.example so the template stays in sync.
2. Use NEXT_PUBLIC_ prefix only for values that must reach the browser; keep all other secrets server-only.
3. Provide sensible defaults and warn via console.warn rather than crashing when optional env vars are missing.
4. Do not hardcode additional secrets into source files — always route them through process.env.
5. Prefer graceful degradation for optional integrations (like email) instead of failing the whole request.