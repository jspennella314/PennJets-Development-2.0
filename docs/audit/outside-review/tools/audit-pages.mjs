// Mobile-first audit of the deployed pennjets.com build served locally.
import { chromium } from 'playwright';
import fs from 'node:fs'; import path from 'node:path';
const S = process.env.S; const OUT = path.join(S,'shots'); const DATA = path.join(S,'audit-data.json');
const BASE = 'https://www.pennjets.com';
const ROUTES = ['/', '/charter', '/buy', '/sell', '/consulting', '/pennshare', '/services', '/about', '/contact', '/blog', '/aircraft', '/gallery', '/privacy-policy', '/terms-of-service', '/cookie-policy', '/compliance', '/this-page-does-not-exist',
  '/blog/617-aircraft-21-for-sale-inside-the-g550-market', '/blog/jet-a-at-a-six-month-high-what-it-actually-costs', '/blog/how-to-buy-your-first-private-jet-2025-step-by-step-buyers-guide', '/blog/why-we-publish-market-notes'];
const VIEWPORTS = [
  { name: '390', width: 390, height: 844, mobile: true, dsf: 3 },
  { name: '430', width: 430, height: 932, mobile: true, dsf: 3 },
  { name: 'desktop', width: 1366, height: 900, mobile: false, dsf: 1 },
];
const CTA_RE = /quote|talk to a broker|contact|send|request|tell us|inquire|call|subscribe|discuss|schedule|get started|book/i;
const results = [];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--host-resolver-rules=MAP www.pennjets.com 127.0.0.1, MAP pennjets.com 127.0.0.1, MAP www.pennforce.pennjets.com 127.0.0.1', '--ignore-certificate-errors', '--autoplay-policy=no-user-gesture-required','--no-proxy-server'] });
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dsf, isMobile: vp.mobile, hasTouch: vp.mobile, ignoreHTTPSErrors: true, userAgent: vp.mobile ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const transfers = []; const consoleErrs = []; const failed = [];
    page.on('response', async (r) => { try { const h = r.headers(); const len = Number(h['content-length'] || 0); transfers.push({ url: r.url(), status: r.status(), type: h['content-type'] || '', bytes: len }); } catch {} });
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') consoleErrs.push(m.type() + ': ' + m.text().slice(0, 200)); });
    page.on('requestfailed', (r) => failed.push(r.url() + ' ' + (r.failure()?.errorText || '')));
    const t0 = Date.now();
    let status = null;
    try { const resp = await page.goto(BASE + route, { waitUntil: 'load', timeout: 60000 }); status = resp?.status(); await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(1200); } catch (e) { consoleErrs.push('goto: ' + e.message); }
    const slug = (route === '/' ? 'home' : route.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-')).slice(0, 60);
    const base = `${slug}--${vp.name}`;
    await page.screenshot({ path: path.join(OUT, base + '-fold.png') }).catch((e)=>consoleErrs.push('shot: '+e.message.slice(0,80)));
    await page.screenshot({ path: path.join(OUT, base + '-full.png'), fullPage: true }).catch(() => {});
    const m = await page.evaluate(({ ctaSrc, vpH }) => {
      const CTA = new RegExp(ctaSrc, 'i');
      const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const abs = (el) => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, left: r.left + scrollX, w: r.width, h: r.height }; };
      const fixed = [...document.querySelectorAll('body *')].filter((el) => { const cs = getComputedStyle(el); return (cs.position === 'fixed' || cs.position === 'sticky') && vis(el); }).map((el) => ({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 60), ...(() => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), w: Math.round(r.width) }; })(), z: getComputedStyle(el).zIndex }));
      const topOverlay = fixed.filter((f) => f.top <= 2 && f.h < 300).reduce((a, f) => Math.max(a, f.bottom), 0);
      const bottomOverlay = fixed.filter((f) => f.bottom >= innerHeight - 2 && f.h < 200).reduce((a, f) => Math.max(a, innerHeight - f.top), 0);
      const interactive = [...document.querySelectorAll('a,button,input,select,textarea,[role=button]')].filter(vis);
      const small = interactive.map((el) => { const r = el.getBoundingClientRect(); return { tag: el.tagName, text: (el.innerText || el.getAttribute('aria-label') || el.value || el.placeholder || '').trim().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top + scrollY) }; }).filter((t) => t.h < 44 || t.w < 44);
      // text under 16px: visible text nodes
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const smallText = new Map(); let n;
      while ((n = walker.nextNode())) { const t = n.textContent.trim(); if (!t) continue; const el = n.parentElement; if (!el || !vis(el)) continue; const fs = parseFloat(getComputedStyle(el).fontSize); if (fs < 16) { const k = fs + 'px'; const e = smallText.get(k) || { px: fs, count: 0, samples: [] }; e.count++; if (e.samples.length < 4) e.samples.push(t.slice(0, 50)); smallText.set(k, e); } }
      const inFixed = (el) => { for (let e = el; e; e = e.parentElement) { const ps = getComputedStyle(e).position; if (ps === 'fixed' || ps === 'sticky') return true; } return false; };
      const ctas = interactive.filter((el) => CTA.test((el.innerText || el.getAttribute('aria-label') || el.value || '').trim())).map((el) => ({ text: (el.innerText || el.getAttribute('aria-label') || el.value).trim().slice(0, 40), ...abs(el), href: el.getAttribute('href') || null, tag: el.tagName, fixed: inFixed(el) }));
      const firstBodyCta = ctas.filter((c) => !c.fixed && c.top > topOverlay + 4 && !/^call$/i.test(c.text)).sort((a, b) => a.top - b.top)[0] || null;
      const h1 = document.querySelector('h1'); const h1r = h1 ? abs(h1) : null;
      const docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      const overflowEls = [...document.querySelectorAll('body *')].filter((el) => { const r = el.getBoundingClientRect(); return vis(el) && (r.right > innerWidth + 1 || r.left < -1) && getComputedStyle(el).position !== 'fixed'; }).slice(0, 8).map((el) => ({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 50), right: Math.round(el.getBoundingClientRect().right) }));
      const imgs = [...document.querySelectorAll('img')].map((im) => ({ src: im.currentSrc || im.src, alt: im.alt, nat: im.naturalWidth + 'x' + im.naturalHeight, rendered: Math.round(im.getBoundingClientRect().width) + 'x' + Math.round(im.getBoundingClientRect().height), broken: im.complete && im.naturalWidth === 0, visible: vis(im), loading: im.loading }));
      const links = [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.getAttribute('href'), text: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 40), target: a.target, ext: /^https?:/.test(a.getAttribute('href')) && !a.getAttribute('href').includes('pennjets.com') }));
      const forms = [...document.querySelectorAll('form')].map((f) => ({ id: f.id, fields: [...f.querySelectorAll('input,select,textarea')].filter(vis).map((i) => ({ type: i.type, name: i.name, required: i.required, labelled: !!(i.labels && i.labels.length) || !!i.getAttribute('aria-label') || !!i.id && !!document.querySelector(`label[for="${i.id}"]`), autocomplete: i.autocomplete, placeholder: i.placeholder, h: Math.round(i.getBoundingClientRect().height), fontSize: getComputedStyle(i).fontSize, top: Math.round(i.getBoundingClientRect().top + scrollY) })), submit: (f.querySelector('button[type=submit],button:not([type])')?.innerText || '').trim(), submitTop: Math.round((f.querySelector('button[type=submit],button:not([type])')?.getBoundingClientRect().top || 0) + scrollY) }));
      const headings = [...document.querySelectorAll('h1,h2,h3')].filter(vis).map((h) => h.tagName + ': ' + h.innerText.trim().slice(0, 70));
      const foldText = [...document.querySelectorAll('h1,h2,p,a,button')].filter((el) => vis(el) && el.getBoundingClientRect().top < innerHeight && el.getBoundingClientRect().bottom > topOverlay).map((el) => el.tagName + ': ' + el.innerText.trim().replace(/\s+/g, ' ').slice(0, 90)).slice(0, 25);
      const scrollTraps = [...document.querySelectorAll('body *')].filter((el) => { const cs = getComputedStyle(el); return vis(el) && /(auto|scroll)/.test(cs.overflowX + cs.overflowY) && (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2); }).slice(0, 6).map((el) => ({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 50), sw: el.scrollWidth, cw: el.clientWidth, sh: el.scrollHeight, ch: el.clientHeight }));
      const video = document.querySelector('video'); const vidInfo = video ? { src: video.currentSrc, paused: video.paused, readyState: video.readyState, poster: video.poster } : null;
      return { title: document.title, canonical: document.querySelector('link[rel=canonical]')?.href, metaDesc: document.querySelector('meta[name=description]')?.content, ogImage: document.querySelector('meta[property="og:image"]')?.content, viewportMeta: document.querySelector('meta[name=viewport]')?.content, fixed, topOverlay, bottomOverlay, small, smallText: [...smallText.values()].sort((a, b) => a.px - b.px), ctas: ctas.slice(0, 30), firstBodyCta, h1: h1 ? h1.innerText.trim() : null, h1r, docH, overflowEls, scrollW: document.documentElement.scrollWidth, innerW: innerWidth, innerH: innerHeight, imgs, links, forms, headings, foldText, vidInfo, scrollTraps, bodyFont: getComputedStyle(document.body).fontSize, htmlLang: document.documentElement.lang };
    }, { ctaSrc: CTA_RE.source, vpH: vp.height });
    const bytes = transfers.reduce((a, t) => a + t.bytes, 0);
    const top = [...transfers].sort((a, b) => b.bytes - a.bytes).slice(0, 10).map((t) => ({ url: t.url.replace(BASE, ''), kb: Math.round(t.bytes / 1024), status: t.status }));
    results.push({ route, vp: vp.name, status, loadMs: Date.now() - t0, bytesKB: Math.round(bytes / 1024), topTransfers: top, requests: transfers.length, consoleErrs: [...new Set(consoleErrs)].slice(0, 12), failed: [...new Set(failed)].slice(0, 12), screenshots: { fold: base + '-fold.png', full: base + '-full.png' }, ...m });
    console.log(vp.name, route, status, (consoleErrs[0]||'').slice(0,100), Math.round(bytes / 1024) + 'KB', 'docH', m.docH, 'firstCTA', m.firstBodyCta?.top, 'small', m.small.length, 'overflow', m.scrollW > m.innerW);
    await page.close();
  }
  await ctx.close();
}
fs.writeFileSync(DATA, JSON.stringify(results, null, 1));
// Keyboard pass: Android-style layout viewport shrink (390x508 = 844 minus a 336px keyboard). Focus each field; is it fully visible between the fixed header and the sticky bar?
const kb = await browser.newContext({ viewport: { width: 390, height: 508 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, ignoreHTTPSErrors: true });
const keyboard = [];
for (const route of ['/contact', '/charter', '/buy', '/sell', '/consulting', '/pennshare', '/blog/617-aircraft-21-for-sale-inside-the-g550-market', '/blog']) {
  const page = await kb.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(800);
  const fields = await page.locator('form input:not([type=hidden]):not([name=website]):not([type=radio]):not([type=checkbox]), form select, form textarea').elementHandles();
  const rows = [];
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    const ok = await f.isVisible().catch(() => false); if (!ok) continue;
    await f.scrollIntoViewIfNeeded().catch(() => {});
    await f.focus().catch(() => {});
    await page.waitForTimeout(250);
    const r = await page.evaluate((el) => { const vis = (e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(e).visibility !== 'hidden'; }; const fixed = [...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).position === 'fixed' && vis(e)); const top = fixed.filter((e) => e.getBoundingClientRect().top <= 2).reduce((a, e) => Math.max(a, e.getBoundingClientRect().bottom), 0); const bot = fixed.filter((e) => e.getBoundingClientRect().bottom >= innerHeight - 2 && e.getBoundingClientRect().height < 200 && e.getAttribute('aria-hidden') !== 'true').reduce((a, e) => Math.max(a, innerHeight - e.getBoundingClientRect().top), 0); const b = el.getBoundingClientRect(); const label = (el.labels && el.labels[0] && el.labels[0].innerText.trim().slice(0, 30)) || el.placeholder || el.name || el.type; return { label, top: Math.round(b.top), bottom: Math.round(b.bottom), headerBottom: Math.round(top), barTop: Math.round(innerHeight - bot), innerH: innerHeight, hiddenByHeader: b.top < top, hiddenByBar: b.bottom > innerHeight - bot, stickyBarShown: bot > 0 }; }, f);
    rows.push(r);
  }
  await page.screenshot({ path: path.join(OUT, `keyboard-${(route === '/blog' ? 'blog' : route.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-')).slice(0, 40)}--390.png`) }).catch(() => {});
  keyboard.push({ route, rows });
  console.log('keyboard', route, rows.filter((r) => r.hiddenByHeader || r.hiddenByBar).length + '/' + rows.length, 'fields obscured');
  await page.close();
}
await kb.close();
fs.writeFileSync(DATA, JSON.stringify([...results, { route: '__keyboard', keyboard }], null, 1));
// Mobile menu pass at 390.
const mm = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, ignoreHTTPSErrors: true });
const menu = [];
for (const route of ['/', '/blog/617-aircraft-21-for-sale-inside-the-g550-market']) {
  const page = await mm.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(800);
  const btn = page.locator('header button:visible').first();
  const br = await btn.boundingBox();
  const aria = await btn.getAttribute('aria-label');
  await btn.click(); await page.waitForTimeout(400);
  const items = await page.evaluate(() => [...document.querySelectorAll('header nav a')].filter((a) => a.getBoundingClientRect().height > 0).map((a) => { const r = a.getBoundingClientRect(); return { text: a.innerText.trim().slice(0, 30), h: Math.round(r.height), w: Math.round(r.width), bottom: Math.round(r.bottom) }; }));
  await page.screenshot({ path: path.join(OUT, `menu-open-${route === '/' ? 'home' : 'note'}--390.png`) });
  menu.push({ route, button: { ...br, ariaLabel: aria }, items, innerH: 844 });
  console.log('menu', route, items.length, 'items, button', br?.width + 'x' + br?.height, 'aria-label:', aria);
  await page.close();
}
await mm.close();
await browser.close();
results.push({ route: '__keyboard', keyboard }, { route: '__menu', menu });
fs.writeFileSync(DATA, JSON.stringify(results, null, 1));
console.log('wrote', DATA);
