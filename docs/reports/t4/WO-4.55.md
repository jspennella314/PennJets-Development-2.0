---
wo: WO-4.55
terminal: T4
model: claude-opus-5-5
tested_against: local build of t4/wo-4.55 (on t4/wo-4.54-p3, which is on t4/work eaee96b), served by vite preview on :4174, Playwright at 390x844 with the CRM host caught first
status: done on t4/wo-4.55; it follows WO-4.53's PR (t4/work) and WO-4.54 Part 3 (t4/wo-4.54-p3) onto main
---

# WO-4.55 — report: the body copy says "Penn Jets"

Joseph, 2026-10-28: the brand form is "Penn Jets" everywhere.

## Branch

`t4/wo-4.55` is cut from `t4/wo-4.54-p3`, because the two orders touch
the same `siteMeta.js` lines and the descriptions sit beside the
titles. It carries WO-4.53 and WO-4.54 Part 3 underneath. The PRs go
in order: WO-4.53 from `t4/work`, then `t4/wo-4.54-p3`, then this.

## The counts

`grep -rho` over `src/**/*.{js,jsx}`:

| | "PennJets" | "Penn Jets" |
|---|---|---|
| The lead's count at `9908dfb` | 62 | 35 |
| Before this order, on `t4/wo-4.54-p3` (WO-4.53 and Part 3 had removed some) | 47 | 62 |
| After (including the new footer pin) | **18** | **95** |

### The 18 that remain: 7 in code, every one excluded by the order, and 11 in tests

| Where | What | Why it stays |
|---|---|---|
| `pages/Gallery/Gallery.jsx:62-63` | `'PennJets-Website-Logo.png'`, `'/images/PennJets-Website-Logo.png'` | the logo's file name and URL |
| `pages/Legal/TermsOfService.jsx:24` | "By accessing and using PennJets.com, …" | the domain |
| `pages/Charter/Charter.jsx:104`, `pages/Home/Home.jsx:12`, `seo/siteMeta.js:10` | code comments quoting old headings and the logo decision | not rendered |
| `services/blogApi.js:369` | the author fallback `'PennJets'` | inside `src/services/`, which the order excludes. See the note below. |
| 11 in test files | `Home.test.jsx` (3: a comment, a test name, and a negative pin "no Why PennJets"); `siteMeta.test.js` (5: a fixture author, the "… \| PennJets" pass-through pin from Part 3 on three lines, and `not.toMatch(/PennJets/)` over the `ROUTES` titles); `blogApi.test.js` (2, pinning the fallback above); `Footer.test.jsx` (1, the new `not.toMatch(/PennJets/)`) | they test the old spelling on purpose, or are under `src/services/` |

