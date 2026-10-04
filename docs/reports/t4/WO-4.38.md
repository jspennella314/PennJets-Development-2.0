---
wo: WO-4.38
terminal: T4
branch: t4/work
commit: 7762dcc
tested_against: "local worktree of t4/work at 7762dcc: npm run build (dist/ prerendered by the build's Playwright Chromium; bodies from scripts/crm-articles.cache.json, fetched earlier from the production CRM), compared page by page with the build of e905fbf; NoteBody.browser-test.mjs in the same Chromium. No deploy: the site deploys only from main."
date: 2026-09-29
status: reported
---

# WO-4.38 report: the site sanitises a Market Note body before injecting it

## Commit

`7762dcc` on `t4/work`, pushed.

```
$ git show --stat --format= 7762dcc
 package-lock.json                                  |  17 +++
 package.json                                       |   1 +
 .../pages/Blog/NoteBody.browser-test.mjs           | 150 ++++++++++
 src/components/pages/Blog/NoteBody.jsx             |  10 +-
 src/components/pages/Blog/sanitizeNote.js          |  31 +++
```

## 1. The dependency

**`dompurify` `^3.4.16`**, the browser build, which the lead approved in
this order as the site's one new dependency. 3.4.16 is the current release
(`npm view dompurify version` → `3.4.16`), with a caret on major 3. I added
it with `npm install dompurify@^3.4.16 --save`. The lockfile gains two
entries:
- `dompurify` 3.4.16 (MPL-2.0 OR Apache-2.0);
- its optional `@types/trusted-types` 2.0.7, TypeScript types only, with
  no runtime code.

Nothing else in the lockfile moved. The bundle grows from 363.89 kB
(102.37 kB gzip) to 394.17 kB (115.12 kB gzip), **+12.75 kB gzip**.

## 2. The sanitiser and its config

`NoteBody.jsx` now injects `sanitizeNoteHtml(b.html)` in both places that
had `b.html` (`:123` the lede, `:126` every other block). Each block is
sanitised immediately before it is injected, as ordered. That also covers
the top-level text-node block, which `buildBlocks` builds from
`textContent`, and which could otherwise turn escaped markup back into
live markup.

`sanitizeNote.js`, beside it:

```js
ALLOWED_TAGS = ['p','br','hr','h1'…'h6','ul','ol','li','a','strong','b','em','i','u','s',
                'code','pre','blockquote','img','figure','figcaption','span']
ALLOWED_ATTR = ['href','target','rel','title','src','alt','width','height','class']
DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })
```

**This is the CRM's `purifyBlogHtml` in `lib/blogFormatting.ts` on the
CRM's `main`, exactly** (read there, not copied as a file): the same 25
tags, the same 9 attributes, and the same two options.

- **Tables:** not allowed, because the CRM does not allow them. If the
  CRM ever adds them, the site's list needs the same change.
- **Links:** `href` with DOMPurify's default URI rules, which remove
  `javascript:` and other script URLs. `target` and `rel` are allowed, so
  the notes' new-tab links survive.
- **Images:** `src` and `alt`, plus `width`/`height`.
- **Differences from the CRM:** none. The only difference is the build:
  the site uses `dompurify` (browser) where the CRM uses
  `isomorphic-dompurify` (jsdom on the server). The site never sanitises
  without a browser.

## 3. The prerender: unchanged

I built before (`e905fbf`, WO-4.37) and after (`7762dcc`), in my own
checkout, then compared every HTML file in `dist`. Two masks were applied:
- the countdown banner's numbers, which `Header.jsx` bakes in at render
  time, so they differ between any two builds;
- Vite's content-hashed asset names.

```
pages: 28, identical: 28, differ: 0
```

All 11 prerendered note pages are identical, and so is every other page.
As expected, the CRM's bodies are already clean. DOMPurify ran inside the
prerender's Chromium on every note; there was no console error, and the
prerender reported none.

## Tests

**The site has no test runner.** Its only test-capable dependency is
`playwright`, which the prerender uses. There is no vitest or jest, so
"the site's runner" does not exist. Adding one would be a second new
dependency, which this order does not approve. The test therefore uses
what the build already has:

```
node src/components/pages/Blog/NoteBody.browser-test.mjs
```

- Vite's `build` API bundles a harness around **the real `NoteBody.jsx`**,
  twice:
  - as shipped;
  - with `./sanitizeNote` aliased to an identity function, which is
    `NoteBody` as it was before this order.
- Playwright Chromium renders both and compares them.
- It exits 1 on any failure, and writes only to the OS temp directory.

