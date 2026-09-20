# For Joseph — WO-4.10, privacy policy

**These four items belong in `docs/orders/joseph.md` in the PennForce repo.
T4 cannot write there:** `CLAUDE.md` and the T4 standing instruction both
forbid this terminal from writing to that repository, so they are queued here
and need relaying by the lead or by Joseph. Flagged in the WO-4.10 report.

Per the standing instruction, the rest of the order continued rather than
waiting on these.

---

## 1. Approve the wording

> **RESOLVED 2026-09-20.** Approved as written.

The draft is `docs/drafts/t4/privacy-policy.md`, generated from
`src/content/privacyPolicy.js`, which is what the page renders. Roughly 850
words, eight sections.

It is written only from the lead's verification of the CRM schema and
production on 2026-09-20 and from what this site was measured doing on the
same day. It makes no claim about retention periods, deletion automation or
processors beyond that list.

**Nothing in it is blocked on you.** It renders truthfully as written, so the
branch is safe to merge before you have read it. Approving changes the wording,
not the accuracy.

---

## 2. The address for access and deletion requests

> **STILL OPEN, asked twice.** Both replies on 2026-09-20 carried an unfilled
> placeholder where the answer should be:
>
> 1. "privacy@pennjets.com: [confirm whether that inbox exists and you monitor it]"
> 2. "privacy@pennjets.com: [yes, it exists and I monitor it / no, use joe@pennjets.com instead]"
>
> The square brackets are his in both, so the template came back with the
> choice still in it. It is the last thing outstanding on this page, and it
> matters: the address is published as the route for access and deletion
> requests, so somebody has to read it. **One word does it: keep, or swap to
> joe@pennjets.com.**

The draft uses `privacy@pennjets.com`, which the previous version of this page
already published, so it is not a new claim. Confirm it is monitored, or give
another address.

If nobody reads that mailbox, say so and I will point it at one that is read.

---

## 3. Google Fonts, a decision with two options

> **RESOLVED 2026-09-20 by WO-4.14.** Joseph chose self-hosting and the order
> was written and worked. The fonts are now served from pennjets.com and no
> request reaches Google. Nothing below needs a decision; kept for the record.

Measured on production, 2026-09-20: loading any page on pennjets.com makes a
request to `fonts.googleapis.com` and `fonts.gstatic.com` for the Inter
typeface. That means a reader's browser contacts Google on every page view and
Google receives their IP address and user agent.

This is a real third-party data flow and it is **not** on the list of
processors the lead verified. The order says to ask rather than infer, so the
page currently does not mention it either way.

| Option | What it means |
|---|---|
| **A. Self-host the fonts** (recommended) | Serve Inter from pennjets.com. The request never leaves our domain, the sentence is not needed, and the "no third parties" claim on the page becomes literally true. Also removes two external requests from every page load. Small change, about an hour. |
| **B. Name Google in the policy** | Add a line saying the typeface is loaded from Google and that Google receives your IP address. Accurate, but it weakens the short version's claim that there are no third parties. |

Option A is cleaner and I would recommend it. Either way this needs an order
before I do it; it is not in WO-4.10.

---

## 4. The effective date

The page says "Last updated 20 September 2026", which is a statement of fact
about the document rather than a legal effective date. If you want an effective
date instead, give me the date and the wording.

---

## 5. The cookie policy contradicts the new page, and needs its own order

> **RESOLVED 2026-09-20 by WO-4.12.** The order was written and worked; the
> cookie policy now matches a measurement. Kept for the record.

`/cookie-policy` is live right now and says, among other things:

- "uses cookies and similar tracking technologies"
- "Performance & Analytics Cookies ... (e.g., Google Analytics)"
- "Advertising & Targeting Cookies ... deliver relevant ads"
- "third-party cookies from our partners ... analytics platforms and
  advertising networks"
- and it sends readers to `optout.networkadvertising.org`

Measured on production on 2026-09-20: **this site sets no cookies at all**,
`document.cookie` is empty, there is no Google Analytics, and there are no
advertising networks. Every one of those statements is false.

The new privacy policy says there are no cookies. Both pages are linked from
the same footer, so once this ships the two contradict each other in public.

I have not touched it, because a work order exists only as a file and there
isn't one for the cookie policy. It needs either a short order to rewrite it
from what the site actually does, or an order to remove the page and its
footer link, since a site with no cookies arguably does not need a cookie
policy at all. I would suggest rewriting it: one short page saying no cookies
are set and naming the single session storage value.

---

## Note for the lead

The existing live privacy policy is also materially false: it claims a payment
processor, cookie identifiers, and advertising and analytics partners, none of
which exist. The replacement above is what fixes it, which is worth knowing
when scheduling the merge. Item 5 is the same problem on the neighbouring
page and is not fixed.
