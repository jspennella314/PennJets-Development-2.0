# Order request — a branded link-preview card

**For the lead, to write as an order in `docs/orders/t4/`.** T4 cannot write
there, so this is queued in the site repo and needs relaying.

**Requested by Joseph, 2026-09-20**, in chat. Per the standing rule, a chat
line is not an order, so nothing has been built. This is the request with the
facts already checked, so the order can be written without re-investigating.

---

## What Joseph asked for

> The og:image on pennjets.com is a photo I don't want representing the site in
> link previews. Replace it with a branded card, the Penn Jets logo on a solid
> background at 1200x630, built from the existing logo asset. Apply it as the
> default og:image and twitter:image sitewide. Market Notes keep their own
> featured image as their og:image where they have one; where they don't, they
> fall back to this card.

He also asked to see the card before it ships.

## What is there today

| | |
|---|---|
| Default preview image | `/images/og-default.jpg` |
| What it is | 1200x630 JPEG, 76 KB, cropped from `Gallery/falcon.jpg`, a photograph of a Falcon on a wet ramp |
| Where it came from | I made it during WO-4.7, from a photo already on the site, because every shared URL previewed with no image at all |
| Where it is applied | `DEFAULT_IMAGE` in `src/seo/siteMeta.js`, consumed by `PageMeta` at runtime and by `scripts/postbuild.mjs` for the static per-route HTML |

So the photo Joseph is objecting to is mine, and replacing it is a
one-constant change plus the new asset.

## The behaviour he describes is already implemented

The fallback logic exists and would not need changing, only the image it points
at. Verified against the live CRM today:

| Notes | Preview image |
|---|---|
| 6 of 9 | their own `featuredImage` |
| 3 of 9 | the default card |

The three that fall back: `september-11-...` hotlinks an off-site host and is
blocked by the image policy from WO-4.12; `bombardier-us-market-access-...` and
`how-to-buy-your-first-private-jet-...` point at files removed for visible
tail numbers in Round 3. Joseph is setting new images on all three in PennForce,
which would move them back into the first row.

## What the order should specify

1. **The card.** Logo on a solid background, 1200x630. The source asset is
   `public/images/PennJets-Website-Logo.png`, 1024x1024 PNG with transparency,
   1.32 MB. It is the only logo file in the repo.
2. **The background colour.** Not specified in the request. The logo's own dark
   pixels average roughly `#444`, and the site's footer is near-black while the
   header band is the primary blue. Worth Joseph picking, or the order naming
   one, rather than me choosing the brand's background colour.
3. **Whether any wordmark or tagline appears** beside the logo, or the logo
   alone. The request says "the Penn Jets logo on a solid background", which I
   read as the logo alone, but a card at 1200x630 is mostly empty with a single
   centred mark.
4. **Keep or delete `og-default.jpg`.** Nothing else references it, so it can go
   once the card replaces it.
5. **Evidence**, suggested: the rendered card at full size; the `og:image` and
   `twitter:image` in the built static HTML for a static route and for a Market
   Note that falls back; and a social preview debugger screenshot, which
   WO-4.7's evidence list also asked for and which I have not yet produced for
   any page.

## What I would flag as a side benefit

The logo file is 1.32 MB and is currently the header logo and the favicon on
every page. It was the fourth-largest transfer on the home page in the WO-4.2
audit. Producing a card is a natural moment to also emit a small web-sized
logo, but that is a separate change and should be its own order if wanted, not
smuggled into this one.

## Status

Nothing built. Awaiting an order file.
