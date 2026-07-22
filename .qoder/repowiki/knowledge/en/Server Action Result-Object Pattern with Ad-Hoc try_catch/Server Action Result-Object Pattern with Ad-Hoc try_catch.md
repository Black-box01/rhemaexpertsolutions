---
kind: error_handling
name: Server Action Result-Object Pattern with Ad-Hoc try/catch
category: error_handling
scope:
    - '**'
source_files:
    - app/actions/admin.ts
    - app/actions/auth.ts
    - app/actions/notes.ts
    - app/actions/registration.ts
    - lib/email.ts
    - lib/supabase.ts
---

This Next.js App Router project uses a lightweight, ad-hoc error handling strategy centered on server actions that return explicit result objects rather than throwing. There is no centralized error class hierarchy, middleware-based error boundary, or structured logging framework — errors are handled inline per action.

**Core approach**
- Server actions in `app/actions/*.ts` consistently return `{ success: boolean, data?: any, error?: string }` (or `{ success: true }` / `{ error: message }`) instead of throwing exceptions. This lets the client-side React components inspect the result and display user-friendly messages.
- Supabase client calls return `{ data, error }` tuples; every action checks `result.error` and either returns `{ error: result.error.message }` or re-throws into a surrounding `try/catch` block.
- Authentication failures use two styles: `throw new Error('Unauthorized')` inside `ensureAuthenticated()` (in `admin.ts`) and early-return `{ success: false, error: 'Unauthorized' }` from individual actions (in `notes.ts`, `registration.ts`).

**Key files**
- `app/actions/admin.ts` — central admin CRUD; mixes thrown `Error('Unauthorized')` with result-object returns and a single `catch` that normalizes to `{ success: false, error: message }`.
- `app/actions/auth.ts` — password-based auth via cookie; returns `{ success: false, error: 'Invalid password' }` on bad credentials.
- `app/actions/notes.ts` — e-note CRUD; consistently returns `{ success, error }` and wraps email-sending in its own `try/catch` so a failed notification does not abort the save.
- `app/actions/registration.ts` — competition & professional-training submissions; validates inputs and returns `{ success: false, error: 'Please fill in all required fields.' }` for validation failures, plus a top-level `try/catch` that logs unexpected errors.
- `lib/email.ts` — Nodemailer wrapper; never throws — always returns `{ success, messageId? | error }` and falls back gracefully when SMTP env vars are missing.
- `lib/supabase.ts` — public client; warns via `console.warn` when environment variables are missing rather than throwing.

**Architecture & conventions**
- No dedicated `errors/` directory, custom error classes, or sentinel-error constants exist.
- No global `unhandledrejection` handler, `process.on('uncaughtException')`, or Next.js `error.ts` / `global-error.ts` pages were found in the repo.
- Secondary side effects (email sending) are wrapped in their own `try/catch` blocks and logged with `console.error` / `console.warn`; they do not bubble up as action failures.
- Database errors surface as plain strings (`result.error.message`) rather than typed codes.

**Rules developers should follow**
1. Prefer returning `{ success, data?, error? }` from server actions over throwing; only throw for unrecoverable preconditions like missing authentication.
2. Always check `result.error` after Supabase calls and return it as `{ error: result.error.message }`.
3. Wrap non-critical side effects (e.g., emails) in their own `try/catch` and log with `console.error` / `console.warn` without failing the caller.
4. Normalize unknown errors with `error instanceof Error ? error.message : 'Unknown error'` before returning them to the client.
5. Do not rely on middleware or global catch-all handlers — each action must handle its own failure paths.