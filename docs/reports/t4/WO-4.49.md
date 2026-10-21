---
wo: WO-4.49
terminal: T4
branch: t4/work
commit: 32848d3
tested_against: "local checkout of t4/work at 32848d3 (on top of origin/main a2bcc10), Node 22.19.0: npm run lint, vitest on the touched files (3 files, 52 tests), npm run build (exit 0, read the production CRM; caches refreshed as 7f4aa47), vite preview on localhost:4174 driven by the repo's Playwright Chromium 153 at 390x844 (mobile, touch) with the WO-4.47 wiring: every CRM read answered from the committed caches, lead and newsletter POSTs stubbed, the beacon 204; 0 leads, 0 newsletter posts reached anything. The before captures are the same harness on a build of a2bcc10. No deployed preview exists for this site; nothing here is deployed."
model: claude-opus-5-5
date: 2026-10-20
status: reported
---

# WO-4.49 report: the fixed chrome at 390 and the menu

**The fixed chrome at 390 is 135 px on every route except the home page
(was 195), and 171 px on the home page with the banner up (was 199);
the top alone is 64 px (was 124) and 100 px on `/` (was 128).** The
banner is on `/` only, one line, dismissible; the header is solid
everywhere; scroll padding follows the measured chrome; the sticky bar
steps aside while a field has focus and while Charter's Continue is on
screen. The menu is the ten rows in Joseph's order, every row 44 px,
and `/aircraft` redirects to `/buy`. Copy is unchanged; two copy
questions are in `docs/drafts/t4/for-joseph-WO-4.49.md`.

## Commit

`32848d3` on `t4/work`, pushed, with `7f4aa47` before it (the routine
cache refresh from the build, its own commit as on every order) and this
report's commit after it with the captures.

```
$ git show --stat --format= 32848d3
 index.html                                                       |  17 +++
 src/App.jsx                                                      |  16 ++-
 src/components/common/StickyContactBar/StickyContactBar.jsx      |  31 ++++-
 src/components/common/StickyContactBar/StickyContactBar.test.jsx |  78 ++++++++
 src/components/common/StickyContactBar/quoteTarget.js            |   3 -
 src/components/layout/Footer/Footer.jsx                          |   2 +-
 src/components/layout/Header/Header.jsx                          | 304 ++++++++---------
 src/components/layout/Header/Header.test.jsx                     | 132 ++++++++++
 src/components/pages/Blog/BlogArticle.jsx                        |   4 +-
 src/components/pages/Charter/Charter.jsx                         |   3 +-
 src/components/pages/Home/Home.jsx                               |   7 +-
 src/components/pages/PennShare/PennShare.jsx                     |   8 +-
 src/components/pages/Services/Services.jsx                       |   2 +-
 src/index.css                                                    |  33 +++++
 src/seo/siteMeta.js                                              |   5 -
 15 files changed, 454 insertions(+), 191 deletions(-)
```

## The chrome table, measured

From the DOM at 390x844, top of each page, after the network settled:
the banner's and the header's bounding boxes, the sticky bar's height
when `data-hidden` is false. "Top" is the lower edge of the top chrome.

| Route | Banner | Header | Top | Bar | Sum | Before: top / sum |
|---|---|---|---|---|---|---|
| `/` | 36 | 64 (at 36) | **100** | 71 | 171 | 128 / 199 |
| `/` banner dismissed | 0 | 64 (at 0) | **64** | 71 | 135 | n/a |
| `/charter` | 0 | 64 (at 0) | **64** | 71 | 135 | 128 / 199 |
| `/contact`, `/blog` | 0 | 64 | 64 | 71 | 135 | 128 / 199 |
| `/about`, `/services`, `/pennshare`, a note, `/gallery`, the four legal pages | 0 | 64 | 64 | 71 | 135 | 124 / 195 |
| `/buy`, `/sell`, `/consulting`, the 404 | 0 | 64 | 64 | 0 at load (the bar is hidden: Send is on screen) | 64 | 124 / 124 |

Every route is at or under the order's 120 px at the top, and `/` with
the banner at 100, under the 110 asked for. With the bar the sum is 135,
not "about 120": the bar is 71 px and the order keeps it (it now hides
whenever a field has focus, below). `scroll-padding-top` reads `112px`
on `/` and `76px` elsewhere (banner + header + 12 px of room).

Captures, before and after: `home-viewport-before.png` /
`home-viewport.png`, `charter-viewport-before.png` /
`charter-viewport.png`.

