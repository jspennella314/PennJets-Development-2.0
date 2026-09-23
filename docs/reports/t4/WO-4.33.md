---
wo: WO-4.33
terminal: T4
branch: t4/work
commit: 6b72e15
tested_against: "site: npm run build at 6b72e15 on this machine (Node v22.19.0, exit 0, 26 of 26 routes prerendered), the built output served by vite preview on localhost:4173 at 1440x900 and inside a 390x844 frame. No CRM evidence crosses the boundary in this order — the prerender answered every article fetch from cache and reached the CRM zero times. NOT a production deploy; T4 does not merge."
date: 2026-09-23
status: reported — built and evidenced under one stated assumption (below); the framing question the order set out to close is still open and is Joseph's
---

# WO-4.33 report — the hero encoded from the phone original

**The order's premise is wrong, and I built under a stated assumption
rather than stopping.** `IMG_3379.MOV` is not landscape footage. It is the
same portrait clip WO-4.19 compressed, at full resolution. I encoded it at
its real orientation, 1080x1920, at Joseph's 2 Mbps target, and everything
else in the order is delivered as written. What this does **not** do is fix
the crop WO-4.19 described, because no landscape frame exists to fix it
with. Read "The premise" first; the rest is the evidence the order asked for.

## Commit

`6b72e15` WO-4.33: hero video encoded from the phone original at full
1080x1920. On `t4/work`, pushed. Not merged.

```
$ git show --stat --format= 6b72e15
 .gitignore                                 |   5 ++++-
 public/videos/Falcon-Hero-Flyover-1080.mp4 | Bin 0 -> 840339 bytes
 public/videos/Falcon-Hero-Flyover.MP4      | Bin 163103 -> 0 bytes
 public/videos/falcon-hero-poster-1080.webp | Bin 0 -> 33344 bytes
 public/videos/falcon-hero-poster.webp      | Bin 17358 -> 0 bytes
 src/components/pages/Home/Home.jsx         |  17 ++++++++++++-----
 6 files changed, 16 insertions(+), 6 deletions(-)
```

Exactly the MP4, the poster, `Home.jsx`, `.gitignore` and the two
deletions. `Falcon-Hero-Flyover3.mp4` and its note in `Home.jsx` are
untouched (WO-4.21).

## The premise — the source is portrait

`ffprobe` on the source, video stream only:

```
codec_name=h264  profile=High  width=1920  height=1080  pix_fmt=yuv420p
r_frame_rate=30000/1001  bit_rate=13295948  nb_frames=104
TAG:rotate=90
displaymatrix=  rotation=-90
```

