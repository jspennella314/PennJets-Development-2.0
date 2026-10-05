---
wo: WO-4.42
terminal: T4
branch: t4/work
commit: 1aebcf8
tested_against: "local checkout of t4/work at 1aebcf8, Node 22.19.0: npm test (vitest 3.2.7, happy-dom 20.14.5 for the section; node for the service); npm run build twice (once with a two-listing fixture in scripts/crm-inventory.cache.json, once with the committed empty cache; the production inventory route answered 404 both times, as the contract says it does until WO-3.39), dist/ prerendered by the build's Playwright Chromium and compared page by page with the WO-4.41 build (4e58925); npm run lint. Built against the contract, docs/integration/PENNJETS-SITE.md §5 at the CRM's main b2afb2c (WO-0.10, accepted 2026-10-05); no CRM route exists yet, so no live listing was rendered."
date: 2026-10-05
status: reported
---

# WO-4.42 report: the hidden Inventory section reads the CRM's listings

## Commit

`1aebcf8` on `t4/work`, pushed.

```
$ git show --stat --format= 1aebcf8
 scripts/crm-inventory.cache.json                   |   1 +
 scripts/postbuild.mjs                              |  35 +++++
 scripts/prerender.mjs                              |  36 +++++
 .../pages/AircraftDetail/AircraftDetail.jsx        | 165 +++++++++++++++++----
 src/components/pages/Home/Home.jsx                 |  61 +-------
 src/components/pages/Home/Inventory.jsx            |  91 ++++++++++++
 src/components/pages/Home/Inventory.test.jsx       | 146 ++++++++++++++++++
 src/services/inventoryApi.js                       |  92 ++++++++++++
 src/services/inventoryApi.test.js                  |  83 +++++++++++
```

## The gate, and what this was built against

WO-0.10 landed on the CRM's `main` at `b2afb2c` (2026-10-05 10:11,
status accepted) with §5 of `docs/integration/PENNJETS-SITE.md` and the
lead's note on this order ("the contract is written … build against the
contract and the prerender mirror"). Read from there, not changed.
**T3's route (WO-3.39) does not exist**: `app/api/public/inventory/` is
absent on the CRM's `main`, and production answers

```
$ curl -s -o /dev/null -w '%{http_code}' https://www.pennforce.pennjets.com/api/public/inventory
404
```

So everything below is against the contract and the mirror. The first
live listing is evidence for after WO-3.39 and Joseph's first approval.

## 1. The fetch replaces the constant

**`src/services/inventoryApi.js`**, `blogApi`-shaped:

- `getListings()`: one `GET {CRM}/api/public/inventory`, no parameters;
  `data.listings` mapped through `toCardListing`; **`[]` on any
  failure** — the 404 of today, a 500, a network error, bad JSON, a body
  with no `listings` array.
