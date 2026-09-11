---
title: "Setting up Catppuccin light/dark mode in Astro + Tailwind"
description: "How this site's color tokens are wired up so a single accent color change re-skins the whole thing."
pubDate: 2026-09-12
tags: ["astro", "tailwind", "design"]
---

Every Catppuccin color is a CSS variable, redefined once under a `.dark` class. Tailwind's
`@theme` block then points each utility color at that variable, so `bg-base`, `text-mauve`,
and friends just work in both modes with zero `dark:` prefixes needed for color alone.

The accent color is aliased separately:

```css
--color-accent: var(--ctp-mauve);
```

Change that one line, and every link, button, and active nav state follows.
