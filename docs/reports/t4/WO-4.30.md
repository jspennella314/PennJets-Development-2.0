---
wo: WO-4.30
terminal: T4
branch: t4/work
commit: 7f159d0
tested_against: "site: npm run build at 7f159d0 on this machine (Node v22.19.0, exit 0, 26 of 26 routes prerendered); the hero read from the built dist/charter.html served locally with JavaScript off. No CRM involvement."
date: 2026-09-23
status: reported
---

# WO-4.30 report — charter hero: the heading and the opener

Two hunks in `Charter.jsx`, Joseph's copy verbatim. Nothing else on the
page changed.

## Commit

`7f159d0` WO-4.30: charter hero reads "Travel, Simplified." with Joseph's
one-line opener. On `t4/work`, pushed.

## The diff

```diff
-          <h1 className="text-3xl font-semibold sm:text-5xl">Charter, Simplified.</h1>
+          <h1 className="text-3xl font-semibold sm:text-5xl">Travel, Simplified.</h1>
           {/*
             Who charter is for, not what Penn Jets is. It replaced
             …
-            are on the right page. Approved by Joseph 2026-09-21.
+            are on the right page. Approved by Joseph 2026-09-21. Shortened to
+            one sentence pair, and the heading changed from "Charter,
+            Simplified.", both approved by Joseph 2026-09-22 (WO-4.30).
           */}
           <p className="mt-3 text-base sm:text-lg">
-            Charter is for the trip an airline schedule cannot carry: a same‑day
-            return, a closing that moved, four people to a field with no
-            commercial service.
+            You have somewhere to be. We&#39;ll get you there.
           </p>
```

`&#39;` for the apostrophe, as the file already does. The 2026-09-21
history stays in the comment with the new date added.

## The built page

From `dist/charter.html`:

```
<h1 class="text-3xl font-semibold sm:text-5xl">Travel, Simplified.</h1>
You have somewhere to be. We'll get you there.
```

```
grep -rn "Charter, Simplified" src dist index.html   → no matches (0 files)
```

## UI evidence

The built output served locally, JavaScript off, read from the page:

```
[@1440] h1 "Travel, Simplified." (672x48 @y255)   p "You have somewhere to be. We'll get you there." (672x28, 1 line)   both in viewport
[@390]  h1 "Travel, Simplified." (358x36 @y157)   p "You have somewhere to be. We'll get you there." (358x48, 2 lines)  both in viewport
```

At 1440 both lines sit on one line each, in the hero, above the two
buttons. At 390 the heading fits on one line and the opener wraps once,
after "get you", leaving `there.` alone on the second line. That is an
ordinary wrap of a 46-character sentence at phone width, not a bad one;
saying so per the order, and not restyling. Screenshots are in this
session's scratchpad (`wo-4.30-charter-1440.png`, `-390.png`); not
committed, since nothing here needs a decision.

## Build and lint

```
npm run lint   → exit 0
npm run build  → exit 0
  [postbuild] article bodies: 10 from cache, 0 fetched
  [postbuild] wrote 26 HTML files (10 Market Notes) and sitemap.xml with 25 URLs
  [prerender] 26 of 26 routes rendered in 76.2s, 130,527 characters of body text added
    /charter   0 -> 3693 chars
```

## Route and data evidence

n/a. No route called; no rows written.

## Scope

`src/components/pages/Charter/Charter.jsx`, two hunks. `siteMeta.js` (title
and description), the three blocks, the routes list, the CTA label, the
timing line, the form and the sticky bar: untouched.

## Known gaps

None.
