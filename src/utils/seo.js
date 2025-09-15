// SEO utility functions and constants

export const siteConfig = {
  siteName: 'PennJets',
  siteUrl: 'https://pennjets.com',
  description: 'Premier aviation brokerage services with 25+ years of experience. Buy, sell, and charter premium aircraft with confidence.',
  keywords: 'aviation brokerage, private jets, aircraft sales, charter services, luxury aircraft, aircraft management',
  author: 'PennJets',
  twitterHandle: '@PennJets',
  ogImage: '/og-image.jpg',
  favicon: '/favicon.ico'
};

export const generatePageTitle = (pageTitle) => {
  return pageTitle ? `${pageTitle} | ${siteConfig.siteName}` : siteConfig.siteName;
};

export const generateMetaDescription = (description) => {
  return description || siteConfig.description;
};

export const generateKeywords = (additionalKeywords = []) => {
  const baseKeywords = siteConfig.keywords.split(', ');
  return [...baseKeywords, ...additionalKeywords].join(', ');
};

export const generateStructuredData = (type, data) => {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    description: siteConfig.description,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'sales',
      availableLanguage: 'English'
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Aviation Boulevard',
      addressLocality: 'Teterboro',
      addressRegion: 'NJ',
      postalCode: '07608',
      addressCountry: 'US'
    }
  };

  return { ...baseStructuredData, ...data };
};

export const aircraftStructuredData = (aircraft) => {
  return generateStructuredData('Product', {
    name: `${aircraft.year} ${aircraft.manufacturer} ${aircraft.name}`,
    description: aircraft.description,
    category: aircraft.category,
    brand: {
      '@type': 'Brand',
      name: aircraft.manufacturer
    },
    offers: {
      '@type': 'Offer',
      price: aircraft.price,
      priceCurrency: 'USD',
      availability: aircraft.status === 'Available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  });
};