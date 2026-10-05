// @vitest-environment happy-dom
// The home page's Inventory section against a stubbed inventory route.
// WO-4.42.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import Inventory from './Inventory';

const act = React.act || TestUtils.act;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// The v7 flags only silence react-router's "future flag" warnings in the
// test output; the app's router is untouched.
const Router = ({ children }) => (
  <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</MemoryRouter>
);

// The contract's example listing (docs/integration/PENNJETS-SITE.md §5).
const BLOB = 'https://algxvqsvihyabn9r.public.blob.vercel-storage.com/aircraft/org/hawker.jpg';
const LISTING = {
  id: 'ckx1', slug: '2004-hawker-800xp-258xxx', year: 2004, make: 'Hawker', model: '800XP', variant: null,
  serial: '258xxx', hours: 6200, config: '8 passengers, forward galley, aft lav', askingPrice: 2950000,
  headline: 'Fresh 48-month inspection, Collins Pro Line 21', images: [BLOB], updatedAt: '2026-10-12T15:04:05.000Z',
};

const ok = (body) => ({ ok: true, status: 200, json: async () => body });
const http = (status) => ({ ok: false, status, json: async () => ({ error: 'x' }) });

let roots = [];
async function render(response) {
  const fetch = vi.fn(async () => (response instanceof Error ? Promise.reject(response) : response));
  vi.stubGlobal('fetch', fetch);
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  roots.push({ root, el });
  await act(async () => {
    root.render(<Router><Inventory /></Router>);
  });
  return { el, fetch };
}

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });
afterEach(async () => {
  for (const { root, el } of roots) { await act(async () => root.unmount()); el.remove(); }
  roots = [];
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('nothing to show', () => {
  it('renders nothing before the fetch resolves', async () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    const el = document.createElement('div');
    document.body.appendChild(el);
    const root = createRoot(el);
    roots.push({ root, el });
    act(() => { root.render(<Router><Inventory /></Router>); });
    expect(el.innerHTML).toBe('');
  });

  it('empty list -> no section', async () => {
    const { el, fetch } = await render(ok({ listings: [] }));
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toMatch(/\/api\/public\/inventory$/);
    expect(el.innerHTML).toBe('');
  });

  it('failed fetch (network) -> no section', async () => {
    const { el } = await render(new Error('Failed to fetch'));
    expect(el.innerHTML).toBe('');
  });

  it('404 (the route does not exist yet) -> no section', async () => {
    const { el } = await render(http(404));
    expect(el.innerHTML).toBe('');
  });

  it('500 -> no section', async () => {
    const { el } = await render(http(500));
    expect(el.innerHTML).toBe('');
  });

  it('a body without `listings` -> no section', async () => {
    const { el } = await render(ok({ posts: [] }));
    expect(el.innerHTML).toBe('');
  });

  it('a listing missing a required field (serial) is dropped -> no section, no placeholder', async () => {
    const noSerial = { ...LISTING };
    delete noSerial.serial;
    const { el } = await render(ok({ listings: [noSerial] }));
    expect(el.innerHTML).toBe('');
  });
});

describe('one listing -> one card with every field', () => {
  it('renders the card from the route\'s fields only', async () => {
    const { el } = await render(ok({ listings: [LISTING] }));
    const section = el.querySelector('section[aria-labelledby="inventory"]');
    expect(section).not.toBeNull();
    expect(section.querySelector('h2').textContent).toBe('Inventory');
    const cards = section.querySelectorAll('article');
    expect(cards.length).toBe(1);
    const card = cards[0];
    expect(card.querySelector('h3').textContent).toBe('2004 Hawker 800XP');
    const items = [...card.querySelectorAll('li')].map((li) => li.textContent);
    expect(items).toEqual(['Serial 258xxx', '6,200 hours total time', '8 passengers, forward galley, aft lav', '$2,950,000']);
    const img = card.querySelector('img');
    expect(img.getAttribute('src')).toBe(BLOB);
    expect(img.getAttribute('alt')).toBe('2004 Hawker 800XP');
    const links = [...card.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(links).toEqual(['/aircraft/2004-hawker-800xp-258xxx', '/aircraft/2004-hawker-800xp-258xxx']);
    expect(card.textContent).toContain('View Details');
    // Nothing the route did not send.
    expect(card.textContent).not.toMatch(/featured|coming soon|off market/i);
  });

  it('no asking price when the route sends null', async () => {
    const { el } = await render(ok({ listings: [{ ...LISTING, askingPrice: null }] }));
    const items = [...el.querySelectorAll('li')].map((li) => li.textContent);
    expect(items).toEqual(['Serial 258xxx', '6,200 hours total time', '8 passengers, forward galley, aft lav']);
    expect(el.textContent).not.toContain('$');
  });

  it('an off-host image -> no image, the card still renders', async () => {
    const { el } = await render(ok({ listings: [{ ...LISTING, images: ['https://evil.public.blob.vercel-storage.com/x.jpg'] }] }));
    expect(el.querySelectorAll('article').length).toBe(1);
    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('h3').textContent).toBe('2004 Hawker 800XP');
  });

  it('the first on-host image wins when an off-host one comes first', async () => {
    const { el } = await render(ok({ listings: [{ ...LISTING, images: ['https://wallpaperaccess.com/full/1.jpg', BLOB] }] }));
    expect(el.querySelector('img').getAttribute('src')).toBe(BLOB);
  });

  it('two listings -> two cards, in the route\'s order', async () => {
    const second = { ...LISTING, id: 'ckx2', slug: '2008-citation-cj3-525b0200', year: 2008, make: 'Cessna', model: 'Citation CJ3', serial: '525B0200', hours: 3100, config: '7 passengers, belted lav', askingPrice: null };
    const { el } = await render(ok({ listings: [LISTING, second] }));
    expect([...el.querySelectorAll('h3')].map((h) => h.textContent)).toEqual(['2004 Hawker 800XP', '2008 Cessna Citation CJ3']);
  });
});
