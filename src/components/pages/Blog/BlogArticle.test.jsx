// @vitest-environment happy-dom
// A former note address in the app: the CRM answers it with the note and
// redirectTo (T1's WO-1.37), and the page replaces the address with the
// current one, query string kept, before rendering anything. A real 404 still
// shows "Note Not Found". WO-4.54.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import BlogArticle from './BlogArticle';

const act = React.act || TestUtils.act;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const OLD = 'title-dassault-falcon-900b-for-sale-2026-market-study';
const NEW = 'dassault-falcon-900b-for-sale-2026-market-study';
const NOTE = {
  id: 'n1', slug: NEW, title: 'Dassault Falcon 900B for Sale: 2026 Market Study', excerpt: 'x',
  content: '<p>Body</p>', contentHtml: '<p>Body</p>', publishedAt: '2026-10-28T15:25:59.813Z',
  updatedAt: '2026-10-29T14:20:48.419Z', keywords: [], author: { name: 'Joseph Pennella', email: 'joe@pennjets.com' },
};
const json = (status, body) => ({ ok: status < 400, status, json: async () => body });

let seen = [];
const Probe = () => {
  const loc = useLocation();
  seen.push({ path: loc.pathname + loc.search + loc.hash, type: useNavigationType() });
  return null;
};

let roots = [];
async function render(entry, single) {
  const calls = [];
  vi.stubGlobal('fetch', vi.fn(async (url) => {
    const u = String(url);
    calls.push(u);
    const m = u.match(/\/api\/public\/blog\/([^/?]+)(\/view)?$/);
    if (m && m[2]) return json(204, {});
    if (m) return single(m[1]);
    return json(200, { posts: [], pagination: { total: 0, hasMore: false } });
  }));
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  roots.push({ root, el });
  await act(async () => {
    root.render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/blog', entry]} initialIndex={1} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/blog/:slug" element={<><BlogArticle /><Probe /></>} />
            <Route path="*" element={<Probe />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );
  });
  for (let i = 0; i < 5; i++) await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
  return { el, calls };
}

beforeEach(() => { seen = []; vi.spyOn(console, 'error').mockImplementation(() => {}); });
afterEach(async () => {
  for (const { root, el } of roots) { await act(async () => root.unmount()); el.remove(); }
  roots = [];
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('a former note address (redirectTo)', () => {
  it('replaces the address with the current one, query string and hash kept', async () => {
    const { el, calls } = await render(`/blog/${OLD}?utm_source=linkedin&utm_medium=social#talk`, (slug) =>
      slug === OLD ? json(200, { ...NOTE, redirectTo: `/blog/${NEW}` }) : json(200, NOTE));
    const last = seen[seen.length - 1];
    expect(last).toEqual({ path: `/blog/${NEW}?utm_source=linkedin&utm_medium=social#talk`, type: 'REPLACE' });
    expect(el.querySelector('h1').textContent).toBe(NOTE.title);
    // The old address never rendered the note or fired its beacon.
    expect(calls.some((u) => u.includes(`/${OLD}/view`))).toBe(false);
  });

  it('a real 404 still says "Note Not Found" and stays put', async () => {
    const { el } = await render('/blog/no-such-note', () => json(404, { error: 'Not found' }));
    expect(el.querySelector('h1').textContent).toBe('Note Not Found');
    expect(seen.every((s) => s.path === '/blog/no-such-note' && s.type === 'POP')).toBe(true);
  });
});
