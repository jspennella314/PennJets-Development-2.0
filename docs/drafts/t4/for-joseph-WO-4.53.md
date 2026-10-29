# For Joseph, from WO-4.53 (relayed by the lead)

Two questions, both before any code changes. Nothing has been deleted
yet: `/services` is live as it is today. Line numbers are at site `main`
`818ab32`.

- **Part A: the Services page.** I checked every sentence on
  `Services.jsx` against `/buy`, `/sell`, `/consulting` and `/charter`.
  Most are already said there. **Ten are not** (table A2): for each, say
  **drop** or **move** (to the page I propose, or another).
- **Part B: Consulting's scope.** A before/after of the intro, the four
  bullets and the placeholder, built on your three: ownership analysis,
  fleet planning, pre-purchase strategy.

The page has **five** service cards, not three: Aircraft Sales,
Aircraft Acquisition, Charter Brokerage, Market Analysis (`:61`) and
Consulting Services (`:78`). All five are covered below.

## Part A. The Services page, sentence by sentence

### A1. Already said on the four pages: these go with the page

| Services line | Already on |
|---|---|
| Hero: "From acquisitions and sales to charter brokerage and consulting, we deliver tailored aviation solutions…" (`:197`) | The home tiles (Buy, Sell, Charter) and the menu; About's description names all four lines of business |
| Sales: "Strategic positioning and expert negotiation to maximize value and minimize time to market." (`:11`) | `/sell`: "where it sits in the current market and what a realistic timeline looks like"; "We manage the offer, inspection and closing with you." |
| Sales: "Comprehensive market analysis and pricing strategy" (`:18`) | `/sell` step 2: "We agree an asking price and a plan, and take it to buyers." |
| Sales: "Expert negotiation and deal structuring" (`:21`) | `/sell` step 3: "We manage the offer…" |
| Sales: "Transaction support through closing" (`:22`) | `/sell` step 3: "…inspection and closing with you." |
| Acquisition: "Comprehensive search, evaluation, and acquisition services to find your ideal aircraft." (`:28`) | `/buy`: "We source aircraft that aren't publicly listed. Tell us the mission…" |
| Acquisition: "Detailed needs analysis and consultation" (`:35`) | `/buy` step 1: "We talk through the mission: passengers, trips, budget, and timeline." |
| Acquisition: "Extensive market research and aircraft sourcing" (`:36`) | `/buy` step 2: "We identify aircraft that fit, including ones that aren't publicly listed." |
| Acquisition: "Pre-purchase inspections and evaluations" (`:37`) | `/buy` step 3: "We manage the offer, inspection, and closing with you." |
| Charter: "Access to vetted Part 135 operators through our extensive partner network." (`:45`) | `/charter` "What happens next" step 2: "We source options from licensed Part 135 operators…"; the home Charter note: "vetted, FAA-certificated Part 135 operators" |
| Charter: "Flights arranged with licensed Part 135 operators" (`:52`) | `/charter`: "Every flight is operated by a licensed Part 135 carrier" |
| Charter: "Operator safety records reviewed before we quote" (`:53`) | Partly: `/charter` says "certificated" and "licensed", and the home tile says "vetted". **Safety records** are not named anywhere. Covered unless you want that named |
| Charter: "Trip coordination with the operator" (`:54`) | `/charter` step 3: "The operator flies the trip; we coordinate the details." |
| Charter: "Routing options matched to the mission" (`:56`) | `/charter` quote subtitle: "We'll come back with options and a firm quote." |
| Consulting: "Aircraft selection and mission fit" (`:86`) | `/consulting` bullet 1, same words |
| Consulting: "Comprehensive cost-benefit analysis" (`:87`) and "Budget and cost-of-ownership modeling" (`:90`) | `/consulting` bullet 2: "Cost of ownership and budget modelling" |
| Consulting: "Ownership structure options" (`:88`) | `/consulting` bullet 3: "Ownership structure options, sole or fractional" |
| Consulting: "Coordination with your tax and legal advisors" (`:89`) | `/consulting`: "We work alongside your own tax and legal advisors rather than in place of them." |
| Approach 01: "Comprehensive discussion of your aviation objectives, budget parameters, and timeline requirements." (`:100`) | `/buy` step 1 (above) |
| Approach 02: "Thorough market research and development of a customized strategy…" (`:110`) | `/buy` step 2, `/sell` step 2 |
| Advantage: "Hands-on experience across aircraft transactions, charter brokerage, and fractional structures" (`:142`) | About's description: "sole ownership, fractional, charter brokerage, and advisory" (not one of the four pages, but it is on the site) |
| Advantage: "Dedicated consultants providing personalized attention throughout every transaction" (`:160`) | `/charter`: "You talk to the broker who books your trip… stays with the trip until you land." |
| Closing band: "Connect with Penn Jets to discuss how we can support your specific requirements…" (`:352`) | Every page's "Prefer to talk? Contact us" and `/contact` |

**Headings, labels and buttons** (no claim of their own; they go with
the page): the hero's badge "Professional Aviation Services" (`:190`),
"Our Service Portfolio" and its line (`:208-210`), the five card titles,
"Discuss This Service" (`:257`), "Our Approach" and "A clear process,
followed the same way on every engagement" (`:270-272`), the four step
titles, "The PennJets Advantage" and "What sets us apart…" (`:315-317`),
the four advantage titles, "Ready to Elevate Your Aviation Experience?"
(`:350`), and the buttons "Schedule a Consultation" and "Buy an
Aircraft".

