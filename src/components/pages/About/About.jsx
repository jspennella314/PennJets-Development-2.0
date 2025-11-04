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
      title: 'Managing Director',
      credentials: 'Aviation Entrepreneur',
      bio: 'Aviation enthusiast and founder of PennJets LLC, dedicated to making private aviation accessible, profitable, and hassle-free. With a passion for deal-making and client success, Joseph brings innovative approaches to aircraft brokerage and fractional ownership.',
      image: '/images/Meet-The-Team/JOSEPH-PENNELLA.JPEG',
      phone: '(973) 868-8425',
      email: 'joe@pennjets.com',
      specialties: ['Aircraft Brokerage', 'Deal Structuring', 'Fractional Ownership']
    },
    {
      name: 'Steven J Smyth',
      title: 'Partner Operator Liaison',
      credentials: 'KLM Aviation - Est. 1991',
      bio: 'Partner Operator Liaison and Captain at KLM Aviation, established in 1991. Brings over three decades of aviation expertise to the PennJets partnership network. Coordinates with Part 135 certified operators to ensure the highest standards of safety, compliance, and service for PennJets clients.',
      image: '/images/Meet-The-Team/steven-smyth.jpg',
      phone: '(954) 881-4799',
      email: 'steven@pennjets.com',
      specialties: ['Operator Coordination', 'Safety Standards', 'Quality Assurance', 'Compliance Oversight']
    },
    {
      name: 'Charles Brennan',
      title: 'Chief Technology Officer',
      credentials: 'Technology & Innovation Leader',
      bio: 'Chief Technology Officer driving digital innovation and technological advancement at PennJets. Specializes in aviation technology integration, digital platforms, and modernizing private aviation operations through cutting-edge solutions and strategic technology implementation.',
      image: '/images/Meet-The-Team/CHARLES-BRENNAN.JPEG',
      phone: '(908) 655-7075',
      email: 'charles@pennjets.com',
      specialties: ['Aviation Technology', 'Digital Innovation', 'System Integration', 'Data Analytics']
    },
    {
      name: 'James Wofford',
      title: 'Aviation Consultant',
      credentials: 'Private Aviation Advisor',
      bio: 'James Wofford is a results-driven leader with a foundation in Aviation Management from Auburn University and a proven track record in sales, operations, and project leadership. With experience managing multimillion-dollar initiatives and leading cross-functional teams across industries—from aviation and energy efficiency to healthcare consulting—James combines strategic planning and data-driven decision-making to drive efficiency and growth. Known for his ability to streamline operations and enhance client satisfaction, he brings a disciplined, aviation-inspired approach to leadership and performance optimization.',
      image: '/images/Meet-The-Team/james-wofford.jpg',
      phone: '(310) 994-4060',
      email: 'jameswofford@pennjets.com',
      specialties: ['Aircraft Sales', 'Client Advisory', 'Market Analysis', 'Transaction Management']
    },
    {
      name: 'Joe Delisio',
      title: 'Aviation Consultant',
      credentials: 'Private Aviation Advisor',
      bio: 'Experienced aviation consultant focused on helping clients navigate aircraft acquisitions and sales. Joe provides personalized service and strategic guidance throughout the entire transaction process.',
      image: '/images/Meet-The-Team/joe-delisio.jpg',
      phone: '(954) 546-0763',
      email: 'joedelisio@pennjets.com',
      specialties: ['Aircraft Acquisitions', 'Client Relations', 'Deal Negotiation', 'Market Intelligence']
    },
    {
      name: 'Aviation Team',
      title: 'Specialists & Support',
      credentials: 'Industry Professionals',
      bio: 'Our extended team includes certified mechanics, avionics specialists, insurance experts, and administrative professionals who ensure every aspect of your aviation needs is handled with expertise and attention to detail.',
      image: '/images/Meet-The-Team/aviation-team.jpg',
      phone: '(954) 546-0763',
      email: 'info@pennjets.com',
      specialties: ['Maintenance', 'Avionics', 'Insurance', 'Administration']
    }
  ];



  return (
    <>
      <Helmet>
        <title>About PennJets - Premier Aviation Brokerage Since 1998</title>
        <meta name="description" content="Learn about PennJets' 25+ year history in aviation brokerage. Meet our expert team and discover why we're trusted for luxury aircraft transactions worldwide." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-24 mt-24">
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
                  Founded in 2025 by Aviation Enthusiast Joseph Pennella, Penn Jets LLC, an
                  emerging aviation broker.
                </p>
                <p>
                  Whether you're buying your first light jet, looking for fractional ownership
                  with 100% bonus depreciation, or liquidating a legacy aircraft, PennJets
                  provides the expertise, negotiation power, and end-to-end management to
                  maximize your return and minimize your risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Team Section */}
      <section className="section-padding bg-white" id="team">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Meet Our Team</h2>
            <p className="body-lg max-w-2xl mx-auto">
              Our experienced team of aviation professionals is dedicated to providing
              exceptional service and expertise in every aspect of private aviation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-600 text-2xl font-semibold" style={{display: 'none'}}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <div className="text-primary-600 font-medium mb-1">
                  {member.title}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  {member.credentials}
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {member.bio}
                </p>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.specialties.map((specialty, idx) => (
                      <span key={idx} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full font-medium">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-t pt-4 text-sm text-gray-600">
                  <div className="mb-1">📞 {member.phone}</div>
                  <div>✉️ {member.email}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Expertise Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Collective Expertise</h2>
            <p className="body-lg max-w-3xl mx-auto">
              Our team brings together decades of combined experience across all aspects
              of private aviation, from aircraft operations to deal structuring.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">30+</div>
              <div className="text-sm text-gray-600">Years Combined Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Client Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Services Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Professional Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="text-4xl mb-4">🛩️</div>
              <h3 className="text-xl font-semibold mb-3">Aircraft Brokerage</h3>
              <p className="text-gray-600 text-sm">
                Expert guidance through buying and selling processes with market insights
                and negotiation expertise.
              </p>
            </Card>
            <Card className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3">Fractional Ownership</h3>
              <p className="text-gray-600 text-sm">
                Smart ownership solutions with professional management and charter revenue
                opportunities.
              </p>
            </Card>
            <Card className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3">Charter Brokerage</h3>
              <p className="text-gray-600 text-sm">
                Access to vetted Part 135 certified operators with experienced pilots and
                well-maintained aircraft through our trusted partner network.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-lg mb-6">Ready to Work With Us?</h2>
            <p className="body-lg text-gray-600 mb-8">
              Whether you're buying, selling, or connecting with charter operators, our team is ready to provide
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