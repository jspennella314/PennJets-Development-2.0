---
wo: WO-4.41
terminal: T4
branch: t4/work
commit: 4e58925
tested_against: "local checkout of t4/work at 4e58925 (on top of main 203efb3), Node 22.19.0: npm test (vitest 3.2.7, the NoteBody file in the prerender's Playwright Chromium); npm run build twice (dist/ prerendered by the build's Chromium; list from the production CRM, bodies from scripts/crm-articles.cache.json) and compared page by page with a build of 203efb3; npm run lint. No CI run: deploy.yml runs only on main (see Known gaps 1)."
date: 2026-10-05
status: reported
---

# WO-4.41 report: a test runner for the site, and the three node checks folded into it

## Commit

`4e58925` on `t4/work`, pushed.

```
$ git show --stat --format= 4e58925
 .github/workflows/deploy.yml                       |    9 +
 package-lock.json                                  | 8076 +++++++++++++-------
 package.json                                       |    5 +-
 .../pages/Blog/NoteBody.browser-test.mjs           |  150 -
 src/components/pages/Blog/NoteBody.test.js         |  183 +
 src/seo/siteMeta.image-host-test.mjs               |   62 -
 src/seo/siteMeta.test.js                           |   60 +
 src/services/blogPaging.test.js                    |  147 +
 src/services/blogPaging.test.mjs                   |  148 -
 vitest.config.js                                   |   31 +
```

