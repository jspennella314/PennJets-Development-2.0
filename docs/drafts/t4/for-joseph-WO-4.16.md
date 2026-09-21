# For Joseph — WO-4.16, the link-preview card

> **RESOLVED 2026-09-20.** Joseph chose card A, the logo alone. It is applied
> and the Falcon crop is deleted. One new item below still needs him.

**Belongs in `docs/orders/joseph.md` in the PennForce repo. T4 cannot write
there**, so it is queued here and needs relaying.

---

## The choice, now made

Two cards were offered, both 1200x630 on `#0284c7`, the primary blue from the
header band, with the mark rendered white by the same filter the site header
uses.

| | File | Size | Outcome |
|---|---|---|---|
| **A** — the logo alone, set larger | `docs/drafts/t4/og-card-a.png` | 33 KB | **chosen and applied** |
| **B** — logo plus a `PENN JETS` wordmark, as originally ordered | `docs/drafts/t4/og-card-b.png` | 36 KB | kept as the record |

There were two because the order's wordmark decision rested on my order
request, which called the source "the logo" without noting that the logo is
itself a wordmark: the word "PennJets" in a script face, not a symbol. The
ordered lockup therefore said the name twice. Joseph's reply, 2026-09-20:

> Card A. My wordmark decision assumed the logo was a symbol; you checked the
> file and it isn't, so B says the name twice. Apply A and delete the Falcon
> crop.

Done. `og-default.jpg` is deleted and `DEFAULT_IMAGE` points at the card.

---

## New, and this one needs you: a Market Note is using the 1.32 MB logo as its preview

> **RESOLVED 2026-09-20.** Joseph: "The Market Note with the logo as its
> featured image was me. I will clear it in the CMS." Nothing for T4 to do.

Found while counting the fallbacks. `why-we-publish-market-notes` had
`Gallery/falcon.jpg` as its featured image this morning. The CRM now returns
`/images/PennJets-Website-Logo.png`.

That is a poor preview image for three reasons:

- it is **1.32 MB**, the exact file WO-4.17 just took out of every render path
  on the site
- it is **1024x1024**, and link previews want roughly 1.91:1, so platforms will
  crop it
- it is **black on transparent**, so anything compositing it onto a dark
  background shows almost nothing

The fix is one field in the CRM, and it is yours rather than mine. Either
clear it, so the Note falls back to the new card, or point it at
`https://www.pennjets.com/images/og-card.png` directly.

## Still outstanding from before

Two Notes have no usable image and one still hotlinks `wallpaperaccess.com`:

- `bombardier-us-market-access-...` — image removed for a visible registration
- `how-to-buy-your-first-private-jet-...` — same
- `september-11-and-the-evolution-of-private-aviation` — unlicensed host,
  blocked since WO-4.12

All three render the card, which is correct behaviour, but they were meant to
get real images.
