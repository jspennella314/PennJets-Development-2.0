---
wo: WO-4.10
terminal: T4
branch: t4/work
commit: 39cac62
tested_against: "site: local dev (vite 5173) at 39cac62 — NOT yet a production deploy, see Known gaps. Facts in the copy verified against production site deploy 9ee9adc and CRM production dpl_FsRLBXmS8bFju1c5tEwGi18Kxapp (5b95295) on 2026-09-20."
date: 2026-09-20
status: reported
---

# WO-4.10 report — privacy policy page

The page that was live made false statements about data handling. It claimed a
payment processor, cookie identifiers, advertising and analytics partners, and
sharing with advertising or analytics partners. None of those exist on this
site. It has been replaced with a page written from the lead's verified list
and from what this site was measured doing.

## Commit

`39cac62` WO-4.10: privacy policy written from what the site actually does.
On `t4/work`, pushed. Not merged.

## Route evidence

`/privacy-policy`, rendered at 1440x900 and 390x844.

```
h1              Privacy Policy
subtitle        Penn Jets LLC. Last updated 20 September 2026.
sections        The short version
                When you read a Market Note
                When you send us a form
                When you subscribe to the newsletter
                Keeping the site working
                Cookies and browser storage
                Who else sees it
                How long we keep it
                Asking for a copy, or asking us to delete it
                Contact
beacon table    7 rows
words           959 at 1440, 946 at 390
placeholders    0
innerWidth      1440 / 390, scrollWidth 1440 / 390, no overflow
```

Footer link checked from a second page, `/charter`, showing it is site-wide:

```
{"text":"Privacy Policy","href":"/privacy-policy"}
```

Present in the Legal column of the global footer, which renders on every page.

## Data evidence

The claims on the page are measured, not assumed. Production, 2026-09-20,
loading one Market Note:

```
hosts contacted:
    7  www.pennjets.com
    3  www.pennforce.pennjets.com
    1  fonts.googleapis.com
    1  fonts.gstatic.com

document.cookie:      ""
localStorage keys:    []
sessionStorage keys:  ["pj_view_session"]
```

So the page's two strongest claims hold: the site sets no cookies, and the only
browser storage is one anonymous session id. The Google Fonts requests are a
real third party and are **not** claimed either way on the page; they are
queued as a decision, see below.

Everything about what the CRM stores comes from the lead's verification in the
order file and is reproduced without addition. The page makes no claim about
retention periods, deletion automation, or any processor beyond the five named.

## UI evidence

Rendered with real content at both widths. Screenshots `privacy-1440.png` and
`privacy-390.png` in T4's scratchpad.

## Build

```
> vite build && node scripts/postbuild.mjs
✓ built in 6.97s
```

Exit code 0. ESLint passes with `--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give. There is
no `scripts/test-all.sh` here.

## Scope

Touched, all within `PennJets-Development-2.0`:

```
src/content/privacyPolicy.js                       new, the copy
src/components/pages/Legal/PrivacyPolicy.jsx       rewritten, renders the copy
scripts/privacy-draft.mjs                          new, generates the draft
docs/drafts/t4/privacy-policy.md                   generated draft for approval
docs/drafts/t4/for-joseph-WO-4.10.md               items needing Joseph
docs/reports/t4/WO-4.10.md                         this report
```

Nothing in the PennForce repository was written. Its order files were read only.

The copy lives in a content module and the draft is generated from it by
`node scripts/privacy-draft.mjs`, so the wording Joseph approves and the wording
the page renders cannot drift apart.

## Known gaps

1. **Joseph's approval is not recorded, and I could not queue it where the
   order says.** The order says to queue the draft to `docs/orders/joseph.md`.
   That file is in the PennForce repo, and both `CLAUDE.md` and the T4 standing
   instruction forbid this terminal from writing there. The five items are
   written ready to paste at `docs/drafts/t4/for-joseph-WO-4.10.md` and need
   relaying by the lead or by Joseph. Per the standing instruction, the rest of
   the order continued rather than waiting.

2. **The page is safe to ship unapproved, deliberately.** Joseph was away when
   this was built and asked not to be waited on. Rather than leave placeholder
   text in a page that might get merged, every sentence is either already true
   or already published, so nothing on it is blocked on him. Approving changes
   the wording, not the accuracy. The one address it uses,
   `privacy@pennjets.com`, was already published on the previous version of
   this page.

3. **Site evidence is not from a production deploy**, for the same reason as
   WO-4.4: the page does not exist on the deployed site until this branch is
   merged, and T4 does not merge. The facts the copy asserts were verified
   against production; the rendering was verified locally at `39cac62`.

4. **Google Fonts is a third party the policy does not mention.** Measured
   above: every page load contacts `fonts.googleapis.com` and
   `fonts.gstatic.com`, so Google receives the reader's IP address. That is not
   on the lead's verified processor list, and the order says to ask rather than
   infer, so the page says nothing about it. Two options are put to Joseph:
   self-host the fonts so the request never leaves our domain, which I would
   recommend, or name Google in the policy. Either needs an order.

5. **`/cookie-policy` now contradicts this page, and is not fixed.** It is live
   and claims analytics cookies, Google Analytics, advertising and targeting
   cookies, and third-party advertising networks. The site sets no cookies at
   all. Both pages are linked from the same footer, so once this ships the two
   disagree in public. I did not touch it: a work order exists only as a file
   and there is not one for the cookie policy. It needs either a rewrite order
   or a removal order. Detail in the Joseph file.
