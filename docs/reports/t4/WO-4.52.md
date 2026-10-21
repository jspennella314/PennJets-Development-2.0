---
wo: WO-4.52
terminal: T4
branch: t4/work
commit: 3ef6743
tested_against: "local checkout of t4/work at 3ef6743 (215fe49 plus the tile-height fix), on top of WO-4.51's df354d4 and origin/main a2bcc10, Node 22.19.0: eslint on every touched file (exit 0, no warnings), vitest on src/components/pages/Home, AircraftListing, AircraftDetail, Buy, src/components/layout, src/seo and inventoryApi (9 files, 91 tests, all pass), npm run build (exit 0, no cache change; inventory 0 listings from the CRM), vite preview on localhost:4174 driven by the repo's Playwright Chromium at 390x844 (mobile, touch) and 1440x900, every CRM read answered from the committed caches with a catch-all for the CRM host registered first; no request reached the CRM. No deployed preview exists for this site; nothing here is deployed."
model: claude-opus-5-5
date: 2026-10-21
status: reported
---

# WO-4.52 report: the home page restructured; /aircraft becomes Recent Inquiries

**Needs Joseph: the copy table in section 7.** Every line is in the code on
`t4/work`. Nothing merges until he approves or amends it.

## 1. The hero

The hero now holds three elements on the video and nothing else:
1. `h1` "The Access, You Deserve"
2. "Independent aircraft brokerage and consulting."
3. One button, Request a Charter Quote (`/charter#quote`, now `min-h-[44px]`)

"Talk to a Broker" is gone from the hero. It remains on every Market Note:
it is the section heading of the note's contact form (`BlogArticle.jsx:314`) and the
sticky bar's label there (`quoteTarget.js:24`). Measured values:

| at | chrome bottom | h1 | line | button |
|---|---|---|---|---|
| 390 | 100 (banner + header) | 203–275 | 287–335 | 359–403 (44 tall) |
| 1440 | 120 | 342–390 | 402–430 | 454–498 (44 tall) |

All three sit below the header at both widths. `home-viewport-390.png` and
`home-viewport-1440.png` show the result.

**The slogan, every place checked:**

| Place | Carries the slogan? | Action |
|---|---|---|
| `Home.jsx` h1 | yes, it was "The Access You Deserve" | comma added |
| footer tagline (§6) | new | "The Access, You Deserve" |
| `index.html:15` `<title>` and `siteMeta.js` `DEFAULT_TITLE` | no ("PennJets \| Private Jet Brokerage & Aviation Consulting") | left |
| `index.html:6` and `DEFAULT_DESCRIPTION` | no ("Independent aircraft brokerage and consulting. Buy, sell, or charter with someone who shows you the numbers.") | left |
| `og:title` / `og:description` (from `siteMeta`) | no, the same two strings | left |
| home JSON-LD `description` (`Home.jsx`) | no | left |

I added the slogan to none of the head tags, so no head change goes in the table.

```
$ git grep -n "Access You Deserve" -- src
(empty)
$ git grep -n "Access, You Deserve" -- src
src/components/layout/Footer/Footer.jsx:84:   <p ... data-footer-tagline>The Access, You Deserve</p>
src/components/pages/Home/Home.jsx:110:        The Access, You Deserve
src/components/pages/Home/Home.test.jsx:51:    expect(hero.querySelector('h1').textContent.trim()).toBe('The Access, You Deserve');
```

## 2. The three tiles

The section heading is the `h2` "Buy, sell, or charter with someone who
shows you the numbers.", moved from the hero. Below it, Buy, Sell and
Charter each get one sentence (my drafts, in §7):
- Each tile is a single `<Link>` to `/buy`, `/sell` or `/charter`, with `min-h-[44px]`.
- Under the Charter tile, at 12 px, is Joseph's approved Part 135 sentence, moved verbatim from the hero.
- Every list item spans two rows of a CSS subgrid, so the three tiles keep one height in the row and the note hangs under Charter alone.

The first build gave Charter a tile 40 px shorter than the other two, which
`3ef6743` fixed.

| at | layout | tiles (w × h) |
|---|---|---|
| 390 | stacked, at tops 246, 380 and 514 | 342 × 118 each |
| 1440 | one row, all at top 198 | 352 × 118 each |

The captures are `home-tiles-390.png` and `home-tiles-1440.png`.

