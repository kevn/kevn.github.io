# kev.in Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task by task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Jekyll/Astro kev.in with a Next.js 16 site in the R1 "Tomorrowland" retro-futurist design, with the 2007–08 archive migrated, and deploy it to Vercel under the Rival Bear team.

**Architecture:** A statically generated Next.js 16 App Router site. Content comes from Velite: new posts in `.mdx`, archive posts in `.md` with raw HTML, and a `now` page. Pure TypeScript modules hold the logic (dates, elapsed time, post queries, redirects) and are unit-tested with Vitest. Visual components are server components wherever possible; only the NOW/ELAPSED readouts run on the client. Motion is CSS and SVG only, and is turned off under `prefers-reduced-motion`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Velite, rehype-pretty-code (Shiki), next/og, @vercel/analytics, @vercel/speed-insights, Vitest + Testing Library, Playwright + @axe-core/playwright, opentype.js (build-time script), pnpm, Node ≥ 22.

**Spec:** `docs/superpowers/specs/2026-09-26-kev-in-redesign-design.md`. Read it first. The design reference is artboard R1 on https://claude.ai/artifact/KRTebxa5JTnfw7YCf3PKbo; its generator source is kept locally at `scratchpad/kevin-design/build_r1.py` and `project/R1-Tomorrowland.dc.html`.

## Global Constraints

- Next.js `^16`, React `^19`, Tailwind `^4`, Velite `^0.3.1`. Match `~/prj/rb/rivalbear` versions and patterns.
- pnpm only; Node ≥ 22.
- Tokens, exactly: `--ink #0c0b1c`, `--ink-2 #12102a`, `--cream #f2ece0`, `--muted #bdb8d6`, `--violet #7b6cff`, `--cyan #3ff0ff`, `--green #8bff6b`, `--magenta #ff4fd8`, `--atomic #ff6b35`, `--amber #ffb000`.
- Fonts: Michroma (display), Instrument Sans (body), Space Mono (labels), Yellowtail (at most one line per view), DSEG14 Classic (stamps, self-hosted).
- Title template: `{title} · kev.in`. Canonical origin: `https://kev.in`.
- Drafts are included only when `process.env.VERCEL_ENV !== 'production'`.
- Every animation must stop under `prefers-reduced-motion: reduce`.
- No horizontal scroll at 360px width.
- Budgets: Lighthouse mobile Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO = 100; home-page client JS < 90 KB gzipped, excluding analytics.
- No fake OS windows, terminal menus or slash-command UI. No gradient washes as decoration.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.

**Deviation from the spec, deliberately:** instead of wildcard patterns, the legacy redirects are generated as explicit source→destination pairs from the archive filenames (`legacyRedirects(filenames)`). Path-to-regexp handling of `:slug.html` and `page:n` is ambiguous; explicit pairs are exact and testable. §4 of the spec is updated to match in Task 4.

## Review Focus

1. **NOW stamp rendering on the server:** a statically built page must not freeze the build date into NOW. The server renders ghost digits only and the client fills them in. Tested in Task 8.
2. **Archive posts with raw HTML** (`<p>`, `<a title>`, `<img>`, `<pre>`) must render with their markup intact, not escaped or stripped. Tested in Task 3.
3. **Old URLs with and without `.html`,** plus `/page2`–`/page4`, `/tags/...` and `/atom.xml`, must all land on a real page. Tested in Tasks 4 and 13.
4. **Timezone edges:** a post dated `2007-02-06T00:00:00-08:00` must display `FEB 06 2007` for everyone, not `FEB 05`. Written dates are formatted from the calendar date in the source string. Tested in Task 2.
5. **A draft post must not leak into production** through any channel: the index, home, feed, sitemap, llms.txt, or a direct URL. Tested in Tasks 3 and 12.

---

### Task 1: Clean slate and scaffold

**Files:**
- Delete: all tracked files except `.git/`, `docs/`, `LICENSE.md`, `.gitignore`, `src/content/blog/` (moved in Task 3) and `public/images/` (kept)
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/lib/site.ts`, `src/lib/site.test.ts`, `.gitignore`, `README.md`

**Interfaces:**
- Produces: `site` from `@/lib/site`, typed `{ name: 'kev.in'; url: 'https://kev.in'; author: 'Kevin Hunt'; email: 'hi@kev.in'; description: string }`. The `@/*` path alias maps to `src/*`, and `#site/content` maps to `.velite`.

- [ ] **Step 1: Tag the pre-redesign tree for rollback**

```bash
git tag pre-redesign origin/master
git push origin pre-redesign
```

- [ ] **Step 2: Move the archive sources aside, then remove the old tree**

```bash
mkdir -p content/archive
git mv src/content/blog/*.md content/archive/
git rm -r -q --ignore-unmatch _config.yml _docs _includes _layouts _posts _site 404.html atom.xml index.html Gemfile Gemfile.lock .ruby-version add-blank-lines.sh cleanup-code-blocks.sh convert-code-blocks.sh fix_markdown.py fix-code-blocks-spacing.sh fix-jekyll-vars.sh migrate-posts.sh README-MIGRATION.md astro.config.mjs tsconfig.json package.json package-lock.json src public/favicon.ico public/apple-touch-icon-144-precomposed.png .nojekyll
rm -rf .astro .sass-cache node_modules _site
```

Keep `CNAME` and `.github/workflows/deploy.yml` until cutover (Task 14), so the old site keeps deploying from `master` if anything is merged early.

- [ ] **Step 3: Write `package.json`**

```json
{
  "name": "kev-in",
  "private": true,
  "packageManager": "pnpm@9.15.4",
  "engines": { "node": ">=22" },
  "scripts": {
    "predev": "velite",
    "dev": "next dev",
    "prebuild": "velite",
    "build": "next build",
    "start": "next start",
    "pretypecheck": "velite",
    "typecheck": "tsc --noEmit",
    "pretest": "velite",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "wordmark": "node scripts/build-wordmark.mjs"
  }
}
```

Then install:

```bash
pnpm add next@^16 react@^19 react-dom@^19 velite@^0.3.1 @vercel/analytics @vercel/speed-insights rehype-pretty-code shiki
pnpm add -D typescript @types/node @types/react @types/react-dom tailwindcss@^4 @tailwindcss/postcss@^4 vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @playwright/test @axe-core/playwright opentype.js
```

- [ ] **Step 4: Write the configs**

`tsconfig.json`: copy `~/prj/rb/rivalbear/tsconfig.json` verbatim, but set `"exclude": ["node_modules"]`.

`postcss.config.mjs`:
```js
const config = { plugins: { '@tailwindcss/postcss': {} } }
export default config
```

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', setupFiles: ['./vitest.setup.ts'], globals: true, include: ['src/**/*.test.{ts,tsx}'] },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#site/content': fileURLToPath(new URL('./.velite', import.meta.url)),
    },
  },
})
```

`vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest'
```

`playwright.config.ts`:
```ts
import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:3100' },
  webServer: { command: 'pnpm build && pnpm start -p 3100', url: 'http://localhost:3100', timeout: 240_000, reuseExistingServer: !process.env.CI },
})
```

`next.config.ts` (redirects are added in Task 4):
```ts
import type { NextConfig } from 'next'
const nextConfig: NextConfig = {}
export default nextConfig
```

`.gitignore`:
```
node_modules/
.next/
.velite/
public/static/
.vercel/
test-results/
playwright-report/
.superpowers/
.DS_Store
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 5: Write the failing test for `site`**

`src/lib/site.test.ts`:
```ts
import { site } from './site'
it('describes the canonical site', () => {
  expect(site.url).toBe('https://kev.in')
  expect(site.name).toBe('kev.in')
  expect(site.email).toBe('hi@kev.in')
})
```

Run: `pnpm vitest run src/lib/site.test.ts`. Expected: FAIL (cannot find module `./site`). Note that `pretest` runs velite, which may warn about no config yet. Run vitest directly as shown.

- [ ] **Step 6: Implement `site`, a minimal layout and page**

`src/lib/site.ts`:
```ts
export const site = {
  name: 'kev.in',
  url: 'https://kev.in',
  author: 'Kevin Hunt',
  email: 'hi@kev.in',
  description:
    'Kevin Hunt — CTO of Deep Fathom, founder of Rival Bear, engineer #6 at Yammer. Writing about agents, engineering leadership and flying machines.',
} as const
```

`src/app/globals.css`:
```css
@import 'tailwindcss';
```

`src/app/layout.tsx`:
```tsx
import './globals.css'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
```

`src/app/page.tsx`:
```tsx
export default function Home() { return <main>kev.in</main> }
```

`README.md`: two sections, "Develop" (`pnpm i`, `pnpm dev`, `pnpm test`, `pnpm test:e2e`) and "Write" (add `content/writing/YYYY-MM-DD-slug.mdx`; set `draft: true` to preview only).

- [ ] **Step 7: Verify**

Run: `pnpm vitest run src/lib/site.test.ts`. Expected: PASS.
Run: `pnpm next build`. Expected: build succeeds (velite is not wired yet, so call `next build` directly).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Clean slate: replace Jekyll/Astro tree with Next.js 16 scaffold

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Date and elapsed-time logic

**Files:**
- Create: `src/lib/dates.ts`, `src/lib/dates.test.ts`, `src/lib/elapsed.ts`, `src/lib/elapsed.test.ts`

**Interfaces:**
- Produces:
  - `calendarDate(iso: string): { y: number; m: number; d: number }`: the calendar date as written in the source ISO string (the first 10 characters), independent of timezone.
  - `todayLocal(now?: Date): { y; m; d }`
  - `formatStamp(c: { y; m; d }): string` returns `'MAY 17 2007'`
  - `formatLong(c): string` returns `'May 17, 2007'`
  - `elapsed(from: {y;m;d}, to: {y;m;d}): { value: number; unit: 'YRS' | 'MOS' | 'DYS' }`
  - `formatElapsed(e): string` returns `'19 YRS'`, `'03 MOS'`, `'00 DYS'`
  - `describeElapsed(e): string` returns `'19 years ago'`, `'1 year ago'`, `'3 months ago'`, `'today'`

- [ ] **Step 1: Write the failing tests**

`src/lib/dates.test.ts`:
```ts
import { calendarDate, formatStamp, formatLong, todayLocal } from './dates'

it('reads the calendar date from the source string, ignoring timezone', () => {
  expect(calendarDate('2007-02-06T00:00:00-08:00')).toEqual({ y: 2007, m: 2, d: 6 })
  expect(calendarDate('2026-10-01')).toEqual({ y: 2026, m: 10, d: 1 })
})
it('formats stamps and long dates', () => {
  expect(formatStamp({ y: 2007, m: 5, d: 17 })).toBe('MAY 17 2007')
  expect(formatStamp({ y: 2026, m: 9, d: 6 })).toBe('SEP 06 2026')
  expect(formatLong({ y: 2007, m: 5, d: 17 })).toBe('May 17, 2007')
})
it('reads today in local time', () => {
  expect(todayLocal(new Date(2026, 8, 26, 23, 59))).toEqual({ y: 2026, m: 9, d: 26 })
})
it('rejects a malformed date', () => {
  expect(() => calendarDate('not a date')).toThrow()
})
```

