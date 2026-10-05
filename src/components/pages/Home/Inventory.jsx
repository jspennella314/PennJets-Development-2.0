import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { inventoryApi } from '../../../services/inventoryApi';

// ---------------------------------------------------------------------------
// Inventory: real aircraft only, read from the CRM (GET /api/public/inventory,
// docs/integration/PENNJETS-SITE.md §5). Every entry carries year, make,
// model, serial, hours and config, or inventoryApi drops it. Only the CRM's
// Approve action lists an aircraft; nothing here adds, labels or promotes
// one, and there is no "featured", "coming soon" or "off market" entry of
// the site's own. The section renders nothing while the list is empty,
// before the fetch resolves, and when the fetch fails. No placeholder, no
// skeleton that names an aircraft. WO-4.42 (the constant it replaced was
// always empty).
// ---------------------------------------------------------------------------

const usd = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function InventoryCard({ a }) {
  const name = `${a.year} ${a.make} ${a.model}`;
  return (
    <article className="overflow-hidden rounded-2xl border shadow-sm">
      {/* The image is the first one on the CRM's own store; any other host
          was dropped by safeImage (WO-4.39), and the card has no image. */}
      {a.image && (
        <Link
          to={a.url}
          className="block w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          <img
            src={a.image}
            alt={name}
            loading="lazy"
            width={900}
            height={600}
            className="aspect-[3/2] w-full object-cover"
          />
        </Link>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          <li>Serial {a.serial}</li>
          <li>{a.hours.toLocaleString('en-US')} hours total time</li>
          <li>{a.config}</li>
          {/* The asking price, only when the route sent a number. */}
          {typeof a.askingPrice === 'number' && (
            <li className="font-medium text-gray-900">{usd(a.askingPrice)}</li>
          )}
        </ul>
        <Link
          to={a.url}
          className="mt-3 inline-block text-sm font-medium underline"
          aria-label={`View details for ${name}`}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

// `initialListings` is for tests; the page passes nothing.
export default function Inventory({ initialListings }) {
  const [listings, setListings] = useState(initialListings ?? null);

  useEffect(() => {
    if (initialListings) return undefined;
    let cancelled = false;
    inventoryApi
      .getListings()
      .then((list) => { if (!cancelled) setListings(list); })
      .catch(() => { if (!cancelled) setListings([]); });
    return () => { cancelled = true; };
  }, [initialListings]);

  if (!listings || listings.length === 0) return null;

  return (
    <section aria-labelledby="inventory" className="py-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <h2 id="inventory" className="text-2xl font-semibold">Inventory</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((a) => (
            <InventoryCard key={a.id} a={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
