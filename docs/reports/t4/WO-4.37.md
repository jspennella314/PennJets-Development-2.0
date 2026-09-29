---
wo: WO-4.37
terminal: T4
branch: t4/work
commit: e905fbf
tested_against: "local build of t4/work at e905fbf (dist/ from npm run build; list refreshed from the production CRM by postbuild, prerender answered from that cache). Served by vite preview on :4173 (after) and the pre-change dist on :4175 (before), captured with the site's Playwright Chromium; the note list was answered locally and every other CRM call blocked. No deploy: the site deploys only from main."
date: 2026-09-29
status: reported
---

# WO-4.37 report: the newest Market Note on the home page, compactly

**For Joseph at the merge.** The review screenshots are
[`wo-4.37-home-390.png`](wo-4.37-home-390.png) (390×844, top of the home
page), [`wo-4.37-home-1440.png`](wo-4.37-home-1440.png) (1440×900, top of
the home page) and [`wo-4.37-card-1440.png`](wo-4.37-card-1440.png) (the
card alone at desktop width). The close-up exists because at 1440×900 the
site's sticky Call / Request a Quote bar covers most of the card in the
viewport shot; there it was taken in a 1440×1400 viewport, so the bar sits
below the card.

## Commit

`e905fbf` on `t4/work`, pushed.

```
$ git show --stat --format= e905fbf
 scripts/prerender.mjs                     |  47 ++++++
 src/components/pages/Blog/BlogArticle.jsx |  38 +----
 src/components/pages/Blog/imageCredit.jsx |  41 +++++
 src/components/pages/Home/Home.jsx        |   4 +
 src/components/pages/Home/LatestNote.jsx  | 101 +++++++++++
```

## What was there: confirmed

The home page showed no notes. At `7f61d1d`, `Home.jsx` imports nothing
from `blogApi`. The only callers of `getPosts` are the blog index
(`BlogList.jsx:31`, `:40`) and the article's related notes
(`BlogArticle.jsx:78`). No notes section exists anywhere else on the site.

## What was built

`src/components/pages/Home/LatestNote.jsx`, placed in `Home.jsx` directly
after `</header>` and before the inventory and off-market sections. In
`dist/index.html` it comes after `</header>` (char 6690) and before
`off-market` (char 10043), at char 7995.

- **The newest note:** the post with the greatest `publishedAt`, chosen
  whatever order the list arrives in. Today that is
  `q3-2026-the-quarter-where-the-paperwork-started-to-matter`
  (2026-09-28T14:04:24Z).
- **One link.** The card is a single `<a href="/blog/<slug>">` (a router
  `Link`) with no link inside it.
- **Mobile (below `md`):**
  - a thumbnail (80×64) beside the text;
  - category label, date, title;
  - **no excerpt** (`display: none`, measured).
- **Desktop (`md` and up):**
  - the same card with a 112×80 thumbnail;
  - **one line of excerpt**, via Tailwind `truncate` (one line, overflow
    hidden, ellipsis);
  - the words **"Read the note"**, as a `<span>` inside the link, not a
    link of its own.
- **Category:** `categoryFor(note)`. An untagged note shows no label, no
  separator and no placeholder. **Three** published notes are untagged
  today, not two, including the newest one. So the card shows no label
  now, which is correct.
- **Date:** `formatNoteDate(publishedAt)` from `utils/marketNotes.js`,
  which gives "September 28, 2026". The index's own `formatDate` is a
  closure inside `BlogList` and cannot be imported. The two use the same
  options (`year: 'numeric', month: 'long', day: 'numeric'`). The only
  difference is that the shared one pins `en-US` where the index uses the
  browser's locale. They print the same in an en-US browser, which is
  what the prerender uses.
- **Image:** `safeImage(featuredImage)`, the index's rule, so a hotlinked
  image shows no thumbnail. `onError` hides a broken one, as in the
  article.
