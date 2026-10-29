import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../../common/Button/Button';

// What the banner says on a given local date. Joseph's wording (2026-09-22);
// the year is read from the date, never typed. On 1 January, for that day
// only, the banner greets instead and the count is hidden: counting 364 days
// to next December under a greeting reads oddly. That is the lead's reading
// of Joseph's instruction; showing the count that day is a one-line change if
// he wants it. WO-4.29.
const bannerDateFor = (date) => ({
  year: date.getFullYear(),
  isNewYearsDay: date.getMonth() === 0 && date.getDate() === 1,
});

// Whole days left until 31 December 23:59:59 local time, built from parts so
// the year is never a literal and the target rolls over on 1 January. WO-4.29.
const daysLeftFor = (now) => {
  const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
  return Math.max(0, Math.floor((end - now) / (1000 * 60 * 60 * 24)));
};

// The banner is dismissible, and the choice is kept per year so next year's
// banner is new. index.html reads the same key before first paint and hides
// the prerendered banner, so a returning reader never sees it flash. WO-4.49.
const bannerKey = (year) => `pj.banner.${year}.dismissed`;
const readDismissed = (year) => {
  try { return window.localStorage.getItem(bannerKey(year)) === '1'; } catch (e) { return false; }
};

// The chrome's heights live in two custom properties on <html>: the header
// docks at --pj-banner-h and html's scroll-padding-top adds --pj-header-h,
// so a field the browser scrolls to (Send with a required field empty, or
// focus) lands below the header on every route. index.html's dismissed rule
// overrides --pj-banner-h in the prerendered HTML. WO-4.49.
const setChromeVar = (name, px) => {
  if (typeof document !== 'undefined') document.documentElement.style.setProperty(name, `${px}px`);
};

// Joseph's order of 2026-10-20 (Round 7). Aircraft is out of the menu until a
// listing exists; /aircraft redirects to /buy (App.jsx). WO-4.49.
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Charter', href: '/charter' },
  { name: 'Buy', href: '/buy' },
  { name: 'Sell', href: '/sell' },
  { name: 'PennShare', href: '/pennshare' },
  { name: 'Consulting', href: '/consulting' },
  { name: 'About', href: '/about' },
  { name: 'Market Notes', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const bannerRef = useRef(null);
  const barRef = useRef(null);

  // The banner and its count. The count is whole days only, so nothing in the
  // chrome changes every second (the review's layout-shift row 17); a minute
  // tick is enough to follow midnight in a tab left open. WO-4.49.
  const [bannerDate, setBannerDate] = useState(() => bannerDateFor(new Date()));
  const [daysLeft, setDaysLeft] = useState(() => daysLeftFor(new Date()));
  const [dismissed, setDismissed] = useState(() => (typeof window === 'undefined' ? false : readDismissed(new Date().getFullYear())));

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setBannerDate(bannerDateFor(now));
      setDaysLeft(daysLeftFor(now));
    };
    tick();
    const timer = setInterval(tick, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // The countdown banner is on the home page only (Joseph, 2026-10-20).
  const showBanner = location.pathname === '/' && !dismissed;

  // Measure the banner when it is there and report 0 when it is not, so the
  // header docks at the top of every other route. Layout effects run before
  // paint, so the header and the banner move in the same frame.
  useLayoutEffect(() => {
    const el = bannerRef.current;
    if (!showBanner || !el) { setChromeVar('--pj-banner-h', 0); return undefined; }
    const measure = () => setChromeVar('--pj-banner-h', el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [showBanner]);

  // The header bar's own height (64 at 390, 80 from lg), not the header's:
  // the open drawer makes the header taller and must not move the padding.
  useLayoutEffect(() => {
    const el = barRef.current;
    if (!el) return undefined;
    const measure = () => setChromeVar('--pj-header-h', el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dismissBanner = () => {
    try { window.localStorage.setItem(bannerKey(bannerDate.year), '1'); } catch (e) { /* private mode: dismissed for this page view */ }
    // Dock the header now, in the click, so it moves up in the frame the
    // banner leaves, with no gap between them.
    setChromeVar('--pj-banner-h', 0);
    setDismissed(true);
  };

  const isActive = (href) => location.pathname === href;

  return (
    <>
      {showBanner && (
        <div
          ref={bannerRef}
          data-pj-banner
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary-600 to-primary-800 text-white"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center py-2 pl-4 pr-12 text-sm lg:text-base">
            <span className="font-semibold">
              {bannerDate.isNewYearsDay
                ? 'Happy New Year!'
                : `Days left to close a ${bannerDate.year} acquisition: ${daysLeft}`}
            </span>
          </div>
          <button
            type="button"
            onClick={dismissBanner}
            aria-label="Dismiss"
            className="absolute right-0 top-0 flex w-11 h-11 items-center justify-center text-white/90 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <header
        // Solid on every page and docked under the banner (0 off the home
        // page). The transparent, lower-floating state on dark heroes let the
        // home h1 climb under the logo and put a white logo on a white strip
        // on /contact (WO-4.47 rows 1 and §5). WO-4.49.
        style={{ top: 'var(--pj-banner-h, 0px)' }}
        className="fixed left-0 right-0 z-40 bg-white/95 backdrop-blur-lg shadow-lg"
      >
        <nav className="max-w-7xl mx-auto container-padding">
          <div ref={barRef} className="flex items-center justify-between gap-4 h-16 lg:h-20 py-2">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center h-full">
            <img
              src="/images/pennjets-logo-192.png"
              alt="Penn Jets"
              className="h-12 lg:h-16 w-auto"
              style={{ filter: 'brightness(0) saturate(100%)' }}
            />
          </Link>

          {/* Desktop Navigation: the same list as the drawer. Contact is the
              button at the end rather than a second link to the same page. */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-6">
            {navigation.filter((item) => item.href !== '/contact').map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`whitespace-nowrap text-sm xl:text-base font-medium transition-colors duration-200 ${
                  isActive(item.href) ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex shrink-0 items-center space-x-3 xl:space-x-4">
            {/*
              Joseph asked for the number in the header on every page. It is
              the third phone affordance alongside the sticky bar's Call action
              (WO-4.11) and the footer, which is noted in the WO-4.22 report
              rather than resolved here: he asked for this one, so the bar is
              not removed without him. Desktop only, because at 390 the sticky
              bar already puts Call under the reader's thumb.
            */}
            <a
              href="tel:+19545460763"
              className="whitespace-nowrap text-sm font-medium text-gray-700 transition-colors hover:text-primary-700"
            >
              (954) 546-0763
            </a>
            <Link to="/contact">
              <Button variant="primary" size="md" className="whitespace-nowrap">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Mobile menu button: a 44 px target with a name. */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              className="flex w-11 h-11 items-center justify-center rounded-lg text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation: every row a 44 px target; Contact is the last row. */}
        {isMobileMenuOpen && (
          <div className="lg:hidden" data-mobile-menu>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-lg mt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex min-h-[44px] items-center px-3 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
    </>
  );
};

export default Header;
