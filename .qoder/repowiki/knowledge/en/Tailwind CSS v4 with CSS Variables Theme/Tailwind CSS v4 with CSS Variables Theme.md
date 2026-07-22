---
kind: frontend_style
name: Tailwind CSS v4 with CSS Variables Theme
category: frontend_style
scope:
    - '**'
source_files:
    - app/globals.css
    - app/layout.tsx
    - postcss.config.mjs
    - components/Header.tsx
---

The project uses **Tailwind CSS v4** (via `@tailwindcss/postcss` and `tailwindcss@^4`) configured through the new CSS-first approach — there is no `tailwind.config.js`. Styles are declared in `app/globals.css`, which imports Tailwind via `@import "tailwindcss"` and defines a minimal design system using CSS custom properties mapped into Tailwind's theme through `@theme inline`.

**Design tokens**
- Colors: `--background`, `--foreground`, `--primary-blue` (`#1e3a8a`), `--secondary-red` (`#dc2626`) exposed as `--color-*` variables for use as Tailwind utilities (`bg-primary`, `text-secondary`, etc.).
- Fonts: Google Fonts `Geist Sans` and `Geist Mono` loaded via `next/font/google` in `app/layout.tsx` and registered as `--font-geist-sans` / `--font-geist-mono` CSS variables, then mapped to `--font-sans` / `--font-mono` in the theme. A fallback `Arial, Helvetica, sans-serif` is set on `body`.
- Dark mode: A `prefers-color-scheme: dark` media query overrides background/foreground tokens; no explicit class-based dark-mode toggle exists.

**Styling methodology**
- All UI styling is done with **utility-first Tailwind classes** directly in JSX (`className="..."`). There are no component-level CSS files or CSS-in-JS libraries.
- Components live in `components/` (e.g., `Header.tsx`, `HeroSlideshow.tsx`, `ImageWithSkeleton.tsx`) and compose layout/typography/colors purely from Tailwind utilities.
- No third-party UI kit (no shadcn/ui, MUI, Chakra, etc.) — every button, card, modal, and navigation element is hand-built with Tailwind classes.

**Responsive strategy**
- Mobile-first breakpoints follow Tailwind defaults (`sm:`, `md:`, `lg:`). The header hides desktop nav behind a hamburger drawer at `md:hidden`, and shows it at `md:block`.
- No custom breakpoint configuration was found in any config file.

**Build pipeline**
- `postcss.config.mjs` registers only `@tailwindcss/postcss`; no other PostCSS plugins (autoprefixer, cssnano) are present.
- `next.config.ts` has no style-related overrides (no custom CSS path, no image optimization tweaks).

**Conventions developers should follow**
- Put global tokens (colors, fonts, spacing) in `app/globals.css` under `:root` and expose them via `@theme inline` so they become available as Tailwind utilities.
- Style components exclusively with Tailwind utility classes in `className` props; avoid adding new `.css` files unless defining a truly global rule.
- Prefer semantic color names (`primary`, `secondary`, `background`, `foreground`) over raw hex values scattered across components.
- Use `prefers-color-scheme` for dark-mode overrides rather than toggling classes, since no JS-driven dark mode exists.