`src/lib/elapsed.test.ts`:
```ts
import { elapsed, formatElapsed, describeElapsed } from './elapsed'
const c = (y: number, m: number, d: number) => ({ y, m, d })

it('counts whole years once at least a year has passed', () => {
  expect(elapsed(c(2007, 5, 17), c(2026, 9, 26))).toEqual({ value: 19, unit: 'YRS' })
  expect(elapsed(c(2007, 9, 27), c(2026, 9, 26))).toEqual({ value: 18, unit: 'YRS' })
})
it('falls back to months, then days', () => {
  expect(elapsed(c(2026, 6, 26), c(2026, 9, 26))).toEqual({ value: 3, unit: 'MOS' })
  expect(elapsed(c(2026, 6, 27), c(2026, 9, 26))).toEqual({ value: 2, unit: 'MOS' })
  expect(elapsed(c(2026, 9, 14), c(2026, 9, 26))).toEqual({ value: 12, unit: 'DYS' })
  expect(elapsed(c(2026, 9, 26), c(2026, 9, 26))).toEqual({ value: 0, unit: 'DYS' })
})
it('handles leap days', () => {
  expect(elapsed(c(2024, 2, 29), c(2025, 2, 28))).toEqual({ value: 11, unit: 'MOS' })
  expect(elapsed(c(2024, 2, 29), c(2025, 3, 1))).toEqual({ value: 1, unit: 'YRS' })
})
it('clamps a future date to zero days', () => {
  expect(elapsed(c(2027, 1, 1), c(2026, 9, 26))).toEqual({ value: 0, unit: 'DYS' })
})
it('formats and describes', () => {
  expect(formatElapsed({ value: 3, unit: 'MOS' })).toBe('03 MOS')
  expect(formatElapsed({ value: 19, unit: 'YRS' })).toBe('19 YRS')
  expect(describeElapsed({ value: 1, unit: 'YRS' })).toBe('1 year ago')
  expect(describeElapsed({ value: 3, unit: 'MOS' })).toBe('3 months ago')
  expect(describeElapsed({ value: 0, unit: 'DYS' })).toBe('today')
  expect(describeElapsed({ value: 1, unit: 'DYS' })).toBe('1 day ago')
})
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `pnpm vitest run src/lib/dates.test.ts src/lib/elapsed.test.ts`. Expected: FAIL (modules missing).

- [ ] **Step 3: Implement**

`src/lib/dates.ts`:
```ts
export interface CalendarDate { y: number; m: number; d: number }
const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function calendarDate(iso: string): CalendarDate {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) throw new Error(`Not an ISO date: ${iso}`)
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) }
}
export function todayLocal(now: Date = new Date()): CalendarDate {
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() }
}
export const formatStamp = (c: CalendarDate) => `${MON[c.m - 1]} ${String(c.d).padStart(2, '0')} ${c.y}`
export const formatLong = (c: CalendarDate) => `${MONTH[c.m - 1]} ${c.d}, ${c.y}`
```

Velite's `s.isodate()` normalizes to UTC and would shift `2007-02-06T00:00:00-08:00`. So the Velite schema in Task 3 keeps the raw string as `dateRaw` and `calendarDate` always reads that.

`src/lib/elapsed.ts`:
```ts
import type { CalendarDate } from './dates'
export type ElapsedUnit = 'YRS' | 'MOS' | 'DYS'
export interface Elapsed { value: number; unit: ElapsedUnit }

const dayNumber = (c: CalendarDate) => Date.UTC(c.y, c.m - 1, c.d) / 86_400_000

