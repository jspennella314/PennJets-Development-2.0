---
wo: WO-4.20
terminal: T4
branch: t4/work
commit: 277eb7c
tested_against: "site: local dev (vite 5173) and the built output, at 277eb7c — NOT yet a production deploy, see Known gaps"
date: 2026-09-20
status: reported
---

# WO-4.20 report — every published address becomes `joe@pennjets.com`

All four dead mailboxes are gone from the site. Thirteen replacements across
eight files, covering displayed text, every `mailto:` href, the structured-data
`email`, and the Market Note byline fallback.

## Commit

`277eb7c` WO-4.20: every published address becomes joe@pennjets.com.
On `t4/work`, pushed. Not merged.

## Route evidence

### Every remaining `@pennjets.com` address, explained line by line

```
$ grep -rnoE '[a-zA-Z0-9._-]+@pennjets\.com' src public index.html
```

| Address | File:line | What it is |
|---|---|---|
| `joe@pennjets.com` | `Footer/Footer.jsx:160` | the footer, every page |
| `joe@pennjets.com` | `AircraftDetail.jsx:203` | the contact tile |
| `joe@pennjets.com` | `Contact.jsx:129` | the contact block |
| `joe@pennjets.com` | `Contact.jsx:264` | the form's error message |
| `joe@pennjets.com` | `Home.jsx:140` | the JSON-LD `email` |
| `joe@pennjets.com` | `Home.jsx:239, 240` | the inline footer, `mailto:` and its text |
| `joe@pennjets.com` | `Legal/Compliance.jsx:191` ×2 | `mailto:` and its text |
| `joe@pennjets.com` | `Legal/TermsOfService.jsx:105` ×2 | `mailto:` and its text |
| `joe@pennjets.com` | `content/privacyPolicy.js:21, 25` | the note and the `PRIVACY_EMAIL` constant |
| `joe@pennjets.com` | `blogApi.js:82` | Joseph's webhook routing, already correct |
| `joe@pennjets.com` | `blogApi.js:246` | Joseph's author entry, already correct |
| `joe@pennjets.com` | `blogApi.js:295` | the author fallback |
| `info@pennjets.com` | `Footer.jsx:158` | **inside a comment** explaining the change |
| `info@pennjets.com` | `Home.jsx:138` | **inside a comment** |
| `info@pennjets.com` | `blogApi.js:294` | **inside a comment** |
| `charles@pennjets.com` | `About.jsx:27`, `blogApi.js:252` | **WO-4.24**, not this order |
| `joedelisio@pennjets.com` | `About.jsx:37`, `blogApi.js:258` | **WO-4.24**, not this order |

The three `info@` hits are the explanatory comments the order asked for. They
are source comments, not published addresses. Proof that none of them ships:

| Address | Occurrences in `dist/` |
|---|---|
| `info@pennjets.com` | **0** |
| `compliance@pennjets.com` | **0** |
| `privacy@pennjets.com` | **0** |
| `inquiries@pennjets.com` | **0** |
| `joe@pennjets.com` | 16 |

### Rendered, read from the live DOM

| Page | `joe@` on page | Dead addresses | `mailto:` | JSON-LD `email` | Footer |
|---|---|---|---|---|---|
| `/privacy-policy` | 3 | **0** | none on page | n/a | `joe@pennjets.com` |
| `/compliance` | 2 | **0** | `mailto:joe@pennjets.com` | n/a | `joe@pennjets.com` |
| `/terms-of-service` | 2 | **0** | `mailto:joe@pennjets.com` | n/a | `joe@pennjets.com` |
| `/` | 2 | **0** | `mailto:joe@pennjets.com` | `joe@pennjets.com` | `joe@pennjets.com` |

The privacy page shows it in both places the order named: the "Asking for a
copy, or asking us to delete it" section and the contact block. Only one
distinct `mailto:` exists anywhere, and it is the new address, so the label and
the link agree.

### The code comment

Placed where someone will actually ask the question. The full note sits on the
`PRIVACY_EMAIL` constant:

```js
// Until real aliases exist, every published address on this site is
// joe@pennjets.com. privacy@, compliance@, info@ and inquiries@ were all dead
// mailboxes: mail to them vanished with no bounce and no record. Joseph
// confirmed all four, 2026-09-20 (WO-4.20). When the aliases are created,
// this is one of the places to split back out.
export const PRIVACY_EMAIL = 'joe@pennjets.com';
```

Shorter notes sit at the three other places where the substitution is least
obvious: the footer, the JSON-LD `email`, and the author fallback.

**A deliberate choice worth stating:** I did **not** consolidate these into one
shared constant, though that is the tidier-looking option. The order says the
four addresses split back out into real aliases later, and they will split to
*different* values. Keeping them as separate literals with a note at each site
preserves the distinction a future split needs; a single constant would erase
it and make that work harder.

### The regenerated draft

`docs/drafts/t4/privacy-policy.md` regenerated from the content module, so the
approved wording stays in step with the page. The address appears twice in it,
both now `joe@pennjets.com`.

## Data evidence

n/a. No data was written by this order.

## Build

```
> vite build && node scripts/postbuild.mjs
✓ built in 9.89s
```

Exit code 0. ESLint passes with `--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give.

## Scope

```
src/components/layout/Footer/Footer.jsx            info@ -> joe@, + comment
src/components/pages/AircraftDetail/AircraftDetail.jsx  info@ -> joe@
src/components/pages/Contact/Contact.jsx           info@ -> joe@, ×2
src/components/pages/Home/Home.jsx                 info@ (JSON-LD) and inquiries@ ×2 -> joe@
src/components/pages/Legal/Compliance.jsx          compliance@ -> joe@, ×2
src/components/pages/Legal/TermsOfService.jsx      info@ -> joe@, ×2
src/services/blogApi.js                            author fallback, + comment
src/content/privacyPolicy.js                       PRIVACY_EMAIL, + the full note
docs/drafts/t4/privacy-policy.md                   regenerated
docs/drafts/t4/cookie-policy.md                    regenerated, unchanged content
docs/reports/t4/WO-4.20.md                         this report
```

All within `PennJets-Development-2.0`. Nothing in the PennForce repository was
written. The personal addresses were left untouched, per the order.

## Known gaps

1. **Not verified on a production deploy.** The change does not reach the
   deployed site until this branch is merged, and T4 does not merge.

2. **The order's count was right and my request's was wrong.** My order request
   said `info@` appeared twice; it appears eight times. The lead's grep caught
   it. My original count came from grepping only `src/components/pages/Legal/`
   and `src/content/`, because the instruction at the time said "the legal
   pages". Worth recording as the reason: I scoped the grep to the question
   asked rather than to the codebase, and a narrower grep is how the second
   and third occurrences of anything survive.

3. **No mailbox is wired.** The order puts that out of scope, and it is not a
   site change. The site now publishes an address Joseph reads; whether
   `joe@pennjets.com` should later become a routed alias is the split this
   order's comment anticipates.
