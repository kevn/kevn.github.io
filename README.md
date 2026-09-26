# kev.in

Kevin Hunt's personal site. Next.js 16 on Vercel; posts are MDX files handled by Velite.

## Develop

```bash
pnpm i
pnpm dev          # http://localhost:3000
pnpm test         # unit tests (Vitest)
pnpm test:e2e     # end-to-end tests (Playwright)
```

## Write

Add `content/writing/YYYY-MM-DD-slug.mdx`:

```mdx
---
title: My post
date: "2026-10-01"
kind: essay        # essay | build-log | field-notes
summary: One or two sentences for cards, feeds and share images.
draft: true        # visible on preview deployments only
---

Words.
```

Archive posts from 2007–08 live in `content/archive/` as HTML-in-Markdown.
