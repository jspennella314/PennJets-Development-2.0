# WO-4.23 — proposal: render page bodies at build time

**Stage one only. No implementation. For the lead.**

Queued for relaying to `docs/orders/t4/`. Everything below is measured against
the built output at commit `230c5de`, with the CRM live. Nothing in the
repository was changed to produce it; the spike ran from the scratchpad and
wrote nothing.

---

## The short version

I propose **prerendering the existing build with a headless browser**, as a
third stage after `vite build` and `postbuild.mjs`. It costs about **75
seconds of build time** and one dev dependency, and **`postbuild.mjs` survives
completely unchanged**.

I recommend it over server-side rendering for one reason that decides the whole
order: **a browser fetches each Market Note's body itself.** Server-side
rendering cannot, because the fetch lives in an effect, so SSR would need
initial-state plumbing through `BlogArticle` and a serialized payload in every
note page. The browser approach needs none of that, and the note bodies are
the pages this project exists to distribute.

The cost I would not hide: prerendered markup is for crawlers and first paint,
**not** for hydration. See "The one real cost" below.

---

## 1. The baseline, measured

The lead measured `dist/charter.html` at 16 head tags and zero body characters.
Across all 26 built files:

| Route type | Files | Body text characters | Head tags |
|---|---|---|---|
| Static routes | 16 | **0** | 22 each |
| Market Notes | 9 | **170 to 620** | 24 each |
| `404.html` | 1 | 0 | 2 |

**A correction to the order's premise, in the site's favour.** The order says
"every route is the same". Market Notes are not quite at zero: `postbuild.mjs`
already writes a `<noscript>` stub into each one.

```html
<noscript><article><h1>Why We Publish Market Notes</h1>
<p>Why Penn Jets publishes notes on the private aviation market, and what
informs them.</p><p><a href="...">...</a></p></article></noscript>
```

That is a headline, the meta description, and a link. It is not the article.
The 9,323-character light jet note ships 362 characters of body. So the gap is
real and the order's conclusion stands, but the number for notes is "a
headline" rather than "nothing", and I would rather the lead had the right
baseline.

Current build time, three consecutive runs: **7.3s, 9.7s, 9.1s.**

---

## 2. The approach, and what it costs

### What I propose

A third stage, `scripts/prerender.mjs`, run after `postbuild.mjs`:

1. Serve `dist/` on a local port.
2. Open each of the 26 routes in headless Chromium, wait for the network to go
   idle.
3. Capture `document.documentElement.outerHTML`.
4. Write it back over the file `postbuild.mjs` produced.

### Why this one

| | Headless prerender | SSR with `react-dom/server` | Migrate to a Vite SSG framework |
|---|---|---|---|
| Market Note bodies | **free, the page fetches its own** | needs initial-state plumbing into `BlogArticle` | same plumbing |
| `postbuild.mjs` | **survives whole, 170 lines** | head generation would move into the render | mostly replaced |
| App code changes | **none** | SSR entry, `StaticRouter`, `hydrateRoot`, guards for browser globals | the build, the entry, the routing |
| New dependencies | one dev dependency plus a browser in CI | none at runtime | a framework |
| Build time added | **about 75s** | a few seconds | a few seconds |
| Risk concentrated in | build duration and CI | hydration mismatches | the migration itself |

Server-side rendering is the better-engineered answer and I am not pretending
otherwise. It is faster, it has no browser dependency, and it produces markup
React can hydrate. **I am not proposing it because of where the Market Note
bodies live.** They arrive in a `useEffect`, which `renderToString` never runs,
so SSR delivers exactly the static pages and leaves the nine pages that matter
most still empty, unless the order also funds initial-state plumbing through
the article component and a serialized payload in every note page. That is a
larger change to application code than this order asks for, and it is the part
most likely to go wrong quietly.

### The thing that would actually bite SSR

Ten files touch a browser global. **None does so at module scope**, so
nothing explodes on import, and in most of them the use sits inside an event
handler that never runs during a render: `Contact.jsx` reads
`window.location` when the form is submitted, `Gallery.jsx` when a link is
copied.

`NoteBody.jsx` is the exception, and it is the component that renders every
Market Note body. It already carries a guard for exactly this case:

```js
function buildBlocks(html) {
  if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
    return [{ kind: 'raw', html }];
  }
  const doc = new window.DOMParser().parseFromString(html, ...)
```

So under SSR a note body renders as one raw block: readable text, but with
none of the pull quotes or sourced-statistic blocks WO-4.10 built, because
those are promoted by walking a parsed DOM. The browser would then promote
them on hydration.

**That is a hydration mismatch by construction**, on exactly the nine pages
this order is about. It is fixable, by parsing with something that runs
outside a browser, but it is another piece of work SSR needs and the browser
approach does not: real Chromium has `DOMParser`, so what gets captured is
the promoted version a reader actually sees.

