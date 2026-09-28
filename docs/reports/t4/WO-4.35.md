---
wo: WO-4.35
terminal: T4
branch: t4/work
commit: 4b82ccc
tested_against: "site: npm run build at 4b82ccc on this machine (Node v22.19.0, exit 0, 27 of 27 routes prerendered), dist inspected on disk. No CRM evidence crosses the boundary: the prerender answered all 11 article fetches from cache and reached the CRM zero times. NOT a production deploy; T4 does not merge. The 404 on the live PDF URL is the lead's check after Joseph's merge."
date: 2026-09-28
status: reported
---

# WO-4.35 report — N400HH spec sheet removed, G-HMEI photo deleted, sources out of git

## Commit

`4b82ccc` WO-4.35: remove the N400HH spec sheet; keep the Falcon source
image out of git. On `t4/work`, pushed. Not merged.

```
$ git show --stat --format="%h %s" 4b82ccc
4b82ccc WO-4.35: remove the N400HH spec sheet; keep the Falcon source image out of git

 .gitignore                                     |   3 +++
 public/Aircraft Specs/Secifications_N400HH.pdf | Bin 69118 -> 0 bytes
 2 files changed, 3 insertions(+)
```

Exactly the PDF deletion and `.gitignore`.

## What was done

1. `git rm "public/Aircraft Specs/Secifications_N400HH.pdf"` (69,118 bytes,
   the size the lead measured). It was the folder's only file, so
   `public/Aircraft Specs/` no longer exists. `Home.jsx:11` is untouched;
   it is still the comment
   `// { id: 'n400hh', year: 2004, make: 'Hawker', model: '800XP', serial: '258xxx',`.
   Nothing in `src`, `index.html` or `public` references the PDF.
2. `rm public/images/Gallery/Dassault_Falcon_900B.jpg`: a single-file `rm`.
   Before deleting it I opened the file: it is a black Falcon 900 with
   **G-HMEI** on the engine nacelle, 2,831,767 bytes, matching the order.
   It was untracked, so no commit carries it.
3. `.gitignore`, appended under the WO-4.33 rule, which is unchanged:

   ```
   # Source image. Kept on disk as the original the committed Falcon note
   # .jpg was made from; never committed. WO-4.35.
   public/images/Gallery/Falcon900B_no_registration.png
   ```

## Data evidence: git state

**Before** (at `54bdc01`, after WO-4.34):

```
$ git status --short
 M scripts/crm-articles.cache.json
 M scripts/crm-posts.cache.json
?? public/images/Gallery/Dassault_Falcon_900B.jpg
?? public/images/Gallery/Falcon900B_no_registration.png

$ git status --ignored --short
 M scripts/crm-articles.cache.json
 M scripts/crm-posts.cache.json
?? public/images/Gallery/Dassault_Falcon_900B.jpg
?? public/images/Gallery/Falcon900B_no_registration.png
!! .env
!! dist/
!! node_modules/
!! public/videos/IMG_3379.MOV
```

**After** (at `4b82ccc`):

```
$ git status --short
 M scripts/crm-articles.cache.json
 M scripts/crm-posts.cache.json

$ git status --ignored --short
 M scripts/crm-articles.cache.json
 M scripts/crm-posts.cache.json
!! .env
!! dist/
!! node_modules/
!! public/images/Gallery/Falcon900B_no_registration.png
!! public/videos/IMG_3379.MOV

$ git check-ignore -v public/images/Gallery/Falcon900B_no_registration.png public/videos/IMG_3379.MOV
.gitignore:55:public/images/Gallery/Falcon900B_no_registration.png	public/images/Gallery/Falcon900B_no_registration.png
.gitignore:52:public/videos/*.MOV	public/videos/IMG_3379.MOV

$ ls -l public/images/Gallery/Falcon900B_no_registration.png public/videos/IMG_3379.MOV
-rw-r--r-- 1 jspen 197609  745105 Sep 21 21:52 public/images/Gallery/Falcon900B_no_registration.png
-rw-r--r-- 1 jspen 197609 5956307 Sep 22 22:43 public/videos/IMG_3379.MOV

$ ls public/images/Gallery/Dassault_Falcon_900B.jpg
ls: cannot access 'public/images/Gallery/Dassault_Falcon_900B.jpg': No such file or directory
```

The `.png` and `.MOV` are ignored and still on disk. The G-HMEI `.jpg` is
gone. The two `scripts/crm-*.cache.json` lines are build byproducts from
WO-4.34's build. See Known gaps.

## Built `dist`

```
files named *N400HH*: 0
dist/Aircraft Specs: absent
files mentioning Secifications_N400HH: 0
G-HMEI jpg in dist: 0
committed jpg in dist (Falcon900B_no_registration.jpg): 1
```

After Joseph's merge, the lead expects
`curl -I "https://www.pennjets.com/Aircraft%20Specs/Secifications_N400HH.pdf"`
to return 404.

## Build

```
> npm run build   → exit 0
✓ built in 7.68s
[prerender] 27 of 27 routes rendered in 45.2s, 137,803 characters of body text added
[prerender] 11 view beacon(s) intercepted; none reached the CRM.
[prerender] 11 article fetch(es) answered from cache; none reached the CRM, so none wrote a ContentAnalytics row.

$ npm run lint    → exit 0
> eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0
```

This was the fourth build attempt. The first three failed in
`scripts/prerender.mjs` with no connection to this change: twice with
`EADDRINUSE :::4318` and once with `ENOENT` on a `dist/blog/*.html` file.
Each time, a second `npm run build` → `prerender.mjs` process tree was
running in parallel, holding the prerender's port or rewriting `dist`
underneath it. Its top-level shell had already exited, so I could not
confirm whose it was. I did not kill it. I waited for it to exit, confirmed
port 4318 was free, and ran the build once from PowerShell, where it passed.
`vite build` succeeded on every attempt.

## Tests

n/a. The site has no test suite, and no test file was touched.

## Scope

`.gitignore` and the deleted PDF (committed); the untracked G-HMEI `.jpg`
(deleted from disk). Nothing else in `public/`.

## Known gaps

- **The ignored `.png` is in the local `dist`** (`dist/images/Gallery/Falcon900B_no_registration.png`).
  Vite copies `public/` from disk and does not read `.gitignore`. It will
  **not** ship, because the Pages deploy builds from a clean checkout of
  `main`, and that checkout does not contain the file. It would ship only
  if someone deployed a `dist` built on this machine. `IMG_3379.MOV` has
  worked the same way since WO-4.33.
- `scripts/crm-articles.cache.json` and `scripts/crm-posts.cache.json` are
  modified in the working tree by the build's cache refresh. They are out
  of scope and are in neither WO-4.34 nor WO-4.35.
- The 404 on the live URL can only be checked after Joseph merges.
