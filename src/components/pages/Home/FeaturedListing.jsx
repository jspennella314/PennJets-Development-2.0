import React from 'react';
import { InventoryCard } from './Inventory';
import { useListings } from './useListings';

// FeaturedListing: one real aircraft on the home page, the first the CRM's
// GET /api/public/inventory returns, read through the same fetch and
// fallback as Inventory (useListings: null in flight, [] on failure).
// While the list is empty, in flight or failed it renders nothing at all:
// no heading, no placeholder, no wrapper with padding, so the prerender
// bakes nothing into dist/index.html while the inventory is empty. The
// card links to /buy?model=<make model>, which Buy prefills. WO-4.52.

const featuredHref = (a) => `/buy?model=${encodeURIComponent(`${a.make} ${a.model}`)}`;

export default function FeaturedListing({ initialListings }) {
  const listings = useListings(initialListings);
  if (!listings || listings.length === 0) return null;
  const a = listings[0];

  return (
    <section aria-labelledby="featured-listing" className="py-12 sm:py-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <h2 id="featured-listing" className="text-2xl font-semibold">Featured Listing</h2>
        <div className="mt-8 max-w-md">
          <InventoryCard a={a} to={featuredHref(a)} />
        </div>
      </div>
    </section>
  );
}
