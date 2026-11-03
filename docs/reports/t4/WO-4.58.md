---
wo: WO-4.58
terminal: T4
model: claude-opus-5-5
tested_against: "t4/work fef3841 (code) + e45d0bd (cache) on origin/main 38cd6c6 (the merge-base; t4/work fast-forwarded first); Node 22.19.0; npx vitest run on the touched directories (12 files, 105 passed, exit 0), npm run lint exit 0, npm run build exit 0 (vite build + postbuild + prerender), each alone in the foreground; vite preview on :4174 and Playwright with a catch-all registered first (CRM answered empty, Google aborted); the four social URLs read with curl"
status: built and pushed on t4/work; one PR (the lead reads, Joseph opens it); the policy sentences to Joseph
---

# WO-4.58 report: from Miami to Teterboro / New York metro

## Where it is

| Commit | What |
|---|---|
| `fef3841` | **The order**, in one commit: the phone, the contact page, the schema, the titles and descriptions, the Miami copy, the drafts regenerated, the `/contact` quote target, and the prerender fix for the schema |
| `e45d0bd` | The cache refresh, in its own commit |
| This commit | The report and the captures |

## 1. Files changed, one line each

| File | Why |
|---|---|
| `src/content/joseph.js` | `JOSEPH_PHONE` set to `(201) 241-2749` |
| `src/content/privacyPolicy.js` | `CONTACT.phone` and `phoneHref` changed; `CONTACT.address` is now `Clifton, New Jersey`; `LAST_UPDATED` is 2 November 2026, because the policy's contact block changed |
| `src/seo/siteMeta.js` | The `/contact` title and description; `DEFAULT_DESCRIPTION` |
| `index.html` | The pre-hydration `<meta name="description">` now equals `DEFAULT_DESCRIPTION`. It used to read "PennJets - Premier aviation brokerage services…" |
| `src/components/common/StickyContactBar/quoteTarget.js` | `PHONE_DISPLAY` and `PHONE_HREF` changed; the stale "second number" comment removed; `/contact`'s quote target is now `/charter#quote` (§4.5) |
| `src/components/common/StickyContactBar/StickyContactBar.test.jsx` | A test for that quote target on `/contact` |
| `src/components/layout/Footer/Footer.jsx` | The "Call:" line |
| `src/components/layout/Header/Header.jsx` and `Header.test.jsx` | The desktop number and its `tel:`. The call-conversion test now looks for the new href |
| `src/components/pages/AircraftDetail/AircraftDetail.jsx` | Its "Phone:" line |
| `src/components/pages/Blog/BlogArticle.jsx` | The broker contact line's `tel:` and its text |
| `src/components/pages/Buy/Buy.jsx`, `Consulting/Consulting.jsx`, `Sell/Sell.jsx`, `PennShare/PennShare.jsx` | The error-path "call" sentence. Sell's location placeholder is now `Teterboro, NJ`. PennShare's phone placeholder is now the (201) number |
| `src/components/pages/Charter/Charter.jsx` and `Charter.test.jsx` | Only the phone swap (the hero Call, the error line and the closing line) and the stale comment deleted. **No structural change** (the hold). The test keeps its one-`gtag`-conversion assertion |
| `src/components/pages/Contact/Contact.jsx` | The phone; the Address card; the Our Locations section (§2) |
| `src/components/pages/Home/Home.jsx` | The Organization schema (§3) |
| `src/components/pages/Legal/Compliance.jsx` | The contact block: the address is now `Clifton, New Jersey`, plus the phone |
| `src/components/pages/Legal/TermsOfService.jsx` | Only the phone. The governing-law clause is unchanged |
| `scripts/prerender.mjs` | Carries `application/ld+json` into the static head (see "Beyond the order") |
| `docs/drafts/t4/privacy-policy.md` | Regenerated |

**The phone swap counts.** The script reported 31 replacements in 19 files, covering `(954) 546-0763`, `tel:+19545460763`, `+1-954-546-0763` and two lines in `Buy.jsx` and `Charter.jsx` written with a non-breaking hyphen (`546‑0763`), which now read `241‑2749`. The test regex `Call \(954\)` was changed separately. The lead's count (43 + 21 + 4) counted individual occurrences; my grep counted lines.