export function elapsed(from: CalendarDate, to: CalendarDate): Elapsed {
  if (dayNumber(to) <= dayNumber(from)) return { value: 0, unit: 'DYS' }
  let months = (to.y - from.y) * 12 + (to.m - from.m)
  if (to.d < from.d) months -= 1
  if (months >= 12) return { value: Math.floor(months / 12), unit: 'YRS' }
  if (months >= 1) return { value: months, unit: 'MOS' }
  return { value: dayNumber(to) - dayNumber(from), unit: 'DYS' }
}
export const formatElapsed = (e: Elapsed) => `${String(e.value).padStart(2, '0')} ${e.unit}`
const WORD: Record<ElapsedUnit, string> = { YRS: 'year', MOS: 'month', DYS: 'day' }
export function describeElapsed(e: Elapsed): string {
  if (e.value === 0 && e.unit === 'DYS') return 'today'
  return `${e.value} ${WORD[e.unit]}${e.value === 1 ? '' : 's'} ago`
}
```

Check the leap case: from 2024-02-29 to 2025-03-01 gives months = 12 + 1 = 13, and 1 < 29 makes it 12, so 1 YRS. To 2025-02-28 gives 12, and 28 < 29 makes it 11, so 11 MOS. Correct.

- [ ] **Step 4: Run the tests and watch them pass**

Run: `pnpm vitest run src/lib/dates.test.ts src/lib/elapsed.test.ts`. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib && git commit -m "Add calendar date and elapsed-time logic

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Content pipeline and post queries

**Files:**
- Create: `velite.config.ts`, `src/lib/posts.ts`, `src/lib/posts.test.ts`, `src/lib/archive-content.test.ts`, `content/pages/now.mdx`, `content/writing/.gitkeep`
- Modify: `content/archive/*.md` (frontmatter only: add nothing; the schema maps `categories`)

**Interfaces:**
- Consumes: `calendarDate`, `CalendarDate` from `@/lib/dates`.
- Produces from `@/lib/posts`:
  - `type PostKind = 'essay' | 'build-log' | 'field-notes' | 'archive'`
  - `interface Post { slug: string; url: string; title: string; dateRaw: string; date: CalendarDate; updated?: CalendarDate; kind: PostKind; draft: boolean; summary: string; tags: string[]; format: 'mdx' | 'html'; body: string }`. `body` is the compiled MDX code for `mdx` and HTML for `html`.
  - `includeDrafts(env?: string): boolean`
  - `selectPosts(all: Post[], env?: string): Post[]`: drafts filtered, sorted newest first by `dateRaw`
  - `homeDispatches(posts: Post[], n?: number): Post[]`
  - `assertUniqueSlugs(posts: Post[]): void`
  - `getPosts(): Post[]` (from Velite data, with the env applied)
  - `getPost(slug: string): Post | undefined`
  - `adjacentPosts(slug: string): { newer?: Post; older?: Post }`
  - `KIND_LABEL: Record<PostKind, string>` (`'ESSAY'`, `'BUILD LOG'`, `'FIELD NOTES'`, `'ARCHIVE'`)
  - `slugFromPath(path: string): string`
- Produces from `#site/content`: the `writing`, `archive` and `pages` arrays.

- [ ] **Step 1: Write the Velite config**

`velite.config.ts`:
```ts
import { defineConfig, defineCollection, s } from 'velite'
import rehypePrettyCode from 'rehype-pretty-code'

const common = {
  title: s.string().max(140),
  dateRaw: s.string().regex(/^\d{4}-\d{2}-\d{2}/),
  path: s.path(),
  excerpt: s.excerpt({ length: 200 }),
}

const writing = defineCollection({
  name: 'WritingEntry',
  pattern: 'writing/*.mdx',
  schema: s.object({
    ...common,
    updatedRaw: s.string().regex(/^\d{4}-\d{2}-\d{2}/).optional(),
    kind: s.enum(['essay', 'build-log', 'field-notes']),
    draft: s.boolean().default(false),
    summary: s.string().max(300).optional(),
    tags: s.array(s.string()).default([]),
    code: s.mdx(),
  }),
})

const archive = defineCollection({
  name: 'ArchiveEntry',
  pattern: 'archive/*.md',
  schema: s.object({
    ...common,
    categories: s.array(s.string()).default([]),
    html: s.markdown({ copyLinkedFiles: false, removeComments: true }),
  }),
})

const pages = defineCollection({
  name: 'PageEntry',
  pattern: 'pages/*.mdx',
  schema: s.object({ title: s.string(), updatedRaw: s.string(), path: s.path(), code: s.mdx() }),
})

export default defineConfig({
  root: 'content',
  output: { data: '.velite', assets: 'public/static', base: '/static/', name: '[name]-[hash:6].[ext]', clean: true },
  collections: { writing, archive, pages },
  mdx: { rehypePlugins: [[rehypePrettyCode, { theme: 'tokyo-night', keepBackground: false }]] },
})
```

Frontmatter keys: authors write `date:` and `updated:`. Velite maps them to `dateRaw` and `updatedRaw` through a `prepare` hook, so the archive files stay untouched:
```ts
// add to defineConfig:
prepare: () => {},
```
If Velite does not rename keys, use a `.transform` on each schema instead: rename the schema fields to `date: s.string().regex(...)` and `updated: s.string().regex(...).optional()`, then map `date` to `dateRaw` in `posts.ts`. **Use this simpler form.** Keep the schema field names `date` and `updated` (raw strings, *not* `s.isodate()`) and drop the `prepare` hook.

Archive dates are YAML timestamps (`2007-02-06T00:00:00-08:00`), which YAML parses into a JS `Date` before Zod sees them. Accept both forms with `s.union([s.string(), s.date()])` and normalize in `posts.ts`. For a `Date`, recover the calendar date from its ISO string with the known `-08:00` offset: use `new Date(d.getTime() - 8 * 3600_000).toISOString()`. **Simpler and exact:** quote the dates in the 20 archive files so YAML keeps them as strings:

```bash
sed -i '' -E 's/^date: ([0-9T:+-]+)$/date: "\1"/' content/archive/*.md
```

- [ ] **Step 2: Write the failing tests**

`src/lib/posts.test.ts`:
```ts
import { selectPosts, homeDispatches, assertUniqueSlugs, includeDrafts, slugFromPath, type Post } from './posts'

const p = (slug: string, dateRaw: string, kind: Post['kind'] = 'essay', draft = false): Post => ({
  slug, url: `/writing/${slug}`, title: slug, dateRaw, date: { y: Number(dateRaw.slice(0, 4)), m: 1, d: 1 },
  kind, draft, summary: '', tags: [], format: kind === 'archive' ? 'html' : 'mdx', body: '',
})

it('derives slugs from paths', () => {
  expect(slugFromPath('archive/2007-05-17-railsconf-07-day-0')).toBe('railsconf-07-day-0')
  expect(slugFromPath('writing/2026-10-01-agents')).toBe('agents')
})
it('hides drafts only in production', () => {
  expect(includeDrafts('production')).toBe(false)
  expect(includeDrafts('preview')).toBe(true)
  expect(includeDrafts(undefined)).toBe(true)
  const all = [p('a', '2026-01-01', 'essay', true), p('b', '2026-02-01')]
  expect(selectPosts(all, 'production').map(x => x.slug)).toEqual(['b'])
  expect(selectPosts(all, 'preview').map(x => x.slug)).toEqual(['b', 'a'])
})
it('fills the home dispatches with new writing first, then archive', () => {
  const posts = selectPosts([p('old1', '2007-05-17', 'archive'), p('old2', '2007-08-01', 'archive'), p('new', '2026-10-01')], 'production')
  expect(homeDispatches(posts).map(x => x.slug)).toEqual(['new', 'old2', 'old1'])
  expect(homeDispatches(selectPosts([p('n1', '2026-01-01'), p('n2', '2026-02-01'), p('n3', '2026-03-01'), p('n4', '2026-04-01')])).map(x => x.slug)).toEqual(['n4', 'n3', 'n2'])
})
it('rejects duplicate slugs across collections', () => {
  expect(() => assertUniqueSlugs([p('x', '2007-01-01', 'archive'), p('x', '2026-01-01')])).toThrow(/x/)
})
```

`src/lib/archive-content.test.ts` (runs against the real Velite output; `pretest` builds it):
```ts
import { archive } from '#site/content'
import { getPosts } from './posts'

it('migrates all 20 archive posts', () => {
  expect(archive).toHaveLength(20)
})
it('keeps raw HTML markup intact', () => {
  const first = archive.find(a => a.path.endsWith('one-of-these-days'))!
  expect(first.html).toContain('<strong>One of these days</strong>')
  expect(first.html).toContain('title="Joel on Software"')
})
it('keeps the calendar date regardless of timezone', () => {
  const first = getPosts().find(p => p.slug === 'one-of-these-days')!
  expect(first.date).toEqual({ y: 2007, m: 2, d: 6 })
})
```

- [ ] **Step 3: Run the tests and watch them fail**

Run: `pnpm velite && pnpm vitest run src/lib/posts.test.ts src/lib/archive-content.test.ts`. Expected: FAIL (`./posts` missing).

- [ ] **Step 4: Implement `posts.ts` and the `now` page**

`src/lib/posts.ts`:
```ts
import { writing, archive } from '#site/content'
import { calendarDate, type CalendarDate } from './dates'

export type PostKind = 'essay' | 'build-log' | 'field-notes' | 'archive'
export interface Post {
  slug: string; url: string; title: string; dateRaw: string; date: CalendarDate; updated?: CalendarDate
  kind: PostKind; draft: boolean; summary: string; tags: string[]; format: 'mdx' | 'html'; body: string
}
export const KIND_LABEL: Record<PostKind, string> = { essay: 'ESSAY', 'build-log': 'BUILD LOG', 'field-notes': 'FIELD NOTES', archive: 'ARCHIVE' }

export const slugFromPath = (path: string) => path.split('/').pop()!.replace(/^\d{4}-\d{2}-\d{2}-/, '')
export const includeDrafts = (env: string | undefined = process.env.VERCEL_ENV) => env !== 'production'
const plain = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
const clip = (s: string, n = 160) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…')

export function selectPosts(all: Post[], env?: string): Post[] {
  const allow = includeDrafts(env)
  return all.filter(p => allow || !p.draft).sort((a, b) => b.dateRaw.localeCompare(a.dateRaw))
}
export function homeDispatches(posts: Post[], n = 3): Post[] {
  const fresh = posts.filter(p => p.kind !== 'archive')
  const old = posts.filter(p => p.kind === 'archive')
  return [...fresh, ...old].slice(0, n)
}
export function assertUniqueSlugs(posts: Post[]): void {
  const seen = new Set<string>()
  for (const p of posts) {
    if (seen.has(p.slug)) throw new Error(`Duplicate post slug: ${p.slug}`)
    seen.add(p.slug)
  }
}

function fromVelite(): Post[] {
  const w: Post[] = writing.map(e => {
    const slug = slugFromPath(e.path)
    return {
      slug, url: `/writing/${slug}`, title: e.title, dateRaw: e.date, date: calendarDate(e.date),
      updated: e.updated ? calendarDate(e.updated) : undefined, kind: e.kind, draft: e.draft,
      summary: e.summary ?? clip(plain(e.excerpt)), tags: e.tags, format: 'mdx', body: e.code,
    }
  })
  const a: Post[] = archive.map(e => {
    const slug = slugFromPath(e.path)
    return {
      slug, url: `/writing/${slug}`, title: e.title, dateRaw: e.date, date: calendarDate(e.date),
      kind: 'archive', draft: false, summary: clip(plain(e.excerpt)), tags: e.categories, format: 'html', body: e.html,
    }
  })
  const all = [...w, ...a]
  assertUniqueSlugs(all)
  return all
}

export const getPosts = (): Post[] => selectPosts(fromVelite())
export const getPost = (slug: string) => getPosts().find(p => p.slug === slug)
export function adjacentPosts(slug: string): { newer?: Post; older?: Post } {
  const list = getPosts()
  const i = list.findIndex(p => p.slug === slug)
  return i < 0 ? {} : { newer: list[i - 1], older: list[i + 1] }
}
```

Use the Velite schema field names `date` and `updated` (raw strings) as decided in Step 1, not `dateRaw`/`updatedRaw`, and delete the `common.dateRaw` line accordingly.

`content/pages/now.mdx`:
```mdx
---
title: Now
updated: "2026-09-26"
---

Rebuilding this site, which I've had since 2005. It now runs on Next.js and looks like the future we were promised in 1955.

At work I'm CTO of [Deep Fathom](https://www.deepfathom.ai). Nights and weekends go to [Rival Bear](https://rivalbear.com): Yonder, Twiggybank and Balance Point.

When I'm not at a keyboard I'm flying FPV over the Sierra, turning map data into 3D worlds, or out with a camera.
```

- [ ] **Step 5: Verify raw HTML survives**

Run: `pnpm velite && pnpm vitest run src/lib`. Expected: PASS.

If the raw-HTML assertion fails (Velite escaped or dropped the HTML), change the archive schema to `html: s.markdown({ copyLinkedFiles: false, removeComments: true, rehypePlugins: [rehypeRaw] })` with `pnpm add rehype-raw` and `import rehypeRaw from 'rehype-raw'`, then rerun.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "Add Velite content pipeline, archive migration and post queries

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Legacy redirects

**Files:**
- Create: `src/lib/redirects.ts`, `src/lib/redirects.test.ts`
- Modify: `next.config.ts`, and spec §4 (the redirect paragraph)

**Interfaces:**
- Produces: `interface Redirect { source: string; destination: string; permanent: true }`, `legacyRedirects(archiveFilenames: string[]): Redirect[]`, `STATIC_REDIRECTS: Redirect[]`. The module is dependency-free, because `next.config.ts` imports it.

- [ ] **Step 1: Write the failing test**

`src/lib/redirects.test.ts`:
```ts
import { readdirSync } from 'node:fs'
import { legacyRedirects, STATIC_REDIRECTS } from './redirects'

const files = readdirSync('content/archive').filter(f => f.endsWith('.md'))

it('maps every archive post, with and without .html', () => {
  const r = legacyRedirects(files)
  expect(r).toHaveLength(files.length * 2)
  expect(r).toContainEqual({ source: '/2007/05/17/railsconf-07-day-0.html', destination: '/writing/railsconf-07-day-0', permanent: true })
  expect(r).toContainEqual({ source: '/2007/05/17/railsconf-07-day-0', destination: '/writing/railsconf-07-day-0', permanent: true })
})
it('covers old index, tag and feed URLs', () => {
  const src = STATIC_REDIRECTS.map(r => r.source)
  for (const s of ['/page2', '/page3', '/page4', '/tags', '/tags/:tag*', '/atom.xml', '/index.html']) expect(src).toContain(s)
})
it('ignores non-dated filenames', () => {
  expect(legacyRedirects(['README.md'])).toEqual([])
})
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `pnpm vitest run src/lib/redirects.test.ts`. Expected: FAIL.

- [ ] **Step 3: Implement and wire it up**

`src/lib/redirects.ts`:
```ts
export interface Redirect { source: string; destination: string; permanent: true }

export function legacyRedirects(archiveFilenames: string[]): Redirect[] {
  return archiveFilenames.flatMap(f => {
    const m = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/.exec(f)
    if (!m) return []
    const [, y, mo, d, slug] = m
    const destination = `/writing/${slug}`
    return [
      { source: `/${y}/${mo}/${d}/${slug}.html`, destination, permanent: true as const },
      { source: `/${y}/${mo}/${d}/${slug}`, destination, permanent: true as const },
    ]
  })
}

export const STATIC_REDIRECTS: Redirect[] = [
  ...['/page2', '/page3', '/page4', '/tags', '/tags/:tag*'].map(source => ({ source, destination: '/writing', permanent: true as const })),
  { source: '/atom.xml', destination: '/feed.xml', permanent: true },
  { source: '/index.html', destination: '/', permanent: true },
]
```

`next.config.ts`:
```ts
import type { NextConfig } from 'next'
import { readdirSync } from 'node:fs'
import { legacyRedirects, STATIC_REDIRECTS } from './src/lib/redirects'

const nextConfig: NextConfig = {
  async redirects() {
    return [...legacyRedirects(readdirSync('content/archive')), ...STATIC_REDIRECTS]
  },
}
export default nextConfig
```

In the spec's §4, replace "defined as path patterns in `src/lib/redirects.ts`" with "generated as explicit pairs from the archive filenames by `legacyRedirects()` in `src/lib/redirects.ts`".

- [ ] **Step 4: Run the test and watch it pass**

Run: `pnpm vitest run src/lib/redirects.test.ts`. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Redirect legacy post, index, tag and feed URLs

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Design tokens, fonts and effects CSS

**Files:**
- Create: `src/styles/effects.css`, `public/fonts/DSEG14Classic-Regular.woff2`, `public/fonts/DSEG-LICENSE.txt`, `src/lib/fonts.ts`
- Modify: `src/app/globals.css`, `src/app/layout.tsx`

**Interfaces:**
- Produces: CSS variables (the Global Constraints tokens), font variables `--font-display`, `--font-body`, `--font-label`, `--font-script`, `--font-seg`, and Tailwind theme colors `ink ink-2 cream muted violet cyan green magenta atomic amber` plus font families `display body label script seg`. Effect classes: `.crt`, `.crt-soft`, `.vignette`, `.twinkle`, `.orbit`, `.orbit-rev`, `.draw`, `.rise`, `.band-slide`, `.blink`. All of them are disabled under reduced motion.

- [ ] **Step 1: Fetch DSEG**

```bash
curl -sL -o /tmp/dseg.zip https://github.com/keshikan/DSEG/releases/download/v0.46/fonts-DSEG_v046.zip
unzip -o -q /tmp/dseg.zip -d /tmp/dseg
cp "$(find /tmp/dseg -name 'DSEG14Classic-Regular.woff2' | head -1)" public/fonts/
cp "$(find /tmp/dseg -iname 'OFL.txt' -o -iname 'LICENSE*' | head -1)" public/fonts/DSEG-LICENSE.txt
```

If the release URL has moved, find the latest release at https://github.com/keshikan/DSEG/releases. The license is OFL 1.1.

- [ ] **Step 2: Write the fonts module and layout**

`src/lib/fonts.ts`:
```ts
import { Michroma, Instrument_Sans, Space_Mono, Yellowtail } from 'next/font/google'
import localFont from 'next/font/local'

export const display = Michroma({ weight: '400', subsets: ['latin'], variable: '--font-display', display: 'swap' })
export const body = Instrument_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
export const label = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-label', display: 'swap' })
export const script = Yellowtail({ weight: '400', subsets: ['latin'], variable: '--font-script', display: 'swap' })
export const seg = localFont({ src: '../../public/fonts/DSEG14Classic-Regular.woff2', variable: '--font-seg', display: 'swap' })
export const fontVars = [display, body, label, script, seg].map(f => f.variable).join(' ')
```

`src/app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { fontVars } from '@/lib/fonts'
import { site } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · Kevin Hunt`, template: `%s · ${site.name}` },
  description: site.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body className="bg-ink text-cream font-body antialiased">{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Write the tokens and effects**

`src/app/globals.css`:
```css
@import 'tailwindcss';
@import '../styles/effects.css';

@theme {
  --color-ink: #0c0b1c;
  --color-ink-2: #12102a;
  --color-cream: #f2ece0;
  --color-muted: #bdb8d6;
  --color-violet: #7b6cff;
  --color-cyan: #3ff0ff;
  --color-green: #8bff6b;
  --color-magenta: #ff4fd8;
  --color-atomic: #ff6b35;
  --color-amber: #ffb000;
  --font-display: var(--font-display), sans-serif;
  --font-body: var(--font-body), system-ui, sans-serif;
  --font-label: var(--font-label), ui-monospace, monospace;
  --font-script: var(--font-script), cursive;
  --font-seg: var(--font-seg), ui-monospace, monospace;
}

:root { color-scheme: dark; }
html { background: #0c0b1c; }
body { min-height: 100dvh; overflow-x: hidden; }
a { color: inherit; text-decoration: none; }
:focus-visible { outline: 2px solid #3ff0ff; outline-offset: 3px; border-radius: 4px; }
::selection { background: #ff4fd8; color: #0c0b1c; }
```

Tailwind v4 `@theme` resolves `--font-display` against itself, so give the next/font variables distinct names: in `fonts.ts` use `--nf-display`, `--nf-body`, `--nf-label`, `--nf-script`, `--nf-seg`, and in `@theme` write `--font-display: var(--nf-display), sans-serif;` (the same for the others). **Apply this naming.**

`src/styles/effects.css`:
```css
@keyframes k-twinkle { 0%,100% { transform: scale(.75) rotate(0); opacity: .6 } 50% { transform: scale(1.1) rotate(45deg); opacity: 1 } }
@keyframes k-spin { to { transform: rotate(360deg) } }
@keyframes k-draw { from { stroke-dashoffset: 4000 } to { stroke-dashoffset: 0 } }
@keyframes k-rise { from { opacity: 0; transform: translateY(26px) } to { opacity: 1; transform: none } }
@keyframes k-flick { 0%,46%,100% { opacity: .85 } 47% { opacity: .6 } 48% { opacity: .9 } }
@keyframes k-blink { 50% { opacity: .35 } }
@keyframes k-band { to { transform: translateY(var(--band-h, 72px)) } }

.crt, .crt-soft { position: absolute; inset: 0; pointer-events: none; z-index: 40;
  background: repeating-linear-gradient(to bottom, rgb(0 0 0 / .28) 0 2px, transparent 2px 4px); animation: k-flick 5s steps(1) infinite; }
.crt-soft { opacity: .45 }
.vignette { position: absolute; inset: 0; pointer-events: none; z-index: 41; box-shadow: inset 0 0 220px 30px rgb(0 0 0 / .75) }
.twinkle { animation: k-twinkle 2.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center }
.orbit { animation: k-spin 9s linear infinite; transform-origin: 50% 50% }
.orbit-rev { animation: k-spin 13s linear infinite reverse; transform-origin: 50% 50% }
.draw { stroke-dasharray: 4000; animation: k-draw 3.2s cubic-bezier(.6,0,.2,1) both }
.rise { animation: k-rise 1.1s cubic-bezier(.2,.8,.2,1) both }
.band-slide { animation: k-band 3s linear infinite }
.blink { animation: k-blink 2s steps(1) infinite }

@media (prefers-reduced-motion: reduce) {
  .crt, .crt-soft, .twinkle, .orbit, .orbit-rev, .draw, .rise, .band-slide, .blink { animation: none !important }
  .draw { stroke-dashoffset: 0 }
  .rise { opacity: 1; transform: none }
}
```

- [ ] **Step 4: Verify**

Run: `pnpm build`. Expected: success, with no font-loading errors.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Add Tomorrowland tokens, fonts and motion effects

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Wordmark

**Files:**
- Create: `scripts/build-wordmark.mjs`, `scripts/fonts/Michroma-Regular.ttf`, `src/components/wordmark-data.ts` (generated), `src/components/wordmark.tsx`, `src/components/wordmark.test.tsx`, `src/lib/wordmark-svg.ts`, `src/lib/wordmark-svg.test.ts`, `src/app/icon.svg` (generated)

**Interfaces:**
- Produces:
  - `WORDMARKS: Record<'kev.in' | 'hi@kev.in' | 'k', { d: string; width: number; height: number }>` from `@/components/wordmark-data`. Units are font units at size 100, and each path is translated to its own origin.
  - `<Wordmark text?: 'kev.in' | 'hi@kev.in' size: number className?: string label?: string animated?: boolean />`
  - `wordmarkSvg(text: 'kev.in' | 'hi@kev.in' | 'k', opts?: { height?: number }): string` returns a static, standalone SVG string (for OG images and the icon)
  - `BAND_COLORS = ['#ff4fd8', '#7b6cff', '#3ff0ff', '#8bff6b']`

- [ ] **Step 1: Get the font and write the generator**

```bash
mkdir -p scripts/fonts
curl -sL -o scripts/fonts/Michroma-Regular.ttf https://github.com/google/fonts/raw/main/ofl/michroma/Michroma-Regular.ttf
file scripts/fonts/Michroma-Regular.ttf   # expect: TrueType Font data
```

`scripts/build-wordmark.mjs`:
```js
import opentype from 'opentype.js'
import { writeFileSync } from 'node:fs'

const font = opentype.loadSync(new URL('./fonts/Michroma-Regular.ttf', import.meta.url).pathname)
const out = {}
for (const text of ['kev.in', 'hi@kev.in', 'k']) {
  const path = font.getPath(text, 0, 100, 100)
  const bb = path.getBoundingBox()
  const shifted = font.getPath(text, -bb.x1, 100 - bb.y1, 100)
  out[text] = { d: shifted.toPathData(2), width: +(bb.x2 - bb.x1).toFixed(2), height: +(bb.y2 - bb.y1).toFixed(2) }
}
writeFileSync(
  new URL('../src/components/wordmark-data.ts', import.meta.url),
  `// Generated by scripts/build-wordmark.mjs from Michroma (OFL). Do not edit.\nexport const WORDMARKS = ${JSON.stringify(out, null, 2)} as const\n`,
)
console.log('wrote wordmark-data.ts', Object.fromEntries(Object.entries(out).map(([k, v]) => [k, [v.width, v.height]])))
```

Run: `pnpm wordmark`. Expected: it prints the widths and heights, and `src/components/wordmark-data.ts` exists.

- [ ] **Step 2: Write the failing tests**

`src/lib/wordmark-svg.test.ts`:
```ts
import { wordmarkSvg, BAND_COLORS } from './wordmark-svg'
it('builds a standalone banded SVG', () => {
  const svg = wordmarkSvg('kev.in', { height: 120 })
  expect(svg.startsWith('<svg')).toBe(true)
  expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
  for (const c of BAND_COLORS) expect(svg).toContain(c)
  expect(svg).toContain('height="120"')
})
```

`src/components/wordmark.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Wordmark } from './wordmark'
it('exposes an accessible name and scales to the requested size', () => {
  render(<Wordmark size={100} />)
  const img = screen.getByRole('img', { name: 'kev.in' })
  expect(img.getAttribute('height')).toBe('100')
})
it('renders two instances without clashing ids', () => {
  const { container } = render(<><Wordmark size={30} /><Wordmark size={60} /></>)
  const ids = [...container.querySelectorAll('[id]')].map(e => e.id)
  expect(new Set(ids).size).toBe(ids.length)
})
```

Run: `pnpm vitest run src/lib/wordmark-svg.test.ts src/components/wordmark.test.tsx`. Expected: FAIL.

- [ ] **Step 3: Implement**

`src/lib/wordmark-svg.ts`:
```ts
import { WORDMARKS } from '@/components/wordmark-data'
export const BAND_COLORS = ['#ff4fd8', '#7b6cff', '#3ff0ff', '#8bff6b'] as const
export type WordmarkText = keyof typeof WORDMARKS

/** Band geometry in path units: one band per 1/4 of BAND_PERIOD; thin gaps every GAP_PERIOD. */
export const BAND_PERIOD = 36
export const GAP_PERIOD = 9
export const GAP = 2.2

