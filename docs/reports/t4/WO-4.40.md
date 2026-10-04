---
wo: WO-4.40
terminal: T4
branch: t4/work
commit: f270376
tested_against: "local checkout of t4/work at f270376: node src/services/blogPaging.test.mjs (Node 22.19.0, stubbed CRM); npm run build (list from the production CRM at 2026-10-02 ~14:40 UTC via the new pager, bodies from scripts/crm-articles.cache.json, dist/ prerendered by the build's Playwright Chromium), compared page by page with the build of 30c39c7 (WO-4.39); one read-only run of the pager against the production list route. No deploy: the site deploys only from main."
date: 2026-10-02
status: reported
---

# WO-4.40 report: the index shows every note, and the build pages through all of them

## Commit

`f270376` on `t4/work`. **Not pushed: `git push origin t4/work` was denied
by the permissions layer** (twice: once in a compound command with the
WO-4.39 report commit, once on its own). A denied command is a stop
condition, so it was not retried. Everything below is committed locally
on `t4/work`; see "End of the queue".

```
$ git show --stat --format= f270376
 scripts/postbuild.mjs                  |  25 ++----
 src/components/pages/Blog/BlogList.jsx |   7 +-
 src/services/blogApi.js                |  20 +++++
 src/services/blogPaging.js             |  80 ++++++++++++++++++
 src/services/blogPaging.test.mjs       | 148 +++++++++++++++++++++++++++++++++
```

## The contract, confirmed live before building

Read on the CRM's `main` (`app/api/public/blog/route.ts`: `parseInt(limit
|| '10')`, `parseInt(offset || '0')`, `take: limit, skip: offset`,
`hasMore: offset + limit < total`), and checked against production:

```
GET /api/public/blog                    -> {"total":11,"limit":10,"offset":0,"hasMore":true}   posts: 10
GET /api/public/blog?limit=3&offset=0   -> {"total":11,"limit":3,"offset":0,"hasMore":true}    posts: 3
GET /api/public/blog?limit=50&offset=10 -> {"total":11,"limit":50,"offset":10,"hasMore":false} posts: 1  (jet-charter-vs-ownership-…)
GET /api/public/blog?page=2&limit=50    -> {"total":11,"limit":50,"offset":0,"hasMore":false}  posts: 11  (?page= ignored, as the order says)
```

## 1. One pager, and where it lives

**`src/services/blogPaging.js`**, `fetchAllPosts({ baseUrl, category,
keyword, fetch, warn })`:

- requests `limit=50`, follows `offset += limit` while
  `pagination.hasMore`; the step is the `limit` the CRM echoes back
  (falling back to 50), so a route that one day caps the page size cannot
  make the loop skip notes;
- **stops on `hasMore === false` only**. A missing field is not a stop
  (that is how the old postbuild loop ended after one page without
  saying so). A page with no posts and no `hasMore: false` ends the loop
  **with a warning**; so does the hard stop at **20 pages** (1,000 notes);
- carries `category` and `keyword` on every page;
- keeps the first copy of a note that arrives twice (a note published
  between two pages shifts every later offset by one);
- throws on a non-2xx, so each caller keeps its own failure behaviour.

**`blogApi.getAllPosts(category, keyword)`** wraps it with the site's
`CRM_API_URL` and `transformPost`, returning `[]` on failure exactly as
`getPosts` does. **The index uses it** at `BlogList.jsx:31` (the full
list, for the category chips) and `:40` (the filtered list). `getPosts`
is unchanged and still serves the home card and the related notes.

**Can postbuild import the same helper?** Not `blogApi.js`: it reads
`import.meta.env` at module scope, which is `undefined` in Node, and its
other methods touch `window`. So the pager is **a plain-ESM sibling
module with no `import.meta`, no `window`, and `fetch` passed in**, the
same arrangement as `src/seo/siteMeta.js`, which postbuild already
imports. One pager, two importers, no copy:

```js
// scripts/postbuild.mjs
import { fetchAllPosts } from '../src/services/blogPaging.js';
posts = await fetchAllPosts({ baseUrl: CRM, warn: (m) => console.warn(`[postbuild] ${m}`) });
```

The old `fetchAllPosts` in postbuild (`?page=`, `totalPages`, 50-page
cap) is deleted. Its `if (!res.ok) throw` is now inside the shared pager,
so postbuild's cache fallback fires on the same condition as before.

## 2. The prerender's list mirror: already the CRM's contract, no change

`scripts/prerender.mjs:65-73` (`listFromCache`, WO-4.37) reads `limit`
(default 10) and `offset` (default 0), sorts by `publishedAt` descending,
slices `offset..offset+limit`, and returns `{ posts, pagination: {
total, limit, offset, hasMore: offset + limit < total } }`. That is the
route, including `parseInt` on both parameters. Run against the posts
cache for the requests the site now makes:

```
""                       {"total":11,"limit":10,"offset":0,"hasMore":true}   posts 10   (home card, related notes)
"?limit=50&offset=0"     {"total":11,"limit":50,"offset":0,"hasMore":false}  posts 11   (the index, both reads)
"?limit=3&offset=0"      {"total":11,"limit":3,"offset":0,"hasMore":true}    posts 3
"?limit=50&offset=10"    {"total":11,"limit":50,"offset":10,"hasMore":false} posts 1
```

Identical to production's answers above. Nothing in `prerender.mjs`
changed; the prerendered index shows the right set because the mirror
already did this.

## 3. The home "latest note" card: unaffected, but the premise is not the code

The order says the card "keeps its own `limit=1` request". **It has no
such request.** `LatestNote.jsx:82` calls `blogApi.getPosts()` with no
parameters, which is the route's default `limit=10`, and `newestNote()`
(`:10-17`) picks the greatest `publishedAt` out of those ten. The
WO-4.37 report said as much ("the post with the greatest `publishedAt`").
`getPosts` is untouched by this order, so the card is **unaffected**: it
still makes one default request and still shows the newest note (which
is always in the first ten, because the CRM sorts by `publishedAt`
descending). I did not change it to `limit=1`, because the order asks to
confirm, not to change, and a one-line order would be the right way to
switch it if the lead wants the smaller payload.

## Evidence

### Before and after: the built `/blog` index

Both from `dist/blog.html`, counting the card titles (the index navigates
by `onClick`, so there are no `/blog/<slug>` hrefs to count):

```
=== before (build of 30c39c7): label "10 notes", 10 cards
  Q3 2026 … | Canada's Proposed 100% … | Why We Publish Market Notes |
  The Light Jet Market in 2026 … | Pilatus PC-12 NGX … | September 11 … |
  Bombardier … | How to Buy Your First Private Jet … |
  Sustainable Aviation … | The State of the Private Jet Market In Q3 2025
