// Where the sticky bar's two actions go. Kept out of the component file so the
// component module exports only a component. WO-4.11.

// The number in the site footer. There is a second number used elsewhere on
// the site; reconciling the two is a copy item for Joseph, and the order says
// not to introduce a second number here.
export const PHONE_DISPLAY = '(954) 546-0763';
export const PHONE_HREF = 'tel:+19545460763';

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
  if (p === '/contact') return { to: '/contact', label: 'Request a Quote' };

  // A Market Note has its own broker form at the foot of the page.
  if (p.startsWith('/blog/')) return { to: '#talk-to-a-broker', label: 'Talk to a Broker' };

  // Browsing aircraft is a buying intent.
  if (p === '/aircraft' || p.startsWith('/aircraft/')) return { to: '/buy', label: 'Request a Quote' };

  // Home and the service overview lead with charter, the highest-volume path.
  if (p === '/' || p === '/services') return { to: '/charter#quote', label: 'Request a Quote' };

  return { to: '/contact', label: 'Request a Quote' };
}