- **Image credit.** Shown when a thumbnail is shown and the note's
  `imageAttribution` yields a credit: every CC licence, and licensed
  stock, exactly as the article decides. It uses **the article's own
  helper**, `imageCreditContent`, and the article's markup
  (`<p class="image-credit …">`, with credit and licence as real links).
  It sits inside the card box but **outside the card link**, under it,
  because it holds links of its own. For the newest note:

  > Photo: [Duncan Kirk / Wikimedia Commons](…), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Modified from original.

  If Joseph decides to drop the image rather than show a credit on the
  card, it is a one-line change in `LatestNoteCard`.
- **Heading, proposed:** a visually hidden `<h2>` reading **"Latest
  Market Note"** (`sr-only`), so the card's title (`<h3>`) sits under a
  section heading like the rest of the page. No visible copy was added
  beyond "Read the note".

### Where the helper went: one file beyond the order's list

`imageCreditContent` was a private function in `BlogArticle.jsx`. Simply
exporting it failed lint: `react-refresh/only-export-components` rejects
a component file that also exports a plain function, and lint allows zero
warnings. So it **moved, unchanged**, to
`src/components/pages/Blog/imageCredit.jsx`, and both the article and the
card import it from there. That is a new file, and `BlogArticle.jsx`
changed only by that move (38 lines out, 1 import in). All 11 article
pages prerender identically before and after (below).

## Prerendering: the list comes from the cache

**`scripts/prerender.mjs` is the other file outside the list, and it was
needed.** The prerender already answered article reads from the article
cache, but the **list** read (`GET /api/public/blog`) matched neither of
its handlers. So the index and every note's related-notes list were
fetched live from the CRM during the prerender. The order requires the
card to be built from the refreshed posts cache, not fetched live, so the
prerender now answers the list read from `scripts/crm-posts.cache.json`.
postbuild writes that file seconds earlier in the same build, from the
same route.

