---
wo: WO-4.56
terminal: T4
model: claude-opus-5-5
tested_against: local build of t4/work f2eb5ec (main 0e9ad26 + WO-4.54 Parts 3 and 2 + this order), served by vite preview on :4174; Playwright with a clean profile, the CRM host and the webhook caught first, Google let through for the measurement only. Pre-PR commit f78e603: local build of t4/work after the merge of origin/main ecea2c1 (8581a5a), vite preview on :4174, Playwright with a catch-all abort registered first and pennjets.com and the CRM caught. Production reading: https://www.pennjets.com after PR #20 (ff857b6), Playwright at 390 with a clean profile, a catch-all abort registered first, the CRM host and the webhook caught, Google let through
status: live (PR #20, ff857b6); production cookie inventory read 2026-10-29 19:22 UTC and matches the policies, no follow-up commit; labels held (Joseph's file)
---

# WO-4.56 — report: the Google Ads tag and two conversions on /charter, with the policies

## Where it is

Everything is on `t4/work`, with no topic branch.

| Commit | What |
|---|---|
| `3b1a90c` | WO-4.54 Part 3, merged |
| `8a29d36` | WO-4.54 Part 2, cherry-picked from `e163143` |
| `f2eb5ec` | **This order**: the tag, the conversions and both policies in one commit, as §4 requires |
| `d9206d3` | The cache refresh, in its own commit |
| `28a0d70`, `bd05ec6` | The report |
| `8581a5a` | **Pre-PR:** `origin/main` (`ecea2c1`, PR #19) merged in. No code conflict; `t4/work`'s newer cache kept; the WO-4.54 report's two Part 2 versions reconciled |
| `f78e603` | **Pre-PR:** the header phone number counts as a call; the `/services` stub |
| This commit | The report's pre-PR section |

**Why Part 2 was cherry-picked.** Part 2 had been built on top of
`t4/wo-4.55`. Taking it whole would have put WO-4.55 ahead of this order;
rebasing it would have rewritten pushed history. So its commit was
cherry-picked instead, and `t4/wo-4.55` merges after this.

## §1 The tag

The tag is in `index.html`'s head, placed after the WO-4.49 chrome
script, so first paint is unchanged. It also comes after the GitHub
Pages SPA redirect script, so a deep link is counted at its real address
and not at `/?/…`.

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18544502023"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-18544502023', { allow_ad_personalization_signals: false });
</script>
```

- **`allow_ad_personalization_signals: false` is my addition.** The
  order says "no remarketing", and by default an Ads `config` sends
  remarketing signals. Conversions still count with it off. The
  policies state that no remarketing audience is built, so they depend
  on this setting.
- **The tag is in all 34 pages:** the sitemap's 33 URLs plus the
  noindex `/gallery`.
  - It is deliberately absent from `404.html` (the SPA deep-link shim)
    and from the WO-4.54 redirect stub. Both hand off at once to a page
    that carries the tag.
  - Check used: each `dist/**/*.html` is grepped for both the `gtag/js`
    script and the `config` call. Result: 34 of 36, and the two without
    are the files named above.
- **The prerender blocks Google** (`scripts/prerender.mjs`). Without
  this, every build would send a visit for every page to the ad
  account, and anything `gtag.js` adds to the body (an iframe, a script)
  would be written into the static page.
  - The prerender aborts requests to `googletagmanager.com`,
    `doubleclick.net`, `googleadservices.com`, `googlesyndication.com`
    and `google.com/pagead`.
  - The build log reads: `[prerender] 34 Google Ads tag request(s)
    blocked; none reached Google.`
  - No `dist` page contains `doubleclick`, `googleadservices` or an
    `<iframe>`.
- **Screenshot:** `docs/audit/mobile-390/wo-4.56/charter-head-tag.png`
  shows the head of `dist/charter.html` as served by the preview.

**Requests on load** (the measurement in §4, 5 full page loads):

| Endpoint | Requests |
|---|---|
| `www.googletagmanager.com/gtag/js` | 5 (one per full page load) |
| `www.google.com/ccm/collect` | 5 (the `config` page hit) |
| `ad.doubleclick.net/ccm/s/collect` | 1 |

No request went to `googleads.g.doubleclick.net` with ad personalisation
off. The CRM host was caught 4 times, and nothing reached it.

**The tag's weight on `/charter`:** `gtag.js` is **159,513 bytes over the
wire** (zstd) and **462,330 bytes decoded**, measured from the response.
It loads `async`, so it does not block rendering. For scale, the site's own bundle (`dist/assets/index-*.js`) is 369,270 bytes raw and 109,718 gzipped,
so the tag is larger than the whole site's JavaScript on both measures.

## §2 The two conversions

`src/content/googleAds.js` holds:

- `AW_ID`.
- `SEND_TO_FORM` and `SEND_TO_CALL`, **both `''`** until Joseph's file
  arrives.
- `sendConversion(sendTo)`. It returns `false` and does nothing when the
  label is empty or `window.gtag` is missing. It never throws. Otherwise
  it calls `gtag('event', 'conversion', { send_to })` with nothing else,
  so no user data is sent.

The fire points:

- **The form.** In `Charter.jsx` `handleSubmit`, after
  `await blogApi.submitLead(...)` resolves and before
  `setStatus("success")`. It never fires on Continue, on the error path
  or on mount. On a wide screen the form is one step, so "step 2
  success" there means the single submit.
- **Click-to-call.**
  - The hero's "Call (954) 546‑0763" on `/charter` (`Charter.jsx`,
    `tel:+19545460763`).
  - The sticky bar's **Call** (`StickyContactBar.jsx`), on every page
    where the bar shows.

**For the lead: the order's line reference is off.** It points to
`Header.jsx:191` for "the sticky bar". That line is the desktop header's
phone number, on every page at desktop width, and it is not the sticky
bar. The sticky bar's Call is in `StickyContactBar.jsx`.

- I wired the sticky bar, which the order names twice (the facts table
  and §2).
- I did **not** wire the header number.
- If the desktop header number should count too, it is one `onClick`.
  Say so.
- **Update, pre-PR:** Joseph ruled that it counts. It is wired in `f78e603` (see "Pre-PR commit").
- No other `tel:` link is wired: About, a Market Note and the legal
  pages are unchanged.

## §3 Evidence

**Unit tests, `src/content/googleAds.test.js` (6 tests):**

- the labels are `''` and the tag id is `AW-18544502023`;
- an empty label sends nothing, even with `gtag` present;
- no `gtag` sends nothing and does not throw;
- with a label: exactly one `gtag('event', 'conversion', { send_to })`;
- a `gtag` that throws never breaks the caller.

**RTL tests, `src/components/pages/Charter/Charter.test.jsx` (5 tests,
the 390 two-step form).** `sendConversion` is spied (the real one runs)
and `window.gtag` is a spy.

| Case | Result |
|---|---|
| Page load | not called |
| Step 1 (Continue) | not called; step 2 is showing |
| Step-2 success (webhook stubbed 200 `{ success: true }`) | called once with `SEND_TO_FORM` (`''`); "Thanks" shown; **`gtag` never called** |
| Webhook stubbed 500 | not called; the alert shows |
| A click on the hero Call | called once with `SEND_TO_CALL` (`''`); `gtag` never called |

**RTL test, `StickyContactBar.test.jsx` (+1 test):** a click on the bar's
Call calls `sendConversion` once with `SEND_TO_CALL`, and `gtag` is
never called.

**The tests catch the change.** Run against `Charter.jsx` without the
wiring (stashed), the two "fires" tests fail and the three "does not
fire" tests pass.

**The `/charter#quote` anchor.** The route was reached by clicking the
home hero's "Request a Charter Quote" (`navigate('/charter#quote')`).

| Width | Heading top | Header bottom | Clear |
|---|---|---|---|
| 390 | 140 | 64 | yes |
| 1280 | 156 | 80 | yes |

Captures: `charter-quote-anchor-390.png`, `charter-quote-anchor-1280.png`.

**What is not shown: a conversion request reaching Google.** The labels
are empty, so none can be sent. That is the hold. Once the labels are
in, the first live conversion is read in the Ads account; Joseph gives
the date.

## §4 The policies: same commit (`f2eb5ec`), from a measurement

**The measurement, on the local build.**

- **Setup:** a clean Playwright profile at 390 walked home, `/charter`,
  the Falcon Market Note, `/privacy-policy` and `/cookie-policy`. The
  CRM host and the webhook were caught; Google was let through.
- **Before any interaction** (home loaded, nothing clicked or scrolled):

  | Kind | Name | Details |
  |---|---|---|
  | Cookie | `_gcl_au` | domain = the site, path `/`, **90 days**, not HttpOnly, SameSite=Lax |
  | localStorage | `_gcl_ls` | no expiry |
  | sessionStorage | none | — |

- **After the walk:** the same, and nothing else.
- **`dataLayer`:** only `js` and the `config` call; no event.
- **`pj_view_session`:** the Market Note's own session id did not show,
  because the caught CRM answered the note's fetch with an empty body,
  so no view was recorded. It is unchanged code and stays in the policy
  as measured on 2026-09-20.
- **What happens next:** production is read the same way after Joseph
  merges. If it differs (for example a cookie scoped to `.pennjets.com`
  or another name), the text is corrected in a follow-up commit and both
  readings are reported.

**Before/after: every changed sentence, for Joseph**

| # | Where | Before | After |
|---|---|---|---|
| 1 | Cookie policy, last updated | 20 September 2026 | 29 October 2026 |
| 2 | Cookie policy, headline | This site sets no cookies. | This site sets one cookie, for Google Ads. |
| 3 | Cookie policy, under the headline (1) | Not strictly necessary ones, not analytics ones, not advertising ones. We walked the site in a clean browser profile and the cookie store was still empty at the end of it. | We advertise charter on Google, and Google's advertising tag sets one cookie so that we can tell when a quote request or a phone call came from one of those ads. We walked the site in a clean browser profile and it was the only cookie in the store at the end. |
| 4 | Cookie policy, under the headline (2) | There are no third-party analytics on this site, no advertising pixels and no profiling. That was a deliberate decision, and it is why you are reading this instead of clicking through a consent banner. | There is no analytics provider on this site, no remarketing and no profiling. We have told Google not to use visits here to build advertising audiences. |
| 5 | Cookie policy, "What is actually stored" caption | Measured on … across the home page, the Market Notes index, a Market Note, the charter, buy and contact pages, and both legal pages. | Measured on … across the home page, the charter page, a Market Note, and both legal pages. *(the walk actually taken, the order's list)* |
| 6 | Cookie policy, table row | No cookies at all \| Cookie \| nothing \| There are none to describe. \| n/a | _gcl_au \| Cookie \| Google Ads, on pennjets.com, when any page loads \| Lets Google match a charter quote request or a call to the ad click that led to it, so that we can count which ads produce enquiries. \| 90 days |
| 7 | Cookie policy, table row (new) | — | _gcl_ls \| Local storage \| Google Ads, on pennjets.com, when any page loads \| Ad-click information Google's tag keeps for the same purpose as _gcl_au. \| Until you clear this site's stored data |
| 8 | Cookie policy, section title | The one thing we do store | The one thing we store ourselves |
| 9 | Cookie policy, new section "Google Ads conversion tracking" (1) | — | Every page of this site loads Google's advertising tag. When it loads, your browser contacts Google, which receives the address of the page, the page you came from, your IP address and the identifiers in the table above. |
| 10 | (2) | — | We count two things as conversions: sending the charter quote form successfully, and tapping our phone number to call us: the Call button on the charter page, the Call button in the bar at the bottom of the screen, or the number at the top of the page. A conversion tells Google that one of those happened. It does not include your name, email address, phone number or anything you typed. |
| 11 | (3) | — | Ad personalisation is turned off for this tag, so visits here are not used to build remarketing audiences or to follow you with our ads elsewhere. We do not sell your information. |
| 12 | Cookie policy, "Requests your browser makes to other companies" (1) | One, and it is ours. Loading a page contacts pennforce.pennjets.com, our own system, which is where Market Notes are loaded from and where form submissions go. | Two. Loading a page contacts pennforce.pennjets.com, our own system, which is where Market Notes are loaded from and where form submissions go. It also contacts Google, for the advertising tag described above, at www.googletagmanager.com, www.google.com and ad.doubleclick.net. |
| 13 | (2) | Nothing else. The typeface used to be fetched from Google Fonts, which meant your browser contacted Google and Google received your IP address on every page. We moved those font files onto this site, so that request no longer happens. | The typeface used to be fetched from Google Fonts on every page. We moved those font files onto this site, so that request no longer happens. |
| 14 | (3) | There is no analytics provider, no advertising network, no tag manager and no embedded third-party content on this site to contact. | Apart from Google's advertising tag, there is no analytics provider, no other advertising network and no embedded third-party content on this site to contact. |
| 15 | Cookie policy, "What you can do about it" (1) | Blocking cookies for this site changes nothing, because there are none to block. Clearing your session storage, or simply closing the tab, removes the one id described above. | Blocking cookies for this site, or blocking Google's advertising domains, stops the Google Ads cookie; the site works the same without it. Clearing this site's stored data removes _gcl_ls. Closing the tab removes our own session id. |
| 16 | (2) | There is no consent banner because there is nothing here to consent to. If that ever changes, this page changes at the same time as the thing it describes, not afterwards. | There is no consent banner. If what this site stores changes, this page changes at the same time as the thing it describes, not afterwards. |
| 17 | Privacy policy, last updated | 20 September 2026 | 29 October 2026 |
| 18 | Privacy policy, short version | We do not use advertising pixels, profiling, or third-party analytics. | We use one advertising tag, Google Ads, to count charter enquiries that came from our ads. No remarketing, no profiling, no third-party analytics. |
| 19 | Privacy policy, short version | This site sets no cookies. | Google's tag sets one cookie. We set none of our own. |
| 20 | Privacy policy, "Cookies and browser storage" (1) | This site sets no cookies. We measured it: loading a page leaves your cookie store untouched. | We set no cookies of our own. Google's advertising tag sets one, _gcl_au, for 90 days, and keeps a related value in local storage, so that a charter quote request or a call can be matched to the Google ad that led to it. The cookie policy lists exactly what is stored and for how long. |
| 21 | Privacy policy, "Cookies and browser storage" (3) | Because there is nothing to consent to, there is no cookie banner. We would rather not interrupt you with a dialog about tracking we are not doing. | There is no cookie banner. The cookie policy explains what the one cookie does and how to block it. |
| 22 | Privacy policy, "Who else sees it" (1) | We do not sell your information and we do not share it with advertisers, data brokers or analytics companies. There are none involved in this site. | We do not sell your information, and we do not share it with data brokers or analytics companies. The one advertising company involved in this site is Google, listed below. |
| 23 | (2) | The companies that run our infrastructure process it on our behalf: | The companies that run our infrastructure and measure our advertising process it on our behalf: |
| 24 | (list, new first item) | — | Google, which measures our Google Ads for us: which visits came from an ad, and whether a charter quote request or a call followed. It receives the page address, your IP address and the identifiers described under Cookies, never what you type into a form. |

Notes on the table:

- **Rows 20 and 21 go beyond the order's list.** The order named the
  privacy policy's "advertising pixels" lines and the sharing paragraph,
  "nothing else". But the privacy policy's own Cookies section said
  "This site sets no cookies", which is now false, so it changed too.
- **The no-banner sentences no longer give a reason.** Rows 16 and 21
  state the fact only. "We have checked that no law requires one" would
  be a legal claim, and legal claims are Joseph's to write.
- **Row 24 follows the order's characterisation.** It calls Google a
  processor "on our behalf", as the order does. Whether Google acts as
  Penn Jets' processor or as an independent controller for Ads
  measurement is a legal characterisation; Joseph may want counsel's
  wording.
- **The drafts** (`docs/drafts/t4/cookie-policy.md`,
  `privacy-policy.md`) were regenerated by `node scripts/legal-drafts.mjs`.
  The script's own "Measured on" line now reads the walk from the module
  (`MEASURED_ACROSS`), so the draft matches the page.

In `dist`, both pages read "Last updated 29 October 2026", and neither
contains "sets no cookies" or "advertising pixels".

## §5 Consent banner: nothing found that contradicts Joseph's position

**What the tag sets before any interaction:** the `_gcl_au` cookie (90
days) and `_gcl_ls` in local storage, on first page load, with
requests to Google's three hosts above.

**The two state laws Joseph named**, checked against current summaries
of the statutes on 2026-10-29. This is not legal advice.

- **New Jersey Data Privacy Act.** It applies only to a controller that
  processes the personal data of at least 100,000 New Jersey consumers
  (payment-only data excluded), or at least 25,000 while deriving
  revenue or a discount from selling personal data. There is no revenue
  test. Even where it applies, its advertising rule is an opt-out
  right, not prior consent. Penn Jets is nowhere near either threshold.
- **Florida Digital Bill of Rights.** It applies only to businesses with
  more than $1 billion in global annual revenue that also meet one of
  its further criteria. It does not apply.
- **Not raised by the brief, noted for completeness:**
  - Google's own EU consent policy covers EEA, UK and Swiss users, and
    the site has no EU audience by design.
  - California's CCPA has its own revenue and volume thresholds.

**Finding:** nothing contradicts the position that no banner is required
at Penn Jets' size for NJ and FL readers. **No stop.** The policies were
built without a banner.

**One item for Joseph, not a requirement:** advertising and analytics
tags have been the subject of private lawsuits under state wiretap laws
(California's CIPA most often; Florida's FSCA has been tried against
session-replay tools). That is a litigation risk area, not a consent
requirement in either statute above. Counsel is the place to weigh it.

## §6 `docs/integration/GOOGLE-ADS.md`: additions for the lead to file

That file is in the CRM repository, which T4 does not write. These lines
are for the lead to add:

- **Modules:**
  - `src/content/googleAds.js`: `AW_ID`, `SEND_TO_FORM`, `SEND_TO_CALL`
    (both `''` until the labels arrive) and `sendConversion(sendTo)`.
  - The tag is in `index.html`'s head, after the SPA redirect script,
    with `allow_ad_personalization_signals: false`.
- **Fire points:**
  - `Charter.jsx` `handleSubmit`, after `submitLead` resolves (webhook
    200 with `success`), before `setStatus("success")`, sends
    `SEND_TO_FORM`.
  - `Charter.jsx`'s hero "Call (954) 546‑0763" (`onClick`) sends
    `SEND_TO_CALL`.
  - `StickyContactBar.jsx`'s Call (`onClick`, any page) sends
    `SEND_TO_CALL`.
- **The build:** `scripts/prerender.mjs` blocks Google's hosts, so a
  build sends nothing.
- **Cookie inventory, local build 2026-10-29:**
  - `_gcl_au`: cookie, first-party, 90 days, SameSite=Lax.
  - `_gcl_ls`: localStorage.
  - Both are set on first load, before any interaction.
- **Still to come:** the production reading, after the merge, and the
  date the tag started counting (from Joseph).

## Pre-PR commit (the lead's verdict, 2026-10-29)

The three items of the verdict's "Before the PR" list, plus one policy line that follows from item 2:

1. **Main merged** (`8581a5a`). PR #19 had carried Part 2's original (`e163143`) and WO-4.55; `t4/work` had Part 2 as the cherry-pick `8a29d36`. Two conflicts, neither in code: `scripts/crm-articles.cache.json` (kept `t4/work`'s, the newer) and `docs/reports/t4/WO-4.54.md` (the two Part 2 texts rewritten as one that says what happened). After the merge, the diff against `origin/main` is only WO-4.56.
2. **The desktop header number** (`Header.jsx`, `tel:+19545460763`) gets `onClick={() => sendConversion(SEND_TO_CALL)}`, Joseph's ruling. Its test sits in `Header.test.jsx`: one click sends the call label once, and gtag hears nothing while the label is empty. **The test fails with the `onClick` removed** (1 failed, 15 passed), and passes with it.
3. **The cookie policy follows the header ruling, in the same commit.** Its Google Ads section named the two Call buttons, so it now names the header number too. **Row 10 of the before/after table has the new wording; it is Joseph's to approve with the rest.** The drafts were regenerated, and the comment in `googleAds.js` was updated to match.
4. **The `/services` stub** (the WO-4.54 Part 2 addendum). `redirectStub.js` now has one internal template; the note stubs come out byte for byte as before (their tests are unchanged and pass), and `servicesStubHtml()` adds the retired page. postbuild writes it to `dist/services.html`. It is not in the sitemap (`grep -c services dist/sitemap.xml` gives 0), and prerender leaves it as written.

   ```html
   <title>Penn Jets</title>
   <script>location.replace("https://www.pennjets.com/" + location.search + (location.hash || "#paths"));</script>
   <meta http-equiv="refresh" content="0; url=https://www.pennjets.com/#paths">
   <link rel="canonical" href="https://www.pennjets.com/">
   <meta name="robots" content="noindex">
   ```

   **One difference from the note stubs:** the target has its own fragment, so the script puts the query string before it. Appending `location.search` to `/#paths` would have put the utm values inside the hash, where nothing reads them. Followed in Chromium from `/services.html?utm_source=linkedin&utm_medium=social&utm_campaign=wo-4-56-check`:
   - With scripts on, it lands on `https://www.pennjets.com/?utm_source=linkedin&utm_medium=social&utm_campaign=wo-4-56-check#paths`.
   - With scripts off, the meta refresh lands on `https://www.pennjets.com/#paths`.
   - Requests to the CRM: 0. Both pennjets.com requests were caught locally, and nothing reached the live site.

**Pre-PR evidence:**
- Touched tests: `npx vitest run src/seo/redirectStub.test.js src/components/layout/Header/Header.test.jsx src/components/common/StickyContactBar src/content/googleAds.test.js src/components/pages/Charter` gives 5 files, **41 passed**.
- `npm run lint` exits 0.
- `npm run build` exits 0:
  - 34 HTML files and 33 sitemap URLs.
  - `[prerender] 2 redirect stub(s) left as written: /blog/title-dassault-falcon-900b-for-sale-2026-market-study, /services`.
  - 34 Google Ads tag requests blocked.
  - Article bodies: 19 from cache, **0 fetched**, so no ContentAnalytics row.
- The build changed the cache file's line endings only, so there is no cache commit.
- Not run: the full suite (T3 is active). The preview is stopped.

## Production reading (after PR #20, 2026-10-29 19:22 UTC)

**Live:**
- `curl https://www.pennjets.com/charter` gives 200, with `AW-18544502023` and `allow_ad_personalization_signals: false` in the head.
- `curl https://www.pennjets.com/services` gives **200** (it was 404): 509 bytes, the refresh to `/#paths`, and `noindex`.

**Cookie inventory.** Read with a clean profile at 390. The walk was home, then `/charter`, then the Falcon Market Note, then both legal pages, the same walk as the local measurement:

| | Before any interaction (home loaded) | End of the walk |
|---|---|---|
| Cookies | `_gcl_au`: domain `.pennjets.com`, path `/`, 90 days, SameSite=Lax, not HttpOnly | the same, and nothing else |
| localStorage | `_gcl_ls` | `_gcl_ls` |
| Google requests | 3 | 11 in all: `gtag/js` ×5, `www.google.com/ccm/collect` ×5, `ad.doubleclick.net/ccm/s/collect` ×1 |

- **This matches the local reading and the policy text, so there is no follow-up commit.**
- `dataLayer` holds `js` and the `config` with personalisation off, and no conversion event. That is expected, since the labels are empty and nothing was clicked or submitted.
- gtag.js on production is 159,888 bytes over the wire (zstd) and 463,459 decoded, the same order as locally.
- The CRM host was caught: 4 requests answered locally. So no ContentAnalytics row was written, and no form was submitted.
- `pj_view_session` did not appear, because the caught CRM answered the note with an empty body. That row is WO-4.12's, unchanged by this order, and was not re-measured here.

**For the lead (technical, no policy change proposed):**
- `_gcl_au` is scoped to `.pennjets.com`, not `www.pennjets.com`.
- So the browser would also send it to `pennforce.pennjets.com` on any request that carries cookies.
- No call does send it, from reading the code. Every CRM call is a plain `fetch` with no `credentials` option, so it uses the default `same-origin`, and pennforce is another origin. That includes the view beacon, which is `fetch` with `keepalive` and not `sendBeacon`, which would always send cookies. No code change is needed. This is a reading of the code, not a captured request.

**Row 10.** Joseph approved "all 24 rows" (joseph.md, lead commit `0ca55ae`, 12:42 EDT). Row 10's wording changed in the pre-PR commit (`f78e603`, the header number) and went live in PR #20. If his approval was given on the table the lead relayed before that change, the new row 10 still needs his word.

**Still owed:** the two labels (a one-line commit when Joseph's file is on the order) and the date the tag started counting (Joseph to the lead).

## Tests, lint, build

- **Touched tests:** `npx vitest run src/content src/components/pages/Charter src/components/common src/components/layout src/seo`
  gives **7 files, 76 tests, 76 passed**.
- **Lint:** `npm run lint` exits 0.
- **Build:** `npm run build` exits 0, with 34 HTML files (19 Market
  Notes) and 33 sitemap URLs.
  - The first build refetched one note body (the Falcon note's
    2026-10-29 edit; this tree's cache predated it), which is one
    ContentAnalytics row. The refreshed cache is `d9206d3`, and the
    second build fetched none.
- **Not run:** the full suite, because T3 (WO-3.54) is the other active
  builder.
- The preview was stopped; no node process of this repo is running.

## Needs Joseph

1. **The two conversion labels, by file.** The lead appends them to the
   order and T4 fills `googleAds.js`. Until then nothing is counted.
2. **The before/after table above.**
3. **The merge**, then the date of the first recorded conversion, which
   starts the two-week hold on `/charter`.
4. ~~For the lead: whether the desktop header's phone number should also count as a call.~~ Ruled yes by Joseph; done in `f78e603`.
