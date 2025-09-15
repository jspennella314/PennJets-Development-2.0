import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button/Button';
import Card from '../../common/Card/Card';

const About = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'James Peterson',
      title: 'Founder & CEO',
      bio: 'With over 25 years in aviation, James founded PennJets to provide unmatched expertise in the luxury aircraft market.',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Sarah Mitchell',
      title: 'VP of Sales',
      bio: 'Sarah brings 18 years of aviation sales experience, specializing in ultra-long-range aircraft transactions.',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Michael Rodriguez',
      title: 'Director of Acquisitions',
      bio: 'Michael leads our acquisition team with expertise in aircraft evaluation and market analysis.',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Emily Chen',
      title: 'Charter Operations Manager',
      bio: 'Emily oversees our charter operations with a focus on safety, compliance, and exceptional service.',
      image: '/api/placeholder/300/300'
    }
  ];

  const values = [
    {
      title: 'Integrity',
      description: 'We conduct business with the highest ethical standards and transparency.',
      icon: '🛡️'
    },
    {
      title: 'Excellence',
      description: 'We strive for perfection in every transaction and client interaction.',
      icon: '⭐'
    },
    {
      title: 'Expertise',
      description: 'Our deep industry knowledge ensures informed decisions and optimal outcomes.',
      icon: '🎯'
    },
    {
      title: 'Innovation',
      description: 'We embrace technology and new approaches to enhance the client experience.',
      icon: '🚀'
    }
  ];

  const milestones = [
    {
      year: '1998',
      title: 'Company Founded',
      description: 'PennJets established as a boutique aviation brokerage'
    },
    {
      year: '2005',
      title: 'First $100M Year',
      description: 'Achieved first $100 million in annual transactions'
    },
    {
      year: '2012',
      title: 'International Expansion',
      description: 'Expanded services to European and Asian markets'
    },
    {
      year: '2018',
      title: 'Charter Division Launch',
      description: 'Launched charter services to complement brokerage operations'
    },
    {
      year: '2023',
      title: '$2.5B Milestone',
      description: 'Surpassed $2.5 billion in lifetime transactions'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About PennJets - Premier Aviation Brokerage Since 1998</title>
        <meta name="description" content="Learn about PennJets' 25+ year history in aviation brokerage. Meet our expert team and discover why we're trusted for luxury aircraft transactions worldwide." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-24 mt-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-lg mb-6">About PennJets</h1>
            <p className="body-lg text-gray-300">
              Since 1998, PennJets has been at the forefront of luxury aviation, 
              connecting discerning clients with exceptional aircraft through unmatched 
              expertise and personalized service.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-md mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 1998 by aviation enthusiast James Peterson, PennJets began as a 
                  boutique brokerage with a simple mission: to provide unparalleled expertise 
                  and personalized service in the luxury aircraft market.
                </p>
                <p>
                  Over the past 25 years, we have evolved into one of the most respected names 
                  in aviation brokerage, facilitating over $2.5 billion in aircraft transactions 
                  and building lasting relationships with clients worldwide.
                </p>
                <p>
                  Our success is built on deep industry knowledge, unwavering integrity, and 
                  a commitment to excellence that permeates every aspect of our business. 
                  From first-time buyers to seasoned fleet owners, we provide the expertise 
                  and guidance needed to make informed decisions in the complex world of 
                  luxury aviation.
                </p>
              </div>
            </div>
            <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-xl">Company Story Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Our Values</h2>
            <p className="body-lg max-w-2xl mx-auto">
              The principles that guide everything we do and define who we are as a company.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Our Journey</h2>
            <p className="body-lg max-w-2xl mx-auto">
              Key milestones that have shaped our company and the aviation industry.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary-200"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="inline-block">
                      <div className="text-primary-600 font-bold text-lg mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {milestone.description}
                      </p>
                    </Card>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="relative z-10 w-4 h-4 bg-primary-600 rounded-full border-4 border-white"></div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gray-50" id="team">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Meet Our Team</h2>
            <p className="body-lg max-w-2xl mx-auto">
              Our experienced team of aviation professionals is dedicated to providing 
              exceptional service and expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Photo</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <div className="text-primary-600 font-medium mb-3">
                  {member.title}
                </div>
                <p className="text-gray-600 text-sm">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-primary-100">Years of Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Aircraft Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$2.5B+</div>
              <div className="text-primary-100">Total Transactions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-primary-100">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-lg mb-6">Ready to Work With Us?</h2>
            <p className="body-lg text-gray-600 mb-8">
              Whether you're buying, selling, or chartering, our team is ready to provide 
              the expertise and personalized service you deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/contact')}
              >
                Contact Our Team
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/aircraft')}
              >
                View Our Aircraft
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;