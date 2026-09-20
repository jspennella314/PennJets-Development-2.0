---
wo: WO-4.17
terminal: T4
branch: t4/work
commit: d96b9d6
tested_against: "site: built output served from dist on localhost:5055 at d96b9d6, compared against production deploy 9ee9adc as the before — NOT yet a production deploy, see Known gaps"
date: 2026-09-20
status: reported
---

# WO-4.17 report — a web-sized logo and a real favicon

The home page went from **4.25 MB to 1.52 MB**. The logo was being fetched
twice, at 1.32 MB each time.

## Commit

`d96b9d6` WO-4.17: web-sized logo and a real favicon set.
On `t4/work`, pushed. Not merged.

## Data evidence — the number that justifies the order

Home page at 1440x900, sum of `content-length` across every response:

| | Total | Logo bytes |
|---|---|---|
| **Before** (production `9ee9adc`) | **4.25 MB** | 1,349 KB **× 2** |
| **After** (built output) | **1.52 MB** | 5.3 KB + 0.8 KB |

**2.73 MB saved on the home page**, and on every other page of the site, since
the header and the favicon are on all of them.

### The logo was downloaded twice, which nobody had noticed

The before trace shows it plainly:

```
1461 KB  /videos/Falcon-Hero-Flyover.MP4
1349 KB  /images/PennJets-Website-Logo.png
1349 KB  /images/PennJets-Website-Logo.png     <- again
  97 KB  /assets/index-d151b212.js
  47 KB  /s/inter/v20/UcC73...woff2
```

Two separate fetches of the same URL: one for the header `<img>`, one for
`<link rel="icon">`. Browsers treat those as different request destinations and
do not share the response. So the 1.32 MB figure in the WO-4.2 audit was half
the real cost.

After:

```
1461 KB  /videos/Falcon-Hero-Flyover.MP4
  47 KB  /fonts/inter-latin-normal.woff2
```

The logo no longer appears in the over-40 KB list at all. The hero video is now
the only large asset left, and it is not in this order's scope.

### Per-asset bytes

| Asset | Before | After |
|---|---|---|
| Header logo | 1,349.0 KB (the 1024x1024 source) | **5.2 KB** (`pennjets-logo-192.png`) |
| Favicon | 1,349.0 KB (the same file) | **0.8 KB** (`favicon-32.png`), 0.3 KB at 16 |
| Apple touch icon | did not exist | **5.2 KB** |
| **All four new assets together** | | **11.4 KB** |

## Route evidence — the rendered header is unchanged

| Width | Rendered box | `src` | Natural size |
|---|---|---|---|
| 390 @3x | 48x48 | `/images/pennjets-logo-192.png` | 192x192 |
| 1440 @2x | 64x64 | `/images/pennjets-logo-192.png` | 192x192 |

Identical boxes to before, because the new asset **keeps the source's square
framing**. That was deliberate: the header sizes the logo with
`h-12 lg:h-16 w-auto`, so height drives width. Handing it the mark trimmed to
its true 851x366 bounds would have rendered the logo nearly three times wider
and moved the nav. Same framing, same rendering, 1/260th of the bytes.

192px covers the largest case, the 64px box at 3x device pixel ratio, so there
is no quality loss at any width. Screenshots `header-390.png` and
`header-1440.png` in T4's scratchpad under `shots/wo417/`.

## UI evidence — the icons

The mark is white on `#0284c7`, the brand blue, rather than the source's black
on transparent. Two reasons, both forced:

- `apple-touch-icon` must be opaque; iOS composites transparency onto black,
  and a black mark on black is nothing.
- A black-on-transparent favicon is invisible in a dark browser tab, which is
  most of them now.

The blue matches the card in WO-4.16, so the two are consistent.

`apple-touch-icon.png` at 180x180 is legible and reads as the brand. The
favicons are covered in Known gaps.

## Remaining references to the source file, line by line

