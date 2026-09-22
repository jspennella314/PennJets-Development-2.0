---
wo: WO-4.27
terminal: T4
branch: t4/work
commit: e303c89
tested_against: "site: npm run build at e303c89 on this machine (Node v22.19.0, exit 0, 26 of 26 routes prerendered). CRM: production www.pennforce.pennjets.com, which served imageAttribution on both public routes on 2026-09-22 ~23:00 UTC (detail route x-vercel-id iad1::g9r5t-1790118484792-829db391163d; WO-1.18 is 882a007 on CRM main, the deploy id is the lead's to name). The credited render is from a FIXTURE body, not production data: no note has its attribution filled yet. See Known gaps."
date: 2026-09-22
status: reported — built and evidenced against a fixture; the real credited note waits on Joseph filling the fields
---

# WO-4.27 report — the image credit under the featured image

The line renders from the object, both links are real, `null` renders no
element, the fingerprint sees the four raw fields, and the cached bodies
carry `imageAttribution`. What I could not show is the line on tonight's
note with Joseph's data, because the four fields are still null on every
note in production, including that one. The render below uses the order's
example object injected into the cached body for that note, and says so.

## Commit

`e303c89` WO-4.27: the image credit under the featured image, with the
license linked. On `t4/work`, pushed. Files: `BlogArticle.jsx`,
`blogApi.js`, `postbuild.mjs`, `crm-articles.cache.json`, and
`crm-posts.cache.json` (see Scope).

## What the CRM serves today

The list route, all ten posts, 2026-09-22 ~22:50 UTC: every post carries
`imageCredit`, `imageSourceUrl`, `imageLicense`, `imageModified` and
`imageAttribution`. Every value is `null` / `false` / `null`. Tonight's
note:

```
canadas-proposed-100-aircraft-expensing-… | featuredImage: https://www.pennjets.com/images/Gallery/Falcon900B_no_registration.jpg
  credit: null | src: null | lic: null | mod: false | imageAttribution: null
  body still carries the hand-written line: <p><strong>Photo: Duncan Kirk / Wikimedia Commons, CC BY 4.0 …
```

The detail route (one request, one `ContentAnalytics` row, `X-Vercel-Cache:
MISS`) returns the same five fields plus `contentHtml`. Its composition is
`imageAttribution(post)` at `app/api/public/blog/[slug]/route.ts:117`, the
same helper the list route calls, so both routes agree by construction.

## 1. `BlogArticle.jsx`

Directly under the hero's `aspect-[16/9]` container, inside the same
`heroImage &&` block:

```jsx
{/* One muted line under the image, or no element at all. */}
{imageCredit && (
  <p className="image-credit mt-2 text-xs text-gray-500">
    {imageCredit}
  </p>
)}
```

`imageCredit` is `imageCreditContent(article.imageAttribution)`, a small
function at the top of the file that builds the line from the object, never
from `line`:

- `Photo: ` then the credit, linked to `sourceUrl` when present and plain
  text otherwise;
- `, ` then the license label linked to `licenseUrl` with
  `rel="license noopener noreferrer"`;
- `.` then ` Modified from original.` when `modified`;
- external links open in a new tab (`target="_blank"`, `rel` carries
  `noopener noreferrer` on both).
- `null` returns `null`, and the guard above means no `<p>` is emitted at
  all. An object with no `credit` (not a shape the CRM produces) prints its
  `line` as text rather than assembling a wrong sentence; that is the
  text-only fallback.

**One reading to confirm.** The order's item 1 says "`. Modified from
original.` when `modified`". The CRM helper (`lib/blog/imageAttribution.ts`)
appends that sentence only inside its Creative Commons branch; for
`LICENSED_STOCK` it composes `Photo: {credit}.` and nothing else, modified or
not, and it names no license label for stock. I mirrored the helper rule
for rule, because the order's stated purpose is that the site prints the
same line every caption carries. If you would rather the site follow item
1 literally, that is one condition in `imageCreditContent`.

**One consequence to know.** The line lives inside the `heroImage` block,
so a note whose image `safeImage` refuses (a hotlink, as
`september-11-…` has today) shows neither the image nor a credit for it.
A credit for an image that is not on the page would be wrong; this is the
intended behaviour, not an omission.

## 2. `blogApi.js`

`transformPost` now returns `imageAttribution: post.imageAttribution ?? null`
explicitly, with a comment. The spread already carried it; the line makes
the contract visible. `safeImage` and `featuredImage` are untouched.

## 3. `postbuild.mjs` and the caches

The fingerprint gains the four raw fields:

```js
  p.featuredImage, p.publishedAt, p.keywords, p.author && p.author.name,
  // The four raw attribution fields (WO-1.18). The list carries them, and an
  // edit to any one changes the composed `imageAttribution` the cached body
  // holds, so that body is refetched now rather than after MAX_AGE. WO-4.27.
  p.imageCredit, p.imageSourceUrl, p.imageLicense, p.imageModified,
