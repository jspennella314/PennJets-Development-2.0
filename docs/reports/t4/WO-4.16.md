---
wo: WO-4.16
terminal: T4
branch: t4/work
commit: f1497e7
tested_against: "site: local dev (vite 5173) at f1497e7. The card is built and committed but NOT applied — the order gates that on Joseph, and he has not answered. See Known gaps."
date: 2026-09-20
status: reported
---

# WO-4.16 report — a branded link-preview card

**Partially delivered, and deliberately so.** The card is built and committed
to `docs/drafts/t4/`. It is **not** applied as `DEFAULT_IMAGE`, because the
order says Joseph sees it before it ships and he has not answered. Per the
standing instruction, that part waits and the rest continued.

## Commit

`f1497e7` WO-4.16: build the link-preview card, not yet applied.
On `t4/work`, pushed. Not merged.

## Route evidence

Not yet available, and cannot be until the card is applied. The `og:image` and
`twitter:image` in the built static HTML still point at `og-default.jpg`, which
is correct: nothing has changed on the site.

## UI evidence — the card

Two variants, both 1200x630 on `#0284c7`, the `primary.600` from
`tailwind.config.js` that the header band uses.

| Variant | What | File | Size |
|---|---|---|---|
| **B** | the logo plus a `PENN JETS` wordmark, as the order specifies | `docs/drafts/t4/og-card-b.png` | 36.4 KB |
| **A** | the logo alone, set larger | `docs/drafts/t4/og-card-a.png` | 33.4 KB |

Both are comfortably inside the order's "a few tens of KB, not hundreds".

### Why there are two, and what I got wrong in the request

My order request described the source as "the Penn Jets logo" and noted that a
single centred mark would leave the card mostly empty. That framing produced
decision 2 in the order, the added wordmark.

Opening the file shows **the logo is itself a wordmark**: the words "PennJets"
set in a script face, not a symbol. So the ordered card reads *PennJets* in
script with *PENN JETS* in capitals directly beneath it.

That is a defensible lockup, not an error, and B is what the order asked for.
But Joseph was choosing on my description, and my description was incomplete.
Variant A shows what the alternative looks like so the decision is made on the
thing rather than on my summary. Flagged to him with a recommendation for A.

### How the card was made

Rendered from HTML in headless Chrome at 1200x630 rather than composited, so:

- the wordmark uses the real Inter the site self-hosts since WO-4.14, rather
  than whatever font an SVG rasteriser happens to pick
- the mark is turned white by `filter: brightness(0) invert(1)`, the same
  filter `Header.jsx` applies, so the card matches the site rather than
  approximating it

The source PNG is a 1024x1024 square with the script in the middle and a soft
drop shadow. Laying it out by width put a square of empty canvas in the card
and pushed the wordmark off the bottom edge on the first attempt. Fixed by
thresholding the alpha to drop the shadow and trimming to the visible bounds,
**851x366**, which is the mark's true aspect.

The generator lives in T4's scratchpad rather than in the repo, because it
needs `sharp` and Playwright and this repository has neither as a dependency.
Adding two image-tooling dependencies to build a static asset once is not worth
it. The recipe is recorded above and the output is committed.

## Data evidence

The order asks whether the three Market Notes that fall back still do.
**They do**, checked against the live CRM as this was written:

| | Notes |
|---|---|
| Use their own `featuredImage` | 6 of 9 |
| Fall back to the default | 3 of 9 |

| Note | Why it falls back |
|---|---|
| `september-11-and-the-evolution-of-private-aviation` | still points at `wallpaperaccess.com`, blocked as unlicensed since WO-4.12 |
| `bombardier-us-market-access-...` | image removed for a visible registration |
| `how-to-buy-your-first-private-jet-...` | same |

So the images Joseph said he would set in the CRM have not landed yet. The
fallback logic itself needs no change, as the order anticipated.

## Build

Not rebuilt for this report: no source file changed. The two PNGs are
documentation assets under `docs/drafts/t4/`, not part of the bundle.

## Tests

No test suite exists in this repository, so there is no count to give.

## Scope

```
docs/drafts/t4/og-card-a.png          new, the card, logo alone
docs/drafts/t4/og-card-b.png          new, the card as ordered
docs/drafts/t4/for-joseph-WO-4.16.md  the choice, queued for Joseph
docs/reports/t4/WO-4.16.md            this report
```

No source file was touched. Nothing in the PennForce repository was written.

## Known gaps

All four are the same gap: **the card is not applied**, because the order gates
that on Joseph and he has not answered.

1. **`DEFAULT_IMAGE` still points at `og-default.jpg`.** Applying it is one
   constant in `src/seo/siteMeta.js`, which both `PageMeta` at runtime and
   `scripts/postbuild.mjs` at build time read.

2. **`og-default.jpg` is not deleted**, and cannot be while it is still the
   default. The `grep -rn 'og-default' src public scripts` the order asks for
   would not return nothing today, so producing it now would be misleading.

3. **No `og:image` or `twitter:image` evidence from the built HTML**, for the
   same reason: the built output correctly still shows the old image.

4. **No social preview debugger result.** That evidence needs a public URL
   serving the new card. The card is not applied, the branch is not merged, and
   the debuggers cannot reach a local dev server. It is achievable only after
   merge, and I will produce it then — it is also the one item from WO-4.7's
   evidence list never delivered for any page.

Everything above unblocks the moment Joseph picks A or B. It is a single
constant, a file deletion, a rebuild and the four pieces of evidence.
