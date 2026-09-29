// NoteBody sanitisation test, in a real browser. WO-4.38.
//
//   node src/components/pages/Blog/NoteBody.browser-test.mjs
//
// The site has no unit-test runner, and this adds none. It uses what the
// build already has: Vite bundles a small harness around the real NoteBody,
// and the prerender's Playwright Chromium renders it. Two bundles are built:
// the component as shipped, and the same component with sanitizeNote.js
// swapped for an identity function, which is NoteBody as it was before this
// order. Comparing the two shows that the sanitiser changes nothing in a real
// body and removes everything executable from an attack.
//
// Exits 1 on any failure. Touches nothing outside the OS temp directory.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../..');
const NOTE_BODY = path.join(HERE, 'NoteBody.jsx').split(path.sep).join('/');

const ATTACK = '<p>ok</p><script>alert(1)</script><img src=x onerror="alert(2)"><a href="javascript:alert(3)">x</a>';

// Real-shaped: what the CRM's editor emits, plus the two authoring prefixes
// NoteBody promotes, a link that opens a new tab, and an entity.
const REAL_SHAPED = [
  '<p>Business aviation closes the quarter with an <strong>unusual</strong> split &amp; a <em>backlog</em>.</p>',
  '<h2>What moved</h2>',
  '<p>Flight activity rose. See <a href="https://www.example.com/report" target="_blank" rel="noopener noreferrer">the report</a>.</p>',
  '<ul><li>Tariffs paused</li><li>Sales ban threatened</li></ul>',
  '<p>STAT: $60.5 billion — projected 2034 business jet market (Aviation International News, September 2026)</p>',
  '<p>&gt; A sentence worth setting apart. — Joseph Pennella</p>',
  '<h3>Next</h3><p>Line one<br>line two</p>',
].join('');

function cachedBodies() {
  try {
    const cache = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/crm-articles.cache.json'), 'utf8'));
    return Object.entries(cache)
      .map(([slug, v]) => ({ slug, html: v?.body?.contentHtml || v?.body?.content || '' }))
      .filter((b) => b.html);
  } catch {
    return [];
  }
}

async function bundle(tmp, name, sanitised) {
  const entry = path.join(tmp, `${name}-entry.jsx`);
  fs.writeFileSync(entry, [
    "import React from 'react';",
    "import { createRoot } from 'react-dom/client';",
    "import { flushSync } from 'react-dom';",
    `import NoteBody from '${NOTE_BODY}';`,
    'window.renderNote = (html) => {',
    "  const el = document.createElement('div');",
    '  document.body.appendChild(el);',
    '  const root = createRoot(el);',
    '  flushSync(() => root.render(React.createElement(NoteBody, { html })));',
    '  return el;',
    '};',
  ].join('\n'));
  const identity = path.join(tmp, 'identity-sanitize.js');
  fs.writeFileSync(identity, 'export function sanitizeNoteHtml(html) { return html; }\n');
  await build({
    root: ROOT,
    configFile: false,
    logLevel: 'silent',
    plugins: [react()],
    define: { 'process.env.NODE_ENV': '"production"' },
    resolve: sanitised ? {} : { alias: [{ find: /^\.\/sanitizeNote$/, replacement: identity }] },
    build: {
      outDir: path.join(tmp, name),
      emptyOutDir: true,
      write: true,
      lib: { entry, name: 'harness', formats: ['iife'], fileName: () => 'harness.js' },
    },
  });
  return path.join(tmp, name, 'harness.js');
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'notebody-test-'));
const failures = [];
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) failures.push(msg); };

const shipped = await bundle(tmp, 'shipped', true);
const before = await bundle(tmp, 'before', false);

const browser = await chromium.launch();
async function open(bundlePath) {
  const page = await browser.newPage();
  const dialogs = [];
  page.on('dialog', (d) => { dialogs.push(d.message()); d.dismiss(); });
  await page.setContent('<!doctype html><html><body></body></html>');
  await page.addScriptTag({ path: bundlePath });
  return { page, dialogs };
}

const inspect = (html) => {
  const el = window.renderNote(html);
  const hrefs = [...el.querySelectorAll('[href],[src]')].map((n) => n.getAttribute('href') || n.getAttribute('src') || '');
  return {
    html: el.innerHTML,
    text: el.textContent,
    scripts: el.querySelectorAll('script').length,
    onAttrs: [...el.querySelectorAll('*')].flatMap((n) => [...n.attributes].map((a) => a.name)).filter((a) => /^on/i.test(a)),
    scriptUrls: hrefs.filter((h) => /^\s*javascript:/i.test(h)),
  };
};

try {
  const S = await open(shipped);
  const B = await open(before);

  // 1. The attack string, through the shipped NoteBody.
  const a = await S.page.evaluate(inspect, ATTACK);
  await S.page.waitForTimeout(300);
  check(a.scripts === 0, `attack: no <script> in the rendered note (found ${a.scripts})`);
  check(a.onAttrs.length === 0, `attack: no on* attribute (found ${JSON.stringify(a.onAttrs)})`);
  check(a.scriptUrls.length === 0 && !/javascript:/i.test(a.html), 'attack: no javascript: URL anywhere in the rendered HTML');
  check(a.text.includes('ok'), 'attack: the harmless paragraph "ok" still renders');
  check(S.dialogs.length === 0, `attack: nothing executed (dialogs: ${JSON.stringify(S.dialogs)})`);
  console.log(`      rendered: ${a.html}`);

  // The same string through NoteBody as it was: the check above is meaningful
  // only if this one fails.
  const b = await B.page.evaluate(inspect, ATTACK);
  await B.page.waitForTimeout(500);
  console.log(`INFO  before this order the same string rendered ${b.onAttrs.length} on* attribute(s) and ` +
    `${b.scriptUrls.length} javascript: URL(s), and ran ${B.dialogs.length} dialog(s): ${JSON.stringify(B.dialogs)}`);
  check(b.onAttrs.length > 0 || b.scriptUrls.length > 0, 'control: the unsanitised NoteBody does render the attack (so the test can fail)');

  // 2. Real-shaped bodies render exactly as before.
  const bodies = [{ slug: '(hand-written real-shaped body)', html: REAL_SHAPED }, ...cachedBodies()];
  for (const { slug, html } of bodies) {
    const s = await S.page.evaluate(inspect, html);
    const o = await B.page.evaluate(inspect, html);
    check(s.html === o.html, `unchanged: ${slug} (${s.html.length} chars rendered)`);
  }
} finally {
  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log(failures.length ? `\n${failures.length} FAILED` : '\nall passed');
process.exit(failures.length ? 1 : 0);
