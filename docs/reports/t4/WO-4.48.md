---
wo: WO-4.48
terminal: T4
branch: t4/work
commit: 75c644e
tested_against: "local checkout of t4/work at 75c644e (on top of origin/main ee43b0b, after WO-4.46's 870dfe3 and WO-4.47's c5bec3d), Node 22.19.0: npm test (vitest 3.2.7), npm run lint, and two npm run builds. Build 1 read the production CRM (deploy d3de16c, READY 20:55 UTC per docs/STATUS-2026-10-19.md; the Neon outage closed ~21:35 UTC): 16 notes live, caches refreshed and committed as a4915fc. Build 2 had VITE_CRM_API_URL=http://127.0.0.1:9 (nothing listens): postbuild fell back to the committed cache, and vite preview of that build on localhost:4174 was driven by the repo's Playwright Chromium 153 with nothing stubbed, so the CRM requests really failed and the build file really loaded."
date: 2026-10-19
status: reported
---

# WO-4.48 report: the Market Notes index never shows fewer notes than the build shipped

The build's list now travels with the page as `dist/data/market-notes.json`,
and the index, the home card and a note's related notes read it through one
function that prefers it whenever the CRM fails, returns fewer notes, or is
older. With the CRM unreachable the index shows all 16 notes and the home
card the 19 October note, where before both showed nothing.

## Commit

`75c644e` on `t4/work`, pushed. Also on the branch, its own commit as
before: `a4915fc`, the routine refresh of the two CRM caches made by build 1
(the CRM is back; 16 notes, 16 bodies, each body fetch one ContentAnalytics
row as `postbuild.mjs` already says).

```
$ git show --stat --format= 75c644e
 scripts/postbuild.mjs                         |  29 ++++++
 src/components/pages/Blog/BlogArticle.jsx     |   8 +-
 src/components/pages/Blog/BlogList.jsx        |  20 +++-
 src/components/pages/Home/LatestNote.jsx      |  11 +-
 src/components/pages/Home/LatestNote.test.jsx |  78 ++++++++++++++
 src/services/blogApi.js                       |  60 +++++++++--
 src/services/blogApi.test.js                  | 142 ++++++++++++++++++++++++++
 src/services/blogIndex.js                     |  77 ++++++++++++++
 src/services/blogIndex.test.js                |  96 +++++++++++++++++
 9 files changed, 505 insertions(+), 16 deletions(-)
```

`src/services/blogPaging.js` is unchanged: the pager still does the CRM
half, and the comparison sits beside it.

## 1. The build's list travels with the page

`scripts/postbuild.mjs`, right after `posts` is settled (live or from the
cache), writes `dist/data/market-notes.json`:

```json
{ "posts": [ ...every published note... ],
  "pagination": { "total": 16, "limit": 16, "offset": 0, "hasMore": false },
  "builtAt": "2026-10-19T22:18:40.000Z", "fromCache": false }
```

