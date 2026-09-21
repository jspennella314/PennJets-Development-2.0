---
wo: WO-4.23
terminal: T4
branch: t4/work
commit: dc25a68
tested_against: "site: the built output at dc25a68, produced by the full build (vite build, postbuild.mjs, prerender.mjs) with Market Notes read live from https://www.pennforce.pennjets.com, and served locally for the JavaScript-disabled checks — NOT a production deploy, see Known gaps"
date: 2026-09-20
status: reported
---

# WO-4.23 report — page bodies are rendered at build time

Every route now ships its content in the HTML. The site went from almost no
body text to **122,200 characters** of it. A crawler that does not run
JavaScript, which is most of them other than Google, now receives the article
rather than a title and an empty shell.

Built as proposed and approved by Joseph. The interesting part of the work was
not making it render; that took an afternoon. It was the three things that
went wrong on the way, each of which would have published something worse than
what is there now.

## Commit

`dc25a68` WO-4.23: render page bodies at build time. On `t4/work`, pushed.
Not merged.

## Route evidence

### The headline number

| Route | Body characters before | after |
|---|---|---|
| `/charter` | 0 | **3,660** |
| `/about` | 0 | **2,627** |
| `/privacy-policy` | 0 | **5,543** |
| `/blog` | 0 | **6,487** |
| `why-we-publish-market-notes` | 0 (a 170-character stub) | **3,322** |
| `the-light-jet-market-in-2026` | 0 (a 362-character stub) | **10,951** |
| `jet-charter-vs-ownership` | 0 (a 335-character stub) | **10,892** |

Across 25 routes: **0 to 122,200 characters.** `404.html` is excluded by name
and stays at zero, because its body is the deep-link redirect script and
overwriting it would break every shared link on the site.

**On the two "before" numbers for notes.** My proposal reported the note
baseline as 170 to 620 characters, counting the `<noscript>` stub postbuild
writes. That stub is a headline, the meta description and a link, and it is
invisible to anything that runs scripts. Measured as a crawler with JavaScript
reads it, every route started at zero. Both numbers are honest; this table
gives the app-content one, which is the number the change is about.

### With JavaScript disabled

Chromium, `javaScriptEnabled: false`, against the built output.

| | `/charter` | `the-light-jet-market-in-2026` |
|---|---|---|
| Title | Private Jet Charter Quotes \| PennJets | Light Jet Market 2026: Prices, Demand & Outlook \| Penn Jets |
| `<h1>` | Charter, Simplified. | The Light Jet Market in 2026: Why Smaller Business Jets Could Lead the Next Decade |
| Body characters | 3,660 | 10,947 |
| Paragraphs | 14 | 51 |
| Links | 37 | 34 |
| Canonical | correct | correct |

Screenshots taken at 1280 wide. The note renders its category, date, read time,
byline with photo and title, featured image and full article body with no
scripting at all.

### The head survived, and how that is guaranteed

Not by checking afterwards. The head written out **is** postbuild's head, plus
only those slots a page fills that postbuild never wrote. A rendered tag cannot
overwrite a built one.

| Route | title | canonical | og:image | author | duplicate meta |
|---|---|---|---|---|---|
| `/charter` | intact | intact | og-card.png | absent, correct | none |
| light jet note | intact | intact | its own image | Joseph Pennella | none |
| Bombardier note | intact | intact | **og-card.png** | Joseph Pennella | none |

That last row is the reason the merge exists rather than a post-hoc assertion.
`Bombardier_Challenger_650.jpg` is set as that note's featured image in the CRM
and **is not a file this repository ships**. postbuild checks the filesystem
and substitutes the default card, which is WO-4.16. The running app cannot
check the filesystem, so it sets `og:image` to a path that 404s. Taking the
rendered head wholesale republished a broken social preview on two notes.

Head tag counts moved from 22 to 20 on static routes and from 24 to 23 or 24 on
notes. **That is the meta fix below, not a WO-4.7 regression**: two tags left
`index.html`, and notes gained an author and, where they have tags, keywords.

### The view beacon

```
[prerender] 9 view beacon(s) intercepted; none reached the CRM.
```

One per Market Note, on every build. In the proposal spike these were blocked
only because the CRM's CORS allow-list rejects `localhost` — a setting in the
PennForce repository, not this one, which would have admitted every build-time
hit the moment a prerender ran from an allowed origin. They are now intercepted
and answered locally by the prerenderer, so the block does not depend on
somebody else's configuration. Without it, every deploy would have added nine
phantom views to the numbers Joseph uses to decide what to write next.

### With the CRM unreachable

```
$ VITE_CRM_API_URL=https://crm-that-does-not-exist.invalid npm run build
[postbuild] CRM UNREACHABLE (fetch failed).
[postbuild] Falling back to 9 cached post(s) from scripts/crm-posts.cache.json.
[postbuild] Market Note pages will be as of the last successful build, not current.
[prerender] 16 of 25 routes rendered
[prerender] FAILED: 9 route(s) left as postbuild wrote them:
  ...: rendered page does not contain its headline "Why We Publish Market Notes"
build exit: 1
```

Static routes still prerender. Every note keeps the page postbuild wrote, with
its head and its stub. The build fails loudly rather than publishing.

Before this order, the same outage exited 0 and shipped a site with **no Market
Note pages at all** and a sitemap missing all nine, because both were built
from an array a warning had quietly left empty.

## Data evidence

n/a. No data was written. Nine view beacons were attempted by the pages being
rendered and all nine were intercepted before leaving the machine.

## Build

