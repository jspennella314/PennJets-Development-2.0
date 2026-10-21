// getAllPosts: the CRM's list against the build's, through the real fetch
// path with fetch stubbed. The four cases of WO-4.48, the warn line, the
// build-first callback, the category filter, and the keyword exception.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { blogApi, resetBuildListCache } from './blogApi.js';
import { BUILD_LIST_PATH } from './blogIndex.js';

const day = (d) => new Date(Date.UTC(2026, 9, d)).toISOString();
const note = (slug, d, category) => ({
  id: slug, slug, title: slug.toUpperCase(), publishedAt: day(d),
  keywords: category ? [`category:${category}`] : [],
  author: { id: 'a1', name: 'Joseph Pennella' },
});
const BUILD = [note('oct-15', 15, 'market-notes'), note('oct-08', 8, 'market-studies'), note('sep-28', -2, 'market-notes')];

// fetch: the build file at its path, the CRM list route otherwise.
function stub({ build = BUILD, crm }) {
  const calls = [];
  const fetch = vi.fn(async (u) => {
    const url = String(u);
    calls.push(url);
    if (url === BUILD_LIST_PATH) {
      if (build === null) return { ok: false, status: 404 };
      return { ok: true, status: 200, json: async () => ({ posts: build, pagination: { total: build.length } }) };
    }
    if (crm instanceof Error) throw crm;
    if (typeof crm === 'number') return { ok: false, status: crm, json: async () => ({}) };
    const posts = new URL(url).searchParams.get('category')
      ? crm.filter((p) => p.keywords.includes(`category:${new URL(url).searchParams.get('category')}`))
      : crm;
    return { ok: true, status: 200, json: async () => ({ posts, pagination: { total: posts.length, limit: 50, offset: 0, hasMore: false } }) };
  });
  vi.stubGlobal('fetch', fetch);
  return { fetch, calls };
}