export function bandRects(height: number, width: number, extra = BAND_PERIOD): string {
  const rows: string[] = []
  for (let y = -extra; y < height + extra; y += BAND_PERIOD)
    BAND_COLORS.forEach((c, i) => rows.push(`<rect x="0" y="${(y + (i * BAND_PERIOD) / 4).toFixed(2)}" width="${width}" height="${BAND_PERIOD / 4}" fill="${c}"/>`))
  return rows.join('')
}
export function gapRects(height: number, width: number): string {
  const rows: string[] = []
  for (let y = GAP_PERIOD - GAP; y < height; y += GAP_PERIOD) rows.push(`<rect x="0" y="${y.toFixed(2)}" width="${width}" height="${GAP}" fill="#000"/>`)
  return rows.join('')
}

export function wordmarkSvg(text: WordmarkText, opts: { height?: number } = {}): string {
  const { d, width, height } = WORDMARKS[text]
  const h = opts.height ?? height
  const w = +((width / height) * h).toFixed(2)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${w}" height="${h}"><defs><clipPath id="c"><path d="${d}"/></clipPath><mask id="m"><rect width="${width}" height="${height}" fill="#fff"/>${gapRects(height, width)}</mask></defs><g clip-path="url(#c)" mask="url(#m)">${bandRects(height, width)}</g></svg>`
}
```

`src/components/wordmark.tsx`:
```tsx
import { useId } from 'react'
import { WORDMARKS } from './wordmark-data'
import { BAND_COLORS, BAND_PERIOD, GAP, GAP_PERIOD, type WordmarkText } from '@/lib/wordmark-svg'

export function Wordmark({ text = 'kev.in', size, className, label, animated = true }: {
  text?: WordmarkText; size: number; className?: string; label?: string; animated?: boolean
}) {
  const id = useId().replace(/:/g, '')
  const { d, width, height } = WORDMARKS[text]
  const w = (width / height) * size
  const bands: React.ReactNode[] = []
  for (let y = -BAND_PERIOD; y < height + BAND_PERIOD; y += BAND_PERIOD)
    BAND_COLORS.forEach((c, i) => bands.push(<rect key={`${y}-${i}`} x={0} y={y + (i * BAND_PERIOD) / 4} width={width} height={BAND_PERIOD / 4} fill={c} />))
  const gaps: React.ReactNode[] = []
  for (let y = GAP_PERIOD - GAP; y < height; y += GAP_PERIOD) gaps.push(<rect key={y} x={0} y={y} width={width} height={GAP} fill="#000" />)
  return (
    <svg role="img" aria-label={label ?? text} viewBox={`0 0 ${width} ${height}`} width={w} height={size} className={className}>
      <defs>
        <clipPath id={`c${id}`}><path d={d} /></clipPath>
        <mask id={`m${id}`}><rect width={width} height={height} fill="#fff" />{gaps}</mask>
      </defs>
      <g clipPath={`url(#c${id})`} mask={`url(#m${id})`}>
        <g className={animated ? 'band-slide' : undefined} style={{ ['--band-h' as string]: `${BAND_PERIOD}px` }}>{bands}</g>
      </g>
    </svg>
  )
}
```

`--band-h` is in viewBox units because transforms inside an SVG use user units. `translateY(36px)` inside the SVG `<g>` moves by 36 user units, which is exactly one period, so the loop is seamless.

Generate the icon: add to `scripts/build-wordmark.mjs` after writing the data a line that writes `src/app/icon.svg` from the `k` glyph:
```js
const k = out['k']
writeFileSync(new URL('../src/app/icon.svg', import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 ${k.width + 24} ${k.width + 24}"><rect x="-12" y="-12" width="${k.width + 24}" height="${k.width + 24}" rx="18" fill="#0c0b1c"/><clipPath id="c"><path transform="translate(0 ${(k.width - k.height) / 2})" d="${k.d}"/></clipPath><g clip-path="url(#c)">${[0,1,2,3].map(i => `<rect x="0" y="${(k.width / 4) * i}" width="${k.width}" height="${k.width / 4}" fill="${['#ff4fd8','#7b6cff','#3ff0ff','#8bff6b'][i]}"/>`).join('')}</g></svg>`)
```

Run `pnpm wordmark` again.

- [ ] **Step 4: Run the tests and watch them pass**

Run: `pnpm vitest run src/lib/wordmark-svg.test.ts src/components/wordmark.test.tsx`. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Add banded SVG wordmark generated from Michroma outlines

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Googie ornaments, CRT and stripes

**Files:**
- Create: `src/components/ornaments.tsx`, `src/components/ornaments.test.tsx`, `src/components/crt.tsx`, `src/components/stripes.tsx`

**Interfaces:**
- Produces:
  - `<Sparkle size color className? style? delay? />` and `<Starburst size color className? style? delay? />`: decorative (`aria-hidden`)
  - `<Atom size className? />`: three orbits (cyan, magenta, green) around an atomic nucleus
  - `<Crt intensity: 'full' | 'soft' />`: renders `.crt` or `.crt-soft` plus `.vignette` (`full` only)
  - `<Stripes variant: 'hero-bend' | 'straight' className? />`: four parallel bands. `hero-bend` runs across and bends down (desktop). `straight` runs horizontal only (mobile).

- [ ] **Step 1: Write the failing test**

`src/components/ornaments.test.tsx`:
```tsx
import { render } from '@testing-library/react'
import { Sparkle, Starburst, Atom } from './ornaments'
it('keeps decoration out of the accessibility tree', () => {
  const { container } = render(<><Sparkle size={20} color="#3ff0ff" /><Starburst size={40} color="#ff6b35" /><Atom size={200} /></>)
  const svgs = container.querySelectorAll('svg')
  expect(svgs.length).toBeGreaterThanOrEqual(3)
  svgs.forEach(s => expect(s.closest('[aria-hidden="true"]')).not.toBeNull())
})
it('draws a 16-ray starburst', () => {
  const { container } = render(<Starburst size={40} color="#ff6b35" />)
  expect(container.querySelectorAll('line')).toHaveLength(16)
})
```

Run: `pnpm vitest run src/components/ornaments.test.tsx`. Expected: FAIL.

- [ ] **Step 2: Implement**

`src/components/ornaments.tsx`:
```tsx
import type { CSSProperties } from 'react'

type Orn = { size: number; color: string; className?: string; style?: CSSProperties; delay?: number }
const glow = (c: string) => ({ filter: `drop-shadow(0 0 8px ${c})` })

export function Sparkle({ size, color, className, style, delay = 0 }: Orn) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 100 100" className={`twinkle ${className ?? ''}`} style={{ ...glow(color), animationDelay: `-${delay}s`, ...style }}>
      <path d="M50 0 L57 43 L100 50 L57 57 L50 100 L43 57 L0 50 L43 43 Z" fill={color} />
    </svg>
  )
}

export function Starburst({ size, color, className, style, delay = 0 }: Orn) {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8
    return <line key={i} x1={50} y1={50} x2={+(50 + 48 * Math.cos(a)).toFixed(1)} y2={+(50 + 48 * Math.sin(a)).toFixed(1)} stroke={color} strokeWidth={i % 2 ? 1.5 : 3} strokeLinecap="round" />
  })
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 100 100" className={`twinkle ${className ?? ''}`} style={{ ...glow(color), animationDelay: `-${delay}s`, ...style }}>
      {rays}<circle cx={50} cy={50} r={6} fill={color} />
    </svg>
  )
}

export function Atom({ size, className }: { size: number; className?: string }) {
  const orbit = (color: string, rot: number, cls: string, dur?: string) => (
    <svg width={size} height={size} viewBox="0 0 340 340" className={cls} style={{ position: 'absolute', inset: 0, animationDuration: dur }}>
      <ellipse cx={170} cy={170} rx={160} ry={52} fill="none" stroke={color} strokeWidth={2.5} transform={`rotate(${rot} 170 170)`} style={glow(color)} />
      {rot === 0 && <circle cx={330} cy={170} r={9} fill={color} />}
    </svg>
  )
  return (
    <div aria-hidden="true" className={className} style={{ position: 'relative', width: size, height: size }}>
      {orbit('#3ff0ff', 0, 'orbit')}
      {orbit('#ff4fd8', 60, 'orbit-rev')}
      {orbit('#8bff6b', -60, 'orbit', '17s')}
      <div style={{ position: 'absolute', left: '44%', top: '44%', width: '12%', height: '12%', borderRadius: '50%', background: '#ff6b35', boxShadow: '0 0 40px #ff6b35' }} />
    </div>
  )
}
```

`src/components/crt.tsx`:
```tsx
export function Crt({ intensity }: { intensity: 'full' | 'soft' }) {
  return <div aria-hidden="true">{intensity === 'full' ? <><div className="crt" /><div className="vignette" /></> : <div className="crt-soft" />}</div>
}
```

`src/components/stripes.tsx`:
```tsx
const COLORS = ['#ff4fd8', '#7b6cff', '#3ff0ff', '#8bff6b']

