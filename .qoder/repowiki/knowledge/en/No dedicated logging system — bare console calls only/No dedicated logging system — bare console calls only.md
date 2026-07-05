---
kind: logging_system
name: No dedicated logging system — bare console calls only
category: logging_system
scope:
    - '**'
source_files:
    - app/actions/coding-classes.ts
    - app/actions/registration.ts
    - app/actions/notes.ts
    - lib/email.ts
    - lib/supabase-admin.ts
    - lib/supabase.ts
    - app/admin/dashboard/page.tsx
    - app/page.tsx
---

This repository does not implement a structured or centralized logging system. All diagnostic output is produced via the Node/React built-in `console` API (`console.log`, `console.warn`, `console.error`) scattered directly inside Server Actions and components, with no logger abstraction, log-level configuration, or routing to sinks (files, remote collectors, APM). There are no logging-related dependencies in `package.json` (no pino, winston, bunyan, morgan, next-logger, @opentelemetry, etc.), no `log/` or `logging/` directory, and no error-boundary or global error handler that would capture unhandled exceptions. The only logging conventions observed are ad-hoc string messages like `'Coding Class Registration Error:'`, `'Email sent successfully:'`, and `'Missing Supabase environment variables...'`. As a result, there is no unified log format, no way to filter by severity, and no mechanism to ship logs off-host.