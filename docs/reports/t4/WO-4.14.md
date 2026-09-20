---
wo: WO-4.14
terminal: T4
branch: t4/work
commit: 11b8a6e
tested_against: "site: local dev (vite 5173) at 11b8a6e, compared against production deploy 9ee9adc as the before — NOT yet a production deploy, see Known gaps"
date: 2026-09-20
status: reported
---

# WO-4.14 report — self-host the fonts

No request leaves this site for a font any more. The typeface, the weights and
the rendered metrics are unchanged.

## Commit

`11b8a6e` WO-4.14: serve the fonts from this site.
On `t4/work`, pushed. Not merged.

## Route evidence

### Every Google font reference is gone

```
$ grep -rn 'fonts.googleapis\|fonts.gstatic' src public index.html
(no matches, exit 1)
```

Three references existed and all three are removed:

| What | Where | Now |
|---|---|---|
| `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap')` | `src/index.css` line 1 | `@import './fonts.css';` |
| `<link rel="preconnect" href="https://fonts.googleapis.com">` | `index.html` | removed |
| `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` | `index.html` | removed |

### Request origins for one page load, before and after

`/charter`, same width, same browser:

| | Origins contacted |
|---|---|
| **Before** (production `9ee9adc`) | `https://www.pennjets.com`, `https://fonts.googleapis.com`, `https://fonts.gstatic.com` |
| **After** (this branch) | `http://127.0.0.1:5173` only |

Three origins become one. No third-party font origin remains.

| | Font file served |
|---|---|
| Before | `fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1Z...` — 48,256 bytes |
| After | `/fonts/inter-latin-normal.woff2` — 48,256 bytes |

The same bytes, from our own origin.

### Weights and styles kept

Google serves Inter as a **variable** font: one file covers the entire 100–900
weight range, which is why four files replace what the old import described as
six weights.

| File | Subset | Style | Size | When it loads |
|---|---|---|---|---|
| `inter-latin-normal.woff2` | latin | normal | 47.1 KB | every page |
| `inter-latin-ext-normal.woff2` | latin-ext | normal | 83.1 KB | only if an accented character appears |
| `inter-latin-italic.woff2` | latin | italic | 24.5 KB | only if italic text appears |
| `inter-latin-ext-italic.woff2` | latin-ext | italic | 36.7 KB | only if both |

191.4 KB in the repository; **47.1 KB on a typical English page**, because each
face carries the same `unicode-range` Google uses, so the browser skips the
files it does not need. That is one file where the old setup also fetched one,
plus a stylesheet request to Google that is now gone.

**Kept:** the whole 100–900 range from the variable files, which covers the
three weights the site actually uses and the body default:

```
font-medium   (500)  107 uses
font-semibold (600)   85 uses
font-bold     (700)   68 uses
font-normal   (400)   the body default
```

**Dropped:** nothing that renders. The old import asked for `300` and `800`,
and `grep` finds no `font-light`, `font-extralight`, `font-thin`,
`font-extrabold` or `font-black` anywhere in the codebase.

**Italic kept**, because the Market Note body renders `<em>` and the typography
applies `italic` to it. Without an italic face the browser would synthesise a
slanted regular, which is not the same shape.

### No visible change

Same page, same width, computed from the live DOM:

| | Family | Weight | Size | h1 width | h1 height |
|---|---|---|---|---|---|
| Before | Inter | 600 | 48px | 672px | 48px |
| After | Inter | 600 | 48px | 672px | 48px |

Identical to the pixel, so no layout shift. Screenshots `before-charter-1280.png`
and `after-charter-1280.png` in T4's scratchpad under `shots/wo414/`.

`font-display: swap` is set on all four faces, so text renders in the fallback
immediately and is never invisible while a font loads.

## Data evidence

n/a. No data was written by this order.

## UI evidence

The before/after table above, read from `getComputedStyle` and
`getBoundingClientRect` on the live DOM, plus the two screenshots.

## Build

```
> vite build && node scripts/postbuild.mjs
✓ built in 4.74s
```

Exit code 0. ESLint passes with `--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give.

## Scope

```
public/fonts/inter-latin-normal.woff2          new
public/fonts/inter-latin-ext-normal.woff2      new
public/fonts/inter-latin-italic.woff2          new
public/fonts/inter-latin-ext-italic.woff2      new
src/fonts.css                                  new, four @font-face rules
src/index.css                                  the @import now points locally
index.html                                     two preconnects removed
src/content/cookiePolicy.js                    the third-party paragraph updated
docs/drafts/t4/for-joseph-WO-4.10.md           item 3 and item 5 marked resolved
docs/drafts/t4/cookie-policy.md                regenerated
docs/reports/t4/WO-4.14.md                     this report
```

All within `PennJets-Development-2.0`. Nothing in the PennForce repository was
written.

**Licensing:** Inter is published under the SIL Open Font License, which
permits self-hosting and redistribution. The typeface is unchanged, so this is
the same font under the same licence, served from a different place.

## Known gaps

1. **Not verified on a production deploy.** The before figures come from
   production `9ee9adc`; the after figures come from the local dev server at
   `11b8a6e`. The change does not reach the deployed site until this branch is
   merged, and T4 does not merge.

2. **The cookie policy changed in this commit, which is outside this order's
   letter.** WO-4.12's report flagged that paragraph as having a known expiry:
   it described the Google request, and this order made that false. Joseph's
   standing rule is that policy follows reality in the same order as the change,
   so it is updated here rather than left wrong until someone notices. The
   regenerated draft is in `docs/drafts/t4/cookie-policy.md`.

3. **Only `/charter` was compared before and after.** Every page uses the same
   stylesheet and the same family, so I expect no difference elsewhere, but I
   measured one page and will not claim I measured all of them.

4. **No other third-party request exists to report**, which the order asked me
   to check. After this change the only cross-origin request on the site is to
   `pennforce.pennjets.com`, our own CRM. That matches the WO-4.12 inventory,
   which found no analytics origin, ad network, tag manager or embed.
