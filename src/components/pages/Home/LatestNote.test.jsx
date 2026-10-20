// @vitest-environment happy-dom
// The home page's newest-note card follows the index's list rule: the
// build's list when the CRM is down or stale, the CRM's when it is newer.
// WO-4.48 (the card itself is WO-4.37).

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import LatestNote from './LatestNote';
import { resetBuildListCache } from '../../../services/blogApi';
import { BUILD_LIST_PATH } from '../../../services/blogIndex';

const act = React.act || TestUtils.act;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const Router = ({ children }) => (
  <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</MemoryRouter>
);

const day = (d) => new Date(Date.UTC(2026, 9, d)).toISOString();
const note = (slug, title, d) => ({
  id: slug, slug, title, excerpt: '', publishedAt: day(d), keywords: ['category:market-notes'],
  featuredImage: null, author: { id: 'a1', name: 'Joseph Pennella' },
});
const BUILD = [note('oct-15', 'Build newest', 15), note('sep-28', 'Build older', -2)];

let roots = [];
async function render({ crm }) {
  const fetch = vi.fn(async (u) => {
    const url = String(u);
    if (url === BUILD_LIST_PATH) return { ok: true, status: 200, json: async () => ({ posts: BUILD }) };
    if (typeof crm === 'number') return { ok: false, status: crm, json: async () => ({}) };
    return { ok: true, status: 200, json: async () => ({ posts: crm, pagination: { total: crm.length, limit: 50, offset: 0, hasMore: false } }) };
  });
  vi.stubGlobal('fetch', fetch);
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  roots.push({ root, el });
  await act(async () => { root.render(<Router><LatestNote /></Router>); });
  // let the build list, then the CRM, settle
  await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
  return { el, fetch };
}

beforeEach(() => {
  resetBuildListCache();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(async () => {
  for (const { root, el } of roots) { await act(async () => root.unmount()); el.remove(); }
  roots = [];
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('the home card follows the index rule', () => {
  it('CRM down: the build list\'s newest note', async () => {
    const { el } = await render({ crm: 500 });
    expect(el.querySelector('h3')?.textContent).toBe('Build newest');
    expect(el.querySelector('a')?.getAttribute('href')).toBe('/blog/oct-15');
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('CRM stale (older newest note): still the build list\'s newest', async () => {
    const { el } = await render({ crm: [note('oct-01', 'Stale CRM', 1), note('sep-20', 'Stale older', -10)] });
    expect(el.querySelector('h3')?.textContent).toBe('Build newest');
  });

  it('CRM newer: the CRM\'s newest note replaces the build\'s', async () => {
    const { el } = await render({ crm: [note('oct-19', 'CRM newest', 19), ...BUILD] });
    expect(el.querySelector('h3')?.textContent).toBe('CRM newest');
    expect(console.warn).not.toHaveBeenCalled();
  });
});
