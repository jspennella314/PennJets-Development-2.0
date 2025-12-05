import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Card from '../../common/Card/Card';
import Button from '../../common/Button/Button';
import { blogApi } from '../../../services/blogApi';

const NEWSLETTER_API = 'https://www.pennforce.pennjets.com/api/public/newsletter/subscribe';

const BlogList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  // Newsletter form state
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bot trap - must stay empty
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await blogApi.getPosts();
      setPosts(data);

      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(data.map(post => post.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleReadMore = (slug) => {
    navigate(`/blog/${slug}`);
  };

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

  return (
    <>
      <Helmet>
        <title>Aviation Insights & Industry News | PennJets Blog</title>
        <meta name="description" content="Stay informed with the latest aviation industry insights, aircraft reviews, market analysis, and expert guidance from PennJets aviation consultants." />
        <meta name="keywords" content="aviation blog, private jets, aircraft news, aviation insights, industry trends" />
        <meta property="og:title" content="PennJets Aviation Blog" />
        <meta property="og:description" content="Expert insights on private aviation, aircraft ownership, and industry trends" />
        <meta property="og:type" content="website" />
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

      {/* Articles Grid */}
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

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading articles...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
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
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500" style={{display: 'none'}}>
                        Article Image
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Category & Read Time */}
                    <div className="flex items-center space-x-2">
                      {post.category && (
                        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded">
                          {post.category}
                        </span>
                      )}
                      {post.readTimeMinutes && (
                        <span className="text-sm text-gray-500">{post.readTimeMinutes} min read</span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className="text-lg font-semibold text-gray-900 hover:text-primary-600 cursor-pointer"
                      onClick={() => handleReadMore(post.slug)}
                    >
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Author & Date */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                      <span>By {post.author.name}</span>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>

                    {/* Read More Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleReadMore(post.slug)}
                    >
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

export default BlogList;