```

Because every fingerprint changed, the first build after this refetched
every body once. That is the one-time cost of the change; steady state is
zero rows again:

```
build 1 (23:10 UTC)  [postbuild] article bodies: 0 from cache, 9 fetched
build 2 (23:13 UTC)  [postbuild] article bodies: 9 from cache, 1 fetched
                     [postbuild] wrote 26 HTML files (10 Market Notes) and sitemap.xml with 25 URLs
                     [prerender] 26 of 26 routes rendered in 45.4s, 130,189 characters of body text added
                     [prerender] 10 view beacon(s) intercepted; none reached the CRM.
                     [prerender] 10 article fetch(es) answered from cache; none reached the CRM, so none wrote a ContentAnalytics row.
```

**Build 1 saw nine notes, not ten.** At 23:10:42 UTC the list returned
nine posts without tonight's note; by 23:11:49 UTC it returned ten with
that note first, under the build's exact query string and two others, all
`X-Vercel-Cache: MISS`, `Age: 0`. So the CRM itself answered nine for a
moment (an edit in flight, most likely; the CDN cannot explain a MISS). I
rebuilt rather than commit a cache with the note missing. Both committed
caches hold all ten; every cached body has the `imageAttribution` field
(`null` on all ten today), which is what the prerendered page will carry
once a value exists.

## 4. The line prerenders — evidence from a fixture

No production note has a credit, so to show the built HTML carrying one I
ran `vite build && postbuild` (10 from cache, 0 fetched), injected the
order's example object into the cached body of tonight's note with a
throwaway script, ran `prerender.mjs`, and then restored the cache from
git (`git status` clean). The fixture never touched the CRM and is not
committed. The built file
`dist/blog/canadas-proposed-100-aircraft-expensing-….html` then contains:

```html
<p class="image-credit mt-2 text-xs text-gray-500">Photo: <a href="https://commons.wikimedia.org/wiki/File:Dassault_Falcon_900B_fixture.jpg" target="_blank" rel="noopener noreferrer" class="underline decoration-gray-300 underline-offset-2 hover:text-gray-700">Duncan Kirk / Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="license noopener noreferrer" class="underline decoration-gray-300 underline-offset-2 hover:text-gray-700">CC BY 4.0</a>. Modified from original.</p>
```

`grep -l image-credit dist/blog/*.html` → exactly one file, that one. The
other nine built notes contain no `image-credit` element and no `Photo:`
text (the real build, before the fixture, had zero across all ten).

## UI evidence

Captured from the built output served statically with **JavaScript
disabled**, so the pixels are the prerendered HTML and the page fetched
nothing from the CRM (the only external requests were the four image
files). Playwright, Chromium 153:

```
[credited @1440]  p.image-credit elements: 1
  text: "Photo: Duncan Kirk / Wikimedia Commons, CC BY 4.0. Modified from original."
  link: {"text":"Duncan Kirk / Wikimedia Commons","href":"https://commons.wikimedia.org/wiki/File:Dassault_Falcon_900B_fixture.jpg","rel":"noopener noreferrer","target":"_blank"}
  link: {"text":"CC BY 4.0","href":"https://creativecommons.org/licenses/by/4.0/","rel":"license noopener noreferrer","target":"_blank"}
[credited @390]   p.image-credit elements: 1   (same text, same two links)
[null @1440]      the-state-of-the-private-jet-market-in-q3-2025: p.image-credit elements: 0
```

At 1440 the line sits flush-left under the rounded image, small and grey,
credit and license underlined. At 390 it wraps to two lines under the
image with the same styling. The null note shows the image and nothing
beneath it. The six PNGs are in this session's scratchpad, not the repo
(no report here has committed images; say if you want them in).

## Build and lint

```
npm run lint   → exit 0 (eslint, --max-warnings 0)
npm run build  → exit 0 (output above)
```

## Route evidence

The two production reads above (list, and one detail request). Nothing
new is called; the beacon and the lead payload are untouched.

## Data evidence

`ContentAnalytics` rows written by this session, all `api_get`: 1 from my
detail request, 9 from build 1, 1 from build 2 — **11**. The fixture run
and the screenshots wrote none. From here the fingerprint refetches a
body only when one of its list-visible fields changes.

## Scope

`src/components/pages/Blog/BlogArticle.jsx`, `src/services/blogApi.js`,
`scripts/postbuild.mjs`, `scripts/crm-articles.cache.json` — the four the
order names — plus **`scripts/crm-posts.cache.json`**, which the same build
rewrites (it now carries the five new fields per post) and which WO-4.23
made a committed file. Leaving it dirty was the alternative; I committed it
and am saying so. Nothing else. The two untracked gallery files in the
working tree predate this session and are not mine.

## Known gaps

1. **The rendered line on tonight's note with real data.** Not possible
   yet: the fields are null in production. Once Joseph fills them, the next
   build refetches that body (fingerprint), and the line renders with no
   further change. Until he also removes the hand-written sentence in the
   body (his, per Out of scope), that note will show the credit twice.
2. **The CRM deploy id** in `tested_against` is the request id I saw, not
   the deployment; the lead names the deploy that carried `882a007`.
3. **The `Modified from original.` reading** above: helper's rule, not the
   order's literal wording, for stock licenses only. Say which you want.
4. The order's "start then" line was not yet in the file when I began;
   the lead's instruction in chat was to work it, and the field was live.
