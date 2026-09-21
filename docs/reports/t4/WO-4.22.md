---
wo: WO-4.22
terminal: T4
branch: t4/work
commit: c3e6bc1
tested_against: "site: the built output at c3e6bc1 served locally at 1440, 1280 and 390; CRM: the production deploy at https://www.pennforce.pennjets.com, which accepted three test leads — NOT a production site deploy, see Known gaps"
date: 2026-09-21
status: partial — items 5, 6, 7 and the description are with Joseph
---

# WO-4.22 report — the charter page serves New York and New Jersey

Six of the nine items are built and measured. The three that are copy, and the
meta description, are with Joseph in
`docs/drafts/t4/wo-4.22-charter-copy.md`, as the order requires.

## Commit

`c3e6bc1` WO-4.22: the charter page points at New York and New Jersey. On
`t4/work`, pushed. Not merged.

## What is done, and what is not

| Item | State |
|---|---|
| 1. Routes list, prefilled links | **done** |
| 2. Phone required | **done** |
| 3. Title | **done** — description with Joseph |
| 4. No `premier-1a.webp` hero | **done**, nothing to change |
| 5. One-line opener | **with Joseph** |
| 6. Three benefit blocks | **with Joseph** |
| 7. One repeated CTA | **with Joseph** |
| 8. Time the form | **done**, and the line is on the page |
| 9. Header phone | **done** |

## Route evidence

### 1. The routes list

Heading: **"Popular routes from New York and New Jersey"**. Seven city pairs,
no table, no distances, no block times, no aircraft classes.

Read from the rendered DOM at both 1440 and 390:

```
hasTable          : false
mentionsFLL       : false
mentionsBlockTimes: false
```

The seven, with the codes used:

| Shown | `from` | `to` |
|---|---|---|
| Teterboro → Palm Beach | TEB | PBI |
| Westchester → Palm Beach | HPN | PBI |
| Teterboro → Naples | TEB | APF |
| Teterboro → Charleston | TEB | CHS |
| Teterboro → Chicago Executive | TEB | PWK |
| Westchester → Nantucket | HPN | ACK |
| Islip → Martha's Vineyard | ISP | MVY |

**What the codes look like, since the order asks.** The form's fields are free
text, so each link prefills the same `"CODE / City"` shape the placeholders
use, for example `TEB / Teterboro`. A prefilled field reads exactly like a
typed one.

The arrow is `aria-hidden` with a screen-reader-only "to" beside it, so the
link is announced "Teterboro to Palm Beach" rather than "Teterboro right arrow
Palm Beach".

**Query parameters, not shared state**, which the order left to me. A link is
`/charter?from=…&to=…#quote`. That survives being copied, bookmarked or opened
in a new tab; component state would not. The form reads the parameters **on
change as well as on mount**, because clicking a second route while already on
the page does not remount it, and a prefill that only worked for the first
click would be worse than none.

### One route link followed through

Clicking "Teterboro → Naples":

```json
{
  "url": "/charter?from=TEB%20%2F%20Teterboro&to=APF%20%2F%20Naples#quote",
  "from": "TEB / Teterboro",
  "to": "APF / Naples",
  "phoneRequired": true,
  "phoneLabel": "Phone *"
}
```

### 2. Phone required

| | |
|---|---|
| Submit button disabled with no phone | **true** |
| Anything posted | **false** |
| Browser validation | "Please fill out this field." |

Three layers agree: the field is `required`, the submit gate includes it, and
the label reads `Phone *` like the other required fields.

The placeholders moved with the market: `TEB / Teterboro` and
`PBI / Palm Beach`, where they read `FLL / Fort Lauderdale` and
`TEB / Teterboro`.

### 3. Title, and why the description is not here

**Title: `Light & Midsize Jet Charter from NY/NJ | Penn Jets`**

**50 characters**, against the 60 the order sets. Read back from
`dist/charter.html` it counts 54, because the ampersand is escaped to `&amp;`
in the file. Fifty is the number a search engine renders.

**Description: unchanged, and with Joseph.** The order says to say so rather
than trim approved wording, and the arithmetic is why:

| | Characters |
|---|---|
| The approved 14 CFR 295.23 disclosure, in full | **352** |
| Its shortest form keeping both regulated facts | 111 |
| Leading with Teterboro, Westchester and Long Island | 49 |
| Together | **161** |

One character over 160, and that is the tightest honest version. The three
options are costed in the draft. My recommendation is to run the single
character over rather than drop Long Island.

### 4. The hero

**No hero uses `premier-1a.webp`, and none did.** The charter hero is a CSS
gradient, `bg-gradient-to-br from-gray-950 via-gray-900 to-primary-900`, with
the heading over it. `grep` for `premier-1a` in `Charter.jsx` returns nothing.
Nothing was substituted, because nothing needed to be.

### 8. How long the form takes

Measured four ways. The line goes on the page only if the slowest is under a
minute, and it is.

