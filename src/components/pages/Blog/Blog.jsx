import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Card from '../../common/Card/Card';
import Button from '../../common/Button/Button';

const NEWSLETTER_API = 'https://www.pennforce.pennjets.com/api/public/newsletter/subscribe';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Newsletter form state
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bot trap - must stay empty
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    // Don't submit if honeypot is filled (bot detected)
    if (honeypot) return;

    if (!email || !email.includes('@')) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch(NEWSLETTER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, honeypot }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({ type: 'success', message: 'Thank you for subscribing!' });
        setEmail('');
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Subscription failed. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['All', 'Market Insights', 'Aircraft Reviews', 'Industry News', 'Buying Guide', 'Maintenance'];

  const blogPosts = [
    {
      id: 1,
      title: 'The State of the Private Jet Market in 2024',
      excerpt: 'An in-depth analysis of current market trends, pricing, and what buyers and sellers can expect in the luxury aviation sector.',
      category: 'Market Insights',
      author: 'James Peterson',
      date: '2024-01-15',
      readTime: '8 min read',
      image: '/api/placeholder/600/400',
      featured: true
    },
    {
      id: 2,
      title: 'Gulfstream G700: The New Standard in Ultra-Long Range',
      excerpt: 'Our comprehensive review of Gulfstream\'s latest flagship, including performance specs, cabin features, and market positioning.',
      category: 'Aircraft Reviews',
      author: 'Sarah Mitchell',
      date: '2024-01-12',
      readTime: '6 min read',
      image: '/api/placeholder/600/400',
      featured: false
    },
    {
      id: 3,
      title: 'First-Time Buyer\'s Guide to Private Aircraft Ownership',
      excerpt: 'Everything you need to know before purchasing your first private jet, from financing options to operational considerations.',
      category: 'Buying Guide',
      author: 'Michael Rodriguez',
      date: '2024-01-10',
      readTime: '12 min read',
      image: '/api/placeholder/600/400',
      featured: true
    },
    {
      id: 4,
      title: 'Sustainable Aviation: The Future of Private Flying',
      excerpt: 'Exploring eco-friendly alternatives and sustainability initiatives shaping the future of private aviation.',
      category: 'Industry News',
      author: 'Emily Chen',
      date: '2024-01-08',
      readTime: '5 min read',
      image: '/api/placeholder/600/400',
      featured: false
    },
    {
      id: 5,
      title: 'Maximizing Your Aircraft\'s Resale Value',
      excerpt: 'Expert tips on maintenance, upgrades, and documentation that can significantly impact your aircraft\'s market value.',
      category: 'Maintenance',
      author: 'James Peterson',
      date: '2024-01-05',
      readTime: '7 min read',
      image: '/api/placeholder/600/400',
      featured: false
    },
    {
      id: 6,
      title: 'Charter vs. Ownership: Making the Right Choice',
      excerpt: 'A detailed comparison to help you decide whether aircraft ownership or charter services better suit your travel needs.',
      category: 'Buying Guide',
      author: 'Sarah Mitchell',
      date: '2024-01-03',
      readTime: '9 min read',
      image: '/api/placeholder/600/400',
      featured: false
    }
  ];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Helmet>
        <title>Aviation Insights & Industry News | PennJets Blog</title>
        <meta name="description" content="Stay informed with the latest aviation industry insights, aircraft reviews, market analysis, and expert guidance from PennJets aviation consultants." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-24 mt-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-lg mb-6">Aviation Insights</h1>
            <p className="body-lg text-gray-300">
              Stay informed with the latest industry trends, aircraft reviews, and expert 
              insights from our team of aviation professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto container-padding">
            <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500">
                      Featured Article Image
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                      {post.title}
                    </h3>
                    <p className="text-gray-600">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {post.author}</span>
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'All' ? 'Latest Articles' : selectedCategory}
            </h2>
            <span className="text-gray-600">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">Try selecting a different category.</p>
              <Button variant="primary" onClick={() => setSelectedCategory('All')}>
                View All Articles
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500">
                      Article Image
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {post.author}</span>
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Read More
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-primary-100 mb-8">
              Subscribe to our newsletter for the latest aviation insights, market updates,
              and exclusive industry analysis delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              {/* Honeypot field - hidden from users, bots will fill it */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ position: 'absolute', left: '-9999px' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-300 focus:outline-none disabled:opacity-50"
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="md"
                  className="px-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
              {submitStatus.message && (
                <p className={`text-sm mt-3 ${submitStatus.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                  {submitStatus.message}
                </p>
              )}
            </form>
            <p className="text-xs text-primary-200 mt-4">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;