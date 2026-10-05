import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inventoryApi } from '../../../services/inventoryApi';

// /aircraft/<slug>: one of the CRM's LISTED aircraft (GET
// /api/public/inventory, docs/integration/PENNJETS-SITE.md §5), reached from
// the home page's Inventory card and from /aircraft. Only what the route sent
// is shown: no location, status, description or price the CRM did not
// provide. A slug with no listing redirects to /aircraft. The numeric-id
// branch that read src/data/aircraftData.js went with that file (WO-4.43);
// a numeric id is just a slug that matches nothing. WO-4.42, WO-4.43.

const usd = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const ContactConsultant = ({ navigate }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-xl font-semibold mb-4">Contact a Consultant</h3>
    <div className="text-center mb-4">
      <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
        <span className="text-2xl">👤</span>
      </div>
      <div className="font-medium">Aviation Consultant</div>
      <div className="text-sm text-gray-600">Private Jet Advisor</div>
    </div>
    <div className="space-y-2 text-sm mb-4">
      <div>📞 (954) 546-0763</div>
      <div>✉️ joe@pennjets.com</div>
    </div>
    <button
      onClick={() => navigate('/contact')}
      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    >
      Contact a Consultant
    </button>
  </div>
);

export const ListingDetail = ({ listing, navigate }) => {
  const name = `${listing.year} ${listing.make} ${listing.model}${listing.variant ? ` ${listing.variant}` : ''}`;
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 py-4 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
            <span className="mx-2">/</span>
            <button onClick={() => navigate('/aircraft')} className="hover:text-blue-600">Aircraft</button>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{name}</h1>
          {listing.headline && <p className="text-xl text-gray-600 mb-4">{listing.headline}</p>}
          {typeof listing.askingPrice === 'number' && (
            <div className="text-3xl font-bold text-blue-600 mb-4">{usd(listing.askingPrice)}</div>
          )}
        </div>

        {listing.images.length > 0 && (
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {listing.images.map((src, i) => (
              <div key={src} className={`aspect-video bg-gray-200 rounded-lg overflow-hidden${i === 0 ? ' md:col-span-2' : ''}`}>
                <img src={src} alt={i === 0 ? name : ''} loading={i === 0 ? 'eager' : 'lazy'} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Aircraft</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['Year', listing.year],
                  ['Make', listing.make],
                  ['Model', listing.model],
                  listing.variant ? ['Variant', listing.variant] : null,
                  ['Serial', listing.serial],
                  ['Total time', `${listing.hours.toLocaleString('en-US')} hours`],
                  ['Configuration', listing.config],
                  typeof listing.askingPrice === 'number' ? ['Asking price', usd(listing.askingPrice)] : null,
                ].filter(Boolean).map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="font-medium text-gray-900">{label}</dt>
                    <dd className="text-gray-600 text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div>
            <ContactConsultant navigate={navigate} />
          </div>
        </div>
      </div>
    </div>
  );
};

const AircraftDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setListing(null);
    inventoryApi.getListing(id).then((found) => {
      if (cancelled) return;
      if (!found) {
        navigate('/aircraft', { replace: true });
        return;
      }
      setListing(found);
    });
    return () => { cancelled = true; };
  }, [id, navigate]);

  // Nothing until the lookup has answered: no placeholder names an aircraft.
  if (!listing) {
    return <div className="min-h-screen bg-white" />;
  }

  return <ListingDetail listing={listing} navigate={navigate} />;
};

export default AircraftDetail;
