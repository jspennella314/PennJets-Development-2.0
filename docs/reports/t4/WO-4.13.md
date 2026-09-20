---
wo: WO-4.13
terminal: T4
branch: t4/work
commit: PENDING
tested_against: "site: local dev (vite 5173) at PENDING — NOT yet a production deploy, see Known gaps"
date: 2026-09-20
status: reported
---

# WO-4.13 report — one phone number, sitewide

`(973) 868-8425` is gone from the repository. Every occurrence now reads
`(954) 546-0763`, in displayed copy, in `tel:` hrefs and in the home page's
structured data.

## Commit

`PENDING` WO-4.13: one phone number sitewide.
On `t4/work`, pushed. Not merged.

## Route evidence

### The old number is gone

```
$ grep -rn '868-8425' src public index.html
(no matches, exit 1)

$ grep -rn '868‑8425' src public index.html        # non-breaking hyphen variant
(no matches, exit 1)

$ grep -rn '19738688425\|973-868-8425' src public index.html
(no matches, exit 1)
```

Four distinct written forms existed and all four were replaced:

| Form found | Replaced with | Where it was used |
|---|---|---|
| `(973) 868-8425` | `(954) 546-0763` | displayed copy |
| `(973) 868‑8425` (U+2011 non-breaking hyphen) | `(954) 546‑0763` | charter hero, home footer, error messages |
| `+1-973-868-8425` | `+1-954-546-0763` | home page JSON-LD `telephone` |
| `tel:+19738688425` | `tel:+19545460763` | every `tel:` href |

The non-breaking-hyphen variant is the one a plain `grep '868-8425'` misses. It
was in six places.

### Every replacement

22 replacements across 13 files:

```
src/components/pages/About/About.jsx                    (1)
src/components/pages/AircraftDetail/AircraftDetail.jsx  (1)
src/components/pages/Blog/BlogArticle.jsx               (2)   display + tel:
src/components/pages/Buy/Buy.jsx                        (1)
src/components/pages/Charter/Charter.jsx                (4)   hero tel: + display + 2 error messages
src/components/pages/Consulting/Consulting.jsx          (1)
src/components/pages/Contact/Contact.jsx                (3)
src/components/pages/Home/Home.jsx                      (2)   footer line + JSON-LD telephone
src/components/pages/Legal/TermsOfService.jsx           (2)   display + tel:
src/components/pages/PennShare/PennShare.jsx            (2)
src/components/pages/Sell/Sell.jsx                      (1)
src/seo/siteMeta.js                                     (1)   the /contact meta description
src/components/pages/AircraftDetail/AircraftDetail.backup.jsx  (1)  — then deleted
```

`src/seo/siteMeta.js` is worth calling out: the `/contact` description carries
the number, and it is baked into the static HTML the post-build step writes, so
a stale number there would have reached search results.

### Rendered, read from the DOM

| Page | Old number on page | New number on page | `tel:` hrefs | JSON-LD `telephone` |
|---|---|---|---|---|
| home | 0 | 2 | `tel:+19545460763` | `+1-954-546-0763` |
| charter | 0 | 3 | `tel:+19545460763` | n/a |
| Market Note | 0 | 2 | `tel:+19545460763` | n/a |
| contact | 0 | 3 | `tel:+19545460763` | n/a |

Only one distinct `tel:` href exists anywhere on any of those pages, and it is
the new number. The label and the link agree, which the order names as the
failure to prevent.

### The home page structured data

```json
"contactPoint": {
  "@type": "ContactPoint",
  "telephone": "+1-954-546-0763",
  "contactType": "Sales",
  "areaServed": "US",
  "availableLanguage": "English"
}
```

Read back from the rendered DOM, not only from source.

### AircraftDetail.backup.jsx — deleted, not corrected

It contained the old number once. It is imported by nothing:

```
$ grep -rn "AircraftDetail.backup" src
(no matches)
```

It is a stale copy of a component that still exists and has since diverged. The
order says replacing a number in dead code is worse than deleting the file, and
I agree, so **I deleted it** rather than updating a number inside a file nobody
renders.

## Data evidence

n/a. No data was written by this order.

## UI evidence

Covered by the rendered table above, which reads the live DOM on four page
types rather than a screenshot of one.

## Build

```
> vite build && node scripts/postbuild.mjs
✓ built in 10.63s
```

Exit code 0. ESLint passes with `--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give.

## Scope

13 files edited, 1 deleted, all within `PennJets-Development-2.0`. Listed
above. Nothing in the PennForce repository was written.

Only the phone number was changed. No other copy on those pages was touched,
per the order's Out of scope.

## Known gaps

1. **Not verified on a production deploy.** The change does not reach the
   deployed site until this branch is merged, and T4 does not merge. Verified
   on the local dev server and in the built output.

2. **This resolves the question I raised in WO-4.11.** That report and
   `docs/drafts/t4/for-joseph-WO-4.11.md` asked Joseph which of the two numbers
   the sticky bar should dial. This order answers it: `(954) 546-0763` is the
   number he answers, and it is now the only number on the site. The sticky bar
   already used it. I have marked that queue item resolved rather than leaving
   Joseph a question that has been decided.

3. **The number is not wired into the CRM**, which the order puts out of scope
   and assigns elsewhere. Nothing here depends on it.

4. **`(954) 546-0763` also appears in places that already had it**, notably the
   footer, the legal pages, Joe Delisio's entry on About, and the privacy policy
   contact block. Those were already correct and were not touched; the grep
   above lists them so the total is not mistaken for 22 new insertions.
