// @vitest-environment happy-dom
// The sticky bar steps aside while a form field has focus, the keyboard-up
// case, and comes back when focus leaves the form. WO-4.49.

import { describe, it, expect, afterEach, vi } from 'vitest';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import StickyContactBar from './StickyContactBar';
import { sendConversion, SEND_TO_CALL } from '../../../content/googleAds';

vi.mock('../../../content/googleAds', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, sendConversion: vi.fn(actual.sendConversion) };
});

const act = React.act || TestUtils.act;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let roots = [];
async function render(path = '/buy') {
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  roots.push({ root, el });
  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <form>
          <input name="name" />
          <select name="when"><option>Now</option></select>
          <textarea name="notes" />
        </form>
        <input name="outside" />
        <StickyContactBar />
      </MemoryRouter>
    );
  });
  return el;
}

afterEach(async () => {
  for (const { root, el } of roots) { await act(async () => root.unmount()); el.remove(); }
  roots = [];
});

const bar = (el) => el.querySelector('[data-sticky-contact-bar]');

describe('the sticky bar and the keyboard (WO-4.49)', () => {
  it('shows by default', async () => {
    const el = await render();
    expect(bar(el).getAttribute('data-hidden')).toBe('false');
    expect(bar(el).className).toMatch(/translate-y-0/);
  });

  it.each(['input[name="name"]', 'select', 'textarea'])('hides on focus of a form %s, by the translate path', async (sel) => {
    const el = await render();
    await act(async () => { el.querySelector(sel).focus(); });
    expect(bar(el).getAttribute('data-hidden')).toBe('true');
    expect(bar(el).getAttribute('aria-hidden')).toBe('true');
    expect(bar(el).className).toMatch(/translate-y-full/);
    expect(bar(el).style.display).not.toBe('none');
    for (const a of bar(el).querySelectorAll('a')) expect(a.getAttribute('tabindex')).toBe('-1');
  });

  it('stays hidden moving between fields, and shows when focus leaves the form', async () => {
    const el = await render();
    await act(async () => { el.querySelector('input[name="name"]').focus(); });
    await act(async () => { el.querySelector('textarea').focus(); });
    expect(bar(el).getAttribute('data-hidden')).toBe('true');
    await act(async () => { el.querySelector('input[name="outside"]').focus(); });
    expect(bar(el).getAttribute('data-hidden')).toBe('false');
    await act(async () => { el.querySelector('input[name="name"]').focus(); });
    await act(async () => { el.querySelector('input[name="name"]').blur(); });
    expect(bar(el).getAttribute('data-hidden')).toBe('false');
  });

  it('a field outside any form does not hide it', async () => {
    const el = await render();
    await act(async () => { el.querySelector('input[name="outside"]').focus(); });
    expect(bar(el).getAttribute('data-hidden')).toBe('false');
  });
});

// A tap on Call is a Google Ads call conversion, on any page; the empty
// label (until Joseph's file) means nothing reaches gtag. WO-4.56.
describe('the Call conversion (WO-4.56)', () => {
  it('a click on Call sends the call label, and nothing reaches gtag while it is empty', async () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    sendConversion.mockClear();
    const el = await render('/charter');
    expect(sendConversion).not.toHaveBeenCalled();
    const call = el.querySelector('[data-sticky-contact-bar] a[href^="tel:"]');
    call.addEventListener('click', (e) => e.preventDefault());
    await act(async () => { call.click(); });
    expect(sendConversion).toHaveBeenCalledTimes(1);
    expect(sendConversion).toHaveBeenCalledWith(SEND_TO_CALL);
    expect(gtag).not.toHaveBeenCalled();
    delete window.gtag;
  });
});
