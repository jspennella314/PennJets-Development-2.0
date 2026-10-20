// Supplementary read-only pass at 390x844 for the matrix: each fixed/sticky
// layer at load (so a header can be told apart from a consent overlay), and
// the first inquiry-type links/buttons in document order with their targets.
// No clicks, no form input.
import { chromium } from 'playwright';
import fs from 'node:fs';
const SITES = {
  'clara-aviation': 'https://www.claraaviation.com/', 'jetcraft': 'https://www.jetcraft.com/', 'amalfi-jets': 'https://amalfijets.com/',
  'guardian-jet': 'https://guardianjet.com/', 'avpro': 'https://www.avprojets.com/', 'mesinger': 'https://www.jetsales.com/',
  'global-jet-capital': 'https://www.globaljetcapital.com/', 'magellan-jets': 'https://magellanjets.com/', 'paramount-business-jets': 'https://www.paramountbusinessjets.com/',
  'mercury-jets': 'https://mercuryjets.com/', 'pennjets': 'https://www.pennjets.com/',
};
const CTA = /quote|inquir|enquir|contact|request|get started|book|call|talk to|speak/i;
const browser = await chromium.launch();
const out = {};
for (const [name, url] of Object.entries(SITES)) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  try { await page.goto(url, { waitUntil: 'load', timeout: 60000 }); await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}); }
  catch (e) { out[name] = { error: e.message.slice(0, 120) }; await ctx.close(); continue; }
  await page.waitForTimeout(2000);
  out[name] = await page.evaluate((src) => {
    const re = new RegExp(src, 'i');
    const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0; };
    const fixed = [...document.querySelectorAll('body *')].filter((el) => { const cs = getComputedStyle(el); return (cs.position === 'fixed' || cs.position === 'sticky') && vis(el); })
      .filter((el) => !el.parentElement.closest('*') || ![...document.querySelectorAll('body *')].some(() => false))
      .map((el) => { const r = el.getBoundingClientRect(); return { pos: getComputedStyle(el).position, top: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width), tag: el.tagName, id: el.id, cls: String(el.className).slice(0, 50), text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60) }; })
      .filter((f) => f.top < 844 && f.top + f.h > 0);
    // keep outermost fixed layers only
    const els = [...document.querySelectorAll('body *')].filter((el) => { const cs = getComputedStyle(el); return (cs.position === 'fixed' || cs.position === 'sticky') && vis(el); });
    const outer = els.filter((el) => !els.some((o) => o !== el && o.contains(el))).map((el) => { const r = el.getBoundingClientRect(); return { pos: getComputedStyle(el).position, top: Math.round(r.top), bottom: Math.round(r.bottom), w: Math.round(r.width), tag: el.tagName, id: el.id, cls: String(el.className).slice(0, 40), text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70) }; }).filter((f) => f.top < 844 && f.bottom > 0);
    const ctas = [...document.querySelectorAll('a,button,[role=button],input[type=submit]')].filter(vis)
      .map((el) => ({ text: (el.innerText || el.getAttribute('aria-label') || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 40), href: el.getAttribute('href'), top: Math.round(el.getBoundingClientRect().top + scrollY), h: Math.round(el.getBoundingClientRect().height), w: Math.round(el.getBoundingClientRect().width) }))
      .filter((c) => re.test(c.text)).sort((a, b) => a.top - b.top).slice(0, 8);
    const tel = [...document.querySelectorAll('a[href^="tel:"]')].filter(vis).map((a) => ({ top: Math.round(a.getBoundingClientRect().top + scrollY), text: a.innerText.trim().slice(0, 30) })).slice(0, 3);
    const formsInFold = [...document.querySelectorAll('form')].filter((f) => vis(f) && f.getBoundingClientRect().top < 844).map((f) => ({ top: Math.round(f.getBoundingClientRect().top), inputs: f.querySelectorAll('input:not([type=hidden]),select,textarea').length }));
    return { outer, ctas, tel, formsInFold };
  }, CTA.source);
  console.log(name, 'ok');
  await ctx.close();
}
await browser.close();
fs.writeFileSync('out/detail390.json', JSON.stringify(out, null, 1));
