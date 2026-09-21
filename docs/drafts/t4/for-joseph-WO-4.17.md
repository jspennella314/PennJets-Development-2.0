# For Joseph — WO-4.17, the favicon

**Belongs in `docs/orders/joseph.md` in the PennForce repo. T4 cannot write
there**, so it is queued here and needs relaying.

Nothing is blocked. The order is done and the site is 2.7 MB lighter on every
page. This is one thing worth knowing and one thing you might want to decide.

---

## The good news first

The logo was being downloaded **twice** on every page load, once for the header
and once as the favicon, at 1.32 MB each time. Browsers do not share those two
requests. So the home page was carrying 2.7 MB of logo.

| | Home page total |
|---|---|
| Before | 4.25 MB |
| After | 1.52 MB |

The header looks exactly the same. The new assets together are 11 KB.

## The thing you may want to decide

**The favicon is unreadable at 16 and 32 pixels, and no export can fix it.**

The logo is the word "PennJets" in a script face, 851 pixels wide by 366 tall.
Squashed into a 32-pixel square the letters are about 14 pixels tall and it
reads as a blue smudge. At 16 pixels, which is what most browser tabs actually
draw, it is worse.

The 180-pixel Apple touch icon, the one used on an iPhone home screen, is
completely fine and reads as the brand.

This is a property of the mark rather than of my export. A long word in a script
face cannot be legible at 16 pixels; there is no version of this that works.

**What tab-sized icons want is a monogram.** A single `P` from the existing
script, or a small mark, on the same blue. It would be recognisable at 16
pixels and would sit consistently beside the card from WO-4.16.

That is a design decision and a redesign of sorts, which WO-4.17 puts out of
scope, so I have not done it. If you want it, it is a small order and an hour
of work. If you would rather the tab just shows the smudge, that is a perfectly
normal choice too and plenty of sites live with it.

## One number, not a request

`/videos/Falcon-Hero-Flyover.MP4` is now the largest thing on the site at
1,461 KB, autoplaying on the home page, and it is the only asset above 100 KB.
The Round 3 audit also noted the aircraft in it is not one of yours. I have not
touched it and there is no order for it; flagging the number only.
