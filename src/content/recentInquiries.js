// Representative aircraft types Penn Jets has recently sourced, evaluated or
// been asked about. Typical seats and range only: no year, serial, hours,
// price or badge. Images: white-tail cutouts in /public/images/aircraft/
// (WebP, one per type). Moved from the home page's Off-Market section to
// /aircraft, "Recent Inquiries" (Joseph, 2026-10-21). WO-4.52.
//
// `inquiry: 'charter'` sends that card to the charter form instead of Buy,
// as it did on the home page.
export const OFF_MARKET_TYPES = [
  { id: 'falcon-900',  model: 'Falcon 900',   category: 'Large cabin', seats: 12, rangeNm: 4000, image: '/images/aircraft/falcon-900.webp' },
  { id: 'premier-1a',  model: 'Premier 1A',   category: 'Light jet',   seats: 6,  rangeNm: 1400, image: '/images/aircraft/premier-1a.webp', inquiry: 'charter' },
  { id: 'hawker-800xp', model: 'Hawker 800XP', category: 'Midsize',    seats: 8,  rangeNm: 2500, image: '/images/aircraft/hawker-800xp.webp' },
  { id: 'hawker-400xp', model: 'Hawker 400XP', category: 'Light jet',  seats: 7,  rangeNm: 1500, image: '/images/aircraft/hawker-400xp.webp' },
  { id: 'citation-ii', model: 'Citation II',  category: 'Light jet',   seats: 7,  rangeNm: 1700, image: '/images/aircraft/citation-ii.webp' },
];

// The page's lead line. Copy for Joseph's approval at the WO-4.52 report.
export const LEAD_LINE =
  'Aircraft Penn Jets has recently sourced, evaluated or been asked about. These are not exclusive listings; availability and pricing are confirmed at inquiry.';

export const inquiryHref = (t) => (t.inquiry === 'charter'
  ? `/charter?model=${encodeURIComponent(t.model)}#quote`
  : `/buy?model=${encodeURIComponent(t.model)}`);
