# Outside review of www.pennjets.com, 2026-10-19

Outside reviewer, no prior knowledge of the project. Scope: the live site on a phone first (390 px and 430 px), then desktop; the four PennForce public routes the site calls; twelve competitor sites; a comparison and a proposed mobile-first structure. No code was changed. Screenshots are in `docs/audit/outside-review/shots/`, the tooling and raw data in `docs/audit/outside-review/tools/`.

Branch `review/outside`. Deployed build reviewed: `gh-pages` commit `03efaea` ("deploy: ee43b0b"), built 2026-10-19 12:10 UTC from `main` `ee43b0b`, which is the current head of `main`.

> **A new build went live while this review was running.** `gh-pages` was redeployed at 01:18 UTC on 20 October (commit `562198d`, "deploy: a2bcc10"), after the replica below was taken from `03efaea`. The new deploy carries the work orders merged in `jspennella314/PennJets-Development-2.0#13`: the four footer social links are now real URLs (`instagram.com/pennjets/`, `facebook.com/pennjets`, `linkedin.com/company/penn-jets-llc/`, `x.com/pennjets`), the home headline is "The Access You Deserve", the tagline no longer says "Monetized", the index logic changed (`blogIndex.js`) and the caches hold 16 notes. The home page and the Market Notes index were re-checked at 390 against the new deploy (`shots/home--390-fold-deploy-562198d.jpg`, `shots/blog--390-fold-deploy-562198d.jpg`): the headline still sits under the floating header (H1 79–151 px against a header band of 64–128 px, now two lines), the index is still 13.3 MB with button cards and no links, and the home page transfer rose from 1.4 MB to 1.9 MB. Findings 8, 11 and the "Monetized" row in 1.10 are annotated below. The team's own 390 px report from the same day is at `docs/audit/mobile-390/` on `main`; this review was done without reading it.

---

## 0. How this was done, and what could not be done

**What was possible.** The cloud environment this review ran in refuses outbound connections to every host except GitHub and package registries. `www.pennjets.com`, `www.pennforce.pennjets.com`, every competitor domain, and Google's PageSpeed API (daily quota exhausted for the anonymous project) were all denied at the proxy. So the review of Penn Jets was run against an exact local replica of the deployed site:

- The `gh-pages` tree (the files GitHub Pages serves) was checked out and served over HTTPS with `www.pennjets.com`, `pennjets.com` and `www.pennforce.pennjets.com` mapped to it, GitHub Pages routing semantics reproduced (`/about` serves `about.html`, unknown paths get `404.html`).
- The CRM's four public routes were answered from the repository's own build caches (`scripts/crm-posts.cache.json`, `crm-articles.cache.json`, `crm-inventory.cache.json`) plus the three newest notes extracted from the prerendered HTML, which is exactly how `scripts/prerender.mjs` builds the site. The list route answered 15 notes, the inventory route answered an empty list, which is what the 19 October build saw.
- Every page was loaded in Chromium at 390x844 (iPhone 14 class, device scale 3), 430x932 (iPhone Plus/Pro Max class) and 1366x900, with touch and mobile user agent on the phone sizes. Measurements were taken from the live DOM: fixed overlays, first call-to-action position, every interactive element under 44 px, every text node under 16 px, horizontal overflow, scroll containers, image natural versus rendered size, every link, every form field, transfer weight per page.
- Keyboard behaviour was simulated with a 390x508 viewport (844 minus a 336 px keyboard, the Android layout-viewport model), focusing every field in every form.
- Every form was submitted once with the name `REVIEW TEST (delete)`. The posts were captured by the local stub; **nothing reached the CRM**, so there are no test rows to delete in PennForce. Payloads are in `tools/pennjets-forms-data.json`.
- Lighthouse 13 (mobile emulation, simulated slow 4G and Moto G class CPU) was run against the replica for 14 routes.

**What was not possible, and is stated as such throughout.**

