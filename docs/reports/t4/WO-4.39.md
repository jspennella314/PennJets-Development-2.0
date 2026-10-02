---
wo: WO-4.39
terminal: T4
branch: t4/work
commit: 30c39c7
tested_against: "local checkout of t4/work at 30c39c7: node src/seo/siteMeta.image-host-test.mjs (Node 22.19.0); npm run build (dist/ prerendered by the build's Playwright Chromium; list from the production CRM, bodies from scripts/crm-articles.cache.json), compared page by page with the build of aa6383a; a scratchpad copy of postbuild.mjs run against a posts fixture. No deploy: the site deploys only from main."
date: 2026-10-02
status: reported
---

# WO-4.39 report: the CRM's Vercel Blob store is an allowed image host, and only that host

## Commit

`30c39c7` on `t4/work`, pushed.

```
$ git show --stat --format= 30c39c7
 src/seo/siteMeta.image-host-test.mjs | 62 ++++++++++++++++++++++++++++++++++++
 src/seo/siteMeta.js                  | 22 ++++++++++---
```

Also on the branch, as its own commit: `be4da28`, the routine refresh of
`scripts/crm-articles.cache.json` that the baseline build made (see
"Build", below).

## 1. The diff

```diff
-// Images are served from this site only. A note's featuredImage is set in the
-// CRM and can point anywhere; hotlinking a third party's image ships something
-// we hold no licence for, so the site refuses to render it. Relative paths are
-// ours by definition.
-const ALLOWED_IMAGE_HOSTS = new Set(['www.pennjets.com', 'pennjets.com']);
+// Images are served from this site, or from the CRM's own image store. A note's
+// featuredImage is set in the CRM and can point anywhere; hotlinking a third
+// party's image ships something we hold no licence for, so the site refuses to
+// render it. Relative paths are ours by definition.
+//
+// The third host is the CRM's Vercel Blob store, where an image uploaded from
+// the CMS editor lives (WO-1.22). It is ours, not a third party's: the upload
+// route is the CRM's, and the licence is recorded on upload in the note's four
+// attribution fields. It is the one store, named exactly, confirmed by the
+// lead from the store's stored URLs and the Blob token's store id. Not
+// `*.vercel-storage.com` and no suffix match: another store on that domain is
+// someone else's. WO-4.39.
+const ALLOWED_IMAGE_HOSTS = new Set([
+  'www.pennjets.com',
+  'pennjets.com',
+  'algxvqsvihyabn9r.public.blob.vercel-storage.com',
+]);
```

`isAllowedImage` is unchanged: still `ALLOWED_IMAGE_HOSTS.has(new
URL(src).host.toLowerCase())` (`src/seo/siteMeta.js:119`), an exact match
on the whole host. `URL.host` includes a port, so
`algxvqsvihyabn9r.public.blob.vercel-storage.com:8443` is refused too.

## 2. Every surface uses the gate as it is

Every place a note's image reaches the page goes through `safeImage()` or
`articleMeta().image`, both of which call `isAllowedImage()`. No surface
has a host list of its own, so none needed a change:

| Surface | Where | Gate |
|---|---|---|
| Hero | `src/components/pages/Blog/BlogArticle.jsx:130` `const heroImage = safeImage(article.featuredImage)` | `safeImage` |
| Index card | `src/components/pages/Blog/BlogList.jsx:189` (render guard) and `:192` (`src`) | `safeImage` |
| Related-notes thumbnails | `src/components/pages/Blog/BlogArticle.jsx:434` (guard) and `:436` (`src`) | `safeImage` |
| Home "latest note" card | `src/components/pages/Home/LatestNote.jsx:30` `const thumb = safeImage(note.featuredImage)` | `safeImage` |
| …and its credit line | `LatestNote.jsx:31` `const credit = thumb ? imageCreditContent(...) : null` — the credit renders only when the thumb does, so a blob image now gets its credit too | via `thumb` |
| Client `og:image`, `twitter:image`, JSON-LD `image` | `BlogArticle.jsx:122` `articleMeta(article)` → `:149`, `:153`, `:164` | `siteMeta.js:145` `absoluteImage(safeImage(post.featuredImage))` |
| Prerendered `og:image` / JSON-LD | `scripts/postbuild.mjs:241` `articleMeta(post)` → `:242` `resolvePreviewImage(a.image)` | same `articleMeta` |

