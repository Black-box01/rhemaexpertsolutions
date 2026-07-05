---
kind: design
name: Implement staff e-notes as a monolithic admin dashboard tab using Next.js Server Actions
source: session
category: adr
---

# Implement staff e-notes as a monolithic admin dashboard tab using Next.js Server Actions

_Source: coding plans from commit period 33ac43c → 4dfd475 — records intent at planning time; the implementation may lag or differ._

**Status:** accepted

## Context
The project needed an internal notes system for staff to share announcements, urgent items, and general information. The existing admin dashboard at `app/admin/dashboard/page.tsx` already manages multiple tabs (services, clients, team, etc.) in a single large component.

## Decision drivers
- minimize file changes and regression risk
- match existing monolithic dashboard pattern
- keep implementation simple with plain textarea instead of rich text

## Considered options
- **Monolithic dashboard tab (chosen)** — pros: No new files, follows existing patterns, zero refactoring of working code, minimal regression risk; cons: Dashboard page grows larger; may need extraction later if it exceeds ~1500 lines
- **Separate notes component file** — pros: Better separation of concerns, easier to maintain independently; cons: Requires extracting state/handlers from the dashboard, more file churn, higher regression risk
- **Tab-specific lazy loading** — pros: Smaller initial payload per tab; cons: Requires refactoring existing working tab infrastructure, introduces regression risk

## Decision
Add the e-notes feature as a new 'staff-notes' tab inside the existing `app/admin/dashboard/page.tsx`, implemented via Next.js Server Actions in `app/actions/notes.ts` that call Supabase through `supabaseAdmin`, with data stored in a new `rhema_staff_notes` table and attachments in a public `staff-notes` storage bucket.

## Consequences
The dashboard page becomes larger but avoids splitting logic across files. Future maintenance should extract the notes UI into its own component once the page approaches maintainability limits. Rich text editing and a public-facing staff notes page are deferred until demand justifies them.