import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import LatestNote from './LatestNote';
import FeaturedListing from './FeaturedListing';
import { TILES, CHARTER_NOTE } from '../../../content/home';

// The page, Joseph's spec of 2026-10-21 (WO-4.52): hero (slogan, one line,
// one button) -> Buy / Sell / Charter tiles -> the newest Market Note -> a
// featured listing only when the CRM has one. The five representative
// aircraft cards moved to /aircraft ("Recent Inquiries", the data in
// src/content/recentInquiries.js); "Why PennJets" is gone, the tiles
// replace it.

const Container = ({ children }) => (
  <div className="mx-auto w-full max-w-6xl px-6">{children}</div>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <meta name="keywords" content="private aviation, aircraft brokerage, aviation consulting, charter broker, Premier 1A" />

        {/* Schema.org structured data for better SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Penn Jets",
            "url": "https://www.pennjets.com",
            "logo": "https://www.pennjets.com/images/pennjets-logo-192.png",
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
              "telephone": "+1-954-546-0763",
              "contactType": "Sales",
              "areaServed": "US",
              "availableLanguage": "English"
            },
            // was info@pennjets.com. This is the address search engines and
            // assistants surface as the way to reach the company. WO-4.20.
            "email": "joe@pennjets.com",
            "sameAs": [
              "https://www.pennjets.com"
            ]
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      {/*
        public/videos/ holds a second file, Falcon-Hero-Flyover3.mp4, that
        nothing references. It is 1,594,832 bytes and it ships in every build.

        KEEP IT. Joseph decided on 2026-09-20, after it was put forward for
        deletion: "keep it, I may use it." It is footage he shot himself.

        An unreferenced 1.5 MB video is exactly what an asset audit flags, so
        this note exists to be found before someone deletes it correctly and
        irreversibly. WO-4.21.
      */}
      <header className="relative">
        {/*
          Encoded from Joseph's phone original (public/videos/IMG_3379.MOV,
          git-ignored) at its full 1080x1920, H.264 High, ~1.9 Mbps, no audio.
          The footage is PORTRAIT: the file stores a 1920x1080 frame with a
          rotate-90 tag, so a probe reads it as landscape and a player shows it
          upright. The encode bakes the rotation in. WO-4.33 replaced the
          720x1280 export of the same clip that WO-4.19 had compressed.

          The poster is a 33 KB still of the same frame (0.6 s). It paints
          immediately and the heading sits on it, so first paint never waits on
          video even on a slow connection or where autoplay is refused. WO-4.19.
          aria-hidden because this is decoration; the heading below carries the
          meaning, and a silent three-second loop has nothing to describe.
        */}
        <video
          src="/videos/Falcon-Hero-Flyover-1080.mp4"
          poster="/videos/falcon-hero-poster-1080.webp"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="h-[60vh] w-full object-cover md:h-[80vh]"
        />
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
        {/* Centred in the hero below the fixed chrome (banner + header), so no
            part of the h1 sits under the header (WO-4.47 row 1). WO-4.49. */}
        <div
          className="absolute inset-0 flex items-center"
          style={{ paddingTop: 'calc(var(--pj-banner-h, 0px) + var(--pj-header-h, 64px))' }}
        >
          {/* Three elements and nothing else: the slogan (with the comma,
              everywhere it appears), one line, one button. WO-4.52. */}
          <Container>
            <div className="text-white">
              <h1 className="text-3xl font-semibold md:text-5xl">
                The Access, You Deserve
              </h1>
              <p className="mt-3 max-w-2xl text-base md:text-lg">
                Independent aircraft brokerage and consulting.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/charter#quote')}
                  className="min-h-[44px] rounded-2xl bg-white px-5 py-3 text-sm font-medium text-gray-900 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white/80"
                >
                  Request a Charter Quote
                </button>
              </div>
            </div>
          </Container>
        </div>
      </header>

      {/* Buy / Sell / Charter: each tile is the link, 44 px or more, stacked
          at 390 and one row from sm. The Part 135 line sits under Charter.
          Each item spans two rows of the list's grid (tile, note) through
          subgrid, so the three tiles share one height in the row while the
          note hangs under Charter alone. WO-4.52. */}
      <section aria-labelledby="paths" className="py-12 sm:py-16">
        <Container>
          <h2 id="paths" className="max-w-3xl text-2xl font-semibold">
            Buy, sell, or charter with someone who shows you the numbers.
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-3" data-home-tiles>
            {TILES.map((t) => (
              <li key={t.to} className="row-span-2 grid grid-rows-subgrid">
                <Link
                  to={t.to}
                  className="group flex min-h-[44px] flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  <span className="flex items-center justify-between text-lg font-semibold text-gray-900">
                    {t.title}
                    <span aria-hidden="true" className="text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-900">→</span>
                  </span>
                  <span className="mt-2 text-sm text-gray-600">{t.text}</span>
                </Link>
                {t.to === '/charter' && (
                  <p className="px-1 text-xs text-gray-500">{CHARTER_NOTE}</p>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* The newest Market Note, one compact card; renders nothing without one. WO-4.37. */}
      <LatestNote />

      {/* One real listing from the CRM, or nothing at all: no heading, no
          placeholder, no height while the inventory is empty. WO-4.52. */}
      <FeaturedListing />

    </>
  );
};

export default Home;