- `toCardListing(raw)`: only what the route sent. A listing without
  `slug`, `year`, `make`, `model`, `serial`, `hours` or `config` is
  **dropped**, not shown incomplete (the old `Home.jsx` rule, now
  enforced). `askingPrice` is kept only when it is a number; `images`
  are filtered through `safeImage` (WO-4.39's host gate) and the first
  survivor is the card's image. `url` is `/aircraft/<slug>`.
- `getListing(slug)`: one by slug, for the detail page.
- **No pagination**: the contract has no `pagination` field and no
  parameters, so there is nothing to page; the one request is the whole
  inventory. The comment in the file says where `blogPaging.js`'s loop
  would go if the CRM ever adds one.

**`src/components/pages/Home/Inventory.jsx`** replaces the `INVENTORY`
constant and the `InventoryCard` that lived in `Home.jsx`. State starts
`null`; the effect fetches; **`null` or `[]` renders nothing** — before
the fetch resolves, on an empty list, on a failed fetch. No placeholder,
no skeleton, no text naming an aircraft. `Home.jsx` now renders
`<Inventory />` where the section was (same position: after the latest
note, before Off-Market Access; verified in the prerendered HTML, below).

## 2. The card

The same fields in the same order — `{year} {make} {model}`, `Serial …`,
`N hours total time`, config — plus **the asking price only when the
route sends a number**, as the formatted amount and nothing else
(`$2,950,000`); `null` renders no line. The image is the first on the
CRM's store; an off-host image is dropped by `safeImage` and the card
renders without an image (no broken-image fallback that names anything).
The two buttons that called `navigate()` are `<Link>`s to the same URL,
so the card works without JavaScript in the prerendered page and can be
rendered in a test router. No "featured", no badge, no status.

## 3. The prerender and postbuild mirror the route

- **`scripts/postbuild.mjs`** fetches the route after the notes. A
  successful read **replaces `scripts/crm-inventory.cache.json` whole**,
  so a listing the route stopped sending leaves the cache at the next
  build (the Pages build runs daily). A failed read keeps the committed
  cache and logs why. Committed cache: `[]`.
- **`scripts/prerender.mjs`** answers `GET /api/public/inventory` from
  that cache with the route's shape, `{ listings: [...] }`, and reports
  the count; a missing cache lets the read through and says so.

```
[postbuild] inventory: 0 listing(s) from the committed cache (inventory route: HTTP 404)
[prerender] 1 inventory read(s) answered from scripts/crm-inventory.cache.json (0 listing(s)); none reached the CRM.
```

That `HTTP 404` line will appear on every build until WO-3.39 is live;
after it, `N listing(s) from the CRM`.

## 4. `/aircraft/<slug>`

`AircraftDetail.jsx` now resolves the parameter two ways: a **numeric
id** (`/aircraft/3`) reads the static data exactly as before, same
not-found redirect to `/aircraft`; **anything else** is a CRM slug,
looked up with `inventoryApi.getListing(slug)`, rendering a listing view
(name, headline if any, price if a number, the on-host images, a
Year/Make/Model/Variant/Serial/Total time/Configuration/Asking price
table, and the same contact block), or redirecting to `/aircraft` when
no listing matches. While a slug lookup is in flight the page renders an
empty white container, not "Aircraft not found" and not a placeholder.
The contact block is one shared component now, used by both views.

**What the static data still shows** (`src/data/aircraftData.js`, 134
lines, three entries, untouched): the 1982 Mitsubishi Diamond 1A
("Under Contract", offered for parts, an ASO link), the 2006 Beechcraft
Premier 1A ("Price on request (1/4 share)", three images), and the 1979
Beechcraft E55 Baron ("SOLD", two `/api/placeholder/800/600` image URLs
that resolve to nothing on Pages). `/aircraft` (`AircraftListing.jsx`)
lists those three with its own filters and a "Showing 3 of 3 aircraft"
count; its cards link to `/aircraft/<numeric id>`.

**What rewriting `/aircraft` would take** (report only, as ordered):
`AircraftListing.jsx` filters on fields the contract does not have
(category, price range, status, location, specifications) and a
manufacturer list hard-coded from the static file. Reading the CRM there
means either dropping those filters to what the route sends (year, make,
model, price), or the CRM carrying more. The three static entries are
copy — two of them say "Under Contract" and "SOLD" with prices — so
whether they stay, move into the CRM as NOT_LISTED/SOLD rows, or go is
Joseph's call before any rewrite. A page that mixes CRM listings with
static ones would show two kinds of truth; I would not build that
without an order that says which wins.

## 5. Nothing from the site side can publish

The site reads one route and filters nothing in: the CRM's LISTED gate
is the only gate. `Inventory.jsx` has no data of its own; the old
`INVENTORY` constant is gone, so there is no place on the site to add an
entry. The test asserts the rendered section contains no
"featured", "coming soon" or "off market" text, and the fixture build's
section (below) was searched for the same: 0 mentions.

## Evidence

### Tests (`npm test`, 28 new cases; the suite is 95)

```
 ✓ src/services/inventoryApi.test.js          16 tests
   toCardListing: maps the contract's example; askingPrice null stays null and a string is not a price;
     drops a listing without slug / year / make / model / serial / hours / config (7 cases);
     drops images on any host but the CRM's store; no images -> image null; garbage -> null
   getListings: reads GET /api/public/inventory once, no parameters;
     [] on 404, 500, a network error, and bad JSON; [] when the body has no listings array
   getListing(slug): finds one by slug, null otherwise
 ✓ src/components/pages/Home/Inventory.test.jsx   12 tests   (happy-dom, the route stubbed)
   nothing to show: renders nothing before the fetch resolves; empty list -> no section;
     failed fetch (network) -> no section; 404 -> no section; 500 -> no section;
     a body without `listings` -> no section; a listing missing serial is dropped -> no section, no placeholder
   one listing -> one card with every field: h3 "2004 Hawker 800XP"; li "Serial 258xxx",
     "6,200 hours total time", "8 passengers, forward galley, aft lav", "$2,950,000"; img src = the blob URL,
     alt = the name; both links -> /aircraft/2004-hawker-800xp-258xxx; "View Details"; no featured/coming soon/off market
   no asking price when the route sends null; an off-host image -> no image, the card still renders;
     the first on-host image wins when an off-host one comes first; two listings -> two cards, in the route's order

 Test Files  5 passed (5)
      Tests  95 passed (95)
   Duration  7.81s
```

`npm run lint` exit 0.

### Builds

Two builds in my own checkout, no other `next build` running (checked
before each). The production route answered 404 both times, so postbuild
used the cache: first a **two-listing fixture** written into
`scripts/crm-inventory.cache.json`, then the committed `[]`.

The fixture: the contract's Hawker example (blob image, price) and a
second listing with **an off-host image and `askingPrice: null`**, to see
both the gate and the missing price in the prerendered HTML.

```
--- fixture build (exit 0)
[postbuild] inventory: 2 listing(s) from the committed cache (inventory route: HTTP 404)
[prerender] 27 of 27 routes rendered in 50.7s, 138,744 characters of body text added
  /                                                            0 ->   3013 chars
[prerender] 1 inventory read(s) answered from scripts/crm-inventory.cache.json (2 listing(s)); none reached the CRM.

--- live build (exit 0)
[postbuild] inventory: 0 listing(s) from the committed cache (inventory route: HTTP 404)
[prerender] 27 of 27 routes rendered in 66.3s, 138,515 characters of body text added
  /                                                            0 ->   2784 chars
[prerender] 1 inventory read(s) answered from scripts/crm-inventory.cache.json (0 listing(s)); none reached the CRM.

both: dist/assets/index-cac12bd4.js   399.56 kB │ gzip: 116.72 kB   (WO-4.41: 395.39 kB; +1.06 kB gzip, the section, the service and the listing view)
      [postbuild] article bodies: 11 from cache, 0 fetched;  wrote 27 HTML files (11 Market Notes); 14 note-list reads and 11 article fetches answered from cache
```

**The prerendered home page, fixture build** (`dist/index.html`, read
back by script):

```
inventory section present, 1596 chars, between the latest-note card (char 8012) and off-market (11639)
  h3s:   2004 Hawker 800XP | 2008 Cessna Citation CJ3
  lis:   Serial 258xxx | 6,200 hours total time | 8 passengers, forward galley, aft lav | $2,950,000
         Serial 525B0200 | 3,100 hours total time | 7 passengers, belted lav           (no price line: null)
  imgs:  https://algxvqsvihyabn9r.public.blob.vercel-storage.com/aircraft/fixture/hawker.jpg   (one: the CJ3's wallpaperaccess.com image was dropped)
  hrefs: /aircraft/2004-hawker-800xp-258xxx | /aircraft/2008-cessna-citation-cj3-525b0200
  featured / coming soon / off market mentions: 0
```

**The live build**: `inventory section ABSENT`; the latest-note card and
off-market section sit where they did (chars 8012 and 10043, the same
offsets as the WO-4.41 build).

**Page comparison** (countdown digits, asset hashes, sitemap lastmod
masked):

```
live build  vs WO-4.41 build (4e58925):   pages: 29, identical: 29, differ: 0
fixture     vs live:                       pages: 29, identical: 28, differ: 1   (index.html)
```

So with the route empty or missing, the site is byte-identical to the
build before this order on every page including the home page; with
listings in the cache, only the home page changes, and only by the
section above. The cache file was restored to `[]` after the fixture
build (`od -c` → `[ ] \n`) and is what is committed.

## Scope

As ordered: `src/components/pages/Home/**` (Home.jsx, Inventory.jsx and
its test), `src/services/inventoryApi.js` (and its test),
`src/components/pages/AircraftDetail/AircraftDetail.jsx` (the lookup and
the listing view it needs), `scripts/postbuild.mjs`,
`scripts/prerender.mjs`, `scripts/crm-inventory.cache.json`. Not touched:
`/aircraft` (`AircraftListing.jsx`), `src/data/aircraftData.js`, any copy
beyond the two labels the card already had, any inquiry form. Only this
repository touched; the CRM repo was read.

## Known gaps

1. **No live listing yet.** The route is 404 on production until WO-3.39
   is merged, and `{ listings: [] }` after that until Joseph approves
   one. The fixture build and the tests are the evidence until then;
   the first real listing needs a look at the home page and at
   `/aircraft/<slug>` after a Pages build.
2. **`/aircraft/<slug>` is not prerendered.** postbuild writes no
   `dist/aircraft/<slug>.html`, so a deep link to a listing is served
   by the 404 shim and rendered client-side, like `/aircraft/3` today.
   Its `<head>` is the default site head. A per-listing head (title,
   `og:image` from the listing's first image) is a small follow-up once
   a listing exists to look at.
3. **The listing view has no test.** The order's evidence names the
   section's cases; the detail page's lookup is covered by
   `inventoryApi.getListing` only. A `MemoryRouter` test of
   `AircraftDetail` at `/aircraft/<slug>` is straightforward with the
   WO-4.41 runner if the lead wants it.
4. **`InventoryCard` has no `onError` on its image**, same as the card
   it replaced. A blob URL the CRM sends is expected to resolve; if one
   ever does not, the browser shows its broken-image glyph in that
   card. `LatestNote` hides on error; the two could be made consistent
   in a one-line order.
5. **A listing published between two Pages builds appears on the next
   build** (daily, or Joseph's push), not immediately on the static
   home page — the client refetches on load, so a visitor with
   JavaScript sees the live route's answer once the CDN's 5-minute
   cache passes. That is the same behaviour as the Market Notes list.
6. **The static `/aircraft` page** still shows its three entries, two of
   them with "Under Contract" / "SOLD" and prices (section 4). Joseph's
   decision before any rewrite.

## End of the queue (2026-10-05)

**Finished, reported and pushed on `t4/work`:**
- **WO-4.41** — `4e58925`, report `be42ac5`. 67 cases folded, 67 pass;
  CI Test step after the Chromium install (DOMPurify is inert under
  happy-dom; the NoteBody test renders in Chromium).
- **WO-4.42** — `1aebcf8`, this report. 28 new cases; 95 pass.

**Skipped:** none. **Stopped on:** nothing. No denied command this
session (pushes allowed), no failure outside my changes, no schema or env
need, nothing touched a live account; the only outbound calls were GETs
to the public list, article and inventory routes, which write nothing.
Builds waited for the lead's and T3's `next build` to finish before
starting (checked before each of my four builds).

**Left for Joseph:**
1. **Merge `t4/work` into the site's `main`** (`203efb3` → `be42ac5`+,
   WO-4.41 and WO-4.42). Pages deploys the merge; that run is the first
   CI execution of the Test step, and its duration is the number the
   WO-4.41 order asked for.

**For the lead:**
- WO-4.41: the DOMPurify/happy-dom finding (report §3) and the Test
  step's placement (§4); branch CI needs its own workflow if wanted
  (Known gaps 1).
- WO-4.42: tell me when WO-3.39 is on production and Joseph has approved
  a listing; the live evidence (home page, `/aircraft/<slug>`) is a
  short follow-up. Known gaps 2–4 are each a one-line order if wanted.
