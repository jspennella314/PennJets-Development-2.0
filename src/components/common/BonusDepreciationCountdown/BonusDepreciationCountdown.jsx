import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

const BonusDepreciationCountdown = ({
  endDate = new Date('2025-12-31T23:59:59-05:00') // Dec 31, 2025 11:59 PM EST
}) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade-in animation on mount
    setIsVisible(true);

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = new Date(endDate).getTime();
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

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  const TimeBlock = ({ value, label }) => (
    <div className="flex flex-col items-center justify-center bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 min-w-[80px] md:min-w-[120px] border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300">
      <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2 tracking-tight">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );

  return (
    <section
      className={`section-padding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <div className="text-center mb-12">
          {/* Title with gold accent */}
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 text-yellow-500 text-sm font-semibold uppercase tracking-wider mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Limited Time Opportunity</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Countdown to 2025 Bonus Depreciation Deadline
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Take advantage of significant tax benefits with fractional aircraft ownership.
            Time is running out to maximize your 2025 deductions.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
          <TimeBlock value={timeRemaining.days} label="Days" />
          <TimeBlock value={timeRemaining.hours} label="Hours" />
          <TimeBlock value={timeRemaining.minutes} label="Minutes" />
          <TimeBlock value={timeRemaining.seconds} label="Seconds" />
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/pennshare')}
            className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Explore Fractional Ownership Options
          </Button>
          <p className="mt-4 text-sm text-gray-400">
            Act now to secure bonus depreciation benefits before the deadline
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <div className="text-2xl font-bold text-yellow-500 mb-2">100%</div>
            <div className="text-sm text-gray-300">Bonus Depreciation Available</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <div className="text-2xl font-bold text-yellow-500 mb-2">$550K</div>
            <div className="text-sm text-gray-300">Premier 1A Share Price</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <div className="text-2xl font-bold text-yellow-500 mb-2">6-8</div>
            <div className="text-sm text-gray-300">Passengers Capacity</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BonusDepreciationCountdown;
