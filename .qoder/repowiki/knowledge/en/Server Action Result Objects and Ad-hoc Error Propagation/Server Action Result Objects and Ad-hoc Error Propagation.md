---
kind: error_handling
name: Server Action Result Objects and Ad-hoc Error Propagation
category: error_handling
scope:
    - '**'
source_files:
    - app/actions/admin.ts
    - app/actions/auth.ts
    - app/actions/registration.ts
    - app/actions/coding-classes.ts
    - app/actions/notes.ts
    - lib/email.ts
    - lib/supabase.ts
    - lib/supabase-admin.ts
    - app/admin/dashboard/page.tsx
---

This Next.js project uses a lightweight, ad-hoc error handling strategy centered on server actions returning uniform result objects rather than throwing exceptions. There is no centralized error class hierarchy, custom error types, or global middleware — errors are propagated as plain strings inside `{ success, error }` payloads.

**Approach used**
- Server actions (`app/actions/*.ts`) return a consistent shape: `{ success: true }` on success, or `{ success: false, error: string }` on failure. The `error` field carries either the Supabase client error message (`result.error.message`) or a domain-specific message (e.g. `'Unauthorized'`, `'Invalid password'`).
- Authentication failures throw `new Error('Unauthorized')` from a shared `ensureAuthenticated()` helper in `admin.ts`; callers catch it via a surrounding `try/catch` that normalizes it back into the `{ success, error }` shape.
- Client-side pages (notably `app/admin/dashboard/page.tsx`) check `result.error` after each action call and surface messages through `alert()` or a local `fetchError` state variable. No toast library or error boundary is used.
- External service calls (email via Nodemailer) wrap their work in `try/catch` and return `{ success: false, error }` without failing the caller; upstream code logs a warning and continues.

**Key files and packages**
- `app/actions/admin.ts` — central admin CRUD actions; defines `ensureAuthenticated()`, wraps `Promise.all` DB calls with per-field error checks, and catches thrown errors to normalize them.
- `app/actions/auth.ts` — cookie-based admin auth; returns `{ success, error }` for login/logout and a boolean for `checkAuth()`.
- `app/actions/registration.ts` — competition & professional-training registration flows; validates inputs, inserts rows, sends email notifications, and returns normalized results.
- `app/actions/coding-classes.ts` — coding-class registration flow following the same pattern.
- `app/actions/notes.ts` — staff e-note CRUD + file upload; early-returns `{ success: false, error: 'Unauthorized' }` when unauthenticated.
- `lib/email.ts` — Nodemailer wrapper; returns `{ success, messageId }` or `{ success: false, error }` and never throws.
- `lib/supabase.ts` / `lib/supabase-admin.ts` — Supabase clients; missing env vars produce `console.warn` instead of throwing, with placeholder fallbacks so the app keeps running.
- `app/admin/dashboard/page.tsx` — only UI consumer; reads `result.error` and shows `alert()` or sets `fetchError` state.

**Architecture and conventions**
1. **Every server action is self-contained**: it performs its own auth check (via `checkAuth()` or `ensureAuthenticated()`), executes one or more Supabase calls, and returns a single result object. There is no cross-cutting error middleware.
2. **Supabase errors are surfaced verbatim**: `result.error.message` is passed straight through to the caller, which means database constraint violations, RLS denials, and network failures bubble up as opaque strings.
3. **Email failures are non-fatal**: registration and note-save actions log a warning but still return `{ success: true }` so the user flow is not blocked by downstream notification delivery.
4. **No structured error taxonomy**: there are no sentinel errors, error codes, or typed error unions distinguishing validation, authorization, network, and database failures. Callers must inspect the string message to decide behavior.
5. **Client presentation is minimal**: the dashboard page uses `alert()` for most action errors and a simple `fetchError` state for initial data loads. There are no React error boundaries or global error handlers.

**Rules developers should follow**
- Always return `{ success: true }` or `{ success: false, error: string }` from server actions; do not throw to the client.
- Use `checkAuth()` / `ensureAuthenticated()` at the top of every protected action and let the helper throw `'Unauthorized'` so callers can normalize it uniformly.
- When calling Supabase, always check `result.error` immediately and return `{ success: false, error: result.error.message }` rather than letting the promise reject.
- Wrap optional side effects (email, storage uploads) in `try/catch` and treat failures as warnings — they should not flip `success` to false unless the core operation depends on them.
- On the client, check `result.error` after every action invocation and present the message to the user (preferably via a dedicated UI component rather than `alert`).
- Avoid logging raw Supabase error objects to the browser; keep sensitive details server-side and pass only human-readable messages across the action boundary.