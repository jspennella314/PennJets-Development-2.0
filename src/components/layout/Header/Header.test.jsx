// @vitest-environment happy-dom
// The fixed chrome's top half: the countdown banner on the home page only, as
// one dismissible line kept dismissed per year; the menu's order with no
// Aircraft; a named 44 px hamburger. WO-4.49.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

const act = React.act || TestUtils.act;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const KEY = `pj.banner.${new Date().getFullYear()}.dismissed`;

let roots = [];
async function render(path) {
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  roots.push({ root, el });
  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Header />
      </MemoryRouter>
    );
  });
  return el;
}

beforeEach(() => { window.localStorage.clear(); document.documentElement.removeAttribute('style'); });
afterEach(async () => {
  for (const { root, el } of roots) { await act(async () => root.unmount()); el.remove(); }
  roots = [];
});

describe('the countdown banner (WO-4.49)', () => {
  it('is on the home page as one line with the day count only', async () => {
    const el = await render('/');
    const banner = el.querySelector('[data-pj-banner]');
    expect(banner).not.toBeNull();
    const text = banner.textContent;
    const isNewYearsDay = new Date().getMonth() === 0 && new Date().getDate() === 1;
    if (isNewYearsDay) expect(text).toBe('Happy New Year!');
    else expect(text).toMatch(new RegExp(`^Days left to close a ${new Date().getFullYear()} acquisition: \\d+$`));
    expect(text).not.toMatch(/Hours|Mins|Secs/);
  });

  it.each(['/charter', '/buy', '/blog', '/blog/some-note', '/contact', '/terms-of-service', '/no-such-page'])(
    'is not rendered on %s, and the header docks at 0',
    async (path) => {
      const el = await render(path);
      expect(el.querySelector('[data-pj-banner]')).toBeNull();
      expect(document.documentElement.style.getPropertyValue('--pj-banner-h')).toBe('0px');
    }
  );

  it('dismisses: the banner goes, the header docks at 0, and the choice is stored for this year', async () => {
    const el = await render('/');
    const x = el.querySelector('[data-pj-banner] button[aria-label="Dismiss"]');
    expect(x).not.toBeNull();
    expect(x.className).toMatch(/\bw-11\b/);
    expect(x.className).toMatch(/\bh-11\b/);
    await act(async () => { x.click(); });
    expect(el.querySelector('[data-pj-banner]')).toBeNull();
    expect(document.documentElement.style.getPropertyValue('--pj-banner-h')).toBe('0px');
    expect(window.localStorage.getItem(KEY)).toBe('1');
  });

  it('stays dismissed on the next visit', async () => {
    window.localStorage.setItem(KEY, '1');
    const el = await render('/');
    expect(el.querySelector('[data-pj-banner]')).toBeNull();
  });

  it('a dismissal from another year does not hide this year\'s banner', async () => {
    window.localStorage.setItem(`pj.banner.${new Date().getFullYear() - 1}.dismissed`, '1');
    const el = await render('/');
    expect(el.querySelector('[data-pj-banner]')).not.toBeNull();
  });
});

describe('the header and menu (WO-4.49)', () => {
  it('is solid on the dark-hero pages too', async () => {
    for (const path of ['/', '/charter', '/contact', '/blog']) {
      const el = await render(path);
      const header = el.querySelector('header');
      expect(header.className).toMatch(/bg-white\/95/);
      expect(header.className).not.toMatch(/bg-transparent/);
      expect(header.style.top).toBe('var(--pj-banner-h, 0px)');
    }
  });

  it('the hamburger is a named 44 px button that says what it will do', async () => {
    const el = await render('/');
    const btn = el.querySelector('header .lg\\:hidden button');
    expect(btn.getAttribute('aria-label')).toBe('Open menu');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.className).toMatch(/\bw-11\b/);
    expect(btn.className).toMatch(/\bh-11\b/);
    await act(async () => { btn.click(); });
    expect(btn.getAttribute('aria-label')).toBe('Close menu');
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('the drawer lists the ten rows in Joseph\'s order, Aircraft out, Contact once', async () => {
    const el = await render('/');
    await act(async () => { el.querySelector('header .lg\\:hidden button').click(); });
    const rows = [...el.querySelectorAll('[data-mobile-menu] a')];
    expect(rows.map((a) => a.textContent.trim())).toEqual(
      ['Home', 'Charter', 'Buy', 'Sell', 'PennShare', 'Consulting', 'Services', 'About', 'Market Notes', 'Contact']
    );
    expect(rows.map((a) => a.getAttribute('href'))).toEqual(
      ['/', '/charter', '/buy', '/sell', '/pennshare', '/consulting', '/services', '/about', '/blog', '/contact']
    );
    for (const a of rows) expect(a.className).toMatch(/min-h-\[44px\]/);
    expect(el.querySelector('[data-mobile-menu] button')).toBeNull();
  });

  it('the desktop list is the same nine, with Contact as the button', async () => {
    const el = await render('/');
    const desktop = [...el.querySelectorAll('header .hidden.lg\\:flex')][0];
    expect([...desktop.querySelectorAll('a')].map((a) => a.textContent.trim())).toEqual(
      ['Home', 'Charter', 'Buy', 'Sell', 'PennShare', 'Consulting', 'Services', 'About', 'Market Notes']
    );
    expect(el.querySelector('a[href="/aircraft"]')).toBeNull();
    expect(el.querySelector('a[href="/contact"] button').textContent.trim()).toBe('Contact Us');
  });
});
