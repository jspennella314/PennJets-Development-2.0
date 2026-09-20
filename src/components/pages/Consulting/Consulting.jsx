import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { blogApi } from '../../../services/blogApi';

const inputClass =
  'mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900';

const Consulting = () => {
  const [searchParams] = useSearchParams();
  // A Market Note can link here with ?note=<slug>; the slug is sent as
  // blogPostSlug so the CRM attributes the lead to that note.
  const noteSlug = searchParams.get('note') || undefined;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [need, setNeed] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const canSubmit = useMemo(() => name && email && need && !isSubmitting, [name, email, need, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    const message = ['Consulting enquiry', need].join('\n');
    try {
      await blogApi.submitLead({ name, email, phone, service: 'consulting', message, blogPostSlug: noteSlug });
      setStatus('success');
      setName(''); setEmail(''); setPhone(''); setNeed('');
    } catch (err) {
      console.error('Consulting inquiry submission failed:', err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white pt-36 pb-16 sm:pt-40">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Aviation Consulting</h1>
          <p className="mt-3 text-gray-600">
            Cost of ownership, mission fit, ownership structure, or a second opinion
            on a deal in front of you. Tell us what you need help with.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <form onSubmit={handleSubmit} className="rounded-2xl border p-6 shadow-sm lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">Name *</span>
                <input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputClass} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Email *</span>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputClass} />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Phone</span>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputClass} />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">What do you need help with? *</span>
                <textarea
                  required
                  rows={6}
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  placeholder="The more detail the better: the aircraft or category, the decision in front of you, and your timeline."
                  className={inputClass}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500">By submitting, you agree to be contacted by PennJets about this request.</p>
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white enabled:hover:bg-black disabled:opacity-40"
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>

            {status === 'success' && (
              <p className="mt-3 text-sm text-green-700" role="status">
                Thanks. Your request is in. We&apos;ll follow up shortly.
              </p>
            )}
            {status === 'error' && (
              <p className="mt-3 text-sm text-red-700" role="alert">
                Sorry, that didn&apos;t go through. Please try again or call (954) 546-0763.
              </p>
            )}
          </form>

          <aside className="rounded-2xl border p-6 shadow-sm">
            <h2 className="text-base font-semibold">What we advise on</h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>Aircraft selection and mission fit</li>
              <li>Cost of ownership and budget modelling</li>
              <li>Ownership structure options, sole or fractional</li>
              <li>A second opinion on a deal already in front of you</li>
            </ul>
            <p className="mt-4 text-xs text-gray-500">
              We work alongside your own tax and legal advisors rather than in place of them.
            </p>
            <Link to="/contact" className="mt-4 inline-block text-sm font-medium underline">Prefer to talk? Contact us</Link>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Consulting;