## 3. "Why PennJets" removed

The section went whole: its heading and its four bullets. With it went the page's
own little footer block at the end of `Home.jsx`:
- "Call: … · Email: …"
- "PennJets LLC — Private aviation. Simplified."
- "PennJets is a broker and does not operate aircraft."

No replacement section was added.

**No legal line is lost.** The site footer on every page already carries
the full disclosure (`Footer.jsx:128`): "Penn Jets LLC is an air charter
broker, not a direct air carrier or direct foreign air carrier, and does not
own, operate, or have operational control of any aircraft. …". That covers
the removed sentence and more. The phone number and email are in the same
footer, in the header and on the sticky bar.

## 4. The cards leave; FeaturedListing

- **Removed from `Home.jsx`:** the five cards, their card component, the
  "Off-Market Access" section with its heading, and the footnote
  "Representative aircraft types. Availability on request.".
- **Moved, not deleted:** `OFF_MARKET_TYPES` now lives in
  `src/content/recentInquiries.js`.
- **The home page's `<Inventory />` is replaced by `<FeaturedListing />`**
  (`src/components/pages/Home/FeaturedListing.jsx`).
  - It reads the route through `useListings`, the fetch and fallback
    Inventory used, now extracted to `Home/useListings.js` so both share
    one copy.
  - It renders nothing while the list is in flight, empty, failed or 404:
    `null`, no wrapper.
  - With one or more listings it renders one card, the first by the API's
    order, under "Featured Listing", using `InventoryCard`.
  - `InventoryCard` has a new optional `to` that overrides its link. Here
    it points to `/buy?model=<make model>`, for example
    `/buy?model=Hawker%20800XP`.

**For the lead:** the order writes `<model>`. I send make and model
together, because the API's `model` alone is "800XP" and Buy prefills its
aircraft field with whatever arrives. The five inquiry cards already send
"Hawker 800XP" the same way. It is one line in `FeaturedListing.jsx` if
the bare model is wanted.

```
$ npm run build   (inventory: 0 listing(s) from the CRM)
$ grep -c 'FeaturedListing\|featured-listing\|Featured Listing' dist/index.html
0
```

The live page measured at 390 and 1440 contains no
`[aria-labelledby="featured-listing"]` element. The page runs **hero →
tiles → Latest Market Note → footer**: `main` has exactly three children,
`header`, `section#paths` and `section#latest-note`
(`home-full-390.png`, `home-full-1440.png`).

`FeaturedListing.test.jsx` covers both states:
- in flight, empty, failed or 404 leaves the container's innerHTML at `''`;
- two listings render one card, the first, linking to `/buy?model=Hawker%20800XP`;
- a listing with no price and no image renders neither.

## 5. /aircraft is "Recent Inquiries"

**How I read the order.** The menu still has no Aircraft item; the header
on `/aircraft` has no `/aircraft` link, which I measured. The page is
reached from the link under the Buy form and from the footer.
`/aircraft/:id` still redirects to `/buy`; I checked
`/aircraft/some-listing`, which lands on `/buy`. `/aircraft` is back in
`ROUTES`, so `dist/aircraft.html` is built and the sitemap lists it: 33
HTML files and 32 URLs, up from 32 and 31.

**The page** (`AircraftListing.jsx`, rewritten), top to bottom:
1. The `h1` "Recent Inquiries" and the lead line (§7).
2. `<Inventory />`, the CRM's real listings under their own "Inventory"
   heading. It renders nothing while the inventory is empty.
3. A separate "Recent inquiries" section with the five types. Each card
   keeps the same WebP image, category, seats and range. There is no
   price, no badge, and no filters (those went with "Aircraft for Sale").
   The five WebPs load at both widths.

A real listing therefore sits above the five, under its own heading, in a
different section, and never in the same grid. The rewritten
`AircraftListing.test.jsx` pins this.

**Card links.** Each card's button is now a real `<a>` (44 px), where the
home page used a `<button>` with `navigate`. Four go to
`/buy?model=<model>`. The Premier 1A goes to
`/charter?model=Premier%201A#quote`, as it did on the home page (its data
row carries `inquiry: 'charter'`). The order says each card links to
`/buy?model=` "as the home cards did". The home cards did that for four of
the five, so I kept the Premier exactly as it was. **For the lead:** it is one
field to change if all five should go to Buy.

**The detail pages, before and after:**

