# For Joseph — WO-4.12, cookie policy

**Belongs in `docs/orders/joseph.md` in the PennForce repo. T4 cannot write
there**, so it is queued here and needs relaying. Same constraint as the
WO-4.10 and WO-4.11 items beside this file.

The order continued rather than waiting: the page is written and it is accurate
as it stands.

---

## Approve the wording

> **RESOLVED 2026-09-20.** Approved as written.

Draft: `docs/drafts/t4/cookie-policy.md`, generated from
`src/content/cookiePolicy.js`, which is what the page renders. About 600 words,
six sections.

It replaces a page that claimed this site sets analytics cookies, advertising
and targeting cookies, Google Analytics, and third-party cookies from
advertising networks. I measured the site in a clean browser profile across
eight pages. **The cookie store was empty at the end of it.** Every one of
those claims was false.

**Nothing in it is blocked on you**, so the branch is safe to merge before you
have read it. Approving changes the wording, not the accuracy.

The one judgement call worth your eye: the page says plainly that the session
id we store *is* an identifier on your device for as long as the tab is open,
rather than describing it as nothing. That is the honest reading and I think it
reads better than the alternative, but it is a tone choice and it is yours.

---

## One thing that will change under you, and is already ordered

The page currently has a paragraph saying the typeface is fetched from Google
Fonts and that Google therefore receives your IP address. That is true today.

WO-4.14 removes it by serving the fonts from this site. When that lands I will
update the paragraph to say the request no longer happens, in the same branch,
so the page is never wrong. Flagging it so the sentence does not surprise you
if you read the draft before WO-4.14 is done.

---

## Not a decision, just so you have it

The rule from your instruction is now written into the file, at the top of
`src/content/cookiePolicy.js`, where anyone editing the copy will read it:

> Policy follows reality, never the reverse. If analytics are ever added, this
> page changes in the same order as the analytics, not before to be ready and
> not after to catch up.
