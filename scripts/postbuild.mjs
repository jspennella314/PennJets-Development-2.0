// Post-build step for GitHub Pages. Runs after `vite build`.
//
// Social crawlers and search engines do not run the SPA's JavaScript, so this
// writes a static HTML file per route with the right <title>, description,
// canonical, Open Graph, and Twitter tags baked in:
//
//   dist/index.html            (/)
//   dist/<route>.html          (/about, /charter, ... ; Pages serves /about from about.html)
//   dist/blog/<slug>.html      (one per published Market Note, fetched from the CRM)
//   dist/sitemap.xml
//
// Tags carry data-rh="true" so react-helmet-async adopts and replaces them on
// the client. The <body> of each file is filled in afterwards by
// scripts/prerender.mjs (WO-4.23); this stage owns the <head> and that one
// stays authoritative, because it is the only stage that can check whether a
// note's featured image is a file this repository actually ships.
//
// A CRM fetch failure falls back to scripts/crm-posts.cache.json and says so
// loudly. With no cache either, the build fails rather than quietly publishing
// a site with no Market Notes.

import fs from 'node:fs';
import path from 'node:path';
import {
  SITE_URL, SITE_NAME, DEFAULT_IMAGE, STATIC_ROUTES, ROUTES,
  canonicalFor, absoluteImage, articleMeta, isAllowedImage,
} from '../src/seo/siteMeta.js';

const DIST = path.resolve('dist');
const CRM = (process.env.VITE_CRM_API_URL || 'https://www.pennforce.pennjets.com').replace(/\/$/, '');
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function headTags({ title, description, url, image, type, noindex, extra = '' }) {
  return [
    `<title data-rh="true">${esc(title)}</title>`,
    `<meta data-rh="true" name="description" content="${esc(description)}">`,
    `<link data-rh="true" rel="canonical" href="${esc(url)}">`,
    `<meta data-rh="true" property="og:site_name" content="${esc(SITE_NAME)}">`,
    `<meta data-rh="true" property="og:type" content="${esc(type || 'website')}">`,
    `<meta data-rh="true" property="og:title" content="${esc(title)}">`,
    `<meta data-rh="true" property="og:description" content="${esc(description)}">`,
    `<meta data-rh="true" property="og:url" content="${esc(url)}">`,
    `<meta data-rh="true" property="og:image" content="${esc(image)}">`,
    `<meta data-rh="true" name="twitter:card" content="summary_large_image">`,
    `<meta data-rh="true" name="twitter:title" content="${esc(title)}">`,
    `<meta data-rh="true" name="twitter:description" content="${esc(description)}">`,
    `<meta data-rh="true" name="twitter:image" content="${esc(image)}">`,
    noindex ? `<meta data-rh="true" name="robots" content="noindex">` : '',
    extra,
  ].filter(Boolean).join('\n    ');
}

