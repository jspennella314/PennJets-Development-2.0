---
wo: WO-4.34
terminal: T4
branch: t4/work
commit: e3a91a0
tested_against: "site: npm run build at e3a91a0 on this machine (Node v22.19.0, exit 0, 27 of 27 routes prerendered), the built dist served by vite preview on localhost:4173 and read by Playwright Chromium at a 390x844 viewport. No CRM evidence crosses the boundary: the prerender answered all 11 article fetches from cache and intercepted all 11 beacons, so it reached the CRM zero times. NOT a production deploy; T4 does not merge."
date: 2026-09-28
status: reported
---

# WO-4.34 report — the "our team" claims and the 24/7 claim, removed

`t4/work` first fast-forwarded to `main` (`a450f6a`), so this work sits on
the same base the lead read the six lines from.

## Commit

`e3a91a0` WO-4.34: remove the "our team" claims and the 24/7 claim. On
`t4/work`, pushed. Not merged.

```
$ git show --stat --format= e3a91a0
 src/components/pages/Blog/BlogList.jsx       | 2 +-
 src/components/pages/Contact/Contact.jsx     | 7 ++++---
 src/components/pages/Legal/Compliance.jsx    | 2 +-
 src/components/pages/PennShare/PennShare.jsx | 2 +-
 src/components/pages/Services/Services.jsx   | 2 +-
 5 files changed, 8 insertions(+), 7 deletions(-)
```

## Rewrites — all **proposed**, for Joseph at merge

Each one replaces "our team" (and its attached "of experts" / "of aviation
professionals") with **Penn Jets' name**. No other word changed. No
headcount, expertise adjective or response time was added.

| File | Old | New (**proposed**) |
|---|---|---|
| `Blog/BlogList.jsx:116-117` | Stay informed with the latest industry trends, aircraft reviews, and expert insights from our team of aviation professionals. | Stay informed with the latest industry trends, aircraft reviews, and expert insights from Penn Jets. |
| `Contact/Contact.jsx:159-160` | Ready to take the next step in your aviation journey? Our team of experts is here to help you with all your private aircraft needs. | Ready to take the next step in your aviation journey? Penn Jets is here to help you with all your private aircraft needs. |
| `Legal/Compliance.jsx:177` | …update our compliance practices accordingly. Our team stays informed about evolving requirements in aviation, data protection, and business regulations to ensure ongoing compliance. | …update our compliance practices accordingly. Penn Jets stays informed about evolving requirements in aviation, data protection, and business regulations to ensure ongoing compliance. |
| `PennShare/PennShare.jsx:277` | Take the first step toward intelligent aircraft ownership. Our team will contact you within 24 hours. | Take the first step toward intelligent aircraft ownership. Penn Jets will contact you within 24 hours. |
| `Services/Services.jsx:352` | Connect with our team of aviation professionals to discuss how we can support your specific requirements with tailored solutions and expert guidance. | Connect with Penn Jets to discuss how we can support your specific requirements with tailored solutions and expert guidance. |

"expert insights" (BlogList) and "expert guidance" (Services) were already
there, outside the "our team" phrase; the order says every other string
stays, so they stay.

## The 24/7 line — the Phone card now carries **no description**

The `description` key is removed from the Phone entry. The card template
rendered `<p>{item.description}</p>` unconditionally, which would have left
an empty paragraph, so it now renders only when a description exists. The
Email and Address cards are unchanged.

## Flagged, not changed (out of scope — response-time claims)

- **PennShare**: "Penn Jets will contact you within 24 hours." — shares a
  sentence with the removed "our team"; the timing words are kept exactly.
- **Contact, Email card** (`Contact.jsx:131`): "We respond within 2 hours" —
  untouched.

Both for the lead to queue to Joseph.

## Sweep — `our team`, `team of`, `24/7`, `around the clock`

`grep -rniE "our team|team of|24/7|around the clock"`

**Before**, `src` + `index.html` (at `a450f6a`):

```
src/components/pages/Blog/BlogList.jsx:117:              insights from our team of aviation professionals.
src/components/pages/Contact/Contact.jsx:126:      description: 'Available 24/7 for urgent inquiries',
src/components/pages/Contact/Contact.jsx:160:              Ready to take the next step in your aviation journey? Our team of experts 
src/components/pages/Legal/Compliance.jsx:177:                accordingly. Our team stays informed about evolving requirements in aviation,
src/components/pages/PennShare/PennShare.jsx:277:              Take the first step toward intelligent aircraft ownership. Our team will contact you within 24 hours.
src/components/pages/Services/Services.jsx:352:            Connect with our team of aviation professionals to discuss how we can support
```

**Before**, the previously built `dist` (files with a match):

```
dist/assets/index-ac3b18f0.js
dist/blog/how-to-buy-your-first-private-jet-2025-step-by-step-buyers-guide.html
dist/blog.html
dist/compliance.html
dist/contact.html
dist/pennshare.html
dist/services.html
```

**After**, `src` + `index.html`: **zero matches** (grep exit 1).

**After**, rebuilt `dist`: one match, which stays:

```
dist/blog/how-to-buy-your-first-private-jet-2025-step-by-step-buyers-guide.html:60:
  …compare proposals (fees, crew sourcing, training, MEL control, 24/7 dispatch).<br>Crew: PIC/SIC t…
```

It stays because it is **Market Note body text served by the CRM**
(`contentHtml`), not site copy, so it is not in this repository's source. It
is also not a Penn Jets claim: it lists what a buyer should compare in a
management company's proposal. If it should change, that is a CMS edit.

## UI evidence — `/contact` and `/pennshare` at 390

The built `dist` served by `vite preview`, loaded by Playwright Chromium
with a 390x844 viewport; `innerText` read from the rendered page:

```
== /contact innerWidth=390 scrollWidth=390
Ready to take the next step in your aviation journey? Penn Jets is here to help you with all your private aircraft needs.
[card] Phone |  | (954) 546-0763
[card] Email |  | joe@pennjets.com |  | We respond within 2 hours
[card] Address |  | 690 SW 1st Ct #1030 | Miami, FL 33130 |  | Visit our offices by appointment
== /pennshare innerWidth=390 scrollWidth=390
Take the first step toward intelligent aircraft ownership. Penn Jets will contact you within 24 hours.
```

`scrollWidth` equals `innerWidth` on both, so no horizontal overflow. The
Phone card has no third line and no empty paragraph. The prerendered HTML
agrees:

```
Phone</h3><p class="text-gray-600 whitespace-pre-line mb-1">(954) 546-0763</p>
```

Screenshots: `wo-4.34-contact-390.png`, `wo-4.34-pennshare-390.png` in this folder.

## Build

```
$ npm run build   → exit 0
> vite build && node scripts/postbuild.mjs && node scripts/prerender.mjs
✓ built in 20.88s
[prerender] 27 of 27 routes rendered in 49.3s, 137,803 characters of body text added
[prerender] 11 view beacon(s) intercepted; none reached the CRM.
[prerender] 11 article fetch(es) answered from cache; none reached the CRM, so none wrote a ContentAnalytics row.

$ npm run lint    → exit 0
> eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0
```

## Tests

n/a. The site has no test suite, and no test file was touched.

## Scope

The five components the order names, and nothing else. The report and the
two screenshots are in `docs/reports/t4/`.

## Known gaps

- The build refreshed `scripts/crm-articles.cache.json` and
  `scripts/crm-posts.cache.json` (tracked). They are build byproducts and out
  of scope, so they are **not** in either commit and are left modified in
  the working tree.
- The rewrites are proposals. Nothing is live until Joseph merges.
