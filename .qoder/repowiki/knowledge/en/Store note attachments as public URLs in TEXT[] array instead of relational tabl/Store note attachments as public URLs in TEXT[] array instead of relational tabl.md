---
kind: design
name: Store note attachments as public URLs in TEXT[] array instead of relational table
source: session
category: adr
---

# Store note attachments as public URLs in TEXT[] array instead of relational table

_Source: coding plans from commit period 4dfd475 → 16e5f5c — records intent at planning time; the implementation may lag or differ._

## Context
Staff e-notes support optional file attachments. The design needed to decide between storing attachment metadata in a separate database table versus embedding references directly in the note row.

## Decision drivers
- simplicity of schema
- avoid join complexity for small number of attachments per note
- match existing patterns in the codebase

## Considered options
- **TEXT[] column for file_urls on rhema_staff_notes** — pros: Single table query returns everything; no joins; simple upload/delete flow; matches plan's straightforward approach
- **Separate attachments table with FK to notes** _(rejected)_ — pros: Normalized schema; easier to track attachment lifecycle independently; cons: Requires JOINs to fetch notes with attachments; more complex delete cascade logic; overkill for the expected usage pattern

## Decision
Store attachment public URLs in a TEXT[] column (file_urls) on the rhema_staff_notes table, with corresponding tags stored in a separate TEXT[] column. Files are uploaded to the 'staff-notes' Supabase Storage bucket under an 'attachments/' prefix.

## Consequences
Attachments are tightly coupled to their parent note — deleting a note does not automatically clean up orphaned files (a future cleanup job would be needed). Querying is simpler since all note data including attachment references comes back in one row. There is no built-in deduplication if the same file is attached to multiple notes.