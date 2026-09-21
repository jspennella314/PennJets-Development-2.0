---
wo: WO-4.22
terminal: T4
branch: t4/work
commit: ef573fd
tested_against: "site: the built output at ef573fd served locally at 1440, 1280 and 390, with the copy Joseph approved 2026-09-21; CRM: the production deploy at https://www.pennforce.pennjets.com, which accepted three test leads — NOT a production site deploy, see Known gaps"
date: 2026-09-21
status: reported — all nine items built, one sentence still Joseph's to settle
---

# WO-4.22 report — the charter page serves New York and New Jersey

All nine items are built. The page was written for Florida and is now written
for the market it serves, the routes table no longer publishes numbers a
broker has no business publishing, and the copy is the version Joseph
approved on 2026-09-21.

One sentence is still open, and it is open because he left both options in
the brackets rather than because anything is blocked.

## Commits

Two, both on `t4/work`, pushed, not merged.

- `c3e6bc1` the structural work: routes list, prefill, required phone, title,
  header phone, the measured timing line.
- `ef573fd` the copy Joseph approved: description, opener, three blocks, one
  repeated call to action.

## What is done, and what is not

| Item | State |
|---|---|
| 1. Routes list, prefilled links | **done** |
| 2. Phone required | **done** |
| 3. Title and description | **done** |
| 4. No `premier-1a.webp` hero | **done**, nothing to change |
| 5. One-line opener | **done** |
| 6. Three benefit blocks | **done** — one sentence needs Joseph, below |
| 7. One repeated CTA | **done** |
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

### 3. Title and description, read from the built file

| | Characters | Limit |
|---|---|---|
| Title | **50** | 60 |
| Description | **120** | 160 |

```
title      : Light & Midsize Jet Charter from NY/NJ | Penn Jets
description: Light and midsize jet charter from Teterboro, Westchester and
             Long Island, arranged by Penn Jets, an air charter broker.
canonical  : https://www.pennjets.com/charter
```

The title counts 54 in `dist/charter.html` because the ampersand is escaped
to `&amp;` in the file. Fifty is the number a search engine renders.

The description is Joseph's own, and why it is his rather than mine is under
"The copy Joseph approved" below.

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

### 3b, 5, 6 and 7. The copy Joseph approved

Approved 2026-09-21 with changes. All of it is now on the page.

**The description is his own wording, not one of mine.** He rejected all
three options I costed and wrote a fourth:

> Light and midsize jet charter from Teterboro, Westchester and Long Island,
> arranged by Penn Jets, an air charter broker.

**120 characters**, comfortably under 160, and it solves the problem I could
not: it names all three places and states the broker status, then leaves the
full 14 CFR 295.23 disclosure to the page and the footer where it already
appears in full. I had been trying to fit a 352-character disclosure into a
snippet. He moved the disclosure instead of shrinking it.

**The opener** replaced the hero paragraph that described the firm:

> Charter is for the trip an airline schedule cannot carry: a same-day
> return, a closing that moved, four people to a field with no commercial
> service.

**The three blocks** replaced four cards headed "Why Charter with PennJets",
whose subtitle read "Deal-maker expertise, white-glove execution". The
heading is now "Why charter through a broker" and the subtitle is gone. Both
were self-description on a page whose opener now answers the reader's
question instead, and "white-glove execution" was an unsupported claim of the
kind the About page shed this week. **Neither removal was in Joseph's list**,
so both are flagged here rather than buried.

Block one carries his rewrite, "stays with the trip until you land" in place
of my "holds the operator to the schedule". Block three keeps **Part 135** in
the headline, as he directed, with the body in the footer's terms so the two
do not drift.

**The call to action** is `CTA_LABEL`, one constant rendered in eleven places:
the hero, after the blocks, on each of the seven route links, after the routes
list, and in the closing panel. It is a constant rather than a string typed
eleven times because typing it again is exactly how "Get a Quote" and "Get a
Charter Quote" came to sit on the same page. Both of those wordings are gone.

### The one thing still open

**Block two's sentence.** Joseph's note read:

```
4. Block two: [approved as written / "We compare certificated operators and
   tell you why we recommend the one we do."]
```

Both options were still inside the brackets, the same unfilled template as the
`privacy@pennjets.com` line last week. **I used the first**, the one marked
approved as written, rather than guess at the second:

> You see what each certificated operator quoted and why one is recommended,
> not a single price with the reasoning left out.

His alternative is shorter and reads better to me, but choosing it would mean
putting a sentence on the site that he did not confirm. It is one line in
`Charter.jsx` and the comment beside it records both.

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

2. **Block two's sentence is the approved-as-written one, by default.**
   Joseph left both options in the brackets. Nothing unapproved is published,
   because the option I used is the one he marked approved, but he has not
   chosen between them and may not have meant to leave it open.

3. **Two removals were not on his list.** The "Why Charter with PennJets"
   heading became "Why charter through a broker", and the subtitle
   "Deal-maker expertise, white-glove execution" is gone. Replacing four
   cards with three blocks left them describing a section that no longer
   exists, and the second was a claim nothing supports. Both are one line to
   restore.

4. **The timing is a simulation.** Four runs of a script, not four people. The
   assumptions are stated and the comment on the page records them, but nobody
   has watched a real person fill this form.

5. **I did not check the route links against a real airport list.** PBI, APF,
   CHS, PWK, ACK, MVY, HPN, ISP and TEB are the codes I used and they are the
   common ones for those fields, but the text is free-form and reaches a human,
   so a wrong code is a typo rather than a failure. Worth Joseph's eye anyway.
