// @vitest-environment happy-dom
// /aircraft, "Recent Inquiries", against a stubbed inventory route. WO-4.52
// (was "Aircraft for Sale" with filters, WO-4.43).

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import AircraftListing from './AircraftListing';
import { OFF_MARKET_TYPES, LEAD_LINE } from '../../../content/recentInquiries';

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

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });
afterEach(async () => {
  for (const { root, el } of roots) { await act(async () => root.unmount()); el.remove(); }
  roots = [];
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const inquiryCards = (el) => [...el.querySelectorAll('section[aria-label="Recent inquiries"] article')];

describe('empty inventory', () => {
  it('the heading, the lead line and the five cards; no Inventory block, no filters', async () => {
    const el = await render(ok({ listings: [] }));
    expect(el.querySelector('h1').textContent).toBe('Recent Inquiries');
    expect(el.textContent).toContain(LEAD_LINE);
    expect(el.querySelector('section[aria-labelledby="inventory"]')).toBeNull();
    expect(el.querySelector('select')).toBeNull();
    expect(inquiryCards(el).map((c) => c.querySelector('h3').textContent)).toEqual(OFF_MARKET_TYPES.map((t) => t.model));
  });

  it('the same WebP images, no price, no badge, each card a link to its form', async () => {
    const el = await render(new Error('Failed to fetch'));
    const cards = inquiryCards(el);
    expect(cards.map((c) => c.querySelector('img').getAttribute('src'))).toEqual(OFF_MARKET_TYPES.map((t) => t.image));
    for (const c of cards) expect(c.textContent).not.toMatch(/\$|featured|price/i);
    expect(cards.map((c) => c.querySelector('a').getAttribute('href'))).toEqual([
      '/buy?model=Falcon%20900',
      '/charter?model=Premier%201A#quote',
      '/buy?model=Hawker%20800XP',
      '/buy?model=Hawker%20400XP',
      '/buy?model=Citation%20II',
    ]);
  });
});

describe('a real listing', () => {
  it('renders above the five under its own "Inventory" heading, never mixed with them', async () => {
    const el = await render(ok({ listings: [HAWKER] }));
    const inv = el.querySelector('section[aria-labelledby="inventory"]');
    expect(inv.querySelector('h2').textContent).toBe('Inventory');
    expect(inv.querySelectorAll('article').length).toBe(1);
    const recent = el.querySelector('section[aria-label="Recent inquiries"]');
    expect(inv.compareDocumentPosition(recent) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(recent.textContent).not.toContain('2004 Hawker 800XP');
    expect(inquiryCards(el).length).toBe(5);
  });
});