`PageMeta.jsx` (the static routes' head) never reads a note image: it
uses `ROUTES[*].image || DEFAULT_IMAGE`, and no route sets one.

## 3. `scripts/postbuild.mjs`: no change needed

- **`blockedImages`** (`:238`) is `post.featuredImage &&
  !isAllowedImage(post.featuredImage)`, the same gate, so a blob-hosted
  image is not listed once the host is allowed.
- **`resolvePreviewImage`** (`:228-229`): `if (!url ||
  !url.startsWith(SITE_URL + '/')) return url || SITE_URL +
  DEFAULT_IMAGE;` — an absolute URL that is not on the site passes through
  unchanged. Its `public/` existence check applies only to the site's own
  images. So the prerendered `og:image` for a blob-hosted note is the blob
  URL, as the order expects.

Proved with a fixture rather than asserted: a scratchpad copy of
`postbuild.mjs` + the new `siteMeta.js`, pointed at an unreachable CRM so
it fell back to a posts cache in which one note's `featuredImage` was set
to the blob fixture and another's to the look-alike host:

```
fixture: why-we-publish-market-notes -> https://algxvqsvihyabn9r.public.blob.vercel-storage.com/blog/test/x.jpg
fixture: pilatus-pc-12-ngx-… -> https://evil.public.blob.vercel-storage.com/blog/test/x.jpg

[postbuild] 2 note image(s) hotlinked from another site and were not used:
  pilatus-pc-12-ngx-a-modern-look-at-the-most-capable-turboprop-in-the-sky: https://evil.public.blob.vercel-storage.com/blog/test/x.jpg
  september-11-and-the-evolution-of-private-aviation: https://wallpaperaccess.com/full/4568461.jpg
postbuild exit 0

dist/blog/why-we-publish-market-notes.html:
  <meta data-rh="true" property="og:image" content="https://algxvqsvihyabn9r.public.blob.vercel-storage.com/blog/test/x.jpg"
  "image":"https://algxvqsvihyabn9r.public.blob.vercel-storage.com/blog/test/x.jpg"      (JSON-LD)
dist/blog/pilatus-pc-12-ngx-….html:
  <meta data-rh="true" property="og:image" content="https://www.pennjets.com/images/og-card.png"
```

The blob note is not in `blockedImages` and its `og:image` is the blob
URL; the look-alike host is blocked and falls back to the default card.
(The fixture ran over an already-prerendered `dist`, so each file also
carried the earlier build's head tags, and its empty `public/` produced
"not in this repo" warnings for the site's own images. Both are artefacts
of the fixture, not of the code.)

The warning text "hotlinked from another site" still describes what the
list holds. Left as is.

## 4. The gate's accept and refuse cases

`node src/seo/siteMeta.image-host-test.mjs`, beside `siteMeta.js` the way
WO-4.38's test sits beside `NoteBody.jsx`. A plain node script against
the real module (no dependency, no runner); exit 1 on any failure.

```
--- accept: the CRM's own Blob store, named exactly
PASS  isAllowedImage(blob)
PASS  safeImage(blob) returns the URL unchanged
PASS  articleMeta(post).image (og:image) is the blob URL
PASS  host match is case-insensitive
PASS  the store with a query string
--- accept: the site's own hosts, as before
PASS  www.pennjets.com
PASS  pennjets.com
PASS  a relative path
--- refuse: the same path on a host that is not the store
PASS  another store on the same domain                      (evil.public.blob.vercel-storage.com)
PASS    safeImage -> null
PASS    og:image falls back to the default card
PASS  our store id as a prefix of someone else's host       (algxvqsvihyabn9r.public.blob.vercel-storage.com.evil.com)
PASS    safeImage -> null
PASS    og:image falls back to the default card
PASS  the bare domain
PASS  the domain apex
PASS  our store id on a different port
PASS  our store id with credentials in front
PASS  our store id in the path only
PASS  a third party (the one live case today)
PASS  not a URL
PASS  empty
PASS  null

all passed
exit 0
```

## Build

Two builds in my own checkout, before (`aa6383a`, the branch head at the
start of the session) and after (`30c39c7`):

```
$ npm run build            (at 30c39c7)
build exit 0
  dist/assets/index-b2c95757.css   49.98 kB │ gzip:   8.10 kB
  dist/assets/index-c72d35c1.js   394.22 kB │ gzip: 115.16 kB
  [postbuild] article bodies: 11 from cache, 0 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
  [postbuild] wrote 27 HTML files (11 Market Notes) and sitemap.xml with 26 URLs
  [postbuild] 1 note image(s) hotlinked from another site and were not used:
    september-11-and-the-evolution-of-private-aviation: https://wallpaperaccess.com/full/4568461.jpg
  [postbuild] 2 note image(s) not in this repo; social preview fell back to the default:
    /images/Gallery/Bombardier_Challenger_650.jpg
    /images/Gallery/gulfstream.jpg
  [prerender] 27 of 27 routes rendered in 40.7s, 138,056 characters of body text added
  [prerender] 11 view beacon(s) intercepted; none reached the CRM.
  [prerender] 11 article fetch(es) answered from cache; none reached the CRM, so none wrote a ContentAnalytics row.
  [prerender] 14 note-list read(s) answered from scripts/crm-posts.cache.json; none reached the CRM.

$ npm run lint
> eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0
lint exit 0
```

- **`[postbuild]` reports no newly blocked image**: the same one
  hotlinked image (wallpaperaccess.com, the September 11 note) and the
  same two missing files as the baseline build. Both warnings predate this
  order.
- **Every prerendered page is identical to the previous build**, with the
  countdown digits, the content-hashed asset names and the sitemap's
  `lastmod` masked (the WO-4.38 method):

```
pages: 29, identical: 29, differ: 0        (27 HTML + 404.html + sitemap.xml)
```

The bundle grows 50 bytes (394.17 → 394.22 kB), the one string.

**The baseline build refetched 10 article bodies** (`[postbuild] article
bodies: 1 from cache, 10 fetched`). That is `MAX_AGE_MS` (7 days) doing
its job: those bodies were fetched on 2026-09-23 and the Q3 2026 note on
2026-09-29. It wrote 10 `ContentAnalytics` rows, which is the documented
cost of the backstop. Five bodies differ from the cached copy only in
that the CRM now serialises a bare `&` as `&amp;` (light-jet, PC-12,
first-jet guide, Q3 2025, charter vs ownership); no `updatedAt` moved and
no rendered text changes. Committed as `be4da28`, like `c2ba93b` and
`687c696` before it. For the lead, not an action: a CRM-side change to
the body serialisation does not move `updatedAt`, so the site sees it
only at the 7-day backstop. Harmless here (same rendered text), noted
because the WO-4.32 comment says there is no such path today.

## Scope

As ordered: `src/seo/siteMeta.js` and the check script beside it.
`scripts/postbuild.mjs` needed no change. Plus the routine cache refresh
in its own commit. Only this repository touched; nothing in the CRM repo
was written.

## Known gaps

1. **No note uses the host yet**, so the production evidence (a real
   blob-hosted note rendering on all five surfaces) waits for T1's
   WO-1.22 to upload one. The fixture and the gate test are the evidence
   until then.
2. **The check script is not run by `npm run build` or `npm run lint`**;
   same gap as WO-4.38, same reason (no test runner, and adding one is
   the lead's call).
3. **The test's `articleMeta` fixture** uses a minimal post object; the
   real list carries more fields, none of which `articleMeta` reads for
   the image.
