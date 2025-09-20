import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../common/Button/Button';
import Card from '../../common/Card/Card';
import { aircraftDatabase } from '../../../data/aircraftData';

const AircraftDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aircraft, setAircraft] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const foundAircraft = aircraftDatabase.find(a => a.id === parseInt(id));
    setAircraft(foundAircraft);
    
    if (!foundAircraft) {
      navigate('/aircraft');
    }
  }, [id, navigate]);

  if (!aircraft) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✈️</div>
          <h2 className="text-2xl font-semibold mb-2">Aircraft not found</h2>
          <p className="text-gray-600 mb-6">The aircraft you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate('/aircraft')}>
            Back to Aircraft Listings
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Under Contract':
        return 'bg-yellow-100 text-yellow-800';
      case 'Sold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the inquiry to your backend
    console.log('Inquiry submitted:', inquiryForm);
    alert('Thank you for your inquiry! We will contact you shortly.');
    setShowInquiryForm(false);
    setInquiryForm({ name: '', email: '', phone: '', message: '' });
  };

  const handleInputChange = (field, value) => {
    setInquiryForm(prev => ({ ...prev, [field]: value }));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === aircraft.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? aircraft.images.length - 1 : prev - 1
    );
  };

  return (
    <>
      <Helmet>
        <title>{aircraft.year} {aircraft.manufacturer} {aircraft.name} - {aircraft.priceFormatted} | PennJets</title>
        <meta name="description" content={`${aircraft.year} ${aircraft.manufacturer} ${aircraft.name} for sale. ${aircraft.description}`} />
      </Helmet>

      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4 mt-16">
        <div className="max-w-7xl mx-auto container-padding">
          <nav className="text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-primary-600">Home</button>
            <span className="mx-2">/</span>
            <button onClick={() => navigate('/aircraft')} className="hover:text-primary-600">Aircraft</button>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{aircraft.year} {aircraft.manufacturer} {aircraft.name}</span>
          </nav>
        </div>
      </section>

      {/* Aircraft Header */}
      <section className="bg-white py-6 md:py-8">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {aircraft.year} {aircraft.manufacturer} {aircraft.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-lg md:text-xl text-gray-600">{aircraft.category}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(aircraft.status)}`}>
                  {aircraft.status}
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary-600 mb-3">
                {aircraft.priceFormatted}
              </div>
              <div className="flex items-center text-gray-600 mb-4 lg:mb-0">
                <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Located in {aircraft.location}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:flex-shrink-0">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => setShowInquiryForm(true)}
                disabled={aircraft.status === 'Sold'}
              >
                {aircraft.status === 'Sold' ? 'Sold' : 'Request Information'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => navigate('/contact')}
              >
                Schedule Viewing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                {aircraft.images.length > 0 ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-xl">
                    Aircraft Image {currentImageIndex + 1}
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500">
                    No Images Available
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              {aircraft.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              {aircraft.images.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {aircraft.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {aircraft.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {aircraft.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex
                        ? 'border-primary-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-xs text-gray-500">
                      {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Aircraft Details */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {aircraft.description}
                </p>
              </Card>

              {/* Specifications */}
              <Card>
                <h2 className="text-2xl font-semibold mb-6">Performance & Specifications</h2>

                {/* Performance Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-primary-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {aircraft.specifications.range || aircraft.specifications.maxRange || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Range</div>
                  </div>
                  <div className="bg-primary-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {aircraft.specifications.passengers || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Passengers</div>
                  </div>
                  <div className="bg-primary-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {aircraft.specifications.maxSpeed || aircraft.specifications.cruiseSpeed || aircraft.specifications.normalCruiseSpeed || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Max Speed</div>
                  </div>
                </div>

                {/* Detailed Specifications */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(aircraft.specifications)
                        .filter(([key]) => ['range', 'maxSpeed', 'cruiseSpeed', 'normalCruiseSpeed', 'longRangeCruiseSpeed', 'averageBlockSpeed', 'serviceCeiling', 'maxAltitude'].includes(key))
                        .map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <span className="text-gray-900 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Capacity & Dimensions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(aircraft.specifications)
                        .filter(([key]) => ['passengers', 'baggage', 'runway', 'fuelUsage'].includes(key))
                        .map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <span className="text-gray-900 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Features */}
              <Card>
                <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aircraft.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <Card>
                <h3 className="text-xl font-semibold mb-4">Quick Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year</span>
                    <span className="font-medium">{aircraft.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manufacturer</span>
                    <span className="font-medium">{aircraft.manufacturer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model</span>
                    <span className="font-medium">{aircraft.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{aircraft.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{aircraft.location}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Price</span>
                    <span className="font-bold text-primary-600">{aircraft.priceFormatted}</span>
                  </div>
                </div>
              </Card>

              {/* Contact Card */}
              <Card>
                <h3 className="text-xl font-semibold mb-4">Contact Specialist</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="font-medium">Aviation Specialist</div>
                    <div className="text-sm text-gray-600">Private Jet Expert</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>(555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>specialist@pennjets.com</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Available 24/7</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" onClick={() => navigate('/contact')}>
                      Contact Specialist
                    </Button>
                    <Button variant="ghost" className="w-full text-sm" onClick={() => setShowInquiryForm(true)}>
                      Quick Inquiry
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Additional Info Card */}
              <Card>
                <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Pre-purchase inspection available</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Financing options available</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Worldwide delivery service</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Expert consultation included</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Aircraft */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <h2 className="text-2xl font-semibold mb-8">Similar Aircraft</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aircraftDatabase
              .filter(a => a.id !== aircraft.id && (a.category === aircraft.category || a.manufacturer === aircraft.manufacturer))
              .slice(0, 3)
              .map((similarAircraft) => (
                <Card key={similarAircraft.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/aircraft/${similarAircraft.id}`)}>
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500">
                      Aircraft Image
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">
                      {similarAircraft.year} {similarAircraft.manufacturer} {similarAircraft.name}
                    </h3>
                    <p className="text-sm text-gray-600">{similarAircraft.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary-600">{similarAircraft.priceFormatted}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(similarAircraft.status)}`}>
                        {similarAircraft.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
          {aircraftDatabase.filter(a => a.id !== aircraft.id && (a.category === aircraft.category || a.manufacturer === aircraft.manufacturer)).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No similar aircraft available at this time.
            </div>
          )}
        </div>
      </section>

      {/* Inquiry Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Request Information</h3>
              <button 
                onClick={() => setShowInquiryForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={inquiryForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={inquiryForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={inquiryForm.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  value={inquiryForm.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder={`I'm interested in the ${aircraft.year} ${aircraft.manufacturer} ${aircraft.name}...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex space-x-3">
                <Button type="submit" variant="primary" className="flex-1">
                  Send Inquiry
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowInquiryForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AircraftDetail;