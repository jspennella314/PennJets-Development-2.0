---
wo: WO-4.25
terminal: T4
branch: t4/work
commit: 9a16618
tested_against: "site: the full build at 9a16618 run four times locally — once to fill the cache, once in steady state, once with CRM_REFRESH_ARTICLES=1, and once with the CRM host made unresolvable; CRM: the production deploy at https://www.pennforce.pennjets.com, which a steady-state build does not call at all"
date: 2026-09-21
status: reported
---

# WO-4.25 report — a build no longer fetches a single Market Note

A build in steady state calls `GET /api/public/blog/{slug}` **zero times** and
writes **zero `ContentAnalytics` rows**, where every build wrote nine.

## Commit

`9a16618` WO-4.25: the prerenderer no longer fetches Market Notes from the
CRM. On `t4/work`, pushed. Not merged.

## The order's approach does not work, and here is the measurement

The order says to answer the article fetch "from the data `postbuild.mjs`
already fetched". **The list endpoint does not carry it.** Every field it
returns, measured against production:

```
id  title  slug  excerpt  featuredImage  metaTitle  metaDescription
keywords  publishedAt  viewCount  leadCount  author{id,name}
```

| Needed to answer the page's fetch | In the list |
|---|---|
| `contentHtml` / `content`, the article itself | **no** |
| `author.email` | **no**, only `id` and `name` |
| `updatedAt` | **no** |

Answering from the list would have rendered an article with no body, under the
house byline instead of Joseph's, because the author map is keyed on the email
the list omits. The order forbids exactly that: "this must not fix the
analytics by rendering an empty page."

So the bodies are cached instead.

## What was built

`postbuild.mjs` fetches each note's body once and stores it in
`scripts/crm-articles.cache.json`, keyed by slug. `prerender.mjs` intercepts
the page's own fetch the same way it already intercepts the beacon, and
answers from that cache.

**When a body is refetched**, and only then:

- it has never been cached, or
- the list shows the post changed: title, excerpt, meta title, meta
  description, featured image, published date, keywords or author name, or
- the cached copy is more than seven days old, or
- `CRM_REFRESH_ARTICLES=1` is set.

**A slug with no cached body is let through, not faked.** It renders correctly
and writes one row, and the build says so by name. One analytics row is a
smaller problem than an article that renders empty, and a silent fake would be
worse than both.

## Route evidence

### The console lines, as the order asked

First build, filling an empty cache:

```
[postbuild] article bodies: 0 from cache, 9 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
[prerender] 25 of 25 routes rendered in 34.0s, 122,683 characters of body text added
[prerender] 9 view beacon(s) intercepted; none reached the CRM.
[prerender] 9 article fetch(es) answered from cache; none reached the CRM, so none wrote a ContentAnalytics row.
```

Every build after it:

```
[postbuild] article bodies: 9 from cache, 0 fetched (each fetch writes one ContentAnalytics row; reuse writes none)
[prerender] 9 view beacon(s) intercepted; none reached the CRM.
[prerender] 9 article fetch(es) answered from cache; none reached the CRM, so none wrote a ContentAnalytics row.
```

**`0 fetched` is the number the order is about.** The postbuild line reports
its own cost in the same breath, because that is the one place a build can
still write rows and it should not take reading the source to find out.

### The pages still contain their articles

| Note | Body characters |
|---|---|
| `the-light-jet-market-in-2026` | **10,966** |
| `pilatus-pc-12-ngx` | **7,013** |
| `why-we-publish-market-notes` | **3,337** |

Measured with `<noscript>` stripped, so this is app content and not the stub.
Totals across 25 routes are unchanged at 122,683 characters, the same number as
the build before this change.

The byline is unaffected, which is the thing answering from the list would have
broken:

```
Joseph Pennella present      : true
Founder and Principal Broker : true
house byline "PennJets" used : false
```

### Proof that nothing reached the CRM