/** hero-bend: in a 1440×300 box, runs left→right then bends down at the right edge. */
export function Stripes({ variant, className }: { variant: 'hero-bend' | 'straight'; className?: string }) {
  if (variant === 'straight')
    return (
      <svg aria-hidden="true" viewBox="0 0 400 80" preserveAspectRatio="none" className={className} width="100%" height={80}>
        {COLORS.map((c, i) => <line key={c} className="draw" x1={-10} x2={410} y1={10 + i * 20} y2={10 + i * 20} stroke={c} strokeWidth={10} strokeLinecap="round" style={{ animationDelay: `${i * 0.12}s` }} />)}
      </svg>
    )
  return (
    <svg aria-hidden="true" viewBox="0 0 1440 300" className={className} width="100%" height="auto" fill="none">
      {COLORS.map((c, i) => {
        const r = 110 - i * 20
        return <path key={c} className="draw" d={`M-20 ${10 + i * 20} H1250 a${r} ${r} 0 0 1 ${r} ${r} V300`} stroke={c} strokeWidth={12} strokeLinecap="round" style={{ animationDelay: `${i * 0.12}s` }} />
      })}
    </svg>
  )
}
```

- [ ] **Step 3: Run the tests and watch them pass**

Run: `pnpm vitest run src/components/ornaments.test.tsx`. Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Add Googie ornaments, CRT overlay and racing stripes

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: TimeStamp readouts

**Files:**
- Create: `src/components/timestamp.tsx`, `src/components/timestamp-live.tsx`, `src/components/timestamp.test.tsx`

**Interfaces:**
- Consumes: `CalendarDate`, `formatStamp`, `formatLong`, `todayLocal` from `@/lib/dates`; `elapsed`, `formatElapsed`, `describeElapsed` from `@/lib/elapsed`.
- Produces:
  - `<Readout label: string text: string tone: 'magenta' | 'green' | 'amber' | 'cyan' ghostFor?: string />`: server-safe. It renders the ghost and lit text in DSEG (spaces become `!`, and ghost characters are `~`).
  - `<TimeStamp written: CalendarDate updated?: CalendarDate draft?: boolean compact?: boolean />`: server component, composing WRITTEN, UPDATED?, NOW (live), ELAPSED (live) and STATUS (draft).
  - `<LiveNow />` and `<LiveElapsed from: CalendarDate />` (`'use client'` in `timestamp-live.tsx`)
  - `toSeg(text: string): string` and `ghostOf(text: string): string`

- [ ] **Step 1: Write the failing tests**

`src/components/timestamp.test.tsx`:
```tsx
import { render, screen, act } from '@testing-library/react'
import { TimeStamp, toSeg, ghostOf } from './timestamp'

it('maps text to DSEG glyph strings of equal width', () => {
  expect(toSeg('MAY 17 2007')).toBe('MAY!17!2007')
  expect(ghostOf('MAY 17 2007')).toBe('~~~!~~!~~~~')
})

it('renders WRITTEN and an accessible sentence', () => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 8, 26, 12))
  render(<TimeStamp written={{ y: 2007, m: 5, d: 17 }} />)
  expect(screen.getByText('Written May 17, 2007 — 19 years ago.', { exact: false })).toBeInTheDocument()
  vi.useRealTimers()
})

it('fills NOW and ELAPSED on the client', async () => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 8, 26, 12))
  render(<TimeStamp written={{ y: 2007, m: 5, d: 17 }} />)
  await act(async () => {})
  expect(document.body.textContent).toContain('SEP!26!2026')
  expect(document.body.textContent).toContain('19!YRS')
  vi.useRealTimers()
})

it('shows DRAFT status for drafts', () => {
  render(<TimeStamp written={{ y: 2026, m: 10, d: 1 }} draft />)
  expect(document.body.textContent).toContain('DRAFT')
})
```

The accessible sentence needs "19 years ago", which depends on today. Render it inside `<LiveElapsed>` as visually hidden text that fills in on mount; before that, fall back to "Written May 17, 2007." The first test asserts after mount, so wrap it in `await act(async () => {})` as in the second test. **Update the first test to include `await act(async () => {})` before the assertion.**

Run: `pnpm vitest run src/components/timestamp.test.tsx`. Expected: FAIL.

- [ ] **Step 2: Implement**

`src/components/timestamp.tsx`:
```tsx
import { formatLong, formatStamp, type CalendarDate } from '@/lib/dates'
import { LiveElapsed, LiveNow } from './timestamp-live'

export const toSeg = (t: string) => t.replace(/ /g, '!')
export const ghostOf = (t: string) => t.replace(/[^ ]/g, '~').replace(/ /g, '!')

const TONE = { magenta: '#ff4fd8', green: '#8bff6b', amber: '#ffb000', cyan: '#3ff0ff' } as const
export type Tone = keyof typeof TONE

export function Readout({ label, text, tone, ghostFor }: { label: string; text: string; tone: Tone; ghostFor?: string }) {
  return (
    <div className="flex items-center gap-2.5" aria-hidden="true">
      <span className="min-w-[74px] border border-[#3a3848] bg-[#16151c] px-1.5 py-0.5 text-center font-label text-[10px] tracking-[.14em] text-[#e9e6f2]">{label}</span>
      <span className="relative border border-[#2a2833] bg-[#08070b] px-2.5 py-1 font-seg text-[18px] leading-none" style={{ color: TONE[tone], textShadow: `0 0 10px ${TONE[tone]}` }}>
        <span className="absolute left-2.5 top-1 opacity-[.13] [text-shadow:none]">{ghostOf(ghostFor ?? text)}</span>
        <span className="relative">{text ? toSeg(text) : ''}</span>
      </span>
    </div>
  )
}

export function TimeStamp({ written, updated, draft, compact }: { written: CalendarDate; updated?: CalendarDate; draft?: boolean; compact?: boolean }) {
  return (
    <div className={`flex flex-col gap-2 ${compact ? 'scale-90 origin-left' : ''}`}>
      {draft ? <Readout label="STATUS" text="DRAFT" tone="magenta" /> : <Readout label="WRITTEN" text={formatStamp(written)} tone="magenta" />}
      {updated && <Readout label="UPDATED" text={formatStamp(updated)} tone="cyan" />}
      <LiveNow />
      {!draft && <LiveElapsed from={written} />}
      <span className="sr-only">
        <LiveElapsed from={written} sentence prefix={`Written ${formatLong(written)}`} />
      </span>
    </div>
  )
}
```

`src/components/timestamp-live.tsx`:
```tsx
'use client'
import { useEffect, useState } from 'react'
import { formatStamp, todayLocal, type CalendarDate } from '@/lib/dates'
import { describeElapsed, elapsed, formatElapsed } from '@/lib/elapsed'
import { Readout } from './timestamp'

function useToday() {
  const [today, setToday] = useState<CalendarDate | null>(null)
  useEffect(() => setToday(todayLocal()), [])
  return today
}

export function LiveNow() {
  const today = useToday()
  return <Readout label="NOW" text={today ? formatStamp(today) : ''} ghostFor="MMM DD YYYY" tone="green" />
}

export function LiveElapsed({ from, sentence, prefix }: { from: CalendarDate; sentence?: boolean; prefix?: string }) {
  const today = useToday()
  const e = today ? elapsed(from, today) : null
  if (sentence) return <>{prefix}{e ? ` — ${describeElapsed(e)}.` : '.'}</>
  return <Readout label="ELAPSED" text={e ? formatElapsed(e) : ''} ghostFor="00 YRS" tone="amber" />
}
```

`timestamp.tsx` imports from `timestamp-live.tsx`, which imports `Readout` back: that's a circular import. Move `Readout`, `toSeg`, `ghostOf` and `TONE` into `src/components/readout.tsx` (a server-safe module with no directive). Import them from there in both files, and re-export `toSeg`/`ghostOf` from `timestamp.tsx` for the tests. **Apply this split.**

- [ ] **Step 3: Run the tests and watch them pass**

Run: `pnpm vitest run src/components/timestamp.test.tsx`. Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Add then/now segmented timestamp readouts

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Site chrome, cards and project data

**Files:**
- Create: `src/data/projects.ts`, `src/components/site-nav.tsx`, `src/components/site-footer.tsx`, `src/components/googie-card.tsx`, `src/components/project-card.tsx`, `src/components/chrome.test.tsx`
- Modify: `src/app/layout.tsx` (render `SiteNav` and `SiteFooter`, plus the Vercel `Analytics` and `SpeedInsights`)

**Interfaces:**
- Consumes: `Wordmark`, `Starburst`, `TimeStamp`, `Post`, `KIND_LABEL`, `site`.
- Produces:
  - `interface Project { slug: string; name: string; role: string; blurb: string; href: string; accent: '#3ff0ff' | '#ff4fd8' | '#8bff6b' | '#7b6cff'; children?: { name: string; href: string; blurb: string }[] }` and `PROJECTS: Project[]`
  - `<SiteNav />`, `<SiteFooter />`
  - `<GoogieCard post: Post accent: string />`: an `<a>` to `post.url`
  - `<ProjectCard project: Project />`

- [ ] **Step 1: Write the failing test**

`src/components/chrome.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { SiteNav } from './site-nav'
import { SiteFooter } from './site-footer'
import { PROJECTS } from '@/data/projects'

it('nav links to every section and to email', () => {
  render(<SiteNav />)
  for (const [name, href] of [['Writing', '/writing'], ['Side', '/side'], ['Sights', '/sights'], ['Now', '/now']])
    expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
  expect(screen.getByRole('link', { name: /hi@kev\.in/ })).toHaveAttribute('href', 'mailto:hi@kev.in')
  expect(screen.getByRole('link', { name: 'kev.in home' })).toHaveAttribute('href', '/')
})
it('footer offers email', () => {
  render(<SiteFooter />)
  expect(screen.getByRole('link', { name: /hi@kev\.in/ })).toHaveAttribute('href', 'mailto:hi@kev.in')
})
it('lists the four headline projects with real links', () => {
  expect(PROJECTS.map(p => p.slug)).toEqual(['deep-fathom', 'rival-bear', 'fpv', 'terrain'])
  PROJECTS.forEach(p => expect(p.href).toMatch(/^(https:\/\/|\/)/))
})
```

Run: `pnpm vitest run src/components/chrome.test.tsx`. Expected: FAIL.

- [ ] **Step 2: Implement**

`src/data/projects.ts`:
```ts
export interface Project {
  slug: string; name: string; role: string; blurb: string; href: string
  accent: '#3ff0ff' | '#ff4fd8' | '#8bff6b' | '#7b6cff'
  children?: { name: string; href: string; blurb: string }[]
}
export const PROJECTS: Project[] = [
  { slug: 'deep-fathom', name: 'Deep Fathom', role: 'Co-founder & CTO', accent: '#3ff0ff', href: 'https://www.deepfathom.ai',
    blurb: 'An AI-native compliance platform for the U.S. Defense Industrial Base.' },
  { slug: 'rival-bear', name: 'Rival Bear', role: 'Founder', accent: '#ff4fd8', href: 'https://rivalbear.com',
    blurb: 'My indie studio in the Sierra Nevada.',
    children: [
      { name: 'Yonder', href: 'https://www.getyonder.app', blurb: 'A GPS tour guide for the road.' },
      { name: 'Twiggybank', href: 'https://www.twiggybank.com', blurb: 'A family bank that grows like a garden.' },
      { name: 'Balance Point', href: 'https://rivalbear.com', blurb: 'The long view of your weight. In development.' },
    ] },
  { slug: 'fpv', name: 'FPV & flight', role: 'Pilot & builder', accent: '#8bff6b', href: '/writing?kind=field-notes',
    blurb: 'Quads, sims, and an 18 kg octocopter.' },
  { slug: 'terrain', name: 'Maps & terrain', role: 'Tinkerer', accent: '#7b6cff', href: '/writing?kind=build-log',
    blurb: 'OpenStreetMap to 3D, GIS and Unreal scenes.' },
]
```

`src/components/site-nav.tsx`:
```tsx
import Link from 'next/link'
import { Wordmark } from './wordmark'
import { site } from '@/lib/site'

const LINKS = [['Writing', '/writing', '#3ff0ff'], ['Side', '/side', '#ff4fd8'], ['Sights', '/sights', '#8bff6b'], ['Now', '/now', '']] as const

