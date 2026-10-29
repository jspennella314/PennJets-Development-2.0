// Single source of page metadata. Used at runtime by <PageMeta> (react-helmet-async)
// and at build time by scripts/postbuild.mjs, which writes crawler-visible HTML
// per route so social previews and search snippets work without JavaScript.
// Plain ESM, no JSX, no import.meta: it must load in Node as well as the browser.

export const SITE_URL = 'https://www.pennjets.com';
export const SITE_NAME = 'Penn Jets';
// The branded link-preview card: the mark in white on primary.600, 1200x630.
// WO-4.16, Joseph chose the logo alone over a logo-plus-wordmark lockup,
// because the mark is itself the word PennJets and the lockup said it twice.
export const DEFAULT_IMAGE = '/images/og-card.png';
export const DEFAULT_TITLE = 'Penn Jets | Private Jet Brokerage & Aviation Consulting';
export const DEFAULT_DESCRIPTION =
  'Independent aircraft brokerage and consulting. Buy, sell, or charter with someone who shows you the numbers.';

// Titles stay under ~60 characters and descriptions under ~160 so they are not truncated.
export const ROUTES = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  '/charter': {
    // Title 50 characters, description 120, against the 60 and 160 a search
    // result shows. Joseph wrote this description himself on 2026-09-21,
    // rejecting all three options I costed: it carries the geography and the
    // broker status, and leaves the full 14 CFR 295.23 disclosure to the page
    // and the footer, where it appears in full. WO-4.22.
    title: 'Light & Midsize Jet Charter from NY/NJ | Penn Jets',
    description:
      'Light and midsize jet charter from Teterboro, Westchester and Long Island, arranged by Penn Jets, an air charter broker.',
  },
  '/buy': {
    title: 'Buy an Aircraft | Penn Jets',
    description:
      "Sole and fractional ownership, including aircraft that aren't publicly listed. Tell us the mission and we'll tell you what's available.",
  },
  '/sell': {
    title: 'Sell Your Aircraft | Penn Jets',
    description:
      "Tell us what you have and we'll come back with where it sits in the current market and what a realistic timeline looks like.",
  },
  '/consulting': {
    title: 'Aviation Consulting | Penn Jets',
    description:
      'Cost of ownership, mission fit, ownership structure, or a second opinion on a deal in front of you.',
  },
  '/pennshare': {
    title: 'PennShare Fractional Ownership | Penn Jets',
    description:
      'Fractional aircraft shares structured by PennJets and flown by a licensed Part 135 operator. Share the costs, not the convenience.',
  },
  '/about': {
    title: 'About Penn Jets | Private Aviation Sales and Consulting',
    description:
      'Joseph Pennella, founder and principal broker of PennJets. Private aviation sales and consulting: sole ownership, fractional, charter brokerage, and advisory.',
  },
  '/contact': {
    title: 'Contact Penn Jets',
    description:
      'Talk to a broker about buying, selling, or chartering an aircraft. Call (954) 546-0763 or send a message.',
  },
  '/blog': {
    title: 'Market Notes | Penn Jets',
    description:
      'Market notes, transaction insights, and aircraft overviews from PennJets.',
  },
  // Copy for Joseph's approval at the WO-4.52 report.
  '/aircraft': {
    title: 'Recent Inquiries | Penn Jets',
    description:
      'Aircraft Penn Jets has recently sourced, evaluated or been asked about. Not exclusive listings; availability and pricing confirmed at inquiry.',
  },
  '/privacy-policy': { title: 'Privacy Policy | Penn Jets', description: 'How PennJets collects, uses, and protects your information.' },
  '/terms-of-service': { title: 'Terms of Service | Penn Jets', description: 'Terms governing use of the PennJets website and services.' },
  '/cookie-policy': { title: 'Cookie Policy | Penn Jets', description: 'How the PennJets website uses cookies and similar technologies.' },
  '/compliance': { title: 'Compliance Statement | Penn Jets', description: 'PennJets compliance statement and air charter broker disclosure.' },
  '/gallery': { title: 'Image Library | Penn Jets', description: 'Image library for PennJets Market Notes.', noindex: true },
};

// Routes that get a static HTML file at build time and a sitemap entry.
export const STATIC_ROUTES = Object.keys(ROUTES).filter((r) => !ROUTES[r].noindex);

export function canonicalFor(pathname) {
  const clean = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  return SITE_URL + clean;
}

export function absoluteImage(src) {
  if (!src) return SITE_URL + DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(src)) return src;
  return SITE_URL + (src.startsWith('/') ? src : '/' + src);
}

// Images are served from this site, or from the CRM's own image store. A note's
// featuredImage is set in the CRM and can point anywhere; hotlinking a third
// party's image ships something we hold no licence for, so the site refuses to
// render it. Relative paths are ours by definition.
//
// The third host is the CRM's Vercel Blob store, where an image uploaded from
// the CMS editor lives (WO-1.22). It is ours, not a third party's: the upload
// route is the CRM's, and the licence is recorded on upload in the note's four
// attribution fields. It is the one store, named exactly, confirmed by the
// lead from the store's stored URLs and the Blob token's store id. Not
// `*.vercel-storage.com` and no suffix match: another store on that domain is
// someone else's. WO-4.39.
const ALLOWED_IMAGE_HOSTS = new Set([
  'www.pennjets.com',
  'pennjets.com',
  'algxvqsvihyabn9r.public.blob.vercel-storage.com',
]);

export function isAllowedImage(src) {
  if (!src) return false;
  if (!/^https?:\/\//i.test(src)) return true;
  try {
    return ALLOWED_IMAGE_HOSTS.has(new URL(src).host.toLowerCase());
  } catch (e) {
    return false;
  }
}

// The image to render, or null when it is not one we serve.
export function safeImage(src) {
  return isAllowedImage(src) ? src : null;
}

export function metaForPath(pathname) {
  const clean = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  if (ROUTES[clean]) return { ...ROUTES[clean], type: 'website' };
  if (clean.startsWith('/blog/')) return { ...ROUTES['/blog'], type: 'article' };
  return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, type: 'website' };
}

// Article metadata from a CRM post (GET /api/public/blog and /api/public/blog/{slug}).
export function articleMeta(post) {
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || DEFAULT_DESCRIPTION;
  // The brand once: a title that already carries it, in either spelling, is
  // never suffixed again. Joseph's form is "Penn Jets" (2026-10-28). WO-4.54.
  return {
    title: /penn\s?jets/i.test(title) ? title : `${title} | Penn Jets Market Notes`,
    description,
    // The link-preview image prefers the CRM's 1200x630 social crop
    // (`featuredImageSocial`, WO-1.30: the social.webp stored beside every
    // editor upload; null for Gallery URLs and older uploads), then the
    // article image. Both go through the same host gate, so an off-host
    // social URL falls back to the article image, and both off-host falls
    // back to the default card. The article's own <img> keeps featuredImage;
    // the crop is for previews only. WO-4.44.
    image: absoluteImage(safeImage(post.featuredImageSocial) ?? safeImage(post.featuredImage)),
    url: `${SITE_URL}/blog/${post.slug}`,
    publishedAt: post.publishedAt,
    authorName: (post.author && post.author.name) || 'PennJets',
    type: 'article',
  };
}
