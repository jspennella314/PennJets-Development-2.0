import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../../common/Button/Button';

// What the banner says on a given local date. Joseph's wording, verbatim
// with its full stop (2026-09-22); the year is read from the date, never
// typed. On 1 January, for that day only, the banner greets instead and
// the timer is hidden: counting 364 days to next December under a greeting
// reads oddly. That is the lead's reading of Joseph's instruction; showing
// the timer that day is a one-line change if he wants it. WO-4.29.
const bannerDateFor = (date) => ({
  year: date.getFullYear(),
  isNewYearsDay: date.getMonth() === 0 && date.getDate() === 1,
});

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({});
  const bannerRef = useRef(null);
  const [bannerHeight, setBannerHeight] = useState(0);
  const location = useLocation();

  // Determine if current page has a dark hero section
  const isDarkHeroPage = location.pathname === '/' || location.pathname === '/charter' || location.pathname === '/contact' || location.pathname === '/blog';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // The header used to be offset with hardcoded top-10 / top-16. The banner
  // above it is ~60px on a phone (the countdown stacks a number over a label)
  // but top-10 is only 40px, so the banner -- which is z-50 against the
  // header's z-40 -- sat over the top of the header and sliced the PennJets
  // logo in half. The banner's height also changes with the breakpoint and
  // when its contents wrap, so no fixed number is right at every width.
  // Measure it instead.
  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;

    const measure = () => setBannerHeight(el.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The year the banner names and the day it greets on, read from the clock
  // on every tick with the countdown, so a tab left open across midnight
  // follows the date. Starts from the real date so the first paint is right
  // (and so the prerendered HTML carries today's year). WO-4.29.
  const [bannerDate, setBannerDate] = useState(() => bannerDateFor(new Date()));

  // Countdown timer for bonus depreciation
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      // 31 December of the current year, 23:59:59, in the reader's local
      // time: built from parts, so the year is never a literal and the
      // target rolls over by itself on 1 January. The old literal
      // '2026-12-31T23:59:59' (no Z) was local time too; this keeps that, so
      // a reader in Florida does not see New Year at 19:00. WO-4.29.
      const endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      const difference = endDate - now;
      setBannerDate(bannerDateFor(now));

      if (difference > 0) {
        setTimeRemaining({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Aircraft', href: '/aircraft' },
    { name: 'Charter', href: '/charter' },
    { name: 'PennShare', href: '/pennshare' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Market Notes', href: '/blog' },
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Bonus Depreciation Countdown Banner */}
      <div
        ref={bannerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary-600 to-primary-800 text-white py-2 px-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm lg:text-base">
          <span className="font-semibold">
            {bannerDate.isNewYearsDay
              ? 'Happy New Year!'
              : `Days left to close a ${bannerDate.year} acquisition.`}
          </span>
          {!bannerDate.isNewYearsDay && (
          <div className="flex gap-3 font-mono">
            <div className="flex flex-col items-center">
              <span className="text-lg lg:text-xl font-bold">{timeRemaining.days || 0}</span>
              <span className="text-xs">Days</span>
            </div>
            <span className="text-lg lg:text-xl font-bold">:</span>
            <div className="flex flex-col items-center">
              <span className="text-lg lg:text-xl font-bold">{String(timeRemaining.hours || 0).padStart(2, '0')}</span>
              <span className="text-xs">Hours</span>
            </div>
            <span className="text-lg lg:text-xl font-bold">:</span>
            <div className="flex flex-col items-center">
              <span className="text-lg lg:text-xl font-bold">{String(timeRemaining.minutes || 0).padStart(2, '0')}</span>
              <span className="text-xs">Mins</span>
            </div>
            <span className="text-lg lg:text-xl font-bold hidden sm:inline">:</span>
            <div className="flex-col items-center hidden sm:flex">
              <span className="text-lg lg:text-xl font-bold">{String(timeRemaining.seconds || 0).padStart(2, '0')}</span>
              <span className="text-xs">Secs</span>
            </div>
          </div>
          )}
        </div>
      </div>

      <header
        // Sit flush beneath the banner when docked; on a dark hero the header
        // floats a little lower, but never higher than the banner's bottom
        // edge, which is what was clipping the logo.
        style={{ top: (isScrolled || !isDarkHeroPage) ? bannerHeight : Math.max(bannerHeight, 64) }}
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
          (isScrolled || !isDarkHeroPage) ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto container-padding">
          <div className="flex items-center justify-between h-16 lg:h-20 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center h-full">
            <img
              src="/images/pennjets-logo-192.png"
              alt="PennJets"
              className="h-12 lg:h-16 w-auto transition-all duration-300"
              style={{
                filter: (isScrolled || !isDarkHeroPage)
                  ? 'brightness(0) saturate(100%)'
                  : 'brightness(0) invert(1)'
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? (isScrolled || !isDarkHeroPage)
                      ? 'text-primary-600'
                      : 'text-primary-200'
                    : (isScrolled || !isDarkHeroPage)
                      ? 'text-gray-700 hover:text-primary-600'
                      : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
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
              className={`text-sm font-medium transition-colors ${
                (isScrolled || !isDarkHeroPage)
                  ? 'text-gray-700 hover:text-primary-700'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              (954) 546-0763
            </a>
            <Link to="/contact">
              <Button variant={(isScrolled || !isDarkHeroPage) ? 'primary' : 'outline'} size="md">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                (isScrolled || !isDarkHeroPage) ? 'text-gray-700' : 'text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-lg mt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
    </>
  );
};

export default Header;