---
wo: WO-4.29
terminal: T4
branch: t4/work
commit: 3bc7f58
tested_against: "site: npm run build at 3bc7f58 on this machine (Node v22.19.0, exit 0, 26 of 26 routes prerendered). The banner was read from that built dist served locally with JavaScript on and the app hydrated; the rollover was exercised with Playwright's fake clock (page.clock.install) at three instants in this machine's local zone (Eastern), which is what the order means by the reader's local date. Every /api/public call was answered locally; the CRM was not involved. No CRM deploy is relevant to this order."
date: 2026-09-23
status: reported — built and evidenced; the 390 wrap is a stop-and-report item for Joseph
---

# WO-4.29 report — the countdown banner names the year from the date

Built as ordered: Joseph's label with the year read from the clock, the
target derived the same way, `Happy New Year!` with the timer hidden on
1 January, local time throughout, nothing else in the banner touched. The
rollover is shown in all three states without waiting for it. **At 390 the
new label wraps to two lines**, so per the order that item stops here with
a screenshot; it is Joseph's wording and his choice.

## Commit

`3bc7f58` WO-4.29: the countdown banner names the year from the date and
greets on 1 January. On `t4/work`, pushed. `Header.jsx`, plus the two banner
screenshots beside this report and a one-line cache change (see Scope).

## The change, `src/components/layout/Header/Header.jsx`

```diff
+const bannerDateFor = (date) => ({
+  year: date.getFullYear(),
+  isNewYearsDay: date.getMonth() === 0 && date.getDate() === 1,
+});
…
+  const [bannerDate, setBannerDate] = useState(() => bannerDateFor(new Date()));
…
-      const endDate = new Date('2026-12-31T23:59:59');
       const now = new Date();
+      const endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
       const difference = endDate - now;
+      setBannerDate(bannerDateFor(now));
…
-          <span className="font-semibold">Calendar Year Ending:</span>
+          <span className="font-semibold">
+            {bannerDate.isNewYearsDay
+              ? 'Happy New Year!'
+              : `Days left to close a ${bannerDate.year} acquisition.`}
+          </span>
+          {!bannerDate.isNewYearsDay && (
           <div className="flex gap-3 font-mono">
             …
           </div>
+          )}
```

- **Label**: Joseph's words verbatim, full stop included; `{year}` is
  `getFullYear()` of the current local date, never a literal.
- **Target**: `new Date(year, 11, 31, 23, 59, 59)`, built from parts. The
  old literal without `Z` was local time; this is local time too.
- **1 January**: label replaced by `Happy New Year!`, timer not rendered
  that day. Built hidden, as the order says; showing it is one condition.
- The year and the 1-January flag are recomputed on the same one-second tick
  as the countdown, so a tab left open across midnight follows the date.
  The initial state is the real date, so the first paint (and the
  prerendered HTML) is right.
- Colours, positioning, units, `bannerRef` and its measurement: untouched.
  `git diff` shows no other line.

## The banner today, from the built output

Read out of the hydrated page at each width; "before" is the dist built
from `e303c89` (the old banner), "after" is the dist built from `3bc7f58`.

| | 1440 before | 1440 after | 390 before | 390 after |
|---|---|---|---|---|
| Label | Calendar Year Ending: | Days left to close a 2026 acquisition. | Calendar Year Ending: | Days left to close a 2026 acquisition. |
| Label lines | 1 | 1 | 1 | **2** |
| Timer on the label's row | yes | yes | yes | yes |
| **Banner height (`bannerRef`)** | **60 px** | **60 px** | **60 px** | **60 px** |
| Header `top` (dark hero page) | 64px | 64px | 64px | 64px |

Screenshots, committed beside this report:
`docs/reports/t4/wo-4.29-banner-1440.png` and
`docs/reports/t4/wo-4.29-banner-390.png`.

## The 390 wrap — stop and report

At 390 the label breaks after "2026": `Days left to close a 2026` on one
line and `acquisition.` on the next, inside its own span, with the timer
still to its right on the same row. The banner does **not** get taller
(the stacked number-over-label timer already made it 60 px) and the timer
is **not** pushed to a second line, so the header offset is unaffected.
It is still a wrap, and the order says to stop on one rather than shorten
Joseph's words or restyle. The screenshot is the 390 file above.

The choices are Joseph's, and I have not made any of them: accept a
two-line label on phones; a shorter phone-only wording; or a style change
(smaller text, or the label taking the full width above the timer). Any of
the three is a small change once chosen.

## The rollover, without waiting for it

