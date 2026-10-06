---
wo: WO-4.45
terminal: T4
branch: t4/work
commit: dd469aa
tested_against: "local checkout of t4/work at dd469aa, Node 22.19.0: the workflow file parsed with js-yaml 4.1.0 (eslint's dependency, already in node_modules); npm test and npm run lint rerun on the same tree; the build is the WO-4.44 build of 673e3f7, which this order's YAML-only change cannot alter. No dispatch sent, by design; no CI run yet (the workflow runs on main)."
date: 2026-10-06
status: reported
---

# WO-4.45 report: the Pages workflow runs on `repository_dispatch` from the CRM, one build at a time

## Commit

`dd469aa` on `t4/work`, pushed. One file: `.github/workflows/deploy.yml`.

## The diff

```diff
 name: Deploy to GitHub Pages

+# The Actions list says why a run happened. A dispatch from the CRM reads
+# "market-notes: published <slug>"; everything else keeps the workflow's name.
+# WO-4.45.
+run-name: "${{ github.event_name == 'repository_dispatch' && format('market-notes: {0} {1}', github.event.client_payload.reason, github.event.client_payload.slug) || 'Deploy to GitHub Pages' }}"
+
 on:
   push:
     branches: [ main ]
-  # Rebuild daily so new Market Notes get their static preview pages within a day.
+  # Rebuild daily so new Market Notes get their static preview pages within a
+  # day. This stays as the safety net under the dispatch below. WO-4.45.
   schedule:
     - cron: '0 6 * * *'
   workflow_dispatch:
+  # The CRM posts a repository_dispatch when a Market Note is published or
+  # edited (T1's WO-1.31), with client_payload { reason, slug, at }. The job
+  # does not read the payload: it rebuilds from the CRM as on any other run,
+  # and the new note is in the build because the build ran. WO-4.45.
+  repository_dispatch:
+    types: [market-notes]
+
+# One build at a time, the latest wins: five edits in two minutes end as one
+# finished deploy, and the 06:00 run never overlaps a dispatched one. A
+# cancelled run cannot leave Pages half-deployed: the deploy step is one git
+# push of a complete gh-pages commit (peaceiris/actions-gh-pages), so a run
+# cancelled before it leaves the previous deploy in place and one cancelled
+# during it either lands whole or not at all. WO-4.45.
+concurrency:
+  group: pages-deploy
+  cancel-in-progress: true

 permissions:
```

Nothing below `permissions:` changed: same job, same `ubuntu-24.04`,
same steps (Checkout › Setup Node.js › Install dependencies › Install
Chromium › Test › Build › Copy CNAME › Deploy), same action pins.

## 1. The trigger

`repository_dispatch` with `types: [market-notes]`, beside the three
existing triggers. The job reads nothing from `client_payload`; the
build fetches the CRM's list as on every run, so a dispatched run
carries the new or edited note because it ran, not because of the
payload.

## 2. One build at a time, and whether a cancel can half-deploy

`concurrency: { group: pages-deploy, cancel-in-progress: true }` at the
workflow level: a new run (dispatch, push, schedule or manual) cancels
the one in progress and queues behind nothing, so a burst of edits ends
as one finished deploy, and the 06:00 run and a dispatch cannot overlap.

**The order's premise about the deploy action does not match the
file.** It says to confirm atomicity from `actions/deploy-pages`'s docs;
this workflow does not use that action. It deploys with
**`peaceiris/actions-gh-pages@v4`** (pinned since WO-4.28), which
publishes by committing `publish_dir` to the `gh-pages` branch and
pushing. From its README (read 2026-10-06): "Only the contents of this
dir are pushed to GitHub Pages branch, `gh-pages` by default", and "by
default, existing files in the publish branch … will be removed" — one
commit per deploy, replacing the tree, no force push unless
`force_orphan` is set (it is not). The branch's history agrees: every
deploy is one commit, e.g.

```
5041bce 2026-10-06 12:46:55 +0000 deploy: 448b280e…
5a7bbf9 2026-10-06 00:39:43 +0000 deploy: 448b280e…
a10861f 2026-10-05 15:20:34 +0000 deploy: f9db8a27…
d9300db 2026-10-05 13:38:36 +0000 deploy: 203efb30…
```

So the answer to "can a cancelled run leave Pages half-deployed" is
**no**, for a different reason than the order expected: a git push is a
single ref update. A run cancelled anywhere before the Deploy step
changes nothing; a run cancelled during the push either moves
`gh-pages` to the complete new commit or does not move it. GitHub Pages
then builds the branch as a whole. The one window that is not atomic is
Pages' own publish of the new `gh-pages` commit, which is GitHub's and
unchanged by this order. (Also noted: `actions/deploy-pages` is the
artifact-based alternative; moving to it would be its own order and
would change `permissions` and the Pages source setting.)

## 3. The run's name

`run-name` is the dispatch's `reason` and `slug` ("market-notes:
published the-light-jet-market-…") for a `repository_dispatch` event and
the workflow's own name otherwise. The value is a quoted YAML string: an
unquoted `format('market-notes: {0} …')` is invalid YAML (the `: ` inside
the literal starts a mapping), which js-yaml caught on the first
attempt; the quoted form parses.

