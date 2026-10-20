---
wo: WO-4.47
terminal: T4
branch: t4/work
commit: 41c1d3a
tested_against: "site commit 870dfe3 (WO-4.46 items 1-2 on top of origin/main ee43b0b), built with npm run build and served by vite preview on localhost:4174; captured by the repository's own Playwright 1.63.0 Chromium 153.0.8010.12 (the prerenderer's browser, node_modules/playwright, build chromium-1243) at 390x844 CSS px, device pixel ratio 2 (DPR 1 where a file would have passed 500 KB, named below), isMobile and touch on. Desktop Chrome 155.0.8059.79 is installed but its --screenshot cannot scroll, focus a field or stub a request, so it was not used. Production www.pennjets.com was captured for four routes; it serves ee43b0b (Joseph's PR #12 merge of 2026-10-09; the hero still reads 'Access, You Deserve'). Every CRM read in the preview was answered from scripts/crm-posts.cache.json, crm-articles.cache.json and crm-inventory.cache.json; every form submit and newsletter post was answered by a stub (7 lead posts and 2 newsletter posts caught, 6 beacons answered 204, nothing reached the CRM)."
date: 2026-10-19
status: reported
---

# WO-4.47 report: pennjets.com at 390px — every page, every form, the sticky bar, the countdown banner

**No source file changed.** 146 PNGs under `docs/audit/mobile-390/`, this
report, nothing else. 20 routes, 9 forms, 1 shell. **No page scrolls
sideways** (document width 390 on all 20). No console error on any route.

## Commit

The screenshots and this report, on `t4/work`, pushed. The diff against the
WO-4.46 report commit:

```
$ git diff --cached --stat | tail -2            (staged for this commit)
 docs/reports/t4/WO-4.47.md                         | 221 +++++++++++++++++++++
 147 files changed, 221 insertions(+)
$ git diff --cached --name-only | grep -v '^docs/'
(nothing)
```

146 PNGs under `docs/audit/mobile-390/` plus this file. `git diff --stat
origin/main..t4/work` also carries WO-4.46's two-line `Home.jsx` change
from `870dfe3`, which is that order's, not this one's.

## How the audit ran

- `npm run build` at `870dfe3`, `vite preview --port 4174`, stopped before
  this report. A Playwright script (in the scratchpad, not the repo) opened
  each route, measured the DOM, scrolled, and captured. The measurements:
  document width against 390; every `a`, `button`, `input`, `select`,
  `textarea` under 44 px in either dimension; every element with its own
  text under 14 px; every visible `<img>` without both `width` and `height`
  attributes; the banner, header, `h1` and sticky bar rectangles; the
  sticky bar's `data-hidden` state and its overlap with the footer, any
  submit button and any email field at the page bottom and at six points
  while scrolling.
- Forms: the empty state; each field focused with the viewport shrunk to
  **390x520** (844 minus a ~324 px keyboard; this is how a resizing
  viewport behaves, i.e. Android Chrome, not iOS Safari, which keeps fixed
  elements on the layout viewport and lets the keyboard cover them), with
  the field's position measured against the fixed banner, header and bar;
  the validation state (submit tapped with the form empty); and the success
  message after a stubbed submit. **No form reached the CRM.**
- File naming: `<route>-<state>.png`. `-viewport` is the first screen,
  `-full` the whole page (`-full-partNofM` where one file would exceed
  500 KB: `/blog`, both notes, `/gallery`, `/services`, split by height
  into 3000 px parts, the gallery into 1000 px parts), `-bottom` the page
  scrolled to its end, `-menu-open` the header menu, `-form-empty`,
  `-field-N-<label>` (390x520), `-form-invalid`, `-form-step2` (Charter),
  `-form-success`. `prod-*-viewport` is production. All 146 files are
  under 500 KB; the four first-screen captures that were over at DPR 2
  (`home`, `services`, `gallery`, `prod-home`) are at DPR 1 and say so here.

## Ranked findings

Severity: **A** page unusable at this width · **B** form cannot be
submitted or the visitor is not told why · **C** content hidden or
overlapped · **D** cosmetic.

