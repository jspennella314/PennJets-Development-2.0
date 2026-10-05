import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { aircraftDatabase } from '../../../data/aircraftData';
import { inventoryApi } from '../../../services/inventoryApi';

// Detail-page hero image per static aircraft id. Ids without an entry show the neutral panel.
const DETAIL_IMAGES = {
  3: '/images/PENNSHARE/PREMIER-1A.jpg',
};

const usd = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

// The contact block, shared by both views below.
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

// A CRM listing (GET /api/public/inventory, docs/integration/PENNJETS-SITE.md
// §5), reached from the home page's Inventory card at /aircraft/<slug>. Only
// what the route sent is shown: no location, status, description or price
// the CRM did not provide. WO-4.42.
const ListingDetail = ({ listing, navigate }) => {
  const name = `${listing.year} ${listing.make} ${listing.model}${listing.variant ? ` ${listing.variant}` : ''}`;
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 py-4 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
            <span className="mx-2">/</span>
            <button onClick={() => navigate('/#inventory')} className="hover:text-blue-600">Inventory</button>
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
  const [aircraft, setAircraft] = useState(null);
  const [listing, setListing] = useState(null);
  // A static entry has a numeric id (/aircraft/3); a CRM listing has its slug
  // (/aircraft/2004-hawker-800xp-258xxx). The static path is unchanged.
  const isStaticId = /^\d+$/.test(id || '');
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setListing(null);
    setAircraft(null);
    setResolved(false);

    if (isStaticId) {
      const foundAircraft = aircraftDatabase.find(a => a.id === parseInt(id));
      setAircraft(foundAircraft || null);
      setResolved(true);
      if (!foundAircraft) {
        navigate('/aircraft');
      }
      return undefined;
    }

    // A CRM listing by slug; none matching falls through to the static page's
    // index, as an unknown numeric id always has.
    inventoryApi.getListing(id).then((found) => {
      if (cancelled) return;
      setListing(found);
      setResolved(true);
      if (!found) navigate('/aircraft');
    });
    return () => { cancelled = true; };
  }, [id, navigate, isStaticId]);

  if (listing) {
    return <ListingDetail listing={listing} navigate={navigate} />;
  }

  // Nothing until a slug lookup has answered: no placeholder names an aircraft.
  if (!resolved) {
    return <div className="min-h-screen bg-white" />;
  }

  if (!aircraft) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4">✈️</div>
          <h2 className="text-2xl font-semibold mb-2">Aircraft not found</h2>
          <p className="text-gray-600 mb-6">The aircraft you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/aircraft')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Aircraft Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-4 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
            <span className="mx-2">/</span>
            <button onClick={() => navigate('/aircraft')} className="hover:text-blue-600">Aircraft</button>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{aircraft.year} {aircraft.manufacturer} {aircraft.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {aircraft.year} {aircraft.manufacturer} {aircraft.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xl text-gray-600">{aircraft.category}</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {aircraft.status}
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              {aircraft.priceFormatted}
            </div>
            <div className="text-gray-600">
              📍 Located in {aircraft.location}
            </div>
          </div>

          {/* Image Section */}
          <div className="mb-8">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              {DETAIL_IMAGES[aircraft.id] ? (
                <img
                  src={DETAIL_IMAGES[aircraft.id]}
                  alt={`${aircraft.year} ${aircraft.manufacturer} ${aircraft.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-xl" style={{display: DETAIL_IMAGES[aircraft.id] ? 'none' : 'flex'}}>
                {aircraft.manufacturer} {aircraft.name}
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {aircraft.description}
                </p>
              </div>

              {/* Specifications */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(aircraft.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aircraft.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Quick Info */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Quick Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year</span>
                    <span className="font-medium">{aircraft.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manufacturer</span>
                    <span className="font-medium">{aircraft.manufacturer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model</span>
                    <span className="font-medium">{aircraft.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{aircraft.category}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Price</span>
                    <span className="font-bold text-blue-600">{aircraft.priceFormatted}</span>
                  </div>
                </div>
              </div>

              {/* Aircraft Shopper Online Link */}
              {aircraft.tradeAPlaneUrl && (
                <div className="bg-blue-50 rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">🛩️</span>
                    Full Listing Details
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    View complete specifications, additional photos, and detailed information on Aircraft Shopper Online.
                  </p>
                  <a
                    href={aircraft.tradeAPlaneUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
                  >
                    <span className="mr-2">🔗</span>
                    View on Aircraft Shopper Online
                  </a>
                </div>
              )}

              {/* Contact */}
              <ContactConsultant navigate={navigate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AircraftDetail;
