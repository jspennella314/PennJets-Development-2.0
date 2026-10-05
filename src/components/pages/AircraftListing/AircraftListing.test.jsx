// @vitest-environment happy-dom
// /aircraft against a stubbed inventory route. WO-4.43.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import AircraftListing, { EMPTY_SENTENCE } from './AircraftListing';

const act = React.act || TestUtils.act;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const Router = ({ children }) => (
  <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</MemoryRouter>
);

const BLOB = 'https://algxvqsvihyabn9r.public.blob.vercel-storage.com/aircraft/org/hawker.jpg';
const HAWKER = {
  id: 'ckx1', slug: '2004-hawker-800xp-258xxx', year: 2004, make: 'Hawker', model: '800XP', variant: null,
  serial: '258xxx', hours: 6200, config: '8 passengers, forward galley, aft lav', askingPrice: 2950000,
  headline: 'Fresh 48-month inspection, Collins Pro Line 21', images: [BLOB], updatedAt: '2026-10-12T15:04:05.000Z',
};
const CJ3 = {
  id: 'ckx2', slug: '2008-cessna-citation-cj3-525b0200', year: 2008, make: 'Cessna', model: 'Citation CJ3', variant: null,
  serial: '525B0200', hours: 3100, config: '7 passengers, belted lav', askingPrice: null, headline: null,
  images: [], updatedAt: '2026-10-12T15:04:05.000Z',
};

const ok = (body) => ({ ok: true, status: 200, json: async () => body });

let roots = [];
async function render(response) {
  vi.stubGlobal('fetch', vi.fn(async () => (response instanceof Error ? Promise.reject(response) : response)));
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  roots.push({ root, el });
  await act(async () => { root.render(<Router><AircraftListing /></Router>); });
  return el;
}

async function choose(select, value) {
  await act(async () => {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

const cardTitles = (el) => [...el.querySelectorAll('article h3')].map((h) => h.textContent);

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });
afterEach(async () => {
  for (const { root, el } of roots) { await act(async () => root.unmount()); el.remove(); }
  roots = [];
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('empty inventory', () => {
  it('the heading, the approved sentence and the inquiry link; no card, no count, no placeholder', async () => {
    const el = await render(ok({ listings: [] }));
    expect(el.querySelector('h1').textContent).toBe('Aircraft for Sale');
    expect(el.textContent).toContain(EMPTY_SENTENCE);
    const link = el.querySelector('a[href="/contact"]');
    expect(link).not.toBeNull();
    expect(link.textContent).toBe('Contact a Consultant');
    expect(el.querySelectorAll('article').length).toBe(0);
    expect(el.textContent).not.toMatch(/Showing \d+ of \d+/);
    expect(el.textContent).not.toMatch(/coming soon|featured|off market|Diamond 1A|Premier 1A|E55 Baron/i);
    expect(el.querySelector('select')).toBeNull();
  });

  it('a failed fetch and a 404 render the same empty state', async () => {
    for (const response of [new Error('Failed to fetch'), { ok: false, status: 404, json: async () => ({}) }]) {
      const el = await render(response);
      expect(el.textContent).toContain(EMPTY_SENTENCE);
      expect(el.querySelectorAll('article').length).toBe(0);
    }
  });

  it('before the fetch answers: the heading and nothing else', async () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    const el = document.createElement('div');
    document.body.appendChild(el);
    const root = createRoot(el);
    roots.push({ root, el });
    act(() => { root.render(<Router><AircraftListing /></Router>); });
    expect(el.querySelector('h1').textContent).toBe('Aircraft for Sale');
    expect(el.textContent).not.toContain(EMPTY_SENTENCE);
    expect(el.querySelectorAll('article').length).toBe(0);
  });
});

describe('two listings', () => {
  it('two cards, the count, and the filters the contract can answer', async () => {
    const el = await render(ok({ listings: [HAWKER, CJ3] }));
    expect(cardTitles(el)).toEqual(['2004 Hawker 800XP', '2008 Cessna Citation CJ3']);
    expect(el.textContent).toContain('Showing 2 of 2 aircraft');
    const labels = [...el.querySelectorAll('select')].map((s) => s.getAttribute('aria-label'));
    expect(labels).toEqual(['Make', 'Year from', 'Year to', 'Maximum price']);
    const makes = [...el.querySelector('select[aria-label="Make"]').options].map((o) => o.value);
    expect(makes).toEqual(['All', 'Cessna', 'Hawker']);
    // Nothing from the static data's vocabulary.
    expect(el.textContent).not.toMatch(/category|status|location|Light Jet|Sold|Under Contract/i);
    expect(el.textContent).not.toContain(EMPTY_SENTENCE);
  });

  it('the make filter narrows to one card; Clear Filters restores both', async () => {
    const el = await render(ok({ listings: [HAWKER, CJ3] }));
    await choose(el.querySelector('select[aria-label="Make"]'), 'Cessna');
    expect(cardTitles(el)).toEqual(['2008 Cessna Citation CJ3']);
    expect(el.textContent).toContain('Showing 1 of 2 aircraft');
    const clear = [...el.querySelectorAll('button')].find((b) => b.textContent === 'Clear Filters');
    await act(async () => { clear.click(); });
    expect(cardTitles(el)).toEqual(['2004 Hawker 800XP', '2008 Cessna Citation CJ3']);
  });

  it('the year range narrows', async () => {
    const el = await render(ok({ listings: [HAWKER, CJ3] }));
    await choose(el.querySelector('select[aria-label="Year from"]'), '2008');
    expect(cardTitles(el)).toEqual(['2008 Cessna Citation CJ3']);
    await choose(el.querySelector('select[aria-label="Year from"]'), 'All');
    await choose(el.querySelector('select[aria-label="Year to"]'), '2004');
    expect(cardTitles(el)).toEqual(['2004 Hawker 800XP']);
  });

  it('the price ceiling keeps only listings with a price at or under it', async () => {
    const el = await render(ok({ listings: [HAWKER, CJ3] }));
    const price = el.querySelector('select[aria-label="Maximum price"]');
    expect([...price.options].map((o) => o.textContent)).toEqual(['Any price', 'Up to $5,000,000']);
    await choose(price, '5000000');
    expect(cardTitles(el)).toEqual(['2004 Hawker 800XP']);
  });

  it('no price filter when no listing carries a price', async () => {
    const el = await render(ok({ listings: [{ ...HAWKER, askingPrice: null }, CJ3] }));
    expect(el.querySelector('select[aria-label="Maximum price"]')).toBeNull();
    expect(el.querySelectorAll('select').length).toBe(3);
  });

  it('filters that match nothing show the existing "No aircraft found" block, never the empty-inventory sentence', async () => {
    const el = await render(ok({ listings: [HAWKER, CJ3] }));
    await choose(el.querySelector('select[aria-label="Make"]'), 'Cessna');
    await choose(el.querySelector('select[aria-label="Year to"]'), '2004');
    expect(cardTitles(el)).toEqual([]);
    expect(el.textContent).toContain('No aircraft found');
    expect(el.textContent).toContain('Showing 0 of 2 aircraft');
    expect(el.textContent).not.toContain(EMPTY_SENTENCE);
  });
});
