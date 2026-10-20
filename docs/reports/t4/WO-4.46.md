---
wo: WO-4.46
terminal: T4
branch: t4/work
commit: 870dfe3 (items 1, 2, 4), 236173c (item 3)
tested_against: "Items 1, 2, 4: local checkout of t4/work at 870dfe3 (on top of origin/main ee43b0b, Joseph's PR #12), Node 22.19.0: npm test (vitest 3.2.7), npm run build (postbuild fell back to the committed caches because the CRM's public routes answered 500, see Known gaps), npm run lint; vite preview on localhost:4174 captured with headless Chrome and the repo's Playwright Chromium. Item 3: t4/work at 236173c (after WO-4.47's c5bec3d and WO-4.48's 75c644e), npm run lint, npm test (150/150), npm run build against the live CRM (deploy d3de16c; caches refreshed as bf71dfc), vite preview on localhost:4174 read with the repo's Playwright Chromium; each social URL probed with curl -L from this machine on 2026-10-19 ~22:55 UTC. No deployed preview exists for this site. Production (www.pennjets.com) still serves ee43b0b; nothing here is deployed."
date: 2026-10-19
status: reported
---

# WO-4.46 report: site copy and links — tagline, hero heading, social links, placeholder sweep

**All four items done.** Items 1, 2 and 4 went in as `870dfe3` while
item 3 waited on the URLs; the "URLs from Joseph" block landed on the
order at ~22:10 UTC and item 3 went in as `236173c` (section 3, updated
below). Item 5: the pages Joseph looks at are listed at the end.

## Commit

`870dfe3` on `t4/work`, pushed. One file, two lines:

```
$ git show --stat --format= 870dfe3
 src/components/pages/Home/Home.jsx | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)

-                Access, You Deserve
+                The Access You Deserve
-              <p>PennJets LLC — Private aviation. Simplified. Monetized.</p>
+              <p>PennJets LLC — Private aviation. Simplified.</p>
```

Routine, done without asking: `git fetch`, `git merge --ff-only origin/main`
into `t4/work` (`9f7f01e` → `ee43b0b`, fast-forward), `npm ci`.

**Item 3, second commit**: `236173c` on `t4/work`, pushed.

```
$ git show --stat --format= 236173c
 docs/reports/t4/wo-4.46-footer-social-1440.png | Bin 0 -> 86280 bytes
 src/components/layout/Footer/Footer.jsx        |  31 ++++------------------
 2 files changed, 4 insertions(+), 27 deletions(-)
```

Before it, its own commit as on every order: `bf71dfc`, the routine
refresh of the two CRM caches made by this build (2 bodies refetched
because they changed in the CRM since `a4915fc`).

## 1. The tagline

Before, the whole repository (`src`, `index.html`, `public`, `scripts`,
`docs`), case-insensitive:

```
$ grep -rni "monetiz" src index.html public scripts docs
src/components/pages/Home/Home.jsx:223:              <p>PennJets LLC — Private aviation. Simplified. Monetized.</p>
docs/SITE-AUDIT-2026-09-19.md:473:- `Home.jsx:279 PennJets LLC — Private aviation. Simplified. Monetized.`
```

After:

```
$ grep -rni "monetiz" src index.html public scripts docs
docs/SITE-AUDIT-2026-09-19.md:473:- `Home.jsx:279 PennJets LLC — Private aviation. Simplified. Monetized.`
```

Only the audit document, which stays by the order. Files touched:
`src/components/pages/Home/Home.jsx` only. The built page:

```
$ grep -c "Monetiz" dist/index.html
0
$ grep -o "Private aviation. Simplified\.[^<]*" dist/index.html
Private aviation. Simplified.
```

## 2. The hero heading

```
$ grep -rn "Deserve" src index.html public scripts
src/components/pages/Home/Home.jsx:151:                The Access You Deserve
```

The `<title>` and `og:title` for `/` come from `src/seo/siteMeta.js`
(`DEFAULT_TITLE = 'PennJets | Private Jet Brokerage & Aviation Consulting'`)
and never carried the hero string; no test asserts it
(`grep -rn "Deserve" src --include=*.test.*` is empty). Nothing else
changed. The built page carries it:

```
$ grep -o "The Access You Deserve" dist/index.html
The Access You Deserve
```

## 3. Social links — done, `236173c`

