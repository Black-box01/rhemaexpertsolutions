---
kind: logging_system
name: No dedicated logging system — bare console calls
category: logging_system
scope:
    - '**'
source_files:
    - package.json
    - app/actions/registration.ts
    - app/actions/coding-classes.ts
    - app/actions/notes.ts
    - lib/email.ts
    - lib/images.ts
    - lib/supabase-admin.ts
    - lib/supabase.ts
    - app/admin/dashboard/page.tsx
    - app/page.tsx
    - scripts/upload-missing-images.js
---

This repository does not implement a structured logging system. There is no logger library (e.g., pino, winston, bunyan, morgan), no log-level configuration, no centralized logger initialization, and no `log/` or `logging/` directory. All output is produced via plain Node.js `console.log`, `console.warn`, and `console.error` calls scattered across Server Actions, lib modules, and scripts.

Evidence:
- `package.json` has zero logging dependencies; only Next.js, Supabase, Cloudinary, Nodemailer, React, and Sharp are listed.
- Logging calls appear ad hoc in `app/actions/*.ts` (registration errors, email send failures), `lib/email.ts`, `lib/images.ts`, `lib/supabase*.ts`, `app/admin/dashboard/page.tsx`, `app/page.tsx`, and the `scripts/upload-missing-images.js` utility.
- No shared logger module, no environment-driven log level, no request correlation IDs, and no sink configuration exists.

Consequences: logs are unstructured text lines with inconsistent message formats, making aggregation, filtering, and alerting difficult. There is no separation between info/warn/error semantics beyond the chosen `console.*` method.