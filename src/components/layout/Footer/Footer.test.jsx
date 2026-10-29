// @vitest-environment happy-dom
// The footer's columns after the Services page went: Joseph's "What We Do"
// heading, every row pointing at a page that exists, nothing at /services.
// WO-4.53.

import { describe, it, expect, afterEach } from 'vitest';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

const act = React.act || TestUtils.act;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let roots = [];
async function render() {
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  roots.push({ root, el });
  await act(async () => {
    root.render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Footer />
      </MemoryRouter>
    );
  });
  return el;
}

afterEach(async () => {
  for (const { root, el } of roots) { await act(async () => root.unmount()); el.remove(); }
  roots = [];
});

const column = (el, heading) => {
  const h = [...el.querySelectorAll('footer h3')].find((x) => x.textContent.trim() === heading);
  return h && [...h.parentElement.querySelectorAll('a')].map((a) => `${a.textContent.trim()} -> ${a.getAttribute('href')}`);
};

describe('the footer columns (WO-4.53)', () => {
  it('"What We Do" replaces "Services", with Charter and Consulting', async () => {
    const el = await render();
    const headings = [...el.querySelectorAll('footer h3')].map((h) => h.textContent.trim());
    expect(headings[0]).toBe('What We Do');
    expect(headings).not.toContain('Services');
    expect(column(el, 'What We Do')).toEqual(['Charter Services -> /charter', 'Consulting -> /consulting']);
  });

  it('the Aircraft column: Market Analysis to the notes, Valuation to Consulting', async () => {
    const el = await render();
    expect(column(el, 'Aircraft')).toEqual([
      'Buy an Aircraft -> /buy',
      'See recent inquiries -> /aircraft',
      'Sell Your Aircraft -> /sell',
      'Market Analysis -> /blog',
      'Valuation Services -> /consulting',
    ]);
  });

  it('links nowhere under /services', async () => {
    const el = await render();
    expect(el.querySelector('a[href^="/services"]')).toBeNull();
  });
});