## 2. The contact page

- **The Address card:**
  - Before: `690 SW 1st Ct #1030` / `Miami, FL 33130`, with the line "Visit our offices by appointment".
  - After: `Clifton, New Jersey` / `Serving Teterboro (TEB), Westchester County (HPN), Morristown (MMU), and the New York metro area.`, with the line `Meetings at your FBO by appointment.`
- **Our Locations:** two cards, with no street address on either.
  - `New York Metro · Teterboro`, with the pill **Primary** (was "Headquarters") and the line `Teterboro (TEB) · Westchester County (HPN) · Morristown (MMU)`.
  - `South Florida`, with the line `Fort Lauderdale · Palm Beach · Miami`.
  - Both show the (201) number.
  - The intro reads `Meetings at your FBO by appointment, in the New York metro area or South Florida.`
  - The grid was a 3-column grid holding one card. It is now 2 columns, centred (`md:grid-cols-2 max-w-4xl mx-auto`), so two cards don't leave an empty third column. That is a layout line beyond the order's text.
- No PO box and no Teterboro street address anywhere. No sentence needed one.
- **Captures** in `docs/audit/mobile-390/wo-4.58/`: `contact-top-`, `contact-get-in-touch-` and `contact-locations-`, each at `390` and `1280`.

## 3. The Organization schema, as built (`dist/index.html`)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Penn Jets",
  "legalName": "Penn Jets LLC",
  "url": "https://www.pennjets.com",
  "logo": "https://www.pennjets.com/images/pennjets-logo-192.png",
  "description": "Private aviation brokerage and consulting firm specializing in aircraft sales, acquisitions, and charter brokerage",
  "areaServed": [
    { "@type": "Place", "name": "Teterboro, NJ" },
    { "@type": "Place", "name": "New York metro area" },
    { "@type": "Place", "name": "South Florida" }
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-201-241-2749",
    "contactType": "Sales",
    "areaServed": [
      { "@type": "Place", "name": "Teterboro, NJ" },
      { "@type": "Place", "name": "New York metro area" },
      { "@type": "Place", "name": "South Florida" }
    ],
    "availableLanguage": "English"
  },
  "email": "joe@pennjets.com",
  "sameAs": [
    "https://www.pennjets.com",
    "https://www.linkedin.com/company/penn-jets-llc/",
    "https://x.com/pennjets",
    "https://www.instagram.com/pennjets/",
    "https://www.facebook.com/pennjets"
  ]
}
```

- The `address` is gone. `legalName` was added, and `areaServed` is set at both levels.
- `sameAs` keeps the site and adds the footer's four profiles. They match `Footer.jsx` exactly, and each answers 200 (see §7).
- `name`, `url`, `logo`, `description` and `email` are unchanged.
- **After hydration** the page has exactly one `ld+json`, the Organization: Helmet replaces the static copy rather than adding a second. On a Market Note there is still one block, postbuild's `Article`.

## 4. The contact page against the current template

| # | The brief's claim | Finding |
|---|---|---|
| 1 | The menu on `/contact` is old | **Already right since WO-4.49 and WO-4.53.** `App.jsx` renders the shared `Header`. On `/contact` at 1280 it shows Home, Charter, Buy, Sell, PennShare, Consulting, About, Market Notes (capture `contact-get-in-touch-1280.png`; `Header.test.jsx` pins the eight). |
| 2 | `/services#` footer links | **Already right since WO-4.53.** `git grep "/services#" -- src` returns nothing. |
| 3 | Emoji in the call bar | **Already right since WO-4.11.** `StickyContactBar.jsx` has 0 non-ASCII characters. Its two actions are the text labels "Call" and "Request a Quote". It has no icons and no emoji. |
| 4 | Wrong social URLs | **Already right since WO-4.53.** `Footer.jsx` has exactly the brief's four: LinkedIn `/company/penn-jets-llc/`, X `x.com/pennjets`, Instagram `/pennjets/` and Facebook `/pennjets`. All four answer 200. |
| 5 | Every "Request a Quote" on `/contact` should go to `/charter#quote` | **It did not, so it is fixed here.** The page has no quote button of its own. The sticky bar's `quoteTargetFor('/contact')` returned `/contact`, the page the reader is already on, so the button did nothing. The order says `quoteTarget.js` "already does", but that holds for `/` and `/charter`, not for `/contact`. It now returns `/charter#quote`, with a test. **For the lead:** if `/contact`'s button should go to the contact form instead, that's a one-line revert. |
| 6 | Pages outside the current layout | **None.** `App.jsx` routes About, Charter, Buy, Sell, Consulting, PennShare, Compliance, PrivacyPolicy, TermsOfService and CookiePolicy inside the same `Header`/`Footer`/`StickyContactBar` layout. **There is no `/services` page.** The route is a `<Navigate to="/#paths">`, plus the static stub from WO-4.56's pre-PR commit. |

