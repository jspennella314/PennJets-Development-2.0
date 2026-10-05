// The list pager against stubbed CRM responses. WO-4.40, folded into vitest
// by WO-4.41 (was blogPaging.test.mjs, a node script; every case kept).

import { describe, it, expect } from 'vitest';
import { fetchAllPosts, PAGE_SIZE, MAX_PAGES } from './blogPaging.js';

const BASE = 'https://crm.test';
const note = (i) => ({
  id: `id-${i}`,
  slug: `note-${String(i).padStart(3, '0')}`,
  publishedAt: new Date(Date.UTC(2026, 0, 1) - i * 86400000).toISOString(),
});

// A fake CRM holding `total` notes, answering limit/offset exactly as the
// route does (app/api/public/blog/route.ts: take/skip, hasMore = offset+limit < total).
function crm(total, { alwaysMore = false, noPagination = false, cap = null } = {}) {
  const all = Array.from({ length: total }, (_, i) => note(i));
  const requests = [];
  const fetch = async (u) => {
    const url = new URL(u);
    requests.push(url.search);
    let limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    if (cap) limit = Math.min(limit, cap);
    const posts = all.slice(offset, offset + limit);
    const body = noPagination
      ? { posts }
      : { posts, pagination: { total, limit, offset, hasMore: alwaysMore ? true : offset + limit < total } };
    return { ok: true, status: 200, json: async () => body };
  };
  return { fetch, requests, all };
}

const quiet = () => { const w = []; return { warn: (m) => w.push(m), warnings: w }; };

describe(`120 notes, PAGE_SIZE ${PAGE_SIZE}`, async () => {
  const c = crm(120); const q = quiet();
  const got = await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: q.warn });
  it('every note fetched', () => expect(got.length).toBe(120));
  it('each exactly once', () => expect(new Set(got.map((p) => p.slug)).size).toBe(120));
  it("in the CRM's order", () => expect(got.map((p) => p.slug)).toEqual(c.all.map((p) => p.slug)));
  it('3 requests: offsets 0, 50, 100', () =>
    expect(c.requests).toEqual(['?limit=50&offset=0', '?limit=50&offset=50', '?limit=50&offset=100']));
  it('stopped on hasMore: false, no warning', () => expect(q.warnings).toEqual([]));
});

describe('11 notes (today): one request', async () => {
  const c = crm(11); const q = quiet();
  const got = await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: q.warn });
  it('11 notes', () => expect(got.length).toBe(11));
  it('one request', () => expect(c.requests).toEqual(['?limit=50&offset=0']));
  it('no warning', () => expect(q.warnings).toEqual([]));
});

describe('exactly 50 notes: hasMore is false on the first page', async () => {
  const c = crm(50); const q = quiet();
  const got = await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: q.warn });
  it('50 notes, one request', () => expect([got.length, c.requests.length]).toEqual([50, 1]));
});

describe('0 notes', async () => {
  const c = crm(0); const q = quiet();
  const got = await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: q.warn });
  it('empty list, one request, no warning', () =>
    expect([got.length, c.requests.length, q.warnings.length]).toEqual([0, 1, 0]));
});

describe(`a CRM that always says hasMore: true (the hard stop, MAX_PAGES ${MAX_PAGES})`, () => {
  describe('the stub runs out of posts: the empty-page stop fires first', async () => {
    const c = crm(120, { alwaysMore: true }); const q = quiet();
    const got = await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: q.warn });
    it('stops with the 120 real notes', () => expect(got.length).toBe(120));
    it('4 requests (the 4th was empty)', () => expect(c.requests.length).toBe(4));
    it('warns once', () => expect(q.warnings.length).toBe(1));
    it('  the warning names the empty page', () => expect(q.warnings[0]).toMatch(/page 4 \(offset 150\) was empty/));
  });

  describe('posts on every page: only the page cap can end it', async () => {
    const requests = [];
    const fetch = async (u) => {
      requests.push(u);
      const o = parseInt(new URL(u).searchParams.get('offset'));
      return {
        ok: true,
        json: async () => ({
          posts: Array.from({ length: 50 }, (_, i) => note(o + i)),
          pagination: { total: 99999, limit: 50, offset: o, hasMore: true },
        }),
      };
    };
    const q = quiet();
    const got = await fetchAllPosts({ baseUrl: BASE, fetch, warn: q.warn });
    it(`hard stop after ${MAX_PAGES} pages`, () => expect(requests.length).toBe(MAX_PAGES));
    it(`  ${MAX_PAGES * 50} notes kept`, () => expect(got.length).toBe(MAX_PAGES * 50));
    it('  warns once, naming the page cap', () =>
      expect([q.warnings.length, /after 20 pages/.test(q.warnings[0])]).toEqual([1, true]));
  });
});

describe('a response with no pagination field at all (the old silent stop)', async () => {
  const c = crm(120, { noPagination: true }); const q = quiet();
  const got = await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: q.warn });
  it('does not stop after one page: all 120 fetched', () => expect(got.length).toBe(120));
  it('ends on the empty 4th page with a warning', () => expect([c.requests.length, q.warnings.length]).toEqual([4, 1]));
});

describe('the CRM caps the page size at 20 (echoed in pagination.limit)', async () => {
  const c = crm(45, { cap: 20 }); const q = quiet();
  const got = await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: q.warn });
  it('steps by the applied limit, nothing skipped', () => expect(got.length).toBe(45));
  it('offsets 0, 20, 40', () => expect(c.requests.map((r) => r.split('offset=')[1])).toEqual(['0', '20', '40']));
});

describe('a note published between page 1 and page 2 (every later offset shifts by one)', async () => {
  const all = Array.from({ length: 60 }, (_, i) => note(i));
  let calls = 0;
  const fetch = async (u) => {
    const o = parseInt(new URL(u).searchParams.get('offset'));
    if (calls++ === 1) all.unshift({ id: 'id-new', slug: 'note-new', publishedAt: '2026-02-01T00:00:00.000Z' });
    const posts = all.slice(o, o + 50);
    return { ok: true, json: async () => ({ posts, pagination: { total: all.length, limit: 50, offset: o, hasMore: o + 50 < all.length } }) };
  };
  const got = await fetchAllPosts({ baseUrl: BASE, fetch, warn: () => {} });
  it('the shifted note is kept once, not twice', () => expect(got.filter((p) => p.slug === 'note-049').length).toBe(1));
  it('60 distinct notes (the new one arrives on the next load)', () =>
    expect([got.length, new Set(got.map((p) => p.slug)).size]).toEqual([60, 60]));
});

describe('filters are carried on every page', () => {
  it('category on both pages', async () => {
    const c = crm(60);
    await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: () => {}, category: 'market-notes' });
    expect(c.requests).toEqual(['?limit=50&offset=0&category=market-notes', '?limit=50&offset=50&category=market-notes']);
  });
  it('keyword encoded', async () => {
    const c2 = crm(1);
    await fetchAllPosts({ baseUrl: BASE, fetch: c2.fetch, warn: () => {}, keyword: 'Penn Jets' });
    expect(c2.requests).toEqual(['?limit=50&offset=0&keyword=Penn+Jets']);
  });
});

describe('an HTTP error throws (callers decide: blogApi returns [], postbuild falls back to the cache)', () => {
  it('throws with the status', async () => {
    await expect(fetchAllPosts({ baseUrl: BASE, fetch: async () => ({ ok: false, status: 503 }), warn: () => {} }))
      .rejects.toThrow('CRM list returned 503');
  });
});
