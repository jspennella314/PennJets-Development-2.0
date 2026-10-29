---
wo: WO-4.51
terminal: T4
branch: t4/work
commit: a86d555
tested_against: "local checkout of t4/work at a86d555 (cache refresh 058dc30), on top of origin/main a2bcc10, Node 22.19.0: eslint on the eight touched files (exit 0), vitest on src/services, src/components/pages/Blog and src/seo (6 files, 125 tests, all pass), npm run build (exit 0; read the production CRM list, 17 notes, one new article body fetched), vite preview on localhost:4174 driven by the repo's Playwright Chromium at 390x844 (mobile, touch), every CRM read answered locally with a catch-all for the CRM host registered first; no request reached the CRM. The live list route read once with curl (GET, writes nothing). No deployed preview exists for this site; nothing here is deployed."
model: claude-opus-5-5
date: 2026-10-21
status: reported
---

# WO-4.51 report: the emoji out, the cards' byline and read time, the two "team" descriptions

**Needs Joseph: the two description lines in section 3.** They are in the
code on `t4/work` and nothing merges until he approves or amends them.

**Blocked on T1's WO-1.36 (section 2, the live check only).** On
2026-10-21 the live list route still sends neither `author.email` nor
`readTimeMinutes`. The site side is done and tested against both fields as
WO-1.36 specifies them. The live check and the baked check run at the first
build after WO-1.36 is deployed.

```
$ curl -sL "https://pennforce.pennjets.com/api/public/blog?limit=3"   (fields per post)
pilatus-pc-12-ngx-for-sale-2026-market-s {"id":"cmh8apgpu0001vscwzrafl22b","name":"Joseph Pennella"} readTimeMinutes: undefined content: false
charter-demand-is-up-27-flying-isnt      {"id":"cmh8apgpu0001vscwzrafl22b","name":"Joseph Pennella"} readTimeMinutes: undefined content: false
617-aircraft-21-for-sale-inside-the-g550 {"id":"cmh8apgpu0001vscwzrafl22b","name":"Joseph Pennella"} readTimeMinutes: undefined content: false
```

## 1. The emoji, page by page

My grep at `a2bcc10`, the order's ranges, over `src/`, `index.html` and
`public/*.html`, found exactly the lead's table: nothing added.

| Page | File | Before | After |
|---|---|---|---|
| About, the broker card | `About.jsx` | `📞 (954) 546-0763` (plain text) | `Phone: (954) 546-0763`, the number a `tel:+19545460763` link |
| About, the broker card | `About.jsx` | `✉️ joe@pennjets.com` (plain text) | `Email: joe@pennjets.com`, a `mailto:` link |
| About, Professional Services | `About.jsx` | 🛩️ above "Aircraft Brokerage" | no icon |
| About, Professional Services | `About.jsx` | 📊 above "Fractional Ownership" | no icon |
| About, Professional Services | `About.jsx` | 🎯 above "Charter Brokerage" | no icon |
| every page, footer | `Footer.jsx` | `📞 Call: (954) 546-0763` | `Call: (954) 546-0763` |
| every page, footer | `Footer.jsx` | `✉️ Email: joe@pennjets.com` | `Email: joe@pennjets.com` |
| `/aircraft/:id` (redirected) | `AircraftDetail.jsx` | 👤 in a blue circle above "Aviation Consultant" | the circle removed |
| `/aircraft/:id` (redirected) | `AircraftDetail.jsx` | `📞 (954) 546-0763` / `✉️ joe@pennjets.com` | `Phone: …` / `Email: …` |
| `/aircraft` (redirected) | `AircraftListing.jsx` | ✈️ above "No aircraft found" | removed |
| `/blog`, empty category | `BlogList.jsx` | 📰 above "No notes here yet" | removed |

The About contact lines were plain text before, not links. The order says
"the number stays a `tel:` link", so I made both of them links in the form
the rest of the site uses (`tel:+19545460763`, as in the header, Charter
and the note page).

On the value cards I chose no icon over a `react-icons` one. The headings
already say what each card is, and an icon is a new design choice. If Joseph
wants icons, it is three imports and three lines.

**Left as the order says, and listed:**
- `Compliance.jsx:44,54,64,127,137,147`: ✓ (U+2713) as a list marker in a
  coloured circle.
- `Gallery.jsx:139,161`: ✕ Close and ✓ URL Copied!.
- `blogApi.js:197-234`: emoji in `console.log` lines, not copy.

**After the sweep,** at `a86d555`, everything that still matches is one of the three items left above:

```
$ git grep -n -I -P '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}\x{1F000}-\x{1F2FF}\x{2B50}]' -- src index.html 'public/*.html' \
    | grep -v "Compliance.jsx\|Gallery.jsx\|blogApi.js:"
(empty)
```

The built site and the rendered pages were checked too:
- **Built HTML.** A UTF-8 grep of every HTML file in `dist/`, including the
  17 prerendered notes, matches only `compliance.html`, which holds the kept ✓.
- **Rendered text.** I read `document.body.innerText` at 390 on 14 routes:
  `/`, `/about`, `/buy`, `/sell`, `/charter`, `/pennshare`, `/consulting`,
  `/services`, `/contact`, `/blog`, `/privacy-policy`, `/terms-of-service`,
  `/cookie-policy` and `/compliance`. Every route has zero matches except
  `/compliance`, which has the six ✓.

Captures, all at 390 (`docs/audit/mobile-390/wo-4.51/`):
- `about-viewport.png`
- `about-contact.png`: the broker card, with "Phone:" and "Email:" as links
- `about-services.png`: the three cards with no icon
- `footer.png`: "Call: (954) 546-0763" and "Email: joe@pennjets.com"

