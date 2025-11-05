import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../../common/Button/Button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({});
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

  // Countdown timer for bonus depreciation
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const endDate = new Date('2025-12-31T23:59:59');
      const now = new Date();
      const difference = endDate - now;

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
    { name: 'Blog', href: '/blog' },
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Bonus Depreciation Countdown Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary-600 to-primary-800 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm lg:text-base">
          <span className="font-semibold">100% Bonus Depreciation Ending:</span>
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
        </div>
      </div>

      <header className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
        (isScrolled || !isDarkHeroPage) ? 'top-10 bg-white/95 backdrop-blur-lg shadow-lg' : 'top-16 bg-transparent'
      }`}>
        <nav className="max-w-7xl mx-auto container-padding">
          <div className="flex items-center justify-between h-20 lg:h-24 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/images/PennJets-Website-Logo.png"
              alt="PennJets"
              className="h-24 lg:h-30 w-auto transition-all duration-300"
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