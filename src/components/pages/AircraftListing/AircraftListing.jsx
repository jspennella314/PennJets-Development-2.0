import React from 'react';
import { Link } from 'react-router-dom';
import Inventory from '../Home/Inventory';
import { OFF_MARKET_TYPES, LEAD_LINE, inquiryHref } from '../../../content/recentInquiries';

// /aircraft: "Recent Inquiries" (Joseph, 2026-10-21). WO-4.52.
//
// Two blocks that never mix:
//   1. Inventory: the CRM's LISTED aircraft, under its own "Inventory"
//      heading, the same component and fetch as before. It renders nothing
//      while the inventory is empty, in flight, or failed.
//   2. The five representative types that left the home page: the same WebP
//      cutouts, no price, no badge, each card a link to the Buy form (the
//      Premier 1A to the charter form, as on the home page).
//
// The page is reached from /buy and the footer; the menu keeps no Aircraft
// item (Round 7 decision 2, WO-4.49). /aircraft/:id still redirects to /buy.
// The filters and the price ceiling of "Aircraft for Sale" (WO-4.43) went
// with that page.

function InquiryCard({ t }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="relative aspect-[3/2] w-full bg-white">
        <img
          src={t.image}
          alt={`${t.model} silhouette`}
          loading="lazy"
          width={900}
          height={600}
          className="h-full w-full object-contain p-4"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div
          className="absolute inset-0 items-center justify-center text-sm font-medium text-gray-400"
          style={{ display: 'none' }}
        >
          {t.model}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold">{t.model}</h3>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          <li>{t.category}</li>
          <li>Typically {t.seats} seats</li>
          <li>Typical range ~{t.rangeNm.toLocaleString()} nm</li>
        </ul>
        <Link
          to={inquiryHref(t)}
          className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          Tell us what you&apos;re looking for
        </Link>
      </div>
    </article>
  );
}

const AircraftListing = () => (
  <div className="bg-white pt-36 pb-16 sm:pt-40">
    <div className="mx-auto w-full max-w-6xl px-6">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Recent Inquiries</h1>
        <p className="mt-3 text-gray-600">{LEAD_LINE}</p>
      </header>
    </div>

    {/* Real listings first, under their own heading; nothing while empty. */}
    <Inventory />

    <section aria-label="Recent inquiries" className="mt-10">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {OFF_MARKET_TYPES.map((t) => (
            <InquiryCard key={t.id} t={t} />
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default AircraftListing;
