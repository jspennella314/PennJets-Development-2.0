import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import BonusDepreciationCountdown from '../../common/BonusDepreciationCountdown/BonusDepreciationCountdown';

const Home = () => {
  const navigate = useNavigate();

  // Aircraft data focused on Premier 1A
  const aircraft = [
    {
      id: "premier-1a",
      year: 2006,
      make: "Beechcraft",
      model: "Premier 1A",
      price: "$550K Share — Charter Revenue Offset",
      pax: 6,
      rangeNm: 1460,
      location: "Fort Lauderdale (FLL)",
      url: "/aircraft/3",
      image: "/images/PREMIER-1A-FEATURED.jpg",
      featured: true,
      blurb: "FLL-based • On Part 135 • Fast, efficient light jet",
    },
    {
      id: "hawker",
      year: 2003,
      make: "Hawker",
      model: "800XP",
      price: "$3,300,000",
      pax: 9,
      rangeNm: 2540,
      location: "Miami, FL",
      url: "/aircraft/1",
      image: "/images/PENNSHARE/HAWKER-800XP.jpg",
      featured: true,
      blurb: "Mid-size business jet • Executive interior",
    },
    {
      id: "cessna-182-share",
      year: 2006,
      make: "Cessna",
      model: "182",
      price: "$50,000 — 1/10th Share",
      pax: 4,
      rangeNm: 900,
      location: "TBD",
      url: "/aircraft/2",
      image: "/images/Cessna-182/CESSNA-182.jpg",
      featured: false,
      blurb: "1/10th ownership • Reliable touring aircraft",
    },
    {
      id: "diamond-1a",
      year: 1982,
      make: "Mitsubishi",
      model: "Diamond 1A",
      price: "$225,000 OBO",
      pax: 7,
      rangeNm: 1700,
      location: "Sanford, FL",
      url: "/aircraft/4",
      image: "/images/Diamond-1A/diamond-1a-ramp.JPEG",
      blurb: "Offered for parts • Strong spares platform",
    },
    {
      id: "baron-e55",
      year: 1979,
      make: "Beechcraft",
      model: "Baron E55",
      status: "SOLD",
      url: "/aircraft/baron-e55",
      image: "/images/E55-BARON-HOME/E55-BARON-HOME.JPEG",
      blurb: "Project aircraft • Trust signal tile",
    },
  ];


  // Helper components
  const Container = ({ children }) => (
    <div className="mx-auto w-full max-w-6xl px-6">{children}</div>
  );

  const Badge = ({ children }) => (
    <span className="inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-gray-900">
      {children}
    </span>
  );

  const AircraftCard = ({ a }) => {
    const isSold = a.status === "SOLD";
    return (
      <article className={`overflow-hidden rounded-2xl border shadow-sm ${
        a.featured ? "border-2 border-yellow-400 shadow-lg" : ""
      }`}>
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
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="aspect-[3/2] w-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500" style={{display: 'none'}}>
            Aircraft Image
          </div>
        </button>
        <div className="p-4">
          <div className="mb-2 flex items-center gap-2">
            {a.featured && <Badge>Featured</Badge>}
            {isSold && (
              <span className="text-xs font-semibold uppercase tracking-wide text-red-600">
                SOLD
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold">
            {a.year} {a.make} {a.model}
          </h3>
          <p className="text-sm text-gray-600">
            {a.price ?? (isSold ? "" : "Call for price")}
            {a.pax ? ` · ${a.pax} pax` : ""}
            {a.rangeNm ? ` · ~${a.rangeNm} nm` : ""}
          </p>
          {a.blurb && <p className="mt-1 text-sm text-gray-700">{a.blurb}</p>}
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
  };

  return (
    <>
      <Helmet>
        <title>PennJets — Private Jet Brokerage & Aviation Consulting</title>
        <meta name="description" content="PennJets is a private aviation brokerage and consulting firm specializing in aircraft sales, acquisitions, and charter brokerage. Partnering with vetted Part 135 operators. Call (973) 868‑8425." />
        <meta name="keywords" content="private aviation, aircraft brokerage, aviation consulting, charter broker, Premier 1A" />
        <meta property="og:title" content="PennJets — Private Jet Brokerage & Aviation Consulting" />
        <meta property="og:description" content="Private aviation. Done right. Brokerage, consulting, and charter connections." />
        <meta property="og:image" content="/images/og-hero.jpg" />
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
                Aviation consulting and brokerage — with our transparent costs
                and deal making team. We partner with vetted Part 135 certified
                operators throughout the Domestic US.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/aircraft/3')}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-gray-900 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white/80"
                >
                  Browse Premier 1A Share
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="rounded-2xl px-5 py-3 text-sm font-medium text-white ring-1 ring-white/70 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80"
                >
                  Get a Quote
                </button>
              </div>
            </div>
          </Container>
        </div>
      </header>

      {/* Featured Aircraft Section */}
      <section aria-labelledby="featured-aircraft" className="py-16">
        <Container>
          <h2 id="featured-aircraft" className="text-2xl font-semibold">
            Featured Aircraft
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {aircraft.map((a) => (
              <AircraftCard key={a.id} a={a} />
            ))}
          </div>
        </Container>
      </section>

      {/* Bonus Depreciation Countdown */}
      <BonusDepreciationCountdown />

      {/* Why PennJets Section */}
      <section aria-labelledby="why" className="py-12">
        <Container>
          <h2 id="why" className="text-2xl font-semibold">Why PennJets</h2>
          <ul className="mt-4 grid list-disc gap-3 pl-5 sm:grid-cols-2">
            <li>Deal‑maker brokerage across light‑to‑midsize jets</li>
            <li>Transparent pro‑formas and lifecycle cost guidance</li>
            <li>Access to vetted operators and maintenance networks</li>
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