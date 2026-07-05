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
    - app/admin/dashboard/page.tsx
---

This Next.js application uses a lightweight, ad-hoc error handling strategy centered on server actions that return plain result objects rather than throwing exceptions or using typed error classes.

**Return-object convention**
Every server action in `app/actions/` returns a discriminated union of `{ success: true, ... }` and `{ success: false, error: string }`. Client code checks `result.success` / `result.error` and surfaces the message via `alert()` or by setting a local `fetchError` state. Examples:
- `admin.ts`: `saveService`, `saveClient`, `saveTeam`, `saveCompetition`, `saveNewsletter`, `saveSetting`, `deleteItem`, `toggleCompetition` all follow this pattern after Supabase calls.
- `registration.ts`: `submitRegistration`, `submitProfessionalTrainingRegistration`, `updateCompetitionRegistration`, `deleteCompetitionRegistration`, etc.
- `auth.ts`: `login` returns `{ success: false, error: 'Invalid password' }`.

**Two propagation styles coexist**
1. *Early-return on Supabase errors*: Many mutations check `if (result.error) return { error: result.error.message }` immediately after a Supabase call (`admin.ts` lines 33, 112, 129, 146, 163, 174, 184, 194).
2. *try/catch with normalized messages*: Functions like `fetchDashboardData`, `fetchRegistrations`, `updateCompetitionRegistration`, and both registration submit functions wrap their body in try/catch, coerce the caught value to a string via `error instanceof Error ? error.message : 'Unknown error'`, and return `{ success: false, error: message }`.

**Authorization errors**
A shared `ensureAuthenticated()` helper in `admin.ts` throws `new Error('Unauthorized')` when `checkAuth()` fails; callers rely on the surrounding try/catch to normalize it into the standard result object.

**Frontend presentation**
The admin dashboard (`app/admin/dashboard/page.tsx`) handles errors by checking `result.success` and either updating UI state (`setFetchError(...)`) or calling `alert(...)` for mutation failures. Public pages (`competition/page.tsx`, `professional-trainings/page.tsx`, `page.tsx`) similarly wrap server-action calls in try/catch and log unexpected errors to `console.error`.

**What is missing**
- No custom error class hierarchy (`class X extends Error`).
- No global error boundary (`app/error.tsx`, `app/global-error.tsx`) — unhandled server-action rejections surface as generic Next.js error pages.
- No middleware-based error normalization; auth is checked per-action via `ensureAuthenticated()`.
- No structured logging framework; errors are printed via `console.error` / `console.warn`.
- No retry/backoff or user-facing error codes — messages are raw Supabase error strings.