Harness: the built dist served locally, Playwright (already a devDependency)
with `page.clock.install({ time })` before navigation so the page's `Date`
and `setInterval` run on a fake clock, then `clock.runFor(2000)` for two
ticks. Times are local to this machine (Eastern), so `2026-12-31T23:59:50`
is 23:59:50 local, as it would be for a reader. Read out of the page:

```
[nye @1440]     label "Days left to close a 2026 acquisition."  timer 0 : 00 : 00 : 06   height 60   page clock Thu Dec 31 2026 23:59:53 GMT-0500
[nye @390]      label "Days left to close a 2026 acquisition."  timer 0 : 00 : 00 : 06   height 60
[newyear @1440] label "Happy New Year!"                          timer (none)              height 40   page clock Fri Jan 01 2027 12:00:03 GMT-0500
[newyear @390]  label "Happy New Year!"                          timer (none)              height 36
[jan2 @1440]    label "Days left to close a 2027 acquisition."  timer 363 : 23 : 59 : 55  height 60   page clock Sat Jan 02 2027 00:00:04 GMT-0500
[jan2 @390]     label "Days left to close a 2027 acquisition."  timer 363 : 23 : 59 : 55  height 60
```

(The seconds read 06 and 55 rather than 10 and 59 because the harness lets
the fake clock run a few seconds after installing it.) Three states, as
required: 2026 with the timer near zero; the greeting with no timer; 2027
with 363 days. On 1 January the banner is one line tall (40 px at 1440,
36 px at 390) because the timer is hidden; the header's `ResizeObserver`
measurement follows it, which is the existing mechanism doing its job.

No test file was added: the harness is a throwaway script against the
built output, and its output is pasted above. Say if you want it in
`scripts/`.

## Build and lint

```
npm run lint   → exit 0
npm run build  → exit 0
  [postbuild] article bodies: 10 from cache, 0 fetched
  [postbuild] wrote 26 HTML files (10 Market Notes) and sitemap.xml with 25 URLs
  [prerender] 26 of 26 routes rendered in 36.9s, 130,631 characters of body text added
```

`dist/index.html` carries `Days left to close a 2026 acquisition.` and no
`Calendar Year Ending`.

## The countdown is frozen in the prerendered HTML (out of scope, stated)

Unchanged by this order, as it says. The static HTML carries the label and
the numbers as of the build; the app replaces them the moment it hydrates.
On 1 January the 06:00 UTC rebuild bakes `Happy New Year!` into the HTML
and the 2 January rebuild replaces it with the 2027 label. Fine as it is.

## Route and data evidence

No route of this order's touches the CRM. One production detail request
was made for the finding below (one `ContentAnalytics` row); the two
builds fetched nothing.

## Scope

`src/components/layout/Header/Header.jsx`; the two PNGs beside this report
(the order asks for the screenshot in the report, and the lead reads
reports with `git show`, so this is the first time images are committed
here: 68 KB and 32 KB); and `scripts/crm-posts.cache.json`, one line, the
Falcon note's `updatedAt` moving to `23:15:09Z`, written by the build as
usual. Nothing else.

## Findings outside this order — for the lead, not acted on

1. **A correction to my WO-4.27 report.** It said every note's attribution
   was null "today" and that the committed cache held null for all ten. The
   cache files say otherwise: Joseph filled the Falcon note at
   **23:10:50Z** (its `updatedAt`), my build 2 fetched that body at
   **23:13:09Z**, and the cache committed in `e303c89` already carried the
   real credit. The fixture render was unnecessary; the real one was
   already in the built output. (The nine-note list build 1 saw at 23:10:42Z
   was that save in flight.) The audit's note that the real data existed
   was right, and the report should have said so.
2. **The cached Falcon body is now stale, and the fingerprint cannot see
   it.** At **23:15:09Z** Joseph edited the body: the hand-written
   `Photo: Duncan Kirk …` sentence is gone from the live note (4,902 → 4,550
   characters; verified with one detail request). That edit changes none of
   the fingerprinted fields, so every build reuses the 23:13Z body until
   its seven-day ceiling (29 September) or a fingerprinted field moves.
   **Until then the prerendered Falcon page shows the credit twice**, once
   in the body and once under the image. This is WO-4.25's documented gap
   arriving on day one.
3. **The list route carries `updatedAt` now.** `postbuild.mjs`'s comment
   says the list has no `updatedAt`, which is why staleness is bounded by
   time. It does have it (every list response this session included it).
   Adding `p.updatedAt` to the fingerprint makes a body edit refetch on the
   next build and turns `MAX_AGE` into a backstop. One line in
   `postbuild.mjs`; not in this order's scope and WO-4.27 is closed, so it
   waits for an order. It would also clear item 2 at the next build.