export function SiteNav() {
  return (
    <header className="relative z-50 mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 pt-6 md:px-16 md:pt-8">
      <Link href="/" aria-label="kev.in home"><Wordmark size={24} label="kev.in" /></Link>
      <nav aria-label="Primary" className="hidden items-center gap-6 font-label text-sm tracking-[.14em] text-[#cfc9e6] md:flex">
        {LINKS.map(([name, href, star]) => (
          <span key={href} className="flex items-center gap-6">
            <Link href={href} className="uppercase hover:text-cyan">{name}</Link>
            {star && <span aria-hidden="true" style={{ color: star }}>✦</span>}
          </span>
        ))}
      </nav>
      <a href={`mailto:${site.email}`} className="rounded-full bg-cream px-4 py-2.5 font-label text-sm font-bold text-ink transition-transform hover:scale-105">{site.email}</a>
      <nav aria-label="Primary mobile" className="order-last flex w-full justify-between font-label text-xs tracking-[.14em] text-[#cfc9e6] md:hidden">
        {LINKS.map(([name, href]) => <Link key={href} href={href} className="uppercase">{name}</Link>)}
      </nav>
    </header>
  )
}
```

The test uses `getByRole('link', { name: 'Writing' })`, and there are two navs (desktop and mobile), so the query would find two. Render the mobile links with `aria-hidden`? No: that's inaccessible. Instead, render **one** `<nav>` whose list reflows with `flex-wrap`. Replace the two navs with one:

```tsx
      <nav aria-label="Primary" className="order-last flex w-full flex-wrap justify-between gap-x-6 font-label text-xs tracking-[.14em] text-[#cfc9e6] md:order-none md:w-auto md:items-center md:text-sm">
        {LINKS.map(([name, href, star]) => (
          <span key={href} className="flex items-center gap-6">
            <Link href={href} className="uppercase hover:text-cyan">{name}</Link>
            {star && <span aria-hidden="true" className="hidden md:inline" style={{ color: star }}>✦</span>}
          </span>
        ))}
      </nav>
```

and add `flex-wrap` to the `<header>`. **Use this single-nav version.**

`src/components/site-footer.tsx`:
```tsx
import { Wordmark } from './wordmark'
import { site } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="relative mx-auto flex max-w-[1440px] flex-col gap-6 px-5 pb-12 pt-24 md:flex-row md:items-end md:justify-between md:px-16">
      <div>
        <p className="origin-left -rotate-[5deg] font-script text-4xl text-atomic md:text-5xl">See you in the future</p>
        <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`} className="mt-2 block max-w-full">
          <Wordmark text="hi@kev.in" size={72} label="hi@kev.in" className="h-auto max-w-full" />
        </a>
      </div>
      <p className="font-label text-xs leading-7 tracking-[.16em] text-[#9d97b8] md:text-right">SIERRA NEVADA, CA<br />ON THE AIR SINCE 2005</p>
    </footer>
  )
}
```

`src/components/googie-card.tsx`:
```tsx
import Link from 'next/link'
import type { Post } from '@/lib/posts'
import { KIND_LABEL } from '@/lib/posts'
import { TimeStamp } from './timestamp'

export function GoogieCard({ post, accent }: { post: Post; accent: string }) {
  return (
    <Link href={post.url} className="group flex flex-col justify-between gap-6 rounded-[64px_14px_64px_14px] border border-cream/12 bg-cream/[.04] p-7 transition-transform duration-300 [transition-timing-function:cubic-bezier(.3,1.5,.4,1)] hover:-translate-y-1.5 md:flex-row md:items-center md:px-11 md:py-8" style={{ borderTop: `3px solid ${accent}` }}>
      <div className="max-w-[720px]">
        <p className="font-label text-xs tracking-[.2em]" style={{ color: accent }}>{KIND_LABEL[post.kind]}{post.tags[0] ? ` · ${post.tags[0].toUpperCase()}` : ''}</p>
        <h3 className="mt-3 font-display text-2xl leading-snug text-cream group-hover:text-cyan md:text-3xl">{post.title}</h3>
      </div>
      <TimeStamp written={post.date} updated={post.updated} draft={post.draft} />
    </Link>
  )
}
```

`src/components/project-card.tsx`:
```tsx
import { Starburst } from './ornaments'
import type { Project } from '@/data/projects'

export function ProjectCard({ project }: { project: Project }) {
  const external = project.href.startsWith('http')
  return (
    <a href={project.href} {...(external ? { target: '_blank', rel: 'noopener' } : {})} className="relative block rounded-[18px_18px_60px_18px] border border-cream/10 bg-ink-2 px-7 pb-7 pt-11 transition-transform duration-300 hover:-translate-y-1.5">
      <span aria-hidden="true" className="absolute -top-4 left-[-10px] right-[40%] h-7 -skew-x-[28deg] rounded-md" style={{ background: project.accent, boxShadow: `0 0 22px ${project.accent}` }} />
      <Starburst size={56} color={project.accent} className="absolute -top-8 right-4" />
      <p className="font-label text-[11px] tracking-[.18em]" style={{ color: project.accent }}>{project.role.toUpperCase()}</p>
      <h3 className="mt-2 font-display text-xl text-cream md:text-2xl">{project.name}</h3>
      <p className="mt-3 text-[17px] leading-relaxed text-muted">{project.blurb}</p>
    </a>
  )
}
```

Update `src/app/layout.tsx`'s body:
```tsx
      <body className="bg-ink text-cream font-body antialiased">
        <SiteNav />
        {children}
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
```
with `import { Analytics } from '@vercel/analytics/next'` and `import { SpeedInsights } from '@vercel/speed-insights/next'`.

- [ ] **Step 3: Run the tests and watch them pass**

Run: `pnpm vitest run src/components/chrome.test.tsx`. Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Add site chrome, Googie post cards and project cards

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Home page

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/home-hero.tsx`

**Interfaces:**
- Consumes: `getPosts`, `homeDispatches`, `PROJECTS`, `Wordmark`, `Atom`, `Sparkle`, `Starburst`, `Stripes`, `Crt`, `GoogieCard`, `ProjectCard`.

- [ ] **Step 1: Implement the hero**

`src/components/home-hero.tsx`:
```tsx
import Link from 'next/link'
import { Wordmark } from './wordmark'
import { Atom, Sparkle, Starburst } from './ornaments'

