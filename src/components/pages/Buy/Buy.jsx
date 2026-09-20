import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { blogApi } from '../../../services/blogApi';
import MoreFields from '../../common/MoreFields/MoreFields';

const inputClass =
  'mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900';

const TRIP_LENGTHS = [
  { value: '', label: 'Select' },
  { value: 'Under 1 hour', label: 'Under 1 hour' },
  { value: '1 to 2 hours', label: '1 to 2 hours' },
  { value: '2 to 4 hours', label: '2 to 4 hours' },
  { value: 'Over 4 hours', label: 'Over 4 hours' },
];

const TIMELINES = [
  { value: '', label: 'Select' },
  { value: 'Within 3 months', label: 'Within 3 months' },
  { value: '3 to 6 months', label: '3 to 6 months' },
  { value: '6 to 12 months', label: '6 to 12 months' },
  { value: 'Exploring', label: 'Just exploring' },
];

const Buy = () => {
  const [searchParams] = useSearchParams();
  const prefilledModel = searchParams.get('model') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ownership, setOwnership] = useState('Sole');
  const [aircraft, setAircraft] = useState(prefilledModel);
  const [pax, setPax] = useState('');
  const [tripLength, setTripLength] = useState('');
  const [timeline, setTimeline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const canSubmit = useMemo(() => name && email && !isSubmitting, [name, email, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    // Structured fields packed into `message` as labeled lines; payload unchanged.
    const message = [
      'Aircraft purchase inquiry',
      `Ownership: ${ownership}`,
      `Aircraft or category of interest: ${aircraft || 'not specified'}`,
      `Typical passengers: ${pax || 'not specified'}`,
      `Typical trip length: ${tripLength || 'not specified'}`,
      `Timeline: ${timeline || 'not specified'}`,
    ].join('\n');
    try {
      await blogApi.submitLead({ name, email, phone, service: 'buy', message });
      setStatus('success');
      setName(''); setEmail(''); setPhone(''); setOwnership('Sole');
      setAircraft(''); setPax(''); setTripLength(''); setTimeline('');
    } catch (err) {
      console.error('Buy inquiry submission failed:', err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white pt-36 pb-16 sm:pt-40">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mb-8 max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Buy an Aircraft</h1>
            <p className="mt-3 text-gray-600">
              We source aircraft that aren't publicly listed. Tell us the mission and we'll tell you what's available.
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
                <fieldset className="sm:col-span-2">
                  <legend className="text-sm font-medium">Ownership</legend>
                  <div className="mt-2 flex flex-wrap gap-4">
                    {['Sole', 'Fractional'].map((opt) => (
                      <label key={opt} className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="ownership"
                          value={opt}
                          checked={ownership === opt}
                          onChange={() => setOwnership(opt)}
                          className="h-4 w-4"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium">Aircraft or category of interest</span>
                  <input value={aircraft} onChange={(e) => setAircraft(e.target.value)} placeholder="e.g. Hawker 400XP, or light jet" className={inputClass} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium">Timeline</span>
                  <select value={timeline} onChange={(e) => setTimeline(e.target.value)} className={inputClass}>
                    {TIMELINES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </label>

                <MoreFields summary="Add phone, passengers and trip length">
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-medium">Phone</span>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Typical passengers</span>
                    <input type="number" min={1} max={19} value={pax} onChange={(e) => setPax(e.target.value)} className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Typical trip length</span>
                    <select value={tripLength} onChange={(e) => setTripLength(e.target.value)} className={inputClass}>
                      {TRIP_LENGTHS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </label>
                </MoreFields>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">By submitting, you agree to be contacted by PennJets about this request.</p>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white enabled:hover:bg-black disabled:opacity-40"
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </div>

              {status === 'success' && (
                <p className="mt-3 text-sm text-green-700" role="status">
                  Thanks. Your inquiry is in. We'll follow up shortly.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-3 text-sm text-red-700" role="alert">
                  Sorry, that didn't go through. Please try again or call (973) 868‑8425.
                </p>
              )}
            </form>

            <aside className="rounded-2xl border p-6 shadow-sm">
              <h2 className="text-base font-semibold">How buying with PennJets works</h2>
              <ol className="mt-4 space-y-3 text-sm text-gray-700">
                <li className="flex gap-3"><span className="font-semibold">1.</span><span>We talk through the mission: passengers, trips, budget, and timeline.</span></li>
                <li className="flex gap-3"><span className="font-semibold">2.</span><span>We identify aircraft that fit, including ones that aren't publicly listed.</span></li>
                <li className="flex gap-3"><span className="font-semibold">3.</span><span>We manage the offer, inspection, and closing with you.</span></li>
              </ol>
              <p className="mt-4 text-xs text-gray-500">Representative aircraft types. Availability on request.</p>
              <Link to="/contact" className="mt-4 inline-block text-sm font-medium underline">Prefer to talk? Contact us</Link>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default Buy;
