---
wo: WO-4.50
terminal: T4
branch: t4/work
commit: d4a2be3
tested_against: "local checkout of t4/work at d4a2be3 (after WO-4.49's 32848d3, on top of origin/main a2bcc10), Node 22.19.0: npm run lint, npm run build (exit 0, read the production CRM; no cache change), vite preview on localhost:4174 driven by the repo's Playwright Chromium 153 at 390x844 (mobile, touch) with the WO-4.47 wiring: every CRM read answered from the committed caches, the lead webhook answered by a stub that recorded each request body, a catch-all for the CRM host registered first; no request reached the CRM. axe-core 4.14.0 (the copy Lighthouse 13.5 ships) for the label rule. No deployed preview exists for this site; nothing here is deployed."
model: claude-opus-5-5
date: 2026-10-20
status: reported
---

# WO-4.50 report: forms that say why, PennShare's `service`, and Joseph's copy lines

**Needs Joseph: the copy table in section 4.** He approves or amends the
charter sentence and the seven "be in touch" lines there; the PR waits
for that. Everything else in this order is done and decided.

Buy, Sell and Consulting no longer grey out Send: tapped empty, the
browser puts its message at the empty field, which lands below the
header. The consent box, the two Ownership radios, the "Add …"
toggles and the "Prefer to talk?" links are 44 px targets. The note
form's labels point at their fields. PennShare leads arrive with
`service: "fractional"`; the other six forms send exactly what they
sent before.

## Commit

`d4a2be3` on `t4/work`, pushed, after WO-4.49 (`32848d3`). No cache
change from this build.

```
$ git show --stat --format= d4a2be3
 src/components/common/MoreFields/MoreFields.jsx |  2 +-
 src/components/pages/Blog/BlogArticle.jsx       | 16 ++++++----
 src/components/pages/Buy/Buy.jsx                | 21 +++++++------
 src/components/pages/Charter/Charter.jsx        | 13 +++++++--
 src/components/pages/Consulting/Consulting.jsx  | 14 +++++----
 src/components/pages/Contact/Contact.jsx        |  2 +-
 src/components/pages/Legal/TermsOfService.jsx   |  2 +-
 src/components/pages/PennShare/PennShare.jsx    | 18 +++++------
 src/components/pages/Sell/Sell.jsx              | 13 +++++----
 9 files changed, 60 insertions(+), 41 deletions(-)
```

## 1. The three dead Sends

`disabled={!canSubmit}` became `disabled={isSubmitting}` in `Buy.jsx`,
`Sell.jsx` and `Consulting.jsx`; `canSubmit` and the `useMemo` import
went (nothing else read them). Name and email carry `required` on all
three, and Consulting's "need" textarea does too, which was the third
condition of its old gate, so nothing the gate enforced is lost.

Send tapped with the form empty, Send scrolled into view first as a
reader would have it:

| Form | Send before the tap | Focused field | Its message | Field top–bottom | Header bottom | Clear |
|---|---|---|---|---|---|---|
| `/buy` | enabled, opacity 1 (was disabled, 0.4) | name | "Please fill out this field." | 349–391 | 64 | yes |
| `/sell` | enabled, opacity 1 | name | "Please fill out this field." | 349–391 | 64 | yes |
| `/consulting` | enabled, opacity 1 | name | "Please fill out this field." | 306–348 | 64 | yes |

Captures: `docs/audit/mobile-390/wo-4.50/buy-form-invalid.png`,
`sell-form-invalid.png`, `consulting-form-invalid.png`, each showing the
focused name field below the header. The browser's message bubble is
native UI that a page screenshot does not include; the message is
quoted from the field's `validationMessage`.

**Not in this order, flagged:** Charter's step-2 "Send Request"
(`Charter.jsx:363`) still has `disabled={!canSubmit}`, the same pattern.
At 390 the reader reaches it through Continue, which validates step 1,
but an empty name, email or phone on step 2 still gives a grey button
with no message. One line, the same fix, if the lead wants it.

## 2. Targets and labels

Measured with `getBoundingClientRect` at 390:

| Target | Row | Control | Notes |
|---|---|---|---|
| PennShare consent | 294 x **60** | box 20 x 20 | the `<label>` is the row; tapping the text checks the box (verified) |
| Buy, Ownership "Sole" | 61 x **44** | radio 20 x 20 | tapping the word selects it (verified on "Fractional") |
| Buy, Ownership "Fractional" | 97 x **44** | radio 20 x 20 | |

