// The one pager over the CRM's list route. Shared by the browser bundle
// (blogApi.getAllPosts, the Market Notes index) and by scripts/postbuild.mjs
// in Node, so it is plain ESM: no import.meta, no window, and the fetch and
// the base URL are passed in. WO-4.40.
//
// The CRM's contract (app/api/public/blog/route.ts, read on the CRM's main):
//
//   GET /api/public/blog?limit=<n>&offset=<n>
//     limit  default 10, no upper bound in the route
//     offset default 0
//   -> { posts: [...], pagination: { total, limit, offset, hasMore } }
//
// Before this, the index asked with no limit and showed 10 of 11 notes, and
// postbuild paged with ?page=, which the route ignores, stopping after one
// page because the response has no totalPages.

export const PAGE_SIZE = 50;
export const MAX_PAGES = 20;

/**
 * Every published note, in the CRM's order (publishedAt descending).
 *
 * Follows offset += limit while pagination.hasMore. The loop ends only on
 * hasMore === false; a missing field is not a stop, because that is how the
 * old postbuild loop stopped early without saying so. A page with no posts
 * and no hasMore: false, or MAX_PAGES pages, ends it with a warning instead,
 * so a bad response cannot loop and cannot pass silently.
 *
 * @param {object} o
 * @param {string} o.baseUrl   CRM origin, no trailing slash
 * @param {string} [o.category]  bare category slug, the CRM's strict filter
 * @param {string} [o.keyword]   free-text search
 * @param {typeof fetch} [o.fetch]  defaults to the global fetch
 * @param {(msg: string) => void} [o.warn]  defaults to console.warn
 * @returns {Promise<Array>} raw posts, exactly as the CRM returned them
 */
export async function fetchAllPosts({ baseUrl, category, keyword, fetch: fetchImpl, warn } = {}) {
  const doFetch = fetchImpl || globalThis.fetch;
  const log = warn || ((m) => console.warn(m));
  const all = [];
  const seen = new Set();
  let offset = 0;
  for (let page = 1; ; page += 1) {
    const url = new URL(`${baseUrl}/api/public/blog`);
    url.searchParams.set('limit', String(PAGE_SIZE));
    url.searchParams.set('offset', String(offset));
    if (category) url.searchParams.set('category', category);
    if (keyword) url.searchParams.set('keyword', keyword);

    const res = await doFetch(url.toString());
    if (!res.ok) throw new Error(`CRM list returned ${res.status}`);
    const data = await res.json();
    const posts = Array.isArray(data.posts) ? data.posts : [];
    const pg = data.pagination || {};

    // A note published between two pages shifts every later offset by one,
    // so the same note can arrive twice. Keep the first copy.
    for (const p of posts) {
      const key = p.slug || p.id;
      if (key && seen.has(key)) continue;
      if (key) seen.add(key);
      all.push(p);
    }

    if (pg.hasMore === false) break;
    if (posts.length === 0) {
      log(`[blog] list page ${page} (offset ${offset}) was empty but pagination.hasMore was not false; stopping with ${all.length} note(s).`);
      break;
    }
    if (page >= MAX_PAGES) {
      log(`[blog] list still says hasMore after ${MAX_PAGES} pages (${all.length} notes); stopping. The CRM's pagination looks wrong.`);
      break;
    }
    // The CRM echoes the limit it applied. Step by that, so a route that one
    // day caps the page size cannot make this skip notes.
    const step = Number.isInteger(pg.limit) && pg.limit > 0 ? pg.limit : PAGE_SIZE;
    offset += step;
  }
  return all;
}
