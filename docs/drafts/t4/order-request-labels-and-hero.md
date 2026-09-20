# Order request — two decided changes

**For the lead, to write as orders in `docs/orders/t4/`.** T4 cannot write
there, so this is queued in the site repo and needs relaying.

**Both decided by Joseph in chat on 2026-09-20**, and he asked for them to be
written as orders rather than acted on from the message. Nothing is built.

They are unrelated and would be cleaner as two orders than one.

---

## Request 1 — relabel the contact page's service dropdown

**Joseph:** "your proposal is right. 'Selling my aircraft' / 'Buying an
aircraft'. Label by what the visitor is doing."

### Why

WO-4.15 mapped every option to one of the four CRM service values. The mapping
is correct, but two labels read ambiguously to a visitor.

"Aircraft Sales" means, internally, representing an owner selling an aircraft,
and it now posts `sell`. To a reader it sounds like "aircraft you have for
sale", so someone who wants to **buy** may pick it and land under `sell`.

WO-4.15 put copy out of scope, which is why it was flagged rather than fixed.

### What it would deliver

| Now | After |
|---|---|
| Aircraft Sales | **Selling my aircraft** |
| Aircraft Acquisition | **Buying an aircraft** |
| Charter Brokerage | unchanged, or "Charter a flight" if Joseph prefers |
| Consulting | unchanged |
| Other | unchanged |

The option *values* and the mapping underneath do not change, so no CRM
behaviour moves. `src/components/pages/Contact/Contact.jsx` only.

### Evidence worth asking for

The rendered dropdown, and one submission per relabelled option showing the
posted `service` is still `sell` and `buy`. Test leads labelled deletable.

---

## Request 2 — compress the hero video

**Joseph:** "I shot it myself, so it stays. No provenance issue. Compress it;
1,461 KB autoplaying is the only asset over 100 KB on the site."

**A correction I owe him first.** The WO-4.2 audit described this as "an
autoplay MP4 of a Falcon (not a Penn Jets aircraft)". That conflated two
things: whether we hold rights to the footage, and whether the aircraft is
ours. Joseph shot it, so there is no licensing question, and he has decided the
aircraft point is not a problem. The file stays. Only its weight is at issue.

### What the measurement shows

| | |
|---|---|
| File | `public/videos/Falcon-Hero-Flyover.MP4` |
| On disk | 1,495,647 bytes, 1,461 KB |
| Dimensions | **720 x 1280, portrait** |
| Duration | 3.4 seconds |
| Implied bitrate | about **3,400 kbps** for a 0.9 megapixel frame |

3,400 kbps for a 3.4-second silent loop at 720p is several times what it needs.
That alone is the compression case.

### Joseph's disposition, 2026-09-20

> "I'll look for the original footage and see if I can give you a landscape
> export. If I can't, compress the portrait version. Delete
> Falcon-Hero-Flyover3.mp4 if nothing references it."

So the order has a branch in it, and should say so rather than assume: **use a
landscape export if Joseph produces one, otherwise compress the portrait file
in place.** Either way the target is the same, well under 200 KB for a
3.4-second silent loop.

### Why the landscape export is worth his looking

**It is a portrait phone video used as a landscape hero.** `Home.jsx` renders
it `h-[60vh] w-full object-cover`, so on a 1440-wide screen a 720-wide frame is
stretched to double width and cropped to roughly the middle fifth of its
height. Most of what Joseph shot is never seen, and what is seen is upscaled.

So the order could reasonably cover two things:

1. **Compress it.** A 3.4-second silent loop should sit comfortably under
   200 KB, and plausibly near 100 KB, with no visible loss at the size it is
   actually displayed.
2. **Consider re-cropping to landscape**, or asking Joseph for a landscape
   export if he still has the original. Encoding a portrait frame and then
   throwing 80% of it away is paying twice.

He is looking. If the original turns up, the hero gets a frame that is actually
the shape of the space it fills; if not, nothing is lost by compressing what is
there.

### A prerequisite the order needs to account for

**There is no encoder on this machine.** `ffmpeg` and `ffprobe` are not on
`PATH`. Compressing video needs one, so the order should either permit
installing `ffmpeg`, or say the re-encode happens elsewhere and T4 only swaps
the file in and measures the result. I have not installed anything.

### Also: delete the second video file — confirmed, pending an order

`public/videos/Falcon-Hero-Flyover3.mp4`, **1,594,832 bytes**. Joseph:
"Delete Falcon-Hero-Flyover3.mp4 if nothing references it."

Nothing does. Checked:

```
$ grep -rn 'Flyover3' src public index.html scripts
(no matches; the only hits anywhere are in docs/, describing it)
```

It is worse than dead weight in the repository. Vite copies `public/`
wholesale, so it **ships in the build and is live on production right now**:

```
$ curl -I https://www.pennjets.com/videos/Falcon-Hero-Flyover3.mp4
200, 1,594,832 bytes
```

No page requests it, so it costs no visitor anything, but it is 1.5 MB of
deployed bytes serving no purpose. The condition Joseph set is met and the
deletion is uncontroversial; it needs an order only because a chat line is not
one.

### Evidence worth asking for

Before and after bytes; the home page total transfer before and after; the
hero rendered at 390 and 1440 showing no visible loss; and `grep` confirming
what happened to the unreferenced second file.

---

## Status

Nothing built for either. Awaiting order files.
