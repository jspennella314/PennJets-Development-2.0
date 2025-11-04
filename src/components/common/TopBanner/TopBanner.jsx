import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TopBanner = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = new Date('2025-12-31T23:59:59-05:00').getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 py-2 px-4 text-center z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-yellow-500/95 backdrop-blur-lg shadow-md'
        : 'bg-yellow-500/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 text-sm md:text-base">
        <span className="font-semibold text-gray-900">
          Bonus Depreciation Deadline:
        </span>

        {/* Countdown Timer */}
        <div className="flex items-center gap-1 font-mono font-bold text-gray-900">
          <span className="bg-gray-900 text-yellow-400 px-2 py-0.5 rounded">
            {String(timeRemaining.days).padStart(3, '0')}d
          </span>
          <span className="bg-gray-900 text-yellow-400 px-2 py-0.5 rounded">
            {String(timeRemaining.hours).padStart(2, '0')}h
          </span>
          <span className="bg-gray-900 text-yellow-400 px-2 py-0.5 rounded">
            {String(timeRemaining.minutes).padStart(2, '0')}m
          </span>
          <span className="hidden sm:inline bg-gray-900 text-yellow-400 px-2 py-0.5 rounded">
            {String(timeRemaining.seconds).padStart(2, '0')}s
          </span>
        </div>

        <button
          onClick={() => navigate('/pennshare')}
          className="underline font-semibold hover:text-white transition-colors text-gray-900"
        >
          Learn More →
        </button>
      </div>
    </div>
  );
};

export default TopBanner;
