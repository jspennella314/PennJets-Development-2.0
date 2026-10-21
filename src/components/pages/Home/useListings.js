import { useEffect, useState } from 'react';
import { inventoryApi } from '../../../services/inventoryApi';

// The CRM's LISTED aircraft: null until the fetch answers, [] on failure.
// `initialListings` is for tests; the pages pass nothing. Shared by
// Inventory and FeaturedListing, so both read the route the same way.
// WO-4.42, WO-4.52.
export function useListings(initialListings) {
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

  return listings;
}