## 1. The banner (`Header.jsx`)

- Rendered only when the path is `/`. Elsewhere nothing is rendered and
  `--pj-banner-h` is set to `0px` in a layout effect keyed on whether the
  banner shows, so the header docks at 0 and no stale height survives a
  route change (tested on seven routes).
- One line, the day count only: **"Days left to close a 2026
  acquisition: 72"**, 36 px tall at 390 (40 from `lg`). No hours,
  minutes or seconds; the count ticks once a minute, so nothing in the
  chrome repaints every second. 1 January still reads "Happy New Year!"
  with no count (WO-4.29's rule, unchanged).
- Dismiss: a 44 x 44 `×`, `aria-label="Dismiss"`, measured 44 x 44. It
  stores `pj.banner.2026.dismissed = "1"` (the year comes from the date),
  docks the header in the click handler and unmounts the banner, so both
  move in one frame: the header's top read in the next animation frame
  is **0**, banner gone (`home-banner-dismissed.png`). A dismissal from
  another year does not hide this year's banner (tested).
- **No flash for a returning reader.** `index.html` runs a few lines in
  `<head>`, before anything paints: if the key is set it adds
  `pj-banner-dismissed` to `<html>`, and `index.css` then hides
  `[data-pj-banner]` and forces `--pj-banner-h: 0px`. Proved by loading
  the prerendered `/` with every script blocked and the key set: class
  present, banner `display: none`, header at 0
  (`home-static-dismissed.png`).
- **The first paint matches the mounted page.** The prerender runs at
  desktop width and serialises `<html style="--pj-banner-h: 40px;
  --pj-header-h: 80px">`; left alone, a phone would paint the header at
  40 under a 36 px banner and the hero 16 px low, then move both on
  mount. The same head script drops those two inline values, and
  `index.css` carries the per-width values (`64px`, `80px` from `lg`;
  `36px` / `40px` only when the banner is in the page, by `:has`). With
  scripts blocked and no key: banner 36, header at 36.
- Wording unchanged. The one-line form in the order replaces the full
  stop with a colon before the count; that is in the drafts file for
  Joseph.

## 2. The header

- Solid on every page (`bg-white/95 backdrop-blur-lg shadow-lg`); the
  transparent branch, the scroll listener and the two-state logo filter
  are gone. `/contact` now shows the dark logo on white (filter
  `brightness(0) saturate(1)`, was `brightness(0) invert(1)`):
  `contact-viewport.png` against `contact-viewport-before.png`.
- Docked at `top: var(--pj-banner-h, 0px)`; the `Math.max(bannerHeight,
  64)` float is gone.
- **Home h1**: the hero's copy box is padded by the chrome's height
  (`--pj-banner-h + --pj-header-h`) and centred in what is left. The h1
  is at **129–201 px** against a top chrome of 100 (was 79–151 against
  128, under the header).
- **Notes**: `pt-28` became `pt-20 sm:pt-24 lg:pt-28`. "← Back to Market
  Notes" is at **83–103 px** against a 64 px header, whole on first
  paint (was 115–135 against 124, half under it):
  `blog-long-viewport.png`.
- Hamburger: 44 x 44 measured (was 40 x 40); its accessible name, from
  Playwright's accessibility snapshot of the header, is **"Open menu"**
  closed and **"Close menu" [expanded]** open (was a nameless
  `button`).
- Desktop: the same list with Contact as the "Contact Us" button. Ten
  items and the phone number did not fit at 1024 (the logo squeezed,
  "Market Notes" touching the number), so from `lg` to `xl` the links
  are `text-sm` with tighter gaps and the logo cannot shrink; from `xl`
  as before. `charter-desktop-1024-header.png`,
  `charter-desktop-1280-header.png`.

## 3. Scroll padding and the sticky bar

- `html { scroll-padding-top: calc(var(--pj-banner-h, 0px) +
  var(--pj-header-h, 64px) + 12px) }` in `index.css`, next to
  `scroll-behavior`. The header keeps both values current with a
  `ResizeObserver` (the header bar's height, not the header's, so the
  open drawer does not move it). One rule serves `/` with the banner and
  every other route.
- The bar hides on `focusin` of any `input`, `select` or `textarea`
  inside a `form`, and shows on `focusout` unless focus moved to another
  such field; the footer and submit observer is unchanged. Hidden is
  the existing path: `translate-y-full`, `aria-hidden`, `tabIndex -1`.
- Charter's step-1 Continue carries `data-sticky-watch` and the
  observer's `watched()` includes `[data-sticky-watch]`; its type is
  still `button`. With Continue on screen the bar reads
  `data-hidden="true"` (was `false`): `charter-step1-continue.png`.
- `main` was `pb-24` (96 px); it is now
  `pb-[calc(72px+env(safe-area-inset-bottom))]`: the bar measured 71 px.

### Nine forms, Send with the form empty

Send scrolled into view as a reader would have it, then tapped; the
first invalid field measured after the browser's own scroll.

| Form | How | Field top–bottom | Top chrome | Clear |
|---|---|---|---|---|
| `/blog` newsletter | Send tapped | 405–453 | 64 | yes |
| note, Talk to a Broker | Send tapped | 253–295 | 64 | yes |
| note, newsletter | Send tapped | 405–453 | 64 | yes |
| `/buy` | Send is still disabled (WO-4.50): `form.reportValidity()` | 305–347 | 64 | yes |
| `/charter` (step 1, Continue) | Continue tapped | 239–281 | 64 | yes |
| `/consulting` | disabled: `reportValidity()` | 281–323 | 64 | yes |
| `/contact` | Send tapped | 304–346 | 64 | yes |
| `/pennshare` | Send tapped | 200–250 | 64 | yes |
| `/sell` | disabled: `reportValidity()` | 281–323 | 64 | yes |

Captures: `<form>-form-invalid.png` (and `-before`). On `a2bcc10` this
same sequence also left the field clear of the 124 px chrome on all
nine (the fields sat lower on the page); the case that put a field
under the header was the keyboard-up one, below. Buy, Sell and
Consulting still have the disabled Send this order leaves to WO-4.50,
so for those three the browser's validation was run with
`reportValidity()`, which focuses and scrolls the same way.

### Keyboard up (390 x 520, a field focused)

| Form | Focused | Bar (after) | Bar (before) | Field top–bottom (after) |
|---|---|---|---|---|
| `/blog` newsletter | email | hidden | hidden (footer on screen) | 405–453 |
| note, Talk to a Broker | first field | **hidden** | shown | 253–295 |
| note, newsletter | email | hidden | hidden | 405–453 |
| `/buy` | first field | **hidden** | shown | 305–347 |
| `/charter` | first field (From) | **hidden** | shown | 77–119 (before 39–81, under the 124 px header) |
| `/consulting` | first field | **hidden** | shown | 281–323 |
| `/contact` | first field | **hidden** | shown | 304–346 |
| `/pennshare` | name | **hidden** | shown | 200–250 |
| `/sell` | first field | **hidden** | shown | 281–323 |

Captures: `<form>-keyboard.png` (and `-before`). The 520 px viewport is
the resizing-viewport model (Android Chrome); iOS Safari keeps fixed
elements on the layout viewport, which a desktop browser cannot
reproduce, as WO-4.47 said.

## 4. The menu and `/aircraft`

- Drawer, read from the page at 390: Home, Charter, Buy, Sell,
  PennShare, Consulting, Services, About, Market Notes, Contact; each
  row **44 px** tall, 342 wide (was 40, and Contact was a 20 px-tall
  link round a button). The "Contact Us" button is gone from the drawer;
  Contact is the last row. `home-menu-open.png` against
  `home-menu-open-before.png`.
- `/aircraft` and `/aircraft/:id` are `<Navigate to="/buy" replace />`.
  `AircraftListing.jsx` and `AircraftDetail.jsx` and their tests are
  untouched; only their imports left `App.jsx` (an unused import fails
  the lint).

```
GET http://localhost:4174/aircraft                               200 text/html (the SPA shell) -> client lands on http://localhost:4174/buy, h1 "Buy an Aircraft"
GET http://localhost:4174/aircraft/2004-hawker-800xp-258xxx      200 text/html (the SPA shell) -> http://localhost:4174/buy, h1 "Buy an Aircraft"
```

On GitHub Pages there is no `aircraft.html` any more, so `/aircraft`
gets `404.html`, whose script hands the path to the SPA, which then
redirects; the same path any unknown route takes today.

**Links repointed to `/buy`**: the footer's "Browse Aircraft"
(`Footer.jsx:31`), the "Browse Aircraft" link at the foot of
`/charter` (`Charter.jsx:402`), the "Browse Aircraft" button on
`/services` (`Services.jsx:368`), and the four PennShare buttons
(`PennShare.jsx:84,115,245,259`, three of them the dead
`/aircraft/3` from the WO-4.46 sweep). The sticky bar's `/aircraft`
branch in `quoteTarget.js` went with the routes. The 404 page has no
`/aircraft` link.

**The route list.** There is no list in `vite.config.js` or in
`scripts/prerender.mjs`: `postbuild.mjs` writes one HTML file per key of
`ROUTES` in `src/seo/siteMeta.js`, and the prerender renders whatever
postbuild wrote. `'/aircraft'` left `ROUTES` (and the `/aircraft/`
branch of `metaForPath`), so the build writes **31 HTML files and a
sitemap of 30 URLs** (was 32 and 31) and no `aircraft.html`:

```
$ ls dist/aircraft*
ls: cannot access 'dist/aircraft*': No such file or directory
```

**What `git grep "/aircraft" src` still finds**, none a link a reader
can follow today:

```
src/App.jsx:45,46                                  the two redirect routes
src/components/layout/Header/Header.jsx:41         a comment
src/components/pages/AircraftDetail/*.jsx           the kept component, its comments and test
src/components/pages/AircraftListing/*.jsx          the kept component, its comments and test
src/services/inventoryApi.js:57,83                  a listing's url field, /aircraft/<slug>
src/components/pages/Home/Inventory.test.jsx        that field in a test
```

plus `/images/aircraft/…` image paths and the CRM's Blob store path in
tests. `inventoryApi.js:57` is the one judgement call: it is the URL the
home page's Inventory cards link to, and they render only when the CRM
has a listing, which is exactly when the redirect should come out. I
left it pointing at the detail page rather than at `/buy`, so restoring
the two routes is the whole change on that day. If the lead wants it
repointed now, it is one line.

## Build

```
$ npm run build            (exit 0)
✓ built in 8.34s
[postbuild] wrote data/market-notes.json: 16 note(s), 16,763 bytes
[postbuild] wrote 31 HTML files (16 Market Notes) and sitemap.xml with 30 URLs
[prerender] 31 of 31 routes rendered in 52.0s, 170,756 characters of body text added
$ npm run lint             (exit 0, 0 warnings)
```

Two builders: T3's `tsc --noEmit` was the other node process when this
built; no other build ran.

## Tests

The touched files' tests (the lead's audit build runs the suite):

