---
wo: WO-4.18
terminal: T4
branch: t4/work
commit: 1eb457a
tested_against: "site: the built output at 1eb457a served by vite preview at localhost:4183; CRM: the production deploy at https://www.pennforce.pennjets.com, which accepted both test leads — NOT a production site deploy, see Known gaps"
date: 2026-09-21
status: reported
---

# WO-4.18 report — the dropdown names what the visitor is doing

Two labels changed. Nothing underneath them moved, and two live submissions
prove it.

## Commit

`1eb457a` WO-4.18 and WO-4.21: dropdown labels, and a reason not to delete a
video. On `t4/work`, pushed. Not merged.

## Route evidence

### The rendered dropdown, read from the DOM

```
value=""                      Select a service
value="aircraft-sales"        Selling my aircraft
value="aircraft-acquisition"  Buying an aircraft
value="charter-brokerage"     Charter Brokerage
value="consulting"            Consulting
value="other"                 Other
```

The three labels out of scope are untouched. Screenshot taken at 900 wide.

### The mapping did not move

```js
const SERVICE_MAP = {
  'aircraft-sales': 'sell',
  'aircraft-acquisition': 'buy',
  'charter-brokerage': 'charter',
  consulting: 'consulting',
  other: undefined,
  '': undefined,
};
```

Byte for byte what WO-4.15 left. The option `value` attributes are unchanged,
so the same key reaches the same service.

**One thing I changed that the order did not list.** `SERVICE_LABELS`, which
records what the reader saw so a broker can read their actual choice, still
said "Aircraft Sales". Leaving it would have put the old label in the lead
message under the new dropdown, which is the WO-4.13 failure of a corrected
label over a stale record. Both entries now match the options.

## Data evidence

Two leads submitted through the rendered form against the production CRM.

| Option chosen | Posted `service` | HTTP | `leadId` |
|---|---|---|---|
| **Selling my aircraft** | `sell` | 200 | `cmuapxvcm001rjp04m0p4x1bs` |
| **Buying an aircraft** | `buy` | 200 | `cmuapxxcs001zjp046slczye8` |

Both match what WO-4.15 mapped. The payload was read from the outgoing request,
not inferred.

**Both are test leads and both are deletable.** They are named
`T4 TEST WO-4.18 sell (delete)` and `T4 TEST WO-4.18 buy (delete)`, from
`t4-test-sell-418@example.com` and `t4-test-buy-418@example.com`, with a
message saying so and the timestamp. The lead reads the rows back and removes
them.

## Build

```
> vite build && node scripts/postbuild.mjs && node scripts/prerender.mjs
[prerender] 25 of 25 routes rendered in 34.0s, 122,203 characters of body text added
```

Exit 0. `npm run lint` passes with `--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give.

## Scope

```
src/components/pages/Contact/Contact.jsx    two option labels, two SERVICE_LABELS
                                            entries, and the comment above the map
docs/reports/t4/WO-4.18.md                  this report
```

All within `PennJets-Development-2.0`. Nothing in the PennForce repository was
written, and no CRM configuration was changed. The only CRM effect is the two
test leads above.

## Known gaps

1. **Not verified on a production site deploy.** T4 does not merge. The form
   was served from the built output locally; the CRM it posted to is
   production.

2. **Nobody has confirmed the leads arrived as rows.** I have the `leadId` the
   webhook returned for each, which is what the order asked for, but reading
   the stored rows back is the lead's, in the CRM.

3. **"Charter Brokerage" was left alone**, as the order says. It is the
   remaining label phrased as what the business does rather than what the
   visitor wants, and the order request floated "Charter a flight" for it. Out
   of scope here and worth one line from Joseph if he wants consistency.