| # | Sev | Route | Screenshot | What is wrong | Likely cause |
|---|---|---|---|---|---|
| 1 | C | `/` | `home-viewport.png`, `home-menu-open.png`, `home-banner-new-years-day.png` | The hero heading renders under the floating header: the PennJets logo is drawn over "The" of "The Access You Deserve" (h1 at 79–151 px, header at 64–128 px). Same on New Year's Day. Not on production only because the heading there is one line shorter; `prod-home-viewport.png` shows the logo over "Access". | `Home.jsx:144` makes the hero `h-[60vh]` (506 px at 844) and `:147` centres the copy in it, while `Header.jsx:149-151` floats a transparent header at `top: 64` over a dark hero. At 390 the centred block is taller than the space under the header. |
| 2 | B | `/buy`, `/sell`, `/consulting` | `buy-form-invalid.png`, `sell-form-invalid.png`, `consulting-form-invalid.png` | Send is grey and dead until name and email are filled; tapping it does nothing and nothing says why. The other six forms at least focus the first empty field. | `Buy.jsx:40,142`, `Sell.jsx:26,108`, `Consulting.jsx:21,83`: `disabled={!canSubmit}` with no message. One line each to drop the `disabled` and let `required` speak, or one `<p>` each. |
| 3 | C | every form (9) | `contact-form-invalid.png`, `charter-field-0-from-airport-or-city.png`, `blog-long-form-invalid.png` | When a required field is empty and Send is tapped, the browser scrolls the field into view and it lands **under the fixed banner and header** (124 px): the Contact capture shows the "Please fill out this field." bubble pointing at a field that is not visible. Tapping into the first field of the Charter form does the same (the From input sits under the header; only the To placeholder shows). | No `scroll-padding-top` on `html` and no `scroll-margin-top` on the fields anywhere in `src/` (grep is empty), with `fixed` chrome at `Header.jsx:110` and `:149`. One CSS rule on `html` (`scroll-padding-top: 130px`) covers all nine forms. |
| 4 | C | every page | `about-bottom.png`, `home-bottom.png`, any `-bottom` | Fixed chrome takes 195 of 844 px (banner 60 + header 64 + sticky bar 71 = 23%); with the keyboard up (520 px visual viewport) it is 37%, leaving 325 px for the page. On `/charter` the two-step form was built for exactly this (WO-4.11) and it shows: five fields fit. On the others, the field and the Send button are rarely on screen together (every `-field-` row below has `submitVisible: false`). | `Header.jsx:110` (`fixed top-0`, 60 px at 390 because the countdown stacks number over label), `:149` (header 64 px), `StickyContactBar.jsx:60-65` (71 px). `App.jsx:36` pads `main` by 96 px for the bar. |
| 5 | C | `/blog/:slug` | `blog-long-viewport.png`, `blog-short-viewport.png` | "← Back to Market Notes" is clipped under the header on first paint (its top edge is at the header's bottom edge). | `BlogArticle.jsx:192` `pt-28` (112 px) is less than the 124 px of banner plus header at 390; `sm:pt-32` only kicks in at 640. |
| 6 | D | every page | `about-bottom.png` | The footer is 1,563 px tall at 390: four link columns stacked, then the broker disclosure, then the contact line. Two full screens of footer under every page. | `Footer.jsx:77` `grid-cols-1` below `md`, `:113` `space-y-3` per list. |
| 7 | D | `/pennshare`, `/buy` | `pennshare-field-5-i-consent-to-being-contacted-b.png`, `buy-field-2-sole.png` | The consent checkbox is 13x16 px and the two Ownership radios 16x16 px, the smallest tap targets on the site; the label text is not part of the target on the radios. | `PennShare.jsx:361` `w-4 h-4`; `Buy.jsx:101` `h-4 w-4`. |
| 8 | D | every page | `home-viewport.png` (top right), `about-bottom.png` | Tap targets under 44 px: the menu button 40x40 (`Header.jsx:222` `p-2` round a 24 px icon); every footer link 24 px tall, 22 per page (`Footer.jsx:113`); the four disclosure links "› Add phone…" 20 px (`Buy.jsx:120`, Sell, Contact, PennShare `MoreFields`); "Prefer to talk? Contact us" 20 px (`Buy.jsx:169`, `Charter.jsx:383`, `Consulting.jsx:113`, `Sell.jsx:134`); "← Back to Market Notes" 20 px (`BlogArticle.jsx:200`); the three category chips 36 px and twelve "Read More" buttons 40 px on `/blog` (`BlogList.jsx:132,145,246`); the email and phone links in the legal pages' contact lines 17–20 px. Full list per page in the measurement notes below. | As cited. |
| 9 | D | every page | any `-viewport` | Text under 14 px: the countdown labels "Days / Hours / Mins" 12 px (`Header.jsx:122`); the broker disclosure paragraph in the footer, 12 px, on every page (`Footer.jsx:145` `text-xs`); "By submitting, you agree…" 12 px on Buy, Charter, Consulting, Sell (`Buy.jsx:139`, `Charter.jsx:331`, `Consulting.jsx:80`, `Sell.jsx:105`); "No spam, unsubscribe at any time." (`NewsletterSignup.jsx:84`, `BlogList.jsx:303`); the category badge on every `/blog` card (`BlogList.jsx:211`); the image credit under a note's photo (`BlogArticle.jsx:274`); the Market Notes dates on `/`; "STEP 1 OF 2" on `/charter`. | `text-xs` as cited. |
| 10 | D | `/blog`, `/blog/:slug`, `/gallery`, `/about`, `/pennshare`, every page (logo) | `blog-full-part1of4.png`, `gallery-full-part2of6.png` | Images without `width`/`height`, so the page shifts as each loads: the nine note images on `/blog` (`BlogList.jsx:192`), the author photo and the four related-note thumbnails on a note (`BlogArticle.jsx:236,265`; the four thumbnails also have **no `alt`**), eight gallery photos (`Gallery.jsx:115,142`), Joseph's photo on `/about` (`About.jsx:85`), the two Premier 1A photos on `/pennshare` (`PennShare.jsx:203,250`), and the header logo on every page (`Header.jsx:160`). | As cited. |
| 11 | D | `/blog` | `blog-viewport.png`, `blog-full-part1of4.png` | The first note is 1.5 screens down: a 680 px dark hero (title and one sentence) plus the filter row before the list; 9,035 px of page for 12 notes, one full-width image each. | `BlogList.jsx:112` `py-24` hero at 390. |
| 12 | D | `/blog/:slug` and the four lead forms | `blog-long-field-3-your-question-or-message.png`, `buy-field-2-sole.png`, `consulting-field-2-phone.png`, `pennshare-field-4-additional-comments.png`, `sell-field-2-make.png` | With the viewport at 390x520, focusing these five fields leaves the field's lower part under the sticky bar (the bar hides only when a submit button or the footer is on screen). On iOS the keyboard covers the bar instead; **check by hand on Joseph's phone** before counting this. | `StickyContactBar.jsx:17-21` watches submit buttons and footers, not the focused field. |

Not a finding, recorded because it was measured: the validation "error
shown" state on every form is the browser's native bubble ("Please fill
out this field."); no form renders an error of its own (`customErrorText`
empty on all nine). Headless Chromium painted the bubble on `/contact`
(see row 3) and not on the others, which is a capture artefact of where
the field landed, not a difference in the forms.