Captures: `pennshare-consent.png`, `buy-ownership.png`.

The disclosure toggles (one change, in `MoreFields.jsx`, so every form
gets it) and the "Prefer to talk?" links:

| Route | Control | Size |
|---|---|---|
| `/buy` | "Add phone, passengers and trip length" | 274 x **44** |
| `/buy` | "Prefer to talk? Contact us" | 169 x **44** |
| `/sell` | "Add phone, total time and location" | 242 x **44** |
| `/sell` | "Prefer to talk? Contact us" | 169 x **44** |
| `/consulting` | "Prefer to talk? Contact us" | 169 x **44** |
| `/charter` | "Prefer to talk? Contact us" | 169 x **44** |
| `/contact` | "Add phone and company" | 181 x **44** |
| `/pennshare` | "Add phone and share size" | 187 x **44** |

Consulting and Charter have no disclosure toggle at 390; Contact and
PennShare have no "Prefer to talk?" link. Text unchanged everywhere.

The note's Talk to a Broker form (`BlogArticle.jsx`), read from the
page:

| Label | `htmlFor` | Field `id` | Field |
|---|---|---|---|
| Name * | `note-name` | `note-name` | input[text] |
| Email * | `note-email` | `note-email` | input[email] |
| Phone | `note-phone` | `note-phone` | input[tel] |
| Message * | `note-message` | `note-message` | textarea |

Tapping "Email *" focused `note-email`. **The label audit:**
Lighthouse's `label` audit is axe-core's `label` rule. Lighthouse itself
could not be pointed at the note without the article fetch reaching the
production CRM, which writes a ContentAnalytics row per fetch. So the
rule was run directly in the stubbed page, using the axe-core build
Lighthouse 13.5 ships, on `/blog/the-light-jet-market-in-2026-…`:

```
axe-core 4.14.0, runOnly: ['label']
violations: []
passes: label (5 nodes)
incomplete: 0
```

## 3. PennShare's `service`

`PennShare.jsx:42` `service: 'buy'` became `service: 'fractional'`. The
message prefix is unchanged. Every lead form was filled with stub
values and sent; the stub recorded each body, and **nothing reached the
CRM** (the catch-all for the CRM host saw zero requests; the webhook
answered from the stub):

| Form | `service` | Message starts | Keys |
|---|---|---|---|
| **PennShare** | **`fractional`** (was `buy`) | "PennShare inquiry" | email, message, name, pageUrl, service |
| Buy | `buy` | "Aircraft purchase inquiry" | email, message, name, pageUrl, service |
| Sell | `sell` | "Aircraft for sale" | email, message, name, pageUrl, service |
| Consulting | `consulting` | "Consulting enquiry" | email, message, name, pageUrl, phone, service |
| Charter | `charter` | "Charter quote request" | email, message, name, pageUrl, phone, service |
| Contact | `sell` (from `SERVICE_MAP`; the stub picked "Selling my aircraft") | "Service interest: Selling my aircraft" | email, message, name, pageUrl, service |
| Market Note, Talk to a Broker | none, as before | the message | blogPostSlug, email, message, name, pageUrl, phone |

The PennShare body as recorded:

```json
{"name":"WO-4.50 STUB (never sent)","email":"wo450-stub@example.invalid","service":"fractional",
 "message":"PennShare inquiry\nInterest: not specified\nComments: WO-4.50 stub test, never sent",
 "pageUrl":"http://localhost:4174/pennshare"}
```

`blogApi.submitLead` passes `service` through unchanged. The CRM's
leads filter gets the label in T3's WO-3.53; the webhook stores any
string, so the two can ship in either order.

## 4. Joseph's copy lines: before and after

**For Joseph to approve or amend.** File and line at `d4a2be3`.

