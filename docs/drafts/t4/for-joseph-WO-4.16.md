# For Joseph — WO-4.16, the link-preview card

**Belongs in `docs/orders/joseph.md` in the PennForce repo. T4 cannot write
there**, so it is queued here and needs relaying.

**This one genuinely blocks.** The order says the card does not go live until
you have seen it. It is built and committed but **not applied**: the site still
previews with the Falcon photograph until you say which one.

---

## The two cards

Both are 1200x630 on `#0284c7`, the primary blue from the header band, with the
mark rendered white by the same filter the site header uses.

| | File | Size |
|---|---|---|
| **B** — logo and a `PENN JETS` wordmark, as ordered | `docs/drafts/t4/og-card-b.png` | 36 KB |
| **A** — the logo alone, set larger | `docs/drafts/t4/og-card-a.png` | 33 KB |

## Why there are two

Your decision was "the logo plus a `PENN JETS` wordmark", and that answered a
point I raised: a single centred mark leaves a 1200x630 card mostly empty.

What I did not say, because I had not opened the file, is that **the logo is
itself a wordmark.** It is the words "PennJets" in a script face, not a symbol.
So the ordered card reads *PennJets* in script and then *PENN JETS* in capitals
directly beneath it.

That is not wrong. It reads as a logo lockup and plenty of brands do it. But it
is a repetition, and you would have been choosing with that in mind if I had
described the asset properly the first time. Card A is what the alternative
looks like.

**I would pick A.** The script mark is distinctive, it fills the space perfectly
well at the larger size, and the card says the name once. But it is your brand
and B is what you asked for, so tell me which and I will apply it.

## What happens when you pick

One constant changes, `DEFAULT_IMAGE` in `src/seo/siteMeta.js`, and both the
runtime and the static-HTML paths follow it. Then `og-default.jpg`, the Falcon
crop, is deleted.

## Your Market Notes, as of now

The fallback behaviour is unchanged and needs no work: a note with its own
featured image keeps it, and only a note without one shows the card.

| | Notes |
|---|---|
| Use their own image | 6 of 9 |
| Fall back to the card | 3 of 9 |

The three are still the same three, so the images you were going to set in the
CRM have not landed yet:

- `september-11-and-the-evolution-of-private-aviation` — still points at
  `wallpaperaccess.com`, still blocked as unlicensed
- `bombardier-us-market-access-...` — image removed for a visible registration
- `how-to-buy-your-first-private-jet-...` — same

Set those three and only a note you have genuinely left blank will show the
card.
