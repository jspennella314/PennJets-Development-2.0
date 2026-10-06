import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../common/Button/Button';
import { inventoryApi } from '../../../services/inventoryApi';
import { InventoryCard } from '../Home/Inventory';

// /aircraft: the CRM's LISTED aircraft, the same list the home page's
// Inventory section reads (inventoryApi.getListings, contract §5), rendered
// with the same card. The three static entries that used to live in
// src/data/aircraftData.js are gone: listings come only through the CRM
// now (Joseph, 2026-10-05). WO-4.43.
//
// Filters are only the ones the contract can answer: make, a year range,
// and a price ceiling when at least one listing carries a price. Category,
// status, location and specifications went with the static data.
//
// The empty state is the page's heading, one approved sentence and the
// inquiry link: no count, no placeholder card, no "coming soon".

// The Off-Market paragraph's first sentence from the home page, which Joseph
// approved; it stands in until he answers the lead on the wording for this
// page (WO-4.43 item 2).
export const EMPTY_SENTENCE =
  "The best aircraft rarely reach the open market. Tell us your mission and we'll tell you what's available.";

const usd = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

// Price ceilings offered when any listing has a price; only the ones that
// would change the result are shown.
const PRICE_CEILINGS = [1000000, 2500000, 5000000, 10000000, 25000000];

const ALL = 'All';

const AircraftListing = () => {
  // null until the fetch answers; [] is a confirmed empty inventory.
  const [listings, setListings] = useState(null);
  const [filters, setFilters] = useState({ make: ALL, yearFrom: ALL, yearTo: ALL, maxPrice: ALL });

  useEffect(() => {
    let cancelled = false;
    inventoryApi
      .getListings()
      .then((list) => { if (!cancelled) setListings(list); })
      .catch(() => { if (!cancelled) setListings([]); });
    return () => { cancelled = true; };
  }, []);

  const all = useMemo(() => listings || [], [listings]);
  const makes = useMemo(() => [...new Set(all.map((a) => a.make))].sort(), [all]);
  const years = useMemo(() => [...new Set(all.map((a) => a.year))].sort((a, b) => a - b), [all]);
  const anyPrice = all.some((a) => typeof a.askingPrice === 'number');
  const ceilings = useMemo(() => {
    if (!anyPrice) return [];
    const prices = all.map((a) => a.askingPrice).filter((p) => typeof p === 'number');
    const top = Math.max(...prices);
    return PRICE_CEILINGS.filter((c) => c >= Math.min(...prices)).filter((c, i, arr) => c < top || arr[i - 1] === undefined || arr[i - 1] < top);
  }, [all, anyPrice]);

  const filtered = useMemo(() => all.filter((a) => {
    if (filters.make !== ALL && a.make !== filters.make) return false;
    if (filters.yearFrom !== ALL && a.year < Number(filters.yearFrom)) return false;
    if (filters.yearTo !== ALL && a.year > Number(filters.yearTo)) return false;
    if (filters.maxPrice !== ALL && !(typeof a.askingPrice === 'number' && a.askingPrice <= Number(filters.maxPrice))) return false;
    return true;
  }), [all, filters]);

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ make: ALL, yearFrom: ALL, yearTo: ALL, maxPrice: ALL });
  const filtering = Object.values(filters).some((v) => v !== ALL);

  const selectClass = 'px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500';

  return (
    <>
      {/* Header Section */}
      <section className="bg-gray-900 text-white py-24 mt-24">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center">
            <h1 className="heading-lg mb-6">Aircraft for Sale</h1>
            <p className="body-lg max-w-2xl mx-auto text-gray-300">
              Discover our curated collection of premium aircraft. Each listing represents
              exceptional quality, performance, and value in the luxury aviation market.
            </p>
          </div>
        </div>
      </section>

      {/* Before the fetch answers: nothing below the heading. */}
      {listings === null && <section className="section-padding bg-white" aria-busy="true" />}

      {/* The empty inventory: one approved sentence and the inquiry link. */}
      {listings !== null && all.length === 0 && (
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto container-padding text-center">
            <p className="body-lg max-w-2xl mx-auto text-gray-700">{EMPTY_SENTENCE}</p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              Contact a Consultant
            </Link>
          </div>
        </section>
      )}

      {listings !== null && all.length > 0 && (
        <>
          {/* Filters: only what the route sends. */}
          <section className="bg-white py-8 border-b">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                <select aria-label="Make" value={filters.make} onChange={(e) => setFilter('make', e.target.value)} className={selectClass}>
                  <option value={ALL}>All makes</option>
                  {makes.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <select aria-label="Year from" value={filters.yearFrom} onChange={(e) => setFilter('yearFrom', e.target.value)} className={selectClass}>
                  <option value={ALL}>Year from</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <select aria-label="Year to" value={filters.yearTo} onChange={(e) => setFilter('yearTo', e.target.value)} className={selectClass}>
                  <option value={ALL}>Year to</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                {anyPrice && (
                  <select aria-label="Maximum price" value={filters.maxPrice} onChange={(e) => setFilter('maxPrice', e.target.value)} className={selectClass}>
                    <option value={ALL}>Any price</option>
                    {ceilings.map((c) => <option key={c} value={c}>Up to {usd(c)}</option>)}
                  </select>
                )}
                <Button variant="ghost" onClick={clearFilters} className="text-sm">
                  Clear Filters
                </Button>
              </div>

              {/* Results Count */}
              <div className="text-gray-600">
                Showing {filtered.length} of {all.length} aircraft
              </div>
            </div>
          </section>

          {/* Aircraft Grid */}
          <section className="section-padding bg-gray-50">
            <div className="max-w-7xl mx-auto container-padding">
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">✈️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No aircraft found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters to see more results.</p>
                  {filtering && (
                    <Button variant="primary" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filtered.map((a) => (
                    <InventoryCard key={a.id} a={a} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="section-padding bg-primary-600 text-white">
            <div className="max-w-7xl mx-auto container-padding text-center">
              <h2 className="heading-md mb-6">Can't Find What You're Looking For?</h2>
              <p className="body-lg mb-8 max-w-2xl mx-auto">
                Our aviation consultants have access to an extensive network of off-market aircraft.
                Let us help you find the perfect aircraft for your needs.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-medium text-primary-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Contact a Consultant
              </Link>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default AircraftListing;
