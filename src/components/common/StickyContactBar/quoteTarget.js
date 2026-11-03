// Where the sticky bar's two actions go. Kept out of the component file so the
// component module exports only a component. WO-4.11.

// The site's one number, (201) 241-2749 since WO-4.58.
export const PHONE_DISPLAY = '(201) 241-2749';
export const PHONE_HREF = 'tel:+12012412749';

// "Request a Quote" goes to the inquiry form that fits the page, most specific
// first, falling back to /contact.
export function quoteTargetFor(pathname) {
  const p = (pathname || '/').replace(/\/+$/, '') || '/';

  // Already on an inquiry page: point at its own form.
  if (p === '/charter') return { to: '/charter#quote', label: 'Request a Quote' };
  if (p === '/buy') return { to: '/buy', label: 'Request a Quote' };
  if (p === '/sell') return { to: '/sell', label: 'Request a Quote' };
  if (p === '/consulting') return { to: '/consulting', label: 'Request a Quote' };
  if (p === '/pennshare') return { to: '/pennshare#inquire', label: 'Request a Quote' };
  // On /contact, "Request a Quote" pointed at /contact itself and did nothing;
  // it goes to the charter quote form, as on the home page. WO-4.58 §4.
  if (p === '/contact') return { to: '/charter#quote', label: 'Request a Quote' };

  // A Market Note has its own broker form at the foot of the page.
  if (p.startsWith('/blog/')) return { to: '#talk-to-a-broker', label: 'Talk to a Broker' };

  // Home leads with charter, the highest-volume path.
  if (p === '/') return { to: '/charter#quote', label: 'Request a Quote' };

  return { to: '/contact', label: 'Request a Quote' };
}
