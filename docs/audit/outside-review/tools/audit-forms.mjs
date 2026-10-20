// Submit every form once at 390px with the name "REVIEW TEST (delete)". Posts land on the local stub, never the CRM.
import { chromium } from 'playwright'; import fs from 'node:fs'; import path from 'node:path';
const S = process.env.S; const OUT = path.join(S, 'shots'); const BASE = 'https://www.pennjets.com';
const NAME = 'REVIEW TEST (delete)', EMAIL = 'review-test-delete@example.com', PHONE = '(000) 000-0000';
const results = [];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--host-resolver-rules=MAP www.pennjets.com 127.0.0.1, MAP pennjets.com 127.0.0.1, MAP www.pennforce.pennjets.com 127.0.0.1', '--ignore-certificate-errors', '--no-proxy-server'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, ignoreHTTPSErrors: true });
async function run(label, route, steps) {
  const page = await ctx.newPage(); const posts = []; const errs = [];
  page.on('request', (r) => { if (r.method() === 'POST') posts.push({ url: r.url().replace(/incoming\/[^/]+$/, 'incoming/<webhook-id>'), body: r.postData() }); });
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  const t0 = Date.now();
  try {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(800);
    await steps(page);
    await page.waitForTimeout(1500);
    const msg = await page.evaluate(() => [...document.querySelectorAll('[role=status],[role=alert]')].map((e) => e.innerText.trim()).filter(Boolean).join(' | '));
    await page.screenshot({ path: path.join(OUT, `form-${label}--390-after.png`) });
    results.push({ label, route, ms: Date.now() - t0, posts, message: msg, errs: [...new Set(errs)].slice(0, 5) });
    console.log(label, '|', msg, '|', posts.length, 'POST(s)');
  } catch (e) { results.push({ label, route, error: e.message.slice(0, 300), posts, errs }); console.log(label, 'ERROR', e.message.slice(0, 200)); }
  await page.close();
}
const fill = async (page, sel, v) => { await page.locator(sel).first().scrollIntoViewIfNeeded(); await page.locator(sel).first().fill(v); };
await run('contact', '/contact', async (p) => {
  await fill(p, 'form input[type=text]', NAME); await fill(p, 'form input[type=email]', EMAIL);
  await p.locator('form button:has-text("Add phone")').click().catch(() => {});
  await fill(p, 'form input[type=tel]', PHONE).catch(() => {});
  await p.locator('form select').selectOption('charter-brokerage');
  await fill(p, 'form textarea', 'REVIEW TEST (delete). Outside review test submission, please delete.');
  await p.screenshot({ path: path.join(OUT, 'form-contact--390-filled.png'), fullPage: true });
  await p.locator('form button[type=submit]').click();
});
await run('charter', '/charter', async (p) => {
  await fill(p, '#quote input[placeholder*="TEB"]', 'TEB / Teterboro'); await fill(p, '#quote input[placeholder*="PBI"]', 'PBI / Palm Beach');
  await p.locator('#quote input[type=date]').first().fill('2026-12-15'); await p.locator('#quote input[type=number]').fill('4');
  await p.screenshot({ path: path.join(OUT, 'form-charter--390-step1.png') });
  await p.locator('#quote button:has-text("Continue")').click(); await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(OUT, 'form-charter--390-step2.png') });
  await fill(p, '#quote input[autocomplete=name]', NAME); await fill(p, '#quote input[type=email]', EMAIL); await fill(p, '#quote input[type=tel]', PHONE);
  await fill(p, '#quote textarea', 'REVIEW TEST (delete)');
  await p.locator('#quote button[type=submit]').click();
});
await run('buy', '/buy', async (p) => {
  await fill(p, 'form input[autocomplete=name]', NAME); await fill(p, 'form input[type=email]', EMAIL);
  await p.locator('form input[type=radio]').first().check().catch(() => {});
  await fill(p, 'form input[placeholder*="Hawker"]', 'REVIEW TEST (delete)');
  await p.locator('form select').first().selectOption({ index: 1 }).catch(() => {});
  await p.locator('form button:has-text("Add")').click().catch(() => {});
  await fill(p, 'form input[type=tel]', PHONE).catch(() => {});
  await p.screenshot({ path: path.join(OUT, 'form-buy--390-filled.png'), fullPage: true });
  await p.locator('form button[type=submit]').click();
});
await run('sell', '/sell', async (p) => {
  await fill(p, 'form input[autocomplete=name]', NAME); await fill(p, 'form input[type=email]', EMAIL);
  await fill(p, 'form input[placeholder="Beechcraft"]', 'REVIEW TEST'); await fill(p, 'form input[placeholder="Premier 1A"]', '(delete)');
  await p.locator('form button:has-text("Add")').click().catch(() => {});
  await fill(p, 'form input[type=tel]', PHONE).catch(() => {});
  await p.locator('form button[type=submit]').click();
});
await run('consulting', '/consulting', async (p) => {
  await fill(p, 'form input[autocomplete=name]', NAME); await fill(p, 'form input[type=email]', EMAIL); await fill(p, 'form input[type=tel]', PHONE);
  await fill(p, 'form textarea', 'REVIEW TEST (delete)');
  await p.locator('form button[type=submit]').click();
});
await run('pennshare', '/pennshare', async (p) => {
  await fill(p, 'form input[name=name], form input[placeholder="Your full name"]', NAME); await fill(p, 'form input[type=email]', EMAIL);
  await p.locator('form button:has-text("Add")').click().catch(() => {});
  await fill(p, 'form input[type=tel]', PHONE).catch(() => {});
  await p.locator('form select').first().selectOption({ index: 1 }).catch(() => {});
  await fill(p, 'form textarea', 'REVIEW TEST (delete)');
  await p.locator('form input[type=checkbox]').check().catch(() => {});
  await p.screenshot({ path: path.join(OUT, 'form-pennshare--390-filled.png'), fullPage: true });
  await p.locator('form button[type=submit]').click();
});
await run('note-talk-to-a-broker', '/blog/617-aircraft-21-for-sale-inside-the-g550-market', async (p) => {
  await fill(p, '#talk-to-a-broker input[type=text]', NAME); await fill(p, '#talk-to-a-broker input[type=email]', EMAIL); await fill(p, '#talk-to-a-broker input[type=tel]', PHONE);
  await fill(p, '#talk-to-a-broker textarea', 'REVIEW TEST (delete)');
  await p.screenshot({ path: path.join(OUT, 'form-note-broker--390-filled.png') });
  await p.locator('#talk-to-a-broker button[type=submit]').click();
});
await run('note-newsletter', '/blog/617-aircraft-21-for-sale-inside-the-g550-market', async (p) => {
  await fill(p, '#newsletter-email', EMAIL); await p.locator('#newsletter-email').press('Enter');
});
await run('index-newsletter', '/blog', async (p) => {
  await fill(p, 'form input[type=email]', EMAIL); await p.locator('form button[type=submit]').last().click();
});
await browser.close();
fs.writeFileSync(path.join(S, 'forms-data.json'), JSON.stringify(results, null, 1)); console.log('done');