let warn, error;
beforeEach(() => {
  resetBuildListCache();
  warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  error = vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('getAllPosts (WO-4.48)', () => {
  it('CRM fails (500): the build list, one warn naming crm-failed', async () => {
    stub({ crm: 500 });
    const posts = await blogApi.getAllPosts();
    expect(posts.map((p) => p.slug)).toEqual(['oct-15', 'oct-08', 'sep-28']);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatch(/build's list of 3 note\(s\).*CRM list returned 500.*crm-failed/);
    expect(error).toHaveBeenCalled(); // the CRM failure is still logged as before
  });

  it('CRM unreachable (fetch throws): the build list, crm-failed', async () => {
    stub({ crm: new TypeError('Failed to fetch') });
    const posts = await blogApi.getAllPosts();
    expect(posts.length).toBe(3);
    expect(warn.mock.calls[0][0]).toMatch(/Failed to fetch.*crm-failed/);
  });

  it('CRM shorter: the build list, crm-shorter', async () => {
    stub({ crm: BUILD.slice(1) });
    const posts = await blogApi.getAllPosts();
    expect(posts.length).toBe(3);
    expect(warn.mock.calls[0][0]).toMatch(/CRM returned 2 note\(s\), the build has 3.*crm-shorter/);
  });

  it('CRM older: the build list, crm-older', async () => {
    stub({ crm: [note('oct-01', 1), note('sep-20', -10), note('sep-10', -20)] });
    const posts = await blogApi.getAllPosts();
    expect(posts[0].slug).toBe('oct-15');
    expect(warn.mock.calls[0][0]).toMatch(/crm-older/);
  });

  it('CRM newer: the CRM list, no warn', async () => {
    stub({ crm: [note('oct-19', 19), ...BUILD] });
    const posts = await blogApi.getAllPosts();
    expect(posts.map((p) => p.slug)).toEqual(['oct-19', 'oct-15', 'oct-08', 'sep-28']);
    expect(warn).not.toHaveBeenCalled();
  });

  it('posts are transformed either way (tags, author, read time)', async () => {
    stub({ crm: 500 });
    const [p] = await blogApi.getAllPosts();
    expect(p.author.name).toBe('PennJets'); // no email on a list-route author: the house byline, WO-4.24
    expect(p.tags).toEqual([]);
    expect(p.readTimeMinutes).toBeNull(); // no field and no content: no read time, not a made-up 5, WO-4.51
  });

  it('onBuildList gets the build list first, transformed, before the CRM answers', async () => {
    const seen = [];
    stub({ crm: [note('oct-19', 19), ...BUILD] });
    const final = await blogApi.getAllPosts(undefined, undefined, { onBuildList: (l) => seen.push(l) });
    expect(seen.length).toBe(1);
    expect(seen[0].map((p) => p.slug)).toEqual(['oct-15', 'oct-08', 'sep-28']);
    expect(seen[0][0].author.name).toBe('PennJets');
    expect(final.length).toBe(4);
  });

  it('a category filters the build list the way the CRM filters its own', async () => {
    const seen = [];
    stub({ crm: 500 });
    const posts = await blogApi.getAllPosts('market-notes', undefined, { onBuildList: (l) => seen.push(l) });
    expect(posts.map((p) => p.slug)).toEqual(['oct-15', 'sep-28']);
    expect(seen[0].map((p) => p.slug)).toEqual(['oct-15', 'sep-28']);
    expect(warn.mock.calls[0][0]).toMatch(/build's list of 2 note\(s\)/);
  });

  it('a category with no build notes: no callback, [] when the CRM also fails', async () => {
    const seen = [];
    stub({ crm: 500 });
    const posts = await blogApi.getAllPosts('transactions', undefined, { onBuildList: (l) => seen.push(l) });
    expect(posts).toEqual([]);
    expect(seen).toEqual([]);
    expect(warn).not.toHaveBeenCalled();
  });

  it('a keyword search is the CRM alone: no build file read, [] on failure', async () => {
    const { calls } = stub({ crm: 500 });
    const posts = await blogApi.getAllPosts(undefined, 'hawker');
    expect(posts).toEqual([]);
    expect(calls.some((u) => u === BUILD_LIST_PATH)).toBe(false);
    expect(warn).not.toHaveBeenCalled();
  });

  it('no build file (404): the CRM list as before, [] on failure, no warn', async () => {
    stub({ build: null, crm: 500 });
    expect(await blogApi.getAllPosts()).toEqual([]);
    expect(warn).not.toHaveBeenCalled();
    stub({ build: null, crm: BUILD });
    resetBuildListCache();
    expect((await blogApi.getAllPosts()).length).toBe(3);
  });

  it('the build file is read once per page load, shared by every caller', async () => {
    const { calls } = stub({ crm: BUILD });
    await Promise.all([blogApi.getAllPosts(), blogApi.getAllPosts('market-notes'), blogApi.getAllPosts()]);
    expect(calls.filter((u) => u === BUILD_LIST_PATH).length).toBe(1);
  });
});

// The cards' read time and byline once the list route sends readTimeMinutes
// and author.email (T1's WO-1.36). WO-4.51.
describe('transformPost: read time and byline', () => {
  const raw = (extra) => ({ id: 'x', slug: 'x', title: 'X', publishedAt: day(1), keywords: [], author: { id: 'a1', name: 'Joseph Pennella' }, ...extra });

  it("uses the route's readTimeMinutes when it sends one", () => {
    expect(blogApi.transformPost(raw({ readTimeMinutes: 9 })).readTimeMinutes).toBe(9);
    expect(blogApi.transformPost(raw({ readTimeMinutes: 9, content: 'one two three' })).readTimeMinutes).toBe(9);
  });

  it('computes from content when there is no field (the article route)', () => {
    expect(blogApi.transformPost(raw({ content: Array(401).fill('w').join(' ') })).readTimeMinutes).toBe(3);
  });

  it('shows nothing when there is neither, and ignores a zero or missing field', () => {
    expect(blogApi.transformPost(raw({})).readTimeMinutes).toBeNull();
    expect(blogApi.transformPost(raw({ readTimeMinutes: 0 })).readTimeMinutes).toBeNull();
    expect(blogApi.transformPost(raw({ readTimeMinutes: null })).readTimeMinutes).toBeNull();
  });

  it("names Joseph once the list route sends the author's email", () => {
    const p = blogApi.transformPost(raw({ author: { id: 'a1', name: 'Joseph Pennella', email: 'joe@pennjets.com' } }));
    expect(p.author.name).toBe('Joseph Pennella');
    expect(p.author.isPerson).toBe(true);
  });
});