**Kept per post**: `id`, `title`, `slug`, `excerpt`, `featuredImage`,
`featuredImageSocial`, `imageAttribution`, `keywords` (the category lives
there), `publishedAt`, `updatedAt`, `author` (`{ id, name }`, as the list
route sends it). **Dropped**: bodies (the list route has none anyway),
`metaTitle`, `metaDescription`, the raw `imageCredit` / `imageSourceUrl` /
`imageLicense` / `imageModified` (the pages render `imageAttribution`, the
CRM's composed credit, WO-4.27), `viewCount`, `leadCount`.

```
[postbuild] wrote data/market-notes.json: 16 note(s), 16,816 bytes        (build 1, live)
[postbuild] wrote data/market-notes.json: 16 note(s), 16,815 bytes, FROM CACHE   (build 2)
$ ls -la dist/data/market-notes.json
-rw-r--r-- 1 jspen 197609 16816 Oct 19 18:18 dist/data/market-notes.json
```

16.8 KB for 16 notes, about 1 KB a note; the 200 KB line is ~190 notes
away, and postbuild warns if a build crosses it.

## 2. The index prefers the better list

`src/services/blogIndex.js` (plain ESM, Node-testable) holds the rule:

```
chooseList(crm, build)
  no build list            -> the CRM's (or [] on failure), as before
  crm === null (failed)    -> build   reason 'crm-failed'
  crm.length < build.length -> build   reason 'crm-shorter'
  newest(crm) < newest(build) -> build reason 'crm-older'
  otherwise                -> the CRM's, no reason
```

`blogApi.getAllPosts(category, keyword, { onBuildList })` starts the CRM
pager and the build-file read together, filters the build's list to the
same category (`hasCategory`, the CRM's strict match), hands the build's
list to `onBuildList` as soon as it is read, then applies the rule to the
CRM's answer. One `console.warn` names the rule and the numbers:

```
[blog] Showing the build's list of 16 note(s) instead of the CRM's: the CRM list request failed (Failed to fetch). (crm-failed, WO-4.48)
```

A keyword search has no build-side equivalent, so that path is the CRM's
alone (nothing uses it today, WO-4.31). The build file is read once per
page load and shared by every caller.

**The three callers** all go through it now: `BlogList.jsx` (both effects,
the full list and the filtered one), `Home/LatestNote.jsx` (was
`getPosts()`, the unpaged route) and `BlogArticle.jsx`'s related notes (was
`getPosts()` too). So the home card and the related notes follow the same
list as the index.

## 3. No empty index while loading

Each caller passes `onBuildList`, which sets the list (and on the index
clears `loading`) before the CRM answers; the CRM's list then replaces it
only when the rule says so. The prerendered HTML carries the build's list
and so does the first client render, so the two agree.

## 4. Tests

Three new files, 28 tests; the suite is 146 (was 118).

```
$ npm test
 ✓ src/services/blogIndex.test.js (15)      chooseList: CRM fails / shorter / older / newer / same / empty / no build file;
                                            newestPublishedAt; filterBuildList; loadBuildList (missing, bad JSON, wrong shape, throws)
 ✓ src/services/blogApi.test.js (12)        getAllPosts through stubbed fetch: the four cases with the warn text, transform,
                                            onBuildList first, category filter, no-notes category, keyword path, no build file, one read per load
 ✓ src/components/pages/Home/LatestNote.test.jsx (3)   the home card: CRM down -> build's newest; CRM stale -> build's newest; CRM newer -> CRM's
 Test Files  10 passed (10)
      Tests  146 passed (146)
   Duration  7.42s
```

## Route evidence: the preview with the CRM at a dead port

Build 2 (`VITE_CRM_API_URL=http://127.0.0.1:9`), `vite preview --port 4174`,
Playwright Chromium, nothing stubbed. What the browser did and showed:

| Page | CRM requests | Build file | Shown |
|---|---|---|---|
| `/blog` | `http://127.0.0.1:9/api/public/blog?limit=50&offset=0` → `net::ERR_UNSAFE_PORT` (twice: the full list and the filtered list) | `200 /data/market-notes.json` | **"16 notes"**, 16 cards; `wo-4.48-index-crm-dead-1280.png` |
| `/blog?category=market-studies` | both requests fail as above | 200 | "5 notes", 5 cards (the build's list filtered); two warns, 16 and 5 |
| `/` | list and inventory requests fail | 200 | the home card: "Charter Demand Is Up 27%. Flying Isn't", `/blog/charter-demand-is-up-27-flying-isnt`, dated 2026-10-19T16:52:50Z, the newest note in the build; `wo-4.48-home-crm-dead-1280.png` |
| `/blog/why-we-publish-market-notes` | the article request fails | 200 | the article page shows "Note Not Found" (see Known gaps); the related-notes list was read from the build file (the warn fired) but has nothing to attach to |

The console warn, verbatim from the browser on `/blog`:

```
[blog] Showing the build's list of 16 note(s) instead of the CRM's: the CRM list request failed (Failed to fetch). (crm-failed, WO-4.48)
```

The console errors on those pages are the existing ones (`Error fetching
blog posts: TypeError: Failed to fetch`, the inventory's, the article's);
nothing new.

## Build (build 1, the CRM live)

```
$ npm run build            (exit 0)
✓ built in 4.83s
[postbuild] wrote data/market-notes.json: 16 note(s), 16,816 bytes
[postbuild] inventory: 0 listing(s) from the CRM
[postbuild] article bodies: 0 from cache, 16 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
[postbuild] wrote 32 HTML files (16 Market Notes) and sitemap.xml with 31 URLs
[prerender] 32 of 32 routes rendered in 47.0s, 173,972 characters of body text added
[prerender] 16 view beacon(s) intercepted; none reached the CRM.
[prerender] 16 article fetch(es) answered from cache; none reached the CRM, so none wrote a ContentAnalytics row.
[prerender] 19 note-list read(s) answered from scripts/crm-posts.cache.json; none reached the CRM.
[prerender] 2 inventory read(s) answered from scripts/crm-inventory.cache.json (0 listing(s)); none reached the CRM.
```

The prerender serves `dist/` itself, so the new file is read at build time
too (`.json` is in its MIME map) and every prerendered index carries the
build's 16.

```
$ npm run lint             (exit 0, 0 warnings)
```

Two builders: T3's dev server and T1's `tsc` were running in the CRM
worktrees when I built; no build was. The site build is small (vite, ~1 GB)
and ran alone in this checkout.

## Scope

`scripts/postbuild.mjs`, `src/services/blogApi.js`, the new
`src/services/blogIndex.js`, `BlogList.jsx`, `LatestNote.jsx`,
`BlogArticle.jsx` (the related-notes effect only), three test files, this
report and two PNGs. `blogPaging.js` untouched. The five untracked Gallery
images are still not mine.

## Known gaps

- **A note page with the CRM down shows "Note Not Found" after
  hydration.** Out of scope by the order ("the prerendered article pages
  already stand"), but they stand only until the SPA mounts: `BlogArticle`
  fetches the body in `useEffect` and renders the not-found state on
  failure, replacing the prerendered body. The same shape of fix would do
  (the article cache is already in the repo, 177 KB for 16 bodies; it
  could ship per note or in one file). A candidate for the lead, not done.
- The dead-port evidence is `ERR_UNSAFE_PORT`, Chrome refusing port 9,
  rather than a connection refused; the fetch rejects the same way and
  `fetchAllPosts` throws the same `TypeError: Failed to fetch`. The 500
  case is covered by the tests, not the preview; the CRM had recovered
  before the preview ran.
- `dist/` on this machine is build 2 (the dead-port bundle); it is
  untracked and not deployed. The lead's isolated build is the evidence.
