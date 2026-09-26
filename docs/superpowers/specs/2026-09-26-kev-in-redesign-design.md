# kev.in redesign: design spec

- **Date:** 2026-09-26
- **Owner:** Kevin Hunt
- **Status:** Approved direction; spec awaiting review
- **Design source:** the Claude Design canvas at https://claude.ai/artifact/KRTebxa5JTnfw7YCf3PKbo, artboard **R1 · Tomorrowland (1955)**. The "Futures past" board on the same canvas holds the research behind it.

## 1. Intent

kev.in becomes Kevin's personal site and writing home again. It replaces a stale 2013-era Hyde/Jekyll theme (partly migrated to Astro 4) with a new codebase and a bold visual identity.

**Who it's for:** people who want to read what Kevin writes. That means technical peers, founders, and curious readers across a wide range of topics.

**Writing mix:** engineering leadership and building with AI agents are the anchor. Drones, maps and 3D terrain, making things, and the outdoors make up the rest.

**Design thesis: retro-futurism as inspiration, not costume.** The site draws on how earlier eras imagined the future (1950s atomic-age and Googie design first, then the 1928 pulps, the 1939 World's Fair and the 1975 space-colony paintings). It melds that past with the present, which is part of who Kevin is. It is deliberately flashy ("full octane"), at the level of an AI-startup landing page.

**Hard no's:**
- steampunk
- literal retro props such as fake OS windows, terminal menus or slash-command UI
- AI-cliché gradient washes
- quiet, text-only blog minimalism

**Success looks like:**
1. The site is live at https://kev.in on the new stack, and every old post URL still resolves via a permanent redirect (308).
2. Kevin can publish a post by merging one MDX file. Drafts are visible only on preview deployments.
3. The home page matches R1's look and motion, and passes the performance and accessibility budgets in §10.
4. Email to @kev.in addresses keeps working through the DNS change.

## 2. Stack and hosting

| Concern | Decision |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript. Pages are statically generated. |
| Styling | Tailwind CSS v4 plus a small set of hand-written CSS modules for motion and effects |
| Content | Velite: `.mdx` for new posts, `.md` (HTML allowed) for the archive |
| Package manager | pnpm, Node ≥ 22 |
| Hosting | Vercel, on the Rival Bear team, using the `vercel-rb` CLI alias (`--global-config ~/.config/vercel-rb`). Project name `kev-in`. |
| Deploys | Vercel Git integration. The production branch is `master`, and every PR gets a preview URL. |
| Analytics | `@vercel/analytics` and `@vercel/speed-insights` |
| Share images | `next/og` (`ImageResponse`) |
| Repo | `kevn/kevn.github.io`, renamed to `kevn/kev.in` at cutover. A single clean-slate commit replaces the Jekyll/Astro tree, and all history since 2013 is kept. |

The stack mirrors `~/prj/rb/rivalbear` (Next 16, Tailwind v4, Velite, Vercel Analytics, generated OG images) so patterns carry across. That includes the Velite config shape, the `redirects()` source in `next.config.ts`, and `opengraph-image.tsx`.

## 3. Information architecture

| Route | Purpose |
|---|---|
| `/` | Home (R1 Tomorrowland): hero, "Dispatches, then & now", "What I'm building", footer |
| `/writing` | All posts grouped by year, newest first, each with its then/now stamp. Plain links filter by kind (`?kind=essay`); there's no client-side search. |
| `/writing/[slug]` | One post |
| `/side` | Projects: Deep Fathom, Rival Bear and its apps (Yonder, Twiggybank, Balance Point). Kevin adds more by editing a typed data file. |
| `/sights` | A small grid of Kevin's favorite photos, linking to kevinhunt.com. Until Kevin supplies photos it shows a single card linking to kevinhunt.com. |
| `/now` | A single MDX page of what Kevin is up to, with an "updated" stamp |
| `/feed.xml` | RSS 2.0 of published (non-draft) posts, full content |
| `/llms.txt`, `/llms-full.txt` | LLM-readable index and full text, following the rivalbear pattern |
| `/sitemap.xml`, `/robots.txt` | Via `sitemap.ts` and `robots.ts` |
| 404 (`not-found.tsx`) | R3's rocket lodged in the Moon's eye, with a link home |

**Navigation:** the wordmark links home. The nav holds WRITING ✦ SIDE ✦ SIGHTS ✦ NOW, plus a `hi@kev.in` pill that is a `mailto:`.

## 4. Content model

Content lives in `content/`:

- `content/writing/*.mdx`: new posts
- `content/archive/*.md`: the 20 migrated 2007–08 posts
- `content/pages/now.mdx`
- `src/data/projects.ts`: the typed project list

**Post schema** (Velite; both collections resolve to one `Post` type):

| Field | Type | Notes |
|---|---|---|
| `title` | string ≤ 140 | |
| `slug` | string | Taken from the filename with the date prefix stripped. Must be unique across both collections. |
| `date` | ISO date | The WRITTEN stamp |
| `updated` | ISO date, optional | Shows an UPDATED stamp when present |
| `kind` | `essay` \| `build-log` \| `field-notes` \| `archive` | Archive files get `archive` automatically |
| `draft` | boolean, default false | Drafts are included only when `VERCEL_ENV !== 'production'` |
| `summary` | string ≤ 300, optional | Used on cards, the feed and OG images. Archive posts without one fall back to the first 160 characters of plain text. |
| `tags` | string[], optional | Archive posts map their Jekyll `categories` here |
| `body` | compiled MDX or HTML | |

**Archive migration:** the files in `src/content/blog/*.md` move to `content/archive/`. The filename date and slug are kept, and the frontmatter is normalized (`categories` becomes `tags`, `kind: archive`). Bodies stay HTML, rendered through Velite's `s.markdown()` with raw HTML allowed. Images in `public/images/` move with them, and their paths are rewritten if they change.

**Legacy redirects** (all `permanent: true`, which Next.js serves as 308), generated as explicit pairs from the archive filenames by `legacyRedirects()` in `src/lib/redirects.ts` and returned from `next.config.ts` `redirects()`. The unit tests check the patterns against all 20 archive filenames:

| Old path | New path |
|---|---|
| `/:year/:month/:day/:slug.html` and the same without `.html` | `/writing/:slug` |
| `/page2`–`/page4` (and `.html` forms) | `/writing` |
| `/tags`, `/tags.html` and `/tags/:tag*` | `/writing` |
| `/atom.xml` | `/feed.xml` |
| `/index.html` | `/` |

## 5. Design system

The tokens and components below are the R1 artboard turned into code. "Improve as we go" is explicit: each component may be refined beyond the mockup as long as it keeps R1's character.

### 5.1 Tokens

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0c0b1c` | Page ground (deep midnight) |
| `--ink-2` | `#12102a` | Raised surfaces |
| `--cream` | `#f2ece0` | Primary text |
| `--muted` | `#bdb8d6` | Secondary text |
| `--violet` | `#7b6cff` | Band color 2 |
| `--cyan` | `#3ff0ff` | Band color 3, primary action |
| `--green` | `#8bff6b` | Band color 4, the NOW stamp |
| `--magenta` | `#ff4fd8` | Band color 1, the WRITTEN stamp |
| `--atomic` | `#ff6b35` | Script accent (the "Greetings from" line) |
| `--amber` | `#ffb000` | The ELAPSED stamp |

**Type:**
- **Michroma** (display: wordmark, headings)
- **Instrument Sans** (body)
- **Space Mono** (labels, nav)
- **Yellowtail** (script accent, used sparingly: at most one line per view)
- **DSEG7/DSEG14 Classic** (timestamp digits; OFL, self-hosted via `next/font/local`)

The Google fonts load via `next/font/google`.

### 5.2 Components

**`<Wordmark>`**
- Draws the banded "kev.in" as inline SVG from Michroma glyph outlines. The outlines are converted to paths once by `scripts/build-wordmark.mjs` using opentype.js, and the resulting SVG is committed.
- The fill is a four-band pattern (magenta, violet, cyan, green) that slides vertically. Thin horizontal gaps are cut by a mask.
- Sizes: nav (≈30px), hero (≈230px), footer (≈96px).
- Accessibility: `role="img"` and `aria-label="kev.in"`.
- The same SVG feeds the OG images.
- *Why SVG rather than CSS text-clip:* it's crisp at every size, there's no font-loading flash, and it can be reused in the OG images and favicon.

**`<CrtOverlay intensity="full|soft|off">`**
- Draws scanlines, a vignette and a subtle flicker.
- `full` on the home page, `soft` on index pages, and `off` inside article bodies (the article header band keeps `soft`).

**`<Starburst>`, `<Sparkle>`, `<Atom>`**
- Googie ornaments: 4-point sparkles, 16-ray starbursts, and a three-orbit atom around a glowing nucleus. All decorative (`aria-hidden`).
- Positions on the home page are fixed per breakpoint, not random at runtime.

**`<Stripes>`**
- Four parallel bands that draw in, then bend around a corner to lead into the next section.
- Their paths are defined per breakpoint.

**`<TimeStamp>`**
- A row of label plates (WRITTEN / NOW / ELAPSED / UPDATED / STATUS) beside segmented-digit readouts. Unlit "ghost 8s" show behind the lit digits.
- **WRITTEN:** the post date, as `MMM DD YYYY`.
- **NOW:** today's date in the reader's time zone. It's a small client component: on the server it renders ghost digits only, and it fills in on mount to avoid a hydration mismatch.
- **ELAPSED:** years when ≥ 1 year (`19 YRS`), otherwise months (`03 MOS`), otherwise days (`12 DYS`). It's computed on the client.
- **UPDATED** shows when `updated` is set. **STATUS** shows `DRAFT` on drafts, and only appears in previews.
- Accessibility: a visually hidden sentence ("Written May 17, 2007 — 19 years ago") carries the meaning for screen readers; the digits are `aria-hidden`.

**`<GoogieCard>`** is the post card: asymmetric radius (64/14/64/14), a colored top rule, the title in Michroma, and a `<TimeStamp>` column. On mobile it stacks.

**`<ProjectCard>`** has a slanted glowing "roof" bar in its accent color, a starburst badge, a title and a one-line description.

### 5.3 Pages

- **Home:** R1 layout.
  - The hero is "Greetings from" in Yellowtail, then the `<Wordmark>` at hero size, the bio, and two buttons: "Read the dispatches" goes to `/writing` and "What I'm building" to `/side`.
  - The `<Atom>` sits on the right, with ornaments scattered around.
  - `<Stripes>` lead into "Dispatches, then & now", which shows the 3 most recent published non-archive posts. If there are fewer than 3, archive posts fill the remaining slots, newest first. This is deliberate: it's the then/now story.
  - Then "What I'm building" (4 cards from `projects.ts`) and the footer: "See you in the future", `hi@kev.in` at wordmark size, and "Sierra Nevada, CA · on the air since 2005".
- **Post:**
  - The header band has soft CRT, kind, title, `<TimeStamp>` and tags.
  - The body is a calm reading column (about 68ch, Instrument Sans at 20px, line-height 1.65).
  - Code is highlighted with Shiki (via rehype-pretty-code) using a custom theme built from the tokens.
  - Headings are in Michroma. Links are underlined in cyan and turn magenta on hover.
  - Footer: previous and next posts, then the site footer.
  - Archive posts get a slim banner: "From the archive — written in 2007, when this site ran on Rails."
- **`/writing`:** year headings in large Michroma, with rows made from compact `<GoogieCard>`s.
- **`/side`, `/sights`, `/now`:** hero band (a smaller wordmark and title) plus content. They use the same components.
- **404:** the Méliès moon and rocket animation from R3, adapted to the R1 palette. The copy reads: "This page flew off course." with a link home.

### 5.4 Motion and responsiveness

- All motion is CSS or SVG. No animation library ships in v1.
- `prefers-reduced-motion: reduce` turns off twinkling, the stripe draw, the band slide, CRT flicker and orbits. Everything renders in its final state.
- **Breakpoints:** mobile ≤ 640, tablet ≤ 1024, desktop.
  - On mobile, the hero wordmark scales to fit the width (≈ 22vw), the atom moves above the bio at a smaller size, and the stripes run straight across.
  - Cards stack. The timestamps wrap under the title.
  - No horizontal scroll at any width down to 360px.

## 6. Share images and metadata

- `app/opengraph-image.tsx` makes the site-wide card. `app/writing/[slug]/opengraph-image.tsx` makes one per post: midnight ground, the wordmark SVG, the post title in Michroma, and WRITTEN/NOW-style stamps showing the post date. The fonts are TTF files loaded from the repo.
- `generateMetadata` on every route supplies title, description, canonical URL, OpenGraph and Twitter card. The title pattern is `{title} · kev.in`.
- The favicon and touch icons are drawn from the banded "k" glyph of the wordmark.

## 7. Domains, DNS and email

**Current state (verified 2026-09-26):**
- **kev.in:** registered at Namecheap and expires 2027-02-16. It uses Namecheap BasicDNS. A and AAAA records point at GitHub Pages. The MX records are Namecheap eforward (email forwarding). SPF is `v=spf1 include:spf.efwd.registrar-servers.com include:_spf.google.com ~all`. There's a google-site-verification TXT and a stale `_gitlab-pages-verification-code` TXT. There's no `www` record.
- **kevinhunt.com:** registered at Porkbun, but its nameservers still point at Namecheap, which refuses to answer for it, so it doesn't resolve. Fixing it is **out of scope** for this project (it's a nameserver change at Porkbun) and is tracked separately.