```
PASS  attack: no <script> in the rendered note (found 0)
PASS  attack: no on* attribute (found [])
PASS  attack: no javascript: URL anywhere in the rendered HTML
PASS  attack: the harmless paragraph "ok" still renders
PASS  attack: nothing executed (dialogs: [])
      rendered: <div class="note-body"><p class="note-lede mb-8">ok</p><div></div><div><img src="x"></div><div><a>x</a></div></div>
INFO  before this order the same string rendered 1 on* attribute(s) and 1 javascript: URL(s), and ran 1 dialog(s): ["2"]
PASS  control: the unsanitised NoteBody does render the attack (so the test can fail)
PASS  unchanged: (hand-written real-shaped body) (1135 chars rendered)
PASS  unchanged: why-we-publish-market-notes (1168 chars rendered)
PASS  unchanged: the-light-jet-market-in-2026-why-smaller-business-jets-could-lead-the-next-decade (9874 chars rendered)
PASS  unchanged: pilatus-pc-12-ngx-a-modern-look-at-the-most-capable-turboprop-in-the-sky (5765 chars rendered)
PASS  unchanged: september-11-and-the-evolution-of-private-aviation (5516 chars rendered)
PASS  unchanged: bombardier-us-market-access-and-what-trumps-latest-restrictions-could-mean-for-private-aviation (8046 chars rendered)
PASS  unchanged: how-to-buy-your-first-private-jet-2025-step-by-step-buyers-guide (4305 chars rendered)
PASS  unchanged: sustainable-aviation-the-future-of-private-flying (6809 chars rendered)
PASS  unchanged: the-state-of-the-private-jet-market-in-q3-2025 (5824 chars rendered)
PASS  unchanged: jet-charter-vs-ownership-making-the-right-choice (8767 chars rendered)
PASS  unchanged: canadas-proposed-100-aircraft-expensing-could-it-accelerate-the-aircraft-replacement-cycle (4800 chars rendered)
PASS  unchanged: q3-2026-the-quarter-where-the-paperwork-started-to-matter (7505 chars rendered)

all passed
exit 0
```

- **The attack string** from the order renders with no `script`, no
  `onerror` and no `javascript:`, and nothing runs.
- **The control shows the test can fail.** Without the sanitiser, the
  same string kept `onerror`, which fired (dialog "2"), and kept the
  `javascript:` link.
- **The real-shaped bodies** are rendered identically with and without
  the sanitiser:
  - one hand-written body: p, h2, h3, ul/li, strong, em, a link with
    `target`/`rel`, an entity, a `STAT:` line and a `>` pull quote;
  - all 11 note bodies from `scripts/crm-articles.cache.json`.

## Build

```
$ npm run build            (at 7762dcc)
build exit 0
  ✓ 92 modules transformed.
  dist/assets/index-b8789743.js   394.17 kB │ gzip: 115.12 kB
  ✓ built in 6.74s
  [postbuild] article bodies: 11 from cache, 0 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
  [postbuild] wrote 27 HTML files (11 Market Notes) and sitemap.xml with 26 URLs
  [prerender] 27 of 27 routes rendered in 41.1s, 138,056 characters of body text added
  [prerender] 11 view beacon(s) intercepted; none reached the CRM.
  [prerender] 11 article fetch(es) answered from cache; none reached the CRM, so none wrote a ContentAnalytics row.
  [prerender] 14 note-list read(s) answered from scripts/crm-posts.cache.json; none reached the CRM.

$ npm run lint
> eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0
lint exit 0
```

This build ran in my own checkout. The lead verifies from a
`git archive` in its scratchpad, per `CLAUDE.md`.

## Other `innerHTML` on the site (out of scope; listed)

I searched `src`, `index.html`, `public/*.html` and `scripts/*.mjs` for
`dangerouslySetInnerHTML`, `innerHTML`, `insertAdjacentHTML`,
`document.write` and `outerHTML =`. **The only injection sites are the two
in `NoteBody.jsx`, and both are now sanitised.** `NoteBody.jsx:105` and
`:108` *read* `innerHTML` and `outerHTML` from the parsed body to build
the blocks. They inject nothing.

## Scope

As ordered:
- `NoteBody.jsx`;
- a sanitise helper beside it (`sanitizeNote.js`);
- its test (`NoteBody.browser-test.mjs`, beside it);
- `package.json` and the lockfile (the one dependency).

## Known gaps

1. **No test runner.** The test is a node script, not part of `npm run
   build` or `npm run lint`, and nothing runs it automatically. Adding a
   runner (vitest) or a `test` script is a decision for the lead: the
   runner would be a new dependency.
2. **Without a DOM, the helper throws rather than passing HTML through.**
   The browser build of DOMPurify has no `sanitize` function in Node
   (`isSupported false, typeof sanitize undefined`, checked). `NoteBody`
   has a branch for no `window` that returns the raw body as one block.
   So that path now throws instead of injecting unsanitised HTML. Nothing
   takes that path today, because the site is client-rendered and the
   prerender uses Chromium. If the site ever renders on a server, it will
   fail loudly, not silently.
3. **The script-bearing block leaves an empty `<div></div>`** in the
   rendered attack output, because the `<script>` was its whole block. It
   is harmless and invisible.

## End of the overnight queue (2026-09-29)

**Finished, reported and pushed on `t4/work`:**
- **WO-4.36** (`9359838`, report `38de4de`). This also closes WO-4.34.
  The cache files are committed in `c2ba93b` and `687c696`.
- **WO-4.37** (`e905fbf`, report `648e669`). Joseph approves at the
  merge; the screenshots are in the report.
- **WO-4.38** (`7762dcc`, this report).

**Skipped:** none. **Stopped on:** nothing. There was no denied command,
no failure outside my changes, no schema or env need, and nothing touched
a live account.

**Left for Joseph:**
1. **Merge `t4/work` into the site's `main`.** That merge also carries
   WO-4.35, which is still waiting. `t4/work` is 12 commits ahead of
   `origin/main` (`a450f6a`), from `e3a91a0` (WO-4.34) to `caca2a7`.
   Pages deploys the merge.
2. At that merge:
   - **WO-4.37's look**, at both widths;
   - **WO-4.36's proposed removal** of the whole "Quick Response" card.
3. **For the lead, not Joseph:**
   - WO-4.37's finding that the blog index shows 10 of 11 notes;
   - WO-4.38's missing test runner.
