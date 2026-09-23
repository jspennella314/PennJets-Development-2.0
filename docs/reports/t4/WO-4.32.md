---
wo: WO-4.32
terminal: T4
branch: t4/work
commit: 52dfe94
tested_against: "site: two consecutive npm run build at 52dfe94 on this machine (Node v22.19.0, both exit 0, 26 of 26 routes prerendered). CRM: production www.pennforce.pennjets.com list route, which served updatedAt 2026-09-22T23:15:09.397Z for the Falcon note and the 4,550-character body on the detail route at 02:40:34Z on 2026-09-23 (the deploy carrying WO-1.17 is fe26ae2 on CRM main per the order; the deploy id is the lead's to name)."
date: 2026-09-23
status: reported
---

# WO-4.32 report — `updatedAt` in the prerender cache fingerprint

One field added to the fingerprint, the stale comment corrected, and the
live defect cleared: the committed cache now holds the Falcon note's
edited body and the prerendered page prints the credit once.

## Commit

`52dfe94` WO-4.32: updatedAt joins the prerender cache fingerprint. On
`t4/work`, pushed. `scripts/postbuild.mjs` and
`scripts/crm-articles.cache.json`. `scripts/crm-posts.cache.json` did not
change (the list was already current).

## The diff

```diff
 const fingerprint = (p) => JSON.stringify([
   p.title, p.excerpt, p.metaTitle, p.metaDescription,
   p.featuredImage, p.publishedAt, p.keywords, p.author && p.author.name,
   …
   p.imageCredit, p.imageSourceUrl, p.imageLicense, p.imageModified,
+  // The edit timestamp, so a change to the body alone is seen too. WO-4.32.
+  p.updatedAt,
 ]);
```

and the comment above `ARTICLES_CACHE`, which said the list had no
`updatedAt` and that staleness was bounded by time, now says: the list
carries `updatedAt` since WO-1.17 and it means "edited"; it is in the
fingerprint, so a body-only edit is detected on the next build; `MAX_AGE`
is the backstop for a change made by some path that does not move
`updatedAt`, of which there is none today. `MAX_AGE` itself is untouched.

## The two builds

Every fingerprint changed once, so the first build refetched every body;
the second reused all of them:

```
BUILD 1  [postbuild] article bodies: 0 from cache, 10 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
         [postbuild] wrote 26 HTML files (10 Market Notes) and sitemap.xml with 25 URLs
         [prerender] 26 of 26 routes rendered in 55.8s, 130,316 characters of body text added
BUILD 2  [postbuild] article bodies: 10 from cache, 0 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
         [postbuild] wrote 26 HTML files (10 Market Notes) and sitemap.xml with 25 URLs
         [prerender] 26 of 26 routes rendered in 75.1s, 130,316 characters of body text added
```

The prerendered body text is 130,316 characters against 130,527 in the
WO-4.30 build: the 211 fewer are the hand-written sentence and its
markup leaving the Falcon note.

## The Falcon page after the first build

`dist/blog/canadas-proposed-100-aircraft-expensing-….html`, counted as
rendered text (tags stripped, because the rendered line is
`Photo: <a …>Duncan Kirk / Wikimedia Commons</a>, …` and a raw grep for
`Photo: Duncan` cannot see across the anchor):

```
Photo: Duncan            x1
Modified from original   x1
Duncan Kirk              x1
class="image-credit"     x1
context: "…Founder and Principal Broker | Photo: Duncan Kirk / Wikimedia Commons, CC BY 4.0. Modified from original. | Penn Jets was recently approached by…"
```

One credit, the rendered line under the image; the body's sentence is
gone. Identical after the second build.

## The committed cache

```
canadas-proposed-…:  fetchedAt 2026-09-23T02:40:34.996Z
                     body.updatedAt 2026-09-22T23:15:09.397Z
                     content length 4550
                     hand-written credit in body: false
                     fingerprint includes "2026-09-22T23:15:09.397Z": true
```

## Lint

```
npm run lint → exit 0
```

## Data evidence

`ContentAnalytics` rows written by this order: **10**, all from build 1's
fingerprint-forced refetch, as the order anticipated. Build 2 wrote none.
Steady state is zero rows again; from here a body edit costs one row on
the build that first sees it.

## Scope

`scripts/postbuild.mjs`, `scripts/crm-articles.cache.json`. Nothing else.
(WO-4.31's edits to three other files were stashed while this order was
built and evidenced, and restored afterwards; they are not in `52dfe94`.)

## Known gaps

None. The lead can confirm on production after the merge: the live Falcon
page should carry one credit line and no `Photo:` sentence in the body.