## 2. The index cards

`transformPost` (`src/services/blogApi.js`) now picks the read time in this order:
1. the route's `readTimeMinutes`, when it is a positive number;
2. otherwise a figure computed from `content` (the article route);
3. otherwise `null`, and the card shows no read time.

The `: 5` fallback is gone. Both lists go through `transformPost`: the live
route's list and the build-time list (`/data/market-notes.json`). The card
already renders the read time only when it is set (`BlogList.jsx`).

The byline needed no change. The author map is keyed by email, so a list
post that carries `author.email: joe@pennjets.com` renders "Joseph
Pennella". This is pinned by a new test.

Four new tests in `blogApi.test.js` cover:
- the route's field wins, even when content is present;
- the read time is computed from content when there is no field;
- `null` for no field, for 0, and for an explicit null;
- the byline names Joseph once the email arrives.

One existing assertion changed: a post with neither field nor content now
gives `null`, where it used to give `5`.

Evidence at 390 from `vite preview`, two scenarios:

| Scenario | List route and build list | Cards |
|---|---|---|
| today | as served now: no email, no read time | 17 of 17 "By PennJets", no read time on any card (`blog-cards-today.png`, `blog-cards-today-third.png`) |
| as WO-1.36 will serve | both lists answered with `author.email` and per-note `readTimeMinutes` of 3 to 9; the third note (the G550 study) carries neither | 16 cards "By Joseph Pennella" with their own read times (3, 4, 6, …); the G550 card "By PennJets" with no read time (`blog-cards-wo136.png`, `blog-cards-wo136-third.png`) |

**Still to verify once WO-1.36 is deployed:**
- the live route's cards;
- the prerendered `/blog`.

The prerendered page today carries "By PennJets" 17 times and no "min
read". Its HTML is rendered from `scripts/crm-posts.cache.json`, which is
the raw list route. It will carry the name and the read times at the first
build after the route sends them, through the same `transformPost`. I will
check both and append them here.

## 3. The two "team" descriptions (Joseph approves)

`src/seo/siteMeta.js`, verified in the built `<head>`:

| Page | Before | After |
|---|---|---|
| `/about` description | Meet the PennJets team. Private aviation sales and consulting: sole ownership, fractional, charter brokerage, and advisory. | Joseph Pennella, founder and principal broker of PennJets. Private aviation sales and consulting: sole ownership, fractional, charter brokerage, and advisory. |
| `/blog` description | Market notes, transaction insights, and aircraft overviews from the PennJets team. | Market notes, transaction insights, and aircraft overviews from PennJets. |

```
dist/about.html: name="description" content="Joseph Pennella, founder and principal broker of PennJets. Private aviation sales and consulting: sole ownership, fractional, charter brokerage, and advisory."
dist/blog.html:  name="description" content="Market notes, transaction insights, and aircraft overviews from PennJets."
```

"Founder and Principal Broker" is the title the site already shows on the
About card (`content/joseph.js`). No other "PennJets team" string is left
in `src/`, `index.html`, `public/` or `scripts/`.

## Answered on the order

Where an article's meta description comes from: `siteMeta.js`, `post.metaDescription || post.excerpt || DEFAULT_DESCRIPTION`. Not changed.

## Build and tests

```
$ npx eslint <the eight touched files>          exit 0
$ npx vitest run src/services src/components/pages/Blog src/seo
 Test Files  6 passed (6)
      Tests  125 passed (125)
$ npm run build                                   exit 0
[postbuild] wrote data/market-notes.json: 17 note(s), 18,034 bytes
[postbuild] article bodies: 16 from cache, 1 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
[postbuild] wrote 32 HTML files (17 Market Notes) and sitemap.xml with 31 URLs
[prerender] 32 of 32 routes rendered in 56.6s, 178,623 characters of body text added
[prerender] 17 view beacon(s) intercepted; none reached the CRM.
[prerender] 20 note-list read(s) answered from scripts/crm-posts.cache.json; none reached the CRM.
```

The build found a 17th note. The new body fetch wrote one ContentAnalytics
row, as designed. The cache refresh is its own commit, `058dc30`.

I did not run the full suite. The touched files' tests are above, and the
lead's build at the merge is the evidence.

```
$ git show --stat --format= a86d555
 src/components/layout/Footer/Footer.jsx            |  4 +--
 src/components/pages/About/About.jsx               | 11 ++++----
 .../pages/AircraftDetail/AircraftDetail.jsx        |  7 ++----
 .../pages/AircraftListing/AircraftListing.jsx      |  1 -
 src/components/pages/Blog/BlogList.jsx             |  1 -
 src/seo/siteMeta.js                                |  4 +--
 src/services/blogApi.js                            | 13 +++++++---
 src/services/blogApi.test.js                       | 29 +++++++++++++++++++++-
 8 files changed, 48 insertions(+), 22 deletions(-)
```

Only this repository was touched. My preview is stopped, and no node
process of mine is running.

## Addendum 2026-10-29: the card check, at the first build after WO-1.36

T1's WO-1.36 is live. The public list route now carries `author.email`
and `readTimeMinutes` for every note; the `crm-posts.cache.json`
refresh is `2ccb77b`, on `t4/wo-4.54-p3`. The first local build after
that, read in `dist/blog.html`:

```
By PennJets:        0   (17 before WO-1.36)
By Joseph Pennella: 19
min read:           19  (1, 2, 3, 6×4, 5×5, 2×6, 2×7, 8)
```

All 19 index cards show a real author and the CRM's read time, and none
falls back. The live read follows the next deploy of the site.
