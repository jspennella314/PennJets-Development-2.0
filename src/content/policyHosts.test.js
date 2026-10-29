// The hosts the policies say a browser contacts (WO-4.57). The wording is
// Joseph's, approved as drafted 2026-10-29; a change here is a copy change.

import { describe, it, expect } from 'vitest';
import { SECTIONS as COOKIE } from './cookiePolicy.js';
import { SECTIONS as PRIVACY } from './privacyPolicy.js';

describe('the cookie policy counts three hosts', () => {
  const body = COOKIE.find((s) => s.id === 'other-companies').body;
  it('opens "Three." and names Vercel\'s storage host for the note pictures, which sets nothing', () => {
    expect(body[0].startsWith('Three. Loading a page contacts pennforce.pennjets.com')).toBe(true);
    expect(body[0]).toContain('www.googletagmanager.com, www.google.com and ad.doubleclick.net.');
    expect(body[0]).toContain('your browser fetches the picture from Vercel, the company that hosts our system, at a vercel-storage.com address; that is our own image, and the request sets nothing in your browser.');
  });
  it('the closing sentence allows for the pictures', () => {
    expect(body[2]).toBe('Apart from Google' + "'" + 's advertising tag and our own pictures on Vercel, there is no analytics provider, no other advertising network and no embedded third-party content on this site to contact.');
  });
});

describe('the privacy policy lists Vercel as storing the pictures', () => {
  it('one line in the processors list', () => {
    const list = PRIVACY.find((s) => s.id === 'sharing').list;
    expect(list).toContain('Vercel, which hosts the CRM, serves it and stores the Market Note pictures.');
    expect(list).not.toContain('Vercel, which hosts the CRM and serves it.');
  });
});