| Arrival | Viewport | Time to submit |
|---|---|---|
| From a route link | 1280 | **13.6 s** |
| From a route link | 390 | **16.0 s** |
| Direct, typing From and To | 1280 | **20.8 s** |
| Direct, typing From and To | 390 | **23.4 s** |

**The method, because the number is only as good as it.** Typing at 180 ms a
character, roughly 55 words a minute, with a 900 ms pause between fields for
reading the label. It is a scripted stand-in for a reader, not a user test,
and a slow or distracted person will take longer. The 390 runs include the
two-step disclosure and its Continue button.

I measured the direct-arrival case specifically because the route-link case
flatters us: it starts with two fields already filled. **The line on the page
has to be true of the slowest case, 23.4 seconds**, and it is, with room.

The page now says **"Takes under a minute."** It sits in the form's subtitle,
where a reader meets it before starting rather than after filling everything
in. The method is in a comment above the section so it can be rechecked when
the form next changes.

**It replaced a sentence Joseph struck on 2026-09-21.** The subtitle read
"Tell us the trip. We'll come back with options and a firm quote. The Premier
1A is available for charter through a licensed operator Penn Jets works with."
That last sentence is gone at his instruction and the timing line took its
place. Worth noting why it was the right thing to remove: it named a specific
aircraft as available on the page that carries the broker disclosure, which is
the same class of claim as the `premier-1a.webp` hero that item 4 of this
order exists to prevent. Item 4 was already satisfied; this was the same claim
in prose, three lines below the form, and the order did not catch it.

### 9. The header phone, and whether it doubles up

The number is in the header on every page, in the desktop cluster beside
Contact Us.

**It does not stack at 390.** The header cluster is `hidden lg:flex`, so on a
phone the header shows the logo and the menu button only. What a reader sees
at 390 on the charter page is the hero's own "Call (954) 546-0763" button and
the sticky bar's Call, which is two, and was two before this order.

So my answer to the question the order asks: **no, the header number and the
sticky bar do not read as insistent at 390, because they never appear
together.** At 1440 they do both appear, along with the footer, and at that
width the sticky bar is a thin strip at the bottom rather than a thumb target.
I would leave all three.

**If you want the number visible at 390 as well**, that is when it becomes the
third and I would drop the hero's Call button rather than the bar, since the
bar follows the reader down the page.

## Data evidence

Three test leads, all submitted through the rendered form against the
production CRM.

| What | `service` | `phone` | HTTP | `leadId` |
|---|---|---|---|---|
| Route-link fill | `charter` | 9545460763 | 200 | `cmuaqrjno003pjp04mygpldnc` |
| Direct fill | `charter` | 9545460763 | 200 | `cmuaqtcnu003zjp04287c85py` |
| No phone | — | — | **not sent** | — |

**All are test leads and deletable**, from `t4-test-422@example.com` and
`t4-test-422b@example.com`, named `Joseph Test`.

**One thing worth the lead knowing.** The desktop and phone runs at each
address returned the **same** `leadId`, so the CRM appears to deduplicate on
email rather than create a second row. Two addresses, two rows, four
submissions. That is sensible behaviour and not something I changed, but it
means a lead count is not a submission count.

The payload still carries `service: "charter"` and the six-line message the
form builds. `blogPostSlug` is absent because the charter form is not a Market
Note form and has never carried one.

## Build

```
> vite build && node scripts/postbuild.mjs && node scripts/prerender.mjs
[prerender] 25 of 25 routes rendered in 34.1s, 122,667 characters of body text added
```

Exit 0. `npm run lint` passes with `--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give.

## Scope

```
src/components/pages/Charter/Charter.jsx   routes list, prefill, phone, placeholders,
                                           the measured timing line
src/components/layout/Header/Header.jsx    the phone number, desktop cluster
src/seo/siteMeta.js                        the /charter title
docs/drafts/t4/wo-4.22-charter-copy.md     the copy, for Joseph
docs/reports/t4/WO-4.22.md                 this report
```

All within `PennJets-Development-2.0`. Nothing in the PennForce repository was
written. The only CRM effect is the test leads above.

## Known gaps

1. **Not verified on a production site deploy.** T4 does not merge.

2. **Items 5, 6 and 7 are not built.** The opener, the three blocks and the
   repeated CTA are written and queued. The page still shows the old "Why
   Charter with PennJets" section with four cards and the subtitle
   "Deal-maker expertise, white-glove execution", which is the self-description
   the order's item 5 exists to replace. It ships in that state if this merges
   before Joseph answers.

3. **The description is the old one.** It still opens "Request a private jet
   charter quote" with no geography in it, which is the thing item 3 is for.

4. **The timing is a simulation.** Four runs of a script, not four people. The
   assumptions are stated and the comment on the page records them, but nobody
   has watched a real person fill this form.

5. **I did not check the route links against a real airport list.** PBI, APF,
   CHS, PWK, ACK, MVY, HPN, ISP and TEB are the codes I used and they are the
   common ones for those fields, but the text is free-form and reaches a human,
   so a wrong code is a typo rather than a failure. Worth Joseph's eye anyway.
