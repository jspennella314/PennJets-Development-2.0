---
wo: WO-4.24
terminal: T4
branch: t4/work
commit: f7fd879
tested_against: "site: the built output served by vite preview at localhost:4179, from commit f7fd879, with Market Note content read live from https://www.pennforce.pennjets.com — NOT a production deploy, see Known gaps"
date: 2026-09-20
status: reported
---

# WO-4.24 report — two people removed, and the route that put them back

Charles Brennan and Joe DeLisio are gone from the site. More importantly, the
**mechanism that would have re-published them** is gone too: the author map
was not acting as a gate, and a name removed from the site returned the moment
the CRM reported that person as an author.

The sweep found one departed person still in the deploy configuration, and five
pieces of About copy that now make plural claims about one person. Both are
reported, not changed.

## Commit

`f7fd879` WO-4.24: remove two inactive people, and stop the CRM naming them
back. On `t4/work`, pushed. Not merged.

## 1. The removals

### Source

| File | What went |
|---|---|
| `About.jsx` | both team-member objects: names, titles, credentials, bios, phone numbers, addresses, specialties |
| `blogApi.js` | both entries in the author map, with their avatars |

### Image files deleted

| File | Bytes |
|---|---|
| `public/images/Meet-The-Team/CHARLES-BRENNAN.JPEG` | 86,424 |
| `public/images/Meet-The-Team/charles-brennan-96.webp` | 2,744 |

Joe DeLisio had no image file. His About entry carried `image: null` and his
author-map entry `avatar: null`, so there was nothing to delete. Both paths
return 404 from the built output; nothing else referenced either file.

### The grep the order asked for

```
$ grep -rniE 'charles|brennan|delisio|de ?lisio' src public index.html scripts
$ echo $?
1
```

Exit 1, no output. Same result against `dist/` after a build: no file in the
build output contains either name, in any spelling, or either address.

## 2. What a note authored by one of them now renders

**This is the part of the order that mattered, and the site was already
failing it before either person was involved.**

`transformPost` resolved the author like this:

```js
name: authorDetails.name || post.author.name || 'PennJets Team',
```

The author map is keyed by address and holds the people the site is willing to
name. That chain **falls through the map to `post.author.name`**, which is
whatever the CRM says. So removing someone from the map removed their bio and
their job title and left their name exactly where it was. A person deleted from
this repository would still have appeared under their own byline, on a public
article, sourced from the CRM.