## The shell

### 3. The sticky contact bar

71 px tall, `fixed` bottom, z-40, two actions "Call" and the page's quote
target (WO-4.11). Hidden by `translate-y-full` whenever a footer or a
form's submit button intersects the viewport. Measured:

- **Over the footer**: never. At the page bottom it is hidden on all 20
  routes (`overFooter: false` everywhere).
- **Over a submit button**: never while the button is on screen (that is
  the hide rule); at six scroll positions per page no overlap was seen.
- **Over the newsletter email field**: never (the field sits just above
  its Subscribe button, which hides the bar).
- **Keyboard up**: row 12. The bar is not keyboard-aware; whether it
  matters depends on the phone.
- **Its two actions at 390**: each 171x47 px, side by side, readable;
  "Talk to a Broker" on a note, "Request a Quote" elsewhere. On `/buy`,
  `/sell`, `/consulting` and the 404 the bar is already hidden on first
  paint because the form's Send button (or the footer on the 404) is in
  view.

### 4. The countdown banner

- **Height at 390: 60 px** (two-line sentence "Days left to close a 2026
  acquisition." beside the number-over-label stack; Secs is hidden below
  `sm`). The header reads the measured height (`Header.jsx:37` onward)
  and sits at 60 px on light pages, at `max(60, 64) = 64` on the four dark-hero
  pages (`/`, `/charter`, `/contact`, `/blog`): 124 or 128 px of fixed chrome.
