---
wo: WO-4.12
terminal: T4
branch: t4/work
commit: bb96840
tested_against: "site: measurement against production deploy 9ee9adc; page rendered on local dev (vite 5173) at bb96840 — NOT yet a production deploy, see Known gaps. Browser profile: a fresh Playwright Chrome context, no cookies, storage or cache carried in."
date: 2026-09-20
status: reported
---

# WO-4.12 report — cookie policy corrected to match measured reality

The page claimed this site sets analytics cookies, advertising and targeting
cookies, Google Analytics, and third-party cookies from advertising networks,
and it pointed readers at `optout.networkadvertising.org`. The site sets no
cookies at all. Every one of those claims was false.

## Commit

`bb96840` WO-4.12: cookie policy rewritten from a measurement.
On `t4/work`, pushed. Not merged.

## Data evidence — the measured inventory

Method: a fresh browser context, so nothing was carried in. Walked the pages a
reader walks, arriving at the Market Note from a social link with UTM
parameters, as a real reader does:

```
/                                          home
/blog                                      Market Notes index
/blog/why-we-publish-market-notes?utm_...  a Market Note, arrived from social
/charter  /buy  /contact
/privacy-policy  /cookie-policy
```

Storage after each page:

| Page | `document.cookie` | Cookie jar, all origins | localStorage | sessionStorage |
|---|---|---|---|---|
| home | empty | 0 | empty | empty |
| Market Notes index | empty | 0 | empty | empty |
| a Market Note | empty | 0 | empty | `pj_view_session` |
| charter | empty | 0 | empty | `pj_view_session` |
| buy | empty | 0 | empty | `pj_view_session` |
| contact | empty | 0 | empty | `pj_view_session` |
| privacy policy | empty | 0 | empty | `pj_view_session` |
| cookie policy | empty | 0 | empty | `pj_view_session` |

**The cookie jar was empty at the end of the walk. No cookie was set by any
origin.**

The complete inventory of what is stored:

| What | Type | Set by | Purpose | Lifetime |
|---|---|---|---|---|
| nothing | Cookie | nothing | there are none | n/a |
| `pj_view_session` | Session storage | pennjets.com, on opening a Market Note | a generated UUID so a repeated view report updates one record instead of counting two | cleared when the tab closes |

Value observed: `eabb12e3-57f6-4f99-bc48-2fd8773493b9`, 36 characters.

### The question the order asked directly

> check and state whether the site also persists it in `localStorage`,
> `sessionStorage` or a cookie, because that is the difference between "we
> count a visit" and "we store an identifier on your device"

**It is persisted, in `sessionStorage`.** It is set when a Market Note is
opened and it survives navigation to other pages in the same tab, as the table
above shows. It is not a cookie and it does not survive closing the tab.

The page says this plainly rather than minimising it: "It is an identifier on
your device for as long as the tab is open, and we would rather say that
plainly than describe it as nothing."

### Request origins across the walk

| Requests | Origin | Types |
|---|---|---|
| 58 | `https://www.pennjets.com` | document, script, stylesheet, image, media |
| 8 | `https://fonts.googleapis.com` | stylesheet |
| 8 | `https://fonts.gstatic.com` | font |
| 5 | `https://www.pennforce.pennjets.com` | fetch |

No analytics origin, no ad network, no tag manager, no embed. The only third
party is Google Fonts, and **it sets no cookie** — the jar was empty with it
loading on every page.

**Reported rather than documented, per the order:** Google Fonts is a
third-party request carrying the reader's IP. WO-4.14 removes it. The page
currently has one paragraph saying the request happens and that we are moving
the fonts onto this site; when WO-4.14 lands I will update that paragraph in
the same branch so the page is never wrong.

## Route evidence

`/cookie-policy`, rendered at 1440x900 and 390x844:

```
h1          Cookie Policy
subtitle    Penn Jets LLC. Last updated 20 September 2026.
sections    This site sets no cookies.
            What is actually stored
            The one thing we do store
            Requests your browser makes to other companies
            Two things that sound like tracking and are not
            What you can do about it
table       2 rows (the inventory above)
innerWidth  1440 / 390, scrollWidth 1440 / 390, no overflow
```

Assertions checked in the rendered DOM:

| Check | Result |
|---|---|
| mentions Google Analytics | **false** |
| says the site sets no cookies | **true** |

Footer link read from a second page, `/charter`, showing it is reachable
site-wide: `href="/cookie-policy"`.

## UI evidence

Screenshots `cookie-1440.png` and `cookie-390.png` in T4's scratchpad under
`shots/wo412/`.

## Build

```
> vite build && node scripts/postbuild.mjs
✓ built in 12.16s
```

Exit code 0. ESLint passes with `--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give.

## Scope

Touched, all within `PennJets-Development-2.0`:

```
src/content/cookiePolicy.js                      new, the copy and the inventory
src/components/pages/Legal/CookiePolicy.jsx      rewritten, renders the copy
scripts/legal-drafts.mjs                         renamed from privacy-draft.mjs,
                                                 now generates both drafts
docs/drafts/t4/cookie-policy.md                  generated draft for approval
docs/drafts/t4/for-joseph-WO-4.12.md             approval item
docs/reports/t4/WO-4.10.md                       two stale references to the old
                                                 script name corrected
docs/reports/t4/WO-4.12.md                       this report
```

Nothing in the PennForce repository was written.

## Known gaps

1. **Joseph's approval is not recorded, and I could not queue it where the
   order says.** `docs/orders/joseph.md` is in the PennForce repo and both
   `CLAUDE.md` and the T4 standing instruction forbid writing there. Queued at
   `docs/drafts/t4/for-joseph-WO-4.12.md` for relaying. Per the standing
   instruction the rest of the order continued.

2. **The rendered page was verified locally**, at `bb96840`. The *measurement*
   behind the copy was taken against the production deploy `9ee9adc`, which is
   what a reader gets today. The page itself does not exist on production until
   this branch is merged.

3. **The two legal pages do not contradict each other**, which the order asked
   me to confirm. Both say the site sets no cookies, both describe
   `pj_view_session` as a tab-scoped identifier, both say there are no
   third-party analytics and no advertising. The privacy policy covers what
   happens to information you send; the cookie policy covers what is stored on
   your device, and links across.

4. **One paragraph has a known expiry.** The Google Fonts paragraph is true
   today and becomes false when WO-4.14 lands. It is next but one in my queue
   and I will update the paragraph as part of it. If WO-4.14 were abandoned,
   that paragraph would need to stay.

5. **The measurement covers eight pages, not every route.** It does not include
   `/pennshare`, `/sell`, `/consulting`, `/aircraft`, `/about`, `/services`,
   `/gallery` or the remaining legal pages. Those share the same layout, the
   same font loading and the same CRM calls, so I expect no difference, but I
   did not measure them and will not claim I did.
