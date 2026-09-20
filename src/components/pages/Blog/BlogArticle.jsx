import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../common/Card/Card';
import Button from '../../common/Button/Button';
import NewsletterSignup from '../../common/NewsletterSignup/NewsletterSignup';
import NoteBody from './NoteBody';
import { blogApi } from '../../../services/blogApi';
import { articleMeta } from '../../../seo/siteMeta';
import { categoryFor, formatNoteDate, relatedNotes } from '../../../utils/marketNotes';

const BlogArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Related notes come from the list endpoint; a failure here must not affect
  // the article, so the list simply stays empty and the section does not render.
  useEffect(() => {
    let cancelled = false;
    blogApi
      .getPosts()
      .then((posts) => { if (!cancelled) setAllNotes(posts || []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // View beacon: fire once per article view, after the article has rendered.
  // Guards: the loaded article must match the current slug (so a slug change does
  // not fire against the previous article), and the same slug never fires twice
  // for this mounted component (React StrictMode double-runs effects in dev).
  const viewedSlugRef = useRef(null);
  useEffect(() => {
    if (!article || article.slug !== slug) return;
    if (viewedSlugRef.current === slug) return;
    viewedSlugRef.current = slug;
    blogApi.recordView(slug);
  }, [article, slug]);

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await blogApi.submitContactForm(article.author.id, formData, slug, article.author.email);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32">
        <div className="max-w-4xl mx-auto container-padding text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white pt-32">
        <div className="max-w-4xl mx-auto container-padding text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Note Not Found</h1>
          <p className="text-gray-600 mb-6">
            That Market Note doesn&apos;t exist or has been removed.
          </p>
          <Button variant="primary" onClick={() => navigate('/blog')}>
            Back to Market Notes
          </Button>
        </div>
      </div>
    );
  }

  const seo = articleMeta(article);
  const category = categoryFor(article);
  const related = relatedNotes(allNotes, article, 3);
  const authorFirstName = article.author?.name?.split(' ')[0] || 'us';

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={article.tags?.join(', ')} />
        <meta name="author" content={article.author.name} />
        <link rel="canonical" href={seo.url} />

        {/* Open Graph / Twitter */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={seo.url} />
        <meta property="og:image" content={seo.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.image} />
        <meta property="article:published_time" content={article.publishedAt} />
        <meta property="article:author" content={article.author.name} />

        {/* Schema.org Article */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": seo.description,
            "image": seo.image,
            "mainEntityOfPage": seo.url,
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
        <article className="pt-28 pb-4 sm:pt-32">
          {/* Headline block */}
          <header className="max-w-3xl mx-auto container-padding">
            <div className="mb-6">
              <button
                onClick={() => navigate('/blog')}
                className="text-sm font-medium text-primary-700 hover:text-primary-800"
              >
                ← Back to Market Notes
              </button>
            </div>

            {/* Category label and date, above the headline. A note with no
                category shows no label. */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {category && (
                <>
                  <button
                    onClick={() => navigate(`/blog?category=${category.slug}`)}
                    className="font-semibold uppercase tracking-wide text-primary-700 hover:text-primary-800"
                  >
                    {category.label}
                  </button>
                  <span className="text-gray-300" aria-hidden="true">·</span>
                </>
              )}
              <time dateTime={article.publishedAt} className="text-gray-500">
                {formatNoteDate(article.publishedAt)}
              </time>
              {article.readTimeMinutes && (
                <>
                  <span className="text-gray-300" aria-hidden="true">·</span>
                  <span className="text-gray-500">{article.readTimeMinutes} min read</span>
                </>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            {/* Byline */}
            <div className="mt-8 flex items-center gap-4 border-t border-gray-200 pt-6">
              {article.author.avatar ? (
                <img
                  src={article.author.avatar}
                  alt=""
                  width={96}
                  height={96}
                  loading="lazy"
                  className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                  {article.author.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-gray-900">{article.author.name}</p>
                <p className="text-sm text-gray-500">{article.author.title}</p>
              </div>
            </div>
          </header>

          {/* Hero image, fixed crop */}
          {article.featuredImage && (
            <div className="mt-10 max-w-4xl mx-auto container-padding">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100">
                {/* A note's image is set in the CRM and may point at a file this
                    repo no longer ships; degrade to the empty panel, never to a
                    broken-image icon. */}
                <img
                  src={article.featuredImage}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
          )}

          {/* Body: lede, paragraphs, optional pull quote and sourced statistic */}
          <div className="mt-10 max-w-3xl mx-auto container-padding">
            <NoteBody html={article.content} />

            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 border-t border-gray-200 pt-6">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* 1. Talk to a Broker */}
        <section className="mt-16 bg-gray-50 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto container-padding">
            <div className="mx-auto mb-8 max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Talk to a Broker
              </h2>
              <p className="mt-2 text-gray-600">
                Questions about this note, or about an aircraft? Send {authorFirstName} a
                message and you&apos;ll hear back within one business day.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Card>
                <div className="flex items-start gap-4 mb-4">
                  {article.author.avatar && (
                    <img
                      src={article.author.avatar}
                      alt=""
                      width={96}
                      height={96}
                      loading="lazy"
                      className="h-16 w-16 flex-shrink-0 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{article.author.name}</h3>
                    <p className="font-medium text-primary-700">{article.author.title}</p>
                  </div>
                </div>
                <p className="mb-4 text-gray-700">{article.author.bio}</p>
                <div className="flex flex-col gap-2 text-sm">
                  <a href={`mailto:${article.author.email}`} className="font-medium text-primary-700 hover:text-primary-800">
                    {article.author.email}
                  </a>
                  <a href="tel:+19738688425" className="font-medium text-primary-700 hover:text-primary-800">
                    (973) 868-8425
                  </a>
                </div>
              </Card>

              <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Your question or message..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="md" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>

                  {submitStatus === 'success' && (
                    <p className="text-sm text-green-700" role="status">
                      Thank you. {article.author.name} will be in touch shortly.
                    </p>
                  )}
                  {submitStatus === 'error' && (
                    <p className="text-sm text-red-700" role="alert">
                      Sorry, that didn&apos;t go through. Please try again or email {article.author.email}.
                    </p>
                  )}
                </form>
              </Card>
            </div>
          </div>
        </section>

        {/* 2. Newsletter */}
        <NewsletterSignup compact />

        {/* 3. Three related Market Notes */}
        {related.length > 0 && (
          <section className="py-12 sm:py-16">
            <div className="max-w-6xl mx-auto container-padding">
              <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">
                More Market Notes
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((note) => (
                  <article key={note.slug} className="flex flex-col overflow-hidden rounded-xl border border-gray-200">
                    <button
                      onClick={() => navigate(`/blog/${note.slug}`)}
                      className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-primary-500"
                      aria-label={note.title}
                    >
                      <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                        {note.featuredImage && (
                          <img
                            src={note.featuredImage}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                      </div>
                    </button>
                    <div className="flex flex-1 flex-col p-5">
                      {categoryFor(note) && (
                        <div className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                          {categoryFor(note).label}
                        </div>
                      )}
                      <h3
                        className="mt-2 cursor-pointer text-lg font-semibold leading-snug text-gray-900 hover:text-primary-700"
                        onClick={() => navigate(`/blog/${note.slug}`)}
                      >
                        {note.title}
                      </h3>
                      <time dateTime={note.publishedAt} className="mt-2 text-sm text-gray-500">
                        {formatNoteDate(note.publishedAt)}
                      </time>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default BlogArticle;
