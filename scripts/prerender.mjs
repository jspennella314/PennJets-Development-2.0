// Render every built route in a real browser and write the result back over
// the HTML that postbuild.mjs produced.
//
// Why a browser rather than react-dom/server: a Market Note's body arrives in
// a useEffect, which renderToString never runs, and NoteBody parses that body
// with DOMParser to promote pull quotes and sourced statistics. A browser has
// both. See docs/drafts/t4/wo-4.23-prerender-proposal.md. WO-4.23.
//
// This stage owns <body>. postbuild.mjs owns <head> (WO-4.7), and that is
// enforced by construction: the head written here is postbuild's, with only
// the tags a page adds that postbuild never wrote.

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';

const DIST = path.resolve('dist');
const PORT = Number(process.env.PRERENDER_PORT || 4318);

// One page at a time, deliberately.
//
// Rendering four pages at once in a shared browser context produced head tags
// belonging to a different route: a Market Note came back carrying the Market
// Notes index title and the default og card. Body text was correct on every
// page, so whatever crosses over is in the head only. The cause is not
// established, and a build step that is sometimes wrong is worse than one that
// is slow, so this renders serially: 35s rather than 15s for 25 routes.
// Raising it is a decision that needs the cause found first.
const CONCURRENCY = Number(process.env.PRERENDER_CONCURRENCY || 1);

// 404.html is the SPA deep-link shim. Its body is a redirect script, not a
// page, and overwriting it would break every deep link on the site.
const NEVER_PRERENDER = new Set(['404.html']);

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain',
};

