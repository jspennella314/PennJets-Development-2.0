import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../common/Card/Card';
import Button from '../../common/Button/Button';
import { blogApi } from '../../../services/blogApi';

const BlogArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogApi.getPost(slug);
      setArticle(data);
    } catch (err) {
      console.error('Error loading article:', err);
      setError('Article not found');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await blogApi.submitContactForm(article.author.id, formData, slug);
      setSubmitStatus('success');
      alert(`Thank you for your message! ${article.author.name} will contact you shortly.`);

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
    } catch (error) {
      console.error('Form submission failed:', error);
      setSubmitStatus('error');
      alert(`Sorry, there was an error sending your message. Please try again or contact ${article.author.name} directly at ${article.author.email}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32">
        <div className="max-w-4xl mx-auto container-padding text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white pt-32">
        <div className="max-w-4xl mx-auto container-padding text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📰</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" onClick={() => navigate('/blog')}>
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | PennJets Blog</title>
        <meta name="description" content={article.excerpt} />
        <meta name="keywords" content={article.tags?.join(', ')} />
        <meta name="author" content={article.author.name} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        {article.featuredImage && <meta property="og:image" content={article.featuredImage} />}
        <meta property="article:published_time" content={article.publishedAt} />
        <meta property="article:author" content={article.author.name} />

        {/* Schema.org Article */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.excerpt,
            "image": article.featuredImage,
            "datePublished": article.publishedAt,
            "author": {
              "@type": "Person",
              "name": article.author.name,
              "jobTitle": article.author.title
            },
            "publisher": {
              "@type": "Organization",
              "name": "PennJets",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.pennjets.com/images/PennJets-Website-Logo.png"
              }
            }
          })}
        </script>
      </Helmet>

      <div className="bg-white min-h-screen">
        {/* Article Header */}
        <article className="pt-32 pb-12">
          <div className="max-w-4xl mx-auto container-padding">
            {/* Breadcrumb */}
            <div className="mb-8">
              <button
                onClick={() => navigate('/blog')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                ← Back to Blog
              </button>
            </div>

            {/* Category & Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {article.category && (
                <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded">
                  {article.category}
                </span>
              )}
              {article.tags?.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                {article.author.avatar && (
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{article.author.name}</p>
                  <p className="text-xs">{article.author.title}</p>
                </div>
              </div>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
              {article.readTimeMinutes && (
                <>
                  <span>•</span>
                  <span>{article.readTimeMinutes} min read</span>
                </>
              )}
            </div>

            {/* Featured Image */}
            {article.featuredImage && (
              <div className="mb-12 rounded-xl overflow-hidden">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none mb-12
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-blockquote:border-l-4 prose-blockquote:border-primary-600 prose-blockquote:pl-6 prose-blockquote:italic
                prose-ul:list-disc prose-ul:pl-6
                prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-gray-700 prose-li:mb-2"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-8 border-t">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tagged:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Author Bio & Contact Form */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto container-padding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Author Bio */}
              <Card>
                <div className="flex items-start gap-4 mb-4">
                  {article.author.avatar && (
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{article.author.name}</h3>
                    <p className="text-primary-600 font-medium">{article.author.title}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{article.author.bio}</p>
                <a
                  href={`mailto:${article.author.email}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  {article.author.email}
                </a>
              </Card>

              {/* Contact Form */}
              <Card>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Contact {article.author.name.split(' ')[0]}
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Have questions about this article? Get in touch and I'll respond within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Your question or message..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>

        {/* Back to Blog */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto container-padding text-center">
            <Button variant="outline" onClick={() => navigate('/blog')}>
              ← Back to All Articles
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogArticle;
