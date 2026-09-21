---
wo: WO-4.4
terminal: T4
branch: t4/work
commit: 813e1ad
tested_against: "site: local dev (vite 5173) at 813e1ad — NOT yet a production deploy, see Known gaps; CRM: production dpl_FsRLBXmS8bFju1c5tEwGi18Kxapp (5b95295)"
date: 2026-09-20
status: reported
---

# WO-4.4 report — the four inquiry forms

`sell` and `consulting` did not exist. Both now post to the existing webhook
with the exact `service` values T3's filter expects. `charter` and `buy` were
already live and are unchanged apart from a layout fix noted below.

## Commit

- `85a4574` WO-4.4: sell and consulting inquiry forms
- `813e1ad` Clear the fixed header on the inquiry pages

Both on `t4/work`, pushed. Not merged.

## Route evidence

Submitted from an emulated phone (390x844) against the production CRM. URL
carried all five UTM parameters and `?note=why-we-publish-market-notes` so
blogPostSlug attribution was exercised.

### sell

```
POST https://www.pennforce.pennjets.com/api/webhooks/incoming/<webhookId>

{
  "name": "T4 TEST WO-4.4 sell (delete)",
  "email": "t4-test-sell@example.com",
  "phone": "555-0104",
  "service": "sell",
  "message": "Aircraft for sale\nMake: Beechcraft\nModel: Premier 1A\nYear: 2006\nTotal time: 4,200 hours\nLocation: Fort Lauderdale, FL. T4 test 2026-09-20 15:42, please delete.",
  "blogPostSlug": "why-we-publish-market-notes",
  "pageUrl": "http://127.0.0.1:5173/sell?utm_source=t4-test&utm_medium=manual&utm_campaign=wo-4-4&utm_term=evidence&utm_content=form&note=why-we-publish-market-notes",
  "utm_source": "t4-test",
  "utm_medium": "manual",
  "utm_campaign": "wo-4-4",
  "utm_term": "evidence",
  "utm_content": "form"
}

HTTP 200
{"success":true,"message":"Lead created successfully","leadId":"cmu9zijpz0001l504ntlmadaf"}
```

UI after submit: `Thanks. Your details are in. We'll follow up shortly.`

### consulting

```
POST https://www.pennforce.pennjets.com/api/webhooks/incoming/<webhookId>

{
  "name": "T4 TEST WO-4.4 consulting (delete)",
  "email": "t4-test-consulting@example.com",
  "phone": "555-0105",
  "service": "consulting",
  "message": "Consulting enquiry\nCost of ownership on a light jet. T4 test 2026-09-20 15:42, please delete.",
  "blogPostSlug": "why-we-publish-market-notes",
  "pageUrl": "http://127.0.0.1:5173/consulting?utm_source=t4-test&utm_medium=manual&utm_campaign=wo-4-4&utm_term=evidence&utm_content=form&note=why-we-publish-market-notes",
  "utm_source": "t4-test",
  "utm_medium": "manual",
  "utm_campaign": "wo-4-4",
  "utm_term": "evidence",
  "utm_content": "form"
}

HTTP 200
{"success":true,"message":"Lead created successfully","leadId":"cmu9zimgh0009l5048ou057ls"}
```

UI after submit: `Thanks. Your request is in. We'll follow up shortly.`

### The exact `service` string each form posts

| Page | `service` | Status |
|---|---|---|
| `/charter` | `charter` | already live, unchanged |
| `/buy` | `buy` | already live, unchanged |
| `/sell` | `sell` | new |
| `/consulting` | `consulting` | new |

Lowercase, no spaces. `/pennshare` also posts `buy`.

## Data evidence

CRM production runtime logs, confirming both leads were created server side
on the deploy named in `tested_against`:

```
15:42:11 POST /api/webhooks/incoming/cmi7ljjn5… 200 [info/serverless]
dep=dpl_FsRLBXmS8bFju1c5tEwGi18Kxapp branch=main
  {"event":"webhook_lead_created","leadId":"cmu9zimgh0009l5048ou057ls",
   "email":"t4-test-consulting@example.com","assignedTo":"Admin User",
   "msg":"New lead created from webhook"}

15:42:07 POST /api/webhooks/incoming/cmi7ljjn5… 200 [info/serverless]
dep=dpl_FsRLBXmS8bFju1c5tEwGi18Kxapp branch=main
  {"event":"webhook_lead_created","leadId":"cmu9zijpz0001l504ntlmadaf",
   "email":"t4-test-sell@example.com","assignedTo":"Admin User",
   "msg":"New lead created from webhook"}
```