## 5. Titles and descriptions, measured

| Value | Text | Length |
|---|---|---|
| `/contact` title | Contact Penn Jets \| Teterboro & New York Metro | **46** (limit 60) |
| `/contact` description | Talk to a broker about buying, selling, or chartering an aircraft from Teterboro and the New York metro area. Call (201) 241-2749 or send a message. | **148** (limit 160) |
| `DEFAULT_TITLE` (unchanged) | Penn Jets \| Private Jet Brokerage & Aviation Consulting | **55** |
| `DEFAULT_DESCRIPTION` | Independent aircraft brokerage and consulting from Teterboro and the New York metro area. Buy, sell, or charter with someone who shows you the numbers. | **151**, under 160, so "and consulting" stays |

- `index.html`'s fallback description now equals `DEFAULT_DESCRIPTION`.
- No keywords tag was added. `Home.jsx`'s existing one is unchanged.
- **Built `dist/contact.html`:**
  - `<title>`, `og:title`, `description` and `og:description` all carry the new values.
  - It has two `tel:+12012412749` links (the header number and the sticky bar) and no 954.
  - The order names `dist/contact/index.html`, but this build writes `dist/contact.html`.

## 6. The policy sentences, for Joseph

| # | Where | Before | After |
|---|---|---|---|
| 1 | Compliance, "Questions About Compliance" contact block | 690 SW 1st Ct #1030, Miami, FL 33130 | Clifton, New Jersey |
| 2 | Privacy policy, the Contact block at the foot (`CONTACT.address`) | 690 SW 1st Ct #1030, Miami, FL 33130 | Clifton, New Jersey |
| 3 | Privacy policy, "Last updated" | 29 October 2026 | 2 November 2026 |
| 4 | The phone in both blocks, and on the Terms | (954) 546-0763 | (201) 241-2749 |

Rows 1 and 2 ship in this PR unless Joseph says otherwise (as with WO-4.57). Row 3 follows from rows 2 and 4.

**Left as they are:**
- The Terms' governing-law clause ("laws of the State of Florida … courts of Miami-Dade County, Florida"). That decision is Joseph's.
- "a Florida limited liability company" appears **nowhere** in `src`, so there was nothing to keep.

## 7. Verify

**Grep before**, on `src public index.html scripts`, for `954|546-0763|19545460763|546.0763|Miami|33130|Fort Lauderdale`, caches excluded: **39 lines in 19 files**. Every one was in the lead's list; nothing was found in `public`, `index.html` or `scripts`.