```
> vite build && node scripts/postbuild.mjs && node scripts/prerender.mjs
✓ built in 2.62s
[prerender] 25 of 25 routes rendered in 33.1s, 122,200 characters of body text added
[prerender] 9 view beacon(s) intercepted; none reached the CRM.
exit=0  total=38058 ms
```

| | Before | After |
|---|---|---|
| Build time | 7.3s, 9.7s, 9.1s | **about 38s** |
| Console errors during render | n/a | **none** |
| Hydration warnings | n/a | **none** |

`npm run lint` passes with `--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give. The
prerender stage is self-checking: it refuses to write and fails the build on a
lost head tag, a duplicate meta slot, a body that did not grow, or a page
missing its own headline.

## Three things that went wrong, and what they cost

Each of these was caught by a guard rather than by review, which is the part
worth keeping.

**1. Concurrency scrambled the heads.** Rendering four pages at once in a
shared browser context returned head tags belonging to other routes: a Market
Note came back carrying the Market Notes index title, description and default
og card, and lost its `article:published_time`. Body text was correct on every
page every time. Serially the same 25 routes are clean. **I have not
established the cause**, so rendering is one page at a time and the build takes
35 seconds instead of 15. Raising `PRERENDER_CONCURRENCY` needs the cause found
first, and the constant says so.

**2. A length check published nine tombstones.** With the CRM unreachable,
`BlogArticle` renders "Note Not Found. That Market Note doesn't exist or has
been removed." at 1,153 characters, which is **longer** than the stub it would
replace, so "only overwrite when the body grew" happily wrote it. Nine
published articles would have deployed as tombstones. The fix is to require the
rendered page to contain the headline postbuild took from the CRM.

**3. That headline check passed anyway, on the tombstone.** The `<noscript>`
stub survives in the DOM through the render, and its text contains the
headline, so the page "contained" its own title while displaying Note Not
Found. Body text is now measured with `<noscript>` stripped: app content
compared against app content.

## Scope

```
scripts/prerender.mjs                       new, the stage
scripts/postbuild.mjs                       CRM cache fallback; header comment
scripts/crm-posts.cache.json                new, committed, the fallback data
package.json                                build runs the stage; build:nopre added
.github/workflows/deploy.yml                installs Chromium before building
index.html                                  static keywords and author removed
src/components/pages/Blog/BlogArticle.jsx   no empty keywords tag
docs/reports/t4/WO-4.23.md                  this report
```

All within `PennJets-Development-2.0`. Nothing in the PennForce repository was
written.

## Two things carried in from the proposal

Both were questions in the proposal and both are fixed here, because
prerendering would have published them rather than left them in the DOM.

**Duplicate meta tags.** Every note page served two `author` and two `keywords`
tags, one of the keywords empty, because `index.html` set statically what
Helmet also sets per route and Helmet cannot replace a tag it does not own.
Both statics are gone; Helmet owns them. The `keywords` tag was not replaced by
anything, since Google stopped using it for ranking in 2009.

**The silent CRM failure.** `postbuild.mjs` now writes every successful fetch
to `scripts/crm-posts.cache.json`, falls back to it loudly when the CRM is
unreachable, and exits 1 if there is no cache either.

## It broke the deploy, on the first merge

**PR #2 merged on 2026-09-21 and failed to deploy.** Run 35562421317, step
"Install Chromium for the prerender stage". Production kept serving the build
from PR #1, fourteen hours earlier, and gh-pages did not move. Twenty commits
sat undeployed, including everything in this report.

**Cause: the workflow pins Node 18 and playwright 1.63 declares
.**  does not enforce engines, so the
dependency installed cleanly and the CLI refused to run. It passed here
because this machine is on Node 22. I added that step and did not check the
runner's Node against the package I was adding to it.

Fixed in , two ways:

- **Node 20 in the workflow.** That is the actual bug.
- **The prerender no longer takes a deploy down when the browser will not
  start.** It prints a banner and exits 0, leaving every route with the head
  postbuild.mjs wrote, which is what the site served before this order. The
  install step is  to match.

A content problem still fails the build, and that distinction is the point: a
note that rendered as "Note Not Found" must stop a deploy, a browser download
that 404s must not. Verified by building with 
pointed at an empty directory: exit 0, 25 heads intact, 9 note pages, 24
sitemap URLs, no prerendered bodies.

**The honest lesson.** This report already said the approach cost "one dev
dependency and a browser in CI" and treated that as cheap. It was not cheap
on the day it landed: it put a browser download on the critical path of every
deploy of a site whose deploys had never depended on one.

## Known gaps

1. **Not verified on a production deploy.** T4 does not merge. Everything above
   is the built output at `dc25a68`, served locally.

2. **The repaint is unmeasured.** The proposal named this as the cost of the
   approach: the app boots with `createRoot`, which discards the prerendered
   DOM and renders again, so a visitor may see a brief replacement of identical
   content. The measurement plan asked for that gap as a number on a throttled
   connection and **I have not produced it.** It needs a deployed page to be
   worth measuring, and it is the one number in the plan that is missing.

3. **The countdown banner is frozen at build time.** "Calendar Year Ending: 102
   Days 01 Hours" is now baked into every page and corrected the moment scripts
   run. Harmless to a reader, wrong to a crawler reading the static HTML, and
   worth knowing before someone reports it as a bug.

4. **Concurrency is disabled on an unexplained failure**, which is the honest
   thing to do and not the finished thing. 23 seconds of every build are
   waiting for pages to render one at a time.

5. **Two notes reference images this repository does not ship**,
   `Bombardier_Challenger_650.jpg` and `gulfstream.jpg`. postbuild has warned
   about them since WO-4.16 and substitutes the default card, which still
   works. They are CRM content and Joseph's to fix, and they are the reason the
   head merge is built the way it is.
