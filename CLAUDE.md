# CLAUDE.md — pennjets.com (PennJets-Development-2.0)

Standing rules for every Claude Code session in this repository. Read this before anything else.

## What this is

The public website for Penn Jets LLC: `https://www.pennjets.com`. Vite + React 18 single-page app. It is the top of the funnel. Traffic arrives from social posts and search, reads the blog, and submits leads. Every lead goes to PennForce (the CRM), which lives in a separate repository (`pennforce-crm-development-beta2.4`) that this repo never touches.

## The business (write copy accordingly)

Penn Jets is a **private aviation sales and consulting** business: sole ownership, fractional, and charter sales, plus consulting engagements. It is **not** a Part 135 operator and does not have a fleet. Never write copy that implies Penn Jets operates aircraft, employs crew, or is a direct air carrier. Any regulatory, licensing, or legal claim on the site (broker status, carrier disclaimers, FAA language) goes to Joseph before it is written. Never invent aircraft availability, pricing, or transaction history.

## Ownership

- This terminal (T4) owns this entire repository.
- It never edits, clones into, or runs commands in the PennForce repo.
- The contract between the two systems is `docs/integration/PENNJETS-SITE.md` in the PennForce repo. T4 reads it; T4 does not change it. If the site needs a CRM change, T4 reports to the lead engineer, who assigns it inside PennForce.
- The lead engineer audits T4 on integration points only: the view beacon, the webhook lead payload, and calls to `/api/public/blog/*`. Everything else on the site is directed by Joseph.

## Integration facts (verified 2026-09-19, do not get these wrong)

- CRM host: `https://www.pennforce.pennjets.com`
- Blog content is read from `GET /api/public/blog/{slug}`. The site does not store posts.
- Leads are posted to `POST /api/webhooks/incoming/{webhookId}`, one webhook ID per author (`VITE_WEBHOOK_JOE_PENNELLA`, `VITE_WEBHOOK_JAMES_WOFFORD`). The payload includes `blogPostSlug`, `pageUrl`, and `utm_*`. The CRM resolves the slug and stores `source: 'blog'` and `blogPostId`. Do not change this payload without the lead.
- The view beacon is `POST /api/public/blog/{slug}/view` with `{ utm_source, utm_medium, utm_campaign, referrer }`, optional `sessionId`. CORS allows exactly `https://www.pennjets.com` and `https://pennjets.com`. It must fire once per article view, from the browser, after the article renders. It must never block rendering or throw.
- Social captions link to `pennjets.com/blog/{slug}?utm_source={platform}&utm_medium=social&utm_campaign={slug}`. The site must preserve those query parameters through any redirect or router transition until the beacon has read them.

## Evidence standard

Nothing is done when you say it is done. It is done when the evidence is pasted:
- Commit hash on your branch, pushed
- For anything visual: a screenshot of the deployed preview, not localhost
- For the beacon or the lead form: the network request and response from the browser, and the row ID the CRM returned
- For SEO changes: the rendered `<head>` for the page, or Lighthouse output
- Build passes with zero errors, output pasted
- Only this repository touched

Treat any checkbox or "done" in this repo's existing docs as intent, not evidence. Verify against the deployed site.

## Branching and deploys

- Work on branches named `site/<topic>`. Never commit to `main` directly.
- Find out how this site deploys (see Day Zero in your brief) before the first push. Do not assume.
- Joseph merges and deploys. You push branches and report.
- Blocked at the permissions layer: force push, `git reset --hard`, `rm -rf`. A denied command is a stop condition, not a puzzle.

## Out of scope unless Joseph says otherwise

- Any change to the lead payload or webhook IDs
- Analytics vendors, tag managers, or tracking pixels beyond the beacon
- Paid ads, ad pixels, retargeting
- Anything that stores personal data in the browser beyond the session
- Copy that makes operational, pricing, or regulatory claims
