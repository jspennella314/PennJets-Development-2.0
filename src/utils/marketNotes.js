// Market Notes helpers shared by the article page and the index.

// A post's category is stored in the CRM's existing keywords array as a
// prefixed value, e.g. "category:market-studies" (T1, 2026-09-20). A post with
// no such keyword has no category: it shows no label and still appears in the
// unfiltered list.
export const CATEGORY_PREFIX = 'category:';

export const CATEGORIES = [
  { slug: 'market-studies', label: 'Market Studies' },
  { slug: 'market-notes', label: 'Market Notes' },
  { slug: 'transactions', label: 'Transactions' },
];

const BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));

// Returns { slug, label } or null. Only the three known categories are
// recognised; an unknown category: value is ignored rather than shown raw.
export function categoryFor(post) {
  for (const kw of post?.keywords || []) {
    const value = String(kw).trim().toLowerCase();
    if (!value.startsWith(CATEGORY_PREFIX)) continue;
    const found = BY_SLUG.get(value.slice(CATEGORY_PREFIX.length));
    if (found) return found;
  }
  return null;
}

// Whether a post carries exactly this category. The index uses it to offer
// only the chips that have notes. It used to re-filter the CRM's loose
// ?keyword= results too; the index now asks the CRM's exact ?category=
// instead, so that use is gone (WO-4.31) and categoryKeyword() with it.
export function hasCategory(post, slug) {
  return categoryFor(post)?.slug === slug;
}

// Keywords are also rendered as tags, so hide the bookkeeping ones.
export function displayTags(post) {
  return (post?.keywords || []).filter(
    (kw) => !String(kw).trim().toLowerCase().startsWith(CATEGORY_PREFIX)
  );
}

export function formatNoteDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Three related notes: same category first, then the most recent, never the
// current one. A note with no category just falls back to most recent.
export function relatedNotes(all, current, n = 3) {
  const others = (all || []).filter((p) => p.slug !== current?.slug);
  const cat = categoryFor(current);
  if (!cat) return others.slice(0, n);
  const same = others.filter((p) => categoryFor(p)?.slug === cat.slug);
  const rest = others.filter((p) => categoryFor(p)?.slug !== cat.slug);
  return [...same, ...rest].slice(0, n);
}