## 4. The schedule stays

`cron: '0 6 * * *'` is untouched; its comment now says it is the safety
net. Under the concurrency group it also cancels a dispatched run that
happens to be in flight at 06:00 UTC and rebuilds with the same data,
so nothing is lost.

## Evidence

### The YAML, parsed

`actionlint` is not installed on this machine, so the file was parsed
with the `js-yaml` that eslint already carries in `node_modules`
(4.1.0), reading back the fields this order touched:

```
parsed OK. top-level keys: name, run-name, on, concurrency, permissions, jobs
on: {"push":{"branches":["main"]},"schedule":[{"cron":"0 6 * * *"}],"workflow_dispatch":null,"repository_dispatch":{"types":["market-notes"]}}
concurrency: {"group":"pages-deploy","cancel-in-progress":true}
run-name: ${{ github.event_name == 'repository_dispatch' && format('market-notes: {0} {1}', github.event.client_payload.reason, github.event.client_payload.slug) || 'Deploy to GitHub Pages' }}
jobs: [ 'build-and-deploy' ] | runs-on: ubuntu-24.04
steps: Checkout > Setup Node.js > Install dependencies > Install Chromium for the prerender stage > Test > Build > Copy CNAME file > Deploy to GitHub Pages
```

The expression syntax itself (`&&`/`||`, `format()`, the
`client_payload` path) is GitHub's and is only evaluated by GitHub; the
first run on `main` is the check.

### No dispatch from a terminal

None sent. There is no token in this checkout, and the order forbids
it. The first real run is Joseph's next publish after both halves are
deployed (this merge, and T1's WO-1.31 on the CRM with the lead's
token in Vercel Production); the lead watches it.

### `npm test`, `npm run build`, `npm run lint`: unchanged

```
npm run lint   exit 0
npm test       Test Files 7 passed (7)   Tests 118 passed (118)
npm run build  the WO-4.44 build of 673e3f7 (exit 0, 28 routes, 30/30 pages identical to its baseline); this commit changes no file the build reads
```

## Scope

`.github/workflows/deploy.yml` only. No site code, no token, nothing in
the CRM repo.

## Known gaps

1. **No CI run shows the new triggers**: the workflow runs only on
   `main`. Joseph's merge is the first run under the new header (its
   `run-name` will read "Deploy to GitHub Pages"); the first
   "market-notes: …" run is his first publish after WO-1.31 is live.
2. **`cancel-in-progress` cancels any in-flight run**, including one
   Joseph started by merging to `main`, if a dispatch lands during it;
   the dispatched run then deploys the same `main` plus the new note, so
   the outcome is the same, but the cancelled run shows as cancelled in
   the Actions list. That is the order's "latest wins".
3. **A dispatch whose build fails** (a test failure, the CRM
   unreachable with no cache) deploys nothing and the previous deploy
   stays — the same as today's scheduled run; nothing retries until the
   next dispatch or 06:00.
4. **Seen on `gh-pages`, not mine:** two deploys of the same `main`
   commit `448b280` today, at 00:39 UTC (Joseph's merge) and 12:46 UTC —
   the latter is neither the 06:00 schedule nor a push, so someone ran
   `workflow_dispatch` by hand (the lead's audit, presumably). It picked
   up the twelfth note. Mentioned only so it is not mistaken for this
   order's trigger, which is not deployed yet.

## End of the queue (2026-10-06)

**Finished, reported and pushed on `t4/work`:**
- `670ffa1` — routine cache refresh (12 notes; `featuredImageSocial` on
  every row).
- **WO-4.44** — `673e3f7`, report `4546a32`. 118 tests pass; 30/30 pages
  identical; the first live blob-image note's `og:image` is the blob URL.
- **WO-4.45** — `dd469aa`, this report.

**Skipped:** none. **Stopped on:** nothing. No denied command, no
failure outside my changes, no schema or env need, nothing touched a
live account; outbound calls were GETs to the public list, article and
inventory routes (the two article fetches in the baseline build wrote
two `ContentAnalytics` rows, the documented cost). No other terminal was
building when my two builds ran; another terminal's `npm ci` was running
at the start.

**Left for Joseph:**
1. **Merge `t4/work` into the site's `main`** (`448b280` → `dd469aa`+):
   WO-4.44 and WO-4.45. That merge is the first run with the new
   workflow header.
2. Then publish or edit a note once WO-1.31 is live; the lead watches
   the first "market-notes: …" run.

**For the lead:**
- The contract paragraph for `featuredImageSocial` (WO-4.44 report §4).
- WO-4.45 §2: the order named `actions/deploy-pages`; the workflow uses
  `peaceiris/actions-gh-pages@v4`. The atomicity answer holds either
  way, but the premise should be corrected wherever it is written.
- The untracked signed PDF in `public/images/Gallery/` (WO-4.44 report,
  Known gaps 3).
