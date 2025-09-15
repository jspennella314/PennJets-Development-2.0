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
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="heading-lg mb-2">
                {aircraft.year} {aircraft.manufacturer} {aircraft.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xl text-gray-600">{aircraft.category}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(aircraft.status)}`}>
                  {aircraft.status}
                </span>
              </div>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {aircraft.priceFormatted}
              </div>
              <div className="text-gray-600">
                📍 Located in {aircraft.location}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => setShowInquiryForm(true)}
                disabled={aircraft.status === 'Sold'}
              >
                {aircraft.status === 'Sold' ? 'Sold' : 'Request Information'}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
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
          <div className="relative mb-8">
            {/* Main Image */}
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
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                >
                  →
                </button>
              </>
            )}

            {/* Image Indicators */}
            {aircraft.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {aircraft.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
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
                <h2 className="text-2xl font-semibold mb-6">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(aircraft.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
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
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                    <div className="font-medium">Aviation Specialist</div>
                    <div className="text-sm text-gray-600">Private Jet Expert</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>📞 (555) 123-4567</div>
                    <div>✉️ specialist@pennjets.com</div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/contact')}>
                    Contact Specialist
                  </Button>
                </div>
              </Card>
            </div>
          </div>
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