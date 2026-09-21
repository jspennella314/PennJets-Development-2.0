---
wo: WO-4.24 (follow-up)
terminal: T4
branch: t4/work
commit: af7854d
tested_against: "site: the built output at af7854d, rendered at 1280 wide from vite preview — NOT a production deploy, see Known gaps"
date: 2026-09-20
status: reported
---

# WO-4.24 follow-up — Joseph's decisions on the sweep

Joseph answered all five questions from the sweep. Four were site work and are
done. This is what changed and, as he asked, **every removal listed
individually.**

## Commit

`af7854d` Joseph's decisions on the WO-4.24 sweep: workflow, About copy, photo.
On `t4/work`, pushed. Not merged.

## 1. James Wofford is out of the deploy

> "Remove James Wofford's name and the webhook ID from the deploy workflow.
> That webhook is retired."

Removed from `.github/workflows/deploy.yml` and from the local `.env`, which is
git-ignored and was never published. Nothing in the code read the variable; the
only webhook lookup is `blogApi.js:82`, which knows Joseph's and falls back to
the contact webhook. The build still passes.

Whether that webhook should be disabled CRM-side is a PennForce question and
not a site change.

## 2. `admin@pennjets.com`

> "admin@pennjets.com isn't a mailbox. The lead is reassigning that note to me
> in the CRM."

No site work. It stopped being published the moment the author gate landed in
`f7fd879`: that note carries the house byline and routes to `joe@pennjets.com`.
When the lead reassigns it, the byline becomes Joseph automatically, because
the map is keyed on his address.

## 3. The About page

### Every change, listed

| # | What | Before | After |
|---|---|---|---|
| 1 | Section heading | "Meet Our Team" | **"Who You'll Work With"** |
| 2 | Team paragraph | "Our experienced team of aviation professionals is dedicated to providing exceptional service and expertise in every aspect of private aviation." | **removed** |
| 3 | Section heading | "Collective Expertise" | **removed** |
| 4 | Section paragraph | "Our team brings together experience across private aviation, from flight operations to deal structuring." | **removed** |
| 5 | Statistic | **"30+ Years Combined Experience"** | **removed** |
| 6 | Statistic | "24/7 Client Support" | **removed** — see below |
| 7 | Closing paragraph | "...our team is ready to provide the expertise..." | "...**PennJets is** ready to provide the expertise..." |
| 8 | Button | "Contact Our Team" | **"Contact PennJets"** |
| 9 | Our Story | "Founded in 2025 by Aviation Enthusiast Joseph Pennella, Penn Jets LLC, an emerging aviation broker." | **the approved biography** |
| 10 | Profile card | carried the same biography | **removed from the card** — see below |
| 11 | Footer link label | "Our Team" | **"Who You'll Work With"** |

**Item 6 needs your decision.** "24/7 Client Support" is not a plural or team
claim, so by your instruction it should have stayed. It was the other half of
the two-column grid inside "Collective Expertise", and removing the heading and
paragraph left it as a single statistic under a section that no longer existed.
I removed the section whole. **If you want that claim back it needs somewhere
to live**, and it is worth deciding on its own merits, since a sole broker
advertising round-the-clock support is a service claim rather than a copy one.

**Item 10 was mine, and you can have it back.** You asked for the biography in
Our Story. The profile card already carried the identical 358 characters, so
the page said the same paragraph twice, about 400 pixels apart. The card keeps
the photo, name, title, specialties and contact details. Say the word and the
card gets its paragraph back.

**Item 11 followed from item 1.** The footer linked "Our Team" to `/about#team`,
which is now headed "Who You'll Work With". The anchor still works; only the
label changed.

### The biography now has one home

It was typed into three files, which is how the page came to call you "Aviation
Enthusiast" in one paragraph and "Founder and Principal Broker" two sections
below. It now lives in `src/content/joseph.js` and is imported. The text is
byte-identical to the approved version, verified by comparison rather than by
eye: 358 characters, matching.

### Rendered, read from the live DOM

```json
{
  "headings": ["About PennJets", "Our Story", "Who You'll Work With",
               "Joseph Pennella", "Professional Services", "Ready to Work With Us?"],
  "pluralHits": [],
  "bioAppearances": 1,
  "aviationEnthusiast": false,
  "brokenImages": [],
  "photoSrc": "/images/Meet-The-Team/joseph-pennella-256.webp"
}
```

Full-page screenshot taken at 1280 wide.

### Five more "our team" claims, off the About page, untouched

You scoped this to the About page, so these are reported rather than changed:

| File | Line | Text |
|---|---|---|
| `BlogList.jsx` | 117 | "insights from our team of aviation professionals" |
| `Contact.jsx` | 158 | "Our team of experts" |
| `Compliance.jsx` | 177 | "Our team stays informed about evolving requirements" |
| `PennShare.jsx` | 277 | "Our team will contact you within 24 hours" |
| `Services.jsx` | 352 | "Connect with our team of aviation professionals" |

Same claim, same problem, five other pages. Say the word and they go in one
change.

## 4. The photo

> "Resize my photo for a 128px circle (256px source for retina)."

| | Before | After |
|---|---|---|
| File | `JOSEPH-PENNELLA.JPEG` | `joseph-pennella-256.webp` |
| Dimensions | 4000 x 6000 | 256 x 256 |
| Bytes | **8,856,577** | **11,894** |

745 times smaller, 99.87% off, on a page that renders it at 128 pixels.

Cropped on the centre, which is where `object-fit: cover` was already cropping
it, so the framing on the card does not change. The original is removed from
`public/` and is recoverable with:

```
git checkout 9375b30 -- public/images/Meet-The-Team/JOSEPH-PENNELLA.JPEG
```

## Build

```
> vite build && node scripts/postbuild.mjs
✓ built in 3.25s
```

Exit 0. ESLint passes with `--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give.

## Scope

```
.github/workflows/deploy.yml                    the Wofford variable removed
.env                                            same, local and git-ignored
src/content/joseph.js                           new, the approved name/title/bio
src/components/pages/About/About.jsx            eleven copy and layout changes
src/components/layout/Footer/Footer.jsx         the team link label
public/images/Meet-The-Team/joseph-pennella-256.webp   new
public/images/Meet-The-Team/JOSEPH-PENNELLA.JPEG       deleted
docs/reports/t4/WO-4.24-followup.md             this report
```

All within `PennJets-Development-2.0`. Nothing in the PennForce repository was
written.

## Known gaps

1. **Not verified on a production deploy.** T4 does not merge.

2. **Our Story sits in half an empty row.** Its section is a two-column grid
   with one child, so the paragraph occupies the left half and the right half
   is blank. This predates these changes and is not something the order
   covered, so I left it. It is the same shape of problem as the team grid and
   is a one-line fix whenever you want it.

3. **"24/7 Client Support" is removed and has no decision behind it.** Item 6
   above. I would rather say that plainly than let it disappear into a list.

4. **The five off-page "our team" claims are live.** Item list above. The About
   page is now consistent; the rest of the site is not.
