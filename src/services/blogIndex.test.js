// The rule that chooses between the CRM's list and the build's. WO-4.48.

import { describe, it, expect } from 'vitest';
import { chooseList, filterBuildList, loadBuildList, newestPublishedAt, BUILD_LIST_PATH } from './blogIndex.js';

const day = (d) => new Date(Date.UTC(2026, 9, d)).toISOString(); // October 2026
const note = (slug, d, category) => ({
  slug, title: slug, publishedAt: day(d),
  keywords: category ? [`category:${category}`] : [],
  author: { id: 'a1', name: 'Joseph Pennella' },
});

const BUILD = [note('oct-15', 15, 'market-notes'), note('oct-08', 8, 'market-studies'), note('sep-28', -2)];

describe('chooseList', () => {
  it('CRM fails: the build list, reason crm-failed', () => {
    const r = chooseList(null, BUILD);
    expect(r.source).toBe('build');
    expect(r.reason).toBe('crm-failed');
    expect(r.posts).toBe(BUILD);
  });

  it('CRM shorter: the build list, reason crm-shorter', () => {
    const r = chooseList(BUILD.slice(1), BUILD);
    expect(r.source).toBe('build');
    expect(r.reason).toBe('crm-shorter');
    expect(r.posts.length).toBe(3);
  });

  it('CRM older (same count, newest note older): the build list, reason crm-older', () => {
    const crm = [note('oct-01', 1), note('sep-20', -10), note('sep-10', -20)];
    const r = chooseList(crm, BUILD);
    expect(r.source).toBe('build');
    expect(r.reason).toBe('crm-older');
  });

  it('CRM newer: the CRM list, no reason', () => {
    const crm = [note('oct-19', 19), ...BUILD];
    const r = chooseList(crm, BUILD);
    expect(r.source).toBe('crm');
    expect(r.reason).toBeNull();
    expect(r.posts[0].slug).toBe('oct-19');
  });

  it('CRM the same: the CRM list', () => {
    const r = chooseList([...BUILD], BUILD);
    expect(r.source).toBe('crm');
    expect(r.reason).toBeNull();
  });

  it('CRM empty while the build has notes counts as shorter', () => {
    expect(chooseList([], BUILD).reason).toBe('crm-shorter');
  });

  it('no build file: whatever the CRM said, [] on failure', () => {
    expect(chooseList(BUILD, null)).toEqual({ posts: BUILD, source: 'crm', reason: null });
    expect(chooseList(null, null)).toEqual({ posts: [], source: 'crm', reason: null });
    expect(chooseList(null, [])).toEqual({ posts: [], source: 'crm', reason: null });
  });
});

describe('newestPublishedAt', () => {
  it('the greatest date, whatever the order', () => {
    expect(newestPublishedAt([note('a', 3), note('b', 9), note('c', 5)])).toBe(new Date(day(9)).getTime());
  });
  it('0 for nothing or unparseable dates', () => {
    expect(newestPublishedAt([])).toBe(0);
    expect(newestPublishedAt(null)).toBe(0);
    expect(newestPublishedAt([{ publishedAt: 'never' }])).toBe(0);
  });
});

describe('filterBuildList', () => {
  it('no category: everything', () => expect(filterBuildList(BUILD).length).toBe(3));
  it('a category: the CRM strict match on the keywords array', () => {
    expect(filterBuildList(BUILD, 'market-notes').map((p) => p.slug)).toEqual(['oct-15']);
    expect(filterBuildList(BUILD, 'transactions')).toEqual([]);
  });
});

describe('loadBuildList', () => {
  const ok = (body) => async () => ({ ok: true, status: 200, json: async () => body });
  it('reads posts from the build file', async () => {
    const calls = [];
    const fetch = async (u) => { calls.push(u); return { ok: true, json: async () => ({ posts: BUILD, pagination: { total: 3 } }) }; };
    expect(await loadBuildList({ fetch })).toBe(BUILD);
    expect(calls).toEqual([BUILD_LIST_PATH]);
  });
  it('null when the file is missing, not JSON, the wrong shape, or fetch throws', async () => {
    expect(await loadBuildList({ fetch: async () => ({ ok: false, status: 404 }) })).toBeNull();
    expect(await loadBuildList({ fetch: async () => ({ ok: true, json: async () => { throw new Error('bad json'); } }) })).toBeNull();
    expect(await loadBuildList({ fetch: ok({ notes: [] }) })).toBeNull();
    expect(await loadBuildList({ fetch: async () => { throw new TypeError('Failed to fetch'); } })).toBeNull();
    expect(await loadBuildList({ fetch: 'not a function' })).toBeNull();
  });
});