The strongest available, short of the lead's row count: **a full build with the
CRM host made unresolvable.**

```
$ VITE_CRM_API_URL=https://crm-that-does-not-exist.invalid npm run build
[postbuild] CRM UNREACHABLE (fetch failed).
[postbuild] article bodies: 0 from cache, 0 fetched
[prerender] 25 of 25 routes rendered in 32.0s, 114,997 characters of body text added
[prerender] 9 article fetch(es) answered from cache; none reached the CRM
exit 0
```

| Note | Body characters | "Note Not Found" |
|---|---|---|
| `the-light-jet-market-in-2026` | **10,678** | no |
| `why-we-publish-market-notes` | **3,011** | no |

A build that produces complete articles while the CRM does not resolve is a
build that did not call it.

## Data evidence

**No `ContentAnalytics` row was written by the last three builds**, which is
the claim for the lead to check. Rows were written by the first build of this
change, nine of them, filling the cache, and by one earlier refresh run with
`CRM_REFRESH_ARTICLES=1`, nine more.

**For the lead's window:** the eighteen rows are between roughly 01:10 and
01:25 local on 2026-09-21. Every build after that wrote none, and the next
build to write any will be one where a note has actually changed.

No lead was submitted. No CRM configuration was touched.

## Build

```
> vite build && node scripts/postbuild.mjs && node scripts/prerender.mjs
[postbuild] article bodies: 9 from cache, 0 fetched
[prerender] 25 of 25 routes rendered in 32.7s, 122,683 characters of body text added
exit 0
```

`npm run lint` passes with `--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give.

## A second thing this fixed

**A build with the CRM unreachable now publishes the real articles.** Before
this, WO-4.23's headline guard correctly refused nine pages that had rendered
as "Note Not Found" and failed the build, which was right but left the site
unable to deploy during a CRM outage. With bodies cached, an outage prerenders
the articles as they last were and the build succeeds.

## Scope

```
scripts/postbuild.mjs               fetches and caches article bodies
scripts/prerender.mjs               intercepts and answers the article fetch
scripts/crm-articles.cache.json     new, committed, 130,799 bytes, 9 notes
docs/reports/t4/WO-4.25.md          this report
```

All within `PennJets-Development-2.0`. Nothing in the PennForce repository was
written.

## What I need from the lead

**`updatedAt` on the list endpoint**, or the body on the list endpoint.

Without it the cache cannot tell that a note's text was edited when nothing
else about the post moved, so staleness is bounded by a seven-day ceiling
rather than detected. That ceiling is the one remaining source of rows: nine,
once a week, per note that has not otherwise changed.

With `updatedAt` the fingerprint becomes exact, the ceiling goes away, and the
count is unconditionally zero until something actually changes. WO-4.23's order
puts CRM API changes with the lead rather than with me, which is why this is a
request and not a patch.

## Known gaps

1. **Not verified on a production deploy.** T4 does not merge, and `main` is
   not publishing at all until WO-4.26 lands.

2. **The row count is the lead's to confirm.** I can show that a build does not
   call the endpoint; only the database shows that no row appeared.

3. **The seven-day ceiling is a guess, not a measurement.** It trades nine rows
   a week against how long a silently edited note may stay stale. If Joseph
   edits published notes often it is too long, and if he never does it is
   wasted. `updatedAt` removes the need to guess.

4. **The Market Notes index still fetches the list at runtime.** `/blog` calls
   the list endpoint, which writes no rows, so it is outside this order. It is
   why the CRM-unreachable build above came to 114,997 characters rather than
   122,683: the index rendered with no cards while every article rendered in
   full.

5. **The cache is 130,799 bytes of article text in the repository.** That is a
   real change in what this repo holds, and it will grow with each note. It
   buys zero analytics rows and a site that survives a CRM outage, which I
   think is worth it, but it is worth saying out loud rather than leaving for
   someone to find.