The "URLs from Joseph" block (2026-10-19 ~22:10 UTC) is on the order on
`origin/main` `82844fe`. `Footer.jsx`'s Social column is now exactly
those four, trailing slashes as given; "X (Twitter)" is "X" and points at
`x.com`; the dead `socialLinks` array (was `:66-70`) and the branch
that rendered it (`{socialLinks.length > 0 && ...}`, a grey square per
entry, never shown) are deleted. No other file references either.

```
-        { name: 'Instagram', href: 'https://instagram.com/pennjets', external: true, iconKey: 'instagram' },
-        { name: 'Facebook', href: 'https://facebook.com/pennjets', external: true, iconKey: 'facebook' },
-        { name: 'LinkedIn', href: 'https://linkedin.com/pennjets', external: true, iconKey: 'linkedin' },
-        { name: 'X (Twitter)', href: 'https://twitter.com/pennjets', external: true, iconKey: 'twitter' },
+        { name: 'Instagram', href: 'https://www.instagram.com/pennjets/', external: true, iconKey: 'instagram' },
+        { name: 'Facebook', href: 'https://www.facebook.com/pennjets', external: true, iconKey: 'facebook' },
+        { name: 'LinkedIn', href: 'https://www.linkedin.com/company/penn-jets-llc/', external: true, iconKey: 'linkedin' },
+        { name: 'X', href: 'https://x.com/pennjets', external: true, iconKey: 'twitter' },
```

(`iconKey: 'twitter'` is the map key for the `FaXTwitter` glyph, the X
logo; the visible name is "X".)

### The four probes, 2026-10-19 ~22:55 UTC, from this machine

The order's exact command, pasted with its result:

```
$ curl -sS -o /dev/null -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128" -w "%{http_code} %{url_effective}\n" https://www.linkedin.com/company/penn-jets-llc/
200 https://www.linkedin.com/company/penn-jets-llc/
$ curl -sS -o /dev/null -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128" -w "%{http_code} %{url_effective}\n" https://www.facebook.com/pennjets
200 https://www.facebook.com/pennjets
$ curl -sS -o /dev/null -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128" -w "%{http_code} %{url_effective}\n" https://www.instagram.com/pennjets/
200 https://www.instagram.com/pennjets/
$ curl -sS -o /dev/null -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128" -w "%{http_code} %{url_effective}\n" https://x.com/pennjets
200 https://x.com/pennjets
```

All four: 200, and the final URL is the URL itself (no login, search or
home-page redirect). Because the order says a bare 200 is not enough on
these platforms, the `<title>` of each response (same user agent):

| Link | `<title>` of the 200 | Proves a Penn Jets page? |
|---|---|---|
| LinkedIn | `Penn Jets LLC \| LinkedIn` | yes |
| Facebook | `Penn Jets` | yes. Facebook answered this curl 200 with the page, not the 400 login bounce the lead saw at ~22:20; either way the lead's browser read (40 followers, the Charter Demand post pinned) is on the order. |
| Instagram | `Penn Jets (@pennjets) • Instagram photos and videos` | yes. A control, `https://www.instagram.com/pennjets-no-such-profile-zz/`, also answered `200` from here with title `Instagram`, so on Instagram the title is the proof, not the status. |
| X | `Joseph Pennella (@pennjets) / X` | yes: the `@pennjets` handle. The display name is "Joseph Pennella", as the lead already noted for Joseph. |

**All four ship; nothing removed.**

### Rendered

Built at `236173c` (build exit 0, below), `vite preview --port 4174`,
the repo's Playwright Chromium at 1440 wide, nothing stubbed. The
footer's Social column on `/`, read from the DOM:

```
Instagram -> https://www.instagram.com/pennjets/            target=_blank rel="noopener noreferrer" icon
Facebook  -> https://www.facebook.com/pennjets               target=_blank rel="noopener noreferrer" icon
LinkedIn  -> https://www.linkedin.com/company/penn-jets-llc/ target=_blank rel="noopener noreferrer" icon
X         -> https://x.com/pennjets                          target=_blank rel="noopener noreferrer" icon
```

Capture: `wo-4.46-footer-social-1440.png`. In the prerendered output all
32 HTML files carry the new LinkedIn URL and none carries
`twitter.com`, `linkedin.com/pennjets` or the bare `instagram.com` /
`facebook.com` hosts:

```
$ grep -l "company/penn-jets-llc" dist/*.html dist/*/*.html dist/*/*/*.html | wc -l
32
$ grep -l "twitter.com/pennjets\|linkedin.com/pennjets\|https://instagram.com\|https://facebook.com" dist/*.html dist/**/*.html
(nothing)
```

