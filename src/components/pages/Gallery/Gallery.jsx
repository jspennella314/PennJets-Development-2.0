import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Card from '../../common/Card/Card';
import Button from '../../common/Button/Button';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);

  useEffect(() => {
    // Load images from the blog directory
    // For now, we'll populate this manually as you add images
    loadImages();
  }, []);

  const loadImages = () => {
    // Images from public/images/Gallery/
    const galleryImages = [
      {
        id: 1,
        name: 'commercial.jpg',
        url: '/images/Gallery/commerical.jpg',
        category: 'Commercial',
        description: 'Commercial Aviation',
      },
      {
        id: 2,
        name: 'falcon.jpg',
        url: '/images/Gallery/falcon.jpg',
        category: 'Aircraft',
        description: 'Falcon Jet',
      },
      {
        id: 3,
        name: 'future-aviation.jpg',
        url: '/images/Gallery/future-aviation.jpg',
        category: 'Aviation',
        description: 'Future of Aviation',
      },
      {
        id: 4,
        name: 'gulfstream.jpg',
        url: '/images/Gallery/gulfstream.jpg',
        category: 'Aircraft',
        description: 'Gulfstream',
      },
      {
        id: 5,
        name: 'lukas-souza-V-0dyZEU3Pg-unsplash.jpg',
        url: '/images/Gallery/lukas-souza-V-0dyZEU3Pg-unsplash.jpg',
        category: 'Aviation',
        description: 'Private Jet',
      },
      {
        id: 6,
        name: 'pc12.jpg',
        url: '/images/Gallery/pc12.jpg',
        category: 'Aircraft',
        description: 'PC-12',
      },
      {
        id: 7,
        name: 'pj-interior.jpg',
        url: '/images/Gallery/pj-interior.jpg',
        category: 'Interior',
        description: 'Private Jet Interior',
      },
      {
        id: 8,
        name: 'sunset-jet.jpg',
        url: '/images/Gallery/sunset-jet.jpg',
        category: 'Aviation',
        description: 'Sunset Jet',
      },
    ];

    setImages(galleryImages);
  };

  const copyImageUrl = (url) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <>
      <Helmet>
        <title>Image Gallery | PennJets</title>
        <meta name="description" content="Browse and manage images for PennJets blog articles and content." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-24 mt-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-lg mb-6">Gallery</h1>
          </div>
        </div>
      </section>

      {/* Image Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          {images.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No images yet</h3>
              <p className="text-gray-600 mb-6">
                Add images to see them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="aspect-square bg-gray-200 cursor-pointer relative group overflow-hidden rounded-lg"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.description}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-5xl w-full">
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white text-xl hover:text-gray-300"
              >
                ✕ Close
              </button>

              <img
                src={selectedImage.url}
                alt={selectedImage.description}
                className="w-full h-auto max-h-[80vh] object-contain"
              />

              <div className="mt-4 bg-white p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{selectedImage.description}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  <code className="bg-gray-100 px-2 py-1 rounded">{selectedImage.url}</code>
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyImageUrl(selectedImage.url);
                  }}
                >
                  {copiedUrl === selectedImage.url ? '✓ URL Copied!' : 'Copy Image URL'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
