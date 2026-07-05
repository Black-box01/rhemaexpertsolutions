---
kind: frontend_style
name: Tailwind CSS v4 with Design Tokens and Dark Mode
category: frontend_style
scope:
    - '**'
source_files:
    - app/globals.css
    - postcss.config.mjs
    - package.json
    - components/Header.tsx
---

The project uses Tailwind CSS v4 (via `@tailwindcss/postcss` plugin) as its sole styling system, applied through utility classes directly in JSX components. There is no separate CSS framework or component library — all visual presentation lives in inline Tailwind class strings across the `app/` and `components/` directories.

**Design tokens and theming** are centralized in `app/globals.css`. A small set of CSS custom properties defines the brand palette (`--primary-blue: #1e3a8a`, `--secondary-red: #dc2626`) and semantic tokens (`--background`, `--foreground`) that are re-exported into Tailwind's theme namespace via an `@theme inline` block. This makes `bg-primary`, `text-secondary`, etc. available throughout the app while keeping color values in one place.

**Dark mode** is handled automatically via a `prefers-color-scheme: dark` media query that overrides the root background and foreground variables; no explicit `dark:` utilities are used yet, so the site currently only adapts to system preference rather than offering a toggle.

**Typography** defaults to Arial/Helvetica sans-serif on the body, but Tailwind's `font-sans` token points at Geist Sans (Next.js default), which can be leveraged by applying `font-sans` where needed. No custom font files are loaded beyond what Next.js provides.

**Responsive strategy** is mobile-first using Tailwind's standard breakpoint prefixes (`sm:`, `md:`, `xs:`). The Header component demonstrates this pattern extensively — hiding desktop nav behind `hidden md:block`, showing a hamburger menu with `md:hidden`, and adjusting text sizes with `text-sm sm:text-xl`.

**No Tailwind config file exists** (`tailwind.config.*` is absent); configuration is minimal and relies on Tailwind v4's new CSS-based theme approach plus Next.js defaults. Custom breakpoints like `xs:` appear to come from Tailwind's built-in extended breakpoints.

**Component-level styling conventions** observed:
- Interactive elements use consistent hover states (`hover:text-red-600`, `hover:bg-blue-50`) paired with `transition-colors` for smooth feedback.
- Layouts rely on Flexbox utilities (`flex`, `justify-between`, `items-center`, `space-x-*`) rather than grid.
- Z-index layering is managed explicitly with numeric Tailwind z-values (`z-40`, `z-50`) for overlays and dropdowns.
- Shadows use Tailwind's shadow scale (`shadow-sm`, `shadow-xl`, `shadow-2xl`) consistently across cards, headers, and drawers.