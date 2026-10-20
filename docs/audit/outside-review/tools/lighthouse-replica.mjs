import lighthouse from 'lighthouse';
import { chromium } from 'playwright';
import fs from 'node:fs'; import path from 'node:path';
const S = process.env.S; const OUT = path.join(S, 'lh');
const ROUTES = ['/', '/charter', '/buy', '/sell', '/consulting', '/pennshare', '/services', '/about', '/contact', '/blog', '/aircraft', '/blog/617-aircraft-21-for-sale-inside-the-g550-market', '/blog/jet-a-at-a-six-month-high-what-it-actually-costs', '/blog/how-to-buy-your-first-private-jet-2025-step-by-step-buyers-guide'];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--remote-debugging-port=9222', '--host-resolver-rules=MAP www.pennjets.com 127.0.0.1, MAP pennjets.com 127.0.0.1, MAP www.pennforce.pennjets.com 127.0.0.1', '--ignore-certificate-errors', '--no-proxy-server', '--no-sandbox'] });
const summary = [];
for (const r of ROUTES) {
  const name = r === '/' ? 'home' : r.replace(/^\//, '').replace(/[^a-z0-9]/gi, '-');
  try {
    const res = await lighthouse('https://www.pennjets.com' + r, { port: 9222, output: ['json', 'html'], logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
    const lhr = res.lhr; const a = lhr.audits; const c = lhr.categories;
    fs.writeFileSync(path.join(OUT, name + '.report.json'), res.report[0]); fs.writeFileSync(path.join(OUT, name + '.report.html'), res.report[1]);
    const sc = (k) => c[k]?.score == null ? null : Math.round(c[k].score * 100);
    const row = { route: r, perf: sc('performance'), a11y: sc('accessibility'), bp: sc('best-practices'), seo: sc('seo'), fcp: a['first-contentful-paint']?.displayValue, lcp: a['largest-contentful-paint']?.displayValue, tbt: a['total-blocking-time']?.displayValue, cls: a['cumulative-layout-shift']?.displayValue, si: a['speed-index']?.displayValue, bytes: a['total-byte-weight']?.displayValue, lcpEl: a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet?.slice(0, 120), failing: Object.values(a).filter((x) => x.score !== null && x.score < 0.5 && x.scoreDisplayMode === 'binary').map((x) => x.id).slice(0, 15), runtimeError: lhr.runtimeError?.code };
    summary.push(row); console.log(JSON.stringify(row));
  } catch (e) { console.log(r, 'ERR', e.message.slice(0, 200)); summary.push({ route: r, error: e.message.slice(0, 200) }); }
}
await browser.close();
fs.writeFileSync(path.join(S, 'lh-summary.json'), JSON.stringify(summary, null, 1)); console.log('ALLDONE');
