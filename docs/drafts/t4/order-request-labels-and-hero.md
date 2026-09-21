# Order request — four decided changes

**For the lead, to write as orders in `docs/orders/t4/`.** T4 cannot write
there, so this is queued in the site repo and needs relaying.

**All four decided by Joseph in chat on 2026-09-20**, and he asked for them to
be written as orders rather than acted on from the message. **Nothing is
built.**

They are unrelated to each other. Requests 3 and 4 are one-line changes and
could reasonably be a single small order; 1 and 2 deserve their own.

| | Request | Size |
|---|---|---|
| 1 | Relabel the contact dropdown | small, one file |
| 2 | Compress the hero video | needs an encoder, see the prerequisite |
| 3 | **All dead email addresses to `joe@pennjets.com`** | 11 places, 6 files |
| 4 | Delete an unreferenced 1.5 MB video | one file |

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
> export. If I can't, compress the portrait version."

So the order has a branch in it and should say so rather than assume: **use a
landscape export if Joseph produces one, otherwise compress the portrait file
in place.** Either way the target is the same, well under 200 KB.

### Why the landscape export is worth his looking

**It is a portrait phone video used as a landscape hero.** `Home.jsx` renders
it `h-[60vh] w-full object-cover`, so on a 1440-wide screen a 720-wide frame is
stretched to double width and cropped to roughly the middle fifth of its
height. Most of what Joseph shot is never seen, and what is seen is upscaled.
Encoding a portrait frame and then throwing most of it away is paying twice.

If the original turns up, the hero gets a frame that is the shape of the space
it fills. If not, nothing is lost by compressing what is there.

### A prerequisite the order needs to account for

**There is no encoder on this machine.** `ffmpeg` and `ffprobe` are not on
`PATH`. The order should either permit installing `ffmpeg`, or say the
re-encode happens elsewhere and T4 only swaps the file in and measures the
result. I have not installed anything.

### Evidence worth asking for

Before and after bytes; the home page total transfer before and after; and the
hero rendered at 390 and 1440 showing no visible loss.

---

## Request 3 — every dead email address becomes `joe@pennjets.com`

**Joseph, 2026-09-20, in two steps.** First: "Use joe@pennjets.com. Replace
privacy@pennjets.com everywhere on the legal pages." Then, when the grep turned
up two more: "Neither compliance@pennjets.com nor info@pennjets.com is active.
Extend the order: replace all three with joe@pennjets.com, everywhere they
appear, including the footer. We'll split them into real aliases later when
they exist."

### Why this is bigger than it looked

This is the email version of WO-4.13. A published address nobody reads loses
the message silently: no bounce, no error, no record that anyone tried. The
site currently publishes **three confirmed-dead addresses in 11 places**, one
of them in the footer of every page.

### The full inventory

| Address | Occurrences | Where |
|---|---|---|
| `info@pennjets.com` | **8** | the global footer, every page; Aircraft Detail; the Contact page's contact block; a Contact error message; the home page **JSON-LD `email`**; the Terms of Service `mailto:`; and the **author fallback** in `blogApi.js` |
| `compliance@pennjets.com` | 2 | the Compliance page, display and `mailto:` |
| `privacy@pennjets.com` | 1 | `src/content/privacyPolicy.js`, one constant used twice on the page |

Two of those deserve a note in the order because they are not visible copy:

- **`Home.jsx` JSON-LD `"email"`** is structured data. A dead address there is
  what search engines and assistants surface as the way to contact the company.
- **`blogApi.js` author fallback** is used when a CRM post has no author email.
  It becomes the `mailto:` under a Market Note byline, so a reader replying to
  an article hits it.

### A fourth address Joseph has not ruled on

`inquiries@pennjets.com`, twice, in the home page's own inline footer:

```
Home.jsx:237   <a href="mailto:inquiries@pennjets.com">inquiries@pennjets.com</a>
```

He named three and this is a fourth. Given the other three are dead it is
likely dead too, but **I have not assumed it** and have not touched it. The
order should either include it or say explicitly that it stays.

### Two addresses that should not change

`charles@pennjets.com` and `joedelisio@pennjets.com` are the team members'
own addresses on the About page and in the Market Note author data. They are
people, not aliases, and nothing suggests they are dead. Leave them.

### What it would deliver

All occurrences of the three confirmed-dead addresses replaced with
`joe@pennjets.com`, across 6 files: `Footer.jsx`, `AircraftDetail.jsx`,
`Contact.jsx`, `Home.jsx`, `Legal/Compliance.jsx`, `Legal/TermsOfService.jsx`,
plus `src/content/privacyPolicy.js` and `src/services/blogApi.js`.

Both the displayed text and the `mailto:` href in every case, which is the
WO-4.13 failure mode: a corrected label over a stale link.

Joseph's note that these become real aliases later is worth carrying into the
order as a comment in the code, so whoever splits them knows the consolidation
was deliberate rather than an accident.

### Evidence worth asking for

`grep -rn 'info@pennjets\|compliance@pennjets\|privacy@pennjets' src public`
returning nothing; the rendered address and its `mailto:` on the footer and on
two legal pages; and the home page JSON-LD `email` read back from the DOM.

---

## Request 4 — delete the unreferenced second video

**Joseph:** "Falcon-Hero-Flyover3.mp4: confirmed for deletion, nothing
references it."

### Why

`public/videos/Falcon-Hero-Flyover3.mp4`, **1,594,832 bytes**. Nothing
references it:

```
$ grep -rn 'Flyover3' src public index.html scripts
(no matches; the only hits anywhere are in docs/, describing it)
```

It is worse than dead weight in the repository. Vite copies `public/`
wholesale, so it ships in every build and is **live on production now**:

```
$ curl -I https://www.pennjets.com/videos/Falcon-Hero-Flyover3.mp4
200, 1,594,832 bytes
```

No page requests it, so it costs no visitor anything, but it is 1.5 MB of
deployed bytes serving no purpose.

### What it would deliver

Delete the file. That is the whole order. It needs to be an order only because
a chat line is not one.

### Evidence worth asking for

`grep` showing no reference; the file absent from `dist/` after a build; and a
404 from the production URL once merged.

---

## Status

Nothing built for any of the four. Awaiting order files.
