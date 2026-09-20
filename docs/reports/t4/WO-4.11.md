---
wo: WO-4.11
terminal: T4
branch: t4/work
commit: 38acc5f
tested_against: "site: local dev (vite 5173) at 38acc5f — NOT yet a production deploy, see Known gaps; CRM: production dpl_FsRLBXmS8bFju1c5tEwGi18Kxapp (5b95295)"
date: 2026-09-20
status: reported
---

# WO-4.11 report — sticky contact bar, five-field limit on mobile

## Commit

`38acc5f` WO-4.11: sticky contact bar, and five fields above submit on mobile.
On `t4/work`, pushed. Not merged.

## Route evidence

### Visible fields above the action button, at 390

A field is a labelled control or a fieldset group, which is what a reader
perceives as one thing to fill in. A radio group counts once. The action button
is the submit, or the Continue that stands in for it on the stepped charter
form. Counted in the browser, not by eye.

| Form | Fields | Action button | The fields |
|---|---|---|---|
| charter step 1 | **5** | Continue | From, To, Departure Date, Return Date, Passengers |
| charter step 2 | **4** | Send Request | Name, Email, Phone, Notes |
| buy | **5** | Send Inquiry | Name, Email, Ownership, Aircraft or category, Timeline |
| sell | **5** | Send Details | Name, Email, Make, Model, Year |
| consulting | **4** | Send Request | Name, Email, Phone, What do you need help with |
| contact | **4** | Send Message | Name, Email, Service Interest, Message |
| pennshare | **4** | Send Inquiry | Full Name, Email Address, Additional Comments, consent |
| Market Note form | **4** | Send Message | name, email, phone, message |

Every form is at or under five. No field was removed from any form.

### How each form was got there

- **charter** splits into two steps below `sm`. Six of its nine fields are
  required, so no disclosure could bring it under five without hiding a
  required control, and a `required` input inside `display:none` makes the
  browser refuse to submit with a control it cannot focus. The steps are the
  trip, then your details. Native validation runs per step through
  `reportValidity`, because only the active step is mounted. One step at `sm`
  and above, with no Continue.
- **buy, sell, contact, pennshare** put optional fields behind a disclosure
  that names what is inside, so a reader who needs one knows to open it:
  "Add phone, passengers and trip length", "Add phone, total time and
  location", "Add phone and company", "Add phone and share size". Required
  fields are never hidden.
- **consulting** and the **Market Note form** were already under five and are
  unchanged.

### Sticky bar

Two actions. **Call** is a `tel:` link to `(954) 546-0763`, the number in the
footer, per the order. The second action points at the inquiry form that fits
the page:

| Page | Second action | Goes to | Why |
|---|---|---|---|
| `/` and `/services` | Request a Quote | `/charter#quote` | charter is the highest-volume path |
| `/charter` | Request a Quote | `/charter#quote` | its own form |
| `/buy`, `/sell`, `/consulting` | Request a Quote | that page's form | its own form |
| `/pennshare` | Request a Quote | `/pennshare#inquire` | its own form |
| `/blog/:slug` | **Talk to a Broker** | `#talk-to-a-broker` | the note's own broker form, at the foot of the page |
| `/aircraft`, `/aircraft/:id` | Request a Quote | `/buy` | browsing aircraft is a buying intent |
| `/contact` | Request a Quote | `/contact` | its own form |
| everything else | Request a Quote | `/contact` | the fallback the order names |

The Market Note label differs deliberately: a reader mid-article has not asked
for a quote yet, and the page already has a broker form.

### Overlap, measured with each protected element scrolled into view

The bar is 71px tall. `main` carries `pb-24`, and the bar hides itself whenever
a footer or a form's action button is on screen.

| Width | Page | Article last line | Footer link | Form button | Overflow |
|---|---|---|---|---|---|
| 390 | home | n/a | clear, bar hidden | n/a | no |
| 390 | Market Note | clear | clear, bar hidden | clear, bar hidden | no |
| 390 | inquiry form | n/a | clear, bar hidden | clear | no |
| 1440 | home | n/a | clear, bar hidden | n/a | no |
| 1440 | Market Note | clear | clear, bar hidden | clear, bar hidden | no |
| 1440 | inquiry form | n/a | clear, bar hidden | clear, bar hidden | no |

Nothing is covered at either width. `innerWidth === documentElement.scrollWidth`
on every page checked, so no horizontal overflow.

### One lead per changed form, from a 390 viewport

The disclosure was opened and its fields filled in each case, so the hidden
fields are proven to reach the payload.

```
charter     HTTP 200  leadId=cmua0fa4l0007ku04dbncr67a  service=charter     utm_source=t4-test  utm_content=form  message=7 lines
buy         HTTP 200  leadId=cmua0fdb1000fku04lccm9x32  service=buy         utm_source=t4-test  utm_content=form  message=6 lines
sell        HTTP 200  leadId=cmua0fh8p000nku04p24at85m  service=sell        utm_source=t4-test  utm_content=form  message=6 lines
                      blogPostSlug=why-we-publish-market-notes
contact     HTTP 200  leadId=cmua0fjzl000vku049ikocjnh  service=consulting  utm_source=t4-test  utm_content=form  message=1 line
pennshare   HTTP 200  leadId=cmua0fmq80013ku047ruf8qfu  service=buy         utm_source=t4-test  utm_content=form  message=3 lines
```

