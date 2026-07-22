---
kind: frontend_style
name: Tailwind CSS v4 Design System with CSS Variables Theming
category: frontend_style
scope:
    - '**'
source_files:
    - app/globals.css
    - postcss.config.mjs
    - app/layout.tsx
    - next.config.ts
---

The project uses Tailwind CSS v4 (via `@tailwindcss/postcss`) as its sole styling system, applied through utility classes directly in JSX components. There is no separate `tailwind.config.js` — configuration is minimal and centralized in `postcss.config.mjs`, which only registers the Tailwind PostCSS plugin.

**Design tokens and theming** are defined exclusively in `app/globals.css` using CSS custom properties under `:root`. The token set includes:
- Semantic color tokens: `--background`, `--foreground`, `--primary-blue` (#1e3a8a), `--secondary-red` (#dc2626)
- Font tokens: `--font-geist-sans`, `--font-geist-mono` (from next/font Google Fonts)
These are exposed to Tailwind via the `@theme inline` block so they map to `bg-primary`, `text-secondary`, etc.

**Dark mode** is handled purely via a `prefers-color-scheme: dark` media query that overrides `--background` and `--foreground` on `:root`; there is no explicit class-based dark-mode toggle.

**Typography** comes from Next.js built-in font loading (`Geist` and `Geist_Mono` via `next/font/google`) injected into the root `<body>` className alongside `antialiased`. The body also falls back to `Arial, Helvetica, sans-serif`.

**Styling approach**: Components in `components/` and pages in `app/` use Tailwind utility classes inline (e.g., `className="min-h-screen bg-gray-50 p-8 rounded-xl shadow-md"`). No CSS modules, SCSS, styled-components, or component library (shadcn/ui, MUI, etc.) is used. Layout primitives like spacing, colors, and typography are expected to be composed from Tailwind utilities rather than extracted into shared CSS classes.

**Image handling** for visual assets is delegated to Cloudinary; Next.js image optimization is disabled (`unoptimized: true`) in `next.config.ts` because Cloudinary already performs resizing/formatting.