export function HomeHero() {
  return (
    <section className="relative mx-auto max-w-[1440px] px-5 pt-16 md:px-16 md:pt-24">
      <Sparkle size={34} color="#3ff0ff" className="absolute left-[6%] top-[8%]" />
      <Sparkle size={22} color="#8bff6b" className="absolute left-[40%] top-0" delay={0.7} />
      <Sparkle size={40} color="#ff4fd8" className="absolute right-[6%] top-[62%]" delay={1.1} />
      <Starburst size={70} color="#ff6b35" className="absolute left-[44%] top-[20%] hidden md:block" delay={0.5} />
      <Starburst size={54} color="#3ff0ff" className="absolute bottom-[4%] left-[2%]" delay={1.3} />
      <Atom size={340} className="absolute right-[6%] top-0 hidden lg:block" />
      <Atom size={160} className="mx-auto mb-2 lg:hidden" />
      <p className="rise origin-left -rotate-6 font-script text-5xl text-atomic [text-shadow:0_0_22px_rgb(255_107_53/.6)] md:text-7xl">Greetings from</p>
      <h1 className="rise mt-2 [animation-delay:.1s]">
        <Wordmark size={210} label="kev.in" className="h-auto w-[88vw] max-w-[820px] md:w-auto" />
      </h1>
      <p className="rise mt-6 max-w-[720px] text-xl leading-relaxed text-[#d9d3ec] [animation-delay:.25s] md:text-2xl">
        Kevin Hunt. CTO of Deep Fathom, founder of Rival Bear, engineer #6 at Yammer. Shipping software since dialup, and writing about agents, leadership and flying machines.
      </p>
      <div className="rise mt-9 flex flex-wrap gap-3.5 [animation-delay:.4s]">
        <Link href="/writing" className="rounded-full bg-cyan px-8 py-4 text-lg font-semibold text-ink shadow-[0_0_30px_rgb(63_240_255/.45)] transition-transform hover:scale-105">Read the dispatches →</Link>
        <Link href="/side" className="rounded-full border-[1.5px] border-cream px-8 py-4 text-lg font-semibold transition-transform hover:scale-105">What I&apos;m building</Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Implement the page**

`src/app/page.tsx`:
```tsx
import { HomeHero } from '@/components/home-hero'
import { Stripes } from '@/components/stripes'
import { GoogieCard } from '@/components/googie-card'
import { ProjectCard } from '@/components/project-card'
import { Crt } from '@/components/crt'
import { getPosts, homeDispatches } from '@/lib/posts'
import { PROJECTS } from '@/data/projects'

const ACCENTS = ['#ff4fd8', '#3ff0ff', '#8bff6b']

export default function Home() {
  const dispatches = homeDispatches(getPosts())
  return (
    <main className="relative overflow-hidden bg-[radial-gradient(ellipse_at_70%_0%,#1d1a4a_0%,#0c0b1c_55%)]">
      <Crt intensity="full" />
      <HomeHero />
      <Stripes variant="hero-bend" className="mt-16 hidden md:block" />
      <Stripes variant="straight" className="mt-12 md:hidden" />
      <section aria-labelledby="dispatches" className="relative mx-auto max-w-[1440px] px-5 md:-mt-10 md:px-16">
        <h2 id="dispatches" className="flex flex-wrap items-baseline gap-4 font-display text-4xl md:text-5xl">
          Dispatches <span className="font-script text-5xl text-atomic">then &amp; now</span>
        </h2>
        <div className="mt-8 flex flex-col gap-4">
          {dispatches.map((p, i) => <GoogieCard key={p.slug} post={p} accent={ACCENTS[i % 3]} />)}
        </div>
      </section>
      <section aria-labelledby="building" className="relative mx-auto mt-24 max-w-[1440px] px-5 md:px-16">
        <h2 id="building" className="font-display text-3xl md:text-4xl">What I&apos;m building</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {PROJECTS.map(p => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>
    </main>
  )
}
```

The `Crt` overlay is `position:absolute; inset:0` inside a `relative` main, so it covers the home page only. The footer sits outside `<main>`.

- [ ] **Step 3: Verify visually**

Run: `pnpm build && pnpm start -p 3100`. Then screenshot `/` at 1440×900 and 390×844 with Playwright MCP (full page), and compare against R1:
- the hero wordmark is banded and sliding
- the atom is on the right on desktop and above the title on mobile
- the stripes bend down on desktop
- the three dispatch cards show archive posts with WRITTEN, NOW and ELAPSED
- four project cards
- no horizontal scroll at 390 (`document.documentElement.scrollWidth === 390`)

Fix any issue before committing.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Build the Tomorrowland home page

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Writing index and post pages

**Files:**
- Create: `src/app/writing/page.tsx`, `src/app/writing/[slug]/page.tsx`, `src/components/mdx-content.tsx`, `src/components/page-hero.tsx`, `src/styles/prose.css`
- Modify: `src/app/globals.css` (import `prose.css`)

**Interfaces:**
- Consumes: `getPosts`, `getPost`, `adjacentPosts`, `KIND_LABEL`, `TimeStamp`, `GoogieCard`, `Crt`, `Wordmark`.
- Produces: `<PageHero kicker: string title: string children? />` (used by /writing, /side, /sights, /now), `<MDXContent code: string />`, and the `.prose-k` class.

- [ ] **Step 1: Implement shared pieces**

`src/components/mdx-content.tsx`: copy `~/prj/rb/rivalbear/src/components/mdx-content.tsx` verbatim, including its safety comment (the code is Velite build output from repo files).

`src/components/page-hero.tsx`:
```tsx
import { Crt } from './crt'
export function PageHero({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-cream/10 bg-[radial-gradient(ellipse_at_80%_0%,#1d1a4a_0%,#0c0b1c_60%)]">
      <Crt intensity="soft" />
      <div className="relative mx-auto max-w-[1440px] px-5 pb-14 pt-14 md:px-16 md:pt-20">
        <p className="font-label text-xs tracking-[.24em] text-cyan">{kicker}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">{title}</h1>
        {children}
      </div>
    </section>
  )
}
```

`src/styles/prose.css`:
```css
.prose-k { max-width: 68ch; font-size: 1.25rem; line-height: 1.65; color: #e6e1f2 }
.prose-k > * + * { margin-top: 1.1em }
.prose-k h2, .prose-k h3 { font-family: var(--font-display); color: #f2ece0; line-height: 1.25; margin-top: 2em }
.prose-k h2 { font-size: 1.6rem } .prose-k h3 { font-size: 1.25rem }
.prose-k a { color: #f2ece0; text-decoration: underline; text-decoration-color: #3ff0ff; text-underline-offset: 4px; text-decoration-thickness: 2px }
.prose-k a:hover { color: #ff4fd8; text-decoration-color: #ff4fd8 }
.prose-k img { max-width: 100%; height: auto; border-radius: 10px }
.prose-k blockquote { border-left: 3px solid #ff4fd8; padding-left: 1em; color: #bdb8d6 }
.prose-k code { font-family: var(--font-label); font-size: .88em }
.prose-k :not(pre) > code { background: #1a1834; padding: .1em .35em; border-radius: 4px }
.prose-k pre { overflow-x: auto; padding: 1.1em 1.25em; border-radius: 14px; background: #0a0918; border: 1px solid rgb(242 236 224 / .1); font-size: .95rem; line-height: 1.55 }
.prose-k ul, .prose-k ol { padding-left: 1.3em } .prose-k ul { list-style: disc } .prose-k ol { list-style: decimal }
.prose-k table { display: block; overflow-x: auto }
```

Add `@import '../styles/prose.css';` to `globals.css`.

- [ ] **Step 2: Implement `/writing`**

`src/app/writing/page.tsx`:
```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { GoogieCard } from '@/components/googie-card'
import { getPosts, KIND_LABEL, type PostKind } from '@/lib/posts'

export const metadata: Metadata = { title: 'Writing', description: 'Essays, build logs and field notes, then and now.', alternates: { canonical: '/writing' } }
const ACCENTS = ['#ff4fd8', '#3ff0ff', '#8bff6b', '#7b6cff']
const KINDS = Object.keys(KIND_LABEL) as PostKind[]

export default async function WritingIndex({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind } = await searchParams
  const active = KINDS.includes(kind as PostKind) ? (kind as PostKind) : undefined
  const posts = getPosts().filter(p => !active || p.kind === active)
  const years = [...new Set(posts.map(p => p.date.y))]
  return (
    <main>
      <PageHero kicker="DISPATCHES · THEN & NOW" title="Writing">
        <nav aria-label="Filter by kind" className="mt-8 flex flex-wrap gap-2 font-label text-xs tracking-[.14em]">
          <Link href="/writing" aria-current={!active ? 'page' : undefined} className={`rounded-full border px-4 py-2 ${!active ? 'border-cyan text-cyan' : 'border-cream/20'}`}>ALL</Link>
          {KINDS.map(k => <Link key={k} href={`/writing?kind=${k}`} aria-current={active === k ? 'page' : undefined} className={`rounded-full border px-4 py-2 ${active === k ? 'border-cyan text-cyan' : 'border-cream/20'}`}>{KIND_LABEL[k]}</Link>)}
        </nav>
      </PageHero>
      <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-16">
        {posts.length === 0 && <p className="text-muted">Nothing here yet. Check back soon.</p>}
        {years.map(y => (
          <section key={y} aria-labelledby={`y${y}`} className="mb-16">
            <h2 id={`y${y}`} className="font-display text-5xl text-cream/90 md:text-7xl">{y}</h2>
            <div className="mt-6 flex flex-col gap-4">{posts.filter(p => p.date.y === y).map((p, i) => <GoogieCard key={p.slug} post={p} accent={ACCENTS[i % 4]} />)}</div>
          </section>
        ))}
      </div>
    </main>
  )
}
```

`searchParams` makes `/writing` dynamic. That's acceptable (small). The alternative, pre-rendering `/writing/kind/[kind]`, is not needed for v1.

- [ ] **Step 3: Implement the post page**

`src/app/writing/[slug]/page.tsx`:
```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Crt } from '@/components/crt'
import { MDXContent } from '@/components/mdx-content'
import { TimeStamp } from '@/components/timestamp'
import { adjacentPosts, getPost, getPosts, KIND_LABEL } from '@/lib/posts'

export function generateStaticParams() { return getPosts().map(p => ({ slug: p.slug })) }
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug)
  if (!post) return {}
  return { title: post.title, description: post.summary, alternates: { canonical: post.url },
    openGraph: { type: 'article', title: post.title, description: post.summary, url: post.url, publishedTime: post.dateRaw },
    robots: post.draft ? { index: false } : undefined }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()
  const { newer, older } = adjacentPosts(slug)
  return (
    <main>
      <header className="relative overflow-hidden border-b border-cream/10 bg-[radial-gradient(ellipse_at_80%_0%,#1d1a4a_0%,#0c0b1c_60%)]">
        <Crt intensity="soft" />
        <div className="relative mx-auto flex max-w-[1100px] flex-col gap-8 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-10 md:py-20">
          <div>
            <p className="font-label text-xs tracking-[.22em] text-magenta">{KIND_LABEL[post.kind]}{post.tags.length ? ` · ${post.tags.join(' · ').toUpperCase()}` : ''}</p>
            <h1 className="mt-4 max-w-[760px] font-display text-3xl leading-tight md:text-5xl">{post.title}</h1>
          </div>
          <TimeStamp written={post.date} updated={post.updated} draft={post.draft} />
        </div>
      </header>
      <article className="mx-auto max-w-[1100px] px-5 py-14 md:px-10">
        {post.kind === 'archive' && (
          <p className="mb-10 max-w-[68ch] rounded-2xl border border-amber/40 bg-amber/5 px-5 py-4 font-label text-sm text-amber">
            From the archive. Written in {post.date.y}, when this site ran on Rails. Links may have drifted.
          </p>
        )}
        <div className="prose-k">
          {post.format === 'mdx' ? <MDXContent code={post.body} /> : <div dangerouslySetInnerHTML={{ __html: post.body }} />}
        </div>
      </article>
      <nav aria-label="More writing" className="mx-auto grid max-w-[1100px] gap-4 px-5 pb-10 md:grid-cols-2 md:px-10">
        {older ? <Link href={older.url} className="rounded-2xl border border-cream/10 p-6 hover:border-cyan"><span className="font-label text-xs text-muted">← OLDER</span><span className="mt-2 block font-display text-lg">{older.title}</span></Link> : <span />}
        {newer && <Link href={newer.url} className="rounded-2xl border border-cream/10 p-6 text-right hover:border-cyan"><span className="font-label text-xs text-muted">NEWER →</span><span className="mt-2 block font-display text-lg">{newer.title}</span></Link>}
      </nav>
    </main>
  )
}
```

`dangerouslySetInnerHTML` is safe here: the HTML is Velite output from the 20 repo-controlled archive files, and no user input reaches it. Say so in a one-line comment on that line.

- [ ] **Step 4: Verify**

Run: `pnpm build`. Expected: 20 `/writing/[slug]` pages generated. Start the server and screenshot `/writing` and `/writing/railsconf-07-day-0` at 1440 and 390 widths. Check that the archive banner shows, links are underlined in cyan, `<pre>` blocks scroll horizontally, and there's no horizontal scroll at 390.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Add writing index and post pages with calm reading layout

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Side, Sights, Now, 404, metadata, feeds and share images

**Files:**
- Create:
  - `src/app/side/page.tsx`, `src/app/sights/page.tsx`, `src/app/now/page.tsx`, `src/app/not-found.tsx`, `src/components/moon-rocket.tsx`
  - `src/app/feed.xml/route.ts`, `src/app/llms.txt/route.ts`, `src/app/llms-full.txt/route.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`
  - `src/lib/machine-readable.ts`, `src/lib/machine-readable.test.ts`
  - `src/app/opengraph-image.tsx`, `src/app/writing/[slug]/opengraph-image.tsx`, `src/lib/og.tsx`, `public/fonts/Michroma-Regular.ttf` (copied from `scripts/fonts`)
- Modify: `src/app/layout.tsx` (openGraph and twitter defaults)

**Interfaces:**
- Consumes: `getPosts`, `Post`, `site`, `wordmarkSvg`, `formatStamp`, `PROJECTS`, `PageHero`, `MDXContent`, `pages` from `#site/content`.
- Produces:
  - `buildRssFeed(posts: Post[]): string`
  - `buildLlmsTxt(posts: Post[]): string`
  - `buildLlmsFull(posts: Post[]): string`
  - `ogImage({ kicker: string; title: string; stamp?: string }): ImageResponse`

- [ ] **Step 1: Write the failing tests**

`src/lib/machine-readable.test.ts`:
```ts
import { buildRssFeed, buildLlmsTxt } from './machine-readable'
import type { Post } from './posts'
const post = (over: Partial<Post> = {}): Post => ({ slug: 'a-b', url: '/writing/a-b', title: 'A & B <test>', dateRaw: '2007-05-17T00:00:00-08:00', date: { y: 2007, m: 5, d: 17 },
  kind: 'archive', draft: false, summary: 'Sum', tags: [], format: 'html', body: '<p>Hi</p>', ...over })

it('escapes titles and uses absolute links in RSS', () => {
  const xml = buildRssFeed([post()])
  expect(xml).toContain('<title>A &amp; B &lt;test&gt;</title>')
  expect(xml).toContain('<link>https://kev.in/writing/a-b</link>')
  expect(xml).toContain('<![CDATA[<p>Hi</p>]]>')
})
it('never includes drafts', () => {
  expect(buildRssFeed([post({ draft: true })])).not.toContain('a-b')
  expect(buildLlmsTxt([post({ draft: true })])).not.toContain('a-b')
})
```

Run: `pnpm vitest run src/lib/machine-readable.test.ts`. Expected: FAIL.

- [ ] **Step 2: Implement the machine-readable outputs**

`src/lib/machine-readable.ts`:
```ts
import { site } from './site'
import type { Post } from './posts'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
const pub = (posts: Post[]) => posts.filter(p => !p.draft)
const rfc822 = (p: Post) => new Date(Date.UTC(p.date.y, p.date.m - 1, p.date.d, 12)).toUTCString()

export function buildRssFeed(posts: Post[]): string {
  const items = pub(posts).map(p => `<item><title>${esc(p.title)}</title><link>${site.url}${p.url}</link><guid isPermaLink="true">${site.url}${p.url}</guid><pubDate>${rfc822(p)}</pubDate><description>${esc(p.summary)}</description>${p.format === 'html' ? `<content:encoded>${cdata(p.body)}</content:encoded>` : ''}</item>`).join('')
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><title>${site.name}</title><link>${site.url}</link><description>${esc(site.description)}</description><language>en</language>${items}</channel></rss>`
}
export function buildLlmsTxt(posts: Post[]): string {
  return [`# ${site.name}`, '', `> ${site.description}`, '', '## Writing', ...pub(posts).map(p => `- [${p.title}](${site.url}${p.url}): ${p.summary}`), '', '## Elsewhere', '- [Deep Fathom](https://www.deepfathom.ai)', '- [Rival Bear](https://rivalbear.com)', '- [Photography](https://kevinhunt.com)', ''].join('\n')
}
export function buildLlmsFull(posts: Post[]): string {
  return pub(posts).map(p => `# ${p.title}\n${site.url}${p.url}\n${p.dateRaw.slice(0, 10)}\n\n${p.format === 'html' ? p.body.replace(/<[^>]+>/g, '') : p.summary}\n`).join('\n---\n\n')
}
```

For MDX posts the RSS item carries the summary only. The full MDX body isn't HTML at build time without rendering; that's acceptable for v1 and stated in the feed's `<description>`.

Routes (each `export const dynamic = 'force-static'`):
```ts
// src/app/feed.xml/route.ts
import { buildRssFeed } from '@/lib/machine-readable'
import { getPosts } from '@/lib/posts'
export const dynamic = 'force-static'
export function GET() { return new Response(buildRssFeed(getPosts()), { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } }) }
```
`llms.txt/route.ts` and `llms-full.txt/route.ts` follow the same shape with `buildLlmsTxt` / `buildLlmsFull` and `text/plain; charset=utf-8`.

`src/app/sitemap.ts`:
```ts
import type { MetadataRoute } from 'next'
import { getPosts } from '@/lib/posts'
import { site } from '@/lib/site'
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/writing', '/side', '/sights', '/now'].map(p => ({ url: `${site.url}${p}` }))
  return [...pages, ...getPosts().filter(p => !p.draft).map(p => ({ url: `${site.url}${p.url}`, lastModified: p.dateRaw.slice(0, 10) }))]
}
```

`src/app/robots.ts`:
```ts
import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'
export default function robots(): MetadataRoute.Robots {
  const prod = process.env.VERCEL_ENV === 'production'
  return { rules: prod ? { userAgent: '*', allow: '/' } : { userAgent: '*', disallow: '/' }, sitemap: `${site.url}/sitemap.xml` }
}
```

Run: `pnpm vitest run src/lib/machine-readable.test.ts`. Expected: PASS.

- [ ] **Step 3: Implement the share images**

```bash
mkdir -p public/fonts && cp scripts/fonts/Michroma-Regular.ttf public/fonts/
```

`src/lib/og.tsx`:
```tsx
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { wordmarkSvg } from './wordmark-svg'

