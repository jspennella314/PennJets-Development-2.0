// Market Notes helpers shared by the article template (and, later, the index).

export const CATEGORIES = ['Market Notes', 'Transactions', 'Aircraft Overviews'];

// How a category is stored in the CRM is an open question for the lead
// (see the T4 report of 2026-09-20). Until that is answered, a post is
// labeled by the first keyword that matches one of the three public
// categories, and falls back to "Market Notes".
export function categoryFor(post) {
  const candidates = [post?.category, ...(post?.keywords || []), ...(post?.tags || [])]
    .filter(Boolean)
    .map((s) => String(s).trim().toLowerCase());
  for (const c of CATEGORIES) {
    if (candidates.includes(c.toLowerCase())) return c;
  }
  return 'Market Notes';
}

export function formatNoteDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Three related notes: same category first, then the most recent, never the current one.
export function relatedNotes(all, current, n = 3) {
  const others = (all || []).filter((p) => p.slug !== current?.slug);
  const cat = categoryFor(current);
  const same = others.filter((p) => categoryFor(p) === cat);
  const rest = others.filter((p) => categoryFor(p) !== cat);
  return [...same, ...rest].slice(0, n);
}
