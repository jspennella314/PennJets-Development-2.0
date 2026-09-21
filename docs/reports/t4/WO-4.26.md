---
wo: WO-4.26
terminal: T4
branch: t4/work
commit: a70fcdb
tested_against: "nothing yet — the evidence this order requires is a green run on main, and T4 does not merge. See Blocked."
date: 2026-09-21
status: blocked — fix pushed, needs merging before any of it can be evidenced
---

# WO-4.26 report — the runner runs Node 22

The fix is one line. The evidence is not available to me, because all of it
comes from a workflow run on `main`.

## Commit

`a70fcdb` WO-4.26: the deploy runner runs Node 22. On `t4/work`, pushed. **Not
merged, and nothing publishes until it is.**

## The workflow diff

Against `main`, the whole change:

```diff
-        node-version: '18'
+        # 22, not 18. playwright 1.63 declares engines >= 20 and its CLI
+        # refuses to run below that, so npm ci installed it cleanly and the
+        # browser install failed 21 seconds in, taking the deploy down on
+        # 2026-09-21 without touching a line of the site's own code.
+        #
+        # 22 rather than the minimum 20 because 22 is what this project is
+        # built and evidenced on locally. The bug was not the floor itself, it
+        # was a runner running something different from where the work was
+        # checked; matching them removes that whole class of failure rather
+        # than clearing this one instance of it. WO-4.26.
+        node-version: '22'
```

Nothing else. The Chromium install step, the prerender, and everything WO-4.23
built are untouched.

## Why 22 and not 20

Both clear the floor. The order asked me to pick and say why.

**22 is what this project is built and evidenced on.** Every measurement in
every Round 4 report came off Node v22.19.0. The failure was not really a
version floor; it was a runner running something different from the machine
the work was checked on, and a floor is only the way that difference happened
to surface this time. Pinning the runner to 20 clears this instance and leaves
the gap open. Matching it to 22 closes the gap.

The conservative argument for 20 is real, and it is that a smaller jump is
easier to reason about. I think it is outweighed here: the smaller jump
preserves the exact condition that caused the outage.

## Nothing else assumed Node 18

| | |
|---|---|
| `package.json` `engines` | none declared |
| `package-lock.json` | `lockfileVersion: 3`, npm 7+, fine on 20 and 22 |
| Vite | 4.5.14, `engines: ^14.18.0 \|\| >=16.0.0` |
| `postbuild.mjs` | top-level await (Node 14.8+) and `fetch` (Node 18+) |
| `prerender.mjs` | same, plus `playwright`, which is the thing that needed 20 |

`npm ci` against the committed lockfile installs cleanly on Node 22 here, and
the full build, lint and prerender all pass on it.

## Two changes I backed out

Before this order existed I had diagnosed the same failure and pushed `af9c358`,
which went further than the Node version:

- `continue-on-error: true` on the Chromium install step.
- A guard in `prerender.mjs` that caught a failed `chromium.launch()`, printed
  a banner and exited 0, so a missing browser degraded to a non-prerendered
  deploy instead of failing the build.

**WO-4.26 puts both out of scope**, and `a70fcdb` reverts them.
`scripts/prerender.mjs` is byte for byte identical to its WO-4.23 state, which
`git diff` confirms, and the Chromium step is exactly as it was.

My reasoning had been that a browser download should not sit on the critical
path of a deploy that has nothing to do with it. I still think that is worth
deciding on its own merits. It is not a thing to decide while fixing the
outage it would have masked, and the order is right to separate them.

## Blocked

Every piece of evidence this order requires comes from a run on `main`:

- a green run with its id and step list
- `origin/gh-pages` moving
- `curl -I` showing `Last-Modified` after the merge
- a marker of the new build in the live HTML

**T4 does not merge.** Until Joseph merges `t4/work`, `main` still carries
`node-version: '18'` and every run will fail at the same step.

Current state, checked at the time of writing:

```
origin/main      46560f1  2026-09-21 04:50:32Z  Merge pull request #2
origin/gh-pages  2e1468d  2026-09-20 15:15:26Z  deploy: 9ee9adc

https://www.pennjets.com  Last-Modified: Sun, 20 Sep 2026 15:15:54 GMT
https://www.pennjets.com/videos/falcon-hero-poster.webp  404
```

Twenty-two commits are on `main` and undeployed, and the daily rebuild has been
failing on the same step since.

## What I got wrong, and what caught it

I added a CI step that installed a package with a Node floor, into a workflow
pinned below that floor, and did not check one against the other. It passed
locally because this machine is two major versions ahead of the runner.

The thing that made it findable in minutes rather than hours was the
`tested_against` line on the WO-4.23 report saying in as many words that the
evidence was **not** from a production deploy. That disclosure was the whole
value of the format. It did not prevent the outage; it named the gap the
outage came through, before anyone had to go looking.