```
$ grep -rn 'PennJets-Website-Logo' src public index.html
src/components/pages/Gallery/Gallery.jsx:62:   name: 'PennJets-Website-Logo.png',
src/components/pages/Gallery/Gallery.jsx:63:   url: '/images/PennJets-Website-Logo.png',
```

Both are correct and deliberately left:

- `/gallery` is an internal image-library listing, an inventory of what is in
  `public/images/`. The source logo **is** still in the repo, kept as the source
  of record exactly as the order requires, so listing it is accurate.
- It is not a render path for any visitor-facing page. `/gallery` carries
  `noindex` since WO-4.7 and its footer link was removed in WO-4.3.

Every reference that *was* a render path has moved:

| Was | Now | Why |
|---|---|---|
| `Header.jsx:130` | `pennjets-logo-192.png` | the only visitor-facing render of the logo |
| `index.html:9` | the three-file icon set | the 1.32 MB favicon |
| `Home.jsx` JSON-LD `logo` | `pennjets-logo-192.png` | see below |
| `BlogArticle.jsx` JSON-LD `logo` | `pennjets-logo-192.png` | see below |

**The JSON-LD choice, since the order asked me to state it:** both organisation
`logo` values now point at the 192x192 copy rather than the source. A crawler
fetching structured data wants something it can retrieve cheaply and use;
Google asks for at least 112px, which 192 clears, and 5 KB is a far better
citizen than 1.32 MB. The source stays in the repo for any future asset that
needs full resolution, which is what WO-4.16 builds the card from.

## Build

```
> vite build && node scripts/postbuild.mjs
✓ built in 2.77s
```

Exit code 0. ESLint passes with `--max-warnings 0`. All four new assets are in
`dist/` at the expected sizes.

## Tests

No test suite exists in this repository, so there is no count to give.

## Scope

```
public/images/pennjets-logo-192.png     new, 5.2 KB
public/favicon-32.png                   new, 0.8 KB
public/favicon-16.png                   new, 0.3 KB
public/apple-touch-icon.png             new, 5.2 KB
public/images/PennJets-Website-Logo.png kept, untouched, source of record
src/components/layout/Header/Header.jsx the header src
index.html                              the icon set
src/components/pages/Home/Home.jsx      JSON-LD logo
src/components/pages/Blog/BlogArticle.jsx JSON-LD logo
docs/reports/t4/WO-4.17.md              this report
```

All within `PennJets-Development-2.0`. Nothing in the PennForce repository was
written. No other image was touched.

## Known gaps

1. **Not verified on a production deploy.** The before figure is production
   `9ee9adc`; the after figure is the built output served locally. The change
   does not reach the deployed site until this branch is merged.

2. **No `site.webmanifest`, deliberately.** The order said to say so rather
   than add one silently. One is only worth having if the site is meant to be
   installable as a web app, which nothing suggests it is, and an empty
   manifest is clutter that browsers then fetch on every page. `apple-touch-icon`
   covers the iOS home-screen case without it. Easy to add if wanted.

3. **The favicon is a smudge at 16 and 32 pixels, and nothing here can fix
   that.** The logo is a wide script wordmark, 851x366, an aspect of 2.3:1.
   Squeezed into a 32px square the letterforms are about 14px tall and the word
   is unreadable. The 180px apple-touch-icon is fine. This is a property of the
   mark, not of the export: no resizing makes a long script word legible at
   16px. A monogram, the initial P or a small symbol, is what that size wants.
   **That is a redesign and explicitly out of scope, so I have not done it**;
   queued for Joseph in `docs/drafts/t4/for-joseph-WO-4.17.md`.

4. **One oversized asset remains and I have not touched it**, per the order:
   `/videos/Falcon-Hero-Flyover.MP4`, 1,461 KB, autoplaying on the home page. It
   is now the largest asset on the site by a wide margin and the only thing
   above 100 KB. The WO-4.2 audit also noted it depicts an aircraft that is not
   Penn Jets'. Reporting the number, not fixing it.
