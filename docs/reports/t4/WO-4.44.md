---
wo: WO-4.44
terminal: T4
branch: t4/work
commit: 673e3f7
tested_against: "local checkout of t4/work at 673e3f7 (on top of main 448b280), Node 22.19.0: npm test (vitest 3.2.7); npm run build twice (baseline at 448b280 with a clean tree, then at 673e3f7), list and inventory from the production CRM, bodies from scripts/crm-articles.cache.json, dist/ prerendered by the build's Playwright Chromium, compared page by page; npm run lint. Production list route checked live (featuredImageSocial present, null on every note)."
date: 2026-10-06
status: reported
---

# WO-4.44 report: `og:image` prefers the CRM's 1200×630 social crop

## Commit

`673e3f7` on `t4/work`, pushed.

```
$ git show --stat --format= 673e3f7
 src/seo/siteMeta.js      |  9 ++++++++-
 src/seo/siteMeta.test.js | 25 +++++++++++++++++++++++++
```

Also on the branch as its own commit, `670ffa1`: the routine refresh of
the two CRM caches made by the baseline build (below).

Routine, done without asking: `git fetch`, `git merge --ff-only
origin/main` into `t4/work` (`e95dade` → `448b280`, Joseph's PR #11),
`git fetch origin main:main`, `npm ci`.

## 1. The diff

```diff
-    image: absoluteImage(safeImage(post.featuredImage)),
+    // The link-preview image prefers the CRM's 1200x630 social crop
+    // (`featuredImageSocial`, WO-1.30: the social.webp stored beside every
+    // editor upload; null for Gallery URLs and older uploads), then the
+    // article image. Both go through the same host gate, so an off-host
+    // social URL falls back to the article image, and both off-host falls
+    // back to the default card. The article's own <img> keeps featuredImage;
+    // the crop is for previews only. WO-4.44.
+    image: absoluteImage(safeImage(post.featuredImageSocial) ?? safeImage(post.featuredImage)),
```

`safeImage` returns `null` for anything the host gate refuses (and for
`null`/`undefined`), so `??` is the whole fallback chain. The host list
is unchanged: the social URL lives on the same blob store WO-4.39
allowed. `articleMeta` feeds `og:image`, `twitter:image` and the JSON-LD
`image` on the client (`BlogArticle.jsx:149/153/164`) and in the
prerendered head (`postbuild.mjs:241`), so all three follow.

## 2. The article `<img>` keeps `featuredImage`

Untouched: `BlogArticle.jsx:130` `safeImage(article.featuredImage)`, and
the index card, related thumbnails and home card likewise read
`featuredImage`. Nothing on the page shows the crop.

## 3. The caches: a refresh, not a shape change

- **`scripts/crm-posts.cache.json`** is the list route's rows minus
  `viewCount`/`leadCount`, written whole on every successful build. The
  baseline build picked the field up on its own: all 12 rows now carry
  `featuredImageSocial` (12 of 12 `null`). No code change.
- **`scripts/crm-articles.cache.json`** holds each body as the article
  route returned it, and a body is refetched when its fingerprint moves
  or after 7 days. Two rows carry the field now (the new note, fetched
  fresh; the Q3 2026 note, refetched at the 7-day backstop with the same
  fingerprint); the other ten were fetched on 2026-10-02 and gain it as
  they refresh. Until then `articleMeta` sees no `featuredImageSocial`
  on those posts and `??` falls back to `featuredImage`, which is the
  same result as `null`. The fingerprint does not need the new field:
  `featuredImageSocial` is derived by the CRM from `featuredImage`'s
  path (`siblingUrl(post.featuredImage, 'social.webp')`,
  `app/api/public/blog/route.ts:128`), so a note cannot gain a social
  crop without `featuredImage` changing, and `featuredImage` is already
  in the fingerprint.
- **`scripts/prerender.mjs`** serves both caches as they are; no change.

Committed as `670ffa1`. That refresh also brought in a **twelfth note**
published 2026-10-06 01:48 UTC,
`the-largest-managed-fleet-in-the-world-just-closed-what-it-means-for-owners`,
whose `featuredImage` is on the blob store — **the first live WO-4.39
case**. Its prerendered `og:image` is the blob URL:

```
dist/blog/the-largest-managed-fleet-….html
  <meta property="og:image" content="https://algxvqsvihyabn9r.public.blob.vercel-storage.com/blog/cmh8ap9bu0000vs6csd5mwq0r/IMG_2736-….jpg">
```

and `[postbuild]` lists it under neither "hotlinked" nor "not in this
repo". Its `featuredImageSocial` is `null` (the upload predates WO-1.30's
folder shape), so this order changes nothing for it yet.

