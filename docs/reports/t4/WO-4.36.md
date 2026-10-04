---
wo: WO-4.36
terminal: T4
branch: t4/work
commit: 9359838
tested_against: "local build of t4/work at 9359838 (dist/ from npm run build, served by vite preview on :4173, captured with the site's Playwright Chromium at 390x844, CRM calls blocked). No deploy: the site deploys only from main."
date: 2026-09-29
status: reported
---

# WO-4.36 report: cut the 2-hour response promise on /contact

## Commits

On `t4/work`, pushed:

| Commit | What |
|---|---|
| `c2ba93b` | The two cache files as the WO-4.34 build left them. |
| `687c696` | The same two files again (see "Cache files" below). |
| `9359838` | `Contact.jsx`. |

`t4/work` already contained `origin/main` (`a450f6a`), so
`git merge --ff-only origin/main` was a no-op. I ran `npm ci` (routine).
The site has no Prisma, so there was nothing to generate.

## The diff

```
$ git show --stat --format= 9359838
 src/components/pages/Contact/Contact.jsx | 16 +---------------
```

- **`:131`, the Email card:** `description: 'We respond within 2 hours'`
  is removed. The template renders a description only when there is one
  (`{item.description && …}`), so the card now has two lines, like Phone.
- **`:303`:** the sentence was the entire body of a **"Quick Response"**
  card: clock icon, heading "Quick Response", then the sentence. Without
  the sentence, the heading and the clock still promised speed and no
  longer stood on their own. **Proposed:** the whole card is removed,
  and no new copy is added.

  ```
  old:  [clock] Quick Response
        We typically respond to all inquiries within 2 hours during business hours.
  new:  (no card)
  ```

  If Joseph would rather keep a card there, it needs new copy with no
  time claim, and copy is his. `HiClock` was used only by that card, so
  its import goes too.
- **`/pennshare`** is untouched: `PennShare.jsx:277` still reads "Penn
  Jets will contact you within 24 hours."

## The sweep

Patterns: `within 2 hours`, `2 hours`, `respond`, `business hours`.

**Before** (`7f61d1d`):

```
src/components/pages/Buy/Buy.jsx:12:  { value: '1 to 2 hours', label: '1 to 2 hours' },
src/components/pages/Contact/Contact.jsx:131:      description: 'We respond within 2 hours',
src/components/pages/Contact/Contact.jsx:303:                    We typically respond to all inquiries within 2 hours during business hours.
dist (files): dist/assets/index-6af0cc3d.js, dist/buy.html, dist/contact.html
```

**After** (`9359838`, `src` and `index.html`):

```
src/components/pages/Buy/Buy.jsx:12:  { value: '1 to 2 hours', label: '1 to 2 hours' },
```

**After, `dist`:**

```
dist/assets/index-3c049582.js:37   …e.correspondingUseElement…               (React DOM internals)
dist/assets/index-3c049582.js:73   {value:"1 to 2 hours",label:"1 to 2 hours"}   (Buy.jsx's option)
dist/buy.html:55                   <option value="1 to 2 hours">1 to 2 hours</option>
dist/blog/bombardier-…html:60      "…as the market responds."
dist/blog/q3-2026-…html:60         "…Bombardier responded that many components…"
dist/blog/september-11-…html:60    "…the first responders…", "…84% of respondents…", "…those who responded…"
```

Why each stays:

- **`Buy.jsx:12` and `dist/buy.html`:** a trip-length option on the /buy
  form ("How long are your trips?"), not a response promise.
- **The React DOM line:** `correspondingUseElement` is library code that
  happens to contain "respond".
- **The three notes:** the word "respond" in article text from the CRM,
  with no claim about Penn Jets. Out of scope.

`dist/contact.html` no longer matches anything.

## UI evidence

`/contact` at 390×844, from the built `dist/contact.html` (vite preview,
Playwright Chromium; CRM requests blocked so the capture wrote nothing to
the CRM): [`wo-4.36-contact-390.png`](wo-4.36-contact-390.png).

The "Get in Touch" block has three cards:
- **Phone:** two lines;
- **Email:** `joe@pennjets.com`, **with no third line**;
- **Address:** unchanged, "Visit our offices by appointment".

**Nothing is left of the Quick Response card:** `grep -c "Quick
Response\|within 2 hours" dist/contact.html` returns `0`. The prerendered
Email card:

```
<h3 class="font-semibold text-gray-900 mb-1">Email</h3><p class="text-gray-600 whitespace-pre-line mb-1">joe@pennjets.com</p></div></div>
```

Not a deployed preview: the site has none, and deploys only from `main`.

## Cache files

The order asked for the two cache files the WO-4.34 build refreshed to be
committed. I committed them in a separate commit named for them
(`c2ba93b`).

**The first build after that commit still fetched one body:**

```
build 1: [postbuild] article bodies: 10 from cache, 1 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
build 2: [postbuild] article bodies: 11 from cache, 0 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
```

That is postbuild working as designed. The Q3 2026 note was **edited in
the CRM at 2026-09-28 15:15:36 UTC**: its `updatedAt` moved from
`14:04:24.477Z` to `15:15:36.563Z`. The WO-4.34 build had cached the
earlier version, so build 1 refetched that one body. That fetch wrote one
`ContentAnalytics` row, and it was needed to get the edit. Build 1
rewrote both files, and I committed them again separately (`687c696`).
Build 2 read **11 from cache, 0 fetched**. A build from the repository
now fetches nothing until a note is published or edited.

## Build

Both builds in my own checkout, from PowerShell, at `9359838` content:

```
build1 exit 0
  [postbuild] article bodies: 10 from cache, 1 fetched
  [postbuild] wrote 27 HTML files (11 Market Notes) and sitemap.xml with 26 URLs
  [prerender] 27 of 27 routes rendered in 42.3s, 137,690 characters of body text added
  [prerender] 11 view beacon(s) intercepted; none reached the CRM.
  [prerender] 11 article fetch(es) answered from cache; none reached the CRM, so none wrote a ContentAnalytics row.
build2 exit 0
  [postbuild] article bodies: 11 from cache, 0 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
  [postbuild] wrote 27 HTML files (11 Market Notes) and sitemap.xml with 26 URLs
  [prerender] 27 of 27 routes rendered in 37.4s, 137,690 characters of body text added
  [prerender] 11 view beacon(s) intercepted; none reached the CRM.
  [prerender] 11 article fetch(es) answered from cache; none reached the CRM, so none wrote a ContentAnalytics row.
```

The build also printed two warnings that predate this order: "1 note
image(s) hotlinked from another site" and "2 note image(s) not in this
repo".

```
$ npm run lint
> eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0
lint exit 0
```

## Scope

`Contact.jsx` and the two cache files, as ordered, plus this report and
its screenshot.

## Known gaps

1. **The Quick Response card's removal is proposed.** It goes further
   than removing one sentence, because the heading alone still promised
   speed. Joseph can restore the card with new copy.
2. **An environment note.** At the start of the session the site's
   `node_modules` briefly held 48 packages and no `vite`, and my first
   build failed with `'vite' is not recognized`. Other terminals were
   running `npm ci` at the same time, and their directories could not be
   read from the process list. I waited for them to finish, ran my own
   `npm ci` (exit 0, 311 packages), and every build after that passed.
   Nothing in the repository was affected.
