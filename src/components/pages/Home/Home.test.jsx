// @vitest-environment happy-dom
// The home page's structure (Joseph's spec, 2026-10-21): three elements in
// the hero, three tiles, no "Why PennJets", no aircraft cards, nothing
// featured while the inventory is empty. WO-4.52.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './Home';
import { TILES, CHARTER_NOTE } from '../../../content/home';

const act = React.act || TestUtils.act;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let roots = [];
async function render() {
  // Every read answers empty: no note, no listing.
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ posts: [], listings: [], pagination: { total: 0, hasMore: false } }) })));
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  roots.push({ root, el });
  await act(async () => {
    root.render(
      <HelmetProvider>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Home /></MemoryRouter>
      </HelmetProvider>,
    );
  });
  return el;
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(async () => {
  for (const { root, el } of roots) { await act(async () => root.unmount()); el.remove(); }
  roots = [];
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('the hero', () => {
  it('the slogan with the comma, one line, one button and nothing else', async () => {
    const el = await render();
    const hero = el.querySelector('header');
    expect(hero.querySelector('h1').textContent.trim()).toBe('The Access, You Deserve');
    expect([...hero.querySelectorAll('p')].map((p) => p.textContent.trim())).toEqual(['Independent aircraft brokerage and consulting.']);
    expect([...hero.querySelectorAll('button, a')].map((b) => b.textContent.trim())).toEqual(['Request a Charter Quote']);
    expect(hero.textContent).not.toMatch(/Talk to a Broker|Part 135|shows you the numbers/);
  });
});

describe('the tiles', () => {
  it('the heading, then Buy, Sell and Charter, each tile a link, the Part 135 line under Charter', async () => {
    const el = await render();
    const section = el.querySelector('section[aria-labelledby="paths"]');
    expect(section.querySelector('h2').textContent.trim()).toBe('Buy, sell, or charter with someone who shows you the numbers.');
    const links = [...section.querySelectorAll('[data-home-tiles] > li > a')];
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/buy', '/sell', '/charter']);
    links.forEach((a, i) => {
      expect(a.textContent).toContain(TILES[i].title);
      expect(a.textContent).toContain(TILES[i].text);
      expect(a.className).toContain('min-h-[44px]');
    });
    expect(links[2].parentElement.querySelector('p').textContent).toBe(CHARTER_NOTE);
    // The approved wording, pinned (Joseph, 2026-10-21; row 9 reworded).
    expect(links.map((l) => l.querySelector('span.mt-2').textContent)).toEqual([
      "Tell us the mission and the budget, and we'll find the aircraft that fits both.",
      'We price your aircraft against the current market and run the sale through closing.',
      "Tell us the trip, and we'll compare vetted operators and show you the quotes.",
    ]);
    expect(links[0].parentElement.querySelector('p')).toBeNull();
    expect(links[1].parentElement.querySelector('p')).toBeNull();
  });
});

describe('what left the page', () => {
  it('no Why PennJets, no aircraft cards, no off-market footnote, no featured block, no page footer', async () => {
    const el = await render();
    expect(el.textContent).not.toMatch(/Why PennJets|Representative aircraft types|Falcon 900|Premier 1A|Off-Market|Simplified|Featured Listing/);
    expect(el.querySelector('article')).toBeNull();
    expect(el.querySelector('footer')).toBeNull();
    expect(el.querySelector('section[aria-labelledby="featured-listing"]')).toBeNull();
  });
});