### Build, lint, tests for item 3

```
$ npm run lint             (exit 0, 0 warnings)
$ npm test                 Test Files 10 passed (10)   Tests 150 passed (150)
$ npm run build            (exit 0)
✓ built in 6.99s
[postbuild] wrote data/market-notes.json: 16 note(s), 16,864 bytes
[postbuild] article bodies: 14 from cache, 2 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
[postbuild] wrote 32 HTML files (16 Market Notes) and sitemap.xml with 31 URLs
[prerender] 32 of 32 routes rendered in 110.9s, 174,163 characters of body text added
[prerender] 16 view beacon(s) intercepted; none reached the CRM.
```

(150 tests, not WO-4.48's 146: `NoteBody.test.js` iterates the article
cache, which gained bodies in `a4915fc`.) Two builders: when this build
ran the other node processes were T1's, T2's and T3's vitest runs and an
`npm ci`, no build; the site build ran alone in this checkout. The
preview was stopped before this report was written.

## 4. Placeholder sweep — report only, nothing fixed

Grep over `src`, `index.html`, `public` (text files: `404.html`,
`robots.txt`), `scripts`, case-insensitive, for every term in the order
(`ImagePerson`, `lorem`, `TODO`, `FIXME`, `Coming soon`, `TBD`,
`placeholder` as text, `would go here`, `sample`, `mock`, `href="#"`,
`to="#"`, `/api/placeholder`).

| # | File:line | What | Can a visitor see it? | Recommendation |
|---|---|---|---|---|
| 1 | `src/components/pages/PennShare/PennShare.jsx:208` and `:252` | `onError={(e) => { e.target.src = '/api/placeholder/600/400'; }}` (and `/400/200`) on the two Premier 1A images | Only if `/images/PENNSHARE/PREMIER-1A.jpg` fails to load. The file is in the repo (118 KB) and loads in the preview, so today no. If it ever failed, the fallback URL is a 404 on GitHub Pages: a broken image either way. | Delete both `onError` handlers (two lines each). |
| 2 | `src/components/pages/PennShare/PennShare.jsx:115`, `:245`, `:259` | `navigate('/aircraft/3')` behind "View Aircraft Details", the interior-image click and "View Complete Details" | **Yes.** Since WO-4.43 the detail route reads the CRM by slug and `AircraftDetail.jsx:11` says "a numeric id is just a slug that matches nothing", so all three buttons land on the detail page's not-found state. Functionally `href="#"`. | Point the three at `/contact` (the PennShare inquiry form is on the same page; `#inquire` would be shorter still) or remove them until a PennShare listing exists in the CRM. Joseph's call: the Premier 1A is not a CRM listing. |
| 3 | `index.html:6` | `<meta name="description" content="PennJets - Premier aviation brokerage services. Find and sell private jets, aircraft management, and charter services.">` | Not on any built page: `postbuild.mjs` writes every route's description from `siteMeta.js`, and `dist/index.html` carries "Independent aircraft brokerage and consulting…" (`grep -c "aircraft management" dist/index.html` → 0). It is the fallback a crawler would see only if the build step were skipped. | Replace with `DEFAULT_DESCRIPTION` from `siteMeta.js` so the two never disagree, and so "aircraft management" (not sold) is gone from the source. One line. |
| 4 | `index.html:15` | `<title>PennJets - Premier Aviation Brokerage</title>` | Same as row 3: postbuild overwrites it per route. The source fallback differs from `DEFAULT_TITLE`. | Same fix as row 3, same line count. Not a placeholder in the order's sense; listed because row 3 was. |
| 5 | `src/components/layout/Footer/Footer.jsx:66-70` | The commented-out `socialLinks` array ("Social media links will be added when accounts are set up") | No, dead code. | Deleted in `236173c` (item 3). |

Excluded, one line each: `*.test.jsx` hits (the AircraftListing test names
"no placeholder"); comments that explain an absence
(`AircraftListing.jsx:18`, `Home/Inventory.jsx:10` and `:12`,
`AircraftDetail.jsx:124`, `services/inventoryApi.js:53`); the input
`placeholder=` attribute and the comment about it at `Charter.jsx:145`;
`docs/`; binary matches in `public/images` and `public/videos` (JPEG/MP4
bytes that happen to contain "sample" or "mock"). No `lorem`, `TODO`,
`FIXME`, `Coming soon`, `TBD`, `ImagePerson`, `would go here`, `href="#"`
or `to="#"` anywhere in site-facing source.

## 5. Where Joseph looks

