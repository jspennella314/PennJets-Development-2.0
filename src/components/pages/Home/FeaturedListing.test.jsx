// @vitest-environment happy-dom
// The home page's FeaturedListing against a stubbed inventory route. WO-4.52.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import FeaturedListing from './FeaturedListing';

const act = React.act || TestUtils.act;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const Router = ({ children }) => (
  <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</MemoryRouter>
);

const BLOB = 'https://algxvqsvihyabn9r.public.blob.vercel-storage.com/aircraft/org/hawker.jpg';
const HAWKER = {
  id: 'ckx1', slug: '2004-hawker-800xp-258xxx', year: 2004, make: 'Hawker', model: '800XP', variant: null,
  serial: '258xxx', hours: 6200, config: '8 passengers, forward galley, aft lav', askingPrice: 2950000,
  headline: null, images: [BLOB], updatedAt: '2026-10-12T15:04:05.000Z',
};
const CJ3 = {
  id: 'ckx2', slug: '2008-cessna-citation-cj3-525b0200', year: 2008, make: 'Cessna', model: 'Citation CJ3', variant: null,
  serial: '525B0200', hours: 3100, config: '7 passengers, belted lav', askingPrice: null, headline: null,
  images: [], updatedAt: '2026-10-12T15:04:05.000Z',
};
const ok = (body) => ({ ok: true, status: 200, json: async () => body });

let roots = [];
async function render(fetchImpl) {
  vi.stubGlobal('fetch', vi.fn(fetchImpl));
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  roots.push({ root, el });
  await act(async () => { root.render(<Router><FeaturedListing /></Router>); });
  return el;
}

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });
afterEach(async () => {
  for (const { root, el } of roots) { await act(async () => root.unmount()); el.remove(); }
  roots = [];
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('nothing to feature: no markup at all', () => {
  it('in flight, empty, failed and 404 all leave the container empty', async () => {
    for (const impl of [
      () => new Promise(() => {}),
      async () => ok({ listings: [] }),
      async () => { throw new Error('Failed to fetch'); },
      async () => ({ ok: false, status: 404, json: async () => ({}) }),
    ]) {
      const el = await render(impl);
      expect(el.innerHTML).toBe('');
    }
  });
});

describe('one or more listings', () => {
  it('one card, the first by the API order, under "Featured Listing", linking to /buy?model=', async () => {
    const el = await render(async () => ok({ listings: [HAWKER, CJ3] }));
    const section = el.querySelector('section[aria-labelledby="featured-listing"]');
    expect(section.querySelector('h2').textContent).toBe('Featured Listing');
    const cards = section.querySelectorAll('article');
    expect(cards.length).toBe(1);
    expect(cards[0].querySelector('h3').textContent).toBe('2004 Hawker 800XP');
    const hrefs = [...cards[0].querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/buy?model=Hawker%20800XP', '/buy?model=Hawker%20800XP']);
    expect(el.textContent).not.toContain('Citation CJ3');
  });

  it('shows only what the route sent: no price line when askingPrice is null, no image without one', async () => {
    const el = await render(async () => ok({ listings: [CJ3] }));
    const items = [...el.querySelectorAll('li')].map((li) => li.textContent);
    expect(items).toEqual(['Serial 525B0200', '3,100 hours total time', '7 passengers, belted lav']);
    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('a').getAttribute('href')).toBe('/buy?model=Cessna%20Citation%20CJ3');
  });
});
