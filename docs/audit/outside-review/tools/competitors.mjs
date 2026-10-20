// Competitor sweep. Needs outbound network access to the competitor hosts
// (this session's cloud environment denied every one of them; run it from a
// machine or environment that can reach them).
//
//   cd docs/audit/outside-review/tools && npm init -y && npm i playwright lighthouse
//   npx playwright install chromium   (or set CHROME_PATH / executablePath)
//   S=./out node competitors.mjs
//
// For each site, at 390x844 (iPhone 14 class) then 1366x900: fold and full
// screenshots, transfer weight, request count, the first inquiry-type CTA and
// how many taps it is from the first screen, fixed-header height, touch
// targets under 44px, text under 16px, nav pattern, presence of an inventory
// section and a charter quote form, and a Lighthouse mobile run.
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import fs from 'node:fs'; import path from 'node:path';
const S = process.env.S || './out'; fs.mkdirSync(path.join(S, 'shots'), { recursive: true });
const SITES = {
  'clara-aviation': 'https://www.claraaviation.com/', 'jetcraft': 'https://www.jetcraft.com/', 'amalfi-jets': 'https://amalfijets.com/',
  'guardian-jet': 'https://guardianjet.com/', 'avpro': 'https://www.avprojets.com/', 'mesinger': 'https://www.jetsales.com/',
  'global-jet-capital': 'https://www.globaljetcapital.com/', 'magellan-jets': 'https://magellanjets.com/', 'paramount-business-jets': 'https://www.paramountbusinessjets.com/',
  'mercury-jets': 'https://mercuryjets.com/', 'l33-jets': 'https://l33jets.com/', 'jettly': 'https://jettly.com/',
  'pennjets': 'https://www.pennjets.com/',
};
const CTA = /quote|inquir|enquir|contact|request|get started|book|call|pricing|talk to|speak/i;
const browser = await chromium.launch({ args: ['--remote-debugging-port=9222'] });
const out = [];
for (const [name, url] of Object.entries(SITES)) {
  for (const vp of [{ n: '390', w: 390, h: 844, m: true }, { n: 'desktop', w: 1366, h: 900, m: false }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.m, hasTouch: vp.m, deviceScaleFactor: vp.m ? 2 : 1 });
    const page = await ctx.newPage(); let bytes = 0, reqs = 0;
    page.on('response', (r) => { reqs++; bytes += Number(r.headers()['content-length'] || 0); });
    const t0 = Date.now();
    try { await page.goto(url, { waitUntil: 'load', timeout: 60000 }); await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}); } catch (e) { out.push({ name, vp: vp.n, error: e.message }); await ctx.close(); continue; }
    await page.waitForTimeout(1500);
    const base = `${name}--${vp.n}`;
    await page.screenshot({ path: path.join(S, 'shots', base + '-fold.png') }).catch(() => {});
    await page.screenshot({ path: path.join(S, 'shots', base + '-full.png'), fullPage: true }).catch(() => {});
    const m = await page.evaluate((ctaSrc) => {
      const CTA = new RegExp(ctaSrc, 'i');
      const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden'; };
      const inter = [...document.querySelectorAll('a,button,input,select,[role=button]')].filter(vis);
      const fixedTop = [...document.querySelectorAll('body *')].filter((el) => { const cs = getComputedStyle(el); return (cs.position === 'fixed' || cs.position === 'sticky') && vis(el) && el.getBoundingClientRect().top <= 2; }).reduce((a, el) => Math.max(a, el.getBoundingClientRect().bottom), 0);
      const ctas = inter.filter((el) => CTA.test(el.innerText || el.getAttribute('aria-label') || el.value || '')).map((el) => ({ text: (el.innerText || el.getAttribute('aria-label') || el.value).trim().slice(0, 40), top: Math.round(el.getBoundingClientRect().top + scrollY), href: el.getAttribute('href'), inFold: el.getBoundingClientRect().top < innerHeight && el.getBoundingClientRect().top >= 0 }));
      const small = inter.filter((el) => { const r = el.getBoundingClientRect(); return r.height < 44 || r.width < 44; }).length;
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n, smallText = 0, allText = 0;
      while ((n = walker.nextNode())) { if (!n.textContent.trim()) continue; const el = n.parentElement; if (!el || !vis(el)) continue; allText++; if (parseFloat(getComputedStyle(el).fontSize) < 16) smallText++; }
      const text = document.body.innerText.toLowerCase();
      return { title: document.title, h1: document.querySelector('h1')?.innerText.trim().slice(0, 120), fixedTop: Math.round(fixedTop), docH: document.documentElement.scrollHeight, ctasInFold: ctas.filter((c) => c.inFold).slice(0, 6), firstCta: ctas.sort((a, b) => a.top - b.top)[0] || null, small, smallText, allText, overflow: document.documentElement.scrollWidth > innerWidth, hasHamburger: !!document.querySelector('button[aria-label*="menu" i], button[aria-label*="navigation" i], .hamburger, [class*="burger"], [class*="menu-toggle"]'), navLinks: [...document.querySelectorAll('nav a, header a')].filter(vis).length, telLinks: document.querySelectorAll('a[href^="tel:"]').length, forms: document.querySelectorAll('form').length, inputs: document.querySelectorAll('form input:not([type=hidden])').length, mentions: { inventory: /for sale|inventory|listings/.test(text), charterQuote: /charter/.test(text) && /quote/.test(text), argus: /argus/.test(text), wyvern: /wyvern/.test(text), iada: /iada/.test(text), blog: /blog|insights|market (report|update|brief|notes)|news/.test(text), app: /app store|google play|download the app/.test(text) }, foldText: [...document.querySelectorAll('h1,h2,p,a,button')].filter((el) => vis(el) && el.getBoundingClientRect().top < innerHeight && el.getBoundingClientRect().bottom > fixedTop).map((el) => el.tagName + ': ' + el.innerText.trim().replace(/\s+/g, ' ').slice(0, 80)).slice(0, 15) };
    }, CTA.source);
    out.push({ name, url, vp: vp.n, ms: Date.now() - t0, kb: Math.round(bytes / 1024), reqs, ...m });
    console.log(name, vp.n, Math.round(bytes / 1024) + 'KB', reqs, 'req', 'fixedTop', m.fixedTop, 'firstCTA', m.firstCta?.text, '@', m.firstCta?.top);
    await ctx.close();
  }
  try {
    const res = await lighthouse(url, { port: 9222, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
    const c = res.lhr.categories, a = res.lhr.audits; const sc = (k) => Math.round((c[k]?.score ?? 0) * 100);
    out.push({ name, url, vp: 'lighthouse-mobile', perf: sc('performance'), a11y: sc('accessibility'), bp: sc('best-practices'), seo: sc('seo'), lcp: a['largest-contentful-paint']?.displayValue, tbt: a['total-blocking-time']?.displayValue, cls: a['cumulative-layout-shift']?.displayValue, bytes: a['total-byte-weight']?.displayValue });
    fs.writeFileSync(path.join(S, name + '.lighthouse.json'), res.report);
  } catch (e) { out.push({ name, vp: 'lighthouse-mobile', error: e.message.slice(0, 200) }); }
}
await browser.close();
fs.writeFileSync(path.join(S, 'competitors.json'), JSON.stringify(out, null, 1)); console.log('done');
