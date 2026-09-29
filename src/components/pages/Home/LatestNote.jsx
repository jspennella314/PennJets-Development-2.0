import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogApi } from '../../../services/blogApi';
import { categoryFor, formatNoteDate } from '../../../utils/marketNotes';
import { safeImage } from '../../../seo/siteMeta';
import { imageCreditContent } from '../Blog/imageCredit';

// The newest published note: greatest publishedAt, whatever order the list
// arrives in.
function newestNote(posts) {
  let newest = null;
  for (const p of posts || []) {
    if (!p?.slug || !p.publishedAt) continue;
    if (!newest || new Date(p.publishedAt) > new Date(newest.publishedAt)) newest = p;
  }
  return newest;
}

// One compact card for the newest Market Note, under the home page hero.
// WO-4.37.
//
// The whole card is one link. The photo credit, when the note's image needs
// one, sits under it in the same box but outside the link, because it holds
// links of its own and a link cannot contain a link. It is the article's
// credit (imageCreditContent), so the two never disagree.
//
export function LatestNoteCard({ note }) {
  if (!note) return null;
  const category = categoryFor(note);
  const thumb = safeImage(note.featuredImage);
  const credit = thumb ? imageCreditContent(note.imageAttribution) : null;

  return (
    <div className="latest-note rounded-2xl border border-gray-200 bg-white shadow-sm">
      <Link
        to={`/blog/${note.slug}`}
        className="flex items-center gap-4 rounded-2xl p-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 md:p-4"
      >
        {thumb && (
          <img
            src={thumb}
            alt=""
            width="96"
            height="72"
            loading="lazy"
            className="h-16 w-20 flex-shrink-0 rounded-lg bg-gray-100 object-cover md:h-20 md:w-28"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
            {category && <span className="font-medium uppercase tracking-wide text-gray-700">{category.label}</span>}
            {category && <span aria-hidden="true">·</span>}
            <time dateTime={note.publishedAt}>{formatNoteDate(note.publishedAt)}</time>
          </div>
          <h3 className="mt-1 text-base font-semibold leading-snug text-gray-900 md:text-lg">{note.title}</h3>
          {note.excerpt && (
            <p className="mt-1 hidden truncate text-sm text-gray-600 md:block">{note.excerpt}</p>
          )}
          <span className="mt-1 hidden text-sm font-medium text-gray-900 underline underline-offset-2 md:inline-block">
            Read the note
          </span>
        </div>
      </Link>
      {credit && (
        <p className="image-credit px-3 pb-2 text-[11px] text-gray-500 md:px-4 md:pb-3 md:text-xs">{credit}</p>
      )}
    </div>
  );
}

// No note, no card: while the list is loading, if it is empty, or if the
// fetch fails (getPosts() returns [] on failure), this renders nothing.
// `initialPosts` is for tests; the page passes nothing.
export default function LatestNote({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts ?? null);

  useEffect(() => {
    if (initialPosts) return undefined;
    let cancelled = false;
    blogApi
      .getPosts()
      .then((list) => { if (!cancelled) setPosts(list); })
      .catch(() => { if (!cancelled) setPosts([]); });
    return () => { cancelled = true; };
  }, [initialPosts]);

  const note = newestNote(posts);
  if (!note) return null;

  return (
    <section aria-labelledby="latest-note" className="pt-8">
      <div className="mx-auto w-full max-w-6xl px-6">
        {/* Proposed text; visually hidden so the card's title sits under a
            section heading like every other home section's content. */}
        <h2 id="latest-note" className="sr-only">Latest Market Note</h2>
        <LatestNoteCard note={note} />
      </div>
    </section>
  );
}
