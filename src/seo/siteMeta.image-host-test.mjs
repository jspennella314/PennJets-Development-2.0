// The image-host gate: which featuredImage URLs the site renders. WO-4.39.
//
//   node src/seo/siteMeta.image-host-test.mjs
//
// The site has no test runner (WO-4.38, Known gaps), so this is a node script
// against the real siteMeta.js, which is plain ESM and loads in Node. It exits
// 1 on any failure. Every surface that shows a note's image goes through
// safeImage() / isAllowedImage() / articleMeta().image, so this is the gate
// for all of them: the hero, the index card, the related-notes thumbnails,
// the home "latest note" card and its credit line, and og:image (client and
// prerendered).

import { isAllowedImage, safeImage, articleMeta, SITE_URL, DEFAULT_IMAGE } from './siteMeta.js';

const BLOB = 'https://algxvqsvihyabn9r.public.blob.vercel-storage.com/blog/test/x.jpg';

let failed = 0;
function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failed += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
  if (!ok) console.log(`      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

const post = (featuredImage) => ({
  slug: 'test', title: 'Test note', excerpt: 'x', publishedAt: '2026-10-02T00:00:00.000Z',
  author: { name: 'PennJets' }, featuredImage,
});

console.log('--- accept: the CRM\'s own Blob store, named exactly');
check('isAllowedImage(blob)', isAllowedImage(BLOB), true);
check('safeImage(blob) returns the URL unchanged', safeImage(BLOB), BLOB);
check('articleMeta(post).image (og:image) is the blob URL', articleMeta(post(BLOB)).image, BLOB);
check('host match is case-insensitive', isAllowedImage(BLOB.replace('algxvqsvihyabn9r.public', 'ALGXVQSVIHYABN9R.PUBLIC')), true);
check('the store with a query string', isAllowedImage(BLOB + '?v=2'), true);

console.log('--- accept: the site\'s own hosts, as before');
check('www.pennjets.com', isAllowedImage('https://www.pennjets.com/images/Gallery/pc12.jpg'), true);
check('pennjets.com', isAllowedImage('https://pennjets.com/images/Gallery/pc12.jpg'), true);
check('a relative path', isAllowedImage('/images/Gallery/pc12.jpg'), true);

console.log('--- refuse: the same path on a host that is not the store');
const evilSameDomain = 'https://evil.public.blob.vercel-storage.com/blog/test/x.jpg';
const evilSuffix = 'https://algxvqsvihyabn9r.public.blob.vercel-storage.com.evil.com/blog/test/x.jpg';
check('another store on the same domain', isAllowedImage(evilSameDomain), false);
check('  safeImage -> null', safeImage(evilSameDomain), null);
check('  og:image falls back to the default card', articleMeta(post(evilSameDomain)).image, SITE_URL + DEFAULT_IMAGE);
check('our store id as a prefix of someone else\'s host', isAllowedImage(evilSuffix), false);
check('  safeImage -> null', safeImage(evilSuffix), null);
check('  og:image falls back to the default card', articleMeta(post(evilSuffix)).image, SITE_URL + DEFAULT_IMAGE);
check('the bare domain', isAllowedImage('https://public.blob.vercel-storage.com/blog/test/x.jpg'), false);
check('the domain apex', isAllowedImage('https://vercel-storage.com/blog/test/x.jpg'), false);
check('our store id on a different port', isAllowedImage('https://algxvqsvihyabn9r.public.blob.vercel-storage.com:8443/x.jpg'), false);
check('our store id with credentials in front', isAllowedImage('https://algxvqsvihyabn9r.public.blob.vercel-storage.com@evil.com/x.jpg'), false);
check('our store id in the path only', isAllowedImage('https://evil.com/algxvqsvihyabn9r.public.blob.vercel-storage.com/x.jpg'), false);
check('a third party (the one live case today)', isAllowedImage('https://wallpaperaccess.com/full/4568461.jpg'), false);
check('not a URL', isAllowedImage('https://'), false);
check('empty', isAllowedImage(''), false);
check('null', isAllowedImage(null), false);

console.log(failed ? `\n${failed} FAILED` : '\nall passed');
process.exit(failed ? 1 : 0);