Stored 1920x1080 **with a 90-degree display matrix.** A player rotates it
and shows 1080x1920. The order read the stored dimensions ("1920x1080, 13
Mbps, 3.4 s") and called it landscape; that is the exact trap WO-4.19's
report recorded for the 720p file ("stored 1280x720, rotate 90 … presented
as 720x1280"). This file is the same clip, the same 3.44 seconds, the same
pass — the phone's full-resolution original of what WO-4.19 had a 720x1280
export of.

I looked rather than trusted the tag. A frame pulled with `-noautorotate`
(the stored orientation) shows the aircraft on its side and the hangar
running up the right-hand edge; the same frame with the rotation applied
is upright. A contact sheet of the whole clip at the stored orientation is
sideways start to finish. There is no landscape footage in this file.

**What I did with that.** The order's mechanics — encode from this source
at ~2 Mbps, poster from the same frame, delete the old pair, repoint
`Home.jsx`, ignore the `.MOV` — do not depend on the orientation, so I did
them at the file's real orientation. The order's *purpose* — a hero that
shows more of what Joseph shot instead of the middle fifth of a portrait
frame — cannot be met from this file, and the only ways to make a 1920x1080
output from it are to ship the sideways frame or to crop a 16:9 band out of
the portrait one. The crop is the framing decision WO-4.19's gap 3 said was
Joseph's, and I did not take it. Two things worth knowing before he does:

- **A landscape crop would not be sharper on desktop than this encode.** At
  1440 wide the hero is `object-cover` into a 1440x720 box (`80vh` at 900).
  This 1080x1920 encode is scaled 1.33x to 1440 wide and the middle 720 rows
  are shown. A 1920x1080 output cropped from a 1080x608 band of the same
  source would be scaled *down* to 1440x810 and the middle 720 shown — the
  same 1.33x upscale from the same source pixels, because the band would
  have been upscaled 1.78x to make it 1920 wide in the first place. The
  crop buys nothing at 1440 and costs the phone view, which today gets the
  full portrait frame at native resolution.
- **On screen, nothing about the framing changed.** `object-cover` centres,
  so the desktop band is the same band WO-4.19 showed, now from 1080 source
  columns instead of 720. The 1440 screenshot below is the proof: same
  composition, sharper aircraft.

So: this is the right encode of the file that was supplied, and the
landscape question is unchanged from WO-4.19's gap 2. If Joseph has a
landscape take, the pipeline here re-runs on it in minutes. If he wants the
16:9 crop of this one, that is an order with a band in it.

## Route evidence

### The encode

`ffmpeg-static` 6.0 and `ffprobe-static` in the session scratchpad, nothing
added to `package.json`. Command, minus paths:

```
ffmpeg -i IMG_3379.MOV -an -map 0:v:0 -c:v libx264 -profile:v high \
  -pix_fmt yuv420p -preset slow -crf 28 -movflags +faststart \
  Falcon-Hero-Flyover-1080.mp4
```

Default autorotate on, so the display matrix is applied and baked in; the
output carries no rotation tag.

| | Source `IMG_3379.MOV` | Output `Falcon-Hero-Flyover-1080.mp4` | Old `Falcon-Hero-Flyover.MP4` (WO-4.19) |
|---|---|---|---|
| Bytes | **5,956,307** | **840,339** | 163,103 |
| Stored frame | 1920x1080, rotate 90 | 1080x1920, no rotation | 720x1280 |
| Displayed | 1080x1920 portrait | 1080x1920 portrait | 720x1280 portrait |
| Codec / profile / level | H.264 High / 4.0 | H.264 High / 5.0 | H.264 Main |
| Pixel format | yuv420p | yuv420p | yuv420p |
| Frame rate | 29.97 | **29.97** | 24 |
| Frames | 104 | 104 | 84 |
| Video bitrate | 13,295,948 | **1,936,822** | 373,243 |
| Duration | 3.438 s | 3.47 s | 3.459 s |
| Streams in the container | 5 (video, AAC, 1 unknown audio, 2 data) | **1** | 1 |
| `+faststart` | — | yes | yes |

**CRF 28, 1.94 Mbps, 840 KB.** The ladder I chose from, all High profile,
`preset slow`, no audio:

| | 24 fps | 29.97 fps |
|---|---|---|
| CRF 22 | 1,860,142 (4.25 Mbps) | — |
| CRF 24 | 1,372,089 (3.14 Mbps) | 1,432,059 (3.30 Mbps) |
| CRF 26 | 1,038,082 (2.37 Mbps) | — |
| CRF 27 | — | 952,656 (2.20 Mbps) |
| **CRF 28** | 801,226 (1.83 Mbps) | **840,339 (1.94 Mbps)** |
| two-pass ABR 2000k | 942,134 (2.15 Mbps) | 906,683 (2.09 Mbps) |

**Frame rate: the native 29.97 kept, not 24.** The order allowed 24 if I
could see no difference. I did not need to make that call: at CRF 24 the
30 fps encode is 4.4% larger than the 24 fps one (1,432,059 vs 1,372,089).
Motion-compensated frames on a smooth pan cost almost nothing, so dropping
a fifth of them saved almost nothing. 104 frames for 39 KB is the better
trade, and it is what the phone recorded.

**Where I looked for the damage**, as WO-4.19 did. A 320x180 patch of open
sky at 1.5 s, source beside CRF 28 at 3x nearest-neighbour zoom: the
source already carries faint macroblock texture from the phone's own 13
Mbps encoder, and CRF 28 is if anything smoother — no banding introduced,
no new blocking. A 540x540 patch on the aircraft at the same instant: the
wing leading edge, the engine nacelle and the registration are as sharp in
the output as in the source. Level 5.0 is what x264 chose for 1080x1920 at
29.97 with `preset slow`'s reference frames; every iPhone since the 6 and
every current desktop browser decodes it.

### The poster

`public/videos/falcon-hero-poster-1080.webp`, **33,344 bytes**, 1080x1920,
libwebp quality 75, from the source at **0.6 s** — WO-4.19's frame choice,
kept: the aircraft is fully in frame, climbing, clear of the hangar roof.

```
ffmpeg -ss 0.6 -i IMG_3379.MOV -frames:v 1 -c:v libwebp -quality 75 falcon-hero-poster-1080.webp
```

### The page weight, stated plainly

Cold load of `/` from the built output: the 11 requests Chrome made, read
from the network panel, plus the video element's own fetch, each summed at
its byte size on disk.

| | WO-4.19 | Now |
|---|---|---|
| Video | 163,103 | **840,339** |
| Poster | 17,358 | 33,344 |
| JavaScript bundle | 362,093 | 362,859 |
| Everything else (HTML, CSS, font, logo, 5 aircraft cutouts) | ~163,900 | 164,615 |
| **Total** | **706,459** | **1,401,157** |

**+694,698 bytes, roughly double the page, and the video is the largest
asset again.** That is the number the order asked for and Joseph's choice
made knowingly: ~2 Mbps × 3.4 s. Not re-argued here. For the record it is
still 620 KB under the page as it stood before WO-4.19 (2,021,563).

## Data evidence

n/a. No data was written. The prerender's two runs each answered all 10
article fetches from cache and intercepted all 10 beacons; the CRM was not
reached and no `ContentAnalytics` row was written. `scripts/crm-*.cache.json`
are unchanged by this order (not in the commit, not dirty after two builds).

## UI evidence

`docs/reports/t4/wo-4.33-hero-1440.jpg` — 1440x900, the built output. The
heading, both paragraphs and both buttons sit on the sky; the aircraft fills
the right third, climbing, sharp at the nacelle and the wing tip. Same band
of the pass WO-4.19 showed.

`docs/reports/t4/wo-4.33-hero-390.jpg` — 390x844, the built output framed
at exactly 390 CSS pixels (the Chrome window would not resize below its
minimum, so the page is loaded in a 390x844 iframe from a scratchpad
harness; the site is unaware of the frame). The hero is the full portrait
frame downscaled, aircraft mid-frame above the buttons, the hangar roof
along the bottom edge of the `60vh` box. Nothing wraps differently from
WO-4.30's 390 capture; the hero copy was not touched.

The prerendered `dist/index.html` and the bundle reference only the new
pair:

```
$ grep -o 'videos/[A-Za-z0-9._-]*' dist/index.html dist/assets/*.js | sort -u
videos/Falcon-Hero-Flyover-1080.mp4
videos/falcon-hero-poster-1080.webp
```

## Build

Two builds at `6b72e15`, both exit 0. The second, in full for the summary
lines:

```
✓ built in 2.68s
[postbuild] article bodies: 10 from cache, 0 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
[postbuild] wrote 26 HTML files (10 Market Notes) and sitemap.xml with 25 URLs
[prerender] 26 of 26 routes rendered in 34.1s, 130,290 characters of body text added
[prerender] 10 view beacon(s) intercepted; none reached the CRM.
[prerender] 10 article fetch(es) answered from cache; none reached the CRM, so none wrote a ContentAnalytics row.
```

`npm run lint` (`eslint . --ext js,jsx --max-warnings 0`): exit 0, no
output.

## The `.MOV` is ignored, not committed

```
$ git status --short          (after the commit)
?? public/images/Gallery/Dassault_Falcon_900B.jpg
?? public/images/Gallery/Falcon900B_no_registration.png

$ git check-ignore -v public/videos/IMG_3379.MOV
.gitignore:52:public/videos/*.MOV	public/videos/IMG_3379.MOV
```

`.gitignore` gained three lines: a two-line comment and `public/videos/*.MOV`.
The file is in `public/`, so a local build copies it into `dist/` (5.9 MB,
confirmed present in `dist/videos/`); the deployed build checks out the
repository and never sees it. The two Gallery images are Joseph's, untracked
before this session and left exactly as found — not this order's.

## Tests

No test suite exists in this repository.

## Scope

```
.gitignore                                  +3 lines
public/videos/Falcon-Hero-Flyover-1080.mp4  new, 840,339 bytes
public/videos/falcon-hero-poster-1080.webp  new, 33,344 bytes
public/videos/Falcon-Hero-Flyover.MP4       deleted
public/videos/falcon-hero-poster.webp       deleted
src/components/pages/Home/Home.jsx          src, poster, comment (one hunk)
docs/reports/t4/WO-4.33.md                  this report
docs/reports/t4/wo-4.33-hero-1440.jpg       evidence
docs/reports/t4/wo-4.33-hero-390.jpg        evidence
```

All within `PennJets-Development-2.0`. Nothing in the PennForce repository
was written. `ffmpeg-static` lives in the session scratchpad only.

## Known gaps

1. **The assumption, restated so it cannot be missed.** The order asked for
   1920x1080 landscape; the file is 1080x1920 portrait and I encoded it as
   such. Everything visible is the same composition as WO-4.19 at higher
   resolution and five times the weight. If that is not what Joseph wants,
   the reversal is one `git revert` on `t4/work` and nothing has reached
   production.
2. **Not verified on a production deploy.** T4 does not merge.
3. **The cold-load total is a sum of file sizes, not a transfer measurement.**
   Chrome's network panel in this tool reports no sizes and did not list the
   video element's fetch at all, so each of the 11 listed requests plus the
   video was summed at its size in `dist/`. `vite preview` serves them
   uncompressed, so for the two that gzip (JS, CSS) the real transfer is
   smaller; the video, poster, font and images do not compress. WO-4.19's
   figure was built the same way and the comparison holds.
4. **Playback checked in Chromium only.** High profile level 5.0 at
   1080x1920 is inside every current browser's H.264 range, but I ran it on
   one machine.
5. **The 390 capture is through an iframe**, not a resized window (gap
   explained under UI evidence). Layout in a same-size iframe is identical
   to a viewport of that size for everything this page does; I say so
   because the method differs from WO-4.29/4.30.
