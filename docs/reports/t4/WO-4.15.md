---
wo: WO-4.15
terminal: T4
branch: t4/work
commit: 3d4d415
tested_against: "site: local dev (vite 5173) at 3d4d415 — NOT yet a production deploy, see Known gaps; CRM: production dpl_FsRLBXmS8bFju1c5tEwGi18Kxapp (5b95295)"
date: 2026-09-20
status: reported
---

# WO-4.15 report — the contact page posts one of the four service values

Four of the five dropdown options posted a value the CRM filter does not know.
All five now resolve to one of `charter | buy | sell | consulting`, or to no
`service` field at all.

## Commit

`3d4d415` WO-4.15: the contact page posts one of the four service values.
On `t4/work`, pushed. Not merged.

## Route evidence

### The mapping, option by option

| Dropdown label | Option value | `service` posted | Why |
|---|---|---|---|
| Select a service | `""` | **none** | nothing chosen, nothing to claim |
| Aircraft Sales | `aircraft-sales` | **`sell`** | see below |
| Aircraft Acquisition | `aircraft-acquisition` | **`buy`** | see below |
| Charter Brokerage | `charter-brokerage` | **`charter`** | direct |
| Consulting | `consulting` | **`consulting`** | unchanged, it was already one of the four |
| Other | `other` | **none** | no home among the four; a null service is honest |

**Sales and Acquisition were the only judgement call**, and this site's own
`/services` page settles it rather than my guess:

> **Aircraft Sales** — "Strategic positioning and expert negotiation to maximize
> value and minimize time to market." Features: market analysis and pricing
> strategy, photography and marketing materials, global buyer network,
> negotiation, transaction support through closing.

That is representing an owner selling an aircraft. It maps to **`sell`**.

> **Aircraft Acquisition** — "Comprehensive search, evaluation, and acquisition
> services to find your ideal aircraft." Features: needs analysis, market
> research and sourcing, pre-purchase inspections, financing coordination,
> delivery logistics.

That is representing a client buying an aircraft. It maps to **`buy`**.

### Nothing the reader chose is lost

When an option maps to no `service` — `Other`, or no selection — the broker
would otherwise have no idea what was picked. The chosen label is prepended to
the message instead, so it survives regardless:

```
Service interest: Other

<the reader's message>
```

### One submission per distinct mapped value

Submitted from a 390 viewport against the production CRM, with UTM parameters
on the URL:

| Option chosen | `service` posted | Expected | `leadId` |
|---|---|---|---|
| Aircraft Sales | `sell` | `sell` | `cmuadzccv0003l804hi0jr1nh` |
| Aircraft Acquisition | `buy` | `buy` | `cmuadzfd5000bl804qztwmyms` |
| Charter Brokerage | `charter` | `charter` | `cmuadziia000jl804pm1uuq50` |
| Consulting | `consulting` | `consulting` | `cmuadzlgt000rl804yqichutr` |
| Other | *field absent* | *field absent* | `cmuadzohf000zl8040hjvg3jt` |

Five of five matched. Each message began `Service interest: <the label>`,
confirming the choice reached the broker in both the mapped and the unmapped
case.

The lead reads the rows back and confirms the column; that half is not mine.

### Test leads — Joseph deletes, not me

All five above, named `T4 TEST WO-4.15 <option> (delete)`:

```
cmuadzccv0003l804hi0jr1nh   aircraft-sales
cmuadzfd5000bl804qztwmyms   aircraft-acquisition
cmuadziia000jl804pm1uuq50   charter-brokerage
cmuadzlgt000rl804yqichutr   consulting
cmuadzohf000zl8040hjvg3jt   other
```

## Data evidence

The `service` value in each posted payload is quoted in the table above, read
from the outgoing request rather than described. The CRM returned
`{"success":true}` with the `leadId` shown for all five.

## UI evidence

The dropdown is unchanged on screen: same five options, same labels, same
order. This order changed what is posted, not what is displayed.

## Build

```
> vite build && node scripts/postbuild.mjs
✓ built in 3.79s
```

Exit code 0. ESLint passes with `--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give.

## Scope

```
src/components/pages/Contact/Contact.jsx    the mapping, and the label preserved in the message
docs/reports/t4/WO-4.15.md                  this report
```

All within `PennJets-Development-2.0`. Nothing in the PennForce repository was
written. No other form was touched: the order says they already post correct
values, and WO-4.11's evidence confirms it.

## Known gaps

1. **Not verified on a production deploy.** The mapping does not reach the
   deployed site until this branch is merged, and T4 does not merge. The
   submissions hit the **production CRM**.

2. **No fifth value was added, and none is warranted.** The order says to queue
   it rather than add it if I thought one was needed. I do not: `Other` is a
   genuine catch-all and a null service is the honest record of it. There is
   nothing to queue.

3. **The two labels remain ambiguous to a reader**, which is a copy question
   and therefore Joseph's. "Aircraft Sales" reads to a layperson as "aircraft
   you have for sale", so someone wanting to *buy* may well pick it and land in
   `sell`. The mapping follows the site's own stated meaning, which is the only
   defensible reading available to me, but clearer labels would remove the
   ambiguity at the source — "Selling my aircraft" and "Buying an aircraft"
   would. **Queued in `docs/drafts/t4/for-joseph-WO-4.15.md`** rather than
   changed, because the order puts copy out of scope and copy is his.

4. **`aircraft-acquisition` no longer reaches the CRM.** The order noted the
   filter also accepts it as a historical value. Nothing now sends it, so that
   allowance can be retired whenever the lead chooses; existing rows carrying it
   are untouched and unaffected.
