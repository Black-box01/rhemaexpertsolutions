---
kind: design
name: Use Next.js Server Actions with Supabase Admin client for staff e-notes
source: session
category: adr
---

# Use Next.js Server Actions with Supabase Admin client for staff e-notes

_Source: coding plans from commit period 4dfd475 → 16e5f5c — records intent at planning time; the implementation may lag or differ._

## Context
The project needed a new internal communication feature (staff e-notes) accessible only to authenticated admins. The existing codebase already used Next.js App Router with server actions and Supabase, so the new feature had to integrate seamlessly without introducing new runtime dependencies or architectural patterns.

## Decision drivers
- reuse existing Next.js server action pattern from coding-classes
- use supabaseAdmin client for RLS bypass in admin context
- keep UI monolithic inside dashboard page to avoid refactoring risk

## Considered options
- **Server Actions + Supabase Admin client** — pros: Matches existing coding-classes pattern; no extra API layer; revalidatePath gives instant UI updates; service role bypasses RLS for admin operations
- **Separate REST API route handlers** _(rejected)_ — pros: Cleaner separation of concerns; cons: Requires new route files, different error handling pattern than existing code, breaks consistency with other admin features
- **Client-side Supabase calls with user session** _(rejected)_ — pros: Simpler data access; cons: Would require complex RLS policies per-user; conflicts with 'admin-only' requirement; inconsistent with how other admin tabs work

## Decision
Implement the e-notes feature using Next.js server actions in app/actions/notes.ts that call supabaseAdmin (service role), mirroring the existing coding-classes pattern exactly. All CRUD operations go through these server actions rather than direct client-side Supabase calls.

## Consequences
The notes feature shares the same auth check and error-returning convention as other admin features. File uploads use a dedicated 'staff-notes' storage bucket with public read but authenticated write. The entire notes UI stays inline in app/admin/dashboard/page.tsx rather than being extracted to a separate component, keeping changes minimal but making the dashboard file larger.