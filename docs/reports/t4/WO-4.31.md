---
wo: WO-4.31
terminal: T4
branch: t4/work
commit: 9139209
tested_against: "site: npm run build at 9139209 on this machine (Node v22.19.0, exit 0, 26 of 26 routes prerendered); the built index served locally with JavaScript on, its requests going to production. CRM: production www.pennforce.pennjets.com, whose list route answered ?category=market-studies with 5 and ?category=market-notes with 3 on 2026-09-23 ~02:20-02:55 UTC (WO-1.16 live; the deploy id is the lead's to name)."
date: 2026-09-23
status: reported
---

# WO-4.31 report — the index filters with `?category=`

The index now asks the CRM's exact filter and shows what comes back. The
client-side re-check and the `categoryKeyword` helper are gone; `hasCategory`
stays because the chips still use it.

## Commit

`9139209` WO-4.31: the Market Notes index filters with ?category=, not
?keyword=. On `t4/work`, pushed. Files: `blogApi.js`, `BlogList.jsx`,
`utils/marketNotes.js`.

## The diff

`src/services/blogApi.js` — `getPosts(category, keyword)`:

```diff
-  async getPosts(keyword) {
+  async getPosts(category, keyword) {
     try {
       const url = new URL(`${CRM_API_URL}/api/public/blog`);
+      if (category) url.searchParams.set('category', category);
       if (keyword) url.searchParams.set('keyword', keyword);
```

`?keyword=` stays reachable as the second argument, as the order asks;
nothing passes it today (`BlogArticle.jsx` and the index's unfiltered call
pass nothing).

`src/components/pages/Blog/BlogList.jsx`:

```diff
-import { CATEGORIES, categoryFor, categoryKeyword, hasCategory } from '../../../utils/marketNotes';
+import { CATEGORIES, categoryFor, hasCategory } from '../../../utils/marketNotes';
…
-  // Filtered list. The CRM's ?keyword= is a loose substring search, so the
-  // result is re-checked against the exact category keyword before display.
+  // Filtered list. ?category= is the CRM's exact match on the keywords
+  // array (WO-1.16), so what comes back is shown as is. WO-4.31.
…
-      .getPosts(activeSlug ? categoryKeyword(activeSlug) : undefined)
+      .getPosts(activeSlug || undefined)
       .then((data) => {
         if (cancelled) return;
-        setPosts(activeSlug ? data.filter((post) => hasCategory(post, activeSlug)) : data);
+        setPosts(data);
       })
```

`src/utils/marketNotes.js`: `categoryKeyword()` removed — its only caller
was the line above — and `hasCategory`'s comment rewritten: it no longer
guards a loose server match; it still decides which chips to offer
(`BlogList.jsx:55-57`), which is why it stays. `CATEGORY_PREFIX`,
`categoryFor` and `displayTags` are untouched. `grep -rn categoryKeyword
src` finds only the comment that records its removal.

`scripts/postbuild.mjs` fetches the list with no filter; unchanged, as the
order says.

## The requests the index makes

The built index served locally, JavaScript on, every `/api/public/blog`
response recorded, requests going to production (the list route writes
no `ContentAnalytics` row):

```
/blog
  request: /api/public/blog                          →  200, 10 posts
  request: /api/public/blog                          →  200, 10 posts
  heading "Latest Market Notes"   count shown "10 notes"   cards 10   chips ["All","Market Studies","Market Notes"]

/blog?category=market-studies
  request: /api/public/blog                          →  200, 10 posts   (the chip list)
  request: /api/public/blog?category=market-studies  →  200, 5 posts
  heading "Market Studies"        count shown "5 notes"    cards 5    chips ["All","Market Studies","Market Notes"]

/blog?category=market-notes
  request: /api/public/blog                          →  200, 10 posts
  request: /api/public/blog?category=market-notes    →  200, 3 posts
  heading "Market Notes"          count shown "3 notes"    cards 3    chips ["All","Market Studies","Market Notes"]
```

The filtered request carries `category=<bare slug>`, no `keyword`, and
its count is the count the page shows. The two requests on the unfiltered
index are the existing pair (the chip list and the list itself), as
before. The built bundle contains `searchParams.set("category",e)` and no
`keyword` call from the index.

**The order says 5 studies and 4 notes today; production says 5 and 3.**
Read straight from the list route with no filter: 5 `category:market-
studies`, 3 `category:market-notes`, 2 with no category, 0
`category:transactions`, 10 in all. The Transactions chip is therefore
not offered (the existing rule: only categories with notes), and the
"Market Notes" filter returns 3, which is what the CRM says. The lead
may want to check whether a fourth note was meant to carry the category.

## The unfiltered index

Unchanged: same request, 10 posts, 10 cards, the same three chips, heading
"Latest Market Notes". The prerendered `/blog` route is 7,064 characters
of body text, as in the WO-4.30 build.

## Build and lint

```
npm run lint   → exit 0
npm run build  → exit 0
  [postbuild] article bodies: 10 from cache, 0 fetched
  [postbuild] wrote 26 HTML files (10 Market Notes) and sitemap.xml with 25 URLs
  [prerender] 26 of 26 routes rendered in 54.6s, 130,316 characters of body text added
    /blog   0 -> 7064 chars  +head meta:keywords
```

## Data evidence

No `ContentAnalytics` rows: only list requests were made.

## Scope

`src/services/blogApi.js`, `src/components/pages/Blog/BlogList.jsx`,
`src/utils/marketNotes.js`. The chips, their labels and which categories
exist: untouched.

## Known gaps

None on the site side. The 3-versus-4 count above is a question for the
CRM's data, not a gap in this change.