`service` survived on all five. All five UTM parameters survived on all five.
`blogPostSlug` survived where the form was reached with `?note=`. The message
line counts confirm the disclosure fields were captured: buy sends six lines
including passengers and trip length, sell six including total time and
location, both of which live behind the disclosure.

## Data evidence

CRM production runtime logs, all five on the deploy named in `tested_against`:

```
16:07:51 leadId=cmua0fmq80013ku047ruf8qfu  t4-test-pennshare-411@example.com
16:07:47 leadId=cmua0fjzl000vku049ikocjnh  t4-test-contact-411@example.com
16:07:44 leadId=cmua0fh8p000nku04p24at85m  t4-test-sell-411@example.com
16:07:38 leadId=cmua0fdb1000fku04lccm9x32  t4-test-buy-411@example.com
16:07:34 leadId=cmua0fa4l0007ku04dbncr67a  t4-test-charter-411@example.com
dep=dpl_FsRLBXmS8bFju1c5tEwGi18Kxapp branch=main, all 200
```

### Test leads — Joseph deletes, not me

| Form | leadId |
|---|---|
| charter | `cmua0fa4l0007ku04dbncr67a` |
| buy | `cmua0fdb1000fku04lccm9x32` |
| sell | `cmua0fh8p000nku04p24at85m` |
| contact | `cmua0fjzl000vku049ikocjnh` |
| pennshare | `cmua0fmq80013ku047ruf8qfu` |

All named "T4 TEST WO-4.11 ... (delete)".

## UI evidence

Screenshots in T4's scratchpad under `shots/wo411/`: `home`, `market-note` and
`inquiry-form`, each at 390 and 1440, plus a `-bottom` variant scrolled to the
foot of the page showing the bar retracted clear of the footer.

## Build

```
> vite build && node scripts/postbuild.mjs
✓ built in 3.04s
```

Exit code 0. ESLint passes with `--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give.

## Scope

Touched, all within `PennJets-Development-2.0`:

```
src/components/common/StickyContactBar/StickyContactBar.jsx   new
src/components/common/StickyContactBar/quoteTarget.js         new, the routing table
src/components/common/MoreFields/MoreFields.jsx               new, the disclosure
src/hooks/useNarrowViewport.js                                new
src/App.jsx                                                   mounts the bar, pb-24 on main
src/components/pages/Charter/Charter.jsx                      two-step on mobile
src/components/pages/Buy/Buy.jsx                              disclosure
src/components/pages/Sell/Sell.jsx                            disclosure
src/components/pages/Contact/Contact.jsx                      disclosure, labels fixed
src/components/pages/PennShare/PennShare.jsx                  disclosure, labels fixed, #inquire anchor
src/components/pages/Blog/BlogArticle.jsx                     #talk-to-a-broker anchor
docs/reports/t4/WO-4.11.md                                    this report
```

Nothing in the PennForce repository was written.

## Known gaps

1. **Site evidence is not from a production deploy**, as with WO-4.4 and
   WO-4.10: the changes do not exist on the deployed site until this branch is
   merged, and T4 does not merge. The submissions hit the **production CRM**.

2. **Two phone numbers on the site, and the bar uses the footer's.** The order
   says to use the number already in the footer and not to introduce a second,
   so Call dials `(954) 546-0763`. But `(973) 868-8425` is the number used
   almost everywhere else: the charter page, the Market Note broker form, the
   contact page, and the `telephone` field in the home page's structured data.
   The footer's is the minority number. If `(954)` is not the right number to
   put one tap away on every page, that is a copy item for Joseph and a
   one-line change. **Queued in `docs/drafts/t4/for-joseph-WO-4.11.md`.**

3. **Labels fixed outside the strict scope of this order.** The contact and
   PennShare forms had labels that neither wrapped their input nor carried a
   `for` attribute, so a screen reader announced an unlabelled box. I was
   restructuring that exact markup for the disclosure and fixed it rather than
   carefully preserving a defect. No behaviour changed beyond the labels being
   announced. The Market Note form has the same defect and was **not** touched,
   because I had no reason to edit its markup; it still shows four unlabelled
   fields.

4. **The contact page's `service` values do not match the four service
   strings.** Its dropdown posts `aircraft-sales`, `aircraft-acquisition`,
   `charter-brokerage`, `consulting` or `other`. Only `consulting` is one of
   the four, and `aircraft-acquisition` is the historical value the lead
   mentioned. So a contact-page lead may not land in the filter the way an
   inquiry-form lead does. Pre-existing, not introduced here, and not in this
   order. Flagged for the lead.

5. **The bar hides on any form button, not only inquiry forms.** The newsletter
   subscribe form counts, so the bar retracts when the newsletter block is on
   screen too. That is harmless and arguably right, but it is broader than the
   order's wording and worth knowing.