The lead rows themselves are not read back here. See Known gaps.

### Test leads — do not merge before these are dealt with, Joseph deletes them

| Form | leadId | Name on the lead |
|---|---|---|
| sell | `cmu9zijpz0001l504ntlmadaf` | T4 TEST WO-4.4 sell (delete) |
| consulting | `cmu9zimgh0009l5048ou057ls` | T4 TEST WO-4.4 consulting (delete) |

Five further test leads were created earlier today verifying the post-merge
deploy, listed here so they are not missed: `cmu9yo83z000rk404m1338at8`
(charter), `cmu9yoc8v000zk404hazlts4n` (pennshare),
`cmu9yodoy0017k404drhygj20` (buy), `cmu9yqyi60003ji04sn8kpj9n` (Market Note
form), `cmu9yr2qw000bji0405lh4th4` (contact page).

## UI evidence

Both forms rendered with real submissions at 390x844 and 1440x900.
Screenshots: `sell-390.png`, `sell-1440.png`, `consulting-390.png`,
`consulting-1440.png` in T4's scratchpad.

Measured, both pages, both widths: `innerWidth` equals
`document.documentElement.scrollWidth`, so no horizontal overflow.

Rendered `<head>`, from the built static files:

```
dist/sell.html        <title>Sell Your Aircraft | PennJets</title>
dist/consulting.html  <title>Aviation Consulting | PennJets</title>
```

Both carry a canonical, Open Graph and Twitter tags, and both appear in
`sitemap.xml`, which went from 22 URLs to 24.

### Layout fix included

`pt-32` is 128px. The fixed banner plus header is 140px at 1440, so the `h1`
on `/sell`, `/consulting` and `/buy` sat 12px underneath it. `/buy` shipped
that way in the previous release. `pt-36 sm:pt-40` now gives a 20px gap at
both widths on all three.

| Page | gap at 1440 | gap at 390 |
|---|---|---|
| /sell | 20px | 20px |
| /consulting | 20px | 20px |
| /buy | 20px | 20px |

## Build

```
> vite build && node scripts/postbuild.mjs
✓ 81 modules transformed.
✓ built in 5.15s
[postbuild] wrote 25 HTML files (9 Market Notes) and sitemap.xml with 24 URLs
```

Exit code 0. No TypeScript in this project; ESLint passes with
`--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give. There
is no `scripts/test-all.sh` here. Evidence is the route and data evidence
above.

## Scope

Touched, all within `PennJets-Development-2.0`:

```
src/components/pages/Sell/Sell.jsx              new
src/components/pages/Consulting/Consulting.jsx  new
src/components/pages/Buy/Buy.jsx                layout fix only
src/services/blogApi.js                         submitLead takes blogPostSlug
src/App.jsx                                     two routes
src/seo/siteMeta.js                             two route entries
src/components/layout/Footer/Footer.jsx         two links
docs/reports/t4/WO-4.4.md                       this report
```

Nothing in the PennForce repository was written. Its order files were read
only.

## Known gaps

1. **The site evidence is not from a production deploy.** The order asks for
   submissions against production. The forms do not exist on the deployed
   site until this branch is merged, and T4 does not merge. The submissions
   above ran against the **production CRM** from the local dev server at
   `813e1ad`, which is why the `pageUrl` field reads `127.0.0.1:5173`. The
   CRM half of `tested_against` is a real production deploy. Re-running the
   two submissions after merge would close this, and I will do that on
   request.

2. **The lead rows are not read back.** The order asks for the row showing
   `source`, `service`, `blogPostId` and the UTM columns. There is no public
   endpoint that returns a lead, and T4 has no database access to the CRM.
   The runtime logs above prove creation and give the `leadId`, but not the
   column values. The lead engineer can confirm those four columns directly.

3. **`blogPostSlug` has no caller yet.** Both pages read it from
   `?note=<slug>` and send it, verified above. Nothing on the site currently
   links from a Market Note to `/sell` or `/consulting`, so in normal use the
   field is absent today. Adding those links is not in this order.

4. **Form labels are not associated with their inputs on three older forms**,
   found while testing: the Market Note form, the contact page and PennShare.
   The two forms delivered here wrap their inputs in their labels and are
   correct. Not in this order's scope; reported to Joseph separately.
