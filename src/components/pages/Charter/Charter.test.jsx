// @vitest-environment happy-dom
// The charter page's two Google Ads conversions (WO-4.56): the quote form
// counts only when the webhook accepted the lead, never on Continue, an error
// or mount; the Call button counts a call. With the labels still empty,
// sendConversion is called with "" and nothing reaches gtag.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../hooks/useNarrowViewport', () => ({ default: () => true }));
vi.mock('../../../content/googleAds', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, sendConversion: vi.fn(actual.sendConversion) };
});

import Charter from './Charter';
import { sendConversion, SEND_TO_FORM, SEND_TO_CALL } from '../../../content/googleAds';

const act = React.act || TestUtils.act;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const ok = (status, body) => ({ ok: status < 400, status, json: async () => body });
let roots = [];
let gtag;

async function render(webhook) {
  vi.stubGlobal('fetch', vi.fn(async (url) => {
    if (String(url).includes('/api/webhooks/incoming/')) return webhook();
    return ok(200, { posts: [], listings: [], pagination: { total: 0, hasMore: false } });
  }));
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  roots.push({ root, el });
  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={['/charter']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Charter />
      </MemoryRouter>
    );
  });
  return el;
}

const type = async (el, value) => {
  const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
  await act(async () => {
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
    el.dispatchEvent(new window.Event('input', { bubbles: true }));
  });
};
const form = (el) => el.querySelector('section#quote form');
const visible = 'input:not([aria-hidden="true"]):not([tabindex="-1"])';

async function stepOne(el) {
  const f = form(el);
  await type(f.querySelector(`${visible}[placeholder^="TEB"]`), 'TEB');
  await type(f.querySelector(`${visible}[placeholder^="PBI"]`), 'PBI');
  await type(f.querySelector(`${visible}[type="date"][required]`), '2026-11-20');
  const cont = [...f.querySelectorAll('button[type="button"]')].find((b) => /Continue/.test(b.textContent));
  await act(async () => { cont.click(); });
}

async function stepTwoSubmit(el) {
  const f = form(el);
  await type(f.querySelector('input[autocomplete="name"]'), 'Test Evidence');
  await type(f.querySelector('input[autocomplete="email"]'), 'evidence@example.com');
  await type(f.querySelector('input[autocomplete="tel"]'), '5555550100');
  await act(async () => { f.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })); });
  for (let i = 0; i < 3; i++) await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
}

beforeEach(() => {
  vi.stubEnv('VITE_CONTACT_WEBHOOK_ID', 'test-webhook');
  gtag = vi.fn();
  window.gtag = gtag;
  sendConversion.mockClear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(async () => {
  for (const { root, el } of roots) { await act(async () => root.unmount()); el.remove(); }
  roots = [];
  delete window.gtag;
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('the quote form conversion (WO-4.56)', () => {
  it('nothing on page load', async () => {
    await render(() => ok(200, { success: true }));
    expect(sendConversion).not.toHaveBeenCalled();
  });

  it('nothing on step 1 (Continue)', async () => {
    const el = await render(() => ok(200, { success: true }));
    await stepOne(el);
    expect(form(el).querySelector('input[autocomplete="name"]')).not.toBeNull();
    expect(sendConversion).not.toHaveBeenCalled();
  });

  it('once on a step-2 success, with the form label; empty, so gtag hears nothing', async () => {
    const el = await render(() => ok(200, { success: true }));
    await stepOne(el);
    await stepTwoSubmit(el);
    expect(el.textContent).toMatch(/Thanks/);
    expect(sendConversion).toHaveBeenCalledTimes(1);
    expect(sendConversion).toHaveBeenCalledWith(SEND_TO_FORM);
    expect(SEND_TO_FORM).toBe('');
    expect(gtag).not.toHaveBeenCalled();
  });

  it('nothing when the webhook answers 500', async () => {
    const el = await render(() => ok(500, { success: false, error: 'boom' }));
    await stepOne(el);
    await stepTwoSubmit(el);
    expect(form(el).querySelector('[role="alert"]')).not.toBeNull();
    expect(sendConversion).not.toHaveBeenCalled();
  });
});

describe('the Call button conversion (WO-4.56)', () => {
  it('a click on the hero Call counts a call, with the call label', async () => {
    const el = await render(() => ok(200, { success: true }));
    const call = [...el.querySelectorAll('a[href="tel:+19545460763"]')].find((a) => /Call \(954\)/.test(a.textContent));
    call.addEventListener('click', (e) => e.preventDefault());
    await act(async () => { call.click(); });
    expect(sendConversion).toHaveBeenCalledTimes(1);
    expect(sendConversion).toHaveBeenCalledWith(SEND_TO_CALL);
    expect(gtag).not.toHaveBeenCalled();
  });
});
