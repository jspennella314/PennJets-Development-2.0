// @vitest-environment happy-dom
// /aircraft/<slug> against a stubbed inventory route. WO-4.43.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AircraftDetail from './AircraftDetail';

const act = React.act || TestUtils.act;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const BLOB = 'https://algxvqsvihyabn9r.public.blob.vercel-storage.com/aircraft/org/hawker.jpg';
const HAWKER = {
  id: 'ckx1', slug: '2004-hawker-800xp-258xxx', year: 2004, make: 'Hawker', model: '800XP', variant: null,
  serial: '258xxx', hours: 6200, config: '8 passengers, forward galley, aft lav', askingPrice: 2950000,
  headline: 'Fresh 48-month inspection, Collins Pro Line 21', images: [BLOB, 'https://wallpaperaccess.com/full/1.jpg'],
  updatedAt: '2026-10-12T15:04:05.000Z',
};

let roots = [];
async function render(path, listings) {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ listings }) })));
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  roots.push({ root, el });
  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/aircraft" element={<p data-page="index">index</p>} />
          <Route path="/aircraft/:id" element={<AircraftDetail />} />
        </Routes>
      </MemoryRouter>,
    );
  });
  return el;
}

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });
afterEach(async () => {
  for (const { root, el } of roots) { await act(async () => root.unmount()); el.remove(); }
  roots = [];
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('/aircraft/<slug>', () => {
  it('a slug resolves to the listing view, from the route\'s fields only', async () => {
    const el = await render('/aircraft/2004-hawker-800xp-258xxx', [HAWKER]);
    expect(el.querySelector('h1').textContent).toBe('2004 Hawker 800XP');
    expect(el.textContent).toContain('Fresh 48-month inspection, Collins Pro Line 21');
    expect(el.textContent).toContain('$2,950,000');
    const rows = [...el.querySelectorAll('dl > div')].map((d) => `${d.querySelector('dt').textContent}: ${d.querySelector('dd').textContent}`);
    expect(rows).toEqual([
      'Year: 2004', 'Make: Hawker', 'Model: 800XP', 'Serial: 258xxx',
      'Total time: 6,200 hours', 'Configuration: 8 passengers, forward galley, aft lav', 'Asking price: $2,950,000',
    ]);
    // Only the on-host image.
    expect([...el.querySelectorAll('img')].map((i) => i.getAttribute('src'))).toEqual([BLOB]);
    expect(el.textContent).not.toMatch(/Located in|Specifications|Key Features|Under Contract|SOLD/);
    expect(el.querySelector('[data-page="index"]')).toBeNull();
  });

  it('no price line when the route sends null', async () => {
    const el = await render('/aircraft/2004-hawker-800xp-258xxx', [{ ...HAWKER, askingPrice: null }]);
    expect(el.querySelector('h1').textContent).toBe('2004 Hawker 800XP');
    expect(el.textContent).not.toContain('$');
    expect(el.textContent).not.toContain('Asking price');
  });

  it('a numeric id (the old static path) redirects to /aircraft', async () => {
    const el = await render('/aircraft/3', [HAWKER]);
    expect(el.querySelector('[data-page="index"]')).not.toBeNull();
    expect(el.querySelector('h1')).toBeNull();
  });

  it('an unknown slug redirects to /aircraft', async () => {
    const el = await render('/aircraft/2004-hawker-800xp-999', [HAWKER]);
    expect(el.querySelector('[data-page="index"]')).not.toBeNull();
  });

  it('an empty inventory redirects to /aircraft', async () => {
    const el = await render('/aircraft/2004-hawker-800xp-258xxx', []);
    expect(el.querySelector('[data-page="index"]')).not.toBeNull();
  });
});