```
$ npx vitest run src/components/layout/Header src/components/common/StickyContactBar src/seo
 Test Files  3 passed (3)
      Tests  52 passed (52)
```

New: `Header.test.jsx` (15: the banner on `/` only as one line with the
count, absent and docked at 0 on seven routes, dismiss stores the year's
key and docks at 0, stays dismissed, another year's key ignored, solid
on the dark-hero pages, the named 44 px hamburger, the drawer's ten
rows in order with no Aircraft and Contact once, the desktop nine with
Contact as the button) and `StickyContactBar.test.jsx` (6: hides on
focus of an input, a select and a textarea by the translate path, stays
hidden between fields, shows when focus leaves the form, ignores a field
outside a form). `siteMeta.test.js` (31) unchanged and green.

## Scope

`index.html`, `src/index.css`, `src/App.jsx`, `Header.jsx`,
`StickyContactBar.jsx`, `quoteTarget.js`, `Footer.jsx`,
`BlogArticle.jsx` (the article's top padding), `Charter.jsx` (the
Continue attribute and one link), `Home.jsx` (the hero's padding),
`PennShare.jsx` and `Services.jsx` (links only), `siteMeta.js`, two new
test files; the captures under `docs/audit/mobile-390/wo-4.49/`, the
drafts file and this report. No copy changed. Nothing from WO-4.50
(the three dead Sends, the radios, the consent box, PennShare's
`service`). The five untracked images under `public/images/Gallery/` are
still not mine.

## Known gaps

- The sum with the bar is 135 at 390 (the bar is 71 px). The order's
  120 is met at the top; the bar is now out of the way whenever a field
  has focus, but on a page with no field in focus it stays.
- The "Browse Aircraft" labels now open the Buy page; the label is copy
  and is Joseph's (drafts file).
- `:has()` sets the banner's height before the app mounts; a browser
  without it (Firefox before 121, Safari before 15.4) shows the header
  over the banner until the app mounts and measures, a fraction of a
  second on first load.
- All evidence is from `vite preview`; there is no deployed preview.