It is not hypothetical. One published note is authored by the CRM's **`Admin
User`** service account, and the site was printing **"Admin User"** as the
byline on a live Market Note, over that account's own address.

### What I chose

**An author the map does not know is published under the house byline.** The
map becomes the gate it was supposed to be: being in it is what makes the site
willing to print a person's name.

| Field | A known person | An author the map does not know |
|---|---|---|
| Byline name | their name | **PennJets** |
| Job title | their title | nothing rendered, not a stand-in |
| Biography | their bio | nothing rendered |
| Avatar | their photo | the logo, 5,289 bytes |
| JSON-LD | `Person` with `jobTitle` | **`Organization`** |
| "Send ___ a message" | "Send Joseph" | **"Send us"** |
| Lead form and `mailto:` | their address | `joe@pennjets.com` |

Three choices inside that are worth stating, because each could have gone the
other way:

- **Not a generic stand-in.** The old chain supplied `'Aviation Consultant'`
  and a written biography to anyone who lacked one. That asserts a job title
  and a paragraph of career description about a named entity, neither of which
  anybody wrote. The fields are null and the markup renders nothing.
- **`Organization`, not `Person`.** Leaving the JSON-LD as a `Person` named
  "PennJets" with an empty `jobTitle` would publish a false structured claim
  to exactly the machines that read structured data.
- **Leads still arrive.** The unknown-author address resolves to Joseph, so
  the article's lead form routes to his webhook rather than to a departed
  person's address or to the generic fallback.

I did not touch authorship in the CRM. The order puts that with Joseph, in the
CMS.

### Rendered, read from the live DOM

**The unknown-author note**, `pilatus-pc-12-ngx-...`, CRM author `Admin User`:

Both columns are measured, not reasoned from the code. The before column was
rendered from a worktree at `33bf5d0`, the commit before this one, built and
served at `localhost:4180`.

| | Before, at `33bf5d0` | After, at `f7fd879` |
|---|---|---|
| Byline | `Admin User` | `PennJets` |
| Byline job title | `Aviation Consultant` | not rendered |
| Biography | "Aviation expert at PennJets, dedicated to providing insights and guidance on private aviation." | not rendered |
| JSON-LD author | `{"@type":"Person","name":"Admin User","jobTitle":"Aviation Consultant"}` | `{"@type":"Organization","name":"PennJets"}` |
| Contact heading | "Send **Admin** a message" | **"Send us a message"** |
| `mailto:` | **`admin@pennjets.com`** | `joe@pennjets.com` |
| "Admin User" anywhere on the page | yes | **no** |

### A fifth dead address, which I had not seen

I expected that `mailto:` to read `joe@pennjets.com`, because the WO-4.20
fallback supplies Joseph when a post carries no author email. Rendering the
old commit rather than reasoning from the code showed it read
**`admin@pennjets.com`**. The fallback never fired, because the post does
carry an address:

```
$ curl .../api/public/blog/pilatus-pc-12-ngx-...
"author": { "name": "Admin User", "email": "admin@pennjets.com" }
```

So a live Market Note published a reply-to address on a service account,
under a byline naming that service account. **WO-4.20 could not have caught
it.** That order proved its work by grepping `dist/`, and this address is
not in `dist/`: it is injected at runtime from the CRM, on a page whose
author block is built from whatever the API returns. A static grep of the
build output cannot see any address that arrives over the network.

It is fixed here as a side effect rather than by intent, since the house
byline routes to Joseph. Whether `admin@pennjets.com` is a real mailbox is a
CRM and mail question, and it is in the draft for Joseph.

**A known-author note**, `why-we-publish-market-notes`, to prove nothing
regressed:

```json
{
  "bylineName": "Joseph Pennella",
  "bylineTitle": "Founder and Principal Broker",
  "jsonLdAuthor": { "@type": "Person", "name": "Joseph Pennella",
                    "jobTitle": "Founder and Principal Broker" },
  "sendLine": "Send Joseph a message",
  "bioPresent": true,
  "mailto": ["mailto:joe@pennjets.com"]
}
```

### The About page rendered

```json
{
  "cards": ["Joseph Pennella"],
  "gridClass": "grid gap-8 mx-auto max-w-md grid-cols-1",
  "hasCharles": false,
  "hasDelisio": false,
  "addresses": ["joe@pennjets.com", "joe@pennjets.com"],
  "brokenImages": []
}
```

Screenshot of the team section taken at 1280 wide. One card, centred. The
same section at `33bf5d0` was captured for comparison and reads:

```json
{
  "cards": ["Joseph Pennella", "Charles Brennan", "Joe Delisio"],
  "gridClass": "grid grid-cols-1 lg:grid-cols-3 gap-8",
  "addresses": ["joe@pennjets.com", "charles@pennjets.com",
                "joedelisio@pennjets.com", "joe@pennjets.com"]
}
```

**One layout change, and only one.** The grid was `lg:grid-cols-3`, which
leaves a single card stranded in the left third of the section. The column
count now follows the roster length, so the card centres at one person and
returns to three columns if anyone is added. That is layout, not copy, which
is why it is here and the wording is not.

## Data evidence

n/a. No data was written by this order. No lead was submitted.

## Build

```
> vite build && node scripts/postbuild.mjs
✓ built in 6.65s
[postbuild] wrote 25 HTML files (9 Market Notes) and sitemap.xml with 24 URLs
```

Exit code 0. ESLint passes with `--max-warnings 0`.

## Tests

No test suite exists in this repository, so there is no count to give.

## 3. The sweep, reported and not acted on

Full list with a recommendation per line:
**`docs/drafts/t4/wo-4.24-name-and-address-sweep.md`**, for relaying to
`docs/orders/joseph.md`. The five things in it, in short:

1. **`.github/workflows/deploy.yml:38` carries `VITE_WEBHOOK_JAMES_WOFFORD`**
   with a live webhook ID. He was removed from the site in Round 3 and his
   name survived in the build configuration. **Nothing in the code reads that
   variable.** I recommend removing the line. Not touched.
2. **`admin@pennjets.com` and the `Admin User` byline**, described above.
   Fixed on the site by this commit, but two questions are Joseph's: whether
   that mailbox is real, and whether he wants the note reassigned in the CMS.
3. **Five pieces of About copy** now make plural claims about one person, of
   which **"30+ Years Combined Experience"** is the one I would fix first.
   Copy is Joseph's under `CLAUDE.md`. Not touched.
4. **`About.jsx:48` calls Joseph "Aviation Enthusiast"**, contradicting
   "Founder and Principal Broker", in a sentence with no verb. Not touched.
5. **`JOSEPH-PENNELLA.JPEG` is 8,856,577 bytes**, fetched on `/about` and
   rendered at 128 pixels. Roughly six times the hero video WO-4.19 exists to
   compress. Deserves its own order. Not touched.

Everything else is Joseph's own name, in his card, his author entry, his
webhook variable, his image paths and one code comment, plus three `info@`
mentions inside the explanatory comments WO-4.20 asked for. All recommended to
stay, with reasons given per line in the draft.

## Scope

```
src/components/pages/About/About.jsx        both people removed; grid follows roster
src/services/blogApi.js                     both author entries removed; the gate
src/components/pages/Blog/BlogArticle.jsx   house byline: JSON-LD type, title, bio, greeting
public/images/Meet-The-Team/CHARLES-BRENNAN.JPEG      deleted
public/images/Meet-The-Team/charles-brennan-96.webp   deleted
docs/drafts/t4/wo-4.24-name-and-address-sweep.md      the sweep, for Joseph
docs/reports/t4/WO-4.24.md                            this report
```

All within `PennJets-Development-2.0`. Nothing in the PennForce repository was
written. Nothing the sweep found beyond the two people was changed.

## Known gaps

1. **Not verified on a production deploy.** T4 does not merge. The evidence
   above is the built output served locally at `f7fd879`, with article content
   read live from the production CRM.

2. **No note by either person exists to photograph.** The order asked for "one
   Market Note that had one of them as author". The CRM has nine published
   notes: eight by Joseph, one by `Admin User`. Neither Charles Brennan nor
   Joe DeLisio authors any of them. The `Admin User` note exercises the same
   code path, which is why it is the evidence above, but it is a substitute
   and I would rather say so than imply I found what was asked for.

3. **`charles@pennjets.com`, `joedelisio@pennjets.com` and now
   `admin@pennjets.com` are untested as mailboxes.** All three are gone from
   the site either way. Whether mail to any of them arrives anywhere is a
   mail question, not a site one.

4. **I nearly reported an unmeasured before state.** The first draft of the
   table above gave the old `mailto:` as `joe@pennjets.com`, reasoned from
   the WO-4.20 fallback rather than rendered. Building the previous commit
   showed it was `admin@pennjets.com`. The habit that caught it is the only
   reason the fifth address is in this report at all, and the habit that
   nearly lost it is the same one behind the `info@` miscount in WO-4.20:
   answering from the code instead of from the running site.

5. **My own earlier note was wrong about these two.** The WO-4.20 order
   request said of both addresses: "They are people, not aliases, and nothing
   suggests they are dead. Leave them." That was reasoning from the shape of
   the address rather than checking who was still active, in a repository
   whose standing rule already said Joseph is the only person named. The
   order's second half exists because of that, and the sweep is how the third
   case gets caught rather than the fourth.
