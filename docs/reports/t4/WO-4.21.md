---
wo: WO-4.21
terminal: T4
branch: t4/work
commit: 1eb457a
tested_against: "site: the working tree at 1eb457a; no build needed, and none of the retained files changed"
date: 2026-09-21
status: reported
---

# WO-4.21 report — the video stays, and now says why

Nothing was removed. The reason Joseph kept the file is recorded where the
next person to consider deleting it will be standing.

## Commit

`1eb457a` WO-4.18 and WO-4.21: dropdown labels, and a reason not to delete a
video. On `t4/work`, pushed. Not merged.

## Route evidence

### The file is present and unchanged

```
$ ls -l public/videos/
1,495,647  Falcon-Hero-Flyover.MP4     the hero in use, WO-4.19's subject
1,594,832  Falcon-Hero-Flyover3.mp4    retained, referenced by nothing
```

### Where the reason is recorded

**Not in `public/videos/`, and that is deliberate.** Vite copies that
directory into every build, so a `README.md` there would be published at
`pennjets.com/videos/README.md`. The note sits instead in
`src/components/pages/Home/Home.jsx`, immediately above the only `<video>` tag
on the site, which is where someone auditing video assets is already looking:

```jsx
{/*
  public/videos/ holds a second file, Falcon-Hero-Flyover3.mp4, that
  nothing references. It is 1,594,832 bytes and it ships in every build.

  KEEP IT. Joseph decided on 2026-09-20, after it was put forward for
  deletion: "keep it, I may use it." It is footage he shot himself.

  An unreferenced 1.5 MB video is exactly what an asset audit flags, so
  this note exists to be found before someone deletes it correctly and
  irreversibly. WO-4.21.
*/}
<header className="relative">
  <video src="/videos/Falcon-Hero-Flyover.MP4"
```

**The repository has no assets register**, which the order asked me to say if
it were true. `docs/` holds the site audit, the Market Note template, drafts
and reports; none is a list of what may not be deleted. The code comment is
the smallest thing that works rather than a new system, and if the lead would
rather this live in `CLAUDE.md`, the comment can point there instead.

## Data evidence

n/a. No data was written. No build was run for this order.

## Tests

No test suite exists in this repository, so there is no count to give.

## Other unreferenced assets, reported and untouched

The order says to report any others found. **Thirteen files under `public/`
are referenced by nothing in `src`, `scripts`, `index.html`, or the CRM's own
article bodies. Together they are 16,771,974 bytes**, and all of them ship in
every build and are live on production.

| Bytes | File |
|---|---|
| **8,405,440** | `/images/E55-BARON-HOME/E55-BARON-HOME.JPEG` |
| 2,129,862 | `/images/Hawker-sunset.png` |
| 1,594,832 | `/videos/Falcon-Hero-Flyover3.mp4` — **retained deliberately** |
| 1,056,130 | `/images/PENNSHARE/AIRCRAFT1324.png` |
| 824,526 | `/images/HAWKER-800-XP/IMG_3176.JPEG` |
| 814,057 | `/images/HAWKER-800-XP/IMG_3169.JPEG` |
| 806,288 | `/images/day-flight.jpg` |
| 468,208 | `/images/HAWKER-800-XP/Hawker-800-xp-home.jpg` |
| 468,208 | `/images/Hawker-night - Copy.jpg` |
| 69,118 | `/Aircraft Specs/Secifications_N400HH.pdf` |
| 53,736 | `/images/PENNSHARE/HAWKER-800XP.jpg` |
| 52,445 | `/images/PENNSHARE/HAWKER-800XP1.jpg` |
| 29,124 | `/images/premier-1a-exterior.jpg` |

Three things worth Joseph's eye rather than a bulk deletion:

- **The single 8.4 MB Baron photo** is the largest file in the repository now
  that his own photo has been resized. Nothing links to it.
- **Five of the thirteen are Hawker files.** `CLAUDE.md` records that the
  Hawker is gone from the site. The pages went; the images stayed.
- **`Secifications_N400HH.pdf`** is a specification sheet for a tail number,
  spelled with the `p` missing. It is reachable by anyone who guesses the URL
  even though no page links to it, and a specification sheet for a specific
  aircraft is the kind of document that should be published on purpose or not
  at all.

**I deleted none of them.** WO-4.21 exists precisely because the last
confident deletion of an unreferenced file was wrong, and two of these look
like they belong to decisions I was not part of.

## Scope

```
src/components/pages/Home/Home.jsx    the retention note
docs/reports/t4/WO-4.21.md            this report
```

Nothing was deleted. Nothing in the PennForce repository was written.

## Known gaps

1. **"Referenced by nothing" is a text search**, across `src`, `scripts`,
   `index.html` and the cached CRM article bodies, matching both the filename
   and its public path. An asset assembled from a constructed string would not
   be found by it. I spot-checked the largest five by hand and none is
   referenced, but the method has that limit and the list should be read as a
   starting point rather than a delete queue.

2. **The retention note is in one file.** If the hero video is ever removed
   from the home page, the note goes with it. Recording it in `CLAUDE.md`, as
   the order offers, would outlive that.
