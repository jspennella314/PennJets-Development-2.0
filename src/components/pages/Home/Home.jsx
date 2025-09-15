import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Hero from '../../common/Hero/Hero';
import Card from '../../common/Card/Card';
import Button from '../../common/Button/Button';

const Home = () => {
  const navigate = useNavigate();

  const featuredAircraft = [
    {
      id: 1,
      name: 'Citation X+',
      manufacturer: 'Cessna',
      year: 2019,
      price: '$22,500,000',
      image: '/api/placeholder/400/300',
      specs: {
        range: '3,460 nm',
        passengers: '10-12',
        speed: '527 ktas'
      }
    },
    {
      id: 2,
      name: 'Gulfstream G650ER',
      manufacturer: 'Gulfstream',
      year: 2020,
      price: '$68,000,000',
      image: '/api/placeholder/400/300',
      specs: {
        range: '7,500 nm',
        passengers: '13-19',
        speed: '516 ktas'
      }
    },
    {
      id: 3,
      name: 'Falcon 8X',
      manufacturer: 'Dassault',
      year: 2021,
      price: '$58,000,000',
      image: '/api/placeholder/400/300',
      specs: {
        range: '6,450 nm',
        passengers: '12-16',
        speed: '488 ktas'
      }
    }
  ];

  const services = [
    {
      title: 'Aircraft Sales',
      description: 'Expert guidance through every step of selling your aircraft, from market analysis to closing.',
      icon: '✈️'
    },
    {
      title: 'Aircraft Acquisition',
      description: 'Find the perfect aircraft with our extensive network and deep market knowledge.',
      icon: '🎯'
    },
    {
      title: 'Charter Services',
      description: 'Access premium charter flights with our curated network of certified operators.',
      icon: '🌍'
    },
    {
      title: 'Aircraft Management',
      description: 'Comprehensive management services to maximize your aircraft investment.',
      icon: '⚙️'
    }
  ];

  const stats = [
    { number: '500+', label: 'Aircraft Sold' },
    { number: '25+', label: 'Years Experience' },
    { number: '$2.5B+', label: 'Total Transactions' },
    { number: '98%', label: 'Client Satisfaction' }
  ];

  return (
    <>
      <Helmet>
        <title>PennJets - Premier Aviation Brokerage Services</title>
        <meta name="description" content="Leading aviation brokerage with 25+ years of experience. Buy, sell, and charter premium aircraft with confidence. Expert guidance, global network." />
        <meta name="keywords" content="aviation brokerage, private jets, aircraft sales, charter services, luxury aircraft" />
      </Helmet>

      {/* Hero Section */}
      <Hero
        title="Elevate Your Aviation Experience"
        subtitle="Premier Aviation Brokerage"
        description="With over 25 years of expertise, we connect discerning clients with the world's finest aircraft. From acquisition to management, trust PennJets for unparalleled service in luxury aviation."
        backgroundImage="/api/placeholder/1920/1080"
        primaryAction={{
          text: 'Browse Aircraft',
          onClick: () => navigate('/aircraft')
        }}
        secondaryAction={{
          text: 'Contact Us',
          onClick: () => navigate('/contact')
        }}
      />

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Aircraft Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-lg text-gray-900 mb-4">
              Featured Aircraft
            </h2>
            <p className="body-lg max-w-2xl mx-auto">
              Discover our handpicked selection of premium aircraft, each representing 
              the pinnacle of luxury, performance, and craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAircraft.map((aircraft, index) => (
              <Card 
                key={aircraft.id} 
                className="overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500">
                    Aircraft Image
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {aircraft.year} {aircraft.manufacturer} {aircraft.name}
                    </h3>
                    <p className="text-2xl font-bold text-primary-600 mt-2">
                      {aircraft.price}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">Range</div>
                      <div className="text-gray-600">{aircraft.specs.range}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Passengers</div>
                      <div className="text-gray-600">{aircraft.specs.passengers}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Speed</div>
                      <div className="text-gray-600">{aircraft.specs.speed}</div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/aircraft/${aircraft.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/aircraft')}
            >
              View All Aircraft
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-lg text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="body-lg max-w-2xl mx-auto">
              Comprehensive aviation solutions tailored to meet your unique requirements, 
              backed by decades of industry expertise and global connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/services')}
            >
              Learn More About Our Services
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-hero-gradient">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-lg text-white mb-6">
              Ready to Take Flight?
            </h2>
            <p className="body-lg text-primary-100 mb-8">
              Whether you're looking to buy, sell, or charter, our team of aviation 
              experts is here to guide you through every step of your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/contact')}
              >
                Get Started Today
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-white border-white hover:bg-white hover:text-primary-600"
                onClick={() => navigate('/aircraft')}
              >
                Browse Aircraft
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;