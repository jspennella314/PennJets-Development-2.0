# For Joseph — WO-4.15, two ambiguous dropdown labels

> **DECIDED 2026-09-20.** Joseph: "your proposal is right. 'Selling my
> aircraft' / 'Buying an aircraft'. Label by what the visitor is doing."
> Not yet built: copy changes need an order, and one has been requested in
> `order-request-labels-and-hero.md` beside this file.

**Belongs in `docs/orders/joseph.md` in the PennForce repo. T4 cannot write
there**, so it is queued here and needs relaying. Same constraint as the other
files beside this one.

The order is done and did not wait on this. Nothing is broken; this would make
a good thing better.

---

## The contact page's service dropdown reads ambiguously

The dropdown offers, among others:

- **Aircraft Sales**
- **Aircraft Acquisition**

Following this site's own `/services` definitions, those mean *selling an
owner's aircraft* and *buying one for a client*, so they now post `sell` and
`buy` and land in the right CRM filter.

The trouble is what a reader thinks they mean. "Aircraft Sales" reads
naturally as "aircraft you have for sale". Someone who wants to **buy** may
well pick it, and their lead lands under `sell`, where a broker will work it as
a seller enquiry until they open the message.

## The fix is two labels

| Now | Suggested |
|---|---|
| Aircraft Sales | **Selling my aircraft** |
| Aircraft Acquisition | **Buying an aircraft** |
| Charter Brokerage | Charter *(unchanged, or "Charter a flight")* |
| Consulting | Consulting *(unchanged)* |
| Other | Other *(unchanged)* |

The reader picks by what they want to do rather than by what we call the
service internally. The mapping underneath does not change, so nothing about
the CRM filter is affected.

This is copy, so it is yours. WO-4.15 puts copy out of scope and I have not
touched the labels. Say the word and it is a two-line change.

---

## Also worth knowing, not a decision

`aircraft-acquisition` no longer reaches the CRM from anywhere on the site. The
lead mentioned the filter still accepts it as a historical value; that
allowance can be retired whenever they like. Existing rows that carry it are
untouched.