- Live server timing (GitHub Pages TTFB, CDN caching, the CRM's response time) is not in these numbers. Lighthouse's simulated throttling makes the scores comparable between pages, but the absolute values are the replica's.
- Four of the fifteen notes have images on Vercel blob storage (`algxvqsvihyabn9r.public.blob.vercel-storage.com`). That host was blocked, so in the screenshots those four images are empty panels. That is a limit of this environment, not a site defect, and it is flagged wherever it affects a reading.
- The newsletter route (`/api/public/newsletter/subscribe`) is not in the repository's contract or caches, so the stub answered 404 and the two newsletter forms show an error state in the screenshots.
- External links (the four social links, the three Creative Commons and Wikimedia credit links) could not be followed.
- **Competitor sites could not be loaded at all.** Part 2 is desk research from search-indexed titles, snippets and third-party listings only. There are no competitor screenshots, no competitor Lighthouse scores and no tap counts. `tools/competitors.mjs` captures all of that in one run from any machine that can reach the sites; the matrix in Part 3 has the columns ready for those numbers.

To rerun everything from a machine with normal network access, see the header comments in each file under `tools/`.

---

## Part 1. pennjets.com on a phone

### 1.1 Findings ranked by what costs the business leads on a phone

Severity: **A** loses leads today, **B** erodes trust or wastes the visit, **C** polish.

| # | Sev | Finding | Evidence |
|---|---|---|---|
| 1 | A | **Three fixed bars eat 195 px of every 844 px screen.** Countdown banner 60 px, header 64 px, sticky Call / Request a Quote bar 71 px. The reader gets 649 px (77%) at 390 and 737 px at 430. On every page, forever, including the cookie policy. | `shots/home--390-fold.jpg`, `shots/cookie-policy--390-fold.jpg`; overlay numbers in `tools/pennjets-audit-digest.txt` |
| 2 | A | **The main nav does not contain Buy, Sell, Consulting or Contact as pages.** Hamburger lists Home, Aircraft, Charter, PennShare, Services, About, Market Notes, then a Contact Us button. `/sell` and `/consulting` are reachable only from the footer; `/buy` only from the aircraft cards and the empty inventory page. The three best-converting pages on the site (short form above the fold, measured below) are the three hardest to find. | `shots/menu-open-home--390.jpg`; link map in digest "ALL LINKS" |
| 3 | A | **Market Notes index weighs 13.3 MB on a phone and takes 10.7 s to paint its largest element** (Lighthouse LCP, CLS 0.51, performance 45). Full-resolution gallery JPEGs (4473x7952 `pc12.jpg` 4.2 MB, `pj-interior.jpg` 3.0 MB, `future-aviation.jpg` 2.2 MB, `falcon.jpg` 1.9 MB) and the 1.35 MB 1024x1024 logo PNG are each drawn into a 310x174 card. The four blob-hosted images are on top of that in production. This is the page every LinkedIn and Instagram link lands next to. | Lighthouse table 1.6; `shots/blog--390-full.jpg` |
| 4 | A | **Market Note cards are not links.** Titles and "Read More" are `onClick` buttons, so a reader cannot long-press to open in a new tab, the cards carry no `href` for crawlers (the prerendered `blog.html` contains zero `/blog/...` anchors), and the back-forward cache is disabled on every page. The related-notes cards at the foot of each article have the same construction. | `blog.html` grep: 0 anchors; Lighthouse `bf-cache` fails on all 14 routes |
| 5 | A | **Every article re-fetches itself and shows a spinner on arrival.** The HTML is prerendered, but `main.jsx` calls `createRoot().render()`, not `hydrateRoot`, so React throws the prerendered article away, shows "Loading...", calls `GET /api/public/blog/{slug}` and re-renders. A social click sees article, blank, spinner, article. If the CRM is slow or down the reader sees "Note Not Found". The CRM's latency could not be measured from here. | `src/main.jsx:6`, `BlogArticle.jsx` `loadArticle` |
| 6 | A | **Forms hide fields behind the sticky bar while the keyboard is up.** The bar only hides when a submit button is on screen; while typing in the upper fields it is not, so with a keyboard open the bar covers the next field: Charter (Departure and Return date), Contact (Service Interest), Buy/Sell/Consulting (Email), PennShare (Comments), note form (Phone, Message). The translucent header also lets labels scroll under it ("Return Date" ghosted under the header). | `shots/keyboard-charter--390.jpg`, `shots/keyboard-contact--390.jpg`; table 1.5 |
| 7 | A | **Two notes have broken hero images in production, and the index shows a grey block with the title typed on it.** `how-to-buy-your-first-private-jet…` points at `/images/Gallery/gulfstream.jpg` and the Bombardier note at `/images/Gallery/Bombardier_Challenger_650.jpg`; neither file is in the build (404). The article renders an empty 16:9 grey panel 219 px tall under the byline. | `shots/blog-how-to-buy-your-first-private-jet-2025-step-by-step-buy--390-fold.jpg` (image 404 in console), `shots/blog--390-full.jpg` |
| 8 | A | **Social links are unverified and one is malformed.** Footer links go to `instagram.com/pennjets`, `facebook.com/pennjets`, `twitter.com/pennjets` and `linkedin.com/pennjets`. LinkedIn URLs take the form `linkedin.com/company/<slug>` or `/in/<slug>`; a bare `/pennjets` is LinkedIn's 404. The footer source still carries the comment "Social media links will be added when accounts are set up". A web search for Penn Jets on these networks returned nothing. Buyers arriving from LinkedIn and Instagram will tap these to check you are real. **Update:** the 01:18 UTC deploy replaced all four with real URLs, and the LinkedIn one is well formed (`/company/penn-jets-llc/`). They still could not be followed from this environment, so whether each profile exists and is public remains to be confirmed by tapping them on a phone. | `Footer.jsx:49-52, 66-70` at `ee43b0b`; `shots/home--390-fold-deploy-562198d.jpg` |
| 9 | B | **The inventory is empty and "Aircraft" is the second item in the nav.** `/aircraft` opens with "Discover our curated collection of premium aircraft. Each listing represents exceptional quality…" and then "The best aircraft rarely reach the open market" and one button. The home page's Inventory section renders nothing. A top-level slot on a phone menu leads to a page with no aircraft. | `shots/aircraft--390-fold.jpg` |
| 10 | B | **Copy contradicts the business as described in CLAUDE.md and on the About page** (one broker, founded 2025, no fleet): "Proven Track Record: Successful transactions and satisfied clients across all aircraft categories", "Global Network: extensive relationships … worldwide", "Dedicated consultants", "Professional photography and marketing materials", "Visit us at any of our convenient locations" (one address). Full list in 1.10. | `Services.jsx`, `Contact.jsx` |
| 11 | B | **Headline collides with the header on the home page.** At 390 and 430 the H1 "Access, You Deserve" starts at 97 px, inside the floating header's 64–128 px band; the logo sits on the first line and the hamburger on "Deserve". On `/contact` the inverted (white) logo is drawn across a white strip and is half invisible. On every note "← Back to Market Notes" is cut in half under the header (`pt-28` = 112 px, overlays = 124 px). **Update:** in the new deploy the headline reads "The Access You Deserve", wraps to two lines, and starts at 79 px, so the overlap with the logo (which ends at 120 px) is larger than before. | `shots/home--390-fold-deploy-562198d.jpg`, `shots/home--390-fold.jpg`, `shots/contact--390-fold.jpg`, `shots/blog-617-aircraft-21-for-sale-inside-the-g550-market--390-fold.jpg` |
| 12 | B | **Services page: first call to action 2.4 screens down; About page: 4.1 screens down** (its only CTA is at the end). The Services hero alone fills the first screen at 390 with a 48 px three-line headline and a badge. | `shots/services--390-fold.jpg`, `shots/about--390-fold.jpg` |
| 13 | B | **Share previews are uneven.** Seven of fifteen notes fall back to the generic `og-card.png`; `why-we-publish-market-notes` uses the 1.35 MB square logo PNG as its `og:image`; four older notes use raw 2–4 MB gallery JPEGs as `og:image`, one of them 4473x7952 portrait (`pc12.jpg`), which LinkedIn will crop to its centre strip and some crawlers will refuse on size. Title suffixes alternate between "| Penn Jets", "| PennJets" and "| PennJets Market Notes". One meta description is 443 characters. | Table 1.9 |
| 14 | B | **Touch targets under 44 px on every page: 22–41 per page.** Hamburger 40x40 with no accessible name (Lighthouse `button-name` fails on all 14 routes), footer links 24 px tall, "← Back to Market Notes" 20 px, "Add phone…" disclosure 20 px, photo-credit links 14 px, radio buttons 16 px, consent checkbox 13x16, category chips 36 px, form inputs 42 px, selects 40 px. | Table 1.4 |
| 15 | B | **Text under 16 px carries the pitch.** Home hero sub-line, charter benefit copy, all form labels, the sticky bar labels, every button in the charter flow and all "By submitting…" lines are 14 px; countdown labels 12 px; photo credits 11 px. | Table 1.4 |
| 16 | B | **Terms of Service "Effective Date" is today's date, every day** (`new Date().toLocaleDateString()`), so the terms claim to take effect on the day you read them. Compliance says 28 September 2025; Privacy and Cookie say 20 September 2026. | `TermsOfService.jsx:11` |
| 17 | B | **The countdown banner says "Days left to close a 2026 acquisition." without saying why.** A charter customer, a seller and a cookie-policy reader all get a 60 px timer to 31 December. It also animates every second (a layout shift source Lighthouse lists on every page). | every `--390-fold.jpg` |
| 18 | C | Charter page is titled "Light & Midsize Jet Charter from NY/NJ" with "Popular routes from New York and New Jersey", while the only address is Miami and the phone is a 954 (Broward) number. A social visitor cannot tell where the broker is. | `charter.html` title, `Contact.jsx` |
| 19 | C | Raw server error strings are shown to visitors (the newsletter form printed the stub's `"stub: unknown route …"` verbatim; in production it will print whatever the CRM's `error` field says). | `shots/form-note-newsletter--390-after.jpg` |
| 20 | C | `/gallery` is 18.5 MB, reachable by URL, `noindex` and disallowed in robots, and still ships to anyone who finds it. | Table 1.6 |

### 1.2 The fixed chrome, measured

| Viewport | Banner | Header | Sticky bar | Left for content | Share of screen |
|---|---|---|---|---|---|
| 390x844 | 60 px | 64 px | 71 px | 649 px | 77% |
| 430x932 | 60 px | 64 px | 71 px | 737 px | 79% |
| 1366x900 | 60 px | 80 px | 71 px | 689 px | 77% |

The sticky bar is well built (it hides when the footer or a submit button is on screen, it changes its target per page, it is thumb-height). The problem is that it is the third bar. On `/buy`, `/sell` and `/consulting` the submit button's top edge lands at 819–843 px on first paint, so the bar hides itself and the submit button is cut off at the screen edge: the one moment the bar is gone is the moment a button is needed.

The header floats transparent on "dark hero" pages (`/`, `/charter`, `/contact`, `/blog`) at `top: 64px` and docks white at `top: 60px` everywhere else. The 4 px difference and the transparent state produce the three collisions in finding 11.

### 1.3 Page by page at 390, with 430 and desktop where they differ

Scroll counts use the 649 px usable height at 390. "First CTA" is the first non-fixed element whose label is an action (quote, contact, send, request, tell us, subscribe…).

| Route | Above the fold at 390 | First CTA | Height (screens) | Notes at 430 | Desktop |
|---|---|---|---|---|---|
| `/` | Banner, floating header over the hero video poster, H1 "Access, You Deserve" (colliding with the logo), two 14 px sub-lines, "Request a Charter Quote", "Talk to a Broker", top of the Latest Market Note card. | 309 px, on screen | 6.4 | Same, one more line of the note card | 1366: hero 80vh, CTA at 436 px; "Contact Us" outline button in header is low contrast on the sky |
| `/charter` | Dark gradient, H1 "Travel, Simplified.", one line, "Request a charter quote", "Call (954) 546‑0763", start of "Why charter through a broker". | 277 px, on screen | 6.4 | Same | Quote form two columns; "What happens next" aside beside it |
| `/buy` | H1, one line, Name, Email (ownership radios and the aircraft field just below), disclosure toggle, "Send Inquiry" at the bottom edge. Sticky bar hidden. | 819 px, 1.1 screens | 3.5 | 795 px | Form and "How buying works" side by side; everything in one screen |
| `/sell` | Same shape as Buy with Make, Model, Year. | 843 px, 1.1 | 3.5 | Same | One screen |
| `/consulting` | H1, one line, Name, Email, Phone, textarea 162 px. | 843 px, 1.1 | 3.5 | Same | One screen |
| `/pennshare` | Badge "FRACTIONAL OWNERSHIP", two-line blue H1, 20 px paragraph, two full-width buttons, top of "Current Share Offering". | 494 px, on screen | 7.8 | Same | Two columns |
| `/services` | Docked header with a 96 px white strip above the hero, badge, three-line 48 px H1, 20 px paragraph. No CTA. | 1,662 px, 2.4 screens | 11.8 (longest page after the index) | 1,604 px | Five service cards in a 3-column grid; four "Our Approach" cards with pulsing blur circles |
| `/about` | H1, one paragraph, "Our Story" heading and the bio. | 2,806 px, 4.1 screens | 5.5 | 2,723 px | Single centered team card in a wide empty grid |
| `/contact` | Dark hero taking 900 px display (H1 + two-line paragraph), the half-visible logo, "Send us a Message", Name, Email. | 1,109 px, 1.5 | 4.5 | 1,080 px | Form left, contact details right; the "Our Locations" grid has one card in a three-column grid |
| `/blog` | Dark hero 810 px display tall (H1 + three-line sub-line), three filter chips, "Latest Market Notes · 15 notes". The first card starts on screen two. | 8,800 px (Subscribe), 12.3 screens; the cards' "Read More" buttons are not links | 12.6 | Same | 3-column cards, 4,677 px |
| `/aircraft` | H1 "Aircraft for Sale", the "curated collection" paragraph, the empty-state sentence, "Contact a Consultant". | 649 px, exactly 1 screen | 2.9 | Same | One screen |
| `/blog/<note>` | "← Back" half under the header, date · read time, H1 (36 px, three lines on a long title), byline with photo, hero image panel, credit line, lede. | Talk-to-a-Broker form 3,770–6,033 px down (5.6–9.3 screens); the sticky bar's "Talk to a Broker" anchors to it | 7–11 | Same | 6,238 px for the G550 note |
| `/gallery` | H1 "Gallery" and a dark hero; 18.5 MB of images below. | 4,308 px | 6.0 | | |
| `/privacy-policy`, `/terms-of-service`, `/cookie-policy`, `/compliance` | H1, date line, first section. Cookie table is wider than the screen and scrolls sideways inside its container. | footer only | 5–8 | | |
| 404 | "404 / Page not found", two buttons. Served with a real 404 status and then the `?/path` hop into the SPA (the deep-link shim; the full home bundle plus the 821 KB hero video load for a 404). | 320 px | 2.6 | | |

Horizontal overflow: none on any page at any width (`scrollWidth` equals `innerWidth` everywhere). Scroll traps: none; the only nested scroll container is the cookie policy table.

### 1.4 Touch targets and text size at 390

Count of interactive elements under 44 px in either dimension, and text nodes under 16 px, per page (the full lists with sizes are in `tools/pennjets-audit-digest.txt`).

| Route | Targets < 44 px | Worst offenders | Text nodes < 16 px |
|---|---|---|---|
| `/` | 30 | credit links 70x14, hamburger 40x40, footer links 358x24, `joe@pennjets.com` 123x17 | 68 (11 px credit, 12 px countdown labels, 14 px hero sub-line and banner) |
| `/charter` | 26 | "Prefer to talk? Contact us" 169x20, inputs 42 px, footer | 77 (every benefit paragraph, every button label, every form label at 14 px) |
| `/buy` | 30 | radios 16x16, "Add phone…" 274x20, select 40 px | 31 |
| `/sell`, `/consulting` | 29, 26 | "Add phone…" 242x20, inputs 42 px | 28, 24 |
| `/pennshare` | 24 | consent checkbox 13x16, "Add phone and share size" 187x20 | 23 |
| `/services`, `/about` | 22 | footer only | 38, 22 |
| `/contact` | 26 | "Add phone and company" 181x20, select 40 px | 20 |
| `/blog` | 41 | category chips 49x36 / 133x36, honeypot input, footer | 129 (card excerpts and metadata at 14 px) |
| `/aircraft` | 22 | footer | 13 |
| notes | 29–31 | "← Back to Market Notes" 161x20, "MARKET NOTES" category 115x20, credit links 58–79x15, mailto/tel 310x20 | 29–35 |

Base body size is 16 px and article body text is 18 px, which is good. The problem is concentrated in the components: `text-sm` (14 px) is used for the sticky bar, every charter CTA, every form label and every "By submitting" line, and the footer's 16 px links have 24 px line boxes 12 px apart.

### 1.5 Keyboard: which field is hidden when it is focused

Simulated with a 390x508 viewport (Android model: the layout viewport shrinks, fixed bars stay visible). On iOS the layout viewport does not shrink, the keyboard covers the sticky bar, and Safari scrolls the field into view, so the iOS failure is the 124 px header rather than the bar. Either way the field is not where the reader expects it.

| Form | Fields | Hidden behind the sticky bar when focused | Hidden under the header |
|---|---|---|---|
| Contact | 4 | Service Interest | none |
| Charter step 1 | 5 | Departure Date, Return Date | "Return Date" label scrolls under the translucent header |
| Buy | 4 (+2 radios) | Email | none |
| Sell | 5 | Email, Year | none |
| Consulting | 4 | Email, "What do you need help with?" | none |
| PennShare | 3 (+checkbox) | Additional Comments | none |
| Note: Talk to a Broker | 4 | Phone, Message | none |
| Newsletter (index and note) | 1 | none (submit is adjacent, so the bar hides) | none |

Screenshots: `shots/keyboard-<page>--390.jpg`.

### 1.6 Weight and Lighthouse (mobile emulation, local replica, simulated slow 4G)

Transfer is the sum of `content-length` headers in the replica; Lighthouse "bytes" is its own total-byte-weight. Both exclude the four blob-hosted note images.

| Route | Transfer at 390 | Lighthouse bytes | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS | Largest requests |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | 1,396 KB | 612 KiB | **71** | 94 | 96 | 100 | 3.7 s | 5.1 s | 70 ms | 0.079 | hero video 821 KB, JS 379 KB |
| `/charter` | 506 KB | 507 KiB | 80 | 94 | 100 | 100 | 3.7 s | 3.8 s | 30 ms | 0 | JS 379 KB |
| `/buy` | 499 KB | 500 KiB | 80 | 94 | 100 | 100 | 3.6 s | 3.8 s | 60 ms | 0.008 | |
| `/sell` | 498 KB | 499 KiB | 79 | 94 | 100 | 100 | 3.8 s | 3.9 s | 30 ms | 0.008 | |
| `/consulting` | 497 KB | 498 KiB | 80 | 94 | 100 | 100 | 3.7 s | 3.8 s | 20 ms | 0.008 | |
| `/pennshare` | 621 KB | 622 KiB | 75 | 88 | 100 | 100 | 3.8 s | 4.5 s | 50 ms | 0.008 | Premier 1A JPG 116 KB (1536x1024 into 358 px) |
| `/services` | 524 KB | 525 KiB | 79 | 89 | 100 | 100 | 3.8 s | 4.0 s | 50 ms | 0.008 | |
| `/about` | 511 KB | 512 KiB | 79 | 89 | 100 | 100 | 3.7 s | 4.0 s | 20 ms | 0.008 | |
| `/contact` | 500 KB | 501 KiB | 80 | 91 | 100 | 100 | 3.6 s | 3.8 s | 30 ms | 0 | |
| `/blog` | **13,323 KB** | 13,374 KiB | **45** | 90 | 96 | 100 | 3.7 s | **10.7 s** | 30 ms | **0.509** | pc12.jpg 4,154 KB, pj-interior.jpg 3,015 KB, future-aviation.jpg 2,177 KB, falcon.jpg 1,855 KB, logo PNG 1,349 KB |
| `/aircraft` | 495 KB | 497 KiB | 80 | 92 | 100 | 100 | 3.7 s | 3.8 s | 20 ms | 0.041 | |
| `/blog/617-aircraft…g550-market` | 541 KB (+ blob hero) | 565 KiB | 67 | 84 | 96 | 100 | 3.8 s | 5.1 s | 250 ms | 0.009 | JS 379 KB |
| `/blog/jet-a-at-a-six-month-high…` | 539 KB (+ blob hero) | 559 KiB | 72 | 85 | 96 | 100 | 3.8 s | 5.1 s | 90 ms | 0.008 | |
| `/blog/how-to-buy-your-first-private-jet…` | 516 KB | 544 KiB | 73 | 84 | 96 | 100 | 3.6 s | 4.8 s | 120 ms | 0.008 | hero image 404 |
| `/blog/why-we-publish-market-notes` | 1,861 KB | not run | | | | | | | | | logo PNG 1,349 KB as the hero |
| `/gallery` | **18,496 KB** | not run | | | | | | | | | commerical.jpg 4,620 KB, pc12.jpg 4,154 KB, pj-interior.jpg 3,015 KB |

Audits failing on every route: `button-name` (the hamburger has no accessible name), `bf-cache` (back-forward cache disabled; the `onClick`-navigation pattern and the view beacon's `keepalive` fetch are the usual causes), `unused-javascript` (about 200 KiB of the 379 KB bundle is unused on any given page; the site ships one bundle with every page's code). On the index: `errors-in-console` (the two 404 images), `color-contrast` (the blue "All" chip and the blue primary buttons), `layout-shifts` (cards appear after fetch, images have no dimensions). On the notes: `label` (the Talk-to-a-Broker inputs have labels without `for`, so tapping the label does not focus the field), `color-contrast` (white on `primary-600` buttons, `text-primary-100` on the newsletter band). On PennShare and `/aircraft`: `heading-order` (H3 before any H2).

FCP is 3.6–3.8 s on every route including the prerendered ones: the 48 KB stylesheet and the font are render-blocking, and nothing paints until they arrive. The prerendering is doing its job for crawlers but not yet for first paint.

The 2026-09-19 audit measured 18.6 MB for the home page and 12 MB for an article. The home page is now 1.4 MB and an article 0.5 MB: real progress. The index and the gallery were not on that list and still have the original problem.

### 1.7 Every link

Internal links (all resolve): `/`, `/about`, `/about#team`, `/aircraft`, `/blog`, `/buy`, `/charter`, `/charter#quote`, the seven `/charter?from=…&to=…#quote` route links, `/compliance`, `/consulting`, `/contact`, `/cookie-policy`, `/pennshare`, `/pennshare#inquire`, `/privacy-policy`, `/sell`, `/services`, `/services#sales`, `/services#acquisition`, `/services#charter`, `/services#analysis`, `/terms-of-service`, `#quote`, `#talk-to-a-broker`, `/blog/<slug>` (only from the home card and the sticky bar; index and related cards are buttons). All four `/services#…` anchors exist as `id`s on the Services page. `/about#team` exists. `mailto:joe@pennjets.com` on 7 pages, `tel:+19545460763` on every page; only one phone number appears anywhere on the site (the code comment about a second number is stale).

External links: `https://instagram.com/pennjets`, `https://facebook.com/pennjets`, `https://twitter.com/pennjets`, `https://linkedin.com/pennjets` (malformed, see finding 8), all `target="_blank" rel="noopener noreferrer"`, in the footer of every page with a 16 px icon and a 24 px tall hit area; and the credit links on two notes (Wikimedia Commons, creativecommons.org). None could be followed from this environment.

Links that are not links: every Market Note card on the index, every related-note card on an article, the breadcrumb on an aircraft detail page, the "← Back to Market Notes" button, the category label on an article, the aircraft cards' "Tell us what you're looking for" buttons on the home page, every button on Services and About (`navigate()` on click). Crawlers see none of them, and a phone reader cannot open any of them in a new tab or copy the address.

### 1.8 Every form, submitted once

All submissions were captured locally. Name `REVIEW TEST (delete)`, email `review-test-delete@example.com`, phone `(000) 000-0000`. Time is from page load to the success message.

| Form | Page | Fields at 390 | Steps | Result shown | Payload posted | Notes |
|---|---|---|---|---|---|---|
| Contact | `/contact` | Name, Email, [Phone, Company behind "Add phone and company"], Service Interest, Message | 1 | "Thank you. Your message is in. We'll be in touch shortly." | name, email, phone, service `charter`, message prefixed "Service interest: Charter Brokerage", pageUrl | Service select maps five labels to four CRM values; "Other" sends no service. |
| Charter quote | `/charter#quote` | Step 1: From, To, Departure, Return, Passengers. Step 2: Name, Email, Phone, Notes | 2 ("Continue" then "Send Request") | "Thanks. Your request is in. We'll follow up shortly." | service `charter`; trip packed into `message` as labelled lines | Submit is disabled until all required fields are filled, with no explanation of why. Route links prefill From/To. The "Continue" button is `type=button`, so the sticky bar stays up over step 1. |
| Buy | `/buy` | Name, Email, Sole/Fractional radios, Aircraft or category, Timeline, [Phone, Passengers, Trip length] | 1 | "Thanks. Your inquiry is in." | service `buy`; "Ownership: Sole … Timeline: Within 3 months" | |
| Sell | `/sell` | Name, Email, Make, Model, Year, [Phone, Total time, Location] | 1 | "Thanks. Your details are in." | service `sell` | |
| Consulting | `/consulting` | Name, Email, Phone, "What do you need help with?" | 1 | "Thanks. Your request is in." | service `consulting` | |
| PennShare | `/pennshare#inquire` | Full Name, Email, [Phone, Share size], Comments, consent checkbox | 1 | "Thanks. Your inquiry is in." | **service `buy`**, "PennShare inquiry / Interest: 1/4-share" | PennShare leads are indistinguishable from Buy leads in the CRM filter except by message text. Only form with a consent checkbox (13x16 px). |
| Talk to a Broker | every note | Name, Email, Phone, Message | 1 | "Thank you. Joseph Pennella will be in touch shortly." | name, email, phone, message, `blogPostSlug`, pageUrl; **no `service`** | Goes to the author's webhook. Inputs have labels without `for`. |
| Newsletter (note) | every note | Email | 1 | Error (stub had no route); shows the server's raw error string | `{email, honeypot:""}` to `/api/public/newsletter/subscribe` | Could not be verified against the CRM. |
| Newsletter (index) | `/blog` | Email | 1 | Error, no message rendered in the screenshot | same | The index form has no visible label for the field and the honeypot input is positioned at −9,999 px (fine). |

Observed on all forms: no spam protection beyond the newsletter honeypot; no confirmation email path visible; UTM parameters are forwarded only when present on the current URL, which they are not after the SPA route change from a note to `/charter` (the parameters live on the note's URL, and `navigate('/charter#quote')` drops them). A social visitor who reads a note and then taps the sticky bar's "Request a Quote" arrives at the charter form with no UTM and no `blogPostSlug`, so the lead is not attributed to the note that produced it. Only the note's own form carries the slug.

Screenshots: `shots/form-contact--390-filled.jpg`, `shots/form-charter--390-step1.jpg`, `shots/form-charter--390-step2.jpg`, `shots/form-*--390-after.jpg`.

### 1.9 Market Notes on a phone

**Index** (`shots/blog--390-fold.jpg`, `shots/blog--390-full.jpg`). The first screen is a dark hero (H1 and a three-line generic sub-line) and three filter chips; the first note appears on screen two. Cards are 16:9 image, category chip, read time, 18 px title, three-line 14 px excerpt, "By Joseph Pennella · date", a full-width outline "Read More" button. Fifteen cards in one column means 12.6 screens of scrolling to reach the newsletter box; there is no pagination and no "load more". Four of the twelve notes in the build cache have no category keyword, so they disappear whenever a chip other than "All" is active, and the "Transactions" chip never appears because no note carries it. Images: eight oversized sources as listed in finding 3; two 404s rendered as a grey gradient with the title in grey text on top (`how-to-buy…`, `bombardier…`). The page weighs 13.3 MB before the four blob images.

**Articles** (G550 market, Jet A, First-time buyer's guide, Why We Publish). Readability is good once the reader is past the header: 18 px body on a 3xl measure, 36 px H1 at 390, a real lede, pull quotes and stat blocks. Three problems:

1. "← Back to Market Notes" is clipped under the fixed header on every article (`pt-28` = 112 px versus 124 px of overlays).
2. The hero panel is a fixed 16:9 box (390x219) regardless of whether an image loads: the First-time buyer's guide shows an empty grey rectangle under the byline, which reads as a broken page.
3. The credit line is correct and well formed where the CRM supplies attribution ("Photo: Airwolfhound, CC BY-SA 2.0." with both links) but it is 11–12 px with 14–15 px link targets, and it is the first thing after the image. On the Jet A note the credit is "Photo: ImagePerson, CC BY 4.0." with no source link, which looks like a placeholder credit; check the CRM record. Eleven of fifteen notes have no attribution at all, including notes whose images are stock-looking JPEGs in `/images/Gallery/`; one note's featured image is a `wallpaperaccess.com` URL (the site correctly drops it, but the CRM record should not point at a wallpaper site).

Below the body, each note ends with a four-field "Talk to a Broker" form next to a card with Joseph's photo, title, bio, email and phone, then the newsletter band, then three related notes (buttons, not links), then the footer. On a phone that is 5.6 to 9.3 screens from the top; the sticky bar's "Talk to a Broker" jumps there, which is the right call.

**Share previews** (from the prerendered static HTML, which is what LinkedIn, Instagram and iMessage read):

| Note | og:image | Title suffix | Description length |
|---|---|---|---|
| 617 Aircraft, 21 for Sale (G550) | blob `social.webp` (dedicated social crop) | PennJets Market Notes | 150 |
| Jet A at a Six-Month High | blob `social.webp` | PennJets Market Notes | 134 |
| How Exposed Is Business Aviation | blob `social.webp` | PennJets Market Notes | 164 |
| Largest Managed Fleet (Solairus–Clay Lacy) | blob JPG (`IMG_2736…`, original phone photo, size unknown) | PennJets Market Notes | 145 |
| Q3 2026 | `citation-x-ramp…jpg` 1200x630 107 KB (good) | PennJets Market Notes | 154 |
| Canada 100% expensing | `Falcon900B…jpg` 960x540 83 KB (good) | Penn Jets | 191 |
| Why We Publish Market Notes | **logo PNG 1024x1024 1,349 KB** | Penn Jets | 84 |
| Light Jet Market 2026 | `Embraer_Phenom_300.jpg` 960x720 | Penn Jets | 167 |
| Pilatus PC-12 NGX | **`pc12.jpg` 4473x7952 portrait 4,154 KB** | Penn Jets | **443** |
| September 11 | `og-card.png` (source was wallpaperaccess.com, dropped) | Penn Jets | 181 |
| Bombardier / U.S. restrictions | `og-card.png` (source 404) | Penn Jets | 148 |
| First-time buyer's guide | `og-card.png` (source 404) | Penn Jets | 219 |
| Sustainable Aviation | **`future-aviation.jpg` 4896x3264 2,177 KB** | Penn Jets | 240 |
| Q3 2025 market | **`falcon.jpg` 3770x2320 1,855 KB** | PennJets Market Notes | 207 |
| Charter vs Ownership | **`pj-interior.jpg` 4032x3024 3,015 KB** | Penn Jets | 205 |

All static pages share `og-card.png` (1200x630, 32 KB, correct). Every page has `twitter:card=summary_large_image`, a canonical and an absolute `og:url`. The newest four notes show the CRM is now producing dedicated social crops; the eleven older ones were never re-processed.

### 1.10 Placeholders, broken images, false or contradictory claims

Broken or missing images in production:
- `/images/Gallery/gulfstream.jpg` (First-time buyer's guide hero and card) — 404.
- `/images/Gallery/Bombardier_Challenger_650.jpg` (Bombardier note) — 404.
- September 11 note's `featuredImage` is `https://wallpaperaccess.com/full/4568461.jpg` (dropped by `safeImage`; nothing renders).
- Home "Latest Market Note" card: when the newest note's image is on an external host that fails, the thumbnail is hidden and the card is text only (correct degradation).
- PennShare page has `onError` fallbacks to `/api/placeholder/600/400` and `/api/placeholder/400/200`, routes that do not exist on GitHub Pages; if the Premier 1A JPGs ever go missing the fallback is a second 404.

Placeholders and leftovers:
- Footer brand block is a blue square with a "P" and the word "PennJets" instead of the logo.
- Aircraft detail page "Contact a Consultant" card shows a 👤 emoji avatar, "Aviation Consultant / Private Jet Advisor" with no name. Unreachable today (no listings) but one Approve in the CRM exposes it.
- Charter form placeholders ("TEB / Teterboro", "PBI / Palm Beach"), Sell placeholders ("Beechcraft", "Premier 1A", "2006", "4,200 hours", "Fort Lauderdale, FL") describe the PennShare aircraft, which reads as pre-filled data rather than hints.
- Jet A note credit "Photo: ImagePerson" (verify in the CRM).
- `index.html` template (used by the dev server, overwritten per route at build) still says "Premier aviation brokerage services. Find and sell private jets, aircraft management, and charter services" and titles the site "PennJets - Premier Aviation Brokerage". Not visible in production, but it is what anyone running the dev build sees.
- Home JSON-LD `sameAs` lists only `https://www.pennjets.com` (itself).

Claims that conflict with the business as the repository defines it (one principal broker, founded 2025, no fleet, no operations), or with each other:

| Where | Text | Problem |
|---|---|---|
| `/services` "The PennJets Advantage" | "Proven Track Record: Successful transactions and satisfied clients across all aircraft categories" | Unsupported for a 2025 start-up; no transaction is named anywhere on the site. |
| `/services` | "Global Network: Extensive relationships with operators, buyers, and industry professionals worldwide" | Same. |
| `/services` | "White-Glove Service: Dedicated consultants providing personalized attention" | Plural consultants; the About page names one person. |
| `/services` Aircraft Sales | "Professional photography and marketing materials", "Global buyer network and targeted outreach" | Capabilities not evidenced anywhere (no listing has ever been photographed on the site). |
| `/services` Market Analysis | "Investment return modeling", "Portfolio diversification strategies" | Investment-advice language; worth legal review for a broker. |
| `/services` Acquisition | "Financing and insurance coordination" | Fine if true; not mentioned on Buy. |
| `/aircraft` hero | "Discover our curated collection of premium aircraft. Each listing represents exceptional quality…" | Zero listings on the same screen. |
| `/contact` | "Our Locations … Visit us at any of our convenient locations" | One address. "Visit our offices by appointment" under a suite number. |
| `/` "Why PennJets" | "Deal‑maker brokerage", "Fast, responsive, white‑glove service" | Self-description of the kind the charter page's rewrite removed (per the comments in `Charter.jsx`). |
| `/` home footer | "PennJets LLC — Private aviation. Simplified. Monetized." | "Monetized" is an odd promise to a buyer. **Fixed in the 01:18 UTC deploy** (now "Private aviation. Simplified."). |
| `/terms-of-service` | "Effective Date: 10/20/2026" (today, always) | Generated from the clock. |
| Response-time promises | "within 24 hours" (PennShare), "within one business day" (notes), "shortly" (everything else), "quote within the hour" is never claimed | Three different promises for the same inbox. |
| `/pennshare` | "Current Share Offering: 2006 Beechcraft Premier 1A, 1/4 Ownership", "View Available Shares" | The only "available" aircraft on the site is hard-coded copy, not a CRM listing. If it is current, it should be the inventory's first listing; if not, it is invented availability. |
| `/charter` title and "Popular routes from New York and New Jersey" vs Miami address and 954 number | Where is the broker? | Social visitors decide locality in one glance. |
| Banner | "Days left to close a 2026 acquisition." | Implies a deadline (bonus depreciation) it never names; shown to charter and sell audiences. |

Nothing on the site claims to operate aircraft, employ crew or hold a certificate. The Part 295 broker disclosure appears in the footer, twice on the charter page and on the compliance page. That part is right.

### 1.11 The PennForce public routes the site calls

The hosts were unreachable from this environment; this is from the site's code, the build caches and the captured requests.

| Route | Used by | Observed shape | Notes |
|---|---|---|---|
| `GET /api/public/blog?limit=&offset=` | index (paged to the end), home card, related notes | `{ posts: [...], pagination: { total, limit, offset, hasMore } }`; post has `slug, title, excerpt, featuredImage, featuredImageSocial, imageAttribution, keywords, metaTitle, metaDescription, publishedAt, author` | The index calls it twice on load (all notes, then the filtered list). Categories live in `keywords` as `category:<slug>`; 4 of 12 cached notes have none. |
| `GET /api/public/blog/{slug}` | every article view | full post with `content` and `contentHtml` | Called on every view even though the body is prerendered (finding 5). |
| `POST /api/public/blog/{slug}/view` | every article view | `{ utm_source?, utm_medium?, utm_campaign?, referrer?, sessionId }`; observed without UTM: `{"sessionId":"…"}` | `keepalive: true`; fires once per load. |
| `GET /api/public/inventory` | home Inventory, `/aircraft`, `/aircraft/<slug>` | `{ listings: [] }` in the 19 October cache | Empty. The site drops any listing missing year, make, model, serial, hours or config. |
| `POST /api/public/newsletter/subscribe` | two newsletter forms | `{ email, honeypot }` | Not in the repository's contract; could not be verified. |
| `POST /api/webhooks/incoming/{id}` | all seven lead forms | `{ name, email, phone?, company?, service?, message, blogPostSlug?, pageUrl, utm_* }` | The note form omits `service`; PennShare sends `buy`. Webhook IDs are compiled into the public bundle (they were already in `deploy.yml` per the September audit). |

---

## Part 2. Competitors

**Read this first.** No competitor page could be loaded from this environment, so none of the mobile-first observations the brief asks for (first screen at 390, taps to inquiry, fixed-header behaviour, page weight, Lighthouse mobile) could be made. What follows is what search engines index about each site: titles, descriptions, third-party listings and press. Where a dimension did not surface it is marked **not visible**. `tools/competitors.mjs` collects every missing measurement for all twelve sites plus pennjets.com in one run (about ten minutes) from any machine with normal internet access, and writes them in the shape of the matrix in Part 3.

Legend per firm: **Type · Scale · First screen (390) · Path to inquiry · Nav pattern · Inventory · Charter flow · Trust signals · Market Notes equivalent · Page weight · Lighthouse mobile.**

### 2.1 Clara Aviation (claraaviation.com)
- **Type/scale.** Private aviation advisor and opportunistic seller of used aircraft; "a discreet adviser to family offices and ultra-high-net-worth clients, helping them choose between charter, fractional, and ownership options." One named contact, Fort Worth TX. The closest analogue to Penn Jets in size and service mix.
- **First screen / taps / nav / weight / Lighthouse:** not visible.
- **Inventory.** Three listings syndicated on Controller.com (two Challenger 850s, one CRJ-200), all "Call for price", pitched with "100% write off + usage package". No evidence of an own-site listing section.
- **Charter flow.** Not visible.
- **Trust.** None visible in search (no IADA, ARGUS, Wyvern, years in business).
- **Content section.** Not visible.
- Sources: claraaviation.com; controller.com listings for Clara Aviation; findaircraft.com dealer page.

### 2.2 Jetcraft (jetcraft.com)
- **Type/scale.** Global broker-dealer that owns and trades inventory. Raleigh NC; 20–30 offices, 70–90 specialists; founded 1962; "550+ transactions, >$10bn" over a decade; IADA accredited.
- **First screen / taps / nav / weight / Lighthouse:** not visible. Phone +1 919 941 8400 appears on the featured-inventory page.
- **Inventory.** "Featured Aircraft" page of owned and traded aircraft; third-party listings show 4–8 aircraft at "Call for Price". No prices.
- **Charter flow.** None (not a charter broker).
- **Trust.** IADA, 60+ years, scale, press (Forbes, AIN).
- **Content section.** "Jetstream" hub (buying and selling practice, market updates, Q&As), monthly "Jetcraft News" email, annual "Pre-Owned Business Jet Market Forecast" (10th edition 2024).
- **Mobile.** A free iOS app (iPad-first) for browsing listings with PDF brochures.
- Sources: jetcraft.com/featuredinventory; aircraftexchange.com broker page; businesswire.com 2022 release; nbaa.org IADA article; App Store listing.

### 2.3 Amalfi Jets (amalfijets.com)
- **Type/scale.** DOT Part 295 charter broker with jet card and monthly membership; Los Angeles; founded 2020; about 30 staff; "access to ~3,500 aircraft in 170+ countries"; growth driven by TikTok.
- **First screen / taps / nav / weight / Lighthouse:** not visible (site poorly indexed).
- **Inventory.** None.
- **Charter flow.** App-centric: non-members request on-demand quotes in the iOS app; members book and track there. Jet card from $100K (2026). Published light-jet rate about $7,400/hr.
- **Trust.** Wyvern Broker Member; operators audited by ARGUS, Wyvern or IS-BAO; heavy trade coverage.
- **Content section.** Video content and social; no blog name visible.
- Sources: amalfijets.com team and video pages; privatejetcardcomparisons.com (2023, 2026); wyvernltd.com press room; App Store listing.

### 2.4 Guardian Jet (guardianjet.com)
- **Type/scale.** Brokerage, consulting, appraisal and asset management; Guilford CT; founded 2002; 11–50 staff; ">$2 billion in transactions annually"; a light-jet/turboprop division launched 2024; IADA.
- **First screen.** Title: "Guardian Jet is the World Leader in Aircraft Brokerage, Consulting & Asset Management."
- **Path to inquiry.** "Request Access to the Vault" / "Unlock Your Vault" (a gated client tool) and a phone number on listing pages. Taps: not visible.
- **Inventory.** "Private Jets For Sale, listed exclusively by Guardian Jet" plus "Recently Sold" pages; aggregators show about 12 aircraft, mixed pricing (one G-IV/SP at $8.495M, a Phenom 300 "Please Call").
- **Charter flow.** None.
- **Trust.** IADA; the $2B/yr figure; founder-pilots; proprietary tools (Vault, JetFinder "the Zillow for jets", Guardian Estimate).
- **Content section.** "Aircraft Learning Center > Jet Aircraft Blog" with categories; video market updates; newest indexed market post is 2023, so cadence has lapsed.
- Sources: guardianjet.com (home, listings, recent sales, vault, blog); zoominfo; generalaviationnews.com 2024; sprinkle.com.

### 2.5 Avpro (avprojets.com)
- **Type/scale.** Pure brokerage (buy, sell, trade), commission-only; Annapolis MD; founded 1991; "60–100 aircraft per year, >$1bn"; IADA Certified Broker.
- **First screen / taps / nav / weight / Lighthouse:** not visible. Title "Avpro Jets".
- **Inventory.** Via GlobalAir and AircraftExchange: large-cabin (Falcon 900LX, G450, G600, Global 6500), mostly "Please Call"; one GV priced.
- **Charter flow.** None; explicitly no charter or management.
- **Trust.** IADA, 30+ years, volume.
- **Content section.** None visible.
- Sources: avprojets.com; linkedin.com company page; bjtonline.com; iada.aero directory; globalair.com and aircraftexchange.com seller pages.

### 2.6 Mesinger Jet Sales (jetsales.com)
- **Type/scale.** Family brokerage; Boulder CO; "more than 50 years"; "brokered over 30 aircraft in a recent 12-month period"; IADA accredited dealer and certified broker.
- **First screen / taps / nav / weight / Lighthouse:** not visible (site not indexed by the search tool).
- **Inventory.** Via aggregators: Falcon 2000LX (call), G600 $44.5M, PC-24 $10.7M, so some prices are published.
- **Charter flow.** None.
- **Trust.** IADA; Jay Mesinger's AIN columns and NBAA podcast appearances; Honeywell case study.
- **Content section.** No branded blog visible; thought leadership lives off-site in AIN.
- Sources: aviationweek marketplace; aircraftexchange.com; nbaa.org 2025; ainonline.com columns.

### 2.7 Global Jet Capital (globaljetcapital.com)
- **Type/scale.** Financier (leases and loans) for $30M+ aircraft; Danbury CT, Zurich, Hong Kong; launched 2014 with Carlyle/GSO backing; >$4bn originated. Not a competitor for leads; included for its content model.
- **First screen.** Tagline "Leasing and Lending Solutions for Business Aircraft."
- **Path to inquiry.** Report downloads ("Download the 2024–2028 Forecast"); pre-approval forms.
- **Inventory / charter.** None.
- **Trust.** Institutional backers, ABS program, AIN and BJT syndication.
- **Content section.** Quarterly "Business Aviation Market Brief" (Q4 2025, Q1 2026, Q2 2026 all covered by trade press) plus an annual outlook: the most regular cadence of any firm here.
- Sources: ainonline.com (2024, 2026); globalair.com article; aircraftexchange banner.

### 2.8 Magellan Jets (magellanjets.com)
- **Type/scale.** Asset-light jet card, charter and fractional broker; Quincy MA; founded 2008; $80M revenue 2021; works with about 100 operators; Wyvern Wingman Broker.
- **First screen.** Services copy: jet cards, on-demand charter, fractional, aircraft sales and management.
- **Path to inquiry.** "Get-A-Quote" instant quote tool; published jet-card hourly rates (Light $6,750/hr to Heavy $12,500/hr; Phenom 300 $7,950/hr). Taps: not visible.
- **Inventory.** None visible.
- **Charter flow.** Instant online quote, Private Client iOS app, 25-hour card blocks, corporate card.
- **Trust.** Wyvern Wingman (renewed May 2026); ARGUS and Wyvern vetted operators; Boston Business Journal Fast 50; BusinessWire releases.
- **Content section.** "The Dossier" / "Industry News & Insights" under Resources; a Newsroom; a "Comparison" page; FAQ.
- Sources: magellanjets.com fact sheet PDF, FAQ, comparison, resources; wyvernltd.com; App Store; businesswire.com 2026.

### 2.9 Paramount Business Jets (paramountbusinessjets.com)
- **Type/scale.** Charter broker ("Agent for Client"); Leesburg VA; founded 2005; $35M sales 2021; jet card from $100K; Wyvern Wingman and ARGUS Certified Charter Broker.
- **First screen.** Title "Paramount Business Jets Luxury Private Jet Charters"; blog pages are titled "Paramount Business Jets CHARTER QUOTE", so the CTA is in the page title itself.
- **Path to inquiry.** "Get an Instant Private Jet Quote", "senior aviation advisors standing by 24/7, all-inclusive charter quote within the hour", phone +1-877-727-2538, charter@ email. The CEO states 76% of bookings start with a phone call.
- **Inventory.** None.
- **Charter flow.** Quote form, "Private Jet Charter Cost Estimator" (time and distance), "Private Jet Rental Cost Guide" (120+ aircraft, 323 routes, August 2026), city and route landing pages.
- **Trust.** Wyvern Wingman, ARGUS Certified, "operators meet or exceed ARGUS Gold", 20+ years, press releases.
- **Content section.** "Private Jet Traveler Blog", frequent 2026 posts, CEO-bylined ("The Highest Safety-Rated Private Jet Charter Brokers Worldwide", 2 Oct 2026).
- **Mobile.** Mobile-friendly relaunch covered in 2017; iOS users dominate traffic per that coverage; no app.
- Sources: paramountbusinessjets.com (on-demand, blog, calculator, cities); ainonline.com 2022; privatejetcardcomparisons.com 2017 and 2026; macaubusiness.com 2026.

### 2.10 Found: Mercury Jets (mercuryjets.com), first result for "private jet charter broker"
- **Type/scale.** DOT Part 295 charter broker; New York; 24/7 agents.
- **First screen.** Site-wide title "Private Jet Charter | Jet Hire Rates | Air Charter Service | USA | Europe | Mercury Jets."
- **Path to inquiry.** Online "marketplace" quote tool plus phone +1-212-840-8000; "instant flight quotes and empty leg availability on any device".
- **Inventory.** None.
- **Charter flow.** Quote tool; route pages with price ranges (e.g. New York–Orlando $12,500 turboprop to $23,000 heavy jet); Empty Legs; aircraft category pages.
- **Trust.** ARGUS Certified Charter Broker (own claim); "4.9/5 from 1,000+ Trustpilot reviews" cited on route pages.
- **Content section.** Blog plus a large programmatic library (routes, cities, countries, aircraft, regulations). iOS app.
- Why chosen: a programmatic route-and-price model a Florida broker can emulate at small scale.
- Sources: mercuryjets.com (broker page, route page, flight-safety, about, category pages); App Store.

### 2.11 Found: L33 Jets / Latitude 33 Aviation (l33jets.com), ranks for "aircraft broker" on educational posts
- **Type/scale.** Part 135 operator, management and sales brokerage; Carlsbad CA; about 20 years; manages about 30 jets; ARGUS Platinum.
- **First screen / taps:** not visible. Sales page titled "Aircraft Transactions with Latitude 33 Aviation".
- **Inventory.** Spec-sheet PDFs on site; listing section and prices not visible.
- **Charter flow.** Own fleet; form not visible.
- **Trust.** ARGUS Platinum ("top 5% of US operators"); 20 years; fact-sheet PDFs.
- **Content section.** "Resources > Blog" with tag pages; "Aircraft Dealers vs. Aircraft Brokers: What's the Difference?" and "What Are ARGUS and WYVERN Charter Safety Ratings?" rank for generic queries.
- Why chosen: the closest service mix to Penn Jets (brokerage beside charter) and proof that two plain explainer posts can rank for the category term.
- Sources: l33jets.com (dealers-vs-brokers post, sales, brokerage service, blog, fact sheet); argus.aero rating page.

### 2.12 Found: Jettly (jettly.com), first result for "aircraft broker"
- **Type/scale.** Online charter marketplace with memberships; founded 2016; 15–18 staff; HQ variously Toronto or New York.
- **Path to inquiry.** App and marketplace booking; "unlimited quotes, no commissions"; apps rated 1.8/5 (June 2026) with black-screen complaints.
- **Inventory.** None.
- **Trust.** Press; no ARGUS or Wyvern broker status visible.
- **Content section.** Very large SEO blog (`jettly.com/post/…`): "aircraft broker", "private airplane charter prices", a 2026 hourly-rate cheat sheet. It ranks first for "aircraft broker" on volume of posts.
- Why chosen: the cautionary case. Ranking on content volume with a poorly rated product.
- Sources: jettly.com posts and headquarters page; privatejetcardcomparisons.com 2019; marlvel.ai app review 2026; aviationweek.com Q&A.

---

## Part 3. Comparison

### 3.1 Matrix

Mobile columns first. For competitors, every rendering column is **tc** (to capture with `tools/competitors.mjs`); only the documented columns are filled. Penn Jets' values are measured.

| Firm | Mobile first screen (390) | Taps to inquiry (390) | Mobile nav | Fixed chrome (px) | Page weight (home) | Lighthouse mobile perf | Instant price or rate card | Inventory on site | Charter quote form | Trust badges | Market Notes equivalent | Cadence | App |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Penn Jets** | Countdown + floating header over video; H1 collides with logo; 2 CTAs in fold | 1 (hero or sticky bar) to form; 2–3 to send | 7-item hamburger, Buy/Sell/Consulting absent | 195 | 1.4 MB (index 13.3 MB) | 71 (index 45) | No | Empty; 5 "representative types" | Yes, 2-step, 9 fields | Part 295 disclosure only; no ARGUS/Wyvern/IADA | Market Notes, 15 posts, 1 author | ~2 per month since Sept 2026 | No |
| Clara Aviation | tc | tc | tc | tc | tc | tc | No | 3 via Controller | tc | None visible | None visible | n/a | No |
| Jetcraft | tc | tc | tc | tc | tc | tc | No | Featured Aircraft, call for price | n/a | IADA, 60 yrs | Jetstream + annual forecast | Monthly email, annual report | iOS |
| Amalfi Jets | tc | tc | tc | tc | tc | tc | Card rates published | No | In app | Wyvern | Video/social | tc | iOS |
| Guardian Jet | tc | tc | tc | tc | tc | tc | Mixed (some prices) | Yes + Recently Sold | n/a | IADA | Learning Center blog + video | Lapsed (2023) | No (web tools) |
| Avpro | tc | tc | tc | tc | tc | tc | No | Via aggregators | n/a | IADA, 30 yrs | None visible | n/a | No |
| Mesinger | tc | tc | tc | tc | tc | tc | Some prices | Via aggregators | n/a | IADA, 50 yrs | Off-site (AIN columns) | Irregular | No |
| Global Jet Capital | tc | tc | tc | tc | tc | tc | n/a | No | n/a | Institutional | Quarterly Market Brief | Quarterly + annual | No |
| Magellan Jets | tc | tc | tc | tc | tc | tc | Yes, hourly rates + instant quote | No | Instant quote | Wyvern Wingman | The Dossier | tc | iOS |
| Paramount Business Jets | tc | tc | tc | tc | tc | tc | Instant quote + cost estimator + cost guide | No | Yes | Wyvern Wingman + ARGUS | Private Jet Traveler Blog | Weekly-ish 2026 | No |
| Mercury Jets | tc | tc | tc | tc | tc | tc | Route price ranges | No | Marketplace tool | ARGUS, Trustpilot | Blog + route/city pages | tc | iOS |
| L33 Jets | tc | tc | tc | tc | tc | tc | No | Spec PDFs | Own fleet | ARGUS Platinum | Resources blog | tc | No |
| Jettly | tc | tc | tc | tc | tc | tc | Rate cheat sheet | No | App | None | SEO blog | High volume | iOS/Android (1.8★) |

### 3.2 What Penn Jets should adopt, ranked

Screenshots of the competitor pattern could not be captured from this environment; each item names the competitor and the page, and `tools/competitors.mjs` writes `shots/<competitor>--390-fold.png` for all of them.

1. **A quote path that starts on the first screen with trip fields, not a button** (Paramount Business Jets home, Magellan "Get-A-Quote", Mercury quote tool). Penn Jets' charter form is good but lives 3 screens down behind a hero and a benefits section. Put From / To / Date / Passengers in the hero at 390 and let "Continue" open the two contact fields. Everything already exists in `Charter.jsx`.
2. **A published cost anchor** (Paramount's cost estimator and cost guide, Magellan's hourly rate card, Mercury's route price ranges). Penn Jets has popular routes with no numbers. A range per route ("TEB–PBI, light jet, typically $X–$Y all-in, operator quotes vary") is the single most-searched thing a charter prospect wants and the thing Joseph already explains on the phone. CLAUDE.md forbids invented pricing, so these must be ranges Joseph signs off on, labelled as typical operator quotes.
3. **Safety and accreditation badges in the fold** (Paramount: Wyvern Wingman + ARGUS Certified Broker; Magellan: Wyvern; Mercury: ARGUS + Trustpilot). Penn Jets shows only the Part 295 disclosure in 12 px grey. If Penn Jets holds, or can obtain, an ARGUS or Wyvern broker registration, that badge belongs next to the phone number; if not, the operator standard ("we only quote ARGUS Gold or Wyvern Wingman operators") can be stated as policy, which the Services page already half-says.
4. **A "Recently Sold / Closed" page instead of an empty inventory** (Guardian Jet). Even three closed transactions with year, model and "represented the buyer" turns the Aircraft nav slot from an empty room into proof. If there are none yet, the slot should go to Buy.
5. **Route and city landing pages** (Mercury Jets, Paramount "/cities/"). Penn Jets' seven popular routes are links to the form; each should be a page with the range from item 2, the typical aircraft and the quote form. These are the pages a Florida or NY/NJ searcher lands on.
6. **A dated, regular market brief** (Global Jet Capital's quarterly brief; Jetcraft's annual forecast). Market Notes already has the Q3 2026 note and the G550 study. Naming a quarterly ("Penn Jets Q4 2026 Market Note") and a monthly model study gives the newsletter a reason to exist and gives LinkedIn a predictable post.
7. **Two plain explainer posts that own the category terms** (L33 Jets: "Aircraft Dealers vs. Aircraft Brokers", "What are ARGUS and Wyvern ratings"). Penn Jets' "Why We Publish Market Notes" is close; a "What an aircraft broker does, and what we charge" page would rank and would pre-answer the first phone call.
8. **An author byline that is a person with a phone** (Mesinger via AIN, Paramount's CEO byline). Penn Jets already does this better than most: keep the byline card, move the phone and email above the form on the note page, and make them 44 px targets.
9. **Syndicate listings to Controller / AircraftExchange / GlobalAir** (Clara, Avpro, Mesinger). When the first CRM listing is approved, the aggregator listing is where buyers actually look; the site's detail page should link to it.
10. **A "Compare: charter vs card vs fractional vs ownership" page** (Magellan's Comparison page). Penn Jets sells all four, which none of the pure brokers do; the "Jet Charter vs. Ownership" note is the seed.

### 3.3 What not to copy, because it depends on scale Penn Jets lacks

- **A native app** (Amalfi, Magellan, Mercury, Jettly, Jetcraft). Apps work with a membership base and a fleet of agents; for one broker they are a maintenance cost and, per Jettly's 1.8-star rating, a liability. The sticky Call bar is the right substitute.
- **Gated client portals** (Guardian's Vault, JetFinder). They are sold on decades of transaction data.
- **"World leader", "largest", transaction-volume counters** (Jetcraft, Guardian, Avpro). Penn Jets' Services page already imitates this register ("Proven Track Record", "Global Network") and it is the weakest copy on the site. Specific and small beats generic and large: "founded 2025, one broker, every quote shows the operator" is a position the big firms cannot take.
- **Programmatic content at volume** (Jettly, Mercury's hundreds of route pages). Ten good route pages with real ranges beat three hundred thin ones, and Google treats thin programmatic pages harshly.
- **Jet card and membership products** (Amalfi, Magellan, Paramount). They need float, a hedging strategy and a fulfilment desk.
- **Quarterly reports with proprietary data** (Global Jet Capital). Penn Jets should cite JETNET and AMSTAT numbers, as the G550 note does, and say so.
- **Multi-office footers and "Our Locations" grids.** One office is fine; a three-column grid with one card is not.

### 3.4 Proposed mobile-first structure, page by page

**Home.** One screen at 390 does three things: says what Penn Jets is in one line ("Independent aircraft broker. Buy, sell, charter, fractional. One person answers."), shows the phone number as a 44 px button, and starts the charter quote with From / To / Date. Drop the countdown banner or fold it into a single line inside the page for buyers only. Below the fold: the newest Market Note card (keep), three closed or representative transactions (replace the five silhouette cards), the operator-transparency promise with any accreditation, Joseph's photo and a sentence, footer. No "Why PennJets" bullets.

**Charter.** Quote fields in the hero. Under them: the three benefit cards (keep, raise to 16 px), the popular routes as links to route pages with a typical range each, "What happens next", the disclosure. One CTA label everywhere ("Request a charter quote", already done). The sticky bar should hide while any charter input has focus.

**Route pages (new, seven to start).** `/charter/teb-to-pbi`: H1 with the city pair, typical aircraft, a typical all-in range Joseph approves, flight time, the quote form prefilled, the disclosure. These are the social and search landing pages for charter.

**Buy.** Keep the form; move it so the submit button is never cut at the fold (either shorter hero or sticky bar suppressed on form pages). Add it to the main nav. Replace "Representative aircraft types" with "What we have sourced" once there is one real example.

**Sell.** Keep the form; add it to the main nav; add one line on fees and representation (buyer-side or seller-side, never both) because that is the first question a seller asks a broker.

**Consulting.** Fine as it is; add to nav. The textarea placeholder is the best line on the site ("the aircraft or category, the decision in front of you, and your timeline"): make it the sub-heading.

**PennShare.** Either it is a current, approved listing, in which case it should be the inventory's first entry with the CRM as source of truth, or the page becomes "Fractional ownership, how we structure it" with no aircraft named. Send the lead with a distinct `service` value, or at least a message prefix the CRM filters on.

**Aircraft.** Until there is a listing, the nav item should be "Buy" and `/aircraft` should redirect to `/buy`. When there is a listing: card with year, model, serial, hours, price or "price on request", one photo under 150 KB, link to the aggregator listing, and a "Recently closed" strip.

**Market Notes index.** Remove the hero; the first screen is the newest note's card. Cards are links with 400 px wide, under 60 KB images, dimensions set, lazy below the fold. Ten per page with "Load more". Chips only for categories that exist; uncategorised notes stay visible under every chip or get a category in the CRM.

**Market Note article.** Hydrate the prerendered HTML instead of replacing it (`hydrateRoot`), and only fetch when the slug is not prerendered. 136 px top padding at 390 so "Back" clears the header. Hero panel only when the image loads. Credit at 12 px minimum with 44 px link targets, or move the credit to the end of the article. Phone and email as buttons above the form. Related notes as links.

**About.** One screen: photo, name, title, the approved bio, phone, email. Drop "Professional Services" (duplicates Services) and "Ready to Work With Us?". Put the CTA in the first screen.

**Services.** Fold it into Buy, Sell, Charter and Consulting and redirect `/services` and its four anchors. If it stays, it needs a one-line hero, the four service links, and the "Advantage" and "Approach" sections removed.

**Contact.** Phone and email as 44 px buttons in the first screen, then the short form, then the one address. Drop "Our Locations".

**Legal (four pages).** Keep the content; fix the Terms date; no countdown banner, no sticky bar on these pages.

**404.** Fine. Stop loading the hero video on it.

### 3.5 The ten changes to make first

1. **Cut the fixed chrome from 195 px to about 120 px at 390.** Retire the countdown banner (or make it a dismissible single line on Buy only). Give the header a solid background at all times so nothing collides with it, and add 136 px top padding on notes so "Back" is visible.
2. **Put Buy, Sell, Consulting and Contact in the hamburger, and demote Aircraft until there is a listing.** This is a one-array change in `Header.jsx` and it moves the three best-converting pages from the footer to the menu.
3. **Fix the Market Notes index weight.** Serve card thumbnails at 400 px wide under 60 KB from the CRM's social crops (`featuredImageSocial` already exists for the newest notes), set `width`/`height`, lazy-load below the fold. Re-process the eleven older notes' images in the CRM so they also get crops. This is a CRM task plus the card markup.
4. **Make every note card and related-note card a real `<a href>`.** Fixes crawlability, new-tab opening, back-forward cache and the "Read More" button that is not a link.
5. **Hydrate instead of re-render on article pages**, and skip the article fetch when the body is already in the HTML. Removes the spinner on every social click and the dependency on CRM uptime for reading.
6. **Suppress the sticky bar while a form field has focus** (one `focusin`/`focusout` listener in `StickyContactBar.jsx`), so the keyboard never pushes it over the next field; and make the charter "Continue" button count as a submit for the bar's intersection logic.
7. **Confirm the social links on a phone.** The 01:18 UTC deploy put real URLs in the footer; tap all four from a phone to confirm each profile is live and public, remove any that is not, and add the real profile URLs to the JSON-LD `sameAs` (still a self-reference).
8. **Fix the two 404 hero images and the Terms date.** Upload `gulfstream.jpg` and `Bombardier_Challenger_650.jpg` (or repoint the two CRM records), and replace `new Date()` with the real effective date.
9. **Rewrite the Services "Advantage" and "Approach" sections and the Aircraft hero** so nothing claims a track record, a network, or a collection the site cannot show. Change "Dedicated consultants" to Joseph. Decide PennShare's status (real listing or no aircraft named).
10. **Move the charter quote's trip fields into the first screen** on `/charter` and the home page, and publish a typical range for each of the seven popular routes once Joseph approves the numbers. This is the one change that borrows directly from the competitors who convert charter on a phone.

---

## Appendix. Files

- `docs/audit/outside-review/shots/` — 96 JPEGs: `<route>--390-fold`, `--430-fold`, `--desktop-fold`, selected `--390-full`, `menu-open-*`, `keyboard-*`, `form-*`. The four Vercel-blob note images render as empty panels in these because that host was unreachable here.
- `docs/audit/outside-review/tools/replica-server.mjs` — serves the `gh-pages` tree with GitHub Pages routing and stubs the CRM's public routes from the repo caches. Needs the self-signed certificate it expects at `srv/`; see the header.
- `tools/audit-pages.mjs` — the page audit (viewports, overlays, CTA distance, touch targets, text size, overflow, images, links, forms, keyboard pass, menu pass). Output: `pennjets-audit-data.json`, digest in `pennjets-audit-digest.txt`.
- `tools/audit-forms.mjs` — submits every form once as `REVIEW TEST (delete)`. Output: `pennjets-forms-data.json`. Point it at production only if you want real test rows in the CRM.
- `tools/lighthouse-replica.mjs` — Lighthouse through a Playwright-launched Chrome (the CLI refuses self-signed certificates). Output: `pennjets-lighthouse-summary.json`; the per-page HTML reports (600 KB each) were not committed.
- `tools/competitors.mjs` — the competitor sweep this environment could not run: 390 and desktop screenshots, weight, first CTA, fixed header, touch targets, text size, nav pattern, inventory and charter-form presence, Lighthouse mobile, for all twelve competitors and pennjets.com.
