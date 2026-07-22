---
kind: design
name: Implement staff e-notes as a Supabase-backed feature in the admin dashboard
source: session
category: adr
---

# Implement staff e-notes as a Supabase-backed feature in the admin dashboard

_Source: coding plans from commit period 16e5f5c → 974010a — records intent at planning time; the implementation may lag or differ._

## Context
Staff needed a way to share internal notes, announcements and urgent items. The requirement was explicitly for use within the existing admin dashboard rather than a public-facing page.

## Decision drivers
- keep implementation simple with plain text (no rich editor)
- reuse existing monolithic dashboard pattern to avoid refactoring risk
- serve only authenticated staff via server actions

## Considered options
- **Tab-specific lazy loading of the notes tab** _(rejected)_ — pros: smaller initial payload; cons: requires refactoring existing working code and introduces regression risk
- **Public staff notes page outside the admin area** _(rejected)_ — pros: easier access for all staff; cons: out of scope for the current requirement which targets the admin dashboard
- **Rich text / Markdown editor for note content** _(rejected)_ — pros: better formatting; cons: adds complexity and deviates from existing textarea patterns used elsewhere
- **Separate React component file for notes UI** _(rejected)_ — pros: cleaner separation of concerns; cons: more file changes; current monolithic dashboard pattern is already established and supports growth

## Decision
Add a new 'staff-notes' tab inside `app/admin/dashboard/page.tsx` backed by a new `rhema_staff_notes` table and a dedicated `staff-notes` storage bucket on Supabase, accessed exclusively through Next.js Server Actions in `app/actions/notes.ts`. Content is stored as plain text with optional file attachments, and pagination/filtering are handled server-side.

## Consequences
The dashboard page grows larger and will need extraction into separate components if it exceeds ~1500 lines. File uploads currently lack client-side size validation (noted as a future mitigation). RLS policies grant service-role write access and allow authenticated upload + public read for the storage bucket.