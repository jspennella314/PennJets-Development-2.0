import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Inventory: real aircraft only. Every entry must carry year, model, serial,
// hours, and config. None exist today, so the list is empty and the section
// renders nothing. Never label anything here "featured" without a serial.
// ---------------------------------------------------------------------------
const INVENTORY = [
  // { id: 'n400hh', year: 2004, make: 'Hawker', model: '800XP', serial: '258xxx',
  //   hours: 6200, config: '8 passengers, forward galley, aft lav',
  //   image: '/images/aircraft/...', url: '/aircraft/...' },
];

// ---------------------------------------------------------------------------
// Off-market access: representative aircraft types we source. Typical seats
// and range only. No year, serial, hours, price, or badges.
// Images: white-tail cutouts in /public/images/aircraft/ (WebP, one per type).
// ---------------------------------------------------------------------------
const OFF_MARKET_TYPES = [
  { id: 'falcon-900',  model: 'Falcon 900',   category: 'Large cabin', seats: 12, rangeNm: 4000, image: '/images/aircraft/falcon-900.webp' },
  { id: 'premier-1a',  model: 'Premier 1A',   category: 'Light jet',   seats: 6,  rangeNm: 1400, image: '/images/aircraft/premier-1a.webp', inquiry: 'charter' },
  { id: 'hawker-800xp', model: 'Hawker 800XP', category: 'Midsize',    seats: 8,  rangeNm: 2500, image: '/images/aircraft/hawker-800xp.webp' },
  { id: 'hawker-400xp', model: 'Hawker 400XP', category: 'Light jet',  seats: 7,  rangeNm: 1500, image: '/images/aircraft/hawker-400xp.webp' },
  { id: 'citation-ii', model: 'Citation II',  category: 'Light jet',   seats: 7,  rangeNm: 1700, image: '/images/aircraft/citation-ii.webp' },
];

const Home = () => {
  const navigate = useNavigate();

  // Helper components
  const Container = ({ children }) => (
    <div className="mx-auto w-full max-w-6xl px-6">{children}</div>
  );

  const InventoryCard = ({ a }) => (
    <article className="overflow-hidden rounded-2xl border shadow-sm">
      <button
        onClick={() => navigate(a.url)}
        className="block w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        <img
          src={a.image}
          alt={`${a.year} ${a.make} ${a.model}`}
          loading="lazy"
          width={900}
          height={600}
          className="aspect-[3/2] w-full object-cover"
        />
      </button>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{a.year} {a.make} {a.model}</h3>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          <li>Serial {a.serial}</li>
          <li>{a.hours.toLocaleString()} hours total time</li>
          <li>{a.config}</li>
        </ul>
        <button
          onClick={() => navigate(a.url)}
          className="mt-3 inline-block text-sm font-medium underline"
          aria-label={`View details for ${a.year} ${a.make} ${a.model}`}
        >
          View Details
        </button>
      </div>
    </article>
  );

  const OffMarketCard = ({ t }) => (
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
        <button
          onClick={() => navigate(t.inquiry === 'charter' ? `/charter?model=${encodeURIComponent(t.model)}#quote` : `/buy?model=${encodeURIComponent(t.model)}`)}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          Tell us what you're looking for
        </button>
      </div>
    </article>
  );

  return (
    <>
      <Helmet>
        <title>PennJets — Private Jet Brokerage & Aviation Consulting</title>
        <meta name="description" content="PennJets is a private aviation brokerage and consulting firm specializing in aircraft sales, acquisitions, and charter brokerage. Partnering with vetted Part 135 operators. Call (973) 868‑8425." />
        <meta name="keywords" content="private aviation, aircraft brokerage, aviation consulting, charter broker, Premier 1A" />
        <meta property="og:title" content="PennJets — Private Jet Brokerage & Aviation Consulting" />
        <meta property="og:description" content="Private aviation. Done right. Brokerage, consulting, and charter connections." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.pennjets.com" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Schema.org structured data for better SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "PennJets",
            "url": "https://www.pennjets.com",
            "logo": "https://www.pennjets.com/images/PennJets-Website-Logo.png",
            "description": "Private aviation brokerage and consulting firm specializing in aircraft sales, acquisitions, and charter brokerage",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "690 SW 1st Ct #1030",
              "addressLocality": "Miami",
              "addressRegion": "FL",
              "postalCode": "33130",
              "addressCountry": "US"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-973-868-8425",
              "contactType": "Sales",
              "areaServed": "US",
              "availableLanguage": "English"
            },
            "email": "info@pennjets.com",
            "sameAs": [
              "https://www.pennjets.com"
            ]
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <header className="relative">
        <video
          src="/videos/Falcon-Hero-Flyover.MP4"
          autoPlay
          muted
          loop
          playsInline
          className="h-[60vh] w-full object-cover md:h-[80vh]"
        />
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div className="text-white">
              <h1 className="text-3xl font-semibold md:text-5xl">
                Access, You Deserve
              </h1>
              <p className="mt-3 max-w-2xl text-base md:text-lg">
                Independent aircraft brokerage and consulting. Buy, sell, or charter with someone who shows you the numbers.
              </p>
              <p className="mt-2 max-w-2xl text-sm text-white/85 md:text-base">
                Charter flights are arranged through vetted, FAA-certificated Part 135 operators across the United States.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/charter#quote')}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-gray-900 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white/80"
                >
                  Request a Charter Quote
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="rounded-2xl px-5 py-3 text-sm font-medium text-white ring-1 ring-white/70 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80"
                >
                  Talk to a Broker
                </button>
              </div>
            </div>
          </Container>
        </div>
      </header>

      {/* Inventory (real aircraft only; renders nothing while empty) */}
      {INVENTORY.length > 0 && (
        <section aria-labelledby="inventory" className="py-16">
          <Container>
            <h2 id="inventory" className="text-2xl font-semibold">Inventory</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {INVENTORY.map((a) => (
                <InventoryCard key={a.id} a={a} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Off-Market Access */}
      <section aria-labelledby="off-market" className="py-16">
        <Container>
          <h2 id="off-market" className="max-w-3xl text-2xl font-semibold">
            The best aircraft rarely reach the open market. Tell us your mission and we'll tell you what's available.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {OFF_MARKET_TYPES.map((t) => (
              <OffMarketCard key={t.id} t={t} />
            ))}
          </div>
          <p className="mt-6 text-xs text-gray-500">Representative aircraft types. Availability on request.</p>
        </Container>
      </section>

      {/* Why PennJets Section */}
      <section aria-labelledby="why" className="py-12">
        <Container>
          <h2 id="why" className="text-2xl font-semibold">Why PennJets</h2>
          <ul className="mt-4 grid list-disc gap-3 pl-5 sm:grid-cols-2">
            <li>Deal‑maker brokerage across light‑to‑midsize jets</li>
            <li>Transparent pro‑formas and lifecycle cost guidance</li>
            <li>Access to vetted Part 135 operators</li>
            <li>Fast, responsive, white‑glove service</li>
          </ul>
        </Container>
      </section>

      {/* Footer Section */}
      <footer className="mt-8 border-t">
        <Container>
          <div className="py-8 text-sm text-gray-700">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>
                <strong>Call:</strong> (973) 868‑8425 · <strong>Email:</strong>{" "}
                <a className="underline" href="mailto:inquiries@pennjets.com">
                  inquiries@pennjets.com
                </a>
              </p>
              <p>PennJets LLC — Private aviation. Simplified. Monetized.</p>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              PennJets is a broker and does not operate aircraft.
            </p>
          </div>
        </Container>
      </footer>
    </>
  );
};

export default Home;
