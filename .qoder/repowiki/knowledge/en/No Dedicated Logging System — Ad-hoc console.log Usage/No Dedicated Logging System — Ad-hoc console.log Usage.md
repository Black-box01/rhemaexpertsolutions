---
kind: logging_system
name: No Dedicated Logging System — Ad-hoc console.log Usage
category: logging_system
scope:
    - '**'
source_files:
    - app/actions/coding-classes.ts
    - app/actions/registration.ts
    - app/actions/notes.ts
    - app/admin/dashboard/page.tsx
    - app/page.tsx
    - lib/email.ts
    - lib/supabase-admin.ts
    - lib/supabase.ts
---

This repository does not implement a dedicated logging system. There is no centralized logger, log-level management, structured logging framework, or log routing/sink configuration anywhere in the codebase.

The only logging present consists of scattered `console.log`, `console.warn`, and `console.error` calls directly inside Server Actions and utility modules:
- `app/actions/coding-classes.ts` — error/warn logs around registration and email sending
- `app/actions/registration.ts` — similar error/warn logs for general and professional-training registrations
- `app/actions/notes.ts` — email failure warning
- `app/admin/dashboard/page.tsx` — data-fetching errors
- `app/page.tsx` — dynamic content fetch errors
- `lib/email.ts` — SMTP config warnings, success/error on send
- `lib/supabase-admin.ts` / `lib/supabase.ts` — missing env var warnings

These calls are ad-hoc, unstructured, and use no consistent format or level strategy. No third-party logging library (pino, winston, bunyan, morgan, sentry, etc.) is declared as a dependency; the `debug` package appearing in `package-lock.json` is an indirect transitive dependency of dev tooling, not used by application code.