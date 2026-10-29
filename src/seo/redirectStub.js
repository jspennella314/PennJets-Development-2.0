// A redirect stub at every former Market Note URL. GitHub Pages has no 308,
// so a note whose slug changed keeps its old address as a small page: a
// script that carries the query string and hash across (the utm_* a social
// caption put there must reach the beacon on the note, CLAUDE.md), a refresh
// at 0 for a reader without scripts, the canonical, and a plain link.
// postbuild writes one per entry of the list route's previousSlugs; never in
// the sitemap; prerender leaves a file with a refresh as written. WO-4.54.
//
// The same template serves a retired site page: /services, gone since
// WO-4.53, answered 404 from Pages before the SPA could send it on. Its stub
// goes to the home page's paths section, noindex. WO-4.54 Part 2 addendum,
// built in WO-4.56's pre-PR commit.

import { SITE_URL } from './siteMeta.js';

const SLUG = /^[a-z0-9][a-z0-9-]*$/;

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The one template. `base` is the target without its hash; `hash` is the
// target's own fragment, used only when the visitor's URL has none, so the
// query string always lands before the fragment.
function stubHtml({ title, base, hash = '', canonical = base, noindex = false, moved }) {
  const url = base + hash;
  const go = hash
    ? `${JSON.stringify(base)} + location.search + (location.hash || ${JSON.stringify(hash)})`
    : `${JSON.stringify(base)} + location.search + location.hash`;
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    `<title>${esc(title)}</title>`,
    `<script>location.replace(${go});</script>`,
    `<meta http-equiv="refresh" content="0; url=${esc(url)}">`,
    `<link rel="canonical" href="${esc(canonical)}">`,
    ...(noindex ? ['<meta name="robots" content="noindex">'] : []),
    '</head>',
    '<body>',
    `<p>${esc(moved)} <a href="${esc(url)}">${esc(url)}</a></p>`,
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

export function redirectStubHtml({ title, slug }) {
  return stubHtml({ title, base: `${SITE_URL}/blog/${slug}`, moved: 'This note has moved:' });
}

// The retired /services page, written to dist/services.html.
export function servicesStubHtml() {
  return stubHtml({
    title: 'Penn Jets',
    base: `${SITE_URL}/`,
    hash: '#paths',
    noindex: true,
    moved: 'This page has moved:',
  });
}

// Every stub this list of posts asks for, and why any entry was refused: a
// former slug that is some note's current slug (the live page wins), one that
// is not a plain slug (it becomes a file path), or one listed twice.
export function redirectStubs(posts) {
  const live = new Set(posts.map((p) => p.slug).filter(Boolean));
  const stubs = [];
  const skipped = [];
  const seen = new Set();
  for (const post of posts) {
    if (!post.slug || !Array.isArray(post.previousSlugs)) continue;
    for (const old of post.previousSlugs) {
      if (live.has(old)) { skipped.push(`${old}: is a live note's slug`); continue; }
      if (typeof old !== 'string' || !SLUG.test(old)) { skipped.push(`${old}: not a plain slug`); continue; }
      if (seen.has(old)) { skipped.push(`${old}: listed twice`); continue; }
      seen.add(old);
      stubs.push({ from: old, to: post.slug, html: redirectStubHtml({ title: post.title, slug: post.slug }) });
    }
  }
  return { stubs, skipped };
}