export const OG_SIZE = { width: 1200, height: 630 }
export async function ogImage({ kicker, title, stamp }: { kicker: string; title: string; stamp?: string }) {
  const michroma = await readFile(join(process.cwd(), 'public/fonts/Michroma-Regular.ttf'))
  const mark = `data:image/svg+xml;base64,${Buffer.from(wordmarkSvg('kev.in', { height: 120 })).toString('base64')}`
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: '#0c0b1c', color: '#f2ece0', fontFamily: 'Michroma' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} height={96} alt="" />
          <div style={{ fontSize: 22, color: '#ff6b35', letterSpacing: 4 }}>{kicker}</div>
        </div>
        <div style={{ fontSize: title.length > 60 ? 48 : 60, lineHeight: 1.2, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: 'flex', gap: 16, fontSize: 22, color: '#ff4fd8' }}>
          {stamp ? <span>WRITTEN {stamp}</span> : <span>KEVIN HUNT · SIERRA NEVADA</span>}
          <span style={{ color: '#8bff6b' }}>kev.in</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: 'Michroma', data: michroma, weight: 400, style: 'normal' }] },
  )
}
```

`src/app/opengraph-image.tsx`:
```tsx
import { ogImage, OG_SIZE } from '@/lib/og'
export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'kev.in — Kevin Hunt'
export default function OG() { return ogImage({ kicker: 'GREETINGS FROM', title: 'Software, agents, leadership and flying machines.' }) }
```

`src/app/writing/[slug]/opengraph-image.tsx`:
```tsx
import { ogImage, OG_SIZE } from '@/lib/og'
import { getPost, getPosts, KIND_LABEL } from '@/lib/posts'
import { formatStamp } from '@/lib/dates'
export const size = OG_SIZE
export const contentType = 'image/png'
export function generateStaticParams() { return getPosts().map(p => ({ slug: p.slug })) }
export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug)!
  return ogImage({ kicker: KIND_LABEL[post.kind], title: post.title, stamp: formatStamp(post.date) })
}
```

In `layout.tsx` metadata, add `openGraph: { siteName: site.name, type: 'website', url: '/' }`, `twitter: { card: 'summary_large_image' }` and `alternates: { canonical: '/', types: { 'application/rss+xml': '/feed.xml' } }`.

- [ ] **Step 4: Implement `/side`, `/sights`, `/now` and 404**

`src/app/side/page.tsx`:
```tsx
import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ProjectCard } from '@/components/project-card'
import { PROJECTS } from '@/data/projects'
export const metadata: Metadata = { title: 'Side', description: 'What Kevin is building: Deep Fathom, Rival Bear, and the experiments in between.', alternates: { canonical: '/side' } }
export default function Side() {
  const rb = PROJECTS.find(p => p.slug === 'rival-bear')!
  return (
    <main>
      <PageHero kicker="KEV.IN/SIDE" title="What I'm building" />
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">{PROJECTS.map(p => <ProjectCard key={p.slug} project={p} />)}</div>
        <h2 className="mt-24 font-display text-3xl">From the Rival Bear studio</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {rb.children!.map(c => (
            <li key={c.name}><a href={c.href} target="_blank" rel="noopener" className="block rounded-[40px_12px_40px_12px] border border-magenta/40 p-7 hover:border-magenta"><span className="font-display text-xl">{c.name}</span><span className="mt-2 block text-muted">{c.blurb}</span></a></li>
          ))}
        </ul>
      </div>
    </main>
  )
}
```

`src/app/sights/page.tsx`:
```tsx
import type { Metadata } from 'next'
import { readdirSync } from 'node:fs'
import Image from 'next/image'
import { PageHero } from '@/components/page-hero'
export const metadata: Metadata = { title: 'Sights', description: 'Photographs by Kevin Hunt.', alternates: { canonical: '/sights' } }
const photos = (() => { try { return readdirSync('public/sights').filter(f => /\.(jpe?g|png|webp)$/i.test(f)) } catch { return [] } })()
export default function Sights() {
  return (
    <main>
      <PageHero kicker="KEV.IN/SIGHTS" title="Sights" />
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-16">
        {photos.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map(f => <li key={f}><Image src={`/sights/${f}`} alt="" width={900} height={600} className="h-auto w-full rounded-2xl object-cover" /></li>)}
          </ul>
        )}
        <a href="https://kevinhunt.com" className="mt-10 block max-w-xl rounded-[48px_14px_48px_14px] border border-green/50 p-8 hover:border-green">
          <span className="font-label text-xs tracking-[.2em] text-green">THE FULL COLLECTION</span>
          <span className="mt-3 block font-display text-2xl">kevinhunt.com →</span>
          <span className="mt-2 block text-muted">My photography lives there.</span>
        </a>
      </div>
    </main>
  )
}
```

`src/app/now/page.tsx`:
```tsx
import type { Metadata } from 'next'
import { pages } from '#site/content'
import { PageHero } from '@/components/page-hero'
import { MDXContent } from '@/components/mdx-content'
import { Readout } from '@/components/readout'
import { calendarDate, formatStamp } from '@/lib/dates'
export const metadata: Metadata = { title: 'Now', description: 'What Kevin Hunt is up to right now.', alternates: { canonical: '/now' } }
export default function Now() {
  const now = pages.find(p => p.path.endsWith('now'))!
  return (
    <main>
      <PageHero kicker="KEV.IN/NOW" title="Now"><div className="mt-6"><Readout label="UPDATED" text={formatStamp(calendarDate(now.updated))} tone="cyan" /></div></PageHero>
      <div className="mx-auto max-w-[1100px] px-5 py-14 md:px-10"><div className="prose-k"><MDXContent code={now.code} /></div></div>
    </main>
  )
}
```

The Velite pages schema uses the field name `updated` (a raw string), consistent with Task 3's decision.

`src/components/moon-rocket.tsx` is the R3 rocket-into-moon scene. It's a server component: SVG with `<animateMotion>` and `keyPoints="0;1;1" keyTimes="0;0.72;1"` on path `M-40 520 C 260 380, 520 80, 900 150 S 1030 176, 1120 188`, and a cream moon disc at (1060, 90) with a 260px radius-box. Copy the markup from `scratchpad/kevin-design/build_r3.py`, recolored to R1 tokens (rocket stroke `#ff4fd8`, flame `#ffb000`, trail `#ff6b35`). Put it in `viewBox="0 0 1440 700"` with `preserveAspectRatio="xMidYMid meet"`, `width="100%"` and `aria-hidden`. Under reduced motion, CSS can't stop SMIL. So render the rocket group twice: the animated group gets class `motion-safe:block hidden` (Tailwind `motion-safe:` variant), and a static rocket already lodged at the path end gets class `motion-safe:hidden`.

`src/app/not-found.tsx`:
```tsx
import Link from 'next/link'
import { MoonRocket } from '@/components/moon-rocket'
export default function NotFound() {
  return (
    <main className="relative mx-auto max-w-[1440px] px-5 pb-10 md:px-16">
      <MoonRocket />
      <h1 className="-mt-10 font-display text-4xl md:text-6xl">This page flew off course.</h1>
      <p className="mt-4 text-xl text-muted">It&apos;s lodged somewhere in the moon. Try the <Link className="text-cyan underline" href="/writing">writing</Link> or head <Link className="text-cyan underline" href="/">home</Link>.</p>
    </main>
  )
}
```

- [ ] **Step 5: Verify**

Run: `pnpm test && pnpm build`. Expected: all unit tests pass and the build succeeds.
Then:
- `curl -s localhost:3100/feed.xml | xmllint --noout -` exits 0.
- `curl -sI localhost:3100/opengraph-image` returns 200 `image/png`. Open it and check that the banded wordmark renders.
- Open `/side`, `/sights`, `/now` and `/nope` at 390 and 1440 widths.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "Add side, sights, now, 404, feeds, sitemap and share images

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: End-to-end, accessibility and budget checks

**Files:**
- Create: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Write the E2E suite**

`tests/e2e/site.spec.ts`:
```ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const PAGES = ['/', '/writing', '/writing/railsconf-07-day-0', '/side', '/sights', '/now']

for (const path of PAGES) {
  test(`${path} renders cleanly`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', m => m.type() === 'error' && errors.push(m.text()))
    const res = await page.goto(path)
    expect(res?.status()).toBe(200)
    await expect(page.getByRole('link', { name: 'kev.in home' })).toBeVisible()
    expect(errors.filter(e => !/vercel|insights|_vercel/i.test(e))).toEqual([])
  })
}

test('home shows then/now stamps that fill in', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(/Written \w+ \d+, 2007 — \d+ years ago\./).first()).toBeAttached()
})

test('unknown pages show the moon', async ({ page }) => {
  const res = await page.goto('/definitely-not-here')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: 'This page flew off course.' })).toBeVisible()
})

for (const [from, to] of [
  ['/2007/05/17/railsconf-07-day-0.html', '/writing/railsconf-07-day-0'],
  ['/2007/08/01/announcing-dibs-net', '/writing/announcing-dibs-net'],
  ['/page3', '/writing'],
  ['/atom.xml', '/feed.xml'],
]) {
  test(`redirects ${from}`, async ({ request }) => {
    const res = await request.get(from, { maxRedirects: 0 })
    expect(res.status()).toBe(308)
    expect(res.headers()['location']).toBe(to)
  })
}

test('feed is XML', async ({ request }) => {
  const res = await request.get('/feed.xml')
  expect(res.headers()['content-type']).toContain('rss+xml')
  expect(await res.text()).toMatch(/^<\?xml/)
})

for (const path of ['/', '/writing/railsconf-07-day-0']) {
  test(`${path} has no serious a11y violations`, async ({ page }) => {
    await page.goto(path)
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical').map(v => v.id)).toEqual([])
  })
}

test('no horizontal scroll at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  for (const path of PAGES) {
    await page.goto(path)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360)
  }
})

test('reduced motion stops CSS animation', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto('/')
  const running = await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length)
  expect(running).toBe(0)
  await ctx.close()
})
```

`pnpm exec playwright install chromium` if the browser is missing.

- [ ] **Step 2: Run the suite and fix failures**

Run: `pnpm test:e2e`. Expected: all pass. Fix causes in the owning component; don't loosen assertions. Contrast failures usually mean muted text on ink is too dim: raise it to `#bdb8d6` or brighter.

- [ ] **Step 3: Check the budgets**

- **JS size:** run `pnpm build` and read the route table. The "First Load JS" for `/` should be about 130 KB uncompressed at most. For the exact gzipped client JS, sum the `.next/static/chunks` loaded by `/` via Playwright's `page.on('response')` transfer sizes, excluding `_vercel`. The target is < 90 KB.
- **Lighthouse:** `npx lighthouse http://localhost:3100/ --preset=perf --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --quiet --chrome-flags="--headless"`, and the same for `/writing/railsconf-07-day-0`. Targets: Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO = 100. On a local build SEO may flag `robots` disallow (non-production). Rerun with `VERCEL_ENV=production pnpm build && pnpm start` for the SEO score.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Add end-to-end, accessibility, redirect and reduced-motion tests

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: Deploy to Vercel and hand off cutover

**Files:**
- Create: `docs/cutover.md`
- Modify: `README.md` (Deploy section)

- [ ] **Step 1: Push the branch and open a PR**

```bash
git push -u origin kev-in-redesign
gh pr create --base master --title "kev.in redesign: Tomorrowland on Next.js 16" --body "<summary of spec + test results>

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

- [ ] **Step 2: Create and link the Vercel project on the Rival Bear team**

```bash
vercel-rb whoami
vercel-rb link --yes --project kev-in
cat .vercel/project.json   # confirm orgId == team_PLjTtmKrAs63t2VCVw8TkfBC
vercel-rb git connect      # link GitHub kevn/kevn.github.io; production branch master
```

If `link --project` doesn't create the project, run `vercel-rb project add kev-in` first. Framework preset: Next.js. Build command: default (`pnpm build`, whose prebuild runs velite).

- [ ] **Step 3: Deploy a preview and verify it**

```bash
vercel-rb deploy
```

Against the preview URL:
- `/`, `/writing`, a post, `/feed.xml`, `/opengraph-image`
- `curl -sI <preview>/2007/05/17/railsconf-07-day-0.html` returns 308 with location `/writing/railsconf-07-day-0`

- [ ] **Step 4: Deploy to production (vercel.app only; no domain yet)**

```bash
vercel-rb deploy --prod
```

Verify the production `*.vercel.app` URL the same way. Confirm drafts are hidden: add a temporary draft only in a local branch, never merged.

- [ ] **Step 5: Write `docs/cutover.md`**

The domain steps require Kevin's Namecheap access. Write the exact runbook from spec §7:
- Vercel: add `kev.in` and `www.kev.in` in the `kev-in` project, and read the required records from the Domains panel.
- Namecheap: delete the GitHub A/AAAA records, add the Vercel records, keep MX and SPF as-is, delete the `_gitlab-pages-verification-code` TXT.
- Verify: TLS, `www` → apex, three legacy URLs, `/feed.xml`, and a test email.
- Then: `gh api -X DELETE repos/kevn/kevn.github.io/pages`, delete `.github/workflows/deploy.yml` and `CNAME`, and `gh repo rename kev.in`.
- Rollback: restore the GitHub A records `185.199.108.153`–`185.199.111.153` and the AAAA records `2606:50c0:8000::153`–`2606:50c0:8003::153`, and re-enable Pages from tag `pre-redesign`.

- [ ] **Step 6: Commit and push**

```bash
git add -A && git commit -m "Add Vercel deploy notes and DNS cutover runbook

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
git push
```
