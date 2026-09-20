import React, { useMemo } from 'react';

// Renders a Market Note body.
//
// The CRM stores the body as HTML and its editor emits only p, br, h2, h3, ul,
// li, strong and em. There is no blockquote or figure button, so a pull quote
// and a sourced statistic cannot come from the markup. Instead the author marks
// them with a prefix typed into an ordinary paragraph, and this component
// promotes those paragraphs to real blocks:
//
//   > A sentence worth setting apart. — Joseph Pennella
//     becomes a pull quote (the "— Name" attribution is optional)
//
//   STAT: $60.5 billion — projected 2034 business jet market (Aviation International News, September 2026)
//     becomes a sourced statistic: figure, then label, then source
//
// A real <blockquote> is also honored, so nothing breaks if the editor gains
// the button later. The first paragraph renders as the lede.
//
// Everything else passes through unchanged, which is the same trust boundary
// the page has today: this content comes from PennForce, authored by the team.

const STAT_PREFIX = /^stat\s*:/i;
const QUOTE_PREFIX = /^(?:>|&gt;)\s*/;
const DASH = /\s+(?:—|--|–)\s+/;

function splitAttribution(text) {
  const parts = text.split(DASH);
  if (parts.length > 1) {
    const attribution = parts.pop().trim();
    return { quote: parts.join(' — ').trim(), attribution };
  }
  return { quote: text.trim(), attribution: null };
}

function parseStat(text) {
  const body = text.replace(STAT_PREFIX, '').trim();
  // trailing parenthetical is the source
  let source = null;
  let rest = body;
  const m = body.match(/\(([^()]*)\)\s*$/);
  if (m) {
    source = m[1].trim();
    rest = body.slice(0, m.index).trim();
  }
  const parts = rest.split(DASH);
  const value = parts.shift().trim();
  const label = parts.join(' — ').trim();
  return { value, label, source };
}

const PullQuote = ({ quote, attribution }) => (
  <figure className="my-10 border-l-2 border-primary-600 pl-6 sm:my-12 sm:pl-8">
    <blockquote className="text-xl sm:text-2xl leading-snug text-gray-900">{quote}</blockquote>
    {attribution && (
      <figcaption className="mt-3 text-sm text-gray-500">— {attribution}</figcaption>
    )}
  </figure>
);

const StatBlock = ({ value, label, source }) => (
  <figure className="my-10 rounded-xl border border-gray-200 bg-gray-50 p-6 sm:my-12">
    <div className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{value}</div>
    {label && <div className="mt-2 text-base text-gray-700">{label}</div>}
    {source && (
      <figcaption className="mt-3 text-xs uppercase tracking-wide text-gray-500">
        Source: {source}
      </figcaption>
    )}
  </figure>
);

function buildBlocks(html) {
  if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
    return [{ kind: 'raw', html }];
  }
  const doc = new window.DOMParser().parseFromString(html, 'text/html');
  const blocks = [];
  let ledeUsed = false;

  for (const node of Array.from(doc.body.childNodes)) {
    if (node.nodeType === 3) {
      if (node.textContent.trim()) blocks.push({ kind: 'raw', html: node.textContent });
      continue;
    }
    if (node.nodeType !== 1) continue;

    const tag = node.tagName.toLowerCase();
    const text = (node.textContent || '').trim();

    if (tag === 'blockquote') {
      blocks.push({ kind: 'quote', ...splitAttribution(text) });
      continue;
    }
    if (tag === 'p' && STAT_PREFIX.test(text)) {
      blocks.push({ kind: 'stat', ...parseStat(text) });
      continue;
    }
    if (tag === 'p' && QUOTE_PREFIX.test(text)) {
      blocks.push({ kind: 'quote', ...splitAttribution(text.replace(QUOTE_PREFIX, '')) });
      continue;
    }
    if (tag === 'p' && !ledeUsed && text) {
      ledeUsed = true;
      blocks.push({ kind: 'lede', html: node.innerHTML });
      continue;
    }
    blocks.push({ kind: 'raw', html: node.outerHTML });
  }
  return blocks;
}

const NoteBody = ({ html }) => {
  const blocks = useMemo(() => buildBlocks(html || ''), [html]);

  return (
    <div className="note-body">
      {blocks.map((b, i) => {
        if (b.kind === 'quote') return <PullQuote key={i} quote={b.quote} attribution={b.attribution} />;
        if (b.kind === 'stat') return <StatBlock key={i} value={b.value} label={b.label} source={b.source} />;
        if (b.kind === 'lede') {
          return (
            <p key={i} className="note-lede mb-8" dangerouslySetInnerHTML={{ __html: b.html }} />
          );
        }
        return <div key={i} dangerouslySetInnerHTML={{ __html: b.html }} />;
      })}
    </div>
  );
};

export default NoteBody;