### A2. Not said anywhere else: your call, line by line

| # | Services line | Recommendation |
|---|---|---|
| 1 | h1: "Comprehensive Solutions for Sophisticated Aviation Needs" (`:194`) | **Drop.** Self-description with no fact in it. |
| 2 | Sales: "Professional photography and marketing materials" (`:19`) | **Move to `/sell` step 2 only if you do this on every listing:** "We agree an asking price and a plan, photograph the aircraft, and take it to buyers." Otherwise **drop**. |
| 3 | Sales: "Global buyer network and targeted outreach" (`:20`) | **Drop.** "Take it to buyers" already says the outreach; "global network" is a reach claim nothing on the site backs. |
| 4 | Acquisition: "Financing and insurance coordination" (`:38`) | **Move to `/buy` step 3 if you coordinate both:** "We manage the offer, inspection, financing, insurance and closing with you." Otherwise **drop**. |
| 5 | Acquisition: "Delivery logistics and acceptance support" (`:39`) | **Move with row 4 if true:** "…closing and delivery with you." Otherwise **drop**. |
| 6 | Charter: "Transparent quotes with no hidden fees" (`:55`) | **Drop.** A pricing claim. `/charter` already says what it can back: "You see what each certificated operator quoted and why one is recommended." |
| 7 | Market Analysis card: "Data-driven insights and valuations to support informed investment decisions." (`:62`), with "Comprehensive aircraft valuations" (`:69`) | **Move to `/consulting`, inside "ownership analysis"** (Part B, bullet 1 names valuation). This decides the footer's "Valuation Services" link: if valuation stays a stated service, the link keeps pointing at `/consulting`; if it is dropped, the link goes too. |
| 8 | Market Analysis: "Market trend analysis and forecasting", "Competitive landscape assessments", "Investment return modeling", "Portfolio diversification strategies" (`:70-73`) | **Drop all four.** Forecasting and returns read as investment advice; the Market Notes on `/blog` already carry the market commentary. The footer's "Market Analysis" link would then point at `/blog` (proposed) or go. |
| 9 | Consulting card: "Strategic aviation consulting for individuals, corporations, and family offices." (`:79`) | **Your choice.** It is the only line on the site that says who consulting is for. To keep it, it goes in `/consulting`'s intro (Part B, option). Otherwise **drop**. |
| 10 | Approach 03/04 and two advantages: "Precise implementation with transparent communication, keeping you informed at every milestone." (`:120`); "Seamless completion and ongoing advisory support to ensure long-term success and satisfaction." (`:130`); "Extensive relationships with operators, buyers, and industry professionals worldwide" (`:151`); "Successful transactions and satisfied clients across all aircraft categories" (`:169`) | **Drop all four.** The first two are generic. The last two are reach and track-record claims that nothing on the site backs. |

A short answer works: for example "all drop except 7, and 4 without
insurance".

## Part B. Consulting's scope (`/consulting`)

Your scope: **ownership analysis, fleet planning, pre-purchase
strategy.** The form, its fields and `service: 'consulting'` do not
change.

| Where | Before | After (draft) |
|---|---|---|
| h1 (`:42`) | Aviation Consulting | Aviation Consulting *(unchanged)* |
| Intro (`:43-45`) | Cost of ownership, mission fit, ownership structure, or a second opinion on a deal in front of you. Tell us what you need help with. | Ownership analysis, fleet planning and pre-purchase strategy. Tell us what you need help with. |
| Intro, only if you keep A2 row 9 | — | Ownership analysis, fleet planning and pre-purchase strategy, for individuals, companies and family offices. Tell us what you need help with. |
| Bullet 1 (`:107`) | Aircraft selection and mission fit | Ownership analysis: what the aircraft is worth, what it costs to own, and whether sole or fractional fits |
| Bullet 2 (`:108`) | Cost of ownership and budget modelling | Fleet planning: which aircraft fit the mission, now and as it changes |
| Bullet 3 (`:109`) | Ownership structure options, sole or fractional | Pre-purchase strategy: what to check, what to offer, and a second opinion on a deal already in front of you |
| Bullet 4 (`:110`) | A second opinion on a deal already in front of you | *(removed: folded into bullet 3)* |
| Placeholder (`:71`) | The more detail the better: the aircraft or category, the decision in front of you, and your timeline. | *Unchanged (recommended).* It already asks for the specifics, and naming the three again would repeat the intro. |
| Aside note (`:113`) | We work alongside your own tax and legal advisors rather than in place of them. | *Unchanged.* |

**Folding the four into three loses nothing.** "Aircraft selection and
mission fit" moves to fleet planning. "Cost of ownership and budget"
and "sole or fractional" move to ownership analysis. "A second opinion"
moves to pre-purchase strategy.

The words "what the aircraft is worth" in bullet 1 depend on A2 row 7.
If you drop valuation, bullet 1 becomes "Ownership analysis: what it
costs to own, and whether sole or fractional fits".

## What happens after your answer

The moves you approve are committed first, in your words. Then Services
is removed: `/services` and its old anchors redirect to the home
tiles, Services leaves the menu and footer, and the sitemap drops it.
The Consulting copy follows your Part B answer. All of it reaches you
again in the PR.
