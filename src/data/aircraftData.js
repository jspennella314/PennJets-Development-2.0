export const aircraftDatabase = [
  {
    id: 1,
    name: '800XP',
    manufacturer: 'Hawker',
    model: '800XP',
    year: 2003,
    price: 3300000,
    priceFormatted: '$3,300,000',
    category: 'Mid-Size',
    status: 'Available',
    location: 'Miami, FL',
    images: [
      '/images/Hawker-night - Copy.jpg',
      '/images/Hawker-night - Copy.jpg',
      '/images/Hawker-night - Copy.jpg',
    ],
    specifications: {
      range: '2,540 nm',
      averageBlockSpeed: '419 kts',
      normalCruiseSpeed: '419 kts',
      longRangeCruiseSpeed: '392 kts',
      fuelUsage: '281 gal/hr',
      serviceCeiling: '41,000 ft',
      passengers: '9',
      baggage: '50 cu ft',
      runway: '5,000 ft'
    },
    features: [
      'Collins Pro Line 21 Avionics',
      'Executive Interior',
      'Enclosed Lavatory',
      'Refreshment Center',
      'Climate Control System'
    ],
    description: 'The Hawker 800XP is a proven mid-size business jet offering excellent performance and reliability. With its spacious cabin and impressive range, it provides an ideal solution for regional and transcontinental travel.'
  },
  {
    id: 4,
    name: '1A',
    manufacturer: 'Mitsubishi',
    model: 'Diamond 1A',
    year: 1982,
    price: 225000,
    priceFormatted: '$225,000 OBO',
    category: 'Light Jet',
    status: 'Available',
    location: 'Sanford, FL',
    images: [
      '/images/Diamond-1A/diamond-1a-ramp.JPEG',
      '/images/Diamond-1A/diamond-1a-ramp.JPEG',
    ],
    specifications: {
      range: '1,700 nm',
      maxSpeed: '340 kts',
      cruiseSpeed: '320 kts',
      maxAltitude: '35,000 ft',
      passengers: '7',
      baggage: '25 cu ft',
      runway: '3,800 ft'
    },
    features: [
      'Basic Avionics Package',
      'Standard Interior',
      'Offered for Parts'
    ],
    description: 'This 1982 Mitsubishi Diamond 1A is being offered for parts. Located in Sanford, FL, this aircraft represents a unique opportunity for parts acquisition or restoration project. Full listing details and additional photos available on Trade-A-Plane.',
    tradeAPlaneUrl: 'https://www.trade-a-plane.com/search?category_level1=Jets&make=MITSUBISHI&model=DIAMOND+1A&listing_id=2447075&s-type=aircraft'
  },
  {
    id: 3,
    name: '1A',
    manufacturer: 'Beechcraft',
    model: 'Premier 1A',
    year: 2006,
    price: 550000,
    priceFormatted: '$550,000 (1/4 Share)',
    category: 'Light Jet',
    status: 'Available',
    location: 'Miami, FL',
    images: [
      '/images/PREMIER-1A-FEATURED.jpg',
      '/images/premier-1a-hangar.jpg',
      '/images/premier-1a-entry.jpg',
      '/images/premier-1a-cabin.jpg',
      '/images/premier-1a-seating.jpg',
      '/images/premier-1a-hangar - Copy.jpg',
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
    id: 2,
    name: '182',
    manufacturer: 'Cessna',
    model: '182 Skylane',
    year: 2006,
    price: 50000,
    priceFormatted: '$50,000 (1/10th Share)',
    category: 'Piston Single',
    status: 'Available',
    location: 'TBD',
    images: [
      '/images/Cessna-182/CESSNA-182.jpg',
      '/images/Cessna-182/CESSNA-182.jpg',
      '/images/Cessna-182/CESSNA-182.jpg',
    ],
    specifications: {
      range: '915 nm',
      maxSpeed: '182 kts',
      cruiseSpeed: '145 kts',
      maxAltitude: '18,100 ft',
      passengers: '4',
      baggage: '120 lbs',
      runway: '1,365 ft'
    },
    features: [
      'Garmin G1000 Glass Cockpit',
      'Fixed Landing Gear',
      'High Wing Configuration',
      'Fuel Injection',
      'Club Seating',
      'Cargo Door Access'
    ],
    description: 'This 2006 Cessna 182 Skylane represents an excellent opportunity for fractional ownership. As a 1/10th share, you gain access to one of aviation\'s most reliable and versatile single-engine aircraft. Perfect for personal transportation, training, or recreational flying. The 182 is known for its forgiving flight characteristics, spacious cabin, and excellent load-carrying capability.'
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
  'Cessna',
  'Hawker',
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