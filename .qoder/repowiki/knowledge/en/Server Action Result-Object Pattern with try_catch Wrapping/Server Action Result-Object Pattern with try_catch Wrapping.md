---
kind: error_handling
name: Server Action Result-Object Pattern with try/catch Wrapping
category: error_handling
scope:
    - '**'
source_files:
    - app/actions/admin.ts
    - app/actions/registration.ts
    - app/actions/coding-classes.ts
    - app/actions/notes.ts
    - lib/email.ts
    - lib/images.ts
    - lib/supabase.ts
---

This Next.js project uses a consistent, lightweight error handling strategy centered on server actions returning structured result objects rather than throwing exceptions. There is no centralized error class hierarchy, middleware-based error handling, or custom error types — instead, every server action follows the same pattern: return `{ success: boolean, data?: any, error?: string }` and wrap potentially failing code in `try/catch` blocks that normalize unknown errors into user-friendly messages.

**Core approach**
- Server actions (`app/actions/*.ts`) never throw; they catch all errors and return `{ success: false, error: message }`. Successful paths return `{ success: true, ...data }`.
- Validation failures (missing required fields) are treated as business errors and returned via the same `{ success: false, error }` shape rather than thrown.
- Authentication failures return `{ success: false, error: 'Unauthorized' }` early from each action after calling `checkAuth()`.
- Supabase client calls check the `.error` property on results and either rethrow (to be caught by the surrounding try/catch) or return the error message directly.
- External service calls (email via Nodemailer, Cloudinary API) swallow failures gracefully — they log via `console.warn`/`console.error` and return `{ success: false, error }`, allowing the caller to proceed without aborting the primary operation.

**Key files**
- `app/actions/admin.ts` — admin CRUD operations; throws `Error('Unauthorized')` from `ensureAuthenticated()`, wraps `fetchDashboardData` in try/catch, returns `{ success, error }` for DB errors.
- `app/actions/registration.ts` — competition & professional training submissions; validates inputs, catches DB/email errors, logs unexpected errors.
- `app/actions/coding-classes.ts` — coding class registration flow; identical try/catch + result-object pattern.
- `app/actions/notes.ts` — staff e-notes CRUD; returns unauthorized early, swallows email-send failures so note save never fails due to notification issues.
- `lib/email.ts` — Nodemailer wrapper; missing SMTP config returns `{ success: false, error }` instead of throwing; send failures logged and returned.
- `lib/images.ts` — Cloudinary image fetching; fetch failures return empty arrays and log errors rather than propagating.
- `lib/supabase.ts` — public client initialization; missing env vars produce a console warning and fall back to placeholder values instead of throwing.

**Architecture & conventions**
- No global error boundary or middleware transforms these results; callers (React Server Components / client components) must inspect `success` and render accordingly.
- Error messages are plain strings extracted from `error instanceof Error ? error.message : 'Unknown error'`; there is no error-code enum or typed error union.
- Side-effect failures (email notifications, image listing) are intentionally non-fatal — they degrade gracefully while preserving the main operation's success.
- Admin-only actions gate via `checkAuth()` at the top and return `'Unauthorized'` through the result object rather than throwing, keeping the contract uniform across public and protected endpoints.