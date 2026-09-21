# WO-4.24 — the name and address sweep, for Joseph

**For relaying to `docs/orders/joseph.md`.** T4 cannot write there.

Charles Brennan and Joe DeLisio are gone, committed at `f7fd879`. That part is
done and is not a question. **This is the second half of the order: everything
else the sweep found, reported and not touched.**

The sweep covered `src`, `public`, `index.html`, `scripts`, `.github` and the
env files: author data, structured data, meta tags, alt text, image filenames,
code comments and the legal pages.

**Nothing below has been changed.** Each line is my opinion and your decision.

---

## 1. One thing I think you should act on

### `.github/workflows/deploy.yml:38` — James Wofford is still in the deploy

```yaml
VITE_WEBHOOK_JAMES_WOFFORD: cmi7ljjpj0005vses5l113dpe
```

He was removed from the site in Round 3. His name survived in the build
configuration, which is a tracked file in this repository, and it carries a
live webhook ID that posts leads into the CRM.

**Nothing reads this variable.** The only webhook lookup in the code is
`blogApi.js:82`, which knows `VITE_WEBHOOK_JOE_PENNELLA` and falls back to
`VITE_CONTACT_WEBHOOK_ID`. The Wofford value is passed into every build and
used by nothing.

**My opinion: remove the line.** It is a departed person's name in a published
repository, and a credential for a route no page can reach. Removing it cannot
break anything, because nothing reads it.

Two things I did not do, because they are yours, not a site change:

- The same variable is in your local `.env`, which is git-ignored, so it is
  not published. Worth deleting when you are next in that file.
- Whether that **webhook should be disabled in the CRM** is a PennForce
  question. If it stays enabled, it accepts leads from anyone who has the ID.

---

## 2. A fifth dead address, which WO-4.20 could not have found

One of your published Market Notes, the Pilatus PC-12 NGX one, was authored
in the CRM by the **`Admin User`** service account. Until this commit the
site printed "Admin User" as the byline, and under it a reply-to address of
**`admin@pennjets.com`**.

Both are gone now, because that note publishes under the house byline and
routes to you. **But it is worth knowing how it survived WO-4.20.** That
order proved itself by grepping the build output, and this address is not in
the build output. It arrives over the network from the CRM when the page
loads. No grep of this repository could ever have seen it.

That is the general lesson, not the specific one: **an address that comes
from the CRM is published by this site just as surely as one typed into a
page, and none of my repository evidence covers it.**

Two things for you, neither a site change:

- **Reassign that note in the CMS** if you want your name on it. Authorship
  is yours; the order put it out of my scope and I have not touched it.
- **Is `admin@pennjets.com` a real mailbox?** If it is a service account
  nobody reads, it is the same silent-loss problem as the other four, and it
  will reappear on any note that account authors in future.

---

## 3. Consequences of this order that are copy, so they are yours

Removing two of three people leaves the About page making plural claims about
one person. I did not rewrite any of it. The team card itself now centres
rather than sitting in the left third of an empty three-column grid, which was
layout, not copy.

| Where | What it says now | Why it reads wrong with one person |
|---|---|---|
| `About.jsx:68` | "Meet Our Team" | a heading over a single card |
| `About.jsx:70` | "Our experienced team of aviation professionals is dedicated to providing exceptional service..." | "team ... professionals", plural, above one card |
| `About.jsx:144` | "Collective Expertise" | collective of one |
| `About.jsx:146` | "Our team brings together experience across private aviation, from flight operations to deal structuring" | "brings together" across one person, and "flight operations" is not something Penn Jets does |
| `About.jsx:153` | **"30+ Years Combined Experience"** | "combined" across one person, and I have no source for 30 years |

**"30+ Years Combined Experience" is the one I would fix first.** It was a
claim about three people. It is now a claim about you alone, and it is the
kind of number a buyer checks. I have no evidence for it either way, which is
why I left it rather than guessing at a smaller number.

Give me wording for these five and I will apply them as one small change.

### One more piece of copy, unrelated to the removals

`About.jsx:48`, in "Our Story":

> "Founded in 2025 by Aviation Enthusiast Joseph Pennella, Penn Jets LLC, an
> emerging aviation broker."

Two problems. It is not a sentence, it has no verb after the comma. And
"Aviation Enthusiast" is a different title from the one you set everywhere
else, **"Founder and Principal Broker"**. A reader who scrolls from this
paragraph to your card sees two different descriptions of you.

---

## 4. A weight problem the sweep turned up

`public/images/Meet-The-Team/JOSEPH-PENNELLA.JPEG` is **8,856,577 bytes**.

It is fetched on every load of `/about` and rendered into a circle 128 pixels
across. It is by a wide margin the heaviest thing on the site: roughly six
times the hero video that WO-4.19 exists to compress, and about six times the
whole home page after WO-4.17.

A 96-pixel WebP of the same photo already exists at 7,766 bytes, made for the
Market Note byline. The About card needs a larger one than that, not the
original.

**My opinion: this deserves its own order**, because it is an image job rather
than a name job, and because the right sizes should be measured rather than
guessed. I have not touched it.

---

## 5. Everything else the sweep found, and why I think it stays

### Addresses

Every address written into this repository is now `joe@pennjets.com`, in
eleven published places, after WO-4.20. No dead address remains anywhere in
the build. The one address that was not written into this repository is in
section 2.

Three hits for `info@pennjets.com` are **inside code comments** at
`Footer.jsx:158`, `Home.jsx:138` and `blogApi.js:292`. They are the
explanatory notes WO-4.20 asked for, recording what was replaced so whoever
splits the aliases back out knows it was deliberate. They are not published
and do not appear in the build. **Stay.**

### Your own name

| Where | What it is |
|---|---|
| `About.jsx:11, 14, 48` | your card and the story paragraph |
| `blogApi.js:247, 249` | your entry in the author map |
| `blogApi.js:82`, `deploy.yml:37` | `VITE_WEBHOOK_JOE_PENNELLA`, the live lead route |
| `NoteBody.jsx:11` | a code comment, showing the pull-quote syntax with your name as the sample |
| `JOSEPH-PENNELLA.JPEG`, `joseph-pennella-96.webp` | published image paths |

**All stay.** You are the only person named on the site, which is the standing
decision these two removals were finishing.

`NoteBody.jsx:11` is worth one line of explanation, since the order asked
specifically about names in comments. It reads `> A sentence worth setting
apart. — Joseph Pennella`, as the example of how a pull quote is typed. It is
a sample in a comment, not published, and using a real name makes the example
readable. **Stays**, but if you would rather no name appeared in sample data
at all, say so and I will change it.

### Nothing else

No other personal name appears anywhere in `src`, `public`, `index.html`,
`scripts` or `.github`. Steven Smyth and James Wofford are absent from the
site's source entirely; the only surviving trace of either is the deploy
variable in section 1.

---

## What I need from you

1. **The Wofford line in `deploy.yml`** — remove, or leave?
2. **`admin@pennjets.com`** — a real mailbox, or another dead one? And do
   you want the Pilatus note reassigned to yourself in the CMS?
3. **Wording for the five About items** in section 3, particularly the 30+
   years claim.
4. **The "Aviation Enthusiast" sentence** — rewrite it, or leave it?
5. **The 8.4 MB photo** — want this written as its own order?

Items 3 and 4 are the only ones where the site still says something I think
a buyer would notice. Nothing is blocked on you; I am continuing down
the queue.