Built on `t4/work` `870dfe3`, served by `vite preview --port 4174` (stopped
before this report was written). The same list applies to the lead's
isolated build.

| Page | What to look at | Capture |
|---|---|---|
| `http://localhost:4174/` | the hero `<h1>` "The Access You Deserve" | `wo-4.46-home-hero-1440.png` |
| `http://localhost:4174/` scrolled to the bottom | the closing block "PennJets LLC — Private aviation. Simplified." and, below it, the footer's Social column (captured before item 3; the links then still read "X (Twitter)") | `wo-4.46-home-closing-footer-1440.png`, `wo-4.46-home-full-1440.png` |
| any page, the footer's Social column | the four links Instagram, Facebook, LinkedIn, X, each opening the Penn Jets profile in a new tab (item 3, `236173c`) | `wo-4.46-footer-social-1440.png` |
| `http://localhost:4174/pennshare` | sweep row 2: the three "View … Details" controls and the Premier 1A images (row 1) | `wo-4.46-pennshare-full-1440.png` |

Rows 3 and 4 of the sweep are not visitor-visible; nothing to look at.

## Build

```
$ npm run build            (exit 0)
✓ built in 4.08s
[postbuild] CRM UNREACHABLE (CRM list returned 500).
[postbuild] Falling back to 12 cached post(s) from scripts/crm-posts.cache.json.
[postbuild] inventory: 0 listing(s) from the committed cache (inventory route: HTTP 500)
[postbuild] wrote 28 HTML files (12 Market Notes, FROM CACHE) and sitemap.xml with 27 URLs
[prerender] 28 of 28 routes rendered in 39.4s, 145,624 characters of body text added
[prerender] 12 view beacon(s) intercepted; none reached the CRM.
[prerender] 12 article fetch(es) answered from cache; none reached the CRM, so none wrote a ContentAnalytics row.
[prerender] 15 note-list read(s) answered from scripts/crm-posts.cache.json; none reached the CRM.
[prerender] 2 inventory read(s) answered from scripts/crm-inventory.cache.json (0 listing(s)); none reached the CRM.
```

Both cache files are unchanged by this build (`git status` shows only
`Home.jsx`). No node process other than mine was running when the build
started; the lead's `tsx` processes in the CRM checkout appeared later and
were not touched.

```
$ npm run lint             (exit 0, 0 warnings)
> eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0
```

## Tests

```
$ npm test
 Test Files  7 passed (7)
      Tests  118 passed (118)
   Duration  31.68s
```

No test file touched.

## Scope

`src/components/pages/Home/Home.jsx` (`870dfe3`),
`src/components/layout/Footer/Footer.jsx` (`236173c`), the routine cache
refresh (`bf71dfc`), and this report with its five PNGs under
`docs/reports/t4/`. Only the site repository. Five untracked files
under `public/images/Gallery/` (`Aviation_Fuel_Tanks.jpg`, `JetA_hero.txt`,
`ebace-static-display-hero.jpg`, `jet-a-tanks-hero.jpg`,
`pc12-charter-hero.jpg`, dated 2026-10-12 and later, one of them arriving
during this session) are not mine and are not staged.

## Known gaps

- **Item 3 is done** (`236173c`); the earlier version of this report
  said it waited on the URLs. The probes and the render are in section 3.
- Facebook answered my curl 200 where the lead's answered 400 at ~22:20
  UTC; Facebook varies this by client and time. Both reads agree the page
  is the Penn Jets page.
- **The CRM's public routes answer 500 on production right now**, not
  caused by anything here:
  ```
  $ curl -sS -o /dev/null -w "%{http_code} %{url_effective}\n" https://www.pennforce.pennjets.com/api/public/blog?limit=1
  500 https://www.pennforce.pennjets.com/api/public/blog?limit=1
  $ curl -sS -o /dev/null -w "%{http_code} %{url_effective}\n" https://www.pennforce.pennjets.com/api/public/inventory
  500 https://www.pennforce.pennjets.com/api/public/inventory
  ```
  The build fell back to the committed caches, so the Market Notes in
  `dist/` are as of the last successful fetch. For the lead: the next
  Pages build, scheduled or dispatched, will do the same until the routes
  recover.
- The captures are of `localhost:4174`, not a deployed preview; the site
  has none, and the lead's isolated build is the evidence Joseph sees.
- Headless Chrome's `--screenshot` cannot scroll, so the closing-block
  capture came from the repo's Playwright Chromium (the prerenderer's)
  against the same preview.
