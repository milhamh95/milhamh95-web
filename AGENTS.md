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
- `src/pages/open-graph/[...slug].ts` — generates the per-post share image; add a post and its
  OG image is generated automatically, nothing to wire up.

## Conventions

- Color via the Catppuccin tokens in `src/styles/global.css` (`bg-base`, `text-accent`, etc.),
  never raw hex or Tailwind's default palette (`gray-500`, `blue-600`, ...).
- Dark mode is the `.dark` class on `<html>`, not Tailwind's `dark:` media-query variant —
  colors already swap via CSS variables, so most components need no `dark:` prefix at all.
- No unnecessary comments. Comment only what the code can't say by itself.

## Don't

- Don't wire up analytics, comments, search, or a second language — explicitly deferred, see
  plan.md.
- Don't add a UI framework (React/Vue/etc.) for a static blog.
- Don't use `text-base` for 16px. The Catppuccin `base` token turns it into the background
  color, so text vanishes. 16px is the default — just omit the size class.
