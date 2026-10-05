// inventoryApi against the contract (docs/integration/PENNJETS-SITE.md §5).
// WO-4.42.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { inventoryApi, toCardListing } from './inventoryApi.js';

const BLOB = 'https://algxvqsvihyabn9r.public.blob.vercel-storage.com/aircraft/org/hawker.jpg';
const LISTING = {
  id: 'ckx1', slug: '2004-hawker-800xp-258xxx', year: 2004, make: 'Hawker', model: '800XP', variant: null,
  serial: '258xxx', hours: 6200, config: '8 passengers, forward galley, aft lav', askingPrice: 2950000,
  headline: 'Fresh 48-month inspection, Collins Pro Line 21', images: [BLOB], updatedAt: '2026-10-12T15:04:05.000Z',
};

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('toCardListing', () => {
  it('maps the contract\'s example to the card\'s fields', () => {
    expect(toCardListing(LISTING)).toEqual({
      id: 'ckx1', slug: '2004-hawker-800xp-258xxx', year: 2004, make: 'Hawker', model: '800XP', variant: null,
      serial: '258xxx', hours: 6200, config: '8 passengers, forward galley, aft lav',
      headline: 'Fresh 48-month inspection, Collins Pro Line 21', askingPrice: 2950000,
      image: BLOB, images: [BLOB], url: '/aircraft/2004-hawker-800xp-258xxx', updatedAt: '2026-10-12T15:04:05.000Z',
    });
  });
  it('askingPrice null stays null; a string is not a price', () => {
    expect(toCardListing({ ...LISTING, askingPrice: null }).askingPrice).toBe(null);
    expect(toCardListing({ ...LISTING, askingPrice: '2950000' }).askingPrice).toBe(null);
  });
  it.each(['slug', 'year', 'make', 'model', 'serial', 'hours', 'config'])('drops a listing without %s', (field) => {
    const rest = { ...LISTING };
    delete rest[field];
    expect(toCardListing(rest)).toBe(null);
  });
  it('drops images on any host but the CRM\'s store (safeImage, WO-4.39)', () => {
    const l = toCardListing({ ...LISTING, images: ['https://evil.public.blob.vercel-storage.com/x.jpg', BLOB, 'https://wallpaperaccess.com/full/1.jpg'] });
    expect(l.images).toEqual([BLOB]);
    expect(l.image).toBe(BLOB);
  });
  it('no images -> image null', () => {
    expect(toCardListing({ ...LISTING, images: [] }).image).toBe(null);
    expect(toCardListing({ ...LISTING, images: undefined }).image).toBe(null);
  });
  it('garbage -> null', () => {
    expect(toCardListing(null)).toBe(null);
    expect(toCardListing('x')).toBe(null);
  });
});

describe('getListings', () => {
  it('reads GET /api/public/inventory once, no parameters', async () => {
    const fetch = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ listings: [LISTING] }) }));
    vi.stubGlobal('fetch', fetch);
    const got = await inventoryApi.getListings();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe('https://www.pennforce.pennjets.com/api/public/inventory');
    expect(got.map((l) => l.slug)).toEqual(['2004-hawker-800xp-258xxx']);
  });
  it('[] on 404 (the route until WO-3.39 is live), 500, a network error, and bad JSON', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    for (const response of [
      async () => ({ ok: false, status: 404, json: async () => ({}) }),
      async () => ({ ok: false, status: 500, json: async () => ({}) }),
      async () => { throw new Error('Failed to fetch'); },
      async () => ({ ok: true, status: 200, json: async () => { throw new SyntaxError('bad json'); } }),
    ]) {
      vi.stubGlobal('fetch', vi.fn(response));
      expect(await inventoryApi.getListings()).toEqual([]);
    }
  });
  it('[] when the body has no listings array', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ listings: 'nope' }) })));
    expect(await inventoryApi.getListings()).toEqual([]);
  });
});

describe('getListing(slug)', () => {
  it('finds one by slug, null otherwise', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ listings: [LISTING] }) })));
    expect((await inventoryApi.getListing('2004-hawker-800xp-258xxx')).serial).toBe('258xxx');
    expect(await inventoryApi.getListing('2004-hawker-800xp-999')).toBe(null);
    expect(await inventoryApi.getListing('')).toBe(null);
  });
});
