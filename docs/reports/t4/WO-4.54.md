---
wo: WO-4.54
terminal: T4
model: claude-opus-5-5
tested_against: Part 1, local build of t4/pr-4.54-stub (5a0ceae + 4f6ef5e) on main 818ab32 via vite preview :4174, and the CRM list route read live once; Part 3, local build of t4/wo-4.54-p3 (39525f7 + 2ccb77b), the CRM list route live at build time; Part 2, local build of t4/wo-4.54-p2 (e163143) via vite preview :4174 with previousSlugs and redirectTo live on the CRM
status: done. Part 1 live (PR #16); Parts 3 and 2 on t4/work (3b1a90c, 8a29d36); one tag beyond Part 1's shape for the lead (the query-string script)
---

# WO-4.54 — report

The order was read from the CRM repo's local `main` (`81a5b10`), which
is 6 commits ahead of `origin/main` and waiting on Joseph's push. Joseph
told this terminal to take it ("WO-4.54 Part 1 first, PR today").

## Part 1 — the hand-written stub (done)

**Branch `t4/pr-4.54-stub`**, cut from site `main` `818ab32`, so the PR
carries only this work and not t4/work's WO-4.53 draft:

- `5a0ceae`: the stub, and the prerender skip below.
- `4f6ef5e`: the cache refresh, in its own commit.

**Before.** The live old URL answered `404`, read at build time:
`curl -o /dev/null -w "%{http_code}" https://www.pennjets.com/blog/title-dassault-falcon-900b-for-sale-2026-market-study`.

### The file

`public/blog/title-dassault-falcon-900b-for-sale-2026-market-study.html`:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Dassault Falcon 900B for Sale: 2026 Market Study</title>
<meta http-equiv="refresh" content="0; url=https://www.pennjets.com/blog/dassault-falcon-900b-for-sale-2026-market-study">
<link rel="canonical" href="https://www.pennjets.com/blog/dassault-falcon-900b-for-sale-2026-market-study">
</head>
<body>
<p>This note has moved: <a href="https://www.pennjets.com/blog/dassault-falcon-900b-for-sale-2026-market-study">https://www.pennjets.com/blog/dassault-falcon-900b-for-sale-2026-market-study</a></p>
</body>
</html>
```

- The `<title>` is the note's `title` from the CRM list. It has no brand
  suffix, because Part 3 decides that form.
- It has no `noindex`, and it is not in the sitemap.
- It adds nothing beyond the order's list except the doctype, the
  charset and `lang`.

### One change the order did not name: `scripts/prerender.mjs`

Without this change, the build would have overwritten the stub.
Prerender renders **every** `.html` in `dist` except `404.html`.

Rendering the stub means:

1. Chromium follows the refresh.
2. The note renders at its new URL.
3. That body is longer than the stub's, so the "never thinner" guard
   passes.
4. The stub has no noscript headline, so the headline guard has nothing
   to check.

The stub would have been replaced by the full note at the old address.
That fails "byte for byte", and the old URL would serve a duplicate page
with the canonical lost in the merge.

The fix: a file whose HTML has `<meta http-equiv="refresh"` is left as
written, and the build logs it. Part 2's template stubs need the same
rule, so it stays when the hand-written file is deleted.

### Build

`npm run build`: exit 0, about 75 seconds.

```
✓ built in 21.54s
[postbuild] wrote data/market-notes.json: 19 note(s), 20,542 bytes
[postbuild] article bodies: 0 from cache, 19 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
[postbuild] wrote 35 HTML files (19 Market Notes) and sitemap.xml with 34 URLs
[prerender] 1 redirect stub(s) left as written: /blog/title-dassault-falcon-900b-for-sale-2026-market-study
[prerender] 35 of 35 routes rendered in 50.9s, 197,659 characters of body text added
[prerender] 19 article fetch(es) answered from cache; none reached the CRM, so none wrote a ContentAnalytics row.
```

**The 19 fetches.** The cached bodies on `main` were last refreshed
around 10-21, past the 7-day `MAX_AGE`, so every body was refetched
once. That is 19 ContentAnalytics rows from this build. The refreshed
cache (`4f6ef5e`) brings steady-state builds back to zero. It also adds
two notes: the Falcon 900B Market Study and the 10-23 dealer-deals note.

### Checks on `dist`

```
$ ls dist/blog | grep -E "title-|falcon-900b"
dassault-falcon-900b-for-sale-2026-market-study.html
title-dassault-falcon-900b-for-sale-2026-market-study.html
$ cmp public/blog/title-….html dist/blog/title-….html && echo BYTE-IDENTICAL
BYTE-IDENTICAL
$ grep -c title-dassault dist/sitemap.xml        → 0
$ grep -c dassault-falcon-900b dist/sitemap.xml  → 1
```

The real note, `dist/blog/dassault-falcon-900b-for-sale-2026-market-study.html`:

- It was prerendered like every other note (33,277 bytes) and has no
  refresh.
- Its head:

```
<title data-rh="true">Dassault Falcon 900B for Sale: 2026 Market Study | Penn Jets</title>
<link data-rh="true" rel="canonical" href="https://www.pennjets.com/blog/dassault-falcon-900b-for-sale-2026-market-study">
<meta data-rh="true" property="og:title" content="Dassault Falcon 900B for Sale: 2026 Market Study | Penn Jets">
```

### The refresh, followed by a browser

Playwright loaded the stub from the preview. Two routes were registered
before the page opened:

- the CRM host;
- `https://www.pennjets.com/**`, so the redirect landed on a local stub
  page, not the live site.

```json
{ "stubStatus": 200,
  "landedOn": "https://www.pennjets.com/blog/dassault-falcon-900b-for-sale-2026-market-study",
  "live": ["https://www.pennjets.com/blog/dassault-falcon-900b-for-sale-2026-market-study"],
  "crm": [] }
```

### Lint and tests

- `npx eslint scripts/prerender.mjs`: exit 0.
- No test covers `prerender.mjs` or `public/`, so no touched-file test
  exists.
- The full suite was not run, because T1 (WO-1.37) is the other active
  builder. The lead's audit build is the evidence.
- The preview was stopped afterwards; node.exe count is 0.

### Line endings

Git stores the stub with LF. Pages builds on Linux from the repository,
so the deployed file is the LF file that `cmp` checked here.

### Still to do

- Joseph merges the PR.
- The lead reads the live URL after the merge: 200, the refresh, the
  canonical, the link.

Part 1 has been live since 2026-10-28 17:26 UTC (PR #16, `9908dfb`).
The lead read it live.

## Part 2 — the mechanism (done)

On `t4/work` at `8a29d36`, cherry-picked from `t4/wo-4.54-p2` `e163143` so that WO-4.56 lands after Parts 2 and 3 and ahead of WO-4.55, as the lead ordered on 2026-10-29. No pushed history was rewritten. `t4/wo-4.54-p2` (built on `t4/wo-4.55`) is superseded. The Part 1 file is deleted in the same commit.
The Part 1 file is deleted in the same commit.

### When WO-1.37 went live

- **Earlier on 2026-10-29**, the live list had no `previousSlugs`, and
  the single route answered the old slug with `404`. Part 2 was held.
- **At WO-4.55's build the same day**, the list carried `previousSlugs`
  on every note: the Falcon note's is
  `["title-dassault-falcon-900b-for-sale-2026-market-study"]`, and the
  other 18 are `[]`. The refreshed cache is `6674f7c`, on
  `t4/wo-4.55`.
- **The single route** now answers the old slug with `200`, the note
  and `redirectTo: "/blog/dassault-falcon-900b-for-sale-2026-market-study"`.

**One stray ContentAnalytics row is mine.** I checked that last point
with a `curl` GET on the single route, and every GET there writes a
ContentAnalytics row. The Falcon note's view count is one higher for
it. The list route would have answered the question without that.

### What changed

| File | Change |
|---|---|
| `src/seo/redirectStub.js` (new) | The one template, `redirectStubHtml({ title, slug })`. `redirectStubs(posts)` returns one stub per `previousSlugs` entry and the reason for any it refuses: a former slug that is a live note's slug (the live page wins), one that is not a plain slug (`^[a-z0-9][a-z0-9-]*$`, since it becomes a file path), or one listed twice. |
| `scripts/postbuild.mjs` | `previousSlugs` joins `INDEX_FIELDS`, so it reaches `data/market-notes.json`. After the article pages, it writes `dist/blog/<old>.html` for each stub, logs the count, and warns on each refusal. Stubs are not counted with the HTML pages and never enter the sitemap. |
| `src/components/pages/Blog/BlogArticle.jsx` | A response carrying `redirectTo` calls `navigate(redirectTo + location.search + location.hash, { replace: true })` and renders nothing. "Note Not Found" stays for a real 404. `transformPost` spreads the post, so `redirectTo` arrives without a change under `src/services/`. |
| `public/blog/title-…html` | Deleted. The template now writes that path. |
| `scripts/prerender.mjs` | No change. Part 1's skip ("a file with a refresh is left as written") covers every template stub. |

### One tag beyond Part 1's shape, for the lead: the query string

`CLAUDE.md`: "The site must preserve those query parameters [utm_*]
through any redirect or router transition until the beacon has read
them."

- **The problem.** The three social posts of 2026-10-28 link to the old
  URL with `?utm_source=…`. A meta refresh to a fixed URL drops the
  query, so **the live Part 1 stub loses that attribution today**.
- **The fix.** The template puts one script before the refresh:
  `location.replace("<new URL>" + location.search + location.hash)`.
- **What stays the same.** The refresh, the canonical, the title and
  the link are as Part 1 had them. A reader without scripts still gets
  the refresh, but without the query, which is the same limit as Part 1.
- **The SPA redirect** keeps the query and the hash the same way.

Say if the order meant Part 1's shape strictly; dropping the script
costs the attribution.

### The two heads

Part 1, hand-written, from `public/`:

```html
<head>
<meta charset="utf-8">
<title>Dassault Falcon 900B for Sale: 2026 Market Study</title>
<meta http-equiv="refresh" content="0; url=https://www.pennjets.com/blog/dassault-falcon-900b-for-sale-2026-market-study">
<link rel="canonical" href="https://www.pennjets.com/blog/dassault-falcon-900b-for-sale-2026-market-study">
</head>
```

Part 2, from the template, in `dist/blog/title-…html`:

```html
<head>
<meta charset="utf-8">
<title>Dassault Falcon 900B for Sale: 2026 Market Study</title>
<script>location.replace("https://www.pennjets.com/blog/dassault-falcon-900b-for-sale-2026-market-study" + location.search + location.hash);</script>
<meta http-equiv="refresh" content="0; url=https://www.pennjets.com/blog/dassault-falcon-900b-for-sale-2026-market-study">
<link rel="canonical" href="https://www.pennjets.com/blog/dassault-falcon-900b-for-sale-2026-market-study">
</head>
```

`diff --strip-trailing-cr` of the two whole files prints one line, the
added `<script>` (`5a6`). The body is identical.

### Build (`npm run build`, exit 0)

```
[postbuild] wrote data/market-notes.json: 19 note(s), 21,471 bytes
[postbuild] article bodies: 19 from cache, 0 fetched
[postbuild] wrote 1 redirect stub(s): /blog/title-dassault-falcon-900b-for-sale-2026-market-study -> /blog/dassault-falcon-900b-for-sale-2026-market-study
[postbuild] wrote 34 HTML files (19 Market Notes) and sitemap.xml with 33 URLs
[prerender] 1 redirect stub(s) left as written: /blog/title-dassault-falcon-900b-for-sale-2026-market-study
[prerender] 34 of 34 routes rendered in 44.4s
```

| Check | Result |
|---|---|
| `ls dist/blog \| grep title-` | `title-dassault-falcon-900b-for-sale-2026-market-study.html`, now from the template |
| `grep -c title-dassault dist/sitemap.xml` | 0 |
| `market-notes.json` | every post has `previousSlugs`; the Falcon note's is `["title-dassault-falcon-900b-for-sale-2026-market-study"]` |

### Followed in a browser

Playwright loaded the stub with `?utm_source=linkedin&utm_medium=social&utm_campaign=…`.
`www.pennjets.com` and the CRM were caught first, and 0 requests
reached the CRM.

| Run | Landed on |
|---|---|
| Scripts on | `https://www.pennjets.com/blog/dassault-falcon-900b-for-sale-2026-market-study?utm_source=linkedin&utm_medium=social&utm_campaign=dassault-falcon-900b-for-sale-2026-market-study` |
| Scripts off | `https://www.pennjets.com/blog/dassault-falcon-900b-for-sale-2026-market-study` (the refresh) |

### Tests

**`src/seo/redirectStub.test.js`, 5 tests:**

- the Part 1 tags;
- the script, placed before the refresh;
- title escaping;
- one stub per former slug;
- no stub over a live note, at a non-slug path, or for a slug listed
  twice.

**`src/components/pages/Blog/BlogArticle.test.jsx`, 2 tests (RTL):**

- A stubbed fetch answers the old slug with `redirectTo`. The page ends
  at `/blog/<new>?utm_source=linkedin&utm_medium=social#talk` with
  navigation type `REPLACE`. It renders the note's h1, and no beacon
  fired for the old slug.
- A real 404 renders "Note Not Found" and does not navigate.

**Results:**

- `npx vitest run src/components/pages/Blog src/seo`: 4 files, 68 tests,
  68 passed.
- Run against the unchanged `BlogArticle.jsx` (stashed), the redirect
  test fails and the 404 test passes, so the test pins the change.
- `npm run lint`: exit 0.
- `npx eslint scripts/postbuild.mjs` reports 4 `no-unused-vars` errors
  (`viewCount`, `leadCount` at `:109` and `:259`). They are identical on
  `HEAD` before this change, and `npm run lint` does not cover `.mjs`.
- The full suite was not run, because T3 is the other active builder.
- The preview was stopped; no node process of this repo is running.

**Still to do:** after the deploy, the lead reads the live stub (the
script, the refresh, the canonical, the link) and a direct SPA hit on
the old slug.

## Part 3 — the title suffix, once, in "Penn Jets" (done)

Branch `t4/wo-4.54-p3`, cut from `t4/work` `eaee96b` so the WO-4.53
PR stays clean, with three commits:

- `39525f7`: the titles, the fallback and the pins.
- `2ccb77b`: the cache refresh, in its own commit.
- The report commit that adds this section.

Joseph's answer (2026-10-28): the brand form is "Penn Jets" everywhere,
and the fallback is " | Penn Jets Market Notes".

### What the template did, as Joseph asked

`articleMeta` uses `metaTitle || title`.

- **A title that already carries the brand passes through untouched,
  in either spelling** (`/penn\s?jets/i`). Joseph's hand-entered "… |
  Penn Jets" is therefore shown once, never doubled.
- **A title without the brand** gets " | Penn Jets Market Notes". Before
  this change the suffix was " | PennJets Market Notes".

### Changed

| Where | Before | After |
|---|---|---|
| `articleMeta` fallback | `${title} \| PennJets Market Notes` | `${title} \| Penn Jets Market Notes` |
| `DEFAULT_TITLE` (home) | PennJets \| Private Jet Brokerage & Aviation Consulting | Penn Jets \| Private Jet Brokerage & Aviation Consulting |
| `ROUTES` (13 titles) | Buy an Aircraft \| PennJets; Sell Your Aircraft \| PennJets; Aviation Consulting \| PennJets; PennShare Fractional Ownership \| PennJets; About PennJets \| Private Aviation Sales and Consulting; Contact PennJets; Market Notes \| PennJets; Recent Inquiries \| PennJets; Privacy Policy, Terms of Service, Cookie Policy, Compliance Statement, Image Library \| PennJets | the same, with "Penn Jets" |
| `SITE_NAME` (`og:site_name`, and the JSON-LD Organization name on notes) | PennJets | Penn Jets |
| `public/404.html` `<title>` (shows during the SPA redirect hop) | PennJets | Penn Jets |
| `index.html` `<title>` (the template; `renderShell` replaces it on every page, so it never ships) | PennJets - Premier Aviation Brokerage | Penn Jets \| Private Jet Brokerage &amp; Aviation Consulting |

- **Three changes go beyond the order's list.** `SITE_NAME` and the two
  HTML `<title>`s are head-level brand strings, not prose, so WO-4.55's
  sweep would not cover them. Each is one line to revert if the lead
  disagrees.
- `/charter` already read "Penn Jets".
- The `ROUTES` descriptions still say "PennJets". They are body copy,
  and WO-4.55 sweeps them.

### Pins (`siteMeta.test.js`, 4 new tests)

1. A bare title becomes "Dassault Falcon 900B for Sale: 2026 Market
   Study | Penn Jets Market Notes".
2. A hand-entered "… | Penn Jets" passes through exactly.
3. A hand-entered "Hawker 800XP Market Update | PennJets" passes
   through exactly, with no second suffix.
4. `ROUTES['/buy'].title`, `DEFAULT_TITLE`, and no `ROUTES` title
   containing "PennJets".

Results:

- `npx vitest run src/seo src/components/common/PageMeta`: 1 file, 35
  tests, 35 passed.
- `npm run lint`: exit 0.
- The full suite was not run, because T1 is the other active builder.

### Build (`npm run build`, exit 0), the titles in `dist`

```
[postbuild] article bodies: 19 from cache, 0 fetched
[postbuild] wrote 34 HTML files (19 Market Notes) and sitemap.xml with 33 URLs
[prerender] 1 redirect stub(s) left as written: /blog/title-dassault-falcon-900b-for-sale-2026-market-study
[prerender] 34 of 34 routes rendered in 49.1s

dist/index.html:   Penn Jets | Private Jet Brokerage &amp; Aviation Consulting   (og:site_name Penn Jets)
dist/buy.html:     Buy an Aircraft | Penn Jets
dist/contact.html: Contact Penn Jets
dist/about.html:   About Penn Jets | Private Aviation Sales and Consulting
dist/blog/dassault-falcon-900b-for-sale-2026-market-study.html:
                   Dassault Falcon 900B for Sale: 2026 Market Study | Penn Jets   (Joseph's meta title, once)
```

**The 19 note titles.** 12 are hand-entered with "| Penn Jets" and pass
through. 7 are bare and get "| Penn Jets Market Notes", for example "617
Aircraft, 21 for Sale: Inside the G550 Market | Penn Jets Market Notes".
`grep` finds **no `<title>` containing "PennJets"** anywhere in `dist`.

The 20th `<title>` under `dist/blog` is the Part 1 stub's, with the bare
note title. Part 2 replaces that file from the template.

The live tab title on the Falcon page is read after the deploy.