Routine, done without asking: `git fetch`, `git fetch origin main:main`,
`git merge --ff-only origin/main` into `t4/work` (132bcc1 → 203efb3, the
merge of PR #8), `npm ci`. There is no `prisma generate` in this
repository (no Prisma; the instruction's step applies to the CRM
terminals).

## 1. The two dependencies

```
"happy-dom": "^20.14.5",
"vitest": "^3.2.7",
```

installed with `npm install --save-dev vitest@^3.2.7 happy-dom@^20.14.5`;
the lockfile change is in the commit.

**Why vitest 3, not 5 (the current release, 5.0.3).** The site builds
with vite 4 (`vite@4.5.14`, `@vitejs/plugin-react@4.7.0`). vitest 4 and
5 declare vite as a *peer* dependency (`^6 || ^7 || ^8` and `^6.4 ||
^7 || ^8`), which npm cannot satisfy next to vite 4 without upgrading
vite — not approved by this order. vitest 3 (`3.2.7`, engines node ≥18)
carries vite as its own dependency (`^5 || ^6 || ^7`), so npm installs a
private `vite@7.3.6` under `node_modules/vitest/` and `vite-node/` and
the site's own vite 4 is untouched: the production bundle hash is
identical before and after (below). `@vitejs/plugin-react@4.7.0` peers
on `vite ^4.2 || ^5 || ^6 || ^7`, so the one plugin serves both. The
CRM is on vitest ^4 with vite 6+, which is why it could go higher.

happy-dom 20.14.5 is the current release (engines node ≥20).

**The lockfile:** 131 entries added, 0 removed, 0 version changes to
anything already there. The size of the diff (8,076 lines) is the three
copies of esbuild's and rollup's platform binaries (vitest's and
vite-node's nested `vite@7.3.6` each pull `esbuild@0.28.2` +
`rollup@4.64.0` with ~25 platform packages apiece), plus the vitest
runtime (`@vitest/*`, chai, tinypool…) and happy-dom's five
dependencies. `npm audit` reports 26 vulnerabilities, all of them
pre-existing (the same count before this order, in vite 4's tree).

## 2. The test script and config

`package.json`: `"test": "vitest run"`.

`vitest.config.js`: `plugins: [react()]`, `test.environment: 'node'`,
`include: ['src/**/*.test.{js,jsx}']`, `pool: 'forks'`, verbose
reporter. The default is node because that is what `siteMeta.js` and
`blogPaging.js` need; a component test opts into happy-dom per file
with `// @vitest-environment happy-dom`, exactly as the order allows.
Explicit `import { describe, it, expect } from 'vitest'` everywhere, no
globals, so `.eslintrc.cjs` did not change (its `env` already has
`node: true`).

**happy-dom works for components**: a scratch file (not committed)
with `// @vitest-environment happy-dom` rendered `LatestNoteCard` inside
a `MemoryRouter` through `react-dom/client` and read back the `<h3>` and
the link's `href` — 1 passed, 175 ms. WO-4.42's component test can use
it.

## 3. The three checks, folded in — and the one that could not move to happy-dom

| Check | Before (node script) | After (vitest file) | Cases |
|---|---|---|---|
| Image-host gate (WO-4.39) | `src/seo/siteMeta.image-host-test.mjs` | `src/seo/siteMeta.test.js` (node) | 23 → 23 |
| List pager (WO-4.40) | `src/services/blogPaging.test.mjs` | `src/services/blogPaging.test.js` (node) | 26 → 26 |
| NoteBody sanitiser (WO-4.38) | `src/components/pages/Blog/NoteBody.browser-test.mjs` | `src/components/pages/Blog/NoteBody.test.js` (node + Playwright Chromium) | 18 → 18 |
| | | | **67 → 67** |

The "before" counts are the `check(` calls in each script (the NoteBody
loop runs its one `check` over 12 bodies: the hand-written one and the
11 cached notes). Every case keeps its label; the two "always
`hasMore: true`" endings of the pager are two `describe` blocks (the
empty-page stop at page 4, and the 20-page hard stop).

**NoteBody stays in a real browser, deliberately.** The order says the
sanitising cases "need a DOM", and happy-dom is the DOM the order
approves. I probed it before writing the test:

```
happy-dom 20.14.5 + dompurify 3.4.16, createDOMPurify(new Window())
  isSupported: true
  sanitize('<p>ok</p><script>alert(1)</script><img src=x onerror="alert(2)"><a href="javascript:alert(3)">x</a>', { ALLOWED_TAGS: ['p','img','a'], ALLOWED_ATTR: ['href','src'] })
  → 'ok<script>alert(1)</script><img src="x" onerror="alert(2)"><a href="javascript:alert(3)">x</a>'
  DOMPurify.removed: [BODY, P]
  (the same through vitest's GlobalWindow route: identical)
```

DOMPurify walks the parsed body with a `NodeIterator` and removes nodes
as it goes. A browser's iterator survives the removal of the node it is
standing on (the DOM spec's pre-removal steps); happy-dom's does not: it
removes `<body>` and the first `<p>` and then stops, so `<script>`,
`onerror` and `javascript:` all come back untouched, with `isSupported`
still `true`. A sanitiser test whose sanitiser is silently inert would
pass the "unchanged" cases and fail the attack ones for the wrong
reason, and could never prove what WO-4.38 proved. So the NoteBody file
runs in vitest's node environment and does what the script did: vite's
`build()` bundles a harness around the real `NoteBody.jsx` twice (as
shipped; with `sanitizeNote` aliased to identity), and the prerender's
Playwright Chromium renders both. One adjustment: under vitest
`NODE_ENV` is `test`, which makes plugin-react emit the dev JSX runtime
while the harness `define`s production React (whose dev runtime has no
`jsxDEV`); the test sets `NODE_ENV=production` around the two bundles
and restores it. Each file is its own forked process, so nothing else
sees that.

**This is reported, not worked around:** the order's premise that the
NoteBody cases can run under happy-dom does not match what DOMPurify
does there. The lead may want to know before WO-4.42 or anything else
leans on happy-dom for sanitisation.

## 4. CI: `npm test` before the build — after the Chromium install

```yaml
    - name: Install dependencies
      run: npm ci

    - name: Install Chromium for the prerender stage
      run: npx playwright install --with-deps chromium

    - name: Test
      run: npm test

    - name: Build
      run: npm run build
```

The order places Test between "Install dependencies" and "Install
Chromium". Because the NoteBody test renders in Chromium (section 3), it
would fail on the runner before Chromium exists, so the step sits
**after** the Chromium install and **before Build**. A failing test
still stops the deploy before anything is built, which is the point of
the step; the only cost is that Chromium (≈20 s on the runner, WO-4.26)
is installed before a failing test is found rather than after.
`ubuntu-24.04` and every `actions/*@v7` pin (WO-4.28) are unchanged.

## 5. `npm run lint`

```
> eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0
lint exit 0
```

with the three test files and `vitest.config.js` in place.

## Evidence

### `npm test`

```
$ npm test                                        (at 4e58925, locally)
 ✓ src/seo/siteMeta.test.js            23 tests
 ✓ src/services/blogPaging.test.js     26 tests
 ✓ src/components/pages/Blog/NoteBody.test.js   18 tests
   INFO  before WO-4.38 the same string rendered 1 on* attribute(s) and 1 javascript: URL(s), and ran 1 dialog(s): ["2"]

 Test Files  3 passed (3)
      Tests  67 passed (67)
   Duration  10.50s (transform 199ms, collect 878ms, tests 6.85s, prepare 754ms)
npm test exit 0 in 13s
```

Full verbose output: every one of the 67 lines is `✓`; the 18 NoteBody
lines are the five attack checks, the control, and the twelve
"unchanged" bodies by slug. The first run of the session was the
`jsxDEV` failure described in section 3 (49 passed, 18 skipped, exit 1),
fixed by the `NODE_ENV` guard; the run above is the second.

One stderr line from the NoteBody file, not an error:
`[baseline-browser-mapping] The data in this module is over two months
old` — browserslist's companion package inside vitest's nested vite 7
nagging about its data file. Harmless; it goes away when the lockfile
next moves.

### The CI run

**None.** `deploy.yml` triggers on `push` to `main`, the daily
schedule, and `workflow_dispatch` only. A push to `t4/work` does not run
it, and a `workflow_dispatch` on `t4/work` would run the whole job,
including the deploy of that build to GitHub Pages, which is Joseph's.
So the runner time for the Test step comes with Joseph's merge; locally
the step is 13 s wall-clock (10.5 s inside vitest, 6.9 s of it the
Chromium bundle-and-render). See Known gaps 1.

### Build

Baseline: `203efb3` with this order's test files and config stashed.
After: `4e58925`. Both in my own checkout, other terminals' builds
waited for (T3's `next build` and the lead's were running when I
started; I built only once no `next build` was in the process list).

```
$ npm run build            (baseline)                        (after, 4e58925)
build exit 0                                                 build exit 0
  dist/assets/index-b2c95757.css   49.98 kB │ gzip:   8.10 kB   (same)
  dist/assets/index-073ec5e5.js   395.39 kB │ gzip: 115.66 kB   (same)
  [postbuild] article bodies: 11 from cache, 0 fetched           (same)
  [postbuild] wrote 27 HTML files (11 Market Notes) and sitemap.xml with 26 URLs   (same)
  [prerender] 27 of 27 routes rendered in 38.1s / 39.4s, 138,515 characters of body text added
  [prerender] 11 view beacon(s) intercepted; 11 article fetch(es) answered from cache; 14 note-list read(s) answered from cache; none reached the CRM.

pages: 29, identical: 29, differ: 0        (27 HTML + 404.html + sitemap.xml; countdown digits, asset hashes and sitemap lastmod masked)
```

The JS bundle hash `index-073ec5e5.js` is the same as the WO-4.40 build
of `f270376`: nothing in this order reaches the production bundle (test
files are not imported; vitest's vite 7 is not the site's vite 4).
`scripts/crm-posts.cache.json` and `crm-articles.cache.json` came back
unchanged from both builds (same 11 notes on production).

One thing to disclose about the baseline: `git stash push -u` could not
remove three untracked directories under `public/images/blog/` (OneDrive
had them locked), so the stash exited 1 having stashed the untracked
test files but left the tracked edits (package.json, the lockfile,
deploy.yml, the three deletions) in place. None of those four affect
`vite build` output, and the matching bundle hash across three builds
proves it, but the baseline was not a pristine `203efb3` tree. The
stash was then verified file by file against the working tree
(line-endings-only differences) and dropped.

## Scope

As ordered: `package.json`, `package-lock.json`, `vitest.config.js`,
the three test files (replacing the three scripts), and
`.github/workflows/deploy.yml`. `.eslintrc.cjs` untouched. Only this
repository touched; the CRM repo was read (its vitest config, for the
convention) and not written.

## Known gaps

1. **No CI evidence on `t4/work`** (above). The order's "CI run on
   `t4/work` showing the test step green" cannot exist with the
   workflow as it is; the first run is Joseph's merge. If the lead wants
   branch CI, that is a separate workflow (a `test.yml` on `push` to
   every branch with no deploy step), outside this order's scope — a
   one-file order.
2. **The Test step is after the Chromium install**, not before it
   (section 4), because of the DOMPurify/happy-dom finding (section 3).
3. **The NoteBody test needs Chromium locally** (`npx playwright
   install chromium`), as the prerender already does. A machine without
   it fails that file with Playwright's "browser not found" message,
   which is the right failure.
4. **`npm test` takes ~13 s**, 7 s of it the NoteBody bundle-and-render;
   the two node files take under a second together.
5. **happy-dom is installed and configured but no committed test uses
   it yet**; WO-4.42's component test is its first use. Should the lead
   decide it is not wanted, removing it is a lockfile change only.
