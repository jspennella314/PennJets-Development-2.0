---
wo: WO-4.54
terminal: T4
model: claude-opus-5-5
tested_against: local build of t4/pr-4.54-stub (5a0ceae + 4f6ef5e) on main 818ab32, served by vite preview on :4174; the CRM list route read live once for the note's title
status: Part 1 done, PR branch pushed; Parts 2 and 3 open (Part 2 after T1's WO-1.37 is live; Part 3 waits on Joseph's brand form)
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

## Part 2 — the mechanism

Open. It starts when T1's WO-1.37 is live. The Part 1 file is deleted
in that commit.

## Part 3 — the meta title suffix

Open. It waits on Joseph's brand form, relayed through `joseph.md`.
