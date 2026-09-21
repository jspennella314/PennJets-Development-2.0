---
wo: WO-4.19
terminal: T4
branch: t4/work
commit: ad5c9b6
tested_against: "site: the built output at ad5c9b6, served locally at 1440 and 390; the before figure is the same build with the original video restored from git and the poster removed, so the two differ only in this order's change — NOT a production deploy, see Known gaps"
date: 2026-09-21
status: reported
---

# WO-4.19 report — the hero video is 89% smaller

The home page drops by **1.3 MB**, and most of that was never picture quality.

## Commit

`ad5c9b6` WO-4.19: compress the hero video, and give it a poster. On
`t4/work`, pushed. Not merged.

## Which branch, and which route

**Portrait compression, encoded locally.**

No landscape export arrived, and the order says not to wait on one. The file
Joseph shot was compressed at its own orientation, so a landscape swap stays
available later with no work wasted.

`ffmpeg` was installed **into the scratchpad**, not the project:
`ffmpeg-static` and `ffprobe-static` under the session's own directory. It is
a build tool used once. Nothing was added to `package.json`, and nothing
ships with it.

## Route evidence

### The file

| | Before | After |
|---|---|---|
| Bytes | **1,495,647** | **163,103** |
| Stored frame | 1280x720, rotate 90 | 720x1280 |
| Displayed | 720x1280 portrait | 720x1280 portrait, unchanged |
| Duration | 3.44s | 3.44s |
| Frame rate | 30 | 24 |
| Audio | AAC, 123 kbps | **none** |
| Streams in the container | **7** | **1** |

**9.2 times smaller, 89.1% off.**

**A detail worth recording, because it is easy to get backwards.** The frame is
*stored* 1280x720 and carries a 90-degree display matrix, so players present it
as 720x1280. My WO-4.2 measurement called it "720x1280 portrait", which is what
a viewer sees and is correct; `ffprobe` reports the stored dimensions and looks
like it contradicts that. It does not. ffmpeg bakes the rotation in during the
re-encode, so the output is genuinely portrait with no matrix, and the hero
renders identically.

### Three of the four savings are not quality

| What was removed | Why it was safe |
|---|---|
| The AAC audio track, 123 kbps | The `<video>` is `muted`. Nobody has ever heard it. |
| Five data streams | Camera telemetry, carried along by the phone that shot it. |
| 30 fps to 24 fps | A 3.4-second aerial pass. A fifth of the frames, and not visible. |
| CRF 36 | The only step that trades picture, and the one checked hardest. |

Encoding ladder, all at 24 fps and all under the 200 KB target:

| | Bytes | vs source |
|---|---|---|
| CRF 34 | 198,055 | 7.6x smaller |
| **CRF 36 (chosen)** | **163,103** | **9.2x smaller** |
| CRF 38 | 138,420 | 10.8x smaller |

CRF 34 met the target only barely, at 193 KB, which is not "well under". CRF 36
leaves real margin and I could not tell it from CRF 34 or the source.

**Where I looked for the damage.** The clip is mostly a smooth sky gradient,
which is exactly where H.264 bands, and the desktop hero upscales the 720-wide
frame to 1440, which doubles any banding. I compared a 320x180 patch of sky
against the source at 3x nearest-neighbour zoom. No banding, no blocking.

### The home page

Measured by summing every response body for a cold load of `/`. Both figures
come from the same build with only this order's change between them.

| | Before | After |
|---|---|---|
| Total | **2,021,563 bytes** | **706,459 bytes** |
| Largest asset | the video, 1,495,647 | the JavaScript bundle, 362,093 |
| The video | 1,495,647 | **163,103** |
| Requests | 11 | 12 (the poster) |

**1,315,104 bytes saved, 65% off the page.** The video is no longer the
largest thing a first-time reader downloads; the JavaScript bundle is, which is
a different order's problem.

### The hero rendered

Screenshots at **1440x900** and **390x844**, taken from the built output.

At 1440 the sky gradient behind the heading is clean, the aircraft and the
ground line are sharp, and there is no blocking in the shadow under the wing.
At 390 the crop lands on a different part of the pass and is equally clean.
Nothing about the framing changed, because nothing about the framing was
touched.

### The poster

`public/videos/falcon-hero-poster.webp`, **17,358 bytes**, 720x1280, taken from
the source at 0.6 seconds.

**What I chose about autoplay, since the order asked.** The video still
autoplays. I did not defer it, because at 163 KB it is no longer the thing
worth deferring, and deferring it would leave the hero visibly empty on first
paint for the sake of a sixth of the bundle's weight. The poster does the job
the order was reaching for: it paints immediately, so first paint never waits
on video, including on a connection where the video is slow and on iOS in Low
Power Mode where autoplay is refused outright. Before this, that case showed a
black rectangle under the heading.

The video is now `aria-hidden="true"`. It is decoration, the heading carries
the meaning, and a silent three-second loop has nothing for a screen reader to
announce.

## Data evidence

n/a. No data was written by this order.

**One thing I checked rather than assumed.** The cached CRM data showed every
note's `viewCount` up by exactly two between builds, which matched my prerender
runs too well to ignore. Two tests: fetching a note's detail endpoint three
times does not move the count, and running the full prerender moves none of the
nine. The beacon interception holds. The rise was traffic.

## Build

```
> vite build && node scripts/postbuild.mjs && node scripts/prerender.mjs
[prerender] 25 of 25 routes rendered in 34.4s, 122,203 characters of body text added
```

Exit 0. `npm run lint` passes with `--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give.

## Scope

```
public/videos/Falcon-Hero-Flyover.MP4      re-encoded in place
public/videos/falcon-hero-poster.webp      new, 17,358 bytes
src/components/pages/Home/Home.jsx         poster, aria-hidden, and a comment
scripts/postbuild.mjs                       cache no longer stores viewCount
scripts/crm-posts.cache.json                those fields dropped
docs/reports/t4/WO-4.19.md                  this report
```

All within `PennJets-Development-2.0`. Nothing in the PennForce repository was
written.

## One thing outside this order that it turned up

**The CRM cache was storing `viewCount` and `leadCount`.** Nothing reads them,
they move on their own as readers arrive, and they made the committed cache
dirty after every single build. They also put the site's traffic figures into
the repository's permanent history. Both fields are dropped, and two
consecutive builds now leave the file untouched. It came from WO-4.23,
yesterday, and it was better fixed than reported.

## Known gaps

1. **Not verified on a production deploy.** T4 does not merge.

2. **The landscape question is still open and still worth Joseph's time.** The
   hero renders `h-[60vh] w-full object-cover`, so at 1440 a 720-wide portrait
   frame is scaled to double width and cropped to roughly the middle fifth of
   its height. Most of what he shot is never seen, and what is seen is
   upscaled. Compression does not change that; it just means the waste is now
   163 KB instead of 1.5 MB. A landscape export would still be a better hero.

3. **I did not crop to the visible band**, which would have saved more again by
   encoding only the strip the desktop hero shows. It changes what a phone sees,
   because the crop differs by viewport, and that is a framing decision rather
   than a compression one.

4. **No decoder-support check beyond this machine.** The output is H.264 Main
   profile, yuv420p, `+faststart`, which is the most broadly supported
   combination there is, but I verified playback in Chromium only.
