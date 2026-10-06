// The image-host gate: which featuredImage URLs the site renders. WO-4.39,
// folded into vitest by WO-4.41 (was siteMeta.image-host-test.mjs; every
// case kept).
//
// Every surface that shows a note's image goes through safeImage() /
// isAllowedImage() / articleMeta().image, so this is the gate for all of
// them: the hero, the index card, the related-notes thumbnails, the home
// "latest note" card and its credit line, and og:image (client and
// prerendered).

import { describe, it, expect } from 'vitest';
import { isAllowedImage, safeImage, articleMeta, SITE_URL, DEFAULT_IMAGE } from './siteMeta.js';

const BLOB = 'https://algxvqsvihyabn9r.public.blob.vercel-storage.com/blog/test/x.jpg';

const post = (featuredImage) => ({
  slug: 'test', title: 'Test note', excerpt: 'x', publishedAt: '2026-10-02T00:00:00.000Z',
  author: { name: 'PennJets' }, featuredImage,
});

describe("accept: the CRM's own Blob store, named exactly", () => {
  it('isAllowedImage(blob)', () => expect(isAllowedImage(BLOB)).toBe(true));
  it('safeImage(blob) returns the URL unchanged', () => expect(safeImage(BLOB)).toBe(BLOB));
  it('articleMeta(post).image (og:image) is the blob URL', () => expect(articleMeta(post(BLOB)).image).toBe(BLOB));
  it('host match is case-insensitive', () =>
    expect(isAllowedImage(BLOB.replace('algxvqsvihyabn9r.public', 'ALGXVQSVIHYABN9R.PUBLIC'))).toBe(true));
  it('the store with a query string', () => expect(isAllowedImage(BLOB + '?v=2')).toBe(true));
});

describe("accept: the site's own hosts, as before", () => {
  it('www.pennjets.com', () => expect(isAllowedImage('https://www.pennjets.com/images/Gallery/pc12.jpg')).toBe(true));
  it('pennjets.com', () => expect(isAllowedImage('https://pennjets.com/images/Gallery/pc12.jpg')).toBe(true));
  it('a relative path', () => expect(isAllowedImage('/images/Gallery/pc12.jpg')).toBe(true));
});

describe('og:image prefers the social crop (featuredImageSocial, WO-4.44)', () => {
  const ARTICLE = 'https://algxvqsvihyabn9r.public.blob.vercel-storage.com/blog/corg/0123456789abcdef/main.webp';
  const SOCIAL = 'https://algxvqsvihyabn9r.public.blob.vercel-storage.com/blog/corg/0123456789abcdef/social.webp';
  const GALLERY = 'https://www.pennjets.com/images/Gallery/pc12.jpg';
  const OFF_HOST = 'https://evil.public.blob.vercel-storage.com/blog/x/social.webp';
  const withSocial = (featuredImage, featuredImageSocial) => ({ ...post(featuredImage), featuredImageSocial });

  it('a social URL on the store -> og:image is the social crop', () =>
    expect(articleMeta(withSocial(ARTICLE, SOCIAL)).image).toBe(SOCIAL));
  it('social null (every current note) -> og:image is featuredImage', () =>
    expect(articleMeta(withSocial(GALLERY, null)).image).toBe(GALLERY));
  it('social absent from the post (an older cache row) -> featuredImage', () =>
    expect(articleMeta(post(GALLERY)).image).toBe(GALLERY));
  it('an off-host social URL -> featuredImage (the host rule)', () =>
    expect(articleMeta(withSocial(ARTICLE, OFF_HOST)).image).toBe(ARTICLE));
  it('both off-host -> the default card', () =>
    expect(articleMeta(withSocial('https://wallpaperaccess.com/full/4568461.jpg', OFF_HOST)).image).toBe(SITE_URL + DEFAULT_IMAGE));
  it('social on the store, featuredImage off-host -> still the social crop', () =>
    expect(articleMeta(withSocial('https://wallpaperaccess.com/full/4568461.jpg', SOCIAL)).image).toBe(SOCIAL));
  it('a relative social path is made absolute like any site image', () =>
    expect(articleMeta(withSocial(GALLERY, '/images/og/x.png')).image).toBe(SITE_URL + '/images/og/x.png'));
  it('no image at all -> the default card', () =>
    expect(articleMeta(withSocial(null, null)).image).toBe(SITE_URL + DEFAULT_IMAGE));
});

describe('refuse: the same path on a host that is not the store', () => {
  const evilSameDomain = 'https://evil.public.blob.vercel-storage.com/blog/test/x.jpg';
  const evilSuffix = 'https://algxvqsvihyabn9r.public.blob.vercel-storage.com.evil.com/blog/test/x.jpg';

  it('another store on the same domain', () => expect(isAllowedImage(evilSameDomain)).toBe(false));
  it('  safeImage -> null (same domain)', () => expect(safeImage(evilSameDomain)).toBe(null));
  it('  og:image falls back to the default card (same domain)', () =>
    expect(articleMeta(post(evilSameDomain)).image).toBe(SITE_URL + DEFAULT_IMAGE));
  it("our store id as a prefix of someone else's host", () => expect(isAllowedImage(evilSuffix)).toBe(false));
  it('  safeImage -> null (prefix)', () => expect(safeImage(evilSuffix)).toBe(null));
  it('  og:image falls back to the default card (prefix)', () =>
    expect(articleMeta(post(evilSuffix)).image).toBe(SITE_URL + DEFAULT_IMAGE));
  it('the bare domain', () => expect(isAllowedImage('https://public.blob.vercel-storage.com/blog/test/x.jpg')).toBe(false));
  it('the domain apex', () => expect(isAllowedImage('https://vercel-storage.com/blog/test/x.jpg')).toBe(false));
  it('our store id on a different port', () =>
    expect(isAllowedImage('https://algxvqsvihyabn9r.public.blob.vercel-storage.com:8443/x.jpg')).toBe(false));
  it('our store id with credentials in front', () =>
    expect(isAllowedImage('https://algxvqsvihyabn9r.public.blob.vercel-storage.com@evil.com/x.jpg')).toBe(false));
  it('our store id in the path only', () =>
    expect(isAllowedImage('https://evil.com/algxvqsvihyabn9r.public.blob.vercel-storage.com/x.jpg')).toBe(false));
  it('a third party (the one live case today)', () => expect(isAllowedImage('https://wallpaperaccess.com/full/4568461.jpg')).toBe(false));
  it('not a URL', () => expect(isAllowedImage('https://')).toBe(false));
  it('empty', () => expect(isAllowedImage('')).toBe(false));
  it('null', () => expect(isAllowedImage(null)).toBe(false));
});
