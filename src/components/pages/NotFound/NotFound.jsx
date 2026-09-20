import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <>
    <Helmet>
      <title>Page Not Found | PennJets</title>
      <meta name="robots" content="noindex" />
    </Helmet>
    <div className="min-h-[60vh] bg-white pt-32 pb-16">
      <div className="max-w-2xl mx-auto container-padding text-center">
        <p className="text-sm font-semibold text-primary-600 mb-2">404</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page not found</h1>
        <p className="text-gray-600 mb-8">
          That page doesn't exist or has moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-3 text-sm font-medium text-white hover:bg-primary-700">
            Go to the home page
          </Link>
          <Link to="/contact" className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  </>
);

export default NotFound;
