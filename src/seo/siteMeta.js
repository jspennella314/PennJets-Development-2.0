// Single source of page metadata. Used at runtime by <PageMeta> (react-helmet-async)
// and at build time by scripts/postbuild.mjs, which writes crawler-visible HTML
// per route so social previews and search snippets work without JavaScript.
// Plain ESM, no JSX, no import.meta: it must load in Node as well as the browser.

export const SITE_URL = 'https://www.pennjets.com';
export const SITE_NAME = 'PennJets';
// The branded link-preview card: the mark in white on primary.600, 1200x630.
// WO-4.16, Joseph chose the logo alone over a logo-plus-wordmark lockup,
// because the mark is itself the word PennJets and the lockup said it twice.
export const DEFAULT_IMAGE = '/images/og-card.png';
export const DEFAULT_TITLE = 'PennJets | Private Jet Brokerage & Aviation Consulting';
export const DEFAULT_DESCRIPTION =
  'Independent aircraft brokerage and consulting. Buy, sell, or charter with someone who shows you the numbers.';

// Titles stay under ~60 characters and descriptions under ~160 so they are not truncated.
export const ROUTES = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  '/charter': {
    // 50 characters, against the 60 an ordinary search result shows. The
    // description is still Joseph's to choose: the approved 14 CFR 295.23
    // disclosure is 352 characters and will not fit beside the geography in
    // 160, so the trade-off is costed in docs/drafts/t4/wo-4.22-charter-copy.md
    // rather than resolved by trimming approved wording. WO-4.22.
    title: 'Light & Midsize Jet Charter from NY/NJ | Penn Jets',
    description:
      'Request a private jet charter quote. Penn Jets is an air charter broker; every flight is operated by a licensed direct air carrier.',
  },
  '/buy': {
    title: 'Buy an Aircraft | PennJets',
    description:
      "Sole and fractional ownership, including aircraft that aren't publicly listed. Tell us the mission and we'll tell you what's available.",
  },
  '/sell': {
    title: 'Sell Your Aircraft | PennJets',
    description:
      "Tell us what you have and we'll come back with where it sits in the current market and what a realistic timeline looks like.",
  },
  '/consulting': {
    title: 'Aviation Consulting | PennJets',
    description:
      'Cost of ownership, mission fit, ownership structure, or a second opinion on a deal in front of you.',
  },
  '/pennshare': {
    title: 'PennShare Fractional Ownership | PennJets',
    description:
      'Fractional aircraft shares structured by PennJets and flown by a licensed Part 135 operator. Share the costs, not the convenience.',
  },
  '/services': {
    title: 'Aircraft Sales, Charter Brokerage & Consulting | PennJets',
    description:
      'Aircraft sales and acquisition, charter brokerage, fractional structures, market analysis, and aviation consulting from PennJets.',
  },
  '/about': {
    title: 'About PennJets | Private Aviation Sales and Consulting',
    description:
      'Meet the PennJets team. Private aviation sales and consulting: sole ownership, fractional, charter brokerage, and advisory.',
  },
  '/contact': {
    title: 'Contact PennJets',
    description:
      'Talk to a broker about buying, selling, or chartering an aircraft. Call (954) 546-0763 or send a message.',
  },
  '/blog': {
    title: 'Market Notes | PennJets',
    description:
      'Market notes, transaction insights, and aircraft overviews from the PennJets team.',
  },
  '/aircraft': {
    title: 'Aircraft for Sale | PennJets',
    description: 'Aircraft and fractional shares currently offered through PennJets.',
  },
  '/privacy-policy': { title: 'Privacy Policy | PennJets', description: 'How PennJets collects, uses, and protects your information.' },
  '/terms-of-service': { title: 'Terms of Service | PennJets', description: 'Terms governing use of the PennJets website and services.' },
  '/cookie-policy': { title: 'Cookie Policy | PennJets', description: 'How the PennJets website uses cookies and similar technologies.' },
  '/compliance': { title: 'Compliance Statement | PennJets', description: 'PennJets compliance statement and air charter broker disclosure.' },
  '/gallery': { title: 'Image Library | PennJets', description: 'Image library for PennJets Market Notes.', noindex: true },
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

// Images are served from this site only. A note's featuredImage is set in the
// CRM and can point anywhere; hotlinking a third party's image ships something
// we hold no licence for, so the site refuses to render it. Relative paths are
// ours by definition.
const ALLOWED_IMAGE_HOSTS = new Set(['www.pennjets.com', 'pennjets.com']);

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
  if (clean.startsWith('/aircraft/')) return { ...ROUTES['/aircraft'], type: 'website' };
  return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, type: 'website' };
}

// Article metadata from a CRM post (GET /api/public/blog and /api/public/blog/{slug}).
export function articleMeta(post) {
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || DEFAULT_DESCRIPTION;
  return {
    title: /penn\s?jets/i.test(title) ? title : `${title} | PennJets Market Notes`,
    description,
    image: absoluteImage(safeImage(post.featuredImage)),
    url: `${SITE_URL}/blog/${post.slug}`,
    publishedAt: post.publishedAt,
    authorName: (post.author && post.author.name) || 'PennJets',
    type: 'article',
  };
}