=== after (build of f270376): label "11 notes", 11 cards
  (the same ten, in the same order, then)
  Jet Charter vs. Ownership: Making the Right Choice        <- jet-charter-vs-ownership-making-the-right-choice, 2025-11-06, the oldest
```

### The paging check against a stubbed CRM

`node src/services/blogPaging.test.mjs` — a fake route that applies
`limit`/`offset` exactly as the real one does:

```
--- 120 notes, PAGE_SIZE 50
PASS  every note fetched
PASS  each exactly once
PASS  in the CRM's order
PASS  3 requests: offsets 0, 50, 100
PASS  stopped on hasMore: false, no warning
--- 11 notes (today): one request
PASS  11 notes
PASS  one request
PASS  no warning
--- exactly 50 notes: hasMore is false on the first page
PASS  50 notes, one request
--- 0 notes
PASS  empty list, one request, no warning
--- a CRM that always says hasMore: true (the hard stop, MAX_PAGES 20)
PASS  stops with the 120 real notes
PASS  4 requests (the 4th was empty)
PASS  warns once
PASS    the warning names the empty page
PASS  hard stop after 20 pages
PASS    1000 notes kept
PASS    warns once, naming the page cap
--- a response with no pagination field at all (the old silent stop)
PASS  does not stop after one page: all 120 fetched
PASS  ends on the empty 4th page with a warning
--- the CRM caps the page size at 20 (echoed in pagination.limit)
PASS  steps by the applied limit, nothing skipped
PASS  offsets 0, 20, 40
--- a note published between page 1 and page 2 (every later offset shifts by one)
PASS  the shifted note is kept once, not twice
PASS  60 distinct notes (the new one arrives on the next load)
--- filters are carried on every page
PASS  category on both pages
PASS  keyword encoded
--- an HTTP error throws (callers decide: blogApi returns [], postbuild falls back to the cache)
PASS  throws with the status

all passed
exit 0
```

Two "always `hasMore: true`" cases, because they end differently: when
the stub runs out of posts the **empty-page stop** fires on page 4 with a
warning; when every page is full the **20-page hard stop** fires with a
warning. Both are loud; neither loops.

### The real pager against production, once (read-only; the list route writes nothing)

```
?limit=50&offset=0  -> 200 posts=11 pagination={"total":11,"limit":50,"offset":0,"hasMore":false}
total 11, distinct 11
```

One request, `hasMore: false`, done; the 11 slugs match the cache.

### Build

```
$ npm run build            (at f270376)
build exit 0
  dist/assets/index-b2c95757.css   49.98 kB │ gzip:   8.10 kB
  dist/assets/index-073ec5e5.js   395.39 kB │ gzip: 115.66 kB
  [postbuild] article bodies: 11 from cache, 0 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
  [postbuild] wrote 27 HTML files (11 Market Notes) and sitemap.xml with 26 URLs
  [postbuild] 1 note image(s) hotlinked from another site and were not used:   (wallpaperaccess.com, as before)
  [postbuild] 2 note image(s) not in this repo; social preview fell back to the default:   (Challenger_650, gulfstream, as before)
  [prerender] 27 of 27 routes rendered in 39.9s, 138,515 characters of body text added
    /blog                                                        0 ->   7386 chars  +head meta:keywords
  [prerender] 11 view beacon(s) intercepted; none reached the CRM.
  [prerender] 11 article fetch(es) answered from cache; none reached the CRM, so none wrote a ContentAnalytics row.
  [prerender] 14 note-list read(s) answered from scripts/crm-posts.cache.json; none reached the CRM.

