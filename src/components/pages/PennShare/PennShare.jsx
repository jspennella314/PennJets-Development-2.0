import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button/Button';
import Card from '../../common/Card/Card';

const PennShare = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/contact');
  };

  return (
    <>
      <Helmet>
        <title>PennShare - Fractional Aircraft Ownership | PennJets</title>
        <meta name="description" content="Discover PennShare fractional aircraft ownership. Reduce costs, enjoy professional management, and access private aviation with flexible ownership options." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
                FRACTIONAL OWNERSHIP
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                PennShare
                <span className="block text-primary-600">Smart Ownership Solutions</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience private aviation through intelligent fractional ownership.
                Share the costs, not the convenience. Professional management included.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/contact')}
                >
                  Get Started Today
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/aircraft')}
                >
                  View Available Shares
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-primary-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Opportunity</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Aircraft:</span>
                    <span className="font-semibold text-gray-900">2006 Beechcraft Premier 1A</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Share Available:</span>
                    <span className="font-semibold text-gray-900">1/4 Ownership</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Investment:</span>
                    <span className="font-bold text-2xl text-primary-600">$300,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Annual Hours:</span>
                    <span className="font-semibold text-gray-900">100 Hours</span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  className="w-full mt-6"
                  onClick={() => navigate('/aircraft/3')}
                >
                  View Aircraft Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PennShare?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Intelligent fractional ownership that delivers all the benefits of private aviation with optimized economics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-8 h-full hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Cost-Effective
              </h3>
              <p className="text-gray-600">
                Share acquisition, operating, and maintenance costs while enjoying all the benefits of private aviation.
              </p>
            </Card>

            <Card className="text-center p-8 h-full hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Professional Management
              </h3>
              <p className="text-gray-600">
                PennJets handles all operational aspects including scheduling, maintenance, and regulatory compliance.
              </p>
            </Card>

            <Card className="text-center p-8 h-full hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Guaranteed Access
              </h3>
              <p className="text-gray-600">
                Enjoy priority booking and guaranteed aircraft availability with our advanced scheduling system.
              </p>
            </Card>

            <Card className="text-center p-8 h-full hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Flexible Exit
              </h3>
              <p className="text-gray-600">
                Clear buy-sell agreements and structured exit strategies protect your investment.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Aircraft Showcase */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/images/premier-1a-exterior.jpg"
                  alt="2006 Beechcraft Premier 1A"
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/600/400';
                  }}
                />
              </div>
            </div>

            <div>
              <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
                AVAILABLE NOW
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                2006 Beechcraft Premier 1A
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Experience exceptional performance and luxury in this meticulously maintained light jet.
                Perfect for business travel with advanced avionics and executive interior.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">1,460</div>
                  <div className="text-sm text-gray-600">Nautical Mile Range</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">6</div>
                  <div className="text-sm text-gray-600">Passenger Capacity</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">456</div>
                  <div className="text-sm text-gray-600">Cruise Speed (kts)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">41K</div>
                  <div className="text-sm text-gray-600">Service Ceiling (ft)</div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/aircraft/3')}
              >
                View Complete Details
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 lg:py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center text-white mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Inquire About PennShare
            </h2>
            <p className="text-xl text-primary-100">
              Take the first step toward intelligent aircraft ownership. Our team will contact you within 24 hours.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Level
                  </label>
                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select option</option>
                    <option value="1/4-share">1/4 Share Interest</option>
                    <option value="1/2-share">1/2 Share Interest</option>
                    <option value="full-ownership">Full Ownership</option>
                    <option value="information">General Information</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments
                </label>
                <textarea
                  name="comments"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Tell us about your aviation needs and timeline..."
                ></textarea>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  required
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <label htmlFor="consent" className="text-sm text-gray-600">
                  I consent to being contacted by PennJets regarding fractional ownership opportunities. *
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-semibold"
              >
                Send Inquiry
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default PennShare;