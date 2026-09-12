---
title: "Splitting this blog into Dev Notes and Off Topics"
description: "Why I added a category field instead of reusing tags, and how the per-category fallback cover images work."
pubDate: 2026-09-12
category: "dev-notes"
tags: ["astro"]
---

This site used to have one flat list of posts. As I started planning non-technical
writing alongside the dev stuff, I wanted readers to be able to jump straight to
one or the other — so I added a `category` field to the content schema instead of
reusing tags for it.

## Why a schema field, not a tag

Tags are multi-value by design: a post can have several. Category is meant to be
exclusive — a post is either **Dev Notes** or **Off Topics**, never both. Modeling
that as a required enum in `content.config.ts` makes the constraint explicit and
catches a missing category at build time instead of silently falling through.

## Fallback cover images

Every post list card shows an image. If a post sets its own `heroImage`, that wins.
If it doesn't, the card falls back to a per-category default image instead of
leaving an empty gap — so a page mixing illustrated and plain posts still looks
consistent.

This post has no `heroImage` of its own, so it's using the Dev Notes fallback.
