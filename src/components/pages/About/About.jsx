import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button/Button';
import Card from '../../common/Card/Card';

const About = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'Joseph Pennella',
      title: 'Founder & CEO',
      bio: 'Aviation enthusiast and founder of PennJets LLC, dedicated to making private aviation accessible, profitable, and hassle-free.',
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
                  Founded in 2025 by aviation enthusiast Joseph Pennella, PennJets LLC is a
                  boutique aircraft brokerage and management firm dedicated to making private
                  aviation accessible, profitable, and hassle-free for owners and flyers.
                </p>
                <p>
                  Whether you're buying your first light jet, looking for fractional ownership
                  with 100% bonus depreciation, or liquidating a legacy aircraft, PennJets
                  provides the expertise, negotiation power, and end-to-end management to
                  maximize your return and minimize your risk.
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2025</div>
              <div className="text-primary-100">Year Founded</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
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