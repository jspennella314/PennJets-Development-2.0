import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Card from '../../common/Card/Card';
import Button from '../../common/Button/Button';
import { aircraftDatabase, manufacturers, categories, priceRanges } from '../../../data/aircraftData';

const AircraftListing = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    manufacturer: 'All',
    category: 'All',
    priceRange: 'All',
    status: 'All',
    search: ''
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Filter aircraft based on current filters
  const filteredAircraft = useMemo(() => {
    return aircraftDatabase.filter(aircraft => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = `${aircraft.manufacturer} ${aircraft.name} ${aircraft.model} ${aircraft.year}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) return false;
      }

      // Manufacturer filter
      if (filters.manufacturer !== 'All' && aircraft.manufacturer !== filters.manufacturer) {
        return false;
      }

      // Category filter
      if (filters.category !== 'All' && aircraft.category !== filters.category) {
        return false;
      }

      // Price range filter
      if (filters.priceRange !== 'All') {
        const selectedRange = priceRanges.find(range => range.label === filters.priceRange);
        if (selectedRange && (aircraft.price < selectedRange.min || aircraft.price > selectedRange.max)) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'All' && aircraft.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      manufacturer: 'All',
      category: 'All',
      priceRange: 'All',
      status: 'All',
      search: ''
    });
  };

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

  return (
    <>
      <Helmet>
        <title>Aircraft for Sale - Premium Private Jets | PennJets</title>
        <meta name="description" content="Browse our exclusive selection of premium private jets and aircraft for sale. Find your perfect aircraft with expert guidance from PennJets aviation specialists." />
      </Helmet>

      {/* Header Section */}
      <section className="bg-gray-900 text-white py-24 mt-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center">
            <h1 className="heading-lg mb-6">Aircraft for Sale</h1>
            <p className="body-lg max-w-2xl mx-auto text-gray-300">
              Discover our curated collection of premium aircraft. Each listing represents 
              exceptional quality, performance, and value in the luxury aviation market.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-6">
            {/* Search */}
            <div className="w-full lg:w-96">
              <input
                type="text"
                placeholder="Search aircraft..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <span className="sr-only">Grid view</span>
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <span className="sr-only">List view</span>
                ☰
              </button>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            <select
              value={filters.manufacturer}
              onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {manufacturers.map(manufacturer => (
                <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {priceRanges.map(range => (
                <option key={range.label} value={range.label}>{range.label}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Under Contract">Under Contract</option>
              <option value="Sold">Sold</option>
            </select>

            <Button variant="ghost" onClick={clearFilters} className="text-sm">
              Clear Filters
            </Button>
          </div>

          {/* Results Count */}
          <div className="text-gray-600">
            Showing {filteredAircraft.length} of {aircraftDatabase.length} aircraft
          </div>
        </div>
      </section>

      {/* Aircraft Grid/List */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          {filteredAircraft.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">✈️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No aircraft found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters to see more results.</p>
              <Button variant="primary" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
            }>
              {filteredAircraft.map((aircraft) => (
                <Card 
                  key={aircraft.id} 
                  className={`overflow-hidden ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
                >
                  <div className={`${viewMode === 'list' ? 'md:w-1/3' : 'w-full'} aspect-video bg-gray-200 rounded-lg ${viewMode === 'list' ? 'md:rounded-r-none mb-4 md:mb-0' : 'mb-4'} overflow-hidden`}>
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500">
                      Aircraft Image
                    </div>
                  </div>
                  
                  <div className={`${viewMode === 'list' ? 'md:w-2/3 md:pl-6' : ''} space-y-4`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {aircraft.year} {aircraft.manufacturer} {aircraft.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{aircraft.category}</p>
                        <p className="text-2xl font-bold text-primary-600">
                          {aircraft.priceFormatted}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(aircraft.status)}`}>
                        {aircraft.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">Range</div>
                        <div className="text-gray-600">{aircraft.specifications.range}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Passengers</div>
                        <div className="text-gray-600">{aircraft.specifications.passengers}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Speed</div>
                        <div className="text-gray-600">{aircraft.specifications.maxSpeed || aircraft.specifications.normalCruiseSpeed || aircraft.specifications.cruiseSpeed}</div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      📍 {aircraft.location}
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button 
                        variant="primary" 
                        size="md"
                        className="flex-1"
                        onClick={() => navigate(`/aircraft/${aircraft.id}`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="md"
                        onClick={() => navigate('/contact')}
                      >
                        Inquire
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h2 className="heading-md mb-6">Can't Find What You're Looking For?</h2>
          <p className="body-lg mb-8 max-w-2xl mx-auto">
            Our aviation specialists have access to an extensive network of off-market aircraft. 
            Let us help you find the perfect aircraft for your needs.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/contact')}
          >
            Contact Our Specialists
          </Button>
        </div>
      </section>
    </>
  );
};

export default AircraftListing;