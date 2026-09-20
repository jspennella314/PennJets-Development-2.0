# Writing a Market Note

How a note is structured, and how to get a pull quote and a sourced statistic
to render. Written for the PennForce editor, which is where notes are authored.
The site reads them from `GET /api/public/blog/{slug}` and renders them with
the template in `src/components/pages/Blog/BlogArticle.jsx`.

## Shape of a note

Reference structure: an analysis piece, not a news item. 600 to 800 words.

1. **Headline that states a position.** Not "The Light Jet Market in 2026" but
   "Why Smaller Business Jets Could Lead the Next Decade". The reader should
   know what you think before they click.
2. **Category and date.** The template puts both above the headline. Categories
   are **Market Studies**, **Market Notes**, **Transactions**.
3. **Lede that names the conventional view.** The first paragraph renders
   larger than the body. Use it to state what most people assume, plainly, so
   the rest of the note has something to push against.
4. **Body that complicates it, with specific evidence.** Short paragraphs, two
   to four sentences. Every number carries its source in the same sentence or
   the sentence after. "A September 2026 forecast reported by Aviation
   International News estimates..." not "industry forecasts suggest...".
5. **One pull quote.** The sentence a reader would repeat. See below.
6. **One sourced statistic**, if the note turns on a number. See below.
7. **Forward-looking close.** What you expect, what would change your mind, or
   what a buyer or seller should watch. Not a summary of what you just wrote.

Never state what Penn Jets operates, charges, or is licensed to do. Never
invent availability, pricing, or transaction history. Those rules are in
`CLAUDE.md` and they apply to notes as much as to page copy.

## Pull quote

The PennForce editor has no blockquote button, so mark a pull quote by starting
its own paragraph with `>`. The attribution after an em dash is optional.

```
> Mission, not maximum range, is what decides the right airplane for most buyers. — Joseph Pennella
```

Renders as the quote set large against a rule, with the attribution beneath.
Keep it to one or two sentences and pull it from the note's own argument.

## Sourced statistic

Start its own paragraph with `STAT:`. The format is the figure, an em dash, the
label, then the source in parentheses:

```
STAT: $60.5 billion — projected 2034 business jet market, up from $27 billion in 2025 (Aviation International News, September 2026)
```

Renders as a bordered block: the figure large, the label under it, the source
in small caps below that. The source is not optional. One per note; if a note
needs several numbers they belong in the body with inline sources.

If the editor ever gains a real blockquote button, those render as pull quotes
too. Nothing needs to change.

## Images

- **Featured image** is the note's hero, cropped to 16:9, and is also the
  social preview image. Pick something with no visible tail number and a
  license Joseph can produce.
- If the featured image is missing from the site, the hero degrades to an empty
  panel and the social preview falls back to `/images/og-default.jpg`. The
  build prints a warning naming the note, so check the build log.
- Do not hotlink images from other sites. The site only renders images served
  from pennjets.com; anything else is ignored, the hero is left out, and the
  build warns. As of 2026-09-20 one note does this:
  `september-11-and-the-evolution-of-private-aviation` has its Featured Image
  set to `wallpaperaccess.com`. Replace it in PennForce.

## What the template adds on its own

Below the note, in this order, with nothing to author:

1. **Talk to a Broker** with the author's bio and a message form. The form
   posts to the author's webhook with the note's slug, which is what gives the
   CRM `source: 'blog'` attribution. Do not remove it.
2. **Newsletter** signup, the email subscribe product.
3. **Three related Market Notes**, same category first, then most recent.

## Setting a category

A note's category lives in its existing **keywords** array as a prefixed value
(T1, 2026-09-20). Add exactly one of these to the keywords field in PennForce:

| Keyword to store | Label readers see |
|---|---|
| `category:market-studies` | Market Studies |
| `category:market-notes` | Market Notes |
| `category:transactions` | Transactions |

A note with none of these has no category: it shows no label and still appears
in the unfiltered list on the index. The keyword itself is never shown as a
tag. Readers filter the index with the label buttons, which set
`/blog?category=<slug>`, so a filtered view can be linked and shared.

The index requests `GET /api/public/blog?keyword=category:<slug>`, then
re-checks each returned note against the exact keyword. That endpoint is a
loose substring search (`?keyword=jet` returns every note), so the second check
is what keeps a note out of the wrong category.

As of 2026-09-20 no published note carries one of these keywords yet, so the
site shows no labels and no filter bar. Both appear on their own as notes are
tagged.