**Cutover plan:**
1. Deploy to Vercel. Verify the preview URL and the production `*.vercel.app` URL, including a sample of legacy redirects.
2. In Vercel (the `kev-in` project), add the domains `kev.in` (primary) and `www.kev.in` (redirecting to the apex).
3. In Namecheap Advanced DNS:
   - Delete the four GitHub A records and four AAAA records.
   - Add the records Vercel's domain panel shows at cutover time. Currently that's `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com`; re-check the dashboard values before entering them.
   - **Leave the MX and SPF records exactly as they are.**
   - Delete the `_gitlab-pages-verification-code` TXT. Keep google-site-verification.
4. Wait for Vercel to verify the domain and issue TLS. Spot-check `https://kev.in`, `https://www.kev.in`, three legacy URLs, `/feed.xml`, and a test email to a kev.in address.
5. Disable GitHub Pages on the repo, delete `.github/workflows/deploy.yml` and `CNAME`, and rename the repo to `kevn/kev.in`.

**Rollback:** restore the GitHub Pages A and AAAA records (GitHub's four `185.199.108–111.153` A records and `2606:50c0:8000–8003::153` AAAA records) and re-enable Pages from the old tree at tag `pre-redesign`, which is created before the clean-slate commit.

## 8. Repository layout

```
content/
  writing/        new posts (.mdx)
  archive/        20 migrated posts (.md, raw HTML)
  pages/now.mdx
public/
  images/         archive post images (migrated)
  sights/         photos Kevin supplies for /sights
  fonts/          DSEG + TTFs used by next/og
scripts/
  build-wordmark.mjs   Michroma glyphs → committed SVG paths
src/
  app/            routes from §3, plus opengraph-image.tsx files, feed.xml, llms*.txt, sitemap.ts, robots.ts, not-found.tsx
  components/     Wordmark, CrtOverlay, Starburst, Sparkle, Atom, Stripes, TimeStamp, GoogieCard, ProjectCard, SiteNav, SiteFooter
  data/projects.ts
  lib/            posts.ts (queries and draft filtering), redirects.ts, elapsed.ts, dates.ts
  styles/         globals.css (tokens) + effects.css (keyframes)
docs/superpowers/specs/, docs/superpowers/plans/
velite.config.ts, next.config.ts
```

## 9. Testing

**Unit (Vitest):**
- `elapsed.ts`: year, month and day boundaries, and leap days.
- `dates.ts` formatting.
- `posts.ts`: draft filtering by `VERCEL_ENV`, sort order, and the home-page fill rule (new posts first, then archive).
- `redirects.ts`: for all 20 archive filenames, the legacy URL (with and without `.html`) resolves to the right `/writing/:slug`.
- Slug uniqueness across collections.

**End-to-end (Playwright, against `next build && next start`):**
- Home, `/writing`, one new post, one archive post, `/side`, `/now`, and a 404 all render with no console errors.
- Three legacy URLs return a 308 to the right post.
- `/feed.xml` parses as XML.
- An axe accessibility scan of home and a post finds no serious or critical violations.
- A reduced-motion run confirms no running animations.

**Manual before cutover:** a Lighthouse run on home and one post (see budgets below), and a visual check at 360, 768 and 1440 widths.

## 10. Budgets

- **Lighthouse (mobile) on home and one post:** Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100.
- **Core Web Vitals:** LCP < 2.0s, CLS < 0.05.
- **Client JavaScript:** kev.in's own client code on the home page < 30 KB gzipped. The React + Next.js App Router runtime (~150 KB gzipped) and Vercel analytics are excluded as a fixed framework baseline; Lighthouse Performance is the governing budget. *(Revised during implementation: the original 90 KB total was below the framework's own floor.)*

## 11. Out of scope for v1

Newsletter, comments, site search, WebGL or real-terrain visuals (a candidate future flagship post), a CMS, dark/light theme switching (the site is dark only), the kevinhunt.com fix, and alternate era themes (R2–R4 treatments beyond the 404 page).

## 12. Decisions made with defaults (flag them to change)

- **Copy:** the hero bio and section copy start from the R1 mockup. Kevin edits the final wording before cutover.
- **The first new post** is Kevin's to write. Until it exists, the home page shows three archive posts through the fill rule.
- **`/sights`** starts with the kevinhunt.com link card and gains photos when Kevin adds files to `public/sights/`.
- **Tag set:** free-form. No tag pages in v1 (the old `/tags` URLs redirect to `/writing`).
