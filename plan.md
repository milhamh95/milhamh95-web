# Plan: milhamh.com personal blog

Decided after grilling session on 2026-09-11.

## Stack
- Astro (clean project, NOT the Astrowind template as a base)
- Tailwind CSS
- Content: Markdown + MDX (`@astrojs/mdx`)
- Package manager: npm
- Fully static output (no server rendering)
- Hosting: Cloudflare Workers (static assets)
- Deploy: Cloudflare Git integration — push to `main` deploys, other branches get preview URLs

## Reference (not shipped)
- Clone https://github.com/arthelokyo/astrowind into `reference/astrowind/`
- Add `reference/` to `.gitignore`
- Used only to copy look/markup (MIT licensed), not wired into the site

## Domain
- `milhamh.com` bought on Namecheap, DNS moves to Cloudflare
- `www.milhamh.com` redirects to `milhamh.com`
- Set up in Phase 5: add domain in Cloudflare → point Namecheap nameservers to Cloudflare → wait for Active → attach domain to the Worker
- Check Cloudflare copied `MX` records if email is used on this domain

## Pages
- Home: short intro + latest 5 posts
- `/blog`: all posts, paginated 10/page (Astrowind `Pagination.astro`)
- `/blog/my-post`: single post
- Tags page
- About page
- RSS feed

## Post content
- Folder: `src/content/blog/my-post/index.md` (or `.mdx`)
- Frontmatter fields:
  - `title` (required)
  - `description` (required)
  - `pubDate` (required)
  - `updatedDate` (optional)
  - `tags` (optional)
  - `draft` (optional, default false)
  - `heroImage` (optional)
- Images live next to the post file, processed by Astro's image pipeline

## Look & design (→ DESIGN.md)
- Base: Astrowind's blog **List** layout (`ListItem.astro` style — image left, text right, works with no image)
- Font: Inter, self-hosted (`@fontsource-variable/inter`)
- Colors: Catppuccin Latte (light) / Catppuccin Mocha (dark), same color names across modes
- Accent color: Mauve
- Dark mode: follows OS preference by default, manual toggle overrides and persists (localStorage)
- Code blocks: always Catppuccin Mocha (both modes), via Shiki

## SEO / sharing
- Auto-generated Open Graph share image per post (post title rendered on a Catppuccin-styled card at build time)
- Sitemap (`@astrojs/sitemap`)
- `robots.txt`
- Titles/descriptions sourced from post frontmatter

## Navigation
- Header: Home, Blog, Tags, About, dark/light toggle
- Footer: RSS link, GitHub icon (LinkedIn to be added later if link is provided), © Muhammad Ilham Hidayat

## Explicitly NOT doing now
- Visitor analytics
- Search
- Comments
- Newsletter
- Second language / i18n
- Custom Claude skills or agents (add only when a task repeats)

## AI guide files
- `DESIGN.md`: written now, before code — colors, fonts, spacing, component look
- `AGENTS.md` + `CLAUDE.md`: written in Phase 4, after real project structure exists; `CLAUDE.md` loads `AGENTS.md` via `@AGENTS.md`

## Build phases (one commit/PR per phase, check after each)
1. `DESIGN.md` + clean Astro project + Tailwind + Catppuccin colors + dark mode toggle
2. Header, footer, Home, About
3. Blog list, post page, Tags, RSS
4. Share images, sitemap, `AGENTS.md` / `CLAUDE.md`
5. Cloudflare Worker deploy + connect `milhamh.com`

## Open items
- LinkedIn / other social links — add when provided
- Git author name has a typo ("Muhammmad" — 3 m's) — fix if wanted