- **Number over label**: renders as designed (`home-viewport.png`); the
  labels are 12 px (row 9).
- **Hero heading below the fold?** No. On `/` it is the opposite: the
  heading is above the header's bottom edge (row 1). On `/charter` the h1
  starts at 157 px, `/contact` and `/blog` at 160–192 px, all on the first
  screen.
- **New Year's Day** (clock fixed at 2027-01-01, `home-banner-new-years-day.png`):
  the banner is one line, "Happy New Year!", **36 px**; the header stays at
  64 px on the dark hero, so 28 px of hero video show between banner and
  header. Row 1 is unchanged that day.

### 5. The shell

- **Header, menu closed**: 64 px, logo 48 px tall at left, menu button
  40x40 at right (row 8). Transparent over the dark heroes, white after
  20 px of scroll.
- **Menu open** (`home-menu-open.png`, `about-menu-open.png`): a white
  panel with the seven links at 40 px row height and a full-width Contact
  Us button, bottom edge at 528 px; fits the first screen with room to
  spare. Closes on a link.
- **Footer**: row 6. Four columns of links, 24 px rows, then the
  disclosure at 12 px.
- **Horizontal overflow**: none on any of the 20 routes.
- **Tap targets under 44 px**: row 8; counts per page: home 28, blog 38,
  buy 30, sell 29, notes 29–30, charter/consulting/contact 26, the rest
  22–24, of which 22 are the header button plus the footer's 21 links on
  every page.
- **Text under 14 px**: row 9; 4 elements on a plain page (the three
  banner labels and the disclosure), up to 13 on `/blog`.
- **Images without width/height**: row 10.

## Forms, one by one

Each: fields measured at 390x520 with the field focused; empty, invalid
and success captured. `submitted: 1` means exactly one POST left the page
and the stub answered it.

| Form | Fields | Empty / invalid / success files | Notes |
|---|---|---|---|
| `/blog` newsletter (`BlogList.jsx:265`) | email | `blog-form-empty.png`, `blog-form-invalid.png`, `blog-form-success.png` | Field 48 px tall, Subscribe visible beside it with the keyboard up. Success: "Thank you for subscribing!" |
| Note, broker form (`BlogArticle.jsx:350`) | name, email, phone, message | `blog-long-form-empty.png`, `-invalid`, `-success`, `blog-long-field-0..3` | Success: "Thank you. Joseph Pennella will be in touch shortly." Message field under the bar at 520 (row 12). |
| Note, newsletter (`NewsletterSignup.jsx:51`) | email | `blog-long-newsletter-form-empty.png`, `-invalid`, `-success`, `blog-long-newsletter-field-0` | Same as `/blog`. |
| `/buy` (`Buy.jsx:80`) | name, email, ownership ×2, aircraft, timeline (+3 behind "Add phone, passengers and trip length") | `buy-form-empty.png`, `-invalid`, `-success`, `buy-field-0..5` | Row 2 (dead Send). Row 7 (radios). Success: "Thanks. Your inquiry is in. We'll follow up shortly." |
| `/charter` (`Charter.jsx:277`) | step 1: from, to, departure, return, passengers; step 2: name, email, phone, notes | `charter-form-empty.png`, `-invalid`, `-step2`, `-success`, `charter-field-0..4` | Two-step at 390 as designed; Continue runs `reportValidity`. Row 3 (From under the header). Success: "Thanks. Your request is in. We'll follow up shortly." |
| `/consulting` (`Consulting.jsx:52`) | name, email, phone, need | `consulting-form-empty.png`, `-invalid`, `-success`, `consulting-field-0..3` | Row 2. Success: "Thanks. Your request is in. We'll follow up shortly." |
| `/contact` (`Contact.jsx:172`) | name, email, service, message (+2 behind "Add phone and company") | `contact-form-empty.png`, `-invalid`, `-success`, `contact-field-0,1,4,5` | Row 3 (the bubble over a hidden field). Success: "Thank you. Your message is in. We'll be in touch shortly." |
| `/pennshare` (`PennShare.jsx:282`) | name, email, comments, consent (+2 behind "Add phone and share size") | `pennshare-form-empty.png`, `-invalid`, `-success`, `pennshare-field-0,1,4,5` | Row 7 (13x16 checkbox). Success: "Thanks. Your inquiry is in. We'll follow up shortly." |
| `/sell` (`Sell.jsx:66`) | name, email, make, model, year (+3 behind "Add phone, total time and location") | `sell-form-empty.png`, `-invalid`, `-success`, `sell-field-0..4` | Row 2. Success: "Thanks. Your details are in. We'll follow up shortly." |

