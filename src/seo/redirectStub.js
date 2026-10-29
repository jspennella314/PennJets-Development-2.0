// A redirect stub at every former Market Note URL. GitHub Pages has no 308,
// so a note whose slug changed keeps its old address as a small page: a
// script that carries the query string and hash across (the utm_* a social
// caption put there must reach the beacon on the note, CLAUDE.md), a refresh
// at 0 for a reader without scripts, the canonical, and a plain link.
// postbuild writes one per entry of the list route's previousSlugs; never in
// the sitemap; prerender leaves a file with a refresh as written. WO-4.54.

import { SITE_URL } from './siteMeta.js';

const SLUG = /^[a-z0-9][a-z0-9-]*$/;

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function redirectStubHtml({ title, slug }) {
  const url = `${SITE_URL}/blog/${slug}`;
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    `<title>${esc(title)}</title>`,
    `<script>location.replace(${JSON.stringify(url)} + location.search + location.hash);</script>`,
    `<meta http-equiv="refresh" content="0; url=${esc(url)}">`,
    `<link rel="canonical" href="${esc(url)}">`,
    '</head>',
    '<body>',
    `<p>This note has moved: <a href="${esc(url)}">${esc(url)}</a></p>`,
    '</body>',
    '</html>',
    '',
  ].join('\n');
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