| Where | Before (`a2bcc10`) | After |
|---|---|---|
| `PennShare.jsx:277` | "Take the first step toward intelligent aircraft ownership. Penn Jets will contact you within 24 hours." | "Take the first step toward intelligent aircraft ownership." |
| `BlogArticle.jsx:317-318` | "Questions about this note, or about an aircraft? Send Joseph a message and you'll hear back within one business day." | "Questions about this note, or about an aircraft? Send Joseph a message." |
| `Buy.jsx:154` | "Thanks. Your inquiry is in. We'll follow up shortly." | "Thanks. Your inquiry is in. We'll be in touch." |
| `Charter.jsx:374` | "Thanks. Your request is in. We'll follow up shortly." | "Thanks. Your request is in. We'll be in touch." |
| `Consulting.jsx:94` | "Thanks. Your request is in. We'll follow up shortly." | "Thanks. Your request is in. We'll be in touch." |
| `Contact.jsx:261` | "Thank you. Your message is in. We'll be in touch shortly." | "Thank you. Your message is in. We'll be in touch." |
| `PennShare.jsx:378` | "Thanks. Your inquiry is in. We'll follow up shortly." | "Thanks. Your inquiry is in. We'll be in touch." |
| `Sell.jsx:118` | "Thanks. Your details are in. We'll follow up shortly." | "Thanks. Your details are in. We'll be in touch." |
| `BlogArticle.jsx:409` | "Thank you. Joseph Pennella will be in touch shortly." | "Thank you. Joseph Pennella will be in touch." |
| `TermsOfService.jsx:11` | "Penn Jets LLC - Effective Date: " + today's date from the reader's clock | "Penn Jets LLC - Effective Date: October 20, 2026" (a literal; `:93` unchanged) |
| `/charter` hero, `Charter.jsx:66` (new) | (the hero said nothing about where charter departs; New York and New Jersey appeared only in the routes heading and the `<title>`) | "Penn Jets arranges charter from New York and New Jersey airports, including Teterboro (TEB), Westchester (HPN) and Morristown (MMU)." |
| `/pennshare` status | "Current Share Offering: 2006 Beechcraft Premier 1A…", "View Available Shares" | **Unchanged.** Joseph says it is a live offering, so the page is right as written; the review's "invented availability" row is closed by his decision, not by an edit. |

I read "shortly" as a response-time word, as the order did, so all
seven success lines lost it. The note's line keeps its subject (the
author's name) rather than becoming "We'll be in touch", because the
form is addressed to him.

The charter sentence sits under "You have somewhere to be. We'll get
you there." in the hero, in the smaller second-line style the home hero
uses for its Part 135 line. At 390 it wraps to three lines and the hero
still holds both buttons (bottom at 411 of 422):
`docs/audit/mobile-390/wo-4.50/charter-hero.png`. Nothing on the
charter page mentions Florida; the Miami address and the (954) number
are untouched everywhere. The Terms page renders "Penn Jets LLC -
Effective Date: October 20, 2026": `terms-effective-date.png`.

**One more line for Joseph to rule on, not changed:** the dark band at
the foot of `/charter` reads "Call (954) 546-0763 or send your itinerary
for a fast quote." (`Charter.jsx:408`). "Fast" is a speed claim, though
not a time promise; the order allowed no other copy change, so it
stands until he says.

## Build

```
$ npm run lint             (exit 0, 0 warnings)
$ npm run build            (exit 0)
✓ built in 10.17s
[postbuild] article bodies: 16 from cache, 0 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
[postbuild] wrote 31 HTML files (16 Market Notes) and sitemap.xml with 30 URLs
[prerender] 31 of 31 routes rendered in 51.1s, 170,131 characters of body text added
```

Two builders: the lead's CRM `next build` was the other one when this
built.

## Tests

None of the nine files has a test, so there were no touched-file tests
to run. When this was ready the lead was running the CRM suite, so I
did not run the site's full suite alongside it (the two-builder rule).
The lead's build at the merge is the evidence. The behaviour is
evidenced in the preview above: the Sends, the targets, the labels, the
seven payloads.

## Scope

The nine files above; the captures under
`docs/audit/mobile-390/wo-4.50/`; this report. No chrome, menu or
redirect change (WO-4.49). No copy beyond section 4. Contact's
`SERVICE_MAP` untouched. The five untracked images under
`public/images/Gallery/` are still not mine.

## Known gaps

- Charter's step-2 Send is still gated (section 1, flagged).
- "for a fast quote" on `/charter` (section 4, for Joseph).
- The label audit is axe-core's rule run in the page, not a Lighthouse
  report, for the reason in section 2.
- All evidence is from `vite preview`; there is no deployed preview.
