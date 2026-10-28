---
wo: WO-4.53
terminal: T4
model: claude-opus-5-5
tested_against: local build of t4/work 59dc23d (main 818ab32 + WO-4.54 Part 1), served by vite preview on :4174, Playwright at 390x844 with the CRM host caught first and the webhook stubbed
status: done; copy to Joseph again in the PR. Row 2 (photography) still unanswered, a one-line follow-up if he says move.
---

# WO-4.53 — report

## Step one: the sentence report

`docs/drafts/t4/for-joseph-WO-4.53.md` was pushed at `30bcb69` before
anything was deleted.

The page had **five** service cards, not the three the order named:
Market Analysis (`:61`) and Consulting Services (`:78`) as well. All
five were reported.

## Joseph's answers (2026-10-28, relayed in the order's §4), quoted

| Row | Joseph |
|---|---|
| 1, 3, 6, 8, 10 | **Drop** (your whole drop list). |
| 2 photography | **Not answered yet.** … Services is deleted either way; if he says "move", the `/sell` step 2 sentence from your row 2 is a one-line follow-up after this order. Do not wait for it. |
| 4 financing and insurance | **Move to `/buy` step 3**, both. |
| 5 delivery logistics | **Move to `/buy` step 3** with row 4. Step 3 reads, in your words: "We manage the offer, inspection, financing, insurance, closing and delivery with you." |
| 7 valuation | **Move to `/consulting`**, inside ownership analysis (Part B bullet 1 keeps "what the aircraft is worth"). **The footer's "Valuation Services" link stays and keeps pointing at `/consulting`.** |
| 8 footer | **The footer's "Market Analysis" link goes to `/blog`.** |
| 9 audience | **Keep** … "Ownership analysis, fleet planning and pre-purchase strategy, for individuals, corporations, and family offices. Tell us what you need help with." |

He approved Part B as proposed, with the row 9 intro and the row 7
bullet 1.

## Commits on `t4/work`, in the order's sequence

1. `3a4c398`, the moves in his words: Buy step 3, and the Consulting
   intro and bullets.
2. `299257e`, the removal and redirect:
   - `Services.jsx` deleted. It had no test file.
   - `/services` becomes `<Navigate to="/#paths" replace />`.
   - The menu row, the `quoteTarget` branch and the `ROUTES` entry are
     removed.
   - `Header.test.jsx` re-pinned: nine drawer rows, eight on desktop,
     and no `/services` link.
3. `59dc23d`, the footer.

## Copy, before and after (for Joseph, again in the PR)

| Where | Before | After |
|---|---|---|
| `/buy` step 3 | We manage the offer, inspection, and closing with you. | We manage the offer, inspection, financing, insurance, closing and delivery with you. |
| `/consulting` intro | Cost of ownership, mission fit, ownership structure, or a second opinion on a deal in front of you. Tell us what you need help with. | Ownership analysis, fleet planning and pre-purchase strategy, for individuals, corporations, and family offices. Tell us what you need help with. |
| `/consulting` bullet 1 | Aircraft selection and mission fit | Ownership analysis: what the aircraft is worth, what it costs to own, and whether sole or fractional fits |
| `/consulting` bullet 2 | Cost of ownership and budget modelling | Fleet planning: which aircraft fit the mission, now and as it changes |
| `/consulting` bullet 3 | Ownership structure options, sole or fractional | Pre-purchase strategy: what to check, what to offer, and a second opinion on a deal already in front of you |
| `/consulting` bullet 4 | A second opinion on a deal already in front of you | *(removed, folded into bullet 3)* |
| Menu | … Consulting, **Services**, About … | … Consulting, About … |
| Footer, Services column | Aircraft Sales → `/services#sales`; Aircraft Acquisition → `/services#acquisition`; Charter Services → `/services#charter`; Consulting → `/consulting` | Charter Services → `/charter`; Consulting → `/consulting` |
| Footer, Aircraft column | Market Analysis → `/services#analysis`; Valuation Services → `/services#analysis` | Market Analysis → `/blog`; Valuation Services → `/consulting` |

The h1, the placeholder and the aside note on `/consulting` are
unchanged, as approved.

### Two rows now pointed at one page, so one row of each pair was kept

- **"Aircraft Sales" was dropped. "Sell Your Aircraft" was kept.** Once
  re-pointed, "Aircraft Sales" would have gone to `/sell` beside
  "Sell Your Aircraft", which already does.
