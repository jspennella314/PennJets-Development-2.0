// The redirect stubs postbuild writes at former Market Note URLs. WO-4.54.

import { describe, it, expect } from 'vitest';
import { redirectStubHtml, redirectStubs, servicesStubHtml } from './redirectStub.js';

const NEW = 'https://www.pennjets.com/blog/dassault-falcon-900b-for-sale-2026-market-study';
const FALCON = {
  slug: 'dassault-falcon-900b-for-sale-2026-market-study',
  title: 'Dassault Falcon 900B for Sale: 2026 Market Study',
  previousSlugs: ['title-dassault-falcon-900b-for-sale-2026-market-study'],
};

describe('redirectStubHtml', () => {
  const html = redirectStubHtml(FALCON);
  it('refresh 0, the canonical, the title and the plain link, as Part 1', () => {
    expect(html).toContain(`<meta http-equiv="refresh" content="0; url=${NEW}">`);
    expect(html).toContain(`<link rel="canonical" href="${NEW}">`);
    expect(html).toContain('<title>Dassault Falcon 900B for Sale: 2026 Market Study</title>');
    expect(html).toContain(`<p>This note has moved: <a href="${NEW}">${NEW}</a></p>`);
    expect(html).not.toMatch(/noindex/);
  });
  it('carries the query string and hash across (the utm_* the beacon reads)', () => {
    expect(html).toContain(`<script>location.replace("${NEW}" + location.search + location.hash);</script>`);
    expect(html.indexOf('<script>')).toBeLessThan(html.indexOf('http-equiv="refresh"'));
  });
  it('escapes the title', () => {
    expect(redirectStubHtml({ title: 'A <b> & "c"', slug: 'x' })).toContain('<title>A &lt;b&gt; &amp; &quot;c&quot;</title>');
  });
});

describe('servicesStubHtml (the retired /services page)', () => {
  const html = servicesStubHtml();
  it('refresh 0 to /#paths, canonical /, noindex, the plain link', () => {
    expect(html).toContain('<meta http-equiv="refresh" content="0; url=https://www.pennjets.com/#paths">');
    expect(html).toContain('<link rel="canonical" href="https://www.pennjets.com/">');
    expect(html).toContain('<meta name="robots" content="noindex">');
    expect(html).toContain('<p>This page has moved: <a href="https://www.pennjets.com/#paths">https://www.pennjets.com/#paths</a></p>');
  });
  it('carries the query string across, ahead of the fragment', () => {
    expect(html).toContain('<script>location.replace("https://www.pennjets.com/" + location.search + (location.hash || "#paths"));</script>');
    expect(html.indexOf('<script>')).toBeLessThan(html.indexOf('http-equiv="refresh"'));
  });
});

describe('redirectStubs', () => {
  it('one stub per former slug, pointing at the current one', () => {
    const { stubs, skipped } = redirectStubs([FALCON, { slug: 'other', title: 'Other', previousSlugs: [] }, { slug: 'old-list', title: 'No field' }]);
    expect(stubs.map((s) => [s.from, s.to])).toEqual([[FALCON.previousSlugs[0], FALCON.slug]]);
    expect(skipped).toEqual([]);
  });
  it('never over a live note, never a path, never twice', () => {
    const { stubs, skipped } = redirectStubs([
      { slug: 'a', title: 'A', previousSlugs: ['b', '../index', 'old', 'old'] },
      { slug: 'b', title: 'B', previousSlugs: [] },
    ]);
    expect(stubs.map((s) => s.from)).toEqual(['old']);
    expect(skipped).toEqual(["b: is a live note's slug", '../index: not a plain slug', 'old: listed twice']);
  });
});