// ---- the routes, taken from what postbuild actually wrote ------------------
function htmlFiles(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) htmlFiles(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function routeFor(file) {
  const rel = path.relative(DIST, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  return '/' + rel.replace(/\.html$/, '');
}

// The text a crawler reads out of the rendered app.
//
// <noscript> is stripped deliberately. The stub postbuild writes survives in
// the DOM through the render, so counting it meant a Market Note that had
// failed to load still "contained" its own headline, and the tombstone check
// below passed on a page reading "Note Not Found". Compare app content with
// app content.
function bodyText(html) {
  const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return (m ? m[1] : '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// The headline postbuild wrote into a Market Note's noscript stub, straight
// from the CRM. Static routes have no stub and return null, which means the
// headline check does not apply to them.
function headlineOf(html) {
  const m = html.match(/<noscript><article><h1>([\s\S]*?)<\/h1>/i);
  if (!m) return null;
  return m[1]
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// ---- heads -----------------------------------------------------------------
const headOf = (html) => (html.match(/<head[^>]*>([\s\S]*?)<\/head>/i) || ['', ''])[1];

// A tag's slot, so that postbuild's <meta name="x"/> and the DOM serializer's
// <meta name="x" data-rh="true"> are recognised as the same thing.
function slotOf(tag) {
  if (/^<title/i.test(tag)) return 'title';
  if (/^<meta/i.test(tag)) {
    const k = (tag.match(/(?:name|property|charset)="?([^"\s>/]+)/i) || [])[1];
    return k ? 'meta:' + k.toLowerCase() : null;
  }
  if (/^<link/i.test(tag)) {
    const rel = (tag.match(/rel="([^"]+)"/i) || [])[1];
    if (!rel) return null;
    const sizes = (tag.match(/sizes="([^"]*)"/i) || [])[1];
    return 'link:' + rel.toLowerCase() + (sizes ? ':' + sizes : '');
  }
  return null;
}

function headTagList(html) {
  const head = headOf(html);
  const tags = head.match(/<title[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*?\/?>|<link\b[^>]*?\/?>/gi) || [];
  return tags.map((t) => ({ tag: t, slot: slotOf(t) })).filter((t) => t.slot);
}

// postbuild's head wins every slot it filled. A page that adds a tag postbuild
// never wrote (a Market Note's author, say) keeps it.
//
// This is not tidiness. postbuild checks whether a note's featured image is a
// file this repository actually ships and falls back to the default og card
// when it is not (WO-4.16). The running app cannot check that, so it sets
// og:image to a path that 404s. Taking the rendered head wholesale would
// republish exactly the broken social previews that fallback exists to stop.
function mergeHead(builtHtml, renderedHtml) {
  const built = headTagList(builtHtml);
  const builtSlots = new Set(built.map((t) => t.slot));
  const added = headTagList(renderedHtml).filter((t) => !builtSlots.has(t.slot));
  const builtHead = headOf(builtHtml);
  const extra = added.length ? '\n    ' + added.map((t) => t.tag).join('\n    ') + '\n  ' : '';
  return {
    html: renderedHtml.replace(/<head[^>]*>[\s\S]*?<\/head>/i,
      (m) => m.replace(headOf(renderedHtml), builtHead + extra)),
    added: added.map((t) => t.slot),
  };
}

function duplicateSlots(html) {
  const seen = new Map();
  for (const { slot } of headTagList(html)) seen.set(slot, (seen.get(slot) || 0) + 1);
  return [...seen.entries()].filter(([, n]) => n > 1).map(([k, n]) => `${k} x${n}`);
}

function headRegressions(builtHtml, finalHtml) {
  const final = new Map(headTagList(finalHtml).map((t) => [t.slot, t.tag]));
  const lost = [];
  for (const { slot, tag } of headTagList(builtHtml)) {
    if (!final.has(slot)) lost.push(`${slot} disappeared`);
    else if (final.get(slot) !== tag) lost.push(`${slot} altered`);
  }
  return lost;
}

// ---- a static server that maps /charter to dist/charter.html ---------------
function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = path.join(DIST, url === '/' ? 'index.html' : url);
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      const asHtml = path.join(DIST, (url === '/' ? 'index' : url.replace(/^\//, '')) + '.html');
      file = fs.existsSync(asHtml) ? asHtml : path.join(DIST, '404.html');
    }
    if (!path.resolve(file).startsWith(DIST)) { res.writeHead(403).end(); return; }
    if (!fs.existsSync(file)) { res.writeHead(404).end('not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

// ---- rendering one route ---------------------------------------------------
async function renderRoute(browser, route) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const beaconAttempts = [];
  const consoleErrors = [];

  // The view beacon must never fire from a build. It is stopped here rather
  // than left to the CRM's CORS allow-list, which lives in another repository
  // and would admit build-time hits the moment a prerender ran from an allowed
  // origin. Otherwise every deploy adds one phantom view per note to the
  // numbers Joseph uses to decide what to write next.
  await page.route('**/api/public/blog/*/view', (r) => {
    beaconAttempts.push(r.request().url());
    return r.fulfill({ status: 204, body: '' });
  });

  page.on('console', (m) => {
    if (m.type() === 'error' || /hydrat/i.test(m.text())) consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));

  try {
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(300);
    const html = '<!DOCTYPE html>\n' + (await page.evaluate(() => document.documentElement.outerHTML)) + '\n';
    return { html, beaconAttempts, consoleErrors };
  } finally {
    await context.close();
  }
}

// ---- main ------------------------------------------------------------------
const started = Date.now();
const jobs = htmlFiles(DIST)
  .filter((f) => !NEVER_PRERENDER.has(path.relative(DIST, f).split(path.sep).join('/')))
  .map((file) => ({ file, route: routeFor(file) }))
  .sort((a, b) => a.route.localeCompare(b.route));

const server = await serve();

// A browser that will not start is infrastructure, not content. Failing here
// would take the whole deploy down over a download, which is what happened on
// 2026-09-21 when the workflow ran Node 18 against a playwright that needs 20.
// So this degrades instead: every route keeps the head postbuild.mjs wrote,
// which is exactly what the site served before WO-4.23, and the deploy
// proceeds. A content problem still fails the build further down; only a
// missing browser is survivable.
let browser;
try {
  browser = await chromium.launch();
} catch (err) {
  console.warn('='.repeat(72));
  console.warn('[prerender] CHROMIUM WOULD NOT START: ' + String(err.message).split('\n')[0]);
  console.warn('[prerender] Page bodies are NOT prerendered in this build.');
  console.warn('[prerender] The site is still correct and still deploys: every route keeps');
  console.warn('[prerender] the head postbuild.mjs wrote. Crawlers that do not run');
  console.warn('[prerender] JavaScript will see a title and no body text, as before WO-4.23.');
  console.warn('[prerender] Fix the browser install and rebuild to restore it.');
  console.warn('='.repeat(72));
  server.close();
  process.exit(0);
}

const results = [];
let cursor = 0;
async function worker() {
  for (;;) {
    const i = cursor++;
    if (i >= jobs.length) return;
    const { file, route } = jobs[i];
    const built = fs.readFileSync(file, 'utf8');
    try {
      const { html, beaconAttempts, consoleErrors } = await renderRoute(browser, route);

      const beforeText = bodyText(built);
      const afterText = bodyText(html);

      // Never trade content for less content. If the render came back thinner
      // than what postbuild wrote, something failed and the built page wins.
      if (afterText.length <= beforeText.length) {
        results.push({ route, skipped: true, beaconAttempts, consoleErrors,
          reason: `rendered body (${afterText.length}) not longer than built (${beforeText.length})` });
        continue;
      }

      // Length alone is not enough. With the CRM unreachable, every Market
      // Note rendered "Note Not Found. That Market Note doesn't exist or has
      // been removed." at 1,153 characters, which is longer than the stub it
      // would have replaced. Nine articles would have published as tombstones.
      //
      // postbuild wrote the real headline into the noscript stub from CRM
      // data. If the rendered page does not contain it, this is not that page.
      const expected = headlineOf(built);
      if (expected && !afterText.includes(expected)) {
        results.push({ route, skipped: true, beaconAttempts, consoleErrors,
          reason: `rendered page does not contain its headline "${expected}"` });
        continue;
      }

      const { html: merged, added } = mergeHead(built, html);

      // With a real body in #root, the noscript stub is a second copy of the
      // headline for anyone with scripting off. It was a stand-in for this.
      const out = merged.replace(/\s*<noscript><article>[\s\S]*?<\/article><\/noscript>/, '');

      const lostHead = headRegressions(built, out);
      const dupes = duplicateSlots(out);
      if (lostHead.length || dupes.length) {
        results.push({ route, skipped: true, lostHead, dupes, beaconAttempts, consoleErrors,
          reason: 'head check failed, nothing written' });
        continue;
      }

      fs.writeFileSync(file, out);
      results.push({ route, skipped: false, before: beforeText.length, after: afterText.length,
        added, beaconAttempts, consoleErrors, bytes: Buffer.byteLength(out), lostHead: [], dupes: [] });
    } catch (err) {
      results.push({ route, skipped: true, reason: err.message, beaconAttempts: [], consoleErrors: [] });
    }
  }
}
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, worker));

await browser.close();
server.close();

// ---- report ----------------------------------------------------------------
results.sort((a, b) => a.route.localeCompare(b.route));
const written = results.filter((r) => !r.skipped);
const skipped = results.filter((r) => r.skipped);
const grew = written.reduce((n, r) => n + (r.after - r.before), 0);
const beacons = results.flatMap((r) => r.beaconAttempts || []);
const errors = results.filter((r) => (r.consoleErrors || []).length);

console.log(`[prerender] ${written.length} of ${jobs.length} routes rendered in ` +
  `${((Date.now() - started) / 1000).toFixed(1)}s, ${grew.toLocaleString()} characters of body text added`);
for (const r of written) {
  const add = r.added.length ? `  +head ${r.added.join(' ')}` : '';
  console.log(`  ${r.route.padEnd(56)} ${String(r.before).padStart(5)} -> ${String(r.after).padStart(6)} chars${add}`);
}

if (beacons.length) {
  console.log(`[prerender] ${beacons.length} view beacon(s) intercepted; none reached the CRM.`);
}
if (errors.length) {
  console.warn('[prerender] console errors during render:');
  for (const r of errors) for (const e of r.consoleErrors) console.warn(`  ${r.route}: ${e}`);
}

let failed = false;
if (skipped.length) {
  console.error(`[prerender] FAILED: ${skipped.length} route(s) left as postbuild wrote them:`);
  for (const r of skipped) {
    console.error(`  ${r.route}: ${r.reason}`);
    for (const l of r.lostHead || []) console.error(`      head: ${l}`);
    for (const d of r.dupes || []) console.error(`      duplicate: ${d}`);
  }
  failed = true;
}

if (failed) process.exit(1);