- **"Aircraft Acquisition" was dropped. "Buy an Aircraft" was kept.** It
  would have gone to `/buy` beside "Buy an Aircraft", the name Joseph
  chose in WO-4.49.

"Valuation Services" and "Consulting" both point at `/consulting`.
Both stay, because Joseph ruled the Valuation link stays.

The footer column keeps its heading "Services". The heading is a
label, not a link to the page; say if it should change.

## Evidence

### Redirect, menu, footer, Consulting

Playwright at 390×844 against the preview. The CRM catch-all was
registered first, and the webhook was stubbed.

```json
"redirect":       { "url": "/#paths", "heading": "Buy, sell, or charter with someone who shows you the numbers.", "top": 112, "headerBottom": 100, "clear": true },
"redirectAnchor": { "url": "/#paths", ... "top": 112, "headerBottom": 100, "clear": true },   ← /services#sales
"menu": ["Home","Charter","Buy","Sell","PennShare","Consulting","About","Market Notes","Contact"],
"footer": ["Charter Services -> /charter","Consulting -> /consulting","Buy an Aircraft -> /buy",
           "Sell Your Aircraft -> /sell","Market Analysis -> /blog","Valuation Services -> /consulting"],
"servicesLinks": 0,
"buyStep3": "3.\nWe manage the offer, inspection, financing, insurance, closing and delivery with you.",
"leads": [{ "url": ".../api/webhooks/incoming/<id>",
            "body": { "name": "Test Evidence", "email": "evidence@example.com", "service": "consulting",
                      "message": "Consulting enquiry\nStubbed submit for WO-4.53 evidence.", "pageUrl": "http://localhost:4174/consulting" } }],
"crm": []
```

- The Consulting payload is unchanged in shape (WO-4.50's table):
  `service: "consulting"`, and the message is headed "Consulting
  enquiry". The submit went only to the stub.
- On Pages, a direct hit on `/services` now goes through `404.html` (the
  SPA shim, since no `services.html` is written) and then the
  `Navigate`. The preview's SPA fallback skips the shim, so the Pages
  hop is read live after the merge.

Captures, in `docs/audit/mobile-390/wo-4.53/`:

- `services-redirect-390.png`: the tiles heading is below the header
  and banner.
- `consulting-viewport.png`: the new intro.

### Build (`npm run build`, exit 0)

```
[postbuild] article bodies: 19 from cache, 0 fetched
[postbuild] wrote 34 HTML files (19 Market Notes) and sitemap.xml with 33 URLs
[prerender] 1 redirect stub(s) left as written: /blog/title-dassault-falcon-900b-for-sale-2026-market-study
[prerender] 34 of 34 routes rendered in 47.1s
```

| Check | Result |
|---|---|
| HTML files | 35 before (main plus the WO-4.54 stub build) → 34 |
| Sitemap URLs | 34 → 33 |
| `ls dist/services*` | `No such file or directory` |
| `grep -c services dist/sitemap.xml` | 0 |

The order's "30 → 29" predates the new notes.

### `git grep -n "services" src`, excluding the `src/services/` API folder and its imports

```
src/App.jsx:43:              <Route path="/services" element={<Navigate to="/#paths" replace />} />
src/components/pages/Legal/Compliance.jsx:23:   … brokerage and consulting services
src/components/pages/Legal/TermsOfService.jsx:25: … our website or services.
src/components/pages/Legal/TermsOfService.jsx:34: … charter services are conducted by
src/components/pages/Legal/TermsOfService.jsx:65: … third-party operator services. …
src/seo/siteMeta.js:74:  '/terms-of-service': { … 'Terms governing use of the PennJets website and services.' },
```

- The one hit outside legal prose is the redirect route itself.
- The `/terms-of-service` description is the legal page's own line, so
  it is out of scope.

### Tests and lint

- The touched files' tests (Header, StickyContactBar, seo, Home):
  **7 files, 73 tests, 73 passed**.
- `npm run lint`: exit 0.
- The full suite was not run, because T1 (WO-1.37) is the other active
  builder.
- The preview was stopped. The remaining node.exe processes are T1's
  CRM vitest run, not this repo.

## Open

- **Row 2, photography.** If Joseph says move, `/sell` step 2 becomes
  "We agree an asking price and a plan, photograph the aircraft, and take
  it to buyers." That is a one-line follow-up.
- **The PR.** The copy table above goes to Joseph. This work is on
  `t4/work`, behind the WO-4.54 Part 1 PR (`t4/pr-4.54-stub`), which
  `t4/work` already contains.