Every field is 16 px type (no iOS zoom-on-focus) and 42–50 px tall. All
nine submit to the stub and show their success line.

## Pages with no findings of their own

(Each still carries the shell rows 4, 6, 8, 9 and the logo of row 10.)

`/about`, `/services`, `/aircraft` (empty state: the heading, the approved
sentence, the inquiry link; the inventory cache holds 0 listings and
production's inventory route answers 500 today, so the empty state is also
what production serves), `/aircraft/:id` (no listing: renders the same as
`/aircraft`, `aircraft-detail-empty-*.png`), `/pennshare` apart from rows 7
and 10, `/charter` apart from row 3, `/privacy-policy`,
`/terms-of-service`, `/cookie-policy`, `/compliance`, the 404
(`not-found-*.png`: heading, one line, the footer).

## Production

`prod-home-viewport.png`, `prod-blog-viewport.png`,
`prod-aircraft-viewport.png`, `prod-blog-long-viewport.png`, captured at
390 from `https://www.pennjets.com` (production serves `ee43b0b`). No
layout difference from the preview at this width: document width 390 on
all four, page heights within 25 px of the preview's, the same tap-target
counts give or take the copy. Differences are content: the hero copy
(WO-4.46, not deployed) and the note list (production's prerender has 16
notes, the committed cache 12). Production's `/blog` rendered its list in
the browser at capture time even though the CRM's list route answers 500
to `curl` (WO-4.46 report, Known gaps); the prerendered HTML carries the
list, so a visitor sees notes either way.

## Scope

```
$ git status --short     (before the commit)
?? docs/audit/mobile-390/
?? docs/reports/t4/WO-4.47.md
```

Nothing under `src/`, `public/`, `index.html` or `scripts/` changed. The
five untracked Gallery images noted in the WO-4.46 report are still
untracked and still not mine. Build, lint and tests were not re-run: no
source changed since WO-4.46's run at `870dfe3` (118/118, build exit 0,
lint 0 warnings).

## Known gaps

- The keyboard was simulated by shrinking the viewport to 390x520. That
  is the Android Chrome model; iOS Safari does not shrink the layout
  viewport, so rows 3 and 12 should be confirmed on an iPhone before
  they are scoped. Row 3's mechanism (no scroll padding under fixed
  chrome) is the same on both.
- DPR 2 for all but four first-screen captures and the split long pages,
  which are DPR 1 to stay under 500 KB; the measurements are in CSS px
  and do not depend on it.
- The one real listing for `/aircraft/:id` could not be captured: the
  inventory is empty on production and in the cache.
- Production was captured for four routes, not all twenty; the four
  matched the preview, and the rest share the same shell.
