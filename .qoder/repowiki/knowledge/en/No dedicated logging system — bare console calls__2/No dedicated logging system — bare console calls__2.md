---
kind: logging_system
name: No dedicated logging system — bare console calls
category: logging_system
scope:
    - '**'
---

This repository does not implement a structured logging system. There is no logging framework (e.g., Winston, Pino, Bunyan), no centralized logger module, no log-level configuration, and no dedicated `log/` or `logging/` directory. All output is produced via ad-hoc `console.log`, `console.warn`, and `console.error` calls scattered across server actions (`app/actions/*.ts`), the admin dashboard page, and a few `lib/` modules. The calls are unstructured strings with no consistent fields, timestamps, correlation IDs, or sink routing. No logging-related dependencies appear in `package.json`. As a result, this category does not apply to the project.