export const aircraftDatabase = [
  {
    id: 4,
    name: '1A',
    manufacturer: 'Mitsubishi',
    model: 'Diamond 1A',
    year: 1982,
    price: 0,
    priceFormatted: 'Under Contract',
    category: 'Light Jet',
    status: 'Under Contract',
    location: 'Sanford, FL',
    images: [],
    specifications: {
      engines: '2× Pratt & Whitney JT15D-4D',
      thrust: '2,200 lbf each',
      tbo: '3,500 hours',
      range: '1,512 nm',
      cruiseSpeed: '404 kts (75% power)',
      serviceCeiling: '41,000 ft',
      rateOfClimb: '3,050 ft/min',
      fuelCapacity: '655 gal',
      passengers: '7',
      wingspan: '44.5 ft',
      length: '48.4 ft',
      height: '13.74 ft',
      emptyWeight: '9,099 lbs',
      grossWeight: '14,630 lbs',
      takeoffDistance: '5,050 ft',
      landingDistance: '4,600 ft'
    },
    features: [
      '2× Pratt & Whitney JT15D-4D Engines',
      'Twin Jet Configuration',
      '3,500 Hour TBO',
      'Offered for Parts',
      '655 Gallon Fuel Capacity',
      'Strong Spares Platform'
    ],
    description: 'This 1982 Mitsubishi Diamond 1A is being offered for parts. Located in Sanford, FL, this aircraft represents a unique opportunity for parts acquisition or restoration project. Full listing details and additional photos available on Aircraft Shopper Online.',
    tradeAPlaneUrl: 'https://www.aso.com/listings/spec/ViewAd.aspx?id=200889&listingType=true&IsInternal=True&pagingNo=1&searchId=62389252&dealerid='
  },
  {
    id: 3,
    name: '1A',
    manufacturer: 'Beechcraft',
    model: 'Premier 1A',
    year: 2006,
    price: null,
    priceFormatted: 'Price on request (1/4 share)',
    category: 'Light Jet',
    status: 'Available',
    location: 'Miami, FL',
    images: [
      '/images/PREMIER-1A-FEATURED.jpg',
      '/images/premier-1a-cabin.jpg',
      '/images/premier-1a-seating.jpg',
    ],
    specifications: {
      range: '1,460 nm',
      averageBlockSpeed: '390 kts',
      normalCruiseSpeed: '456 kts',
      longRangeCruiseSpeed: '420 kts',
      fuelUsage: '215 gal/hr',
      serviceCeiling: '41,000 ft',
      passengers: '6',
      baggage: '53 cu ft',
      runway: '3,560 ft'
    },
    features: [
      'Rockwell Collins Pro Line 21 Avionics',
      'Executive Interior Configuration',
      'Enclosed Lavatory',
      'Galley with Refreshment Center',
      'Climate Control System',
      'LED Cabin Lighting',
      'Leather Seating'
    ],
    description: 'This 2006 Beechcraft Premier 1A is a sophisticated light jet offering exceptional performance and comfort. With its composite construction and advanced avionics, it delivers impressive speed and efficiency for business travel. The spacious cabin features executive seating and modern amenities. Available as a 1/4 share ownership.'
  },
  {
    id: 5,
    name: 'E55',
    manufacturer: 'Beechcraft',
    model: 'E55 Baron',
    year: 1979,
    price: 0,
    priceFormatted: 'SOLD',
    category: 'Piston Prop',
    status: 'Sold',
    location: 'Miami, FL',
    images: [
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
    ],
    specifications: {
      range: '950 nm',
      maxSpeed: '220 kts',
      cruiseSpeed: '200 kts',
      maxAltitude: '20,000 ft',
      passengers: '5-6',
      baggage: '15 cu ft',
      runway: '2,500 ft'
    },
    features: [
      'Piston Twin Engine',
      'Multi-Engine Configuration',
      'Standard Avionics'
    ],
    description: 'This 1979 Beechcraft E55 Baron has been sold. A reliable piston twin-engine aircraft that provided excellent training and personal transportation capabilities.'
  }
];

export const manufacturers = [
  'All',
  'Beechcraft',
  'Mitsubishi'
];

export const categories = [
  'All',
  'Piston Single',
  'Piston Prop',
  'Light Jet',
  'Mid-Size'
];

export const priceRanges = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under $500K', min: 0, max: 500000 },
  { label: '$500K - $1M', min: 500000, max: 1000000 },
  { label: '$1M - $5M', min: 1000000, max: 5000000 },
  { label: 'Over $5M', min: 5000000, max: Infinity }
];