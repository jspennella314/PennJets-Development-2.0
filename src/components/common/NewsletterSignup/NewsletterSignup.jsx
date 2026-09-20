import React, { useState } from 'react';
import Button from '../Button/Button';

const NEWSLETTER_API = 'https://www.pennforce.pennjets.com/api/public/newsletter/subscribe';

// The email subscribe product. Same endpoint and behavior as the form on the
// Market Notes index; extracted so the article template can reuse it.
const NewsletterSignup = ({ compact = false }) => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return; // bot filled the hidden field
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
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        setSubmitStatus({ type: 'success', message: 'Thank you for subscribing!' });
        setEmail('');
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Subscription failed. Please try again.' });
      }
    } catch (err) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`bg-primary-600 text-white ${compact ? 'py-12' : 'section-padding'}`}>
      <div className="max-w-7xl mx-auto container-padding text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold mb-3`}>Newsletter</h2>
          <p className="text-primary-100 mb-6">
            Market notes and aircraft insights, delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
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
              <label className="sr-only" htmlFor="newsletter-email">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-300 focus:outline-none disabled:opacity-50"
                required
              />
              <Button type="submit" variant="secondary" size="md" className="px-6" disabled={isSubmitting}>
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
            {submitStatus.message && (
              <p className={`text-sm mt-3 ${submitStatus.type === 'success' ? 'text-green-200' : 'text-red-200'}`} role="status">
                {submitStatus.message}
              </p>
            )}
          </form>
          <p className="text-xs text-primary-200 mt-4">No spam, unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