```
src/components/common/StickyContactBar/quoteTarget.js:7:export const PHONE_DISPLAY = '(954) 546-0763';
src/components/common/StickyContactBar/quoteTarget.js:8:export const PHONE_HREF = 'tel:+19545460763';
src/components/layout/Footer/Footer.jsx:142:              <span>Call: (954) 546-0763</span>
src/components/layout/Header/Header.jsx:192:              href="tel:+19545460763"
src/components/layout/Header/Header.jsx:196:              (954) 546-0763
src/components/layout/Header/Header.test.jsx:151:    const call = el.querySelector('header a[href="tel:+19545460763"]');
src/components/pages/AircraftDetail/AircraftDetail.jsx:23:      <div>Phone: (954) 546-0763</div>
src/components/pages/Blog/BlogArticle.jsx:356:                  <a href="tel:+19545460763" ...>
src/components/pages/Blog/BlogArticle.jsx:357:                    (954) 546-0763
src/components/pages/Buy/Buy.jsx:159:                  Sorry, that didn't go through. Please try again or call (954) 546‑0763.
src/components/pages/Charter/Charter.jsx:63:            report. The Miami address and the (954) number are the registered
src/components/pages/Charter/Charter.jsx:77:              href="tel:+19545460763"
src/components/pages/Charter/Charter.jsx:81:              Call (954) 546‑0763
src/components/pages/Charter/Charter.jsx:384:              Sorry, that didn't go through. Please try again or call (954) 546‑0763.
src/components/pages/Charter/Charter.jsx:413:          <p ...>Call (954) 546‑0763 or send your itinerary.</p>
src/components/pages/Charter/Charter.test.jsx:129:    ...'a[href="tel:+19545460763"]'... /Call \(954\)/ ...
src/components/pages/Consulting/Consulting.jsx:100:                Sorry, that didn&apos;t go through. Please try again or call (954) 546-0763.
src/components/pages/Contact/Contact.jsx:125:      info: '(954) 546-0763',
src/components/pages/Contact/Contact.jsx:135:      info: '690 SW 1st Ct #1030\nMiami, FL 33130',
src/components/pages/Contact/Contact.jsx:143:      city: 'Miami, FL',
src/components/pages/Contact/Contact.jsx:144:      address: '690 SW 1st Ct #1030\nMiami, FL 33130',
src/components/pages/Contact/Contact.jsx:145:      phone: '(954) 546-0763',
src/components/pages/Contact/Contact.jsx:264:                  ...or call (954) 546-0763.</p>
src/components/pages/Home/Home.jsx:39:              "addressLocality": "Miami",
src/components/pages/Home/Home.jsx:41:              "postalCode": "33130",
src/components/pages/Home/Home.jsx:46:              "telephone": "+1-954-546-0763",
src/components/pages/Legal/Compliance.jsx:190:                <p className="text-gray-700 mb-2">690 SW 1st Ct #1030, Miami, FL 33130</p>
src/components/pages/Legal/Compliance.jsx:192:                <p ...>Phone: <a href="tel:+19545460763" ...>(954) 546-0763</a></p>
src/components/pages/Legal/TermsOfService.jsx:85:                shall be resolved in the courts of Miami-Dade County, Florida.
src/components/pages/Legal/TermsOfService.jsx:106:                <p ...>Phone: <a href="tel:+19545460763" ...>(954) 546-0763</a></p>
src/components/pages/PennShare/PennShare.jsx:323:                      placeholder="(954) 546-0763"
src/components/pages/PennShare/PennShare.jsx:381:                <p ...>Sorry, that didn't go through. Please try again or call (954) 546-0763.</p>
src/components/pages/Sell/Sell.jsx:97:                  <input ... placeholder="Fort Lauderdale, FL" ... />
src/components/pages/Sell/Sell.jsx:123:                Sorry, that didn&apos;t go through. Please try again or call (954) 546-0763.
src/content/joseph.js:23:export const JOSEPH_PHONE = '(954) 546-0763';
src/content/privacyPolicy.js:134:  address: '690 SW 1st Ct #1030, Miami, FL 33130',
src/content/privacyPolicy.js:136:  phone: '(954) 546-0763',
src/content/privacyPolicy.js:137:  phoneHref: 'tel:+19545460763',
src/seo/siteMeta.js:60:      'Talk to a broker about buying, selling, or chartering an aircraft. Call (954) 546-0763 or send a message.',
```

**Grep after**, on the source, the same patterns case-insensitive, plus `690 SW`:

```
src/components/pages/Contact/Contact.jsx:152:      address: 'Fort Lauderdale · Palm Beach · Miami',
src/components/pages/Legal/TermsOfService.jsx:85:                shall be resolved in the courts of Miami-Dade County, Florida.
```

