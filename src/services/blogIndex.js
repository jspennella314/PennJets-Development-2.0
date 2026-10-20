// The build's own Market Notes list, and the rule that chooses between it
// and the CRM's. Plain ESM, no import.meta, no window: the browser bundle
// (blogApi.getAllPosts) uses it, and the tests run it in Node. WO-4.48.
//
// scripts/postbuild.mjs writes every published note it knew at build time to
// dist/data/market-notes.json, in the list route's { posts, pagination }
// shape. The index used to show whatever GET /api/public/blog returned at
// that moment, so when the CRM was down, or its CDN served a stale copy, a
// visitor saw fewer notes than the build had already shipped as prerendered
// pages (Joseph, 2026-10-19: 11 notes and a 28 September newest while three
// October notes were live). Now the index never shows fewer than the build.

import { hasCategory } from '../utils/marketNotes';

export const BUILD_LIST_PATH = '/data/market-notes.json';

// The greatest publishedAt in a list, as epoch milliseconds; 0 for none.
export function newestPublishedAt(posts) {
  let newest = 0;
  for (const p of posts || []) {
    const t = p?.publishedAt ? new Date(p.publishedAt).getTime() : NaN;
    if (Number.isFinite(t) && t > newest) newest = t;
  }
  return newest;
}

/**
 * Which list the index shows.
 *
 *   crm    the CRM's list, or null when the fetch failed
 *   build  the build file's list (already filtered to the same category), or
 *          null when the file could not be read
 *
 * The build's list wins when the CRM failed, returned fewer notes, or its
 * newest note is older than the build's newest. Otherwise the CRM's wins, so
 * a note published since the build appears as soon as the CRM serves it.
 * `reason` names the rule that fired, or is null when the CRM's list is used.
 *
 * @returns {{ posts: Array, source: 'crm'|'build', reason: null|'crm-failed'|'crm-shorter'|'crm-older' }}
 */
export function chooseList(crm, build) {
  const haveBuild = Array.isArray(build) && build.length > 0;
  if (!haveBuild) return { posts: Array.isArray(crm) ? crm : [], source: 'crm', reason: null };
  if (!Array.isArray(crm)) return { posts: build, source: 'build', reason: 'crm-failed' };
  if (crm.length < build.length) return { posts: build, source: 'build', reason: 'crm-shorter' };
  if (newestPublishedAt(crm) < newestPublishedAt(build)) return { posts: build, source: 'build', reason: 'crm-older' };
  return { posts: crm, source: 'crm', reason: null };
}

// The index's category filter, applied to the build's list the way the CRM's
// strict ?category= applies to its own (WO-1.16, WO-4.31).
export function filterBuildList(posts, category) {
  if (!category) return posts;
  return (posts || []).filter((p) => hasCategory(p, category));
}

/**
 * Read the build file. Resolves to the posts array, or null when the file is
 * missing, unreadable or not the expected shape. Never throws: a missing file
 * means "no fallback", not a broken index.
 *
 * @param {object} [o]
 * @param {typeof fetch} [o.fetch]  defaults to the global fetch
 * @param {string} [o.path]         defaults to BUILD_LIST_PATH
 */
export async function loadBuildList({ fetch: fetchImpl, path } = {}) {
  const doFetch = fetchImpl || globalThis.fetch;
  if (typeof doFetch !== 'function') return null;
  try {
    const res = await doFetch(path || BUILD_LIST_PATH);
    if (!res || !res.ok) return null;
    const data = await res.json();
    return Array.isArray(data?.posts) ? data.posts : null;
  } catch (e) {
    return null;
  }
}
