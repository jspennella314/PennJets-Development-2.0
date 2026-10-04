// The list pager against stubbed CRM responses. WO-4.40.
//
//   node src/services/blogPaging.test.mjs
//
// No runner in the site (WO-4.38, Known gaps), so a node script against the
// real blogPaging.js with a fake fetch. Exits 1 on any failure.

import { fetchAllPosts, PAGE_SIZE, MAX_PAGES } from './blogPaging.js';

let failed = 0;
function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
  if (!ok) console.log(`      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

const BASE = 'https://crm.test';
const note = (i) => ({ id: `id-${i}`, slug: `note-${String(i).padStart(3, '0')}`, publishedAt: new Date(Date.UTC(2026, 0, 1) - i * 86400000).toISOString() });

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

console.log(`--- 120 notes, PAGE_SIZE ${PAGE_SIZE}`);
{
  const c = crm(120); const q = quiet();
  const got = await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: q.warn });
  check('every note fetched', got.length, 120);
  check('each exactly once', new Set(got.map((p) => p.slug)).size, 120);
  check('in the CRM\'s order', got.map((p) => p.slug), c.all.map((p) => p.slug));
  check('3 requests: offsets 0, 50, 100', c.requests, ['?limit=50&offset=0', '?limit=50&offset=50', '?limit=50&offset=100']);
  check('stopped on hasMore: false, no warning', q.warnings, []);
}

console.log('--- 11 notes (today): one request');
{
  const c = crm(11); const q = quiet();
  const got = await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: q.warn });
  check('11 notes', got.length, 11);
  check('one request', c.requests, ['?limit=50&offset=0']);
  check('no warning', q.warnings, []);
}

console.log('--- exactly 50 notes: hasMore is false on the first page');
{
  const c = crm(50); const q = quiet();
  const got = await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: q.warn });
  check('50 notes, one request', [got.length, c.requests.length], [50, 1]);
}

console.log('--- 0 notes');
{
  const c = crm(0); const q = quiet();
  const got = await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: q.warn });
  check('empty list, one request, no warning', [got.length, c.requests.length, q.warnings.length], [0, 1, 0]);
}

console.log(`--- a CRM that always says hasMore: true (the hard stop, MAX_PAGES ${MAX_PAGES})`);
{
  const c = crm(120, { alwaysMore: true }); const q = quiet();
  const got = await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: q.warn });
  // Pages 4.. return no posts (offset past the end), so the empty-page stop
  // fires before the page cap does.
  check('stops with the 120 real notes', got.length, 120);
  check('4 requests (the 4th was empty)', c.requests.length, 4);
  check('warns once', q.warnings.length, 1);
  check('  the warning names the empty page', /page 4 \(offset 150\) was empty/.test(q.warnings[0]), true);
}
{
  // Posts on every page, hasMore always true: only the page cap can end it.
  const requests = [];
  const fetch = async (u) => { requests.push(u); const o = parseInt(new URL(u).searchParams.get('offset')); return { ok: true, json: async () => ({ posts: Array.from({ length: 50 }, (_, i) => note(o + i)), pagination: { total: 99999, limit: 50, offset: o, hasMore: true } }) }; };
  const q = quiet();
  const got = await fetchAllPosts({ baseUrl: BASE, fetch, warn: q.warn });
  check(`hard stop after ${MAX_PAGES} pages`, requests.length, MAX_PAGES);
  check(`  ${MAX_PAGES * 50} notes kept`, got.length, MAX_PAGES * 50);
  check('  warns once, naming the page cap', [q.warnings.length, /after 20 pages/.test(q.warnings[0])], [1, true]);
}

console.log('--- a response with no pagination field at all (the old silent stop)');
{
  const c = crm(120, { noPagination: true }); const q = quiet();
  const got = await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: q.warn });
  check('does not stop after one page: all 120 fetched', got.length, 120);
  check('ends on the empty 4th page with a warning', [c.requests.length, q.warnings.length], [4, 1]);
}

console.log('--- the CRM caps the page size at 20 (echoed in pagination.limit)');
{
  const c = crm(45, { cap: 20 }); const q = quiet();
  const got = await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: q.warn });
  check('steps by the applied limit, nothing skipped', got.length, 45);
  check('offsets 0, 20, 40', c.requests.map((r) => r.split('offset=')[1]), ['0', '20', '40']);
}

console.log('--- a note published between page 1 and page 2 (every later offset shifts by one)');
{
  const all = Array.from({ length: 60 }, (_, i) => note(i));
  let calls = 0;
  const fetch = async (u) => {
    const o = parseInt(new URL(u).searchParams.get('offset'));
    if (calls++ === 1) all.unshift({ id: 'id-new', slug: 'note-new', publishedAt: '2026-02-01T00:00:00.000Z' });
    const posts = all.slice(o, o + 50);
    return { ok: true, json: async () => ({ posts, pagination: { total: all.length, limit: 50, offset: o, hasMore: o + 50 < all.length } }) };
  };
  const got = await fetchAllPosts({ baseUrl: BASE, fetch, warn: () => {} });
  check('the shifted note is kept once, not twice', got.filter((p) => p.slug === 'note-049').length, 1);
  check('60 distinct notes (the new one arrives on the next load)', [got.length, new Set(got.map((p) => p.slug)).size], [60, 60]);
}

console.log('--- filters are carried on every page');
{
  const c = crm(60); const q = quiet();
  await fetchAllPosts({ baseUrl: BASE, fetch: c.fetch, warn: q.warn, category: 'market-notes' });
  check('category on both pages', c.requests, ['?limit=50&offset=0&category=market-notes', '?limit=50&offset=50&category=market-notes']);
  const c2 = crm(1);
  await fetchAllPosts({ baseUrl: BASE, fetch: c2.fetch, warn: q.warn, keyword: 'Penn Jets' });
  check('keyword encoded', c2.requests, ['?limit=50&offset=0&keyword=Penn+Jets']);
}

console.log('--- an HTTP error throws (callers decide: blogApi returns [], postbuild falls back to the cache)');
{
  let threw = null;
  try { await fetchAllPosts({ baseUrl: BASE, fetch: async () => ({ ok: false, status: 503 }), warn: () => {} }); } catch (e) { threw = e.message; }
  check('throws with the status', threw, 'CRM list returned 503');
}

console.log(failed ? `\n${failed} FAILED` : '\nall passed');
process.exit(failed ? 1 : 0);
