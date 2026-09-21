# For Joseph — WO-4.11, the sticky contact bar

> **RESOLVED 2026-09-20 by WO-4.13.** (954) 546-0763 is the number Joseph
> answers, and it is now the only number on the site. The bar already dialled
> it. Nothing below needs a decision; it is kept for the record.

**Belongs in `docs/orders/joseph.md` in the PennForce repo. T4 cannot write
there**, so it is queued here and needs relaying. Same constraint as the
WO-4.10 items in the file beside this one.

The order continued rather than waiting on this: the bar is built and the
number it dials is the one the order told me to use.

---

## Which phone number should the Call button dial?

The bar now dials **(954) 546-0763**, because WO-4.11 says to use the number
already in the footer and not to introduce a second one.

That is the minority number on the site. Counted:

| Number | Where it appears |
|---|---|
| **(973) 868-8425** | charter page hero, Market Note broker form, contact page, About (your entry), home page structured data `telephone` |
| **(954) 546-0763** | the footer bar, About (Joe Delisio's entry), the legal pages |

So the bar currently puts the *less* used number one tap away on every page,
including on Market Notes where the broker form directly above it shows
(973) 868-8425. A reader could see two different numbers on one screen.

**Two options, both one line of code:**

| Option | Effect |
|---|---|
| **A. Change the bar to (973) 868-8425** | Matches the number on the pages that convert. Leaves the footer showing a different number, which is then worth changing too. |
| **B. Change the footer to (973) 868-8425** | One number everywhere. The bar follows automatically, since it reads the footer's. |

**B is the tidier fix** if (973) is the right number for inbound calls. Tell me
which and it is done in the same breath as any other copy change.

If (954) genuinely is the switchboard and (973) is your direct line, say so and
I will leave the bar as it is and stop raising it.
