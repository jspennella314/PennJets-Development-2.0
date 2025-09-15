import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button/Button';
import Card from '../../common/Card/Card';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: 'Aircraft Sales',
      description: 'Expert guidance through every step of selling your aircraft, maximizing value and minimizing time to market.',
      icon: '✈️',
      features: [
        'Comprehensive market analysis',
        'Professional marketing materials',
        'Global buyer network access',
        'Negotiation and closing support',
        'Legal and documentation assistance'
      ],
      id: 'sales'
    },
    {
      title: 'Aircraft Acquisition',
      description: 'Find the perfect aircraft with our extensive network and deep market knowledge.',
      icon: '🎯',
      features: [
        'Needs analysis and consultation',
        'Market research and options',
        'Pre-purchase inspections',
        'Financing coordination',
        'Delivery and acceptance'
      ],
      id: 'acquisition'
    },
    {
      title: 'Charter Services',
      description: 'Access premium charter flights through our curated network of certified operators.',
      icon: '🌍',
      features: [
        'On-demand charter flights',
        'Vetted operator network',
        '24/7 trip support',
        'Competitive pricing',
        'Safety-first approach'
      ],
      id: 'charter'
    },
    {
      title: 'Aircraft Management',
      description: 'Comprehensive management services to maximize your aircraft investment and minimize operational burden.',
      icon: '⚙️',
      features: [
        'Maintenance coordination',
        'Crew management',
        'Insurance and registration',
        'Financial reporting',
        'Charter revenue optimization'
      ],
      id: 'management'
    },
    {
      title: 'Market Analysis',
      description: 'In-depth market research and valuation services for informed decision making.',
      icon: '📊',
      features: [
        'Aircraft valuations',
        'Market trend analysis',
        'Competitive assessments',
        'Investment guidance',
        'Portfolio optimization'
      ],
      id: 'analysis'
    },
    {
      title: 'Consulting Services',
      description: 'Strategic aviation consulting for individuals and corporations.',
      icon: '💡',
      features: [
        'Fleet planning and optimization',
        'Cost-benefit analysis',
        'Regulatory compliance',
        'Tax and legal structuring',
        'Risk management'
      ],
      id: 'consulting'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Initial Consultation',
      description: 'We begin with a comprehensive discussion of your aviation needs, budget, and timeline.'
    },
    {
      step: '02',
      title: 'Analysis & Planning',
      description: 'Our team conducts thorough market research and develops a customized strategy for your requirements.'
    },
    {
      step: '03',
      title: 'Implementation',
      description: 'We execute the plan with precision, keeping you informed throughout every step of the process.'
    },
    {
      step: '04',
      title: 'Completion & Support',
      description: 'We ensure successful completion and provide ongoing support for your aviation needs.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Aviation Services - Aircraft Sales, Charter & Management | PennJets</title>
        <meta name="description" content="Comprehensive aviation services including aircraft sales, acquisitions, charter, management, and consulting. Expert guidance for all your private aviation needs." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-24 mt-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-lg mb-6">Our Services</h1>
            <p className="body-lg text-gray-300">
              Comprehensive aviation solutions tailored to meet your unique requirements, 
              backed by decades of industry expertise and global connections.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="h-full" id={service.id}>
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full mt-auto"
                  onClick={() => navigate('/contact')}
                >
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Our Process</h2>
            <p className="body-lg max-w-2xl mx-auto">
              A proven methodology that ensures exceptional results and client satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-md mb-6">Why Choose PennJets?</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">🏆</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Industry Leadership</h4>
                    <p className="text-gray-600">35+ years of experience in aviation brokerage</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">🌐</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Global Network</h4>
                    <p className="text-gray-600">Extensive connections worldwide for maximum market reach</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">🤝</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Personalized Service</h4>
                    <p className="text-gray-600">Dedicated specialists for every client relationship</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">📈</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Proven Results</h4>
                    <p className="text-gray-600">98% client satisfaction rate and repeat business</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-xl">Why Choose Us Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-lg mb-6">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-700">
              <p className="body-lg mb-6">
                Founded in 2025 by aviation enthusiast Joseph Pennella, PennJets began as a boutique brokerage with a simple mission: to provide unparalleled expertise and personalized service to clients seeking the finest aircraft in the world.
              </p>
              <p className="body-lg mb-6">
                With over three decades of experience in aviation, our founder brings deep industry knowledge and an extensive network of relationships that benefit every client. What started as a vision to revolutionize aircraft brokerage has grown into a trusted partner for discerning buyers and sellers worldwide.
              </p>
              <p className="body-lg">
                Today, PennJets continues to set the standard for excellence in aviation brokerage, combining traditional values of integrity and craftsmanship with modern technology and global reach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-hero-gradient text-white">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-lg mb-6">Ready to Get Started?</h2>
            <p className="body-lg text-primary-100 mb-8">
              Contact our team today to discuss your aviation needs and discover 
              how we can help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/contact')}
              >
                Contact Our Team
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-white border-white hover:bg-white hover:text-primary-600"
                onClick={() => navigate('/aircraft')}
              >
                View Aircraft
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;