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

## Deploy

Hosted on Vercel (Rival Bear team, project `kev-in`). Use the `vercel-rb` alias, not plain `vercel`.

- Production: merge to `master`, or run `vercel-rb deploy --prod` from `master`. Never promote a preview build (drafts and `robots.txt` are fixed at build time).
- Preview: every PR (once the Vercel GitHub app has repo access), or `vercel-rb deploy`.
- Domain cutover and rollback: see [docs/cutover.md](docs/cutover.md).
- After publishing a post: `INDEXNOW_SUBMIT=true pnpm indexnow` pings Bing and the other IndexNow engines.