**A note for the lead on `blogApi.js:369`.** The excluded fallback is
rendered: a list-route author with no email reads "By PennJets" on a
note card. Since WO-1.36 every author has an email, so the build shows
it 0 times (WO-4.51 addendum: 19 of 19 cards read "By Joseph
Pennella"). It reappears only if an author ever comes back without an
email. Changing it is one line in `src/services/` plus the two
`blogApi.test.js` pins. Say if it should change.

## Every changed line (30)

| # | File:line | Before | After |
|---|---|---|---|
| 1 | `layout/Footer/Footer.jsx:83` | <span className="text-xl font-bold">PennJets</span> | <span className="text-xl font-bold">Penn Jets</span> |
| 2 | `layout/Footer/Footer.jsx:139` | © {currentYear} PennJets. All rights reserved. | © {currentYear} Penn Jets. All rights reserved. |
| 3 | `layout/Header/Header.jsx:158` | alt="PennJets" | alt="Penn Jets" |
| 4 | `pages/About/About.jsx:30` | <h1 className="heading-lg mb-6">About PennJets</h1> | <h1 className="heading-lg mb-6">About Penn Jets</h1> |
| 5 | `pages/About/About.jsx:32` | Founded in 2025, PennJets is a private aviation sales and consulting firm. | Founded in 2025, Penn Jets is a private aviation sales and consulting firm. |
| 6 | `pages/About/About.jsx:55` | or selling a legacy aircraft, PennJets provides the expertise and | or selling a legacy aircraft, Penn Jets provides the expertise and |
| 7 | `pages/About/About.jsx:156` | Fractional shares structured by PennJets and flown by a licensed Part 135 | Fractional shares structured by Penn Jets and flown by a licensed Part 135 |
| 8 | `pages/About/About.jsx:177` | Whether you're buying, selling, or connecting with charter operators, PennJets is ready to provide | Whether you're buying, selling, or connecting with charter operators, Penn Jets is ready to provide |
| 9 | `pages/About/About.jsx:186` | Contact PennJets | Contact Penn Jets |
| 10 | `pages/Blog/BlogArticle.jsx:183` | "name": "PennJets", | "name": "Penn Jets", |
| 11 | `pages/Buy/Buy.jsx:139` | <p className="text-xs text-gray-500">By submitting, you agree to be contacted by PennJets about this request.</p> | <p className="text-xs text-gray-500">By submitting, you agree to be contacted by Penn Jets about this request.</p> |
| 12 | `pages/Buy/Buy.jsx:168` | <h2 className="text-base font-semibold">How buying with PennJets works</h2> | <h2 className="text-base font-semibold">How buying with Penn Jets works</h2> |
| 13 | `pages/Charter/Charter.jsx:335` | <p className="text-xs text-gray-500">By submitting, you agree to be contacted by PennJets about this request.</p> | <p className="text-xs text-gray-500">By submitting, you agree to be contacted by Penn Jets about this request.</p> |
| 14 | `pages/Consulting/Consulting.jsx:79` | <p className="text-xs text-gray-500">By submitting, you agree to be contacted by PennJets about this request.</p> | <p className="text-xs text-gray-500">By submitting, you agree to be contacted by Penn Jets about this request.</p> |
| 15 | `pages/Gallery/Gallery.jsx:65` | description: 'PennJets Logo', | description: 'Penn Jets Logo', |
| 16 | `pages/Home/Home.jsx:32` | "name": "PennJets", | "name": "Penn Jets", |
| 17 | `pages/NotFound/NotFound.jsx:8` | <title>Page Not Found \| PennJets</title> | <title>Page Not Found \| Penn Jets</title> |
| 18 | `pages/PennShare/PennShare.jsx:162` | A licensed Part 135 operator flies and maintains the aircraft. PennJets structures the share and stays your point of contact. | A licensed Part 135 operator flies and maintains the aircraft. Penn Jets structures the share and stays your point of contact. |
| 19 | `pages/PennShare/PennShare.jsx:365` | <span>I consent to being contacted by PennJets regarding fractional ownership opportunities. *</span> | <span>I consent to being contacted by Penn Jets regarding fractional ownership opportunities. *</span> |
| 20 | `pages/Sell/Sell.jsx:103` | <p className="text-xs text-gray-500">By submitting, you agree to be contacted by PennJets about this aircraft.</p> | <p className="text-xs text-gray-500">By submitting, you agree to be contacted by Penn Jets about this aircraft.</p> |
| 21 | `pages/Sell/Sell.jsx:129` | <h2 className="text-base font-semibold">How selling with PennJets works</h2> | <h2 className="text-base font-semibold">How selling with Penn Jets works</h2> |
| 22 | `seo/siteMeta.js:50` | 'Fractional aircraft shares structured by PennJets and flown by a licensed Part 135 operator. Share the costs, not the convenience.', | 'Fractional aircraft shares structured by Penn Jets and flown by a licensed Part 135 operator. Share the costs, not the convenience.', |
| 23 | `seo/siteMeta.js:55` | 'Joseph Pennella, founder and principal broker of PennJets. Private aviation sales and consulting: sole ownership, fractional, charter brokerage, and advisory.', | 'Joseph Pennella, founder and principal broker of Penn Jets. Private aviation sales and consulting: sole ownership, fractional, charter brokerage, and advisory.', |
| 24 | `seo/siteMeta.js:65` | 'Market notes, transaction insights, and aircraft overviews from PennJets.', | 'Market notes, transaction insights, and aircraft overviews from Penn Jets.', |
| 25 | `seo/siteMeta.js:73` | '/privacy-policy': { title: 'Privacy Policy \| Penn Jets', description: 'How PennJets collects, uses, and protects your information.' }, | '/privacy-policy': { title: 'Privacy Policy \| Penn Jets', description: 'How Penn Jets collects, uses, and protects your information.' }, |
| 26 | `seo/siteMeta.js:74` | '/terms-of-service': { title: 'Terms of Service \| Penn Jets', description: 'Terms governing use of the PennJets website and services.' }, | '/terms-of-service': { title: 'Terms of Service \| Penn Jets', description: 'Terms governing use of the Penn Jets website and services.' }, |
| 27 | `seo/siteMeta.js:75` | '/cookie-policy': { title: 'Cookie Policy \| Penn Jets', description: 'How the PennJets website uses cookies and similar technologies.' }, | '/cookie-policy': { title: 'Cookie Policy \| Penn Jets', description: 'How the Penn Jets website uses cookies and similar technologies.' }, |
| 28 | `seo/siteMeta.js:76` | '/compliance': { title: 'Compliance Statement \| Penn Jets', description: 'PennJets compliance statement and air charter broker disclosure.' }, | '/compliance': { title: 'Compliance Statement \| Penn Jets', description: 'Penn Jets compliance statement and air charter broker disclosure.' }, |
| 29 | `seo/siteMeta.js:77` | '/gallery': { title: 'Image Library \| Penn Jets', description: 'Image library for PennJets Market Notes.', noindex: true }, | '/gallery': { title: 'Image Library \| Penn Jets', description: 'Image library for Penn Jets Market Notes.', noindex: true }, |
| 30 | `seo/siteMeta.js:153` | authorName: (post.author && post.author.name) \|\| 'PennJets', | authorName: (post.author && post.author.name) \|\| 'Penn Jets', |

### Notes on the table

- **`NotFound.jsx:8` is a page title** ("Page Not Found | Penn Jets").
  It is not in `ROUTES`, so WO-4.54 Part 3 missed it; it is fixed here.
- **Three changes are structured data, not prose:**
  - `BlogArticle.jsx:183`, the article's JSON-LD `name`;
  - `Home.jsx:32`, the home page's JSON-LD `name`;
  - `siteMeta.js:153`, the `authorName` fallback.

  They now match `SITE_NAME`, which Part 3 changed.
- **`Gallery.jsx`** changes the logo's description only, not the file.
- **The descriptions in `siteMeta.js`** change, as the order says. The
  titles were Part 3's.

## Tests

- **New pin in `Footer.test.jsx`:** the copyright reads "© <year> Penn
  Jets. All rights reserved.", the word mark link contains "Penn Jets",
  and the footer text has no "PennJets".
- **No existing test asserted the old spelling in rendered copy**,
  except `blogApi.test.js` (excluded, above). So nothing needed
  re-pinning.
- `npx vitest run src/components/layout src/components/pages/Home src/components/pages/Blog src/seo`:
  **8 files, 101 tests, 101 passed**.
- `npm run lint`: exit 0.
- The full suite was not run, because T3 (WO-3.54) is the other active
  builder.

## Build (`npm run build`, exit 0)

```
[postbuild] article bodies: 18 from cache, 1 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
[postbuild] wrote 34 HTML files (19 Market Notes) and sitemap.xml with 33 URLs
[prerender] 1 redirect stub(s) left as written: /blog/title-dassault-falcon-900b-for-sale-2026-market-study
[prerender] 34 of 34 routes rendered in 47.6s
```

- **The one fetch** is the Falcon note. Its `updatedAt` moved when the
  lead wrote its former slug on 2026-10-29, so the body was refetched
  once, which wrote one ContentAnalytics row. The refreshed cache is in
  its own commit.
- **`dist` has no "PennJets" outside a URL or path.** The command
  `grep -oh "[^/\"'.a-zA-Z-]PennJets[^-./a-zA-Z]" dist/*.html dist/blog/*.html`
  prints nothing. The domain "PennJets.com" is excluded by the pattern
  and stays by the order.

## Rendered, at 390

Playwright against the preview, with the CRM host caught first (4
reads caught, 0 reached the CRM). Counts of each spelling in the body
text:

| Page | "PennJets" | "Penn Jets" |
|---|---|---|
| `/` | 0 | 4 |
| `/about` | 0 | 11 |
| `/buy` | 0 | 6 |
| `/sell` | 0 | 7 |
| `/consulting` | 0 | 5 |
| `/charter` | 0 | 11 |
| `/pennshare` | 0 | 6 |

The header logo's `alt` is "Penn Jets".

Captures, in `docs/audit/mobile-390/wo-4.55/`:

- `home-390.png`;
- `footer-390.png`, the whole footer: the word mark "Penn Jets", "What
  We Do", and the copyright "© 2026 Penn Jets". The fixed header appears
  partway down the column; that is the element screenshot stitching the
  fixed chrome in, not a layout fault.

The preview was stopped; no node process of this repo is running.

## Not touched (out of scope)

- The titles and the meta fallback (WO-4.54 Part 3).
- The Market Notes' own text.
- The "#PennJets" social tag.
- The logo image.
