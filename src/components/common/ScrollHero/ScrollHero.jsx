import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

const ScrollHero = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const starsRef = useRef(null);
  const starFieldRef = useRef([]);

  useEffect(() => {
    const root = document.documentElement;
    const hero = heroRef.current;
    const stars = starsRef.current;
    const ctx = stars.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function easeInOutQuad(x) {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }

    function setTFromScroll() {
      const rect = hero.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const start = Math.max(0, -rect.top);
      const distance = rect.height + viewH;
      let raw = start / distance;
      raw = Math.max(0, Math.min(1, raw));
      const t = easeInOutQuad(raw);
      root.style.setProperty('--scroll-t', t.toFixed(4));
    }

    function resizeCanvas() {
      const { width, height } = hero.getBoundingClientRect();
      stars.width = Math.floor(width * dpr);
      stars.height = Math.floor(height * dpr);
      stars.style.width = width + 'px';
      stars.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    }

    function buildStars() {
      const density = Math.max(80, Math.floor((window.innerWidth * window.innerHeight) / 4500));
      starFieldRef.current = Array.from({ length: density }, () => ({
        x: Math.random() * stars.clientWidth,
        y: Math.random() * stars.clientHeight,
        r: Math.random() * 1.2 + 0.3,
        tw: Math.random() * 0.6 + 0.2
      }));
    }

    function drawStars() {
      const w = stars.clientWidth;
      const h = stars.clientHeight;
      const t = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scroll-t')) || 0;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.fillStyle = '#ffffff';
      const twinkle = (Date.now() % 2000) / 2000;

      for (const s of starFieldRef.current) {
        const a = 0.15 + 0.85 * Math.abs(Math.sin((twinkle + s.tw) * Math.PI));
        ctx.globalAlpha = a * t;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function tick() {
      drawStars();
      requestAnimationFrame(tick);
    }

    // Initialize
    resizeCanvas();
    setTFromScroll();
    tick();

    // Event listeners
    const scrollHandler = () => setTFromScroll();
    const resizeHandler = () => {
      resizeCanvas();
      setTFromScroll();
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('resize', resizeHandler);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <>
      <style>{`
        :root {
          --scroll-t: 0;
        }

        .scroll-hero {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: clip;
          isolation: isolate;
        }

        .scroll-hero__img,
        .scroll-hero__img--night,
        .scroll-hero__stars,
        .scroll-hero__vignette,
        .scroll-hero__tint,
        .scroll-hero__grain {
          position: absolute;
          inset: 0;
        }

        .scroll-hero__img {
          background: linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #B0E0E6 100%);
          background-size: cover;
          background-position: center;
          will-change: transform;
          transform: scale(calc(1.02 + 0.03 * var(--scroll-t)));
        }

        .scroll-hero__img--night {
          background: linear-gradient(to bottom, #191970 0%, #000080 50%, #000000 100%);
          background-size: cover;
          background-position: center;
          will-change: opacity, filter, transform;
          opacity: var(--scroll-t);
          filter: brightness(calc(0.85 + 0.15 * var(--scroll-t))) contrast(calc(1.05 + 0.2 * var(--scroll-t)));
          transform: scale(calc(1.03 + 0.04 * var(--scroll-t)));
          transition: opacity 0.1s linear;
        }

        .scroll-hero__stars {
          pointer-events: none;
          opacity: calc(0 + 1 * var(--scroll-t));
          transition: opacity 0.15s linear;
        }

        .scroll-hero__vignette {
          pointer-events: none;
          background: radial-gradient(
            120vmax 90vmax at 50% 65%,
            rgba(0, 0, 0, calc(0.0 + 0.25 * var(--scroll-t))),
            rgba(0, 0, 0, calc(0.35 + 0.5 * var(--scroll-t)))
          );
        }

        .scroll-hero__tint {
          pointer-events: none;
          background: rgba(10, 12, 18, calc(0.0 + 0.30 * var(--scroll-t)));
        }

        .scroll-hero__grain {
          mix-blend-mode: overlay;
          opacity: calc(0.0 + 0.22 * var(--scroll-t));
          pointer-events: none;
          background-image: url('https://upload.wikimedia.org/wikipedia/commons/5/5f/Film_grain_overlay.png');
          background-size: 800px;
          animation: grain 7s steps(6) infinite;
        }

        @keyframes grain {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-1%, 1%); }
          50% { transform: translate(1%, 2%); }
          75% { transform: translate(-1%, -1%); }
          100% { transform: translate(0, 0); }
        }

        .scroll-hero__content {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 3;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 0 6vw;
          pointer-events: none;
        }

        .scroll-hero__content > div {
          pointer-events: auto;
        }

        .scroll-hero__badge {
          display: inline-block;
          padding: 8px 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 999px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.9;
          backdrop-filter: blur(8px);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          margin-bottom: 24px;
        }

        .scroll-hero__title {
          margin: 0 0 16px;
          font-size: clamp(32px, 6vw, 72px);
          line-height: 1.05;
          letter-spacing: -0.01em;
          font-weight: 800;
          color: white;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .scroll-hero__subtitle {
          margin: 0 auto 32px;
          max-width: 72ch;
          opacity: 0.95;
          font-size: clamp(16px, 1.8vw, 22px);
          color: white;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          line-height: 1.6;
        }

        .scroll-hero__cta {
          margin-top: 8px;
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-weight: 600;
          padding: 14px 28px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .scroll-hero__cta:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .scroll-hero__scroll-indicator {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          opacity: 0.8;
          animation: bounce 2s infinite;
          z-index: 4;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-10px); }
          60% { transform: translateX(-50%) translateY(-5px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-hero__img--night { transition: none; }
          .scroll-hero__scroll-indicator { animation: none; }
        }
      `}</style>

      <header className="scroll-hero" ref={heroRef}>
        <div className="scroll-hero__img" aria-hidden="true"></div>
        <div className="scroll-hero__img--night" aria-hidden="true"></div>
        <canvas className="scroll-hero__stars" ref={starsRef} aria-hidden="true"></canvas>
        <div className="scroll-hero__vignette" aria-hidden="true"></div>
        <div className="scroll-hero__tint" aria-hidden="true"></div>
        <div className="scroll-hero__grain" aria-hidden="true"></div>

        <div className="scroll-hero__content">
          <div>
            <span className="scroll-hero__badge">Premium Aviation</span>
            <h1 className="scroll-hero__title">PennJets</h1>
            <p className="scroll-hero__subtitle">
              Experience luxury aviation at 40,000 feet. From sunrise to city lights,
              we elevate your journey with unmatched service and expertise in private jet brokerage.
            </p>
            <Button
              className="scroll-hero__cta"
              variant="primary"
              onClick={() => navigate('/aircraft')}
            >
              Explore Our Fleet
            </Button>
          </div>
        </div>

        <div className="scroll-hero__scroll-indicator">
          <div style={{ fontSize: '24px' }}>↓</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>Scroll to explore</div>
        </div>
      </header>
    </>
  );
};

export default ScrollHero;