$ npm run lint
> eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0
lint exit 0
```

- **postbuild fetched all 11** through the new pager (`11 Market Notes`,
  not `FROM CACHE`) and rewrote `scripts/crm-posts.cache.json` **byte for
  byte** (`git status` shows it unmodified): same 11 posts, same order.
- **The cache was reused**: `11 from cache, 0 fetched`, so this build
  wrote **no `ContentAnalytics` row**.
- **The only prerendered page that changed is `/blog`** — with the
  countdown digits, the asset hashes and the sitemap `lastmod` masked:

```
pages: 29, identical: 28, differ: 1
  blog.html
```

  The one differing line is the index body, which gains the eleventh
  card (the "+" fragment in the masked diff is `…By PennJets · November
  6, 2025…`, the Jet Charter vs. Ownership card). The body text grows
  138,056 → 138,515 characters, all of it on `/blog`. No other page lists
  notes from the index's call: the home card and the related-notes
  sections use `getPosts()`, which is unchanged, and are byte-identical.
- Still **14 list reads** in the prerender: the index's two reads now
  carry `?limit=50&offset=0` and are answered from the cache like
  before; none reached the CRM.
- Bundle: 394.22 → 395.39 kB (+0.50 kB gzip), the pager.

## Scope

As ordered: `src/services/blogApi.js`, `BlogList.jsx`,
`scripts/postbuild.mjs`, and the check. `scripts/prerender.mjs` needed
no change (section 2). Plus the pager module `src/services/blogPaging.js`
beside `blogApi.js`, which is where "one pager" has to live for both
importers to reach it. Only this repository touched; the CRM route was
read, not changed.

## Known gaps

1. **The related notes still see 10 of 11.** `BlogArticle.jsx:42` calls
   `getPosts()` (default 10) to pick three related notes, so the oldest
   note can never be "related". Out of this order's scope (the scope
   names the index); a one-line switch to `getAllPosts()` if the lead
   wants it. Same class as WO-4.37's finding 3.
2. **The home card's `limit=1`** does not exist (section 3). Reported,
   not changed.
3. **The check is a node script, not run by `npm run build` or `npm run
   lint`** — the WO-4.38 gap, unchanged.
4. **No deploy evidence**: the site deploys only from `main`, and
   `t4/work` could not be pushed from this session.

## End of the queue (2026-10-02)

The README's dated list (2026-09-29: WO-4.36, 4.37, 4.38) was already
complete and reported before this session (`aa6383a`). The orders
without reports were **WO-4.39 and WO-4.40**, worked in numeric order.

**Finished and reported, committed locally on `t4/work`:**
- `be4da28` — routine refresh of `scripts/crm-articles.cache.json`
  (MAX_AGE refetch, 10 ContentAnalytics rows; see the WO-4.39 report).
- **WO-4.39** — `30c39c7`, report `9e5f104`.
- **WO-4.40** — `f270376`, report (this file).

**Skipped:** none.

**Stopped on:** **`git push origin t4/work` is denied** by the
permissions layer in this session (twice; not retried). The branch is
**5 commits ahead of `origin/t4/work` (`aa6383a`)** and nothing left this
machine. A technical blocker, so **for the lead**: either allow the push
for T4's branch in the site repo or push `t4/work` from a session that
can. Nothing else stopped me: no failure outside my changes, no schema or
env need, nothing touched a live account, and the only outbound calls
were GETs to the public list route (which writes nothing) and the ten
MAX_AGE body refetches that postbuild makes on its own.

**Also seen, not mine, not touched:** an untracked file in the checkout,
`public/images/Gallery/Snow_Agreement_254_Stanton_Mountain_Rd.pdf`. It is
not in any commit of mine, it is not an image, and Vite would copy it
into `dist/` if it were ever committed. Joseph or the lead should decide
whether it belongs in the repository (it looks like a legal document, not
a site asset) and remove it from the working tree if not.

**Left for Joseph:**
1. **Merge `t4/work` into the site's `main`** once it is pushed. That
   merge carries WO-4.35, 4.36, 4.37, 4.38 (all pushed on 2026-09-29),
   plus WO-4.39 and 4.40. Pages deploys the merge.
2. At that merge, the items the WO-4.38 report listed (WO-4.37's look at
   both widths; WO-4.36's proposed removal of the "Quick Response" card).

**For the lead, not Joseph:**
- The push denial above.
- WO-4.40 gaps 1 and 2 (related notes see 10 of 11; the home card has no
  `limit=1`), each a one-line order if wanted.
- WO-4.39: the CRM's body serialisation changed (`&` → `&amp;`) without
  moving `updatedAt`, so the site saw it only at the 7-day backstop.
- The missing test runner (WO-4.38), now with three node-script checks
  that nothing runs automatically.
