# AGENTS.md

Personal blog. Astro (static output) + Tailwind + Markdown/MDX, deployed to Cloudflare Workers.
See [plan.md](./plan.md) for the full project plan and [DESIGN.md](./DESIGN.md) for the design
system — read DESIGN.md before touching any styling.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build to `./dist/` (run this before considering a change done)
- `npm run preview` — preview the production build

## Structure

- `src/content/blog/<slug>/index.md(x)` — one post per folder, images live alongside it.
  Frontmatter schema is enforced by `src/content.config.ts`.
- `src/lib/posts.ts` — shared helpers (`getPublishedPosts`, `formatDate`). Use these instead
  of calling `getCollection("blog")` directly, so drafts and sort order stay consistent.
- `src/components/` — `Header`, `Footer`, `ThemeToggle`, `PostListItem`. Structure/markup was
  adapted from `reference/astrowind/` (gitignored, MIT-licensed template, reference only —
  never import from it).
- Interactive post diagrams (e.g. `KafkaPartitionKeyMotion.tsx`) use React + framer motion via
  `@astrojs/react`, hydrated with `client:load` in the post's `.mdx`. Prefer this over vanilla
  JS/CSS for anything with timed, sequenced, or physics-based animation (state machines with
  multiple in-flight async pieces) — see `KafkaPartitionKey.astro` vs `KafkaPartitionKeyMotion.tsx`
  for why: framer motion's `onAnimationComplete` avoids manual race-condition guards (stale
  timers/intervals firing after a reset) that the vanilla version needs by hand. Static,
  non-interactive markup stays plain `.astro` — don't reach for React by default.
- `src/pages/open-graph/[...slug].ts` — generates the per-post share image; add a post and its
  OG image is generated automatically, nothing to wire up.
- Drafts (`draft: true`): visible by direct URL in `npm run dev` only (`src/pages/blog/[slug].astro`
  checks `import.meta.env.DEV`), and listed in the nav's dev-only "Drafts" link →
  `src/pages/drafts/[...path].astro`. `getPublishedPosts()` always filters drafts out, even in
  dev — so a draft never appears in the homepage/blog list/tags, only via that Drafts page or a
  direct URL. Both 404 in production automatically.

## Conventions

- Color via the Catppuccin tokens in `src/styles/global.css` (`bg-base`, `text-accent`, etc.),
  never raw hex or Tailwind's default palette (`gray-500`, `blue-600`, ...).
- Dark mode is the `.dark` class on `<html>`, not Tailwind's `dark:` media-query variant —
  colors already swap via CSS variables, so most components need no `dark:` prefix at all.
- No unnecessary comments. Comment only what the code can't say by itself.

## Don't

- Don't wire up analytics, comments, search, or a second language — explicitly deferred, see
  plan.md.
- Don't reach for React outside of interactive diagrams/animations (see above) — everything
  else (layout, content, static UI) stays plain `.astro` components.
- Don't use `text-base` for 16px. The Catppuccin `base` token turns it into the background
  color, so text vanishes. 16px is the default — just omit the size class.
