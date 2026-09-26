# kev.in cutover runbook

**Status on 2026-09-26:** the new site is live on Vercel at **https://kev-in-lyart.vercel.app**. That's project `kev-in` on the Rival Bear team ("Kevin's projects", `team_PLjTtmKrAs63t2VCVw8TkfBC`). kev.in itself still points at GitHub Pages, and nothing below has been done yet.

The steps need Kevin's accounts (the GitHub app, the Vercel dashboard and Namecheap). Do them in order.

## 1. Let Vercel see the repo (enables PR previews and deploy-on-merge)

`vercel-rb git connect` failed because the Vercel GitHub app can't access `kevn/kevn.github.io`.

1. Go to GitHub → Settings → Applications → **Vercel** → Configure → Repository access, and add `kevn/kevn.github.io`. It becomes `kevn/kev.in` in step 6.
2. In this repo, run:
   ```bash
   vercel-rb git connect https://github.com/kevn/kevn.github.io --yes
   ```
3. In the Vercel project settings → Git, set the production branch to `master`.

After this, every PR gets a preview URL. Previews are behind Vercel login, and drafts are visible there. Merging to `master` deploys production.

> **Always deploy production from `master`,** whether by merging or with `vercel-rb deploy --prod`. **Never "Promote" a preview build.** Drafts, `robots.txt` and the feed are fixed at build time from `VERCEL_ENV`, and a promoted preview build could carry drafts and `Disallow: /` into production.

## 2. Merge the redesign

Merge the `kev-in-redesign` PR into `master` first. The old `.github/workflows/deploy.yml` (the Astro → GitHub Pages workflow) will run once and fail at the build step. That's harmless: GitHub Pages keeps serving the old site until DNS moves.

## 3. Add the domains in Vercel

In Vercel, open the `kev-in` project → Settings → **Domains**:
- Add `kev.in` as the primary domain.
- Add `www.kev.in`, redirecting (308) to `kev.in`.

Write down the exact records Vercel asks for. At the time of writing these are `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com`. **Use whatever the dashboard shows.**

## 4. Change DNS at Namecheap (Domain List → kev.in → Advanced DNS)

Current records, checked 2026-09-26:

| Type | Host | Value | Action |
|---|---|---|---|
| A | @ | 185.199.108.153 | **delete** |
| A | @ | 185.199.109.153 | **delete** |
| A | @ | 185.199.110.153 | **delete** |
| A | @ | 185.199.111.153 | **delete** |
| AAAA | @ | 2606:50c0:8000::153 … 8003::153 (4 records) | **delete** |
| — | @ | Vercel's A record (e.g. 76.76.21.21) | **add** |
| CNAME | www | Vercel's value (e.g. cname.vercel-dns.com) | **add** |
| MX | @ | eforward1–5.registrar-servers.com | **keep, untouched** (email forwarding) |
| TXT | @ | `v=spf1 include:spf.efwd.registrar-servers.com include:_spf.google.com ~all` | **keep, untouched** |
| TXT | @ | google-site-verification=… | keep |
| TXT | _gitlab-pages-verification-code… | … | **delete** (stale) |

Leave the nameservers on Namecheap BasicDNS. The email forwarding depends on them.

## 5. Verify

Wait for Vercel to show the domain as verified with a TLS certificate issued (usually a few minutes). Then:

```bash
curl -sI https://kev.in | head -1                                   # HTTP/2 200
curl -sI https://www.kev.in | grep -i location                      # → https://kev.in/
curl -sI https://kev.in/2007/05/17/railsconf-07-day-0.html | grep -iE '^HTTP|location'   # 308 → /writing/railsconf-07-day-0
curl -sI https://kev.in/atom.xml | grep -i location                 # → /feed.xml
curl -s https://kev.in/robots.txt                                   # Allow: /
curl -s https://kev.in/feed.xml | xmllint --noout - && echo ok
dig +short MX kev.in                                                # eforward records still present
```

Then send a test email to your kev.in address from an outside account, and confirm it arrives.

In Google Search Console, submit `https://kev.in/sitemap.xml`. The old `sitemap-index.xml` redirects there.

## 6. Retire GitHub Pages and rename the repo

```bash
gh api -X DELETE repos/kevn/kevn.github.io/pages
git rm .github/workflows/deploy.yml CNAME && git commit -m "Retire GitHub Pages" && git push
gh repo rename kev.in -R kevn/kevn.github.io
git remote set-url origin git@github.com:kevn/kev.in.git
```

Vercel follows the rename automatically. Check under Project → Settings → Git.

## Rollback

1. At Namecheap, delete the Vercel A and CNAME records and restore the GitHub Pages records:
   - A `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153
   - AAAA `@`: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153 and 2606:50c0:8003::153
2. If Pages was already disabled, re-enable it and redeploy the old site from tag `pre-redesign`, which points at the last commit of the Astro/Jekyll tree:
   ```bash
   git checkout -b restore-old pre-redesign && git push -u origin restore-old
   ```
   Then point Pages at that branch, or run its deploy workflow.

## Separate: kevinhunt.com is down

kevinhunt.com is registered at Porkbun, but its nameservers still point at Namecheap (`dns1/dns2.registrar-servers.com`), and Namecheap refuses to answer for it. To fix it, set the nameservers in Porkbun to Porkbun's own (or wherever the photo site is hosted), then recreate its DNS records. `/sights` links there.