### What it costs, measured

The spike ran four representative routes end to end:

| Route | Body chars before | after | Time |
|---|---|---|---|
| `/charter` | 0 | **3,648** | 3.3s |
| `/about` | 0 | **3,028** | 2.6s |
| `/blog/why-we-publish-market-notes` | 170 | **3,481** | 3.1s |
| `/blog/the-light-jet-market-in-2026...` | 362 | **11,302** | 3.0s |

**About 3 seconds per route, serially.** 26 routes is roughly 78 seconds, on
top of a 9-second build. Four pages in parallel should bring it near 25
seconds; I have not measured that and would not promise it.

Page weight grows: `/charter` goes from 3,385 bytes to 24,066. That is the
point of the exercise, and it gzips well, but it is a real transfer increase
on every page and belongs in the measurement plan.

Dependency cost: `playwright` as a dev dependency, plus
`npx playwright install chromium` in the deploy workflow. The deploy currently
does `npm ci`, `npm run build`, copy `CNAME`, publish. This adds one step and
a browser download, cached between runs.

### The one real cost, stated plainly

**The prerendered markup cannot be hydrated, and I would not try.** The app
boots with `createRoot`, which discards whatever is inside `<div id="root">`
and renders again. So a visitor sees the prerendered page, then React replaces
it with an identical tree.

Switching to `hydrateRoot` would be worse, not better: the captured HTML is
post-effect, including a fetched article body, and React's first hydration
render happens before effects run. Every note page would mismatch.

So the honest framing is that this buys **crawlability and first paint**, not
a faster interactive page. Whether that repaint is visible is the one thing in
this proposal I cannot answer from the spike, and it is first in the
measurement plan.

---

## 3. Market Notes, which the order calls the real decision

### The coupling already exists

The order says prerendering notes "couples a site build to the CRM being up".
**It is already coupled.** `postbuild.mjs` fetches every post from
`/api/public/blog` at build time to write the per-route head and the sitemap.

So prerendering adds no new dependency. It deepens an existing one by nine
requests. Measured just now:

| | |
|---|---|
| List fetch | 343 ms |
| Nine detail fetches, in parallel | 1,231 ms |
| Total article HTML | 52,752 characters |

The list endpoint carries `excerpt` but no `content`, so bodies need one
request per note. Under the browser approach those requests happen inside the
page and cost nothing extra to arrange.

### The failure mode, which is worse today than the order assumes

This is the part I would ask the lead to look at first, because it is a live
defect and not a consequence of this proposal.

```js
try {
  posts = await fetchAllPosts();
} catch (err) {
  console.warn(`[postbuild] CRM fetch failed (${err.message}); article pages skipped.`);
}
```

**A build with the CRM unreachable exits 0 and publishes a site with no Market
Note pages at all.** No per-route head, no og cards, and `sitemap.xml` silently
drops all nine note URLs, because the sitemap is built from the same `posts`
array. A warning scrolls past in the deploy log and the deploy succeeds.

The notes remain reachable by humans, because `404.html` routes deep links back
into the app and the article fetches itself. The damage is entirely to what
crawlers and previews see, which is the thing this order exists to fix.

**My proposal: fix that before prerendering, not after.** Two options for the
lead:

- **Fail the build.** Simple, and correct if a deploy should never ship a
  degraded site. It also means the CRM being down blocks all site deploys,
  including ones that have nothing to do with the blog.
- **Cache the last good result.** Write the fetched posts to a committed or
  cached manifest, reuse it when the CRM is unreachable, and warn loudly.
  Deploys keep working, the pages stay crawlable, and staleness is visible.

I lean to the cache, with a build failure only if there is no cache either. It
keeps an unrelated deploy from being held hostage by CRM downtime, which is
the case the first option handles badly.

Under prerendering the same question returns per page: if a note's fetch fails
in the browser, the capture would bake in an error or an empty article. **The
prerenderer must refuse to overwrite a file when the rendered body is shorter
than the `<noscript>` stub it would replace.** That check costs nothing and
makes the failure mode "yesterday's page survives" rather than "today's page is
blank".

### A new note is invisible until the next build, and still would be

Publishing a note in the CRM does not create `dist/blog/<slug>.html`. Until the
site is rebuilt the note is reachable and readable by a person, and invisible
to a crawler. Prerendering does not change that, and I am not proposing a
rebuild trigger, which would be a CRM-side change and outside this order. Worth
the lead knowing it stays true.

### The view beacon fires during prerender

The spike logged this on both note routes:

```
Access to fetch at '.../api/public/blog/<slug>/view' ... blocked by CORS
```

**Loading a Market Note in the prerenderer posts a view beacon.** It is blocked
today only because CORS allows exactly the two `pennjets.com` origins and the
prerenderer ran on `localhost`. That is luck, not design: it depends on a
setting in the other repository that this order does not control.

