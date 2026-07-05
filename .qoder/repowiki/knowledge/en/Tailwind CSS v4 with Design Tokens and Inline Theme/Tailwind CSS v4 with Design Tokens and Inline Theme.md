---
kind: frontend_style
name: Tailwind CSS v4 with Design Tokens and Inline Theme
category: frontend_style
scope:
    - '**'
source_files:
    - app/globals.css
    - postcss.config.mjs
    - app/layout.tsx
---

The project uses **Tailwind CSS v4** (via `@tailwindcss/postcss` plugin) as its sole styling system, with all styles applied through utility classes directly in JSX. There is no separate CSS framework or component library — styling is composed inline using Tailwind's atomic utilities.

### System Overview
- **Styling engine**: Tailwind CSS v4 (`tailwindcss@^4`, `@tailwindcss/postcss@^4`) configured via PostCSS.
- **Theme definition**: Centralized in `app/globals.css` using CSS custom properties mapped into Tailwind's new `@theme inline` block.
- **Fonts**: Google Fonts loaded at the root layout level via `next/font/google` (`Geist` sans + `Geist_Mono` mono), exposed as CSS variables and aliased to `--font-sans` / `--font-mono`.
- **Dark mode**: Automatic via `prefers-color-scheme: dark` media query toggling `--background` / `--foreground` tokens.
- **No config file**: No `tailwind.config.*` exists; theme customization happens entirely through CSS variables and the `@theme` directive.

### Design Tokens (from `app/globals.css`)
| Token | Value | Usage |
|---|---|---|
| `--background` | `#ffffff` / `#0a0a0a` (dark) | Page background |
| `--foreground` | `#171717` / `#ededed` (dark) | Body text color |
| `--primary-blue` | `#1e3a8a` | Brand primary (mapped to `--color-primary`) |
| `--secondary-red` | `#dc2626` | Accent / CTA (mapped to `--color-secondary`) |
| `--font-sans` | `var(--font-geist-sans)` | Default font family |
| `--font-mono` | `var(--font-geist-mono)` | Monospace fallback |

These are consumed throughout components via Tailwind class names like `bg-white`, `text-blue-900`, `text-red-600`, `rounded-lg`, `shadow-md`, `sticky top-0 z-50`, etc.

### Conventions Observed
- **Utility-first everywhere**: Every visual style is expressed as Tailwind utility classes on JSX elements — no BEM, CSS modules, or styled-components.
- **Brand colors used by name**: Components reference semantic color names (`blue-900`, `red-600`) rather than raw hex values, keeping consistency with the token layer.
- **Responsive breakpoints**: Standard Tailwind prefixes (`sm:`, `md:`, `xs:`) are used for mobile-first responsive layouts (e.g., hidden desktop nav shown only on `md:block`).
- **Interactive states**: Hover/focus states use `hover:text-*`, `focus:ring-*`, `transition-colors` utilities consistently.
- **Layout patterns**: Common structures like sticky headers (`sticky top-0 z-50`), centered modals (`fixed inset-0 bg-black/50 flex items-center justify-center`), and card containers (`bg-white rounded-xl shadow-md`) are repeated across pages.
- **No shared CSS files per component**: Each page/component composes its own class strings; there is no centralized stylesheet beyond `globals.css`.