- **Line 1:** "South Florida" listed as a market served (§2), as ordered.
- **Line 2:** the governing-law clause, which is Joseph's decision.

**Built `dist`.** No `(954)`, `+1954`, `954-546`, `954.546` or `19545460763` in any text file. The other hits:
- `contact.html` and the JS bundle: the same two lines as above.
- `terms-of-service.html`: the clause.
- Two Market Note bodies, which are CRM content and not site copy. "Jet Charter vs Ownership" mentions "a Part 135 operator based in Fort Lauderdale". The light-jet note mentions "Miami to the Bahamas" as a sample route.

**Links on `dist/contact.html`.**
- Internal: `/`, `/charter`, `/charter#quote`, `/buy`, `/sell`, `/pennshare`, `/consulting`, `/about`, `/about#team`, `/blog`, `/contact`, `/aircraft`, `/privacy-policy`, `/terms-of-service`, `/cookie-policy` and `/compliance`. Every one is a route in `App.jsx`.
- `tel:+12012412749`, twice.
- External, read with `curl` (user agent "Mozilla/5.0"):

```
https://www.instagram.com/pennjets/              HEAD 200  GET 200
https://www.facebook.com/pennjets                HEAD 200  GET 200
https://www.linkedin.com/company/penn-jets-llc/  HEAD 200  GET 200
https://x.com/pennjets                           HEAD 200  GET 200
```

**In the browser** (preview, 390 and 1280):
- `document.title` is "Contact Penn Jets | Teterboro & New York Metro".
- `tel:` links are all `+12012412749`, and no "954" appears in the page text.
- The sticky bar reads "Call -> tel:+12012412749" and "Request a Quote -> /charter#quote".
- The location headings are "New York Metro · Teterboro" and "South Florida".

**Tests, lint, build:**
- `npx vitest run src/components/layout src/components/common src/components/pages/Charter src/components/pages/Contact src/components/pages/Home src/seo src/content` gives **12 files, 105 passed, exit 0**. This includes the Charter test's one-`gtag`-conversion assertion on a step-2 success.
- `npm run lint` exits 0.
- `npm run build` exits 0. It runs `vite build`, then postbuild, then prerender:
  - 35 HTML files (20 Market Notes) and 34 sitemap URLs.
  - 35 Google Ads tag requests blocked.
- **Not run: the plain full `npx vitest run`.** The order asks for it, but T2 is the other active builder, and Joseph's two-builder rule says no full suite while another builder is active. The lead's build and suite at the merge are the evidence.
- **One ContentAnalytics row.** A 20th Market Note was published since the last build. The first build fetched its body once (`1 fetched`), which writes one row in the CRM. The second build fetched 0. The refreshed cache is `e45d0bd`.

## Beyond the order

1. **prerender now carries structured data into the static head.**
   - Its head merge kept only `<title>`, `<meta>` and `<link>`. So the home page's Organization schema, which Helmet sets at render, was dropped from `dist/index.html`. Production confirmed this: `curl https://www.pennjets.com/ | grep -c ld+json` gives **0**, before this order.
   - `slotOf` now gives an `ld+json` script a slot by its `@type`, so it is merged like any other head tag. postbuild's head still wins: a Market Note keeps exactly one block, postbuild's Article. The home page now has one Organization block, both in the built HTML and after hydration.
   - **For the lead:** this is a change to the build script, not to copy.
2. **The `/contact` quote target** (§4.5).
3. **The location grid** is now 2 columns (§2).
4. **`privacyPolicy.js` `LAST_UPDATED`** was moved to 2 November 2026 (§6, row 3).

## Needs Joseph

- The policy sentences in §6. They ship in this PR unless he says otherwise.
- The PR: `https://github.com/jspennella314/PennJets-Development-2.0/compare/main...t4/work`.
- Already routed to him by the lead, and not T4's: the NJ foreign-LLC registration, the Google Business Profile, Google Voice, the Terms venue clause, and the CRM email signature.
