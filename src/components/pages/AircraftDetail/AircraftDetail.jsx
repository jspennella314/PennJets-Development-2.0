import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { aircraftDatabase } from '../../../data/aircraftData';

const AircraftDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aircraft, setAircraft] = useState(null);

  useEffect(() => {
    const foundAircraft = aircraftDatabase.find(a => a.id === parseInt(id));
    setAircraft(foundAircraft);

    if (!foundAircraft) {
      navigate('/aircraft');
    }
  }, [id, navigate]);

  if (!aircraft) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4">✈️</div>
          <h2 className="text-2xl font-semibold mb-2">Aircraft not found</h2>
          <p className="text-gray-600 mb-6">The aircraft you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/aircraft')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Aircraft Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-4 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
            <span className="mx-2">/</span>
            <button onClick={() => navigate('/aircraft')} className="hover:text-blue-600">Aircraft</button>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{aircraft.year} {aircraft.manufacturer} {aircraft.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {aircraft.year} {aircraft.manufacturer} {aircraft.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xl text-gray-600">{aircraft.category}</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {aircraft.status}
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              {aircraft.priceFormatted}
            </div>
            <div className="text-gray-600">
              📍 Located in {aircraft.location}
            </div>
          </div>

          {/* Image Section */}
          <div className="mb-8">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              {aircraft.id === 3 ? (
                <img
                  src="/images/PENNSHARE/PREMIER-1A.jpg"
                  alt={`${aircraft.year} ${aircraft.manufacturer} ${aircraft.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-xl" style={{display: aircraft.id === 3 ? 'none' : 'flex'}}>
                Aircraft Image
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {aircraft.description}
                </p>
              </div>

              {/* Specifications */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(aircraft.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aircraft.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Quick Info */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Price</span>
                    <span className="font-bold text-blue-600">{aircraft.priceFormatted}</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Specialist</h3>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="font-medium">Aviation Specialist</div>
                  <div className="text-sm text-gray-600">Private Jet Expert</div>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <div>📞 (555) 123-4567</div>
                  <div>✉️ specialist@pennjets.com</div>
                </div>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Contact Specialist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AircraftDetail;