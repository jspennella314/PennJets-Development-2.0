---
wo: WO-4.43
terminal: T4
branch: t4/work
commit: ede5637
tested_against: "local checkout of t4/work at ede5637 (on top of 8c4a106 = main f9db8a2 merged back), Node 22.19.0: npm test (vitest 3.2.7, happy-dom for the two page tests); npm run build (production inventory route 404, committed empty cache; dist/ prerendered by the build's Playwright Chromium) compared page by page with the WO-4.42 live build of 8967411, whose tree is identical to 8c4a106; npm run lint. No live listing exists (WO-3.39 not merged), so the two-listing cases are tests, not a build."
date: 2026-10-05
status: reported
---

# WO-4.43 report: listings come only through the CRM; the static entries are out of the site

## Commit

`ede5637` on `t4/work`, pushed.

```
$ git show --stat --format= ede5637
 .../pages/AircraftDetail/AircraftDetail.jsx        | 233 +----------
 .../pages/AircraftDetail/AircraftDetail.test.jsx   |  89 +++++
 .../pages/AircraftListing/AircraftListing.jsx      | 442 ++++++++-------------
 .../pages/AircraftListing/AircraftListing.test.jsx | 151 +++++++
```

Routine, done without asking: `git fetch`; `t4/work` fast-forwarded to
`origin/t4/work` `8c4a106` (Joseph's PR #10, main → t4/work, which
already carries his PR #9 merge `f9db8a2` of WO-4.41/4.42); `git fetch
origin main:main`; `git merge --ff-only origin/main` → already up to
date; `npm ci` exit 0.

## 1. `src/data/aircraftData.js`: every import gone; the file itself could not be deleted

- **Every import is gone.** `AircraftListing.jsx` and `AircraftDetail.jsx`
  were the only two importers; neither references it now. Vite bundles
  only what is imported, so the built JS has none of it:

```
dist/assets/index-3faf9bb1.js        (388.26 kB, was 399.56 kB: -11.3 kB, -2.68 kB gzip)
  Diamond 1A : 0        E55 Baron : 0        Mitsubishi : 0        aircraftDatabase : 0
  Under Contract : 0    Price on request : 0 Sanford, FL : 0       aso.com : 0
  Premier 1A : 7        api/placeholder : 2
```

  The two strings that remain are **not the static data's**: "Premier 1A"
  is PennShare's aircraft (`PennShare.jsx` ×4, the home page's Off-Market
  type and keywords, `Sell.jsx`'s placeholder, a `Charter.jsx` comment),
  and the two `/api/placeholder` URLs are `PennShare.jsx`'s image
  `onError` fallbacks (`:208`, `:252`). Both predate this order and are
  out of its scope; the static file's own two `/api/placeholder/800/600`
  URLs are gone (count was 2 before and is 2 after, all PennShare's).

- **The `git rm` was denied** by the permissions layer ("Irreversible
  Local Destruction"). A denied command is a stop condition, so I did
  not delete the file another way. **`src/data/aircraftData.js` is still
  in the tree, unimported, 134 lines.** Removing it is one command for
  the lead or Joseph (`git rm src/data/aircraftData.js`), with no code
  change needed; nothing on the site reads it. Until then the three
  entries exist only as a file in the repository, not on the site.

## 2. `/aircraft` reads the CRM

`AircraftListing.jsx` is rewritten around `inventoryApi.getListings()`
(the home section's call, WO-4.42) and renders the WO-4.42
`InventoryCard` (year, make, model, serial, hours, config, price when
sent, image when on-host). State is `null` until the fetch answers,
then the list.

- **Filters: only what the contract can answer.** Make (from the
  listings), a year range (from/to, from the listings' years), and a
  price ceiling shown **only when at least one listing carries a price**
  (fixed ceilings, only the ones that would change the result). Category,
  status, location, specifications, the free-text search over
  manufacturer/name and the grid/list toggle went with the static data.
  The results count ("Showing N of M aircraft"), the "No aircraft found /
  Try adjusting your filters" block and the "Clear Filters" buttons are
  the page's existing copy, shown only when there are listings.
- **Empty inventory:** the page's heading and its existing paragraph,
  **one approved sentence** — the Off-Market paragraph's first sentence
  from the home page, as the order directs until Joseph answers the
  lead on this page's own wording — and one inquiry link,
  "Contact a Consultant" → `/contact` (the page's existing CTA label).
  No count, no filter row, no placeholder card, no "coming soon", and
  the CTA section below is not rendered either (it would be a second
  copy of the same invitation).
- **Before the fetch answers:** the heading and nothing else.
- **Failed fetch or 404:** the same empty state (the service returns
  `[]`).

The sentence is exported as `EMPTY_SENTENCE` so Joseph's wording, when
it comes, is a one-line change and the test follows it.

## 3. `AircraftDetail.jsx`: the slug path only

The numeric-id branch, the static lookup, `DETAIL_IMAGES` and the whole
static view (description, specifications, features, ASO link, "Located
in", status badge) are deleted. What remains is WO-4.42's listing view
(`ListingDetail`) and the lookup: `inventoryApi.getListing(id)`; a
match renders; none redirects to `/aircraft` (`replace: true`, so the
dead URL does not stay in history). A numeric id such as `/aircraft/3`
is simply a slug that matches nothing and redirects. While the lookup
is in flight the page is an empty white container.

## 4. The prerender

`/aircraft` was already in the prerendered route list: it is in
`siteMeta.js`'s `ROUTES`, so postbuild writes `dist/aircraft.html` and
the prerender renders it (the WO-4.42 build log shows `/aircraft 0 ->
2144 chars`). The inventory mirror added in WO-4.42 answers the page's
read from `scripts/crm-inventory.cache.json`, so the empty state is in
the static HTML. No change to `prerender.mjs` was needed; its report now
counts **2 inventory reads** (home page + `/aircraft`), both from the
cache.

The prerendered `/aircraft`, read back from `dist/aircraft.html`:

```
title: Aircraft for Sale | PennJets
Aircraft for Sale  Discover our curated collection of premium aircraft. Each listing represents exceptional
quality, performance, and value in the luxury aviation market.
The best aircraft rarely reach the open market. Tell us your mission and we'll tell you what's available.
Contact a Consultant
links to /contact: 1 | <article>: 0 | "Showing N of": 0 | <select>: 0
```

## 5. Sitemap and Footer

Untouched. `/aircraft` keeps its `ROUTES` entry (title, description,
sitemap line, prerendered head); the Footer's "Browse Aircraft", the
Header's "Aircraft", and the Charter/PennShare/Services links to
`/aircraft` all still land on the page.

## Evidence

### `npm test` — 14 new cases; the suite is 109

```
 ✓ src/components/pages/AircraftListing/AircraftListing.test.jsx   9 tests   (happy-dom, route stubbed)
   empty inventory:
     the heading, the approved sentence and the inquiry link; no card, no count, no placeholder
       (h1 "Aircraft for Sale"; EMPTY_SENTENCE present; a[href="/contact"] "Contact a Consultant";
        0 <article>; no "Showing N of M"; no coming soon/featured/off market/Diamond 1A/Premier 1A/E55 Baron; no <select>)
     a failed fetch and a 404 render the same empty state
     before the fetch answers: the heading and nothing else
   two listings:
     two cards, the count, and the filters the contract can answer
       (cards "2004 Hawker 800XP","2008 Cessna Citation CJ3"; "Showing 2 of 2 aircraft";
        selects Make / Year from / Year to / Maximum price; makes All, Cessna, Hawker;
        no category/status/location/Light Jet/Sold/Under Contract text)
     the make filter narrows to one card; Clear Filters restores both
     the year range narrows
     the price ceiling keeps only listings with a price at or under it   (options: Any price, Up to $5,000,000)
     no price filter when no listing carries a price                      (3 selects)
     filters that match nothing show the existing "No aircraft found" block, never the empty-inventory sentence
 ✓ src/components/pages/AircraftDetail/AircraftDetail.test.jsx   5 tests   (happy-dom, MemoryRouter with /aircraft and /aircraft/:id)
     a slug resolves to the listing view, from the route's fields only
       (h1, headline, $2,950,000; dl rows Year/Make/Model/Serial/Total time/Configuration/Asking price;
        only the on-host image; no "Located in"/Specifications/Key Features/Under Contract/SOLD)
     no price line when the route sends null
     a numeric id (the old static path) redirects to /aircraft
     an unknown slug redirects to /aircraft
     an empty inventory redirects to /aircraft

 Test Files  7 passed (7)
      Tests  109 passed (109)
   Duration  23.41s
```

`npm run lint` exit 0 (a first pass had four `react-hooks/exhaustive-deps`
warnings on a `useMemo` dependency; fixed by memoising the list, rebuilt
after).

### Build

```
$ npm run build            (at ede5637; no other next build running)
build exit 0
  dist/assets/index-a1da779c.css   49.29 kB │ gzip:   7.98 kB    (was 50.06 kB)
  dist/assets/index-3faf9bb1.js   388.26 kB │ gzip: 114.04 kB    (was 399.56 kB)
  [postbuild] inventory: 0 listing(s) from the committed cache (inventory route: HTTP 404)
  [postbuild] article bodies: 11 from cache, 0 fetched
  [postbuild] wrote 27 HTML files (11 Market Notes) and sitemap.xml with 26 URLs
  [prerender] 27 of 27 routes rendered in 55.0s, 137,763 characters of body text added
    /aircraft                                                    0 ->   1392 chars      (was 2144: the three cards and filters are gone)
  [prerender] 11 view beacon(s) intercepted; 11 article fetch(es) and 14 note-list read(s) answered from cache; none reached the CRM.
  [prerender] 2 inventory read(s) answered from scripts/crm-inventory.cache.json (0 listing(s)); none reached the CRM.
```

Page comparison against the WO-4.42 live build (countdown digits, asset
hashes, sitemap lastmod masked):

```
pages: 29, identical: 28, differ: 1
  aircraft.html
```

`/aircraft` is the only page that changed; the home page, every note and
every other static page are identical. The first WO-4.43 build (before
the lint fix) and the final one are 29/29 identical.

## Scope

As ordered: `src/components/pages/AircraftListing/**`,
`src/components/pages/AircraftDetail/**` (each with a test beside it).
`scripts/prerender.mjs` needed no change (section 4).
`src/data/aircraftData.js`: every import removed; **the file's deletion
is left for the lead** (section 1). No copy beyond the one approved
sentence; the inquiry form untouched; the home section untouched. Only
this repository touched; the CRM repo was read.

## Known gaps

1. **`src/data/aircraftData.js` still exists in the repository**,
   unimported (section 1). One `git rm` by the lead or Joseph closes
   item 1 of the order completely.
2. **The empty-state sentence is the stand-in** the order names, not
   this page's own wording. Joseph's sentence, via the lead, is a
   one-line change to `EMPTY_SENTENCE` (and its test follows).
3. **The page's existing hero paragraph** ("Discover our curated
   collection of premium aircraft…") still renders above the empty
   state. It is existing copy, so it stayed; whether it reads right over
   an empty inventory is Joseph's call, with gap 2.
4. **No live listing yet.** The two-listing cases are tests; the first
   real listing on `/aircraft` and `/aircraft/<slug>` needs a look after
   WO-3.39 and Joseph's first approval.
5. **The filter-empty copy** ("No aircraft found", "Try adjusting your
   filters…") is the page's old copy, kept because it is not new; it only
   shows when listings exist and the filters exclude all of them.
6. **`/aircraft/<slug>` is still not prerendered** (WO-4.42 gap 2).

## End of the queue (2026-10-05, evening)

**Finished, reported and pushed on `t4/work`:**
- **WO-4.43** — `ede5637`, this report. 14 new cases; 109 pass; one
  page changed.

**Skipped:** none. **Stopped on:** the `git rm` of
`src/data/aircraftData.js` was **denied by the permissions layer**
(irreversible local deletion). Not retried, not worked around; every
import is gone and the bundle proves it, the file itself waits for the
lead. Nothing else: no failure outside my changes, no schema or env
need, nothing touched a live account; outbound calls were GETs to the
public list and inventory routes, which write nothing. Builds waited
for other terminals' `next build` (none running at build time; T3's tsc
runs were not builds).

**Left for Joseph:**
1. **Merge `t4/work` into the site's `main`** (`f9db8a2` → `ede5637`+).
   Pages deploys it; `/aircraft` then shows the empty state.
2. The empty-state wording (gap 2) and the hero paragraph (gap 3), via
   the lead.

**For the lead:**
- `git rm src/data/aircraftData.js` (gap 1).
- Tell me when WO-3.39 is live and a listing is approved; the live look
  at `/`, `/aircraft` and `/aircraft/<slug>` is one short follow-up.