Every build would otherwise add nine phantom views, on every deploy, to the
numbers Joseph uses to decide what to write next.

**The prerenderer must suppress the beacon explicitly** rather than rely on the
origin check. Blocking the request route in the browser context is the cheapest
way and needs no application change. Flagged as an integration point the lead
audits.

---

## 4. The runtime `PageMeta` path, and whether the two can disagree

**They already disagree, on every Market Note, today.**

`PageMeta` renders Helmet tags for the current route, and `BlogArticle` renders
its own Helmet block further down. Neither knows about the tags `postbuild.mjs`
wrote, because those are not Helmet-managed. Helmet replaces what it owns and
appends what it does not recognise.

The spike diffed the head of `/blog/why-we-publish-market-notes` before and
after rendering, ignoring self-closing-tag normalisation:

| | Served HTML | After render |
|---|---|---|
| `<title>` | 1 | 1, identical |
| `rel="canonical"` | 1 | 1 |
| `og:title` | 1 | 1 |
| `description` | 1 | 1 |
| **`name="keywords"`** | 1 | **2** |
| **`name="author"`** | 1 | **2** |

The two additions:

```html
<meta name="keywords" content="">
<meta name="author" content="Joseph Pennella">
```

`index.html` ships a site-wide `keywords` and `author` of "PennJets".
`BlogArticle.jsx:136` adds its own `keywords` from the note's tags, which is
**empty** for any note without tags, and `:137` adds the real author. So a
crawler rendering a note page today sees two `author` values and two
`keywords`, one of them blank.

**Static routes are clean.** `/charter` and `/about` measured 22 head tags
before and 22 after, with no duplication: `PageMeta` only emits tags
`postbuild.mjs` also writes, and Helmet replaces them in place.

Prerendering does not cause this. It **bakes it into the served HTML**, which
is what makes it worth fixing first. Three lines of work:

1. Drop the empty `keywords` when a note has no tags.
2. Decide whether `author` is the note's author or the site, and emit one.
3. Ideally, remove the static `keywords` and `author` from `index.html` so
   Helmet owns both. `keywords` has had no effect on Google's ranking for
   years; the simplest fix is deleting it entirely.

**This is the answer to the order's question 3: yes, they can disagree, they
do, and prerendering is what turns a browser-only wart into published markup.**
I would want it closed before, not after.

---

## 5. Measurement plan

What "it works" looks like, as numbers.

### The headline number

| Route | Now | Target |
|---|---|---|
| `/charter` | 0 body characters | **> 3,000** |
| A static route of the lead's choosing | 0 | **> 2,000** |
| `why-we-publish-market-notes` | 170 | **> 3,000** |
| `the-light-jet-market-in-2026...` | 362 | **> 11,000** |

Measured by the same script that produced the baseline table, so before and
after are the same measurement.

### The gates, each of which can fail the change

| Check | Passing looks like |
|---|---|
| Head preserved | Every route: same tag count, same `<title>`, exactly one canonical, one `og:title`, one `description`. WO-4.7 intact. |
| No new duplicates | No `name=` or `property=` appearing twice in any built head. Note pages must be at zero, which means fixing section 4 first. |
| JavaScript disabled | `/charter` and one Market Note render readable content with scripting off, screenshotted. |
| Console | No errors and no hydration warnings on those routes, **with the beacon suppressed**, so the CORS noise the spike saw is gone rather than tolerated. |
| Beacon | Zero `/view` requests during a full build, asserted from the browser's own request log, not inferred from CORS. |
| Repaint | The gap between prerendered paint and React's replacement, measured on a throttled connection. This is the cost of the approach and should be a number. |
| CRM down | Build with the CRM blocked: no page loses content it had, the sitemap keeps all nine notes, and the build says loudly what it did. |
| Build time | Before and after, three runs each. |
| Transfer | `/charter` and one note, before and after, gzipped. |

### What I would not claim

Search rankings. This makes the pages readable by things that do not run
JavaScript. Whether that moves any position is not measurable on this
timescale, and the order is right to scope it to delivery rather than outcome.

---

## What I need from the lead

1. **Approach**: headless prerender as proposed, or SSR with the initial-state
   plumbing costed as part of it?
2. **Section 3's silent failure** — fail the build, or cache the last good
   fetch? I lean to the cache. This is worth fixing whatever is decided about
   prerendering.
3. **Section 4's duplicate meta tags** — can I fix these as part of this order,
   or should they be their own? They are three lines and they are wrong today.
4. **The beacon** is an integration point. Suppressing it in the prerenderer is
   a site change I can make, but the lead audits that boundary and should say
   so explicitly.

Nothing is being built. I am carrying on down the queue.
