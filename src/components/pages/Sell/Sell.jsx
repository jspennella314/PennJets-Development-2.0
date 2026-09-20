import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { blogApi } from '../../../services/blogApi';
import MoreFields from '../../common/MoreFields/MoreFields';

const inputClass =
  'mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900';

const Sell = () => {
  const [searchParams] = useSearchParams();
  // A Market Note can link here with ?note=<slug>; the slug is sent as
  // blogPostSlug so the CRM attributes the lead to that note.
  const noteSlug = searchParams.get('note') || undefined;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [totalTime, setTotalTime] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const canSubmit = useMemo(() => name && email && !isSubmitting, [name, email, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    // Structured fields packed into `message` as labeled lines; payload unchanged.
    const message = [
      'Aircraft for sale',
      `Make: ${make || 'not specified'}`,
      `Model: ${model || 'not specified'}`,
      `Year: ${year || 'not specified'}`,
      `Total time: ${totalTime || 'not specified'}`,
      `Location: ${location || 'not specified'}`,
    ].join('\n');
    try {
      await blogApi.submitLead({ name, email, phone, service: 'sell', message, blogPostSlug: noteSlug });
      setStatus('success');
      setName(''); setEmail(''); setPhone(''); setMake(''); setModel('');
      setYear(''); setTotalTime(''); setLocation('');
    } catch (err) {
      console.error('Sell inquiry submission failed:', err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white pt-36 pb-16 sm:pt-40">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Sell Your Aircraft</h1>
          <p className="mt-3 text-gray-600">
            Tell us what you have and we&apos;ll come back with where it sits in the
            current market and what a realistic timeline looks like.
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
              <label className="block">
                <span className="text-sm font-medium">Make</span>
                <input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Beechcraft" className={inputClass} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Model</span>
                <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Premier 1A" className={inputClass} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Year</span>
                <input type="number" min={1950} max={2100} value={year} onChange={(e) => setYear(e.target.value)} placeholder="2006" className={inputClass} />
              </label>
              <MoreFields summary="Add phone, total time and location">
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium">Phone</span>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputClass} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Total time</span>
                  <input value={totalTime} onChange={(e) => setTotalTime(e.target.value)} placeholder="4,200 hours" className={inputClass} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium">Location</span>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Fort Lauderdale, FL" className={inputClass} />
                </label>
              </MoreFields>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500">By submitting, you agree to be contacted by PennJets about this aircraft.</p>
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white enabled:hover:bg-black disabled:opacity-40"
              >
                {isSubmitting ? 'Sending...' : 'Send Details'}
              </button>
            </div>

            {status === 'success' && (
              <p className="mt-3 text-sm text-green-700" role="status">
                Thanks. Your details are in. We&apos;ll follow up shortly.
              </p>
            )}
            {status === 'error' && (
              <p className="mt-3 text-sm text-red-700" role="alert">
                Sorry, that didn&apos;t go through. Please try again or call (954) 546-0763.
              </p>
            )}
          </form>

          <aside className="rounded-2xl border p-6 shadow-sm">
            <h2 className="text-base font-semibold">How selling with PennJets works</h2>
            <ol className="mt-4 space-y-3 text-sm text-gray-700">
              <li className="flex gap-3"><span className="font-semibold">1.</span><span>We review the aircraft, its logs and its position in the current market.</span></li>
              <li className="flex gap-3"><span className="font-semibold">2.</span><span>We agree an asking price and a plan, and take it to buyers.</span></li>
              <li className="flex gap-3"><span className="font-semibold">3.</span><span>We manage the offer, inspection and closing with you.</span></li>
            </ol>
            <Link to="/contact" className="mt-4 inline-block text-sm font-medium underline">Prefer to talk? Contact us</Link>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Sell;