```
$ git grep -in "featured\|share price" e48ee93 -- 'src/components/pages/Aircraft*'
e48ee93:src/components/pages/AircraftListing/AircraftListing.test.jsx:70:    expect(el.textContent).not.toMatch(/coming soon|featured|off market|.../i);
$ git grep -in "featured\|share price" -- 'src/components/pages/Aircraft*'
src/components/pages/AircraftListing/AircraftListing.test.jsx:63:    for (const c of cards) expect(c.textContent).not.toMatch(/\$|featured|price/i);
```

The only hits, before and after, are tests asserting there is none: no
share price and no Featured badge exists in the code.
`AircraftDetail.jsx` (`:55-56` and `:83`) still prints a CRM listing's
**asking price** when the route sends a number. Per the order I left it as
it is, and I list it here for Joseph. The page is unreachable while
`/aircraft/:id` redirects.

**Links to the page:**
- **Footer**: "See recent inquiries" in the Aircraft column, second, after
  Browse Aircraft.
- **Buy page**: "See recent inquiries" inside the form card, under the
  error line, 44 px tall (`buy-see-recent-inquiries-390.png` and `-1440`).
  Tapping it lands on `/aircraft`, "Recent Inquiries", which I measured.

The captures are `aircraft-viewport-390/1440.png` and `aircraft-full-390/1440.png`.

**Noted, not changed:** the Buy page's aside still carries "Representative
aircraft types. Availability on request." (`Buy.jsx`). That is the same
footnote the order removed from the home page. Without cards beside it,
it describes nothing; it is Joseph's call whether it goes.

## 6. Footer tagline

"The Access, You Deserve" is now a line above the description paragraph in
the footer's company block (`footer-tagline-390.png`, `-1440`). Before,
there was no tagline line; WO-4.46 had removed "Private aviation.
Simplified. Monetized.".

## 7. Copy table for Joseph

