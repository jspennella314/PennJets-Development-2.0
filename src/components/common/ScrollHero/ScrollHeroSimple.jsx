import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ScrollHeroSimple = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrolled = window.scrollY;
      const maxScroll = window.innerHeight * 0.25; // Quarter scroll distance
      const progress = Math.min(scrolled / maxScroll, 1);

      document.documentElement.style.setProperty('--scroll-progress', progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <>
      <style>{`
        :root {
          --scroll-progress: 0;
        }

        .simple-hero {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 1;
        }

        .day-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('/images/day-flight.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .night-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('/images/night-flight.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: var(--scroll-progress);
          transition: opacity 0.1s ease;
        }

        .hero-content {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          text-align: center;
          color: white;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .hero-text h1 {
          font-size: 4rem;
          font-weight: 800;
          margin: 0 0 1rem 0;
        }

        .hero-text p {
          font-size: 1.25rem;
          margin: 0 0 2rem 0;
          max-width: 600px;
        }

        .hero-btn {
          background: rgba(255,255,255,0.2);
          border: 2px solid rgba(255,255,255,0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          backdrop-filter: blur(10px);
        }

        .hero-btn:hover {
          background: rgba(255,255,255,0.3);
        }

        .content-spacer {
          height: 60vh;
          background: linear-gradient(to bottom, transparent, #f3f4f6);
        }
      `}</style>

      <div className="simple-hero">
        <div className="day-bg"></div>
        <div className="night-bg"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h1>PennJets</h1>
          <p>Experience luxury aviation at 40,000 feet. From sunrise to city lights, we elevate your journey.</p>
          <button className="hero-btn" onClick={() => navigate('/aircraft')}>
            Explore Our Fleet
          </button>
        </div>
      </div>

      <div className="content-spacer"></div>
    </>
  );
};

export default ScrollHeroSimple;