## 4. The contract paragraph (for the lead, `docs/integration/PENNJETS-SITE.md`)

Under §2 (the blog routes), after the `featuredImage` sentence:

> **`featuredImageSocial`** (WO-1.30, 2026-10-06): the URL of the
> 1200×630 centre-cropped `social.webp` stored beside an editor upload,
> or `null` when the note's image is not in that shape (a Gallery URL
> on pennjets.com, or an upload from before WO-1.30). Both list and
> article routes send it. The site uses it for `og:image`,
> `twitter:image` and the JSON-LD `image` only, preferring it over
> `featuredImage` when its host is the allowed blob store, and never
> for the article's own image (WO-4.44). An off-host value is ignored
> like any other off-host image.

## Evidence

### `npm test` — 8 new cases (the order's four, plus edges); the suite is 118

```
 ✓ og:image prefers the social crop (featuredImageSocial, WO-4.44)
   a social URL on the store -> og:image is the social crop
   social null (every current note) -> og:image is featuredImage
   social absent from the post (an older cache row) -> featuredImage
   an off-host social URL -> featuredImage (the host rule)
   both off-host -> the default card
   social on the store, featuredImage off-host -> still the social crop
   a relative social path is made absolute like any site image
   no image at all -> the default card

 Test Files  7 passed (7)
      Tests  118 passed (118)
```

`npm run lint` exit 0.

### Build

Baseline at `448b280` (clean tree, before any edit), then `673e3f7`.
Checked for other terminals' builds before each (none; another
terminal's `npm ci` was running at the start, not a build).

```
baseline (448b280)                                            after (673e3f7)
  dist/assets/index-3faf9bb1.js   388.26 kB │ gzip: 114.04 kB   index-2c6998a2.js   388.29 kB │ gzip: 114.05 kB
  [postbuild] inventory: 0 listing(s) from the CRM               (same — the route is live now: 200 {listings: []}, not 404)
  [postbuild] article bodies: 10 from cache, 2 fetched           12 from cache, 0 fetched
  [postbuild] wrote 28 HTML files (12 Market Notes) and sitemap.xml with 27 URLs   (same)
  [postbuild] 1 hotlinked (september-11, wallpaperaccess.com); 2 not in this repo (Challenger_650, gulfstream)   (same, as before)
  [prerender] 28 of 28 routes rendered, 145,631 characters      (same)
  [prerender] 12 beacons intercepted; 12 article fetches, 15 list reads, 2 inventory reads from cache; none reached the CRM.

pages: 30, identical: 30, differ: 0        (28 HTML + 404.html + sitemap.xml; countdown digits, asset hashes, sitemap lastmod masked)
```

**No page differs**, as the order expects: no note has a social variant
today, so every `og:image` is what it was. The 30 bytes of bundle growth
are the one `??` branch.

Two things the baseline build showed that are not mine:
- the inventory route **is live** (`200 { "listings": [] }` — WO-3.39
  must have merged since yesterday), so `[postbuild] inventory: 0
  listing(s) from the CRM` and the 404 warning is gone;
- the baseline's two article fetches wrote two `ContentAnalytics` rows
  (the new note's first fetch, and the Q3 note's 7-day refetch).

## Scope

As ordered: `src/seo/siteMeta.js` and its test. The prerender needed no
change; the caches refreshed themselves. Only this repository touched;
the CRM's route and tests were read (`app/api/public/blog/route.ts`,
`[slug]/route.ts`) and not changed.

## Known gaps

1. **No note with a social crop exists yet**, so the preferred branch is
   exercised by the tests only. The first editor upload after WO-1.30
   gives a `social.webp`; its prerendered `og:image` after the next build
   is the live check.
2. **Ten cached article bodies lack the field** until their 7-day
   refresh (by 2026-10-09) or an edit; harmless (section 3).
3. **An untracked file in the checkout, not mine, untouched:**
   `public/images/Gallery/Snow-and-Ice-Removal_Supplemental-Application-SIGNED.pdf`
   — like the PDF found on 2026-10-02, a signed document sitting in the
   image gallery folder. Not in any commit. Joseph or the lead should
   move it out of the repository folder before someone commits it; Vite
   would ship it.