| # | Where | Before | After |
|---|---|---|---|
| 1 | Home hero, `h1` | The Access You Deserve | **The Access, You Deserve** |
| 2 | Home hero, line | Independent aircraft brokerage and consulting. Buy, sell, or charter with someone who shows you the numbers. | **Independent aircraft brokerage and consulting.** |
| 3 | Home hero, Part 135 sentence | (in the hero) | removed from the hero, see 8 |
| 4 | Home hero, second button | Talk to a Broker | removed |
| 5 | Home, tiles heading (new `h2`) | (the hero's second sentence) | **Buy, sell, or charter with someone who shows you the numbers.** |
| 6 | Home, Buy tile (new, T4 draft) | none | **Tell us the mission and the budget, and we'll find the aircraft that fits both.** |
| 7 | Home, Sell tile (new, T4 draft) | none | **We price your aircraft against the current market and run the sale through closing.** |
| 8 | Home, under the Charter tile | (in the hero) | **Charter flights are arranged through vetted, FAA-certificated Part 135 operators across the United States.** (verbatim) |
| 9 | Home, Charter tile (new, T4 draft) | none | **Tell us the trip, and we'll arrange the flight with a vetted operator.** |
| 10 | Home, off-market heading | The best aircraft rarely reach the open market. Tell us your mission and we'll tell you what's available. | removed with the cards |
| 11 | Home, footnote | Representative aircraft types. Availability on request. | removed |
| 12 | Home, Why PennJets | the heading and four bullets | removed |
| 13 | Home, page-end block | Call / Email line; PennJets LLC — Private aviation. Simplified.; PennJets is a broker and does not operate aircraft. | removed (the site footer carries all three, the disclosure in full) |
| 14 | Home, Featured Listing heading (shows only with a real listing) | none | **Featured Listing** |
| 15 | `/aircraft` `h1` | Aircraft for Sale | **Recent Inquiries** |
| 16 | `/aircraft` lead line (T4 draft) | Discover our curated collection of premium aircraft. Each listing represents exceptional quality, performance, and value in the luxury aviation market. | **Aircraft Penn Jets has recently sourced, evaluated or been asked about. These are not exclusive listings; availability and pricing are confirmed at inquiry.** |
| 17 | `/aircraft` `<title>` | Aircraft for Sale \| PennJets (before WO-4.49) | **Recent Inquiries \| PennJets** |
| 18 | `/aircraft` meta description | Aircraft and fractional shares currently offered through PennJets. (before WO-4.49) | **Aircraft Penn Jets has recently sourced, evaluated or been asked about. Not exclusive listings; availability and pricing confirmed at inquiry.** |
| 19 | `/aircraft` empty-state sentence, "Can't Find What You're Looking For?" CTA, Contact a Consultant | as on "Aircraft for Sale" | removed with that page |
| 20 | Footer, Aircraft column | Browse Aircraft, Sell Your Aircraft, … | Browse Aircraft, **See recent inquiries**, Sell Your Aircraft, … |
| 21 | Buy page, under the form | none | **See recent inquiries** |
| 22 | Footer tagline | none (WO-4.46 removed "Private aviation. Simplified. Monetized.") | **The Access, You Deserve** |

The five inquiry cards' own text has not changed: model, category,
"Typically N seats", "Typical range ~N nm", "Tell us what you're looking
for".

Placement of "See recent inquiries" (rows 20 and 21) follows the lead's
reading of the message that was cut off. If Joseph meant somewhere else, he
can say so against those rows.

## Build and tests

```
$ npx eslint <every touched file>                      exit 0, no warnings
$ npx vitest run src/components/pages/Home src/components/pages/AircraftListing src/components/pages/AircraftDetail \
    src/components/pages/Buy src/components/layout src/seo src/services/inventoryApi.test.js
 Test Files  9 passed (9)
      Tests  91 passed (91)
$ npm run build                                         exit 0
[postbuild] inventory: 0 listing(s) from the CRM
[postbuild] wrote 33 HTML files (17 Market Notes) and sitemap.xml with 32 URLs
[prerender] 33 of 33 routes rendered in 49.4s, 181,063 characters of body text added
[prerender] 2 inventory read(s) answered from scripts/crm-inventory.cache.json (0 listing(s)); none reached the CRM.
```

The new tests:
- `Home.test.jsx` (3): the hero's three elements, the tiles and their
  note, and what left the page.
- `FeaturedListing.test.jsx` (3).
- `AircraftListing.test.jsx` (3): rewritten. The WO-4.43 filter tests went
  with the filters.

I did not run the full suite. The touched files' tests are above, and the
lead's build at the merge is the evidence.

The commits are `215fe49` (the work) and `3ef6743` (the tile height).
Neither build changed a cache. Only this repository was touched. My preview
is stopped, and no node process of mine is running.

## Addendum, 2026-10-21: row 9 and the merge onto main

Row 9 now reads **"Tell us the trip, and we'll compare vetted operators and show you the quotes."** (Joseph; the other 21 rows approved as written). Commit `b35b9cd`; `Home.test.jsx` pins all three tile sentences; `home-tiles-390.png` retaken (tiles 342 × 118 each, stacked). `t4/work` was **merged** with the new `main` (`9974bfa`, PR #14) in `e0d80e8`, not rebased, so no pushed history was rewritten; `main` is an ancestor of `t4/work`. Build after the merge: exit 0, 33 HTML files, no request reached the CRM; Home tests 21/21, lint 0.

## Addendum, 2026-10-21: the three pre-merge fixes that missed PR #14

Joseph: they ride with the WO-4.51/4.52 PR. One commit on `t4/work`.

| Where | Before | After |
|---|---|---|
| `/charter`, "Ready to go wheels up?" line (`Charter.jsx:408`) | Call (954) 546‑0763 or send your itinerary for a fast quote. | Call (954) 546‑0763 or send your itinerary. |
| `/charter` step 2, Send Request (`Charter.jsx:363`) | `disabled={!canSubmit}`: grey (opacity 0.4) until all seven fields held a value | `disabled={isSubmitting}`, as the three Sends in WO-4.50; `canSubmit` and `useMemo` removed |
| `/buy`, the aside | Representative aircraft types. Availability on request. | removed |

Charter step 2 at 390 (`charter-step2-invalid-390.png`): with the trip filled and Continue tapped, Send Request is enabled (opacity 1); tapped with the contact fields empty, focus lands on Name, 439 px from the top and clear of the 64 px header, with "Please fill out this field."; the webhook stub saw 0 requests and no request reached the CRM. In the build: `grep -c "fast quote" dist/charter.html` → 0, `grep -c "Representative aircraft types" dist/buy.html` → 0. Build exit 0 (33 HTML files), lint 0 on both files; neither file has tests of its own (StickyContactBar's 6 pass).
