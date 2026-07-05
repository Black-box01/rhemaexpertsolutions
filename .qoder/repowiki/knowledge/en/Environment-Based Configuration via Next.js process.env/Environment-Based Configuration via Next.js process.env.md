---
kind: configuration_system
name: Environment-Based Configuration via Next.js process.env
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

The project uses a flat, environment-variable-driven configuration approach with no dedicated config loader or schema validation. All runtime settings are consumed directly from process.env at module load time across several service modules.

Sources and loading:
- .env.local is the active configuration file (Supabase URLs/keys, SMTP credentials, admin password).
- .env.local.example documents the required variables for new developers.
- No .env.development, .env.production, or framework-level config files beyond next.config.ts (which is empty of env usage).

Key consumers:
- lib/supabase.ts reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY; logs a warning and falls back to placeholder values when missing; exports an isSupabaseConfigured() helper.
- lib/supabase-admin.ts reads SUPABASE_SERVICE_ROLE_KEY (server-only) and falls back to the anon key if absent; disables session persistence for admin client.
- lib/email.ts reads SMTP_USER / SMTP_PASS; constructs a Nodemailer Gmail transport; short-circuits with { success: false } when either is missing; also reads NEXT_PUBLIC_SITE_URL for dashboard links in email templates.
- app/actions/auth.ts and app/actions/admin.ts read ADMIN_PASSWORD (with a hardcoded fallback 'rhema2026') and set cookie secure flag based on NODE_ENV.

Conventions and patterns:
- Client-visible keys are prefixed with NEXT_PUBLIC_; server-only secrets (SUPABASE_SERVICE_ROLE_KEY, SMTP_PASS, ADMIN_PASSWORD) have no such prefix.
- Missing variables produce console warnings rather than throwing, allowing the app to start in a degraded state.
- There is no central config object, type definitions for env vars, or runtime validation/schema enforcement.
- Hardcoded defaults exist for ADMIN_PASSWORD and Supabase placeholders, which weakens safety guarantees.

Rules developers should follow:
- Add every new secret to both .env.local and .env.local.example so the example stays in sync.
- Use NEXT_PUBLIC_ prefix only for values that must be available in browser code; keep all other secrets server-side only.
- Prefer explicit checks + early returns (as in email.ts) over relying on fallbacks, especially for security-sensitive settings like SUPABASE_SERVICE_ROLE_KEY and ADMIN_PASSWORD.
- Consider adding a small typed config module (e.g., lib/config.ts) that validates required env vars at startup and throws, replacing the current permissive warning pattern.