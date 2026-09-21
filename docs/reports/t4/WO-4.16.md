---
wo: WO-4.16
terminal: T4
branch: t4/work
commit: 293b8ed
tested_against: "site: built output at 293b8ed — NOT yet a production deploy, see Known gaps. Fallback state checked against the live CRM, production dpl_FsRLBXmS8bFju1c5tEwGi18Kxapp (5b95295)."
date: 2026-09-20
status: reported
---

# WO-4.16 report — a branded link-preview card

Sharing a pennjets.com URL now previews with the brand card instead of a
cropped photograph of a Falcon. Joseph chose **card A**, the logo alone.

## Commit

`293b8ed` WO-4.16: apply card A and delete the Falcon crop.
Built in `f1497e7`, applied here. On `t4/work`, pushed. Not merged.

## UI evidence — the card

`public/images/og-card.png`, **1200x630, 32.6 KB**. The mark in white on
`#0284c7`, the `primary.600` the header band uses.

### Two variants were offered, and why

The order's decision 2 was "the logo plus a `PENN JETS` wordmark", made on my
order request, which described the source as "the Penn Jets logo" and noted a
single centred mark would leave the card mostly empty.

That description was incomplete. **The logo is itself a wordmark**: the word
"PennJets" in a script face, not a symbol. The ordered lockup therefore read
*PennJets* in script with *PENN JETS* in capitals directly beneath.

Both were built and put to Joseph rather than my choosing for him. His
decision, 2026-09-20:

> Card A. My wordmark decision assumed the logo was a symbol; you checked the
> file and it isn't, so B says the name twice. Apply A and delete the Falcon
> crop.

Variant B is kept at `docs/drafts/t4/og-card-b.png` as the record of what was
offered.

### How it was made

Rendered from HTML in headless Chrome at 1200x630 rather than composited, so
the mark is turned white by `filter: brightness(0) invert(1)`, the same filter
`Header.jsx` applies. The card matches the site rather than approximating it.

The source PNG is a 1024x1024 square with the script in the middle and a soft
drop shadow, so laying it out by width put a square of empty canvas in the
card. Fixed by thresholding the alpha to drop the shadow and trimming to the
mark's true bounds, **851x366**.

The generator lives in T4's scratchpad, not the repo: it needs `sharp` and
Playwright, and this repository has neither as a dependency. Adding two
image-tooling dependencies to build one static asset is not worth it.

## Route evidence — read from the built static HTML

| File | `og:image` | `twitter:image` |
|---|---|---|
| `dist/index.html` (home) | `.../images/og-card.png` | same |
| `dist/charter.html` (a static route) | `.../images/og-card.png` | same |
| `dist/blog/bombardier-us-market-access-....html` (a Note that falls back) | `.../images/og-card.png` | same |

Both the runtime path and the static-HTML path follow the one constant, as
expected: `DEFAULT_IMAGE` in `src/seo/siteMeta.js` is now
`/images/og-card.png`.

A Market Note with its own image is untouched by the change, which is the
behaviour the order required.

### The Falcon crop is gone

```
$ grep -rn 'og-default' src public scripts index.html
(no matches, exit 1)

$ ls dist/images/og-default.jpg
ls: cannot access 'dist/images/og-default.jpg': No such file or directory
```

`public/images/og-default.jpg` deleted, 77,757 bytes removed from the repo.

## Data evidence — which Notes use the card

Checked against the live CRM as this was written:

| | Notes |
|---|---|
| Use their own `featuredImage` | 7 of 9 |
| Fall back to the card | 2 of 9 |

The two that fall back:

| Note | Why |
|---|---|
| `bombardier-us-market-access-...` | its image was removed for a visible registration |
| `how-to-buy-your-first-private-jet-...` | same |

`september-11-and-the-evolution-of-private-aviation` still points at
`wallpaperaccess.com`. It is counted above as using "its own image" only in the
sense that the field is set; the unlicensed-host guard from WO-4.12 blocks it,
so it also renders the card. Effectively **three** Notes show the card.

## Build

```
> vite build && node scripts/postbuild.mjs
✓ built in 3.40s
[postbuild] wrote 25 HTML files (9 Market Notes) and sitemap.xml with 24 URLs
```

Exit code 0. ESLint passes with `--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give.

## Scope

```
public/images/og-card.png             new, 32.6 KB, the card
public/images/og-default.jpg          deleted
src/seo/siteMeta.js                   DEFAULT_IMAGE
docs/drafts/t4/og-card-a.png          the chosen card, kept as the record
docs/drafts/t4/og-card-b.png          the variant offered, kept as the record
docs/drafts/t4/for-joseph-WO-4.16.md  the choice, now resolved
docs/reports/t4/WO-4.16.md            this report
```

All within `PennJets-Development-2.0`. Nothing in the PennForce repository was
written.

## Known gaps

1. **No social preview debugger result, and it is not obtainable yet.** The
   debuggers fetch a public URL; the card is not on production until this
   branch is merged, and they cannot reach a local server. This is the one item
   on WO-4.7's evidence list never delivered for any page. **I will produce it
   for one URL as soon as this is merged** — it needs nothing but a deployed
   page.

2. **Not verified on a production deploy**, for the same reason.

3. **A Market Note now points at the 1.32 MB source logo, and it should not.**
   Found while gathering the fallback numbers. `why-we-publish-market-notes`
   had `Gallery/falcon.jpg` as its `featuredImage` this morning; the live CRM
   now returns `/images/PennJets-Website-Logo.png`. Someone changed it in the
   CRM, which is not mine to touch.

   Three reasons it is a poor preview image, none of them the CRM's fault:
   it is **1.32 MB**, the file WO-4.17 just removed from every render path on
   the site; it is **1024x1024**, where previews want roughly 1.91:1 and will
   crop it; and it is **black on transparent**, so a platform compositing it
   onto a dark background shows almost nothing.

   The fix is one field in the CRM and it is Joseph's: either clear it, so the
   Note falls back to this card, or set it to
   `https://www.pennjets.com/images/og-card.png` directly. Queued in
   `docs/drafts/t4/for-joseph-WO-4.16.md`.

4. **Two Notes still have no usable image** and one still hotlinks an
   unlicensed host, unchanged since the last report. They render the card,
   which is the correct behaviour, but they were meant to get real images.
