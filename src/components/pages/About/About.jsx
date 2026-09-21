import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button/Button';
import Card from '../../common/Card/Card';
import { JOSEPH_NAME, JOSEPH_TITLE, JOSEPH_BIO, JOSEPH_EMAIL, JOSEPH_PHONE } from '../../../content/joseph';

const About = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: JOSEPH_NAME,
      title: JOSEPH_TITLE,
      credentials: null,
      image: '/images/Meet-The-Team/joseph-pennella-256.webp',
      phone: JOSEPH_PHONE,
      email: JOSEPH_EMAIL,
      specialties: ['Aircraft Brokerage', 'Deal Structuring', 'Fractional Ownership']
    }
  ];



  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-24 mt-24">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-lg mb-6">About PennJets</h1>
            <p className="body-lg text-gray-300">
              Founded in 2025, PennJets is a private aviation sales and consulting firm.
              We connect clients with the right aircraft through straightforward advice
              and personal service.
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
                {/* Joseph's approved biography, from src/content/joseph.js. It
                    replaced "Founded in 2025 by Aviation Enthusiast Joseph
                    Pennella, Penn Jets LLC, an emerging aviation broker." which
                    gave him a different title from the rest of the site and had
                    no verb. Joseph's decision, 2026-09-20. */}
                <p>{JOSEPH_BIO}</p>
                <p>
                  Whether you're buying your first light jet, looking at fractional ownership,
                  or selling a legacy aircraft, PennJets provides the expertise and
                  negotiation power to get the deal done and protect your interests.
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
            <h2 className="heading-lg mb-4">Who You&apos;ll Work With</h2>
          </div>

          {/* Column count follows the roster. One person centres rather than
              sitting in the left third of an empty three-column grid. WO-4.24. */}
          <div
            className={`grid gap-8 ${
              teamMembers.length > 1 ? 'grid-cols-1 lg:grid-cols-3' : 'mx-auto max-w-md grid-cols-1'
            }`}
          >
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary-100">
                    {member.image && (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    )}
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-600 text-2xl font-semibold" style={{display: member.image ? 'none' : 'flex'}}>
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
                {member.credentials && (
                  <div className="text-sm text-gray-500 mb-3">
                    {member.credentials}
                  </div>
                )}

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
                Fractional shares structured by PennJets and flown by a licensed Part 135
                operator.
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
              Whether you're buying, selling, or connecting with charter operators, PennJets is ready to provide
              the expertise and personalized service you deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/contact')}
              >
                Contact PennJets
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/buy')}
              >
                Tell Us What You're Looking For
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;