function renderShell(meta, bodyExtra = '') {
  let html = template
    .replace(/\s*<title>[\s\S]*?<\/title>/, '')
    .replace(/\s*<meta name="description"[^>]*>/, '');
  html = html.replace('</head>', `    ${headTags(meta)}\n  </head>`);
  if (bodyExtra) html = html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${bodyExtra}`);
  return html;
}

function writeFile(rel, content) {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

// ---- static routes -------------------------------------------------------
const written = [];
for (const route of Object.keys(ROUTES)) {
  const m = ROUTES[route];
  const meta = {
    title: m.title, description: m.description, url: canonicalFor(route),
    image: absoluteImage(m.image || DEFAULT_IMAGE), type: 'website', noindex: !!m.noindex,
  };
  const rel = route === '/' ? 'index.html' : `${route.replace(/^\//, '')}.html`;
  writeFile(rel, renderShell(meta));
  written.push(rel);
}

// ---- Market Notes from the CRM -------------------------------------------
async function fetchAllPosts() {
  const posts = [];
  let page = 1;
  for (;;) {
    const res = await fetch(`${CRM}/api/public/blog?page=${page}&limit=50`);
    if (!res.ok) throw new Error(`CRM list returned ${res.status}`);
    const data = await res.json();
    posts.push(...(data.posts || []));
    const pg = data.pagination || {};
    const totalPages = pg.totalPages || pg.pages || 1;
    if (page >= totalPages || !(data.posts || []).length) break;
    page += 1;
    if (page > 50) break;
  }
  return posts;
}

// The last set of posts a build saw, committed so a fresh CI checkout has one.
//
// Before this, a build with the CRM unreachable warned, exited 0, and shipped
// a site with no Market Note pages at all: no per-route head, no og cards, and
// a sitemap missing every note, because the sitemap is built from this same
// array. The warning scrolled past and the deploy succeeded. WO-4.23.
const POSTS_CACHE = path.resolve('scripts/crm-posts.cache.json');

let posts = [];
let usingCache = false;
try {
  posts = await fetchAllPosts();
  fs.writeFileSync(POSTS_CACHE, JSON.stringify(posts, null, 2) + '\n');
} catch (err) {
  if (!fs.existsSync(POSTS_CACHE)) {
    console.error(`[postbuild] CRM fetch failed (${err.message}) and there is no cache to fall back on.`);
    console.error('[postbuild] Refusing to publish a site with no Market Notes. Fix the CRM or restore scripts/crm-posts.cache.json.');
    process.exit(1);
  }
  posts = JSON.parse(fs.readFileSync(POSTS_CACHE, 'utf8'));
  usingCache = true;
  console.warn('='.repeat(72));
  console.warn(`[postbuild] CRM UNREACHABLE (${err.message}).`);
  console.warn(`[postbuild] Falling back to ${posts.length} cached post(s) from scripts/crm-posts.cache.json.`);
  console.warn('[postbuild] Market Note pages will be as of the last successful build, not current.');
  console.warn('='.repeat(72));
}

// A note's featuredImage is set in the CRM and can point at a file this repo no
// longer ships (an image pulled for a visible tail number, say). A dead og:image
// means a blank social preview, so fall back to the default and say so in the log.
const missingImages = [];
const blockedImages = [];
function resolvePreviewImage(url) {
  if (!url || !url.startsWith(SITE_URL + '/')) return url || SITE_URL + DEFAULT_IMAGE;
  const local = path.join('public', url.slice(SITE_URL.length + 1));
  if (fs.existsSync(local)) return url;
  missingImages.push(url.slice(SITE_URL.length));
  return SITE_URL + DEFAULT_IMAGE;
}

for (const post of posts) {
  if (!post.slug) continue;
  if (post.featuredImage && !isAllowedImage(post.featuredImage)) {
    blockedImages.push(`${post.slug}: ${post.featuredImage}`);
  }
  const a = articleMeta(post);
  a.image = resolvePreviewImage(a.image);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: a.description,
    image: a.image,
    datePublished: a.publishedAt,
    author: { '@type': 'Person', name: a.authorName },
    publisher: {
      '@type': 'Organization', name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/PennJets-Website-Logo.png` },
    },
    mainEntityOfPage: a.url,
  };
  const meta = {
    ...a,
    extra: [
      `<meta data-rh="true" property="article:published_time" content="${esc(a.publishedAt)}">`,
      `<meta data-rh="true" property="article:author" content="${esc(a.authorName)}">`,
      `<script data-rh="true" type="application/ld+json">${JSON.stringify(jsonLd).replace(/<\//g, '<\\/')}</script>`,
    ].join('\n    '),
  };
  const noscript = `<noscript><article><h1>${esc(post.title)}</h1><p>${esc(a.description)}</p><p><a href="${esc(a.url)}">${esc(a.url)}</a></p></article></noscript>`;
  writeFile(`blog/${post.slug}.html`, renderShell(meta, noscript));
  written.push(`blog/${post.slug}.html`);
}

// ---- sitemap ---------------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const urls = [
  ...STATIC_ROUTES.map((r) => ({ loc: canonicalFor(r), lastmod: today, priority: r === '/' ? '1.0' : r.startsWith('/blog') ? '0.8' : '0.7' })),
  ...posts.filter((p) => p.slug).map((p) => ({ loc: `${SITE_URL}/blog/${p.slug}`, lastmod: String(p.updatedAt || p.publishedAt || today).slice(0, 10), priority: '0.8' })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((u) => `  <url><loc>${esc(u.loc)}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`)
  .join('\n')}\n</urlset>\n`;
writeFile('sitemap.xml', sitemap);

console.log(`[postbuild] wrote ${written.length} HTML files (${posts.length} Market Notes${usingCache ? ', FROM CACHE' : ''}) and sitemap.xml with ${urls.length} URLs`);
if (blockedImages.length) {
  console.warn(`[postbuild] ${blockedImages.length} note image(s) hotlinked from another site and were not used:`);
  for (const u of blockedImages) console.warn(`  ${u}`);
}
if (missingImages.length) {
  console.warn(`[postbuild] ${missingImages.length} note image(s) not in this repo; social preview fell back to the default:`);
  for (const u of [...new Set(missingImages)]) console.warn(`  ${u}`);
}
