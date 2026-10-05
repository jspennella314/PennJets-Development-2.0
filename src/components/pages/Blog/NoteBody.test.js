// NoteBody sanitisation, in a real browser. WO-4.38, folded into vitest by
// WO-4.41 (was NoteBody.browser-test.mjs; every case kept).
//
// This runs in vitest's node environment and drives the prerender's Playwright
// Chromium, not happy-dom. DOMPurify does not sanitise under happy-dom: its
// NodeIterator does not survive the removal of the node it is standing on the
// way a browser's does, so DOMPurify removes <body> and the first <p> and then
// stops, leaving <script>, onerror and javascript: in place (probed on
// 2026-10-05, happy-dom 20.14.5, dompurify 3.4.16). A sanitiser test whose
// sanitiser is silently inert would pass for the wrong reason, so this one
// uses the same browser the build renders every page with.
//
// Vite bundles a small harness around the real NoteBody twice: the component
// as shipped, and the same component with sanitizeNote.js swapped for an
// identity function, which is NoteBody as it was before WO-4.38. Comparing
// the two shows that the sanitiser changes nothing in a real body and removes
// everything executable from an attack.
//
// Touches nothing outside the OS temp directory. Needs Chromium installed
// (`npx playwright install chromium`), which the deploy workflow does before
// `npm test`.

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
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

// Runs in the page: what the rendered note contains.
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

let tmp;
let browser;
let S; // the shipped NoteBody, in its page
let B; // NoteBody as it was before WO-4.38, in its page
let attack; // the attack string through the shipped NoteBody
let control; // the same string through the unsanitised one

async function open(bundlePath) {
  const page = await browser.newPage();
  const dialogs = [];
  page.on('dialog', (d) => { dialogs.push(d.message()); d.dismiss(); });
  await page.setContent('<!doctype html><html><body></body></html>');
  await page.addScriptTag({ path: bundlePath });
  return { page, dialogs };
}

beforeAll(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'notebody-test-'));
  // The harness is a production bundle, as the script built it from plain
  // node. Under vitest NODE_ENV is "test", which makes @vitejs/plugin-react
  // emit the jsx-dev-runtime while `define` above hands it production React,
  // whose jsx-dev-runtime has no jsxDEV. Each test file runs in its own
  // forked process (vitest.config.js), so this touches nothing else.
  const nodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  let shipped;
  let before;
  try {
    shipped = await bundle(tmp, 'shipped', true);
    before = await bundle(tmp, 'before', false);
  } finally {
    process.env.NODE_ENV = nodeEnv;
  }
  browser = await chromium.launch();
  S = await open(shipped);
  B = await open(before);
  attack = await S.page.evaluate(inspect, ATTACK);
  await S.page.waitForTimeout(300);
  control = await B.page.evaluate(inspect, ATTACK);
  await B.page.waitForTimeout(500);
}, 120000);

afterAll(async () => {
  if (browser) await browser.close();
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
});

describe('attack: the order\'s string through the shipped NoteBody', () => {
  it('no <script> in the rendered note', () => expect(attack.scripts).toBe(0));
  it('no on* attribute', () => expect(attack.onAttrs).toEqual([]));
  it('no javascript: URL anywhere in the rendered HTML', () => {
    expect(attack.scriptUrls).toEqual([]);
    expect(attack.html).not.toMatch(/javascript:/i);
  });
  it('the harmless paragraph "ok" still renders', () => expect(attack.text).toContain('ok'));
  it('nothing executed (no dialog)', () => expect(S.dialogs).toEqual([]));
});

describe('control: the unsanitised NoteBody does render the attack (so the test can fail)', () => {
  it('keeps an on* attribute or a javascript: URL, and runs it', () => {
    expect(control.onAttrs.length > 0 || control.scriptUrls.length > 0).toBe(true);
    // Informational, as the script printed it: what the old component let through.
    console.log(`INFO  before WO-4.38 the same string rendered ${control.onAttrs.length} on* attribute(s) and ` +
      `${control.scriptUrls.length} javascript: URL(s), and ran ${B.dialogs.length} dialog(s): ${JSON.stringify(B.dialogs)}`);
  });
});

describe('unchanged: real-shaped bodies render exactly as before', () => {
  const bodies = [{ slug: '(hand-written real-shaped body)', html: REAL_SHAPED }, ...cachedBodies()];
  it.each(bodies.map((b) => [b.slug, b.html]))('%s', async (slug, html) => {
    const s = await S.page.evaluate(inspect, html);
    const o = await B.page.evaluate(inspect, html);
    expect(s.html.length).toBeGreaterThan(0);
    expect(s.html).toBe(o.html);
  });
});
