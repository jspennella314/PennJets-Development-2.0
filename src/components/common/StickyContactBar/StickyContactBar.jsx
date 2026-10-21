import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PHONE_HREF, quoteTargetFor } from './quoteTarget';

// Two actions always within reach: call, or go to the inquiry form that fits
// the page you are on. WO-4.11.

const StickyContactBar = () => {
  const { pathname, hash } = useLocation();
  const target = quoteTargetFor(pathname);
  const barRef = useRef(null);
  // Hidden whenever something it must not cover is on screen: the footer, or a
  // form's submit button. Measured in WO-4.11 rather than assumed.
  const [obscuring, setObscuring] = useState(false);
  // Also hidden while a form field has focus: with the keyboard up the bar
  // otherwise sits over the next field (review row 6, WO-4.47 row 12). WO-4.49.
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const isField = (el) => !!el && el.matches && el.matches('form input, form select, form textarea');
    const onIn = (e) => { if (isField(e.target)) setTyping(true); };
    const onOut = (e) => { if (isField(e.target)) setTyping(isField(e.relatedTarget)); };
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    setTyping(isField(document.activeElement));
    return () => { document.removeEventListener('focusin', onIn); document.removeEventListener('focusout', onOut); };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return undefined;

    const watched = () => [
      ...document.querySelectorAll('footer'),
      ...document.querySelectorAll('form button[type="submit"], form button:not([type])'),
      // A step button that is not a submit but stands where one would (the
      // charter form's "Continue" at 390). WO-4.49.
      ...document.querySelectorAll('[data-sticky-watch]'),
    ];

    const visible = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setObscuring(visible.size > 0);
      },
      { rootMargin: '0px 0px 0px 0px', threshold: 0 }
    );

    // The page may still be fetching its content, so re-observe as it changes.
    let els = [];
    const attach = () => {
      io.disconnect();
      visible.clear();
      els = watched();
      els.forEach((el) => io.observe(el));
      setObscuring(false);
    };
    attach();
    const mo = new MutationObserver(() => {
      const next = watched();
      if (next.length !== els.length) attach();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname, hash]);

  const hidden = obscuring || typing;

  return (
    <div
      ref={barRef}
      data-sticky-contact-bar
      data-hidden={hidden ? 'true' : 'false'}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur transition-transform duration-200 ${
        hidden ? 'translate-y-full' : 'translate-y-0'
      }`}
      aria-hidden={hidden}
    >
      <div className="mx-auto flex max-w-6xl gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a
          href={PHONE_HREF}
          className="flex flex-1 items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
          tabIndex={hidden ? -1 : 0}
        >
          Call
        </a>
        {target.to.startsWith('#') ? (
          <a
            href={target.to}
            className="flex flex-1 items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-black"
            tabIndex={hidden ? -1 : 0}
          >
            {target.label}
          </a>
        ) : (
          <Link
            to={target.to}
            className="flex flex-1 items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-black"
            tabIndex={hidden ? -1 : 0}
          >
            {target.label}
          </Link>
        )}
      </div>
    </div>
  );
};

export default StickyContactBar;
