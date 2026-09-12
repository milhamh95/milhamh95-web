# Build phases

Tracks progress on [plan.md](./plan.md). One phase at a time, checked before moving on.

## Phase 1 — Base setup ✅ done

- [x] Clean Astro project (no Astrowind base)
- [x] Tailwind CSS
- [x] Catppuccin Latte (light) / Mocha (dark) colors, mapped in `src/styles/global.css`
- [x] Mauve accent, aliased as `accent`
- [x] Inter font, self-hosted
- [x] Dark mode: follows OS setting, toggle overrides + persists, no flash on load
- [x] `DESIGN.md` written
- [x] `reference/astrowind/` cloned in, gitignored

## Phase 2 — Header, Footer, Home, About ✅ done

- [x] Header: Home, Blog, Tags, About links + theme toggle (desktop nav + mobile menu)
- [x] Footer: RSS link, GitHub icon, © Muhammad Ilham Hidayat
- [x] Home page: short intro + latest posts (wired to real content in Phase 3)
- [x] About page

## Phase 3 — Blog ✅ done

- [x] Content collection for blog posts (`src/content.config.ts`, frontmatter schema from plan.md)
- [x] `/blog` list page, 10 posts/page, Astrowind List layout (`PostListItem.astro`)
- [x] `/blog/<slug>` single post page
- [x] Tags index + `/tags/<tag>` page
- [x] RSS feed (`/rss.xml`)
- [x] Shiki code block theme: always `catppuccin-mocha`
- [x] MDX support (`@astrojs/mdx`)
- [x] 2 sample posts added to prove the pipeline end to end

## Phase 4 — Polish + AI guide files ✅ done

- [x] Auto-generated Open Graph share image per post (`astro-og-canvas`, always Mocha-styled)
- [x] Sitemap (`@astrojs/sitemap`)
- [x] `robots.txt`
- [x] `AGENTS.md` + `CLAUDE.md` (loads `AGENTS.md` via `@AGENTS.md`)

Verified: `npm run build` succeeds, all routes return 200, screenshots checked in both light
and dark mode (home, blog list, post page) — colors, toggle, and code block theme all correct.

## Phase 5 — Deploy ✅ done

- [x] `wrangler.jsonc` (static assets, `./dist`) + `404.astro` added
- [x] Cloudflare Worker set up, repo connected, Git integration live — push to `main` deploys
- [x] Live at `*.workers.dev`
- [x] Add `milhamh.com` to Cloudflare, point Namecheap nameservers
- [x] Attach `milhamh.com` to the Worker; `www` → root via a Redirect Rule (proxied `www` A record `192.0.2.1`, dynamic target `concat("https://milhamh.com", http.request.uri.path)`, 301, keeps query)
- [x] `astro.config.mjs` `site` is already `https://milhamh.com`, no change needed
