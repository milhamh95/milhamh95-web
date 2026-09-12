# Design system

Reference: [plan.md](./plan.md) for the full project plan.

## Colors

[Catppuccin](https://catppuccin.com/palette/) — Latte for light mode, Mocha for dark mode. Same color
names in both; only the hex values change. Defined as CSS custom properties in
[src/styles/global.css](./src/styles/global.css), mapped to Tailwind utilities via `@theme`
(e.g. `bg-base`, `text-mauve`, `border-surface0`).

Roles:
- `base` / `mantle` / `crust` — page background, darkest at `crust`
- `text` / `subtext1` / `subtext0` — body text, dimmer for secondary text
- `overlay2` / `overlay1` / `overlay0` — borders, dividers, disabled states
- `surface2` / `surface1` / `surface0` — cards, hover backgrounds
- `accent` (alias for `mauve`) — links, buttons, active nav item, tags. Change once in
  `global.css` to re-skin the whole site.
- Other named colors (`red`, `green`, `peach`, `blue`, etc.) — available for one-off use
  (e.g. a warning callout), not the primary accent.

Dark mode: toggled by a `.dark` class on `<html>`. Defaults to the OS preference, overridden
and persisted via `localStorage` (see `src/components/ThemeToggle.astro` and the inline
script in `src/layouts/Layout.astro`). No flash on load.

## Typography

Font: [Inter Variable](https://fontsource.org/fonts/inter), self-hosted via
`@fontsource-variable/inter`. No Google Fonts network call.

Sizes (16px base, nothing below 14px):

- Post body / About: `prose` (16px)
- Post title `text-4xl`, page titles `text-3xl`, post list titles + logo `text-xl`
- Summaries, nav links, footer: no size class (inherits 16px). Never write `text-base` — it
  compiles to the Catppuccin `base` color (the page background), not 16px, and hides the text
- Dates, tag pills: `text-sm` (smallest size on the site)

Paragraphs in `.prose` (post body, About) are justified with `hyphens: auto`, set in
`global.css` — no per-page class needed.

## Layout

Header and footer sit on `bg-mantle` (one shade darker than the `base` page, in both
flavors) plus a `surface0` border, so they read as separate without a loud color.

Reading-focused, single-column. Content is capped at a comfortable line length
(`max-w-2xl`/`max-w-3xl`), generous vertical spacing, minimal chrome.

Blog post lists use the Astrowind "List" layout: image on the left (when a post has
`heroImage`), title/date/summary on the right. Falls back to text-only cleanly when there's
no image — do not use a grid/card layout, which leaves empty space for image-less posts.

## Code blocks

Always Catppuccin **Mocha**, in both light and dark site mode, via Shiki
(`shikiConfig.theme: 'catppuccin-mocha'` in `astro.config.mjs`, added in Phase 3 alongside
the post page).

## Components

- `Layout.astro` — page shell: `<head>`, font/CSS imports, no-flash theme script
- `ThemeToggle.astro` — dark/light toggle button
- (Phase 2+) `Header`, `Footer`, post list item, tag pill — copy structure from
  `reference/astrowind/src/components/` (Tailwind classes), adapt colors to the tokens above