- The answer **mirrors the CRM route** (`app/api/public/blog/route.ts` on
  the CRM's `main`, read, not changed): `publishedAt` descending, `limit`
  default 10, `offset` default 0, and the same `{ posts, pagination }`
  shape.
- A read with `?category=` or `?keyword=` is let through, because the
  CRM's filter is not reproduced. None happens during a build.
- **Proof that the mirror is faithful:** a build with only this change,
  compared page by page with the build before it (`9359838`), found **28
  of 28 HTML files identical** once the countdown banner's numbers were
  masked. Header.jsx bakes days, hours, minutes and seconds into every
  prerendered page, so they differ between any two builds. With the card
  added, **27 of 28 are identical** (asset hashes also masked, since the
  JS changed), and the only difference is `index.html`.

```
[prerender] 14 note-list read(s) answered from scripts/crm-posts.cache.json; none reached the CRM.
```

That is 14 list reads: the home page, the index, and the related notes
on 11 articles, plus the index's second read. None reached the CRM. The
list route writes no `ContentAnalytics` row, so this changes no numbers.
It does make the pages match the list postbuild used.

## The card as prerendered (`dist/index.html`)

```html
<section aria-labelledby="latest-note" class="pt-8">
<div class="mx-auto w-full max-w-6xl px-6">
<h2 id="latest-note" class="sr-only">Latest Market Note</h2>
<div class="latest-note rounded-2xl border border-gray-200 bg-white shadow-sm">
<a class="flex items-center gap-4 rounded-2xl p-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 md:p-4" href="/blog/q3-2026-the-quarter-where-the-paperwork-started-to-matter">
<img src="https://www.pennjets.com/images/Gallery/citation-x-ramp-no_registration.jpg" alt="" width="96" height="72" loading="lazy" class="h-16 w-20 flex-shrink-0 rounded-lg bg-gray-100 object-cover md:h-20 md:w-28">
<div class="min-w-0 flex-1">
<div class="flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
<time datetime="2026-09-28T14:04:24.471Z">September 28, 2026</time>
</div>
<h3 class="mt-1 text-base font-semibold leading-snug text-gray-900 md:text-lg">Q3 2026: The Quarter Where the Paperwork Started to Matter</h3>
<p class="mt-1 hidden truncate text-sm text-gray-600 md:block">Flight activity rose through the third quarter while transactions lagged. A pending tariff decision, a threatened sales ban and a Canadian tax incentive explain most of the gap.</p>
<span class="mt-1 hidden text-sm font-medium text-gray-900 underline underline-offset-2 md:inline-block">Read the note</span>
</div>
</a>
<p class="image-credit px-3 pb-2 text-[11px] text-gray-500 md:px-4 md:pb-3 md:text-xs">Photo: <a href="https://upload.wikimedia.org/wikipedia/commons/e/ec/PP-JMJ_Citation_X%2C_Fort_Lauderdale_02-20-26_%2855148205866%29.jpg?utm_source=commons.wikimedia.org&amp;utm_campaign=index&amp;utm_content=original" target="_blank" rel="noopener noreferrer" class="underline decoration-gray-300 underline-offset-2 hover:text-gray-700">Duncan Kirk / Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="license noopener noreferrer" class="underline decoration-gray-300 underline-offset-2 hover:text-gray-700">CC BY 4.0</a>. Modified from original.</p>
</div>
</div>
</section>
```

## The fold, measured

These are `getBoundingClientRect()` values from the built pages. "Before"
is the `dist` of `9359838`, served on :4175; "after" is `e905fbf`,
served on :4173.

| Viewport | Lowest hero button | Its bottom `y`, before | after | Inside the first viewport |
|---|---|---|---|---|
| 390×844 | "Talk to a Broker" | **409** | **409** | yes (844) |
| 1440×900 | both buttons, one row | **480** | **480** | yes (900) |

The buttons do not move: the hero is fixed at `h-[60vh]` / `md:h-[80vh]`,
and the card comes after it. The countdown banner and the site header
above the hero are unchanged. Where the card sits:

| Viewport | Card top | Card bottom | Thumbnail | Excerpt | "Read the note" | Credit |
|---|---|---|---|---|---|---|
| 390×844 | 538 | 691 (**fully above the fold**) | 80 wide | `display: none` | `display: none` | shown, 649–690 |
| 1440×900 | 752 | 911 (the credit line crosses the fold by 11 px) | 112 wide | one line, 942 wide | shown | shown, 882–910 |

## The empty case

**Harness:** the real built home page (`dist/index.html` on :4173) in
Playwright Chromium, with the list request answered three ways. Because
the site mounts with `createRoot`, the client render replaces the
prerendered card, so these are the runtime cases. Measured
`section[aria-labelledby="latest-note"]` and `.latest-note`:

```
{"label":"empty-list","list":"empty",...,"measure":{"section":[],"card":[]}}
{"label":"failed-fetch","list":"fail",...,"measure":{"section":[],"card":[]}}
{"label":"in-flight","list":"slow","probe":{"atMs":1200,"section":[],"card":[]},...,
  "measure":{"section":[{"top":506,"bottom":691,...}],"card":[{"top":538,"bottom":691,...}]}}
```

- **Empty list:** no section and no box. Nothing renders.
- **Failed fetch:** `getPosts()` returns `[]` on failure, so again
  nothing, with no error text.
- **In flight:** 1.2 s into a 4 s response there is no section and no
  box. When the list arrives, the card appears.

**On a non-prerendered load, and on the prerendered one after React
mounts:**
- **While the fetch is in flight, nothing renders.** `createRoot`
  replaces the prerendered markup, and the component starts with no
  list. On a real visit the card is in the HTML, disappears when React
  mounts, and reappears when the list returns, which is normally a
  fraction of a second.
- **The content below moves down by about 185 px when the card
  arrives.** This is the same behaviour the blog index has today, for
  the same reason (`createRoot`, not `hydrateRoot`).
- **Fix: not done here.** Hydrating instead of replacing is a site-wide
  change, outside this order.

## When a new note appears

- **In the prerendered HTML** (crawlers, social previews, no-JS):
  - on the next build after Joseph publishes;
  - builds run on every push to the site's `main` (a merge), and on the
    daily scheduled rebuild, `cron: '0 6 * * *'`, which is 06:00 UTC in
    `.github/workflows/deploy.yml`;
  - **at the latest, about 24 hours plus the deploy time**, for a note
    published just after the 06:00 UTC run when nothing is merged in
    between.
- **For a visitor with JavaScript: immediately.** The card re-fetches the
  live list on every load, so the newest note shows as soon as it is
  published.

## Build

```
$ npm run build            (at e905fbf)
build exit 0
vite v4.5.14 building for production...
✓ 90 modules transformed.
✓ built in 8.29s
[postbuild] article bodies: 11 from cache, 0 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
[postbuild] wrote 27 HTML files (11 Market Notes) and sitemap.xml with 26 URLs
[prerender] 27 of 27 routes rendered in 40.5s, 138,056 characters of body text added
  /                                                            0 ->   2784 chars  +head meta:keywords
[prerender] 11 view beacon(s) intercepted; none reached the CRM.
[prerender] 11 article fetch(es) answered from cache; none reached the CRM, so none wrote a ContentAnalytics row.
[prerender] 14 note-list read(s) answered from scripts/crm-posts.cache.json; none reached the CRM.
```

**The posts-cache line.** postbuild prints nothing when the list refresh
succeeds; it prints a boxed `CRM UNREACHABLE … Falling back to cached
posts` warning when it fails. That warning appears **0** times in this
build's log. `scripts/crm-posts.cache.json` was rewritten at 22:51:23,
five seconds before `dist/index.html`, and its content was identical to
the committed file. So the list was refreshed from the CRM, and nothing
had changed since `687c696`. The newest slug in it, and the one the card
used, is `q3-2026-the-quarter-where-the-paperwork-started-to-matter`.
Body text grew from 137,690 to 138,056 characters (+366), which is the
card.

```
$ npm run lint
> eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0
lint exit 0
```

## Scope

- `Home.jsx`, plus one new component under `src/components`
  (`pages/Home/LatestNote.jsx`).
- Other files:
  - `src/components/pages/Blog/imageCredit.jsx` (new): the article's
    credit helper, moved unchanged so it can be shared (see above).
  - `src/components/pages/Blog/BlogArticle.jsx`: that move only; its
    pages are byte-identical.
  - `scripts/prerender.mjs`: the list read from the cache (see above).
- `utils/marketNotes.js` (`categoryFor`, `formatNoteDate`) and
  `seo/siteMeta.js` (`safeImage`) are reused unchanged.

## Known gaps and findings

1. **Joseph approves at the merge.** The screenshots above are the
   review.
2. **The card blinks on a real visit** (see "The empty case": React
   replaces the prerendered HTML, then refetches). The index does the
   same. Hydrating instead is its own order.
3. **Finding: the blog index shows 10 of the 11 notes.** `BlogList.jsx`
   calls `getPosts()` with no limit, and the CRM list defaults to
   `limit=10`, so the oldest note never appears in the index. That is out
   of scope here, and the mirror reproduces it faithfully (the index is
   byte-identical). Related: `postbuild.mjs`'s `fetchAllPosts` pages with
   `?page=`, which the CRM ignores (it takes `offset`), and it stops
   after the first page because the response has no `totalPages`. It
   works today because `limit=50` covers all 11 notes, but it would
   silently stop at 50.
4. The thumbnail is the note's full image (110 KB for
   `citation-x-ramp-no_registration.jpg`), shown at 80×64 or 112×80. It is
   `loading="lazy"`. There is no smaller rendition to point at without a
   new asset.
5. Seen in the 1440 screenshot, not mine and unchanged: the header's
   "Contact Us" button is blue on the blue hero and hard to read.
