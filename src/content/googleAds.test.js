// sendConversion: the one place a Google Ads conversion is sent. WO-4.56.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { sendConversion, SEND_TO_FORM, SEND_TO_CALL, AW_ID } from './googleAds.js';

afterEach(() => { vi.unstubAllGlobals(); });

describe('the labels (from Joseph by file)', () => {
  it("the form label is the file's; the call label is still empty, so no call is counted yet", () => {
    expect(SEND_TO_FORM).toBe('AW-18544502023/HfIdCJrgta4dEIfK2opF');
    expect(SEND_TO_CALL).toBe('');
  });
  it('the tag id is the campaign account\'s', () => expect(AW_ID).toBe('AW-18544502023'));
});

describe('sendConversion', () => {
  it('an empty label sends nothing, even with the tag loaded', () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    expect(sendConversion('')).toBe(false);
    expect(sendConversion(SEND_TO_CALL)).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });
  it('no tag (blocked, or not loaded yet) sends nothing and does not throw', () => {
    vi.stubGlobal('window', {});
    expect(sendConversion('AW-18544502023/abc')).toBe(false);
  });
  it('with a label and the tag: one conversion event, send_to only', () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    expect(sendConversion('AW-18544502023/abc')).toBe(true);
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith('event', 'conversion', { send_to: 'AW-18544502023/abc' });
  });
  it('a tag that throws never breaks the caller', () => {
    vi.stubGlobal('window', { gtag: () => { throw new Error('blocked'); } });
    expect(sendConversion('AW-18544502023/abc')).toBe(false